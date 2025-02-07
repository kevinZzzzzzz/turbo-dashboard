import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import DisHtml from "./components/disHtml";
import directHtml from "./components/directHtml";
import reimHtml from "./components/reimHtml";
import { keyCodeMapper } from "@/utils";

const componentMap = {
  1: directHtml,
  2: DisHtml,
  3: reimHtml,
};

function HomePage(props: any) {
  const [switcherNum, setSwitcherNum] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const BlockComp = memo((props: any) => {
    const Component = componentMap[props.switcherNum];
    return Component ? <Component /> : null;
  });
  useEffect(() => {
    setIsMounted(true);
    initKeydown(true);
    initResize(true);
    return () => {
      initKeydown(false);
      initResize(false);
    };
  }, []);

  const initKeydown = (flag) => {
    const pageLength = Object.keys(componentMap).length;
    window[flag ? "addEventListener" : "removeEventListener"](
      "keydown",
      (event: any) => {
        !keyCodeMapper[event.keyCode] && event.preventDefault();
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
  const initResize = (flag) => {
    window[flag ? "addEventListener" : "removeEventListener"]("resize", () => {
      // window.location.reload();
      handleResize();
    });
  };
  /**
   * 无刷新重绘
   * @param ms 间隔时间
   */
  const handleResize = (ms = 500) => {
    setIsMounted(false);
    setTimeout(() => {
      setIsMounted(true);
    }, ms);
  };
  return (
    <div className={styles.pageBody}>
      {isMounted ? <BlockComp switcherNum={switcherNum} /> : <></>}
    </div>
  );
}
export default HomePage;
