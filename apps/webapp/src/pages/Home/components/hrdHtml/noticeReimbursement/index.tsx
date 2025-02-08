import { useRef, useEffect } from "react";
import * as echarts from "echarts";
import styles from "./index.module.scss";
import moment from "moment";
import "@/assets/lib/marquee";
import iconAction from "@/assets/images/icon_action.png";

const NoticeReimbursement = ({ noticeData }) => {
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    setInterval(() => {
      setEndTime(moment(new Date()).format("HH:mm:ss"));
    }, 10000);
  }, []);

  return (
    <marquee direction="up" scrolldelay="200">
      <div className={styles.notice_reimbursement}>
        {noticeData.donors || noticeData.shield ? (
          <>
            <p className={styles.top}>
              <img src={iconAction} className={styles.icon_action} alt="" />{" "}
              <span>截止当前{endTime}止：</span>
              <span className={styles.already_received}>48小时内</span>
            </p>
            <p className={styles.data_item}>
              献血者累计{noticeData.donors}人次；屏蔽{noticeData.shield}人次；
            </p>
          </>
        ) : (
          <></>
        )}
      </div>
    </marquee>
  );
};

export default NoticeReimbursement;
