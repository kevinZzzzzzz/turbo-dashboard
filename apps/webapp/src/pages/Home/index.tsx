import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import DisHtml from "./components/disHtml";
function HomePage(props: any) {
  const [switcherNum, setSwitcherNum] = useState(1);
  const BlockComp = memo(() => {
    const componentMap = {
      1: DisHtml,
    };
    const Component = componentMap[switcherNum];
    return Component ? <Component /> : null;
  });

  return (
    <div className={styles.pageBody}>
      <BlockComp />
    </div>
  );
}
export default HomePage;
