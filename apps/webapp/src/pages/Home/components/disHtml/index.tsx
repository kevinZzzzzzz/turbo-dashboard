import React, { useState, useEffect, memo } from "react";
import styles from "./index.module.scss";
function DisPage(props: any) {
  return (
    <div className={styles.page}>
      <div className={styles.pageLeft}>
        <h2 className={styles.pageLeft_title}>血液库存与调剂监控</h2>
      </div>
      <div className={styles.page}></div>
    </div>
  );
}
export default memo(DisPage);
