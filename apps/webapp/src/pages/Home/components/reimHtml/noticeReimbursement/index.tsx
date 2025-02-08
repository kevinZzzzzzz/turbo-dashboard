import { useRef, useEffect } from "react";
import * as echarts from "echarts";
import styles from "./index.module.scss";
import UseFacility from "@/hooks/useFacility";
import moment from "moment";
import { formatNum, getTheMoment } from "@/utils";
import "@/assets/lib/marquee";
import iconAction from "@/assets/images/icon_action.png";

const NoticeReimbursement = () => {
  const today = getTheMoment();
  const { facilityInfo, getRealFacilityCode, getFacilityName } = UseFacility();
  const [endTime, setEndTime] = useState("");
  const [data, setData] = useState<any>({});

  const initData = () => {
    window.$api
      .getReimRemoteType({
        startTime:
          moment(today).subtract(1, "day").format("YYYY-MM-DD") + " 23:59:59",
        endTime: moment(today).format("YYYY-MM-DD HH:mm:ss"),
      })
      .then((resp) => {
        if (!resp.localReimAmount) resp.localReimAmount = 0;
        if (!resp.remoteReimAmount) resp.remoteReimAmount = 0;
        setEndTime(moment(new Date()).format("HH:mm:ss"));
        setData(resp);
      });
  };

  useEffect(() => {
    initData();
    setInterval(() => {
      initData();
    }, 10000);
  }, []);

  return (
    <marquee direction="up" scrolldelay="200">
      <div className={styles.notice_reimbursement}>
        {data.localReimAmount || data.remoteReimAmount ? (
          <>
            <p className={styles.top}>
              <img src={iconAction} className={styles.icon_action} alt="" />{" "}
              <span>截止当前{endTime}止：</span>
              <span className={styles.already_received}>已接收</span>
            </p>
            <p className={styles.data_item}>
              本地报销{data.localReimTimes}笔({data.localReimAmount}元)
            </p>
            <p className={styles.data_item}>
              异地报销{data.remoteReimTimes}笔({data.remoteReimAmount}元)
            </p>
            <p className={styles.data_item}>
              累计报销{data.localReimAmount + data.remoteReimAmount}元
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
