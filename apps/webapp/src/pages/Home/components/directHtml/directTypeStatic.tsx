import BoxComp from "@/components/BoxComp";
import React, { useState, useEffect, memo } from "react";
import styles from "./index.module.scss";
const ctxList = [
  {
    icon: "type-per-icon",
    title: "本人用血",
    list: [
      {
        key: "per-people",
        color: "#02f2db",
        unit: "人次",
      },
      {
        key: "per-money",
        color: "#f69a20",
        unit: "元",
      },
    ],
  },
  {
    icon: "type-rel-icon",
    title: "亲属用血",
    list: [
      {
        key: "rel-people",
        color: "#02b5ff",
        unit: "人次",
      },
      {
        key: "rel-money",
        color: "#f69a20",
        unit: "元",
      },
    ],
  },
];
function DirectTypeStatic(props: any) {
  const { relationNumData } = props;
  return (
    <div className={styles.directType}>
      <BoxComp title="直免类型统计" subTitle="近一个月" icon="box1-icon">
        <div className={styles.directType_main}>
          {ctxList?.map((d, i) => {
            return (
              <div key={i} className={styles.directType_main_item}>
                <div className={styles.directType_main_item_icon}>
                  <span className={d.icon}></span>
                </div>
                <div className={styles.directType_main_item_info}>
                  <h2>{d.title}</h2>
                  <div className={styles.directType_main_item_info_list}>
                    {d.list?.map((e, idx) => {
                      return (
                        <p key={idx} style={{ color: e.color }}>
                          {relationNumData[e.key] || 0}
                          <sub>{e.unit}</sub>
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </BoxComp>
    </div>
  );
}
export default memo(DirectTypeStatic);
