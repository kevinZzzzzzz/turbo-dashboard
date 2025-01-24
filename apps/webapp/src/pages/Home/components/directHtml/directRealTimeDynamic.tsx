import BoxComp from "@/components/BoxComp";
import { funcUtil } from "@/utils";
import moment from "moment";
import React, { useState, useEffect, useRef, memo } from "react";
import styles from "./index.module.scss";

let timeRef = null;
const time = 10000;
function DirectRealTimeDynamic(props: any) {
  const {
    loadType,
    dispatchEvents,
    facilityInfo,
    getRealFacilityCode,
    getFacilityValue,
  } = props;
  const [logList, setLogList] = useState([]);
  const recordRef = useRef(null);
  useEffect(() => {
    initData();
  }, [dispatchEvents]);
  useEffect(() => {
    timeRef = setInterval(() => {
      transPosition();
    }, time);
    return () => {
      clearTimeout(timeRef);
    };
  }, []);

  const transPosition = () => {
    if (!recordRef.current.childNodes.length) return false;
    const lastChild =
      recordRef.current.childNodes[recordRef.current.childNodes.length - 1];
    recordRef.current.prepend(lastChild);
  };
  const initData = () => {
    let logTemp = [];
    // 过滤掉不需要的数据
    dispatchEvents.forEach(function (elem) {
      // 机构码必须存在
      if (facilityInfo.hasOwnProperty(elem.applyFacility)) {
        // 限制医院机构提交的事件，血站报销的事件暂不显示
        if (facilityInfo[elem.applyFacility].type === "HOS") {
          elem.cityName = facilityInfo[elem.applyFacility].cityName;
          elem.name = facilityInfo[elem.applyFacility].name;
          elem.time = moment(elem.time).format("YYYY-MM-DD");
          logTemp.push(elem);
        }
      } else {
        console.log("Apply facility Info not Found:" + elem.applyFacility);
      }
    });
    logTemp.forEach((n, i) => {
      n.facility = getRealFacilityCode(n.applyFacility); // 兼容中心血站为7位机构码
      //本地报销
      if (
        n.applyFacility.indexOf(n.reimFacility) >= 0 ||
        n.applyFacility === n.reimFacility
      ) {
        n.label = "regular";
        n.desc =
          getFacilityValue(n.applyFacility, "name") +
          "提交" +
          '金额为<span class="money">' +
          n.reimAmount +
          "元</span>，类型为" +
          n.reimType +
          "的本地报销登记。";
      } else {
        n.label = "success";
        // 多地报销
        if (n.reimFacility.indexOf(",") > 0) {
          var reimFacilitys = n.reimFacility.split(",");
          var reimFacilitys_t = "";
          var reimFacilityWithLocal = false;
          for (var j = 0; j < reimFacilitys.length; j++) {
            // 多地报销含本地
            if (reimFacilitys[j] === n.facility) {
              reimFacilityWithLocal = true;
            }
            // 多地报销不含本地
            else {
              if (j === 0) {
                reimFacilitys_t = getFacilityValue(reimFacilitys[j], "name");
              } else {
                reimFacilitys_t =
                  reimFacilitys_t +
                  "," +
                  getFacilityValue(reimFacilitys[j], "name");
              }
            }
          }
          n.desc =
            getFacilityValue(n.applyFacility, "name") +
            "为" +
            reimFacilitys_t +
            "代办了金额为" +
            n.reimAmount +
            "元，类型为" +
            n.reimType +
            "的多个异地机构直免" +
            (reimFacilityWithLocal ? "(含本地)" : "") +
            "。";
        }
        // 代办
        else {
          n.desc =
            getFacilityValue(n.applyFacility, "name") +
            "为" +
            getFacilityValue(n.reimFacility, "name") +
            "代办了金额为" +
            n.reimAmount +
            "元，类型为" +
            n.reimType +
            "的异地直免。";
        }
      }
    });
    setLogList(logTemp);
  };
  return (
    <div className={styles.DirectRealTimeDynamic}>
      <BoxComp
        title={
          <div className={styles.DirectRealTimeDynamic_title}>
            {`${loadType}用血减免实时动态`}
            <div className={styles.DirectRealTimeDynamic_title_num}>
              {logList?.length || 0}
            </div>
          </div>
        }
        subTitle="近三天"
        icon="box6-icon"
      >
        <div className={styles.DirectRealTimeDynamic_list} ref={recordRef}>
          {logList.length ? (
            logList?.map((d, i) => {
              return (
                <div className={styles.DirectRealTimeDynamic_list_item} key={i}>
                  <EventItem info={d} />
                </div>
              );
            })
          ) : (
            <p className={styles["DirectRealTimeDynamic_list-empty"]}>
              暂无数据
            </p>
          )}
        </div>
      </BoxComp>
    </div>
  );
}
export default memo(DirectRealTimeDynamic);

const EventItem = (props: any) => {
  const { info } = props;
  return (
    <div className={styles.DirectRealTimeDynamic_eventItem}>
      <div className={styles.DirectRealTimeDynamic_eventItem_header}>
        <span>{info.name}</span>
        <span>{info.time}</span>
      </div>
      <p
        className={styles.DirectRealTimeDynamic_eventItem_ctx}
        dangerouslySetInnerHTML={{ __html: info.desc }}
      ></p>
    </div>
  );
};
