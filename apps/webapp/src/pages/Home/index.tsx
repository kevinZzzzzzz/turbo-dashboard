import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import DisHtml from "./components/disHtml";
import directHtml from "./components/directHtml";
import { keyCodeMapper } from "@/utils";
function HomePage(props: any) {
  const [switcherNum, setSwitcherNum] = useState(1);
  const BlockComp = memo((props: any) => {
    const componentMap = {
      1: directHtml,
      2: DisHtml,
    };
    const Component = componentMap[props.switcherNum];
    return Component ? <Component /> : null;
  });
  useEffect(() => {
    initKeydown(true);
    initResize(true);
    return () => {
      initKeydown(false);
      initResize(false);
    };
  }, []);

  const initKeydown = (flag) => {
    window[flag ? "addEventListener" : "removeEventListener"](
      "keydown",
      (event: any) => {
        event.preventDefault();
        switch (event.keyCode) {
          case keyCodeMapper.btnLeft:
            setSwitcherNum((pre) => (pre == 1 ? 2 : 1));
            break;
          case keyCodeMapper.btnRight:
            setSwitcherNum((pre) => (pre == 2 ? 1 : 2));
            break;
          default:
            break;
        }
      },
    );
  };
  const initResize = (flag) => {
    window[flag ? "addEventListener" : "removeEventListener"]("resize", () => {
      window.location.reload();
    });
  };
  return (
    <div className={styles.pageBody}>
      <BlockComp switcherNum={switcherNum} />
    </div>
  );
}
export default HomePage;
