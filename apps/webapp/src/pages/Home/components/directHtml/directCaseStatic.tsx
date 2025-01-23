import BoxComp from "@/components/BoxComp";
import React, { useState, useEffect, memo } from "react";
import styles from "./index.module.scss";
import * as echarts from "echarts";

function DirectCaseStatic(props: any) {
  const { loadAreaType2 = "各医院", reimbursementChartData } = props;
  let chart: any = null;
  const chartDom = useRef(null);

  useEffect(() => {
    initCharts();
  }, [reimbursementChartData]);
  const initCharts = () => {
    if (!chart) {
      chart = echarts.init(chartDom.current, "", { renderer: "svg" });
      let xAxisData = [];
      let seriesData1 = [];
      let seriesData2 = [];
      let seriesData3 = [];
      for (var i in reimbursementChartData) {
        var totalNum = +(
          reimbursementChartData[i][1] + reimbursementChartData[i][0]
        );
        xAxisData.push(i.replace("市", ""));
        seriesData1.push(reimbursementChartData[i][1]);
        seriesData2.push(reimbursementChartData[i][0]);
        const num = parseInt(
          `${(reimbursementChartData[i][0] / totalNum) * 100}`,
        );
        seriesData3.push(num);
      }
      let options = {
        legend: {
          data: ["血站报销", "医院减免", "直免率"],
          textStyle: {
            color: "#fff",
            fontSize: 8,
          },
          top: 0,
          icon: "rect",
          itemWidth: 5,
          itemHeight: 5,
        },
        grid: {
          width: "86%",
          height: "60%",
          left: 18,
          top: 20,
        },
        axisLabel: {
          color: "#fff",
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            data: xAxisData,
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#465b7a",
              },
            },
            axisLabel: {
              interval: 0,
              rotate: 45,
              margin: 4,
              fontSize: 8,
            },
            nameTextStyle: {
              fontSize: 8,
            },
          },
          {
            show: false,
            type: "category",
            boundaryGap: true,
            data: xAxisData,
            axisLine: {
              lineStyle: {
                color: "#465b7a",
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "人次",
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#465b7a",
              },
            },
            axisLabel: {
              fontSize: 8,
            },
            nameLocation: "end",
            nameTextStyle: {
              color: "#fff",
              padding: [8, 0, 0, 0],
              verticalAlign: "middle",
              fontSize: 8,
            },
          },
          {
            type: "value",
            name: "%",
            axisTick: {
              show: false,
            },
            axisLabel: {
              fontSize: 8,
            },
            nameLocation: "end",
            nameTextStyle: {
              color: "#fff",
              padding: [8, 0, 0, 0],
              verticalAlign: "middle",
              fontSize: 8,
            },
            axisLine: {
              lineStyle: {
                color: "#465b7a",
              },
            },
            splitLine: {
              lineStyle: {
                color: "#465b7a",
                type: "dotted",
              },
            },
          },
        ],
        series: [
          {
            name: "血站报销",
            type: "bar",
            xAxisIndex: 0,
            yAxisIndex: 0,
            barMaxWidth: 4,
            barMinWidth: 1,
            //barWidth: 7,
            //barGap: '10%',
            //barCategoryGap: '30%',
            data: seriesData1,
            itemStyle: {
              color: "#0184f7",
            },
            label: {
              show: true,
              fontSize: 6,
              position: "top",
              color: "#fff",
            },
          },
          {
            name: "医院减免",
            type: "bar",
            xAxisIndex: 0,
            yAxisIndex: 0,
            barMaxWidth: 4,
            barMinWidth: 1,
            //barWidth: 7,
            //barGap: '10%',
            //barCategoryGap: '30%',
            data: seriesData2,
            itemStyle: {
              color: "#08dae1",
            },
            label: {
              show: true,
              fontSize: 6,
              position: "top",
              color: "#fff",
            },
          },
          {
            name: "直免率",
            type: "line",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: seriesData3,
            symbol: "roundRect",
            symbolSize: 10,
            itemStyle: {
              color: "#15d694",
            },
            lineStyle: {
              width: 1,
            },
            label: {
              show: true,
              fontSize: 6,
              position: "inside",
              color: "#000",
            },
          },
        ],
      };
      chart?.setOption(options);
    }
  };
  return (
    <div className={styles.DirectCaseStatic}>
      <BoxComp
        title={`${loadAreaType2}直免情况统计`}
        subTitle="近一个月"
        icon="box3-icon"
      >
        <div
          id="map"
          className={styles.DirectCaseStatic_map}
          ref={chartDom}
        ></div>
      </BoxComp>
    </div>
  );
}
export default memo(DirectCaseStatic);
