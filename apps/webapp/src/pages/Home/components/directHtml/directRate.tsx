import BoxComp from "@/components/BoxComp";
import React, { useState, useEffect, memo } from "react";
import styles from "./index.module.scss";
import * as echarts from "echarts";

let colorList = [
  "#08dae1",
  "#15d694",
  "#ff4324",
  "#068aff",
  "#f1bb4c",
  "rgba(250,250,250,0.5)",
];
function DirectRate(props: any) {
  const { loadType = "全市", reimburPerChartData = [] } = props;
  const [totalNum, setTotalNum] = useState(0);
  let chart: any = null;
  const chartDom = useRef(null);

  useEffect(() => {
    initCharts();
  }, [reimburPerChartData]);
  const initCharts = () => {
    if (!chart) {
      chart = echarts.init(chartDom.current, "", { renderer: "svg" });
      // 计算旋转角度
      let startAngle = Math.round(
        (360 * reimburPerChartData[0].value) /
          (reimburPerChartData[0].value + reimburPerChartData[1].value) /
          2,
      );
      // 统计总数
      const totalNumTemp =
        reimburPerChartData[0]["value"] + reimburPerChartData[1]["value"];
      totalNumTemp &&
        reimburPerChartData.length &&
        setTotalNum(
          parseInt(
            `${(reimburPerChartData[0]?.["value"] / totalNumTemp) * 100}`,
          ),
        );
      let options = {
        series: [
          {
            type: "pie",
            startAngle: startAngle,
            radius: ["56%", "70%"],
            itemStyle: {
              normal: {
                color: function (params) {
                  if (params.dataIndex == 0) {
                    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "#01fffc", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "#299cff", // 100% 处的颜色
                      },
                    ]);
                  } else {
                    return "#618aa0";
                  }
                },
              },
            },
            labelLine: {
              normal: {
                show: true,
                length: 20,
                length2: 54,
                lineStyle: {
                  color: "#fff",
                },
                align: "right",
              },
              color: "#fff",
            },
            label: {
              formatter: "{c}\n{b}",
              padding: [2, -54, 0, -54],
              fontSize: 12,
              lineHeight: 14,
              color: "#fff",
            },
            hoverAnimation: false,
            center: ["50%", "50%"],
            data: reimburPerChartData,
          },
          {
            type: "pie",
            radius: ["44", "46"],
            data: [100],
            label: {
              show: false,
            },
            itemStyle: {
              normal: {
                color: "#34525c",
              },
            },
          },
        ],
      };
      chart?.setOption(options);
    }
  };
  return (
    <div className={styles.DirectRate}>
      <BoxComp
        title={`${loadType}用血直免率`}
        subTitle="近一个月"
        icon="box4-icon"
      >
        <div id="map" className={styles.DirectRate_map} ref={chartDom}>
          <p className={styles.DirectRate_map_num}>
            {totalNum}
            <sub>%</sub>{" "}
          </p>
        </div>
      </BoxComp>
    </div>
  );
}
export default memo(DirectRate);
