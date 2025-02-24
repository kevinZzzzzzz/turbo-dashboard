import { useRef, useEffect } from "react";
import * as echarts from "echarts";
import styles from "./index.module.scss";
import UseFacility from "@/hooks/useFacility";
import moment from "moment";
import { formatNum, getTheMoment } from "@/utils";
import { funcUtil } from "@/utils/time";

const RealTimeMonitoring = () => {
  const today = getTheMoment();
  const { facilityInfo, getRealFacilityCode, getFacilityName } = UseFacility();
  const [recordList, setRecordList] = useState([]);
  const oldRecordListLength = useRef(0);

  const initData = () => {
    window.$api
      .getEventsHrd({
        startTime:
          moment(today).subtract(2, "day").format("YYYY-MM-DD") +
          " " +
          moment(today).format("HH:mm:ss"),
        endTime: moment(today).format("YYYY-MM-DD HH:mm:ss"),
      })
      .then((resp) => {
        if (resp.length <= oldRecordListLength.current) {
          return;
        }
        let logs = [];

        resp.forEach((d, i) => {
          d.facility = getRealFacilityCode(d.facility);
          if (facilityInfo.current.hasOwnProperty(d.facility)) {
            d.cityName = facilityInfo.current[d.facility]?.cityName;
            d.name = facilityInfo.current[d.facility]?.name;
            logs.push(d);
          }
        });

        const dispatchEvents = [];

        logs = logs.sort(function (a, b) {
          if (a.time < b.time) return 1;
          if (a.time > b.time) return -1;
          return 0;
        });

        //Ajax 返回数据需要自己写
        for (const i in logs) {
          const n = logs[i];

          switch (n.eventType) {
            case "屏蔽数据上报":
              if (n.dataStatus == "成功") {
                n.desc =
                  n.dataAmount > 0
                    ? getFacilityName(n.facility) +
                      n.dataStatus +
                      "上传了" +
                      n.dataAmount +
                      "条屏蔽数据。"
                    : getFacilityName(n.facility) + "成功进行屏蔽数据上传。";
                n.label = "success";
              } else {
                n.desc =
                  getFacilityName(n.facility) +
                  "屏蔽数据上传至平台失败，等待重新上传。";
                n.label = "warning";
              }
              break;
            case "黑名单阻止":
              n.desc =
                getFacilityName(n.facility) +
                "通过全省屏蔽数据，在献血者筛查中成功阻止一例高危献血者献血";
              n.label = "danger";
              break;
            case "间隔期查询":
              n.desc =
                (n.facility != null ? getFacilityName(n.facility) : "") +
                "通过全省间隔期查询，成功阻止一例献血者间隔期内献血";
              n.label = "warning";
              break;
            case "联网状态":
              if (n.dataStatus == "正常") {
                n.desc = getFacilityName(n.facility) + "联网状态正常";
                n.label = "regular";
              } else {
                n.desc =
                  getFacilityName(n.facility) +
                  "联网状态，于" +
                  n.time +
                  "出现异常";
                n.label = "warning";
              }
              break;
            default:
              n.desc = "";
          }

          n.cutTime = funcUtil.formatDate(
            new Date(n.time.replace(/-/g, "/")),
            "yyyy-MM-dd hh:mm",
          );
          dispatchEvents.push(n);
        }
        console.log(dispatchEvents, 666);

        oldRecordListLength.current = dispatchEvents.length;
        setRecordList(dispatchEvents);
      });
  };

  useEffect(() => {
    initData();
    // setInterval(() => {
    //   initData();
    // }, 10000);
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
            <div className={styles.news_item} key={i}>
              <div className={styles.item_wrap}>
                <div className={styles.log_title}>
                  <p>
                    <span>
                      {d.cityName}
                      {d.eventType}
                    </span>
                    <span className={styles[d.label]}>
                      {d.label === "warning" ? "警告" : ""}
                      {d.label !== "success" &&
                      d.label !== "regular" &&
                      d.label !== "warning"
                        ? "异常"
                        : ""}
                    </span>
                  </p>
                  <span className={styles.time}>{d.cutTime}</span>
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
