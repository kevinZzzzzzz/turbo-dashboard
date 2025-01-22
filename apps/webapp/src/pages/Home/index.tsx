import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import DisHtml from "./components/disHtml";
import DirectComp from "./components/directComp";
import { keyCodeMapper } from "@/utils";
function HomePage(props: any) {
  const [switcherNum, setSwitcherNum] = useState(1);
  const BlockComp = memo((props: any) => {
    console.log(props.switcherNum, "props.switcherNum00000000");
    const componentMap = {
      1: DirectComp,
      2: DisHtml,
    };
    const Component = componentMap[props.switcherNum];
    return Component ? <Component /> : null;
  });
  useEffect(() => {
    // initKeydown();
  }, []);

  const initKeydown = () => {
    window.addEventListener("keydown", (event: any) => {
      console.log(event.keyCode);
      event.preventDefault();
      switch (event.keyCode) {
        case keyCodeMapper.btnLeft:
          handleSwitch("left");
          break;
        case keyCodeMapper.btnRight:
          handleSwitch("right");
          break;
        default:
          break;
      }
    });
  };
  const handleSwitch = (dire: "left" | "right") => {
    console.log(switcherNum, "props.switcherNum1111");
    switch (dire) {
      case "left":
        setSwitcherNum((pre) => (pre == 1 ? 2 : pre--));
        break;
      case "right":
        setSwitcherNum((pre) => (pre == 2 ? 1 : pre++));
        break;
      default:
        break;
    }
  };
  return (
    <div className={styles.pageBody}>
      <BlockComp switcherNum={switcherNum} />
    </div>
  );
}
export default HomePage;
