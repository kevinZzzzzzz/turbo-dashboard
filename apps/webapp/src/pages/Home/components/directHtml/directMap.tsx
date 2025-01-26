import React, { useState, useEffect, memo } from "react";
import styles from "./index.module.scss";
import * as echarts from "echarts";
import facilityCoordinates from "../../mapData/facilityCoordinates.json";
import geoCoordMap from "../../mapData/江苏省.json";
import { keyCodeMapper } from "@/utils";

const directControlList = [
  {
    label: "用血减免金额",
    value: "0",
    color: "#f69a20",
  },
  {
    label: "用血减免人数",
    value: "1",
    color: "#1ac0fe",
  },
  {
    label: "联网状态",
    value: "2",
    color: "#10ac10",
  },
];
let path =
  "path://M0.5,40.5v-2.058h2.05V14.813h10.251V2.5h16.371v12.313h11.276v23.629H42.5V40.5H0.5z M9.726,17.899H6.651v3.086h3.075V17.899zM9.726,23.043H6.651v3.086h3.075V23.043z M9.726,28.187H6.651v3.055h3.075V28.187z M14.852,38.442h6.151v-7.201h-6.151V38.442z M24.154,8.268c-0.83-1.171-1.945-3.007-3.188-4.27c-1.243,1.263-2.36,3.099-3.188,4.27c-0.888,1.254-1.334,2.454-1.334,3.61c0,1.125,0.113,2.258,1.017,3.071c0.904,0.815,2.228,1.248,3.506,1.248c1.276,0,2.654-0.433,3.56-1.248c0.903-0.813,0.961-1.946,0.961-3.071C25.486,10.722,25.041,9.521,24.154,8.268z M27.123,18.928H14.852v2.058h12.271V18.928zM27.123,23.043H14.852v2.058h12.271V23.043zM27.123,27.158H14.852v2.057h12.271V27.158z M28.148,31.241h-6.12v7.201h6.12V31.241zM36.35,17.899h-3.076v3.086h3.076V17.899zM36.35,23.043h-3.076v3.086h3.076V23.043z M36.35,28.187h-3.076v3.055h3.076V28.187z";
