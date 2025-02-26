import React, { useState, useEffect, memo } from "react";
import styles from "./index.module.scss";
import lengendImg from "@/assets/images/hrd/lengend.png";
import Map from "./map/index";
import RealTimeMonitoring from "./realTimeMonitoring/index";
import NoticeReimbursement from "./noticeReimbursement/index";
import { areaMap } from "@/constant/area";

const Reim = () => {
  const [noticeData, setNoticeData] = useState<any>({});

  const changeNoticeData = (val) => {
    setNoticeData(val);
  };

  const [notificationPos, setNotificationPos] = useState({});

  useEffect(() => {
    const area = sessionStorage.getItem("area");
    setNotificationPos(areaMap[area]["notificationPos"]);
  }, []);

  return (
    <div className={styles.reim_wrap}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.page_title}>献血者分布与屏蔽监控</div>
          <Map changeNoticeData={changeNoticeData}></Map>
          <div className={styles.caption} style={notificationPos}>
            <div className={styles.lengend}>
              <img src={lengendImg} />
            </div>
            <div className={styles.scroll_outWrap}>
              <NoticeReimbursement
                noticeData={noticeData}
              ></NoticeReimbursement>
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
