import BoxComp from "@/components/BoxComp";
import React, { useState, useEffect, memo } from "react";
import styles from "./index.module.scss";
import * as echarts from "echarts";
import moment from "moment";

let options = {
  legend: {
    data: ["人次", "金额"],
    textStyle: {
      fontSize: 8,
      color: "#fff",
    },
    icon: "rect",
    itemWidth: 5,
    itemHeight: 5,
  },
  grid: {
    width: "84%",
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
      boundaryGap: false,
      data: [],
      axisLine: {
        lineStyle: {
          color: "#465b7a",
        },
      },
      axisLabel: {
        fontSize: 8,
        interval: 2,
      },
    },
    {
      show: false,
      type: "category",
      boundaryGap: true,
      data: [],
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
      nameLocation: "end",
      nameTextStyle: {
        fontSize: 8,
        verticalAlign: "middle",
        color: "#fff",
      },
      axisLabel: {
        fontSize: 8,
      },
    },
    {
      type: "value",
      name: "金额",
      axisTick: {
        show: false,
      },
      nameLocation: "end",
      nameTextStyle: {
        fontSize: 8,
        verticalAlign: "middle",
        color: "#fff",
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
      axisLabel: {
        fontSize: 8,
        formatter: function (value, index) {
          if (value >= 10000 && value < 10000000) {
            value = value / 10000 + "万";
          } else if (value >= 10000000) {
            value = value / 10000000 + "千万";
          }
          return value;
        },
      },
    },
  ],
  series: [
    {
      name: "人次",
      type: "line",
      color: "#279fff",
      smooth: true,
      symbol: "circle",
      symbolSize: 3,
      lineStyle: {
        width: 1,
      },
      data: [],
    },
    {
      name: "金额",
      type: "line",
      xAxisIndex: 1,
      yAxisIndex: 1,
      color: "#de8237",
      smooth: true,
      symbol: "circle",
      symbolSize: 3,
      lineStyle: {
        width: 1,
      },
      data: [],
    },
  ],
};
function DirectBloodTrend(props: any) {
  const { loadType, directBloodTrendData } = props;
  let chart: any = null;
  const chartDom = useRef(null);

  useEffect(() => {
    initCharts();
  }, [directBloodTrendData]);
  const initCharts = () => {
    if (!chart) {
      chart = echarts.init(chartDom.current, "", { renderer: "svg" });
      var xAxisArr = [];
      var seriesData1 = [];
      var seriesData2 = [];
      directBloodTrendData.forEach((d, i) => {
        if (i == 0 || moment(d.date).format("DD") == "01") {
          xAxisArr.push(moment(d.date).format("MM") + "月");
        } else {
          xAxisArr.push(moment(d.date).format("DD"));
        }
        seriesData1.push(d.num);
        seriesData2.push(d.amount);
      });
      options.series[0]["data"] = seriesData1;
      options.series[1]["data"] = seriesData2;
      options.xAxis[0]["data"] = xAxisArr;
      options.xAxis[1]["data"] = xAxisArr;
      chart?.setOption(options);
    }
  };
  return (
    <div className={styles.DirectBloodTrend}>
      <BoxComp
        title={`${loadType}用血减免趋势变化`}
        subTitle="近一个月"
        icon="box5-icon"
      >
        <div
          id="map"
          className={styles.DirectBloodTrend_map}
          ref={chartDom}
        ></div>
      </BoxComp>
    </div>
  );
}
export default memo(DirectBloodTrend);
