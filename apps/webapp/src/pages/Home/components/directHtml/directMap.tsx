import React, { useState, useEffect, memo } from "react";
import styles from "./index.module.scss";
import * as echarts from "echarts";
import facilityCoordinates from "../../mapData/facilityCoordinates.json";
import geoCoordMap from "../../mapData/江苏省.json";

const directControlList = [
  {
    label: "用血减免金额",
    value: "0",
    color: "#f69a20",
  },
  {
    label: "用血见面人数",
    value: "1",
    color: "#1ac0fe",
  },
  {
    label: "联网状态",
    value: "2",
    color: "#10ac10",
  },
];
function DirectMap(props: any) {
  let chart: any = null;
  const [directControl, setDirectControl] = useState(1);
  const chartDom = useRef(null);
  const initOption = useRef<any>({});
  const mounted = useRef<boolean>(false);
  const [pointData, setPointData] = useState([]);

  useEffect(() => {
    initChartData();
  }, []);
  const initChart = (option: any) => {
    if (!mounted.current || !chart) {
      chart = echarts.init(chartDom.current);
      // @ts-ignore
      echarts?.registerMap("江苏", geoCoordMap);
      chart?.setOption(option);
      mounted.current = true;
    }
  };
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
  return (
    <div className={styles.DirectMap}>
      <ul className={styles.DirectMap_control}>
        <li className={styles.DirectMap_control_item}>
          <span className="icon-bcp"></span>
          <p>血站报销</p>
        </li>
        {directControlList?.map((d, i) => {
          return (
            <li key={i}>
              <span className={styles.DirectMap_control_item_circle}></span>
              <p>{d.label}</p>
            </li>
          );
        })}
      </ul>
      <div id="map" className={styles.DirectRate_map} ref={chartDom}></div>
    </div>
  );
}
export default memo(DirectMap);
