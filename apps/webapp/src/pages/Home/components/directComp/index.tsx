import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";

function DirectComp(props: any) {
  return (
    <div className={styles.page}>
      <h1>123</h1>
    </div>
  );
}
export default memo(DirectComp);
