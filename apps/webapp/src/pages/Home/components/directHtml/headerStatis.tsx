import { formatNum } from "@/utils";
import React, { useState, useEffect, memo } from "react";
import styles from "./index.module.scss";
function HeaderStatis(props: any) {
  const { loadAreaType1, loadAreaType2, totalData } = props;
  const headerList = [
    {
      title: `${loadAreaType2}直免总人数`,
      unit: "人次",
      icon: "sum1-icon",
      key: "totalNum",
      keyColor: "#02f2db",
    },
    {
      title: `${loadAreaType2}累计直免金额`,
      unit: "元",
      icon: "sum2-icon",
      key: "totalAmount",
      keyColor: "#f69a20",
    },
    {
      title: `今日直免人次`,
      unit: "人次",
      icon: "sum3-icon",
      key: "dayNum",
      keyColor: "#02f2db",
    },
    {
      title: `今日直免金额`,
      unit: "元",
      icon: "sum4-icon",
      key: "dayAmount",
      keyColor: "#f69a20",
    },
    {
      title: `上线机构数量`,
      unit: "家",
      icon: "sum5-icon",
      key: "facilityNum",
      keyColor: "#02f2db",
    },
    {
      title: `覆盖${loadAreaType1}`,
      unit: "个",
      icon: "sum6-icon",
      key: "cityNum",
      keyColor: "#41cdee",
    },
  ];
  return (
    <ul className={styles.headerStatis}>
      {headerList.map((d, i) => {
        return (
          <li key={i} className={styles.headerStatis_item}>
            <p className={styles.headerStatis_item_title}>
              <span className={d.icon}></span>
              <span className={styles.headerStatis_item_title}>{d.title}</span>
            </p>
            <h1
              className={styles.headerStatis_item_num}
              style={{ color: d.keyColor }}
            >
              {totalData[d.key] || 0} <sub>{d.unit}</sub>{" "}
            </h1>
          </li>
        );
      })}
    </ul>
  );
}
export default memo(HeaderStatis);
