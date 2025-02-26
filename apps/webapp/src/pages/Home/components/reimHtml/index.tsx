import React, { useState, useEffect, memo } from "react";
import styles from "./index.module.scss";
import lengendImg from "@/assets/images/reim/lengend.png";
import Map from "./map/index";
import RealTimeMonitoring from "./realTimeMonitoring/index";
import NoticeReimbursement from "./noticeReimbursement/index";
import { areaMap } from "@/constant/area";

const Reim = () => {
  const [notificationPos, setNotificationPos] = useState({});

  useEffect(() => {
    const area = sessionStorage.getItem("area");
    setNotificationPos(areaMap[area]["notificationPos"]);
  }, []);

  return (
    <div className={styles.reim_wrap}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.page_title}>本地报销与异地报销监控</div>
          <Map></Map>
          <div className={styles.caption} style={notificationPos}>
            <div className={styles.lengend}>
              <img src={lengendImg} />
            </div>
            <div className={styles.scroll_outWrap}>
              <NoticeReimbursement></NoticeReimbursement>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <RealTimeMonitoring></RealTimeMonitoring>
        </div>
      </div>
    </div>
  );
};

export default Reim;
