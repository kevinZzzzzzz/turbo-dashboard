import { funcUtil } from "@/utils";
import React, { useState, useEffect, memo } from "react";
import styles from "./index.module.scss";
import "@/assets/lib/marquee";
const getDay = 14;
const endTime = funcUtil.formatDate(new Date(), "hh:mm:ss");
function StatisComp(props: any) {
  const [statisList, setStatisList] = useState([]);
  useEffect(() => {
    getStatisData();
  }, []);
  const getStatisData = () => {
    window.$api.getStatisticsByBloodSubtype(getDay).then((res: any) => {
      let temp = [];
      if (res.length > 0) {
        for (var i = 0; i < res.length; i++) {
          if (temp.length > 0) {
            var flag = false;
            for (var j = 0; j < temp.length; j++) {
              if (temp[j].subType === res[i].subType) {
                temp[j].amount = temp[j].amount + res[i].amount;
                temp[j].amount1 = temp[j].amount1 + res[i].amount1;
                temp[j].amount2 = temp[j].amount2 + res[i].amount2;
                temp[j].amount3 = temp[j].amount3 + res[i].amount3;
                temp[j].amount4 = temp[j].amount4 + res[i].amount4;
                flag = true;
              }
            }
            if (!flag) {
              temp.push(res[i]);
            }
          } else {
            temp.push(res[i]);
          }
        }
        setStatisList(temp);
      }
    });
  };
  return statisList.length ? (
    // @ts-ignore
    <marquee direction="up" scrolldelay="200">
      <div className={styles.statisComp}>
        {statisList?.map((d, i) => {
          return (
            <div key={i}>
              <div className={styles.statisComp_item}>
                <p>
                  <span className={styles.iconAction}>截止当前{endTime}止</span>
                  {getDay}天内
                </p>
              </div>
              <div className={styles.statisComp_item}>
                {d.amount1 > 0 ? (
                  <p>
                    <span>
                      需求方调剂：{d.subType}
                      {d.amount1}
                      {d.unit}
                    </span>
                  </p>
                ) : d.amount2 > 0 ? (
                  <p>
                    <span>
                      供应方调剂：{d.subType}
                      {d.amount2}
                      {d.unit}
                    </span>
                  </p>
                ) : d.amount3 > 0 ? (
                  <p>
                    <span>
                      临床紧急调剂：{d.subType}
                      {d.amount3}
                      {d.unit}
                    </span>
                  </p>
                ) : d.amount4 > 0 ? (
                  <p>
                    <span>
                      科研调剂：{d.subType}
                      {d.amount4}
                      {d.unit}
                    </span>
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {/*  @ts-ignore */}
    </marquee>
  ) : null;
}
export default memo(StatisComp);
