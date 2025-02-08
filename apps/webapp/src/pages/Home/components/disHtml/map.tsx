import React, { useState, useEffect, memo } from "react";
import styles from "./index.module.scss";
import * as echarts from "echarts";
import geoCoordMap from "../../mapData/江苏省.json";

let symbolsize_store = 8;
let symbolsize_city = 8;
let symbolsize_line = 7;
let fontsize_city = 15;
let fontsize_value = 13;

//品种单位字典
let bloodtypesunit = {
  rbc: "U",
  plt: "治疗量",
  plm: "mL",
  crp: "U",
};

function MapComp(props: any) {
  const { bloodType, bloodStoreData, dispatchData, pointData, bloodInventMap } =
    props;
  let chart: any = null;
  const chartDom = useRef(null);
  const initOption = useRef<any>({});
  const mounted = useRef<boolean>(false);
  useEffect(() => {
    initChartData();
  }, [bloodType]);

  // 通过value计算color
  function converColor(value) {
    if (+value >= bloodInventMap[bloodType][3]) {
      return "rgba(101,28,238,1)";
    } else if (+value >= bloodInventMap[bloodType][2]) {
      return "rgba(116,68,206,1)";
    } else if (+value >= bloodInventMap[bloodType][1]) {
      return "rgba(1,149,255,1)";
    } else if (+value >= bloodInventMap[bloodType][0]) {
      return "rgba(0,216,255,1)";
    } else if (+value >= 0 || !value) {
      return "rgba(8,233,201,1)";
    }
  }
  // 初始化图表
  const initChart = (option: any) => {
    if (!mounted.current || !chart) {
      chart = echarts.init(chartDom.current);
      // @ts-ignore
      echarts?.registerMap("江苏", geoCoordMap);
      chart?.setOption(option);
      mounted.current = true;

      handleBulidMapSeries(
        bloodStoreData[bloodType],
        pointData[bloodType],
        dispatchData[bloodType],
      );
    }
  };
  // 初始化图表数据
  const initChartData = () => {
    initOption.current = {
      title: {
        text: "",
        textStyle: { color: "#fff" },
      },
      backgroundColor: "rgba(27,27,27,0)",
      geo: {
        map: "江苏",
        label: {
          emphasis: {
            show: false,
          },
        },
        roam: false, //鼠标缩放
        left: 10,
        top: "2%",
        bottom: "4%",
        itemStyle: {
          normal: {
            areaColor: "rgba(50,60,72,0)",
            borderColor: "#39476a",
            borderWidth: 2,
          },
          emphasis: {
            areaColor: "rgba(42,51,61,1)",
          },
        },
      },
      calculable: true,
    };
    if (chartDom.current) {
      initChart(initOption.current);
    }
  };
  // 添加展示图层
  const handleBulidMapSeries = (bloodStore, points, dispatch) => {
    let series = [];
    // 地图库存数据
    series.push({
      name: "红细胞类血液库存",
      type: "scatter",
      coordinateSystem: "geo",
      data: bloodStore,
      symbolSize: symbolsize_store,
      roam: false, //鼠标缩放
      label: {
        formatter: "{b}",
        position: "top",
        show: true,
        textStyle: {
          color: "#5e6e84",
          //fontFamily: 'SimHei',
          fontSize: fontsize_city,
          fontWeight: "bold",
        },
      },
      itemStyle: {
        color: function (item) {
          return converColor(item.value[2]);
        },
        shadowColor: "rgba(255,255,255,0.3)",
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 15,
      },
    });
    // 地图调剂的节点数据
    series.push({
      name: "红细胞类血液调剂城市",
      type: "effectScatter",
      coordinateSystem: "geo",
      data: points,
      symbolSize: symbolsize_city,
      showEffectOn: "render",
      rippleEffect: {
        brushType: "stroke",
      },
      roam: false, //鼠标缩放
      label: {
        formatter: "{b}",
        position: "top",
        show: true,
        textStyle: {
          //fontFamily: 'SimHei',
          fontSize: fontsize_city,
          color: "inherit",
          fontWeight: "bold",
        },
      },
      itemStyle: {
        color: function (item) {
          return converColor(item.value[2]);
        },
      },
    });
    // 地图调剂的路径数据
    series.push({
      name: "红细胞类血液调剂路线",
      type: "lines",
      zlevel: 2,
      effect: {
        show: true,
        period: 5,
        symbol: "arrow",
        symbolSize: symbolsize_line,
        color: "rgba(8,233,201,1)",
        trailLength: 0, // 0.1
      },
      lineStyle: {
        color: "rgba(6,235,200,1)",
        // type: "dotted",
        width: 3,
        opacity: 0.6,
        curveness: 0.5,
      },
      label: {
        show: true,
        formatter: "{c}" + bloodtypesunit[bloodType],
        textStyle: {
          fontFamily: "SimHei",
          fontWeight: "bold",
          color: "rgba(6,235,200,1)",
          fontSize: fontsize_value,
        },
        position: "middle",
      },
      animation: false,
      data: dispatch,
    });

    chart?.setOption({ series: series });
  };
  return <div id="map" className={styles.map} ref={chartDom}></div>;
}
export default memo(MapComp);
