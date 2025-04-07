import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import DisHtml from "./components/disHtml";
import directHtml from "./components/directHtml";
import reimHtml from "./components/reimHtml";
import hrdHtml from "./components/hrdHtml";
import { keyCodeMapper } from "@/utils";
import "@/assets/lib/marquee";

const refreshTime = 1000 * 60 * 10; // 10min定时轮询当前页面
let refreshTimer = null;

const componentMap = {
  js: {
    1: directHtml,
    2: DisHtml,
    3: reimHtml,
    4: hrdHtml,
  },
  fj: {
    1: DisHtml,
    2: reimHtml,
    3: hrdHtml,
  },
};

function HomePage(props: any) {
  const area = sessionStorage.getItem("area") || "js";
  const [switcherNum, setSwitcherNum] = useState(1); // 页码
  const [isMounted, setIsMounted] = useState(false);
  // 根据页码切换对应组件
  const BlockComp = memo((props: any) => {
    const Component = componentMap[area][props.switcherNum];
    return Component ? <Component /> : null;
  });
  useEffect(() => {
    setIsMounted(true);
    initKeydown(true);
    initResize(true);
    refreshTimer = setInterval(() => {
      handleResize();
    }, refreshTime);
    return () => {
      initKeydown(false);
      initResize(false);
      clearInterval(refreshTimer);
    };
  }, []);

  const initKeydown = (flag) => {
    const pageLength = Object.keys(componentMap[area]).length;
    window[flag ? "addEventListener" : "removeEventListener"](
      "keydown",
      (event: any) => {
        !keyCodeMapper[event.keyCode] && event.preventDefault();
        switch (event.keyCode) {
          case keyCodeMapper.btnLeft:
            setSwitcherNum((num) => (num === 1 ? pageLength : --num));
            break;
          case keyCodeMapper.btnRight:
            setSwitcherNum((num) => (num === pageLength ? 1 : ++num));
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
