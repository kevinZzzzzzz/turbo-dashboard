import React, { useState, useEffect, memo } from "react";
import styles from "./index.module.scss";
function BoxComp(props: any) {
  const { title, subTitle, icon } = props;
  return (
    <div className={styles.BoxComp}>
      <div className={styles.BoxComp_header}>
        <div className={styles.BoxComp_header_line}>
          <div className={styles.BoxComp_header_line_left}>
            <span className={icon}></span>
            {title}
          </div>
          <small>{subTitle}</small>
        </div>
      </div>
      <div className={styles.BoxComp_main}>{props.children}</div>
    </div>
  );
}
export default memo(BoxComp);
