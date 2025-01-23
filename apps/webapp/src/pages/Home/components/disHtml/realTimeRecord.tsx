import UseFacility from "@/hooks/useFacility";
import { funcUtil } from "@/utils";
import React, { useState, useEffect, useRef, memo } from "react";
import styles from "./index.module.scss";

//获取数据期限
const getDay = 14;
let timeRef = null;
const time = 10000;
function RealTimeRecord(props: any) {
  const [recordAllList, setRecordAllList] = useState([]);
  const recordRef = useRef(null);
  const { facilityInfo, getFacilityName } = props;
  useEffect(() => {
    getEventData();
    timeRef = setInterval(() => {
      transPosition();
    }, time);
    return () => {
      clearTimeout(timeRef);
    };
  }, []);

  const getEventData = () => {
    let recordAllListT = [];
    window.$api.getEventsList(getDay).then((res: any) => {
      res.forEach((d) => {
        if (facilityInfo.current.hasOwnProperty(d.facility)) {
          d.cityName = facilityInfo.current[d.facility].cityName;
          d.name = facilityInfo.current[d.facility].name;
        } else if (
          facilityInfo.current.hasOwnProperty(d.facility.substring(0, 5))
        ) {
          d.cityName =
            facilityInfo.current[d.facility.substring(0, 5)].cityName;
          d.name = facilityInfo.current[d.facility.substring(0, 5)].name;
        }
        recordAllListT.push(d);
      });
      setRecordAllList(recordAllListT);
      handleEventData(recordAllListT);
    });
  };
  const handleEventData = (list) => {
    list.forEach((n) => {
      if (n.dispatchType == 3) {
        // 临床紧急用血
        n.label = "danger"; //这里暂时定义为紧急
      } else if (n.eventType == "调剂申请") {
        n.label = "warning"; //这里暂时定义为警告
      } else {
        n.label = "success";
      }
      switch (n.eventType) {
        case "调剂申请":
          n.desc =
            getFacilityName(n.facility) +
            "向" +
            getFacilityName(n.otherFacility) +
            "提交了的" +
            n.bloodType +
            " 血型" +
            n.bloodGroup +
            " " +
            n.amount +
            "的调剂申请，等待对方机构审核。";
          break;
        case "血站审核":
          n.desc =
            getFacilityName(n.facility) +
            "审核通过了" +
            getFacilityName(n.otherFacility) +
            "提交了的" +
            n.bloodType +
            " 血型" +
            n.bloodGroup +
            " " +
            n.amount +
            "的调剂申请。";
          break;
        case "审批":
          n.desc =
            getFacilityName(n.facility) +
            "审批了" +
            getFacilityName(n.otherFacility) +
            "提交了的" +
            n.bloodType +
            " 血型" +
            n.bloodGroup +
            " " +
            n.amount +
            "的调剂申请。";
          break;
        case "出库确认":
          n.desc =
            getFacilityName(n.facility) +
            "进行了出库确认，" +
            n.amount +
            " 血型" +
            n.bloodGroup +
            "的" +
            n.bloodType +
            "已经出库，正准备发往" +
            getFacilityName(n.otherFacility) +
            "。";
          break;
        case "入库确认":
          n.desc =
            getFacilityName(n.facility) +
            "已经接收了从" +
            getFacilityName(n.otherFacility) +
            "调剂的" +
            n.bloodType +
            " 血型" +
            n.bloodGroup +
            " " +
            n.amount +
            "的血液。";
          break;
        default:
          n.desc = "";
      }
      n.cutTime = funcUtil.formatDate(
        new Date(n.time.replace(/-/g, "/")),
        "yyyy-MM-dd hh:mm",
      );
    });
  };
  const transPosition = () => {
    if (!recordRef.current.childNodes.length) return false;
    const lastChild =
      recordRef.current.childNodes[recordRef.current.childNodes.length - 1];
    recordRef.current.prepend(lastChild);
    // setRecordAllList((pre) => {
    //   const lastItem = pre[pre.length - 1];
    //   const newItems = [lastItem, ...pre.slice(0, -1)];
    //   return newItems;
    // });
  };

  //通过机构标号获取名称
  // function getFacilityName(facility) {
  //   if (facilityInfo.current.hasOwnProperty(facility)) {
  //     return facilityInfo.current[facility].name;
  //   } else if (facilityInfo.current.hasOwnProperty(facility.substring(0, 5))) {
  //     return facilityInfo.current[facility.substring(0, 5)].name;
  //   } else {
  //     return "";
  //   }
  // }

  return (
    <div className={styles.realTime}>
      <div className={styles.realTime_header}>
        <b className={styles.realTime_header_title}>实时监控记录</b>
        <p className={styles.realTime_header_num}>{recordAllList.length}</p>
      </div>
      <div className={styles.realTime_main} ref={recordRef}>
        {recordAllList.length
          ? recordAllList?.map((d, i) => {
              return (
                <div className={styles.realTime_main_item} key={i}>
                  <EventItem info={d} />
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

const EventItem = (props: any) => {
  const { info } = props;
  return (
    <div className={styles.eventItem}>
      <div className={styles.eventItem_header}>
        <div className={styles.eventItem_header_left}>
          <p>
            {info?.cityName}-{info?.eventType}
          </p>
          {info?.label == "danger" ? (
            <span>紧急</span>
          ) : info?.label == "warning" ? (
            <span>重要</span>
          ) : null}
        </div>
        <div className={styles.eventItem_header_right}>{info?.cutTime}</div>
      </div>
      <p className={styles.eventItem_main}>{info?.desc}</p>
    </div>
  );
};

export default memo(RealTimeRecord);
