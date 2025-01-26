import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import DisHtml from "./components/disHtml";
import DirectComp from "./components/directComp";
import ReimComp from "./components/reim";
import { keyCodeMapper } from "@/utils";

const componentMap = {
  1: DirectComp,
  2: DisHtml,
  3: ReimComp,
};

function HomePage(props: any) {
  const [switcherNum, setSwitcherNum] = useState(1);
  const BlockComp = memo((props: any) => {
    const Component = componentMap[props.switcherNum];
    return Component ? <Component /> : null;
  });
  useEffect(() => {
    initKeydown(true);
    return () => {
      initKeydown(false);
    };
  }, []);

  const initKeydown = (flag) => {
    const pageLength = Object.keys(componentMap).length;
    window[flag ? "addEventListener" : "removeEventListener"](
      "keydown",
      (event: any) => {
        event.preventDefault();
        switch (event.keyCode) {
          case keyCodeMapper.btnLeft:
            setSwitcherNum((num) => (num === 1 ? 1 : --num));
            break;
          case keyCodeMapper.btnRight:
            setSwitcherNum((num) => (num === pageLength ? pageLength : ++num));
            break;
          default:
            break;
        }
      },
    );
  };
  return (
    <div className={styles.pageBody}>
      <BlockComp switcherNum={switcherNum} />
    </div>
  );
}
export default HomePage;
