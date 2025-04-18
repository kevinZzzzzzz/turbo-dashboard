import React from "react";
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import ReactDOM from "react-dom";
import { AllRouters as routes } from "./router/index";
import DefaultLayout from "./layout/Default";
import api from "@/api";
import { getUrlParamsByKey } from "./utils";

declare global {
  interface Window {
    $api: any;
    serverTimeDiff: number;
  }
}
/* 
  设置全局变量
*/
window.$api = { ...api };
// 服务器时间差异值
window.serverTimeDiff = 0;

function App() {
  const [canMounted, setCanMounted] = useState(false);
  useEffect(() => {
    // 获取链接上参数 并存储再sessionStorage, 默认江苏 -> js
    const area = getUrlParamsByKey("area");
    const areaT = sessionStorage.getItem("area");
    if (!area || area !== areaT) {
      sessionStorage.removeItem("facilityInfo");
      sessionStorage.setItem("area", area ? area : "js");
    }

    /**
     * 获取服务器时间
     * 解决机顶盒时间/时区不正确
     */
    window.$api
      .getServerTime()
      .then((res: any) => {
        window.serverTimeDiff = res.millis - new Date().getTime();
      })
      .finally(() => {
        setCanMounted(true);
      });
  }, []);
  return canMounted ? (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />}></Route>
        <Route path="/:notFoundPath" element={<Navigate to="/404" />}></Route>
        {routes.map((e: any) => {
          return (
            <Route
              key={e.key}
              path={e.path}
              element={
                <DefaultLayout>
                  <e.component />
                </DefaultLayout>
              }
            ></Route>
          );
        })}
      </Routes>
    </HashRouter>
  ) : null;
}
export default App;
