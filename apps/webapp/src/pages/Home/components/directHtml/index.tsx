import { formatNum, getTheMoment } from "@/utils";
import React, { useState, useEffect } from "react";
import HeaderStatis from "./headerStatis";
import styles from "./index.module.scss";
import moment from "moment";
import DirectTypeStatic from "./directTypeStatic";
import RelationStatic from "./relationStatic";
import DirectCaseStatic from "./directCaseStatic";
import UseFacility from "@/hooks/useFacility";
import DirectRate from "./directRate";
import DirectMap from "./directMap";
import DirectBloodTrend from "./directBloodTrend";
import DirectRealTimeDynamic from "./directRealTimeDynamic";
import UseReload from "@/hooks/useReload";

let relationChartDataSort = ["本人", "配偶", "父母", "子女", "其他"];
let today = getTheMoment();
let startTime =
  moment(today).subtract(1, "month").format("YYYY-MM-DD") + " 00:00:00";
let endTime = moment(today).format("YYYY-MM-DD") + " 23:59:59";
// 初始化名称
let loadType = "全省";
let loadAreaType1 = "城市";
let loadAreaType2 = "各市";
function directHtml(props: any) {
  const { facilityInfo, getFacilityValue, getRealFacilityCode } = UseFacility();
  const { reloadNum } = UseReload();
  const [totalData, setTotalData] = useState({});
  const [relationNumData, setRelationNumData] = useState({
    "per-people": 0,
    "per-money": 0,
    "rel-people": 0,
    "rel-money": 0,
  });
  const [relationChartData, setRelationChartData] = useState([
    { value: 0, name: "本人" },
    { value: 0, name: "配偶" },
    { value: 0, name: "父母" },
    { value: 0, name: "子女" },
    { value: 0, name: "其他" },
  ]);
  const [directBloodTrendData, setDirectBloodTrendData] = useState([]);
  const [reimbursementChartData, setReimbursementChartData] = useState({});
  const [reimburPerChartData, setReimburPerChartData] = useState([
    { value: 0, name: "医院直免数" },
    { value: 0, name: "血站报销数" },
  ]);
  const [reimburPeMapData, setReimburPerMapData] = useState({});
  const [dispatchEvents, setDispatchEvents] = useState([]);
  useEffect(() => {
    getReimTotalData();
    getReimRelationData();
    getReimFacilityStatisData();
    getReimDayData();
    getReimDetailData();
  }, [reloadNum]);
  // 获取顶部统计数据
  const getReimTotalData = () => {
    window.$api.getReimTotal().then((res: any) => {
      for (let i of Object.keys(res)) {
        res[i] = formatNum(res[i]);
      }
      setTotalData({ ...res });
    });
  };
  // 关系类型汇总
  const getReimRelationData = () => {
    window.$api
      .getReimRelation({
        startTime,
        endTime,
      })
      .then((res: any) => {
        let relationTemp = {
          "per-people": 0,
          "per-money": 0,
          "rel-people": 0,
          "rel-money": 0,
        };
        let relationChartTemp = [
          { value: 0, name: "本人" },
          { value: 0, name: "配偶" },
          { value: 0, name: "父母" },
          { value: 0, name: "子女" },
          { value: 0, name: "其他" },
        ];
        res.forEach((elem, i) => {
          const reimType = elem.relation != "本人" ? "rel" : "per";
          relationTemp[reimType + "-people"] += elem.num;
          relationTemp[reimType + "-money"] += elem.amount;
          let relationChartDataIndex = relationChartDataSort.indexOf(
            elem.relation,
          );
          relationChartDataIndex =
            relationChartDataIndex === -1
              ? relationChartDataSort.length - 1
              : relationChartDataIndex;
          relationChartTemp[relationChartDataIndex]["value"] += elem.amount;
        });
        relationTemp["per-money"] = Math.round(relationTemp["per-money"]);
        relationTemp["rel-money"] = Math.round(relationTemp["rel-money"]);
        for (let i in relationChartTemp) {
          relationChartTemp[i].value = Math.round(relationChartTemp[i].value);
        }
        for (let i of Object.keys(relationTemp)) {
          relationTemp[i] = formatNum(relationTemp[i]);
        }
        setRelationNumData(relationTemp);
        setRelationChartData(relationChartTemp);
      });
  };
  const getReimFacilityStatisData = () => {
    const getReimFacilityStatisApi = window.$api.getReimFacilityStatistics({
      startTime,
      endTime,
    });
    const getOnlineApi = window.$api.getOnline();
    Promise.all([getReimFacilityStatisApi, getOnlineApi]).then((res: any) => {
      const [data1Result = [], data2Result = {}] = res;
      let mapData = {};
      let onlineStatus = {};
      let reimburPerChartTemp = [
        { value: 0, name: "医院直免数" },
        { value: 0, name: "血站报销数" },
      ];
      let reimbursementChartTemp = {};
      for (let i in data2Result) {
        onlineStatus[i] = data2Result[i];
      }
      data1Result.forEach(function (elem) {
        let primaryCityCode = elem.facility.substr(0, 5);
        let city = getFacilityValue(primaryCityCode, "city");
        if (!!city && !reimbursementChartTemp.hasOwnProperty(city)) {
          reimbursementChartTemp[city] = [0, 0];
        }
        if (elem.facilityType != "HOS") {
          //血站
          reimburPerChartTemp[1]["value"] += elem.num;
          if (!!city) {
            reimbursementChartTemp[city][1] += elem.num;
          }
        } else {
          //医院
          reimburPerChartTemp[0]["value"] += elem.num;
          if (!!city) {
            reimbursementChartTemp[city][0] += elem.num;
          }
        }
        if (!mapData.hasOwnProperty(elem.facility)) {
          mapData[elem.facility] = [0, 0]; //金额、人次
        }
        mapData[elem.facility][0] += elem.amount; //金额
        mapData[elem.facility][1] += Number(elem.num); //人次
        if (onlineStatus.hasOwnProperty(elem.facility)) {
          mapData[elem.facility][2] = onlineStatus[elem.facility]; //网络状态
        }
      });
      setReimbursementChartData(reimbursementChartTemp);
      setReimburPerChartData(reimburPerChartTemp);
      for (let j in mapData) {
        mapData[j][0] = Math.round(mapData[j][0]);
      }
      setReimburPerMapData(mapData);
    });
  };
  const getReimDayData = () => {
    window.$api
      .getReimDay({
        startTime,
        endTime,
      })
      .then((res: any) => {
        res && setDirectBloodTrendData(res);
      });
  };
  const getReimDetailData = () => {
    window.$api
      .getReimDetail({
        startTime:
          moment(today).subtract(2, "day").format("YYYY-MM-DD") + " 00:00:00",
        endTime: moment(today).format("YYYY-MM-DD") + " 23:59:59",
      })
      .then((res: any) => {
        setDispatchEvents(res);
      });
  };
  return (
    <div className={styles.page}>
      <div className={styles.page_header}>
        <div className={styles.page_header_title}>
          <h1>医院用血直免监控</h1>
        </div>
        <HeaderStatis
          loadAreaType1={loadAreaType1}
          loadAreaType2={loadAreaType2}
          totalData={totalData}
        />
      </div>
      <div className={styles.page_main}>
        <div className={styles.page_main_left}>
          <DirectTypeStatic relationNumData={relationNumData} />
          <RelationStatic relationChartData={relationChartData} />
          <DirectCaseStatic
            loadAreaType2={loadAreaType2}
            reimbursementChartData={reimbursementChartData}
          />
          <DirectRate
            loadType={loadType}
            reimburPerChartData={reimburPerChartData}
          />
        </div>
        <div className={styles.page_main_center}>
          <DirectMap
            reimburPeMapData={reimburPeMapData}
            facilityInfo={facilityInfo.current}
          />
        </div>
        <div className={styles.page_main_right}>
          <DirectBloodTrend
            loadType={loadType}
            directBloodTrendData={directBloodTrendData}
          />
          <DirectRealTimeDynamic
            loadType={loadType}
            facilityInfo={facilityInfo.current}
            dispatchEvents={dispatchEvents}
            getRealFacilityCode={getRealFacilityCode}
            getFacilityValue={getFacilityValue}
          />
        </div>
      </div>
    </div>
  );
}
export default memo(directHtml);
