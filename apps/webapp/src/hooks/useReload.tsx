import React, { useState, useEffect } from "react";

let reloadTimer = null;
const reloadTime = 1000 * 60 * 30;
function UseReload() {
  const [reloadNum, setReloadNum] = useState(0);

  useEffect(() => {
    reloadTimer = setInterval(() => {
      setReloadNum((pre) => ++pre);
    }, reloadTime);
    return () => {
      clearInterval(reloadTimer);
    };
  }, []);
  return {
    reloadNum,
  };
}
export default UseReload;