let color = "";
let bstColor: any = "#0096ff";
let fontSizeFn = null;
let chart: any = null;
function DirectMap(props: any) {
  const { reimburPeMapData, facilityInfo } = props;
  const [directControl, setDirectControl] = useState(1);
  const chartDom = useRef(null);
  const initOption = useRef<any>({});
  const mounted = useRef<boolean>(false);
  const [pointData, setPointData] = useState([]);
  const mapData = useRef({
    mapHosMoney: [],
    mapHosPeople: [],
    mapBstOnline: [],
    mapBstMoney: [],
    mapBstPeople: [],
  });

  useEffect(() => {
    initChartData();
  }, [facilityInfo, reimburPeMapData, directControl]);

  useEffect(() => {
    initKeydown(true);
    return () => {
      initKeydown(false);
    };
  }, []);

  const initChart = (option: any) => {
    if (!mounted.current || !chart) {
      chart = echarts.init(chartDom.current);
      // @ts-ignore
      echarts?.registerMap("江苏", geoCoordMap);
      chart?.setOption(option);
      initMapData();
      mounted.current = true;
      renderDataToMap();
    } else {
      chart?.setOption(option);
      initMapData();
      renderDataToMap();
    }
  };
  // 初始化地图参数option并初始化地图组件
  const initChartData = () => {
    handleCurrentFacility();
    initOption.current = {
      title: {
        show: false,
      },
      grid: {
        top: 0,
        left: 40,
      },
      backgroundColor: "rgba(27,27,27,0)",
      geo: {
        map: "江苏",
        label: {
          emphasis: {
            show: false,
          },
        },
        aspectScale: 0.88, //长宽比
        roam: false, //鼠标缩放
        zoom: 1.3, //缩放比例
        layoutCenter: ["51%", "46%"],
        layoutSize: 480,
        itemStyle: {
          normal: {
            areaColor: "#252e43",
            borderColor: "#7388ae",
            borderWidth: 3,
          },
          emphasis: {
            areaColor: "rgba(42,51,61,1)",
          },
        },
      },
      calculable: true,
      series: [
        {
          //兼容设计稿增加外边框
          type: "map",
          map: "江苏",
          label: {
            emphasis: {
              show: false,
            },
          },
          aspectScale: 0.88, //长宽比
          roam: false, //鼠标缩放
          zoom: 1.3, //缩放比例
          layoutCenter: ["51%", "46%"],
          layoutSize: 480,
          z: 1,
          itemStyle: {
            normal: {
              areaColor: "#252e43",
              borderColor: "#3a476a",
              borderWidth: 1,
            },
            emphasis: {
              areaColor: "rgba(42,51,61,1)",
            },
          },
        },
        {
          name: "市级地图节点",
          type: "scatter",
          coordinateSystem: "geo",
          data: pointData,
          symbol: "circle",
          symbolSize: 0,
          roam: false, //鼠标缩放
          z: 10,
        },
      ],
    };
    if (chartDom.current) {
      initChart(initOption.current);
    }
  };
  // 初始化地图数据
  const initMapData = () => {
    let mapHosMoneyTemp = [];
    let mapHosPeopleTemp = [];
    let mapBstOnlineTemp = [];
    let mapBstMoneyTemp = [];
    let mapBstPeopleTemp = [];
    for (let i in reimburPeMapData) {
      if (facilityInfo?.hasOwnProperty(i)) {
        let reimFacilityInfo = facilityInfo[i];
        if (i.length == 5) {
          mapBstMoneyTemp.push([
            reimFacilityInfo.x,
            reimFacilityInfo.y,
            reimburPeMapData[i][0],
            reimFacilityInfo.cityName,
          ]);
          mapBstPeopleTemp.push([
            reimFacilityInfo.x,
            reimFacilityInfo.y,
            reimburPeMapData[i][1],
            reimFacilityInfo.cityName,
          ]);
          mapBstOnlineTemp.push([
            reimFacilityInfo.x,
            reimFacilityInfo.y,
            reimburPeMapData[i][2] || "",
            reimFacilityInfo.cityName,
          ]);
        } else {
          mapHosMoneyTemp.push([
            reimFacilityInfo.x,
            reimFacilityInfo.y,
            reimburPeMapData[i][0],
          ]);
          mapHosPeopleTemp.push([
            reimFacilityInfo.x,
            reimFacilityInfo.y,
            reimburPeMapData[i][1],
          ]);
        }
      } else {
        console.log("Facility info not found :" + i);
      }
    }
    mapData.current = {
      mapHosMoney: mapHosMoneyTemp,
      mapHosPeople: mapHosPeopleTemp,
      mapBstOnline: mapBstOnlineTemp,
      mapBstMoney: mapBstMoneyTemp,
      mapBstPeople: mapBstPeopleTemp,
    };
  };
  // 切换地图数据
  const renderDataToMap = (controlIdx = directControl) => {
    if (mounted.current) {
      let reHosData = [];
      let reBstData = [];
      let changeSeries = JSON.parse(JSON.stringify(initOption.current.series));
      if (controlIdx == 0) {
        reHosData = mapData.current.mapHosMoney;
        reBstData = mapData.current.mapBstMoney;
        color = "#f69a20";
        fontSizeFn = function (params) {
          let fontSize = 6;
          if (params[2] > 100000) {
            return 14;
          } else if (params[2] > 50000) {
            return 12;
          } else if (params[2] > 10000) {
            return 10;
          } else if (params[2] > 5000) {
            return 8;
          }
          return fontSize;
        };
      } else if (controlIdx == 1) {
        reHosData = mapData.current.mapHosPeople;
        reBstData = mapData.current.mapBstPeople;
        color = "#1ac0fe";
        fontSizeFn = function (params) {
          let fontSize = 6;
          if (params[2] > 1000) {
            return 14;
          } else if (params[2] > 500) {
            return 12;
          } else if (params[2] > 300) {
            return 10;
          } else if (params[2] > 100) {
            return 8;
          }
          return fontSize;
        };
      } else {
        reHosData = [];
        reBstData = mapData.current.mapBstOnline;
        bstColor = function (item) {
          if (
            item.data[2].toString() == "200" ||
            item.data[2].toString() == "204"
          ) {
            return "#10ac10";
          } else {
            return "#9eabbd";
          }
        };
      }
      changeSeries.push({
        name: "医院直免地图节点",
        type: "effectScatter",
        coordinateSystem: "geo",
        rippleEffect: {
          scale: 3.5,
        },
        data: reHosData,
        symbol: "circle",
        symbolSize: fontSizeFn,
        roam: false, //鼠标缩放
        z: 1000,
        itemStyle: {
          color: color,
        },
      });
      if (reBstData.length > 0) {
        changeSeries.push({
          name: "血站直免地图节点",
          type: "scatter",
          coordinateSystem: "geo",
          data: reBstData,
          symbol: path,
          symbolSize: [25, 20],
          roam: false, //鼠标缩放
          z: 100,
          itemStyle: {
            color: bstColor,
          },
          label: {
            show: true,
            formatter: "{@[3]}",
            offset: [0, 20],
            fontSize: 11,
          },
        });
      }
      chart?.setOption({ series: changeSeries });
    }
  };

  const handleCurrentFacility = () => {
    let pointDataTemp = [];
    for (let i in facilityCoordinates) {
      if (i.length == 5) {
        if (facilityCoordinates[i].cityName == "江苏省") {
          facilityCoordinates[i].cityName = "";
        }
        pointData.push({
          name: facilityCoordinates[i].cityName,
          value: [facilityCoordinates[i].x, facilityCoordinates[i].y, 1],
        });
      }
    }
    setPointData(pointDataTemp);
  };

  const initKeydown = (flag) => {
    let idx = directControl;
    const len = directControlList.length;
    window[flag ? "addEventListener" : "removeEventListener"](
      "keydown",
      (event: any) => {
        event.preventDefault();
        switch (event.keyCode) {
          case keyCodeMapper.btnUp:
            if (!idx) {
              idx = len - 1;
            } else {
              idx--;
            }
            setDirectControl(idx);
            break;
          case keyCodeMapper.btnDown:
            if (idx == len - 1) {
              idx = 0;
            } else {
              idx++;
            }
            setDirectControl(idx);
            break;
          default:
            break;
        }
      },
    );
  };
  return (
    <div className={styles.DirectMap}>
      <ul className={styles.DirectMap_control}>
        <li className={styles.DirectMap_control_item}>
          <span className="icon-bcp"></span>
          <p style={{ color: "#fff" }}>血站报销</p>
        </li>
        {directControlList?.map((d, i) => {
          return (
            <li
              key={i}
              className={styles.DirectMap_control_item}
              onClick={() => {
                setDirectControl(i);
              }}
            >
              <span
                className={styles.DirectMap_control_item_circle}
                style={{
                  background: d.color,
                  boxShadow: `0 0 6px 2px ${d.color}`,
                }}
              ></span>
              <p
                style={{
                  color: directControl === i && "#fff",
                }}
              >
                {d.label}
              </p>
            </li>
          );
        })}
      </ul>
      <div id="map" className={styles.DirectRate_map} ref={chartDom}></div>
    </div>
  );
}
export default memo(DirectMap);
