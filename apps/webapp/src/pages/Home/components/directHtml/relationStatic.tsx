import BoxComp from "@/components/BoxComp";
import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import * as echarts from "echarts";

const colorList = [
  "#08dae1",
  "#15d694",
  "#ff4324",
  "#068aff",
  "#f1bb4c",
  "rgba(250,250,250,0.5)",
];

function RelationStatic(props: any) {
  const { relationChartData } = props;
  let chart: any = null;
  const chartDom = useRef(null);

  useEffect(() => {
    initCharts();
  }, [relationChartData]);
  const initCharts = () => {
    if (!chart) {
      chart = echarts.init(chartDom.current, "", { renderer: "svg" });
      let options = {
        grid: {
          containLabel: true,
        },
        series: [
          // 主要展示层的
          {
            //startAngle:startAngle,
            //avoidLabelOverlap :true,
            radius: ["40%", "60%"],
            center: ["50%", "50%"],
            minAngle: 50,
            type: "pie",
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex];
                },
                borderWidth: 2,
                borderColor: "#1d1f25",
              },
            },
            labelLine: {
              normal: {
                show: true,
                length: 14,
                length2: 42,
                lineStyle: {
                  color: "#fff",
                },
                align: "right",
              },
              color: "#fff",
            },
            label: {
              formatter: function (obj) {
                return obj.percent.toFixed(0) + "%" + "\n" + obj.name;
              },
              alignTo: "labelLine",
              verticalAlign: "middle",
              padding: [2, -28, 0, -28],
              fontSize: 10,
              lineHeight: 14,
              height: 40,
              color: "#fff",
            },
            data: relationChartData || [],
          },
        ],
      };
      chart?.setOption(options);
    }
  };
  return (
    <div className={styles.relationStatic}>
      <BoxComp title="亲属关系统计" subTitle="近一个月" icon="box2-icon">
        <div
          id="map"
          className={styles.relationStatic_map}
          ref={chartDom}
        ></div>
      </BoxComp>
    </div>
  );
}
export default memo(RelationStatic);
