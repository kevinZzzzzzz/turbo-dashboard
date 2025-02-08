import { useRef, useEffect } from "react";
import * as echarts from "echarts";
import styles from "./index.module.scss";
import UseFacility from "@/hooks/useFacility";
import moment from "moment";
import { formatNum, getTheMoment } from "@/utils";

const RealTimeMonitoring = () => {
  const today = getTheMoment();
  const { facilityInfo, getRealFacilityCode, getFacilityName } = UseFacility();
  const [recordList, setRecordList] = useState([]);
  const oldRecordListLength = useRef(0);

  const initData = () => {
    window.$api
      .getEventsReim({
        startTime:
          moment(today).subtract(1, "day").format("YYYY-MM-DD") + " 23:59:59",
        endTime: moment(today).format("YYYY-MM-DD HH:mm:ss"),
      })
      .then((resp) => {
        if (resp.length <= oldRecordListLength.current) {
          return;
        }
        const logs = [];
        resp.forEach((d, i) => {
          if (Object.hasOwn(facilityInfo.current, d.facility)) {
            d.cityName = facilityInfo.current[d.facility].cityName;
            d.name = facilityInfo.current[d.facility].name;
          }
          logs.push(d);
        });
        const dispatchEvents = [];

        //Ajax 返回数据需要自己写
        for (const i in logs) {
          const n = logs[i];
          n.facility = getRealFacilityCode(n.facility); // 兼容中心血站为7位机构码
          //本地报销
          if (n.facility === n.reimFacility) {
            n.label = "regular";
            //n.desc = getFacilityName(n.facility)+n.userName+'提交'+'金额为'+n.reimAmount+'元，类型为'+n.reimType+'的本地报销登记。';
            n.desc =
              getFacilityName(n.facility) +
              "提交" +
              "金额为" +
              n.reimAmount +
              "元，类型为" +
              n.reimType +
              "的本地报销登记。";
          } else {
            n.label = "success";
            // 多地报销
            if (n.reimFacility.indexOf(",") > 0) {
              const reimFacilitys = n.reimFacility.split(",");
              let reimFacilitys_t = "";
              let reimFacilityWithLocal = false;
              for (let j = 0; j < reimFacilitys.length; j++) {
                // 多地报销含本地
                if (reimFacilitys[j] === n.facility) {
                  reimFacilityWithLocal = true;
                }
                // 多地报销不含本地
                else {
                  if (j === 0) {
                    reimFacilitys_t = getFacilityName(reimFacilitys[j]);
                  } else {
                    reimFacilitys_t =
                      reimFacilitys_t + "," + getFacilityName(reimFacilitys[j]);
                  }
                }
              }
              n.desc =
                getFacilityName(n.facility) +
                "为" +
                reimFacilitys_t +
                "代办了金额为" +
                n.reimAmount +
                "元，类型为" +
                n.reimType +
                "的多地报销" +
                (reimFacilityWithLocal ? "(含本地)" : "") +
                "。";
            }
            // 代办
            else {
              n.desc =
                getFacilityName(n.facility) +
                "为" +
                getFacilityName(n.reimFacility) +
                "代办了金额为" +
                n.reimAmount +
                "元，类型为" +
                n.reimType +
                "的异地报销。";
            }
          }
          dispatchEvents.push({
            ...n,
            key: Math.random() + "" + Math.random(),
          });
        }
        oldRecordListLength.current = dispatchEvents.length;
        setRecordList(dispatchEvents);
      });
  };

  useEffect(() => {
    initData();
    setInterval(() => {
      initData();
    }, 10000);
  }, []);

  return (
    <div className={styles.real_time_monitoring}>
      <div className={styles.header}>
        <div className={styles.title}>实时监控记录</div>
        <span className={styles.record_number}>{recordList.length}</span>
      </div>
      <div className={styles.record_list}>
        {recordList.length ? (
          recordList.map((d, i) => (
            <div className={styles.news_item} key={d.key}>
              <div className={styles.item_wrap}>
                <div className={styles.log_title}>
                  <p>
                    <span>{d.name}</span>
                    <span className={styles[d.label]}>
                      {d.label === "regular" ? "本地报销" : ""}
                      {d.label === "success" ? "异地报销" : ""}
                    </span>
                  </p>
                  <span className={styles.time}>{d.time}</span>
                </div>
                <div className={styles.log_desc}>{d.desc}</div>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.no_data}>暂无更新</p>
        )}
      </div>
    </div>
  );
};

export default RealTimeMonitoring;
