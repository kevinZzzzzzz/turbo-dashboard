import { useRef, useEffect } from "react";
import * as echarts from "echarts";
import styles from "./index.module.scss";
import UseFacility from "@/hooks/useFacility";
import { getRealCityName } from "@/utils";
import moment from "moment";
import { formatNum, getTheMoment } from "@/utils";

const Map = () => {
  const { facilityInfo, getFacilityValue, getRealFacilityCode } = UseFacility();
  const mapRef = useRef(null);
  const echartsData = useRef(null);

  const echartsOption = {
    title: {
      show: false,
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
      top: 100,
      bottom: 40,
      left: 20,
      right: 20,
      itemStyle: {
        areaColor: "rgba(50,60,72,0)",
        borderColor: "#39476a",
        borderWidth: 2,
        emphasis: {
          areaColor: "rgba(42,51,61,1)",
        },
      },
    },
    /*legend: {
            show:false,
            orient: 'vertical',
            selectedMode:false,
            x:'right',
            data:[]
        },
        dataRange: {
            show : false,
            x: 'right',
            y: 'center',
            textStyle: {color:'#fff'},
            splitList: [
                {start: 10000,label: '异地报销'},
                {start: 0, end: 10000,label: '本地报销'}
            ],
            color: ['#06ebc8','#0096ff']
        },*/
    calculable: true,
  };

  const screenWidthData = useRef({
    symbolsize_city: 7,
    symbolsize_reimcity: 8,
    symbolsize_line: 7,
    fontsize_city: 15,
    fontsize_value: 13,
  });

  const initScreenWidthData = () => {
    const screenwidth = window.screen.width;
    if (screenwidth >= 1920) {
      screenWidthData.current.symbolsize_city = 8;
      screenWidthData.current.symbolsize_reimcity = 10;
      screenWidthData.current.symbolsize_line = 8;
      screenWidthData.current.fontsize_city = 14;
      screenWidthData.current.fontsize_value = 12;
    }
  };

  useEffect(() => {
    initScreenWidthData();
    echartsData.current = echarts.init(mapRef.current);
    echartsData.current.hideLoading();
    echartsData.current.setOption(echartsOption);
    initData();
  });

  const getRecordsReim = (facilityInfo) => {
    const today = getTheMoment();
    window.$api
      .getRecordsReim({
        startTime:
          moment(today).subtract(1, "day").format("YYYY-MM-DD") + " 23:59:59",
        endTime: moment(today).format("YYYY-MM-DD HH:mm:ss"),
      })
      .then((resp) => {
        const series = [];
        const pointData = [];
        // 本地报销
        const localReimData = [];
        // 异地报销
        const remoteReimDate = [];
        // 正在发生异地报销
        const lines = [];

        const localReimHash = {};
        const remoteReimHash = {};
        const lineHash = {};
        const pointHash = {};
        resp.forEach((d, i) => {
          d.applyFacility = getRealFacilityCode(d.applyFacility); // 兼容中心血站为7位机构码
          if (Object.hasOwn(facilityInfo, d.applyFacility)) {
            // 直接排除机构字典中没有的数据，避免出错
            const applyFacilityName = facilityInfo[d.applyFacility].cityName;
            pointHash[d.applyFacility] = true;
            //本地报销
            if (d.applyFacility === d.reimFacility) {
              //已经有这个机构的报销数据，累加
              if (Object.hasOwn(localReimHash, d.applyFacility)) {
                const _thisIndex = localReimHash[d.applyFacility];
                localReimData[_thisIndex].value[2] += d.reimAmount;
              } //没有该机构数据，push
              else {
                localReimHash[d.applyFacility] = localReimData.length; //记录index
                localReimData.push({
                  name: applyFacilityName,
                  value: [
                    facilityInfo[d.applyFacility].x,
                    facilityInfo[d.applyFacility].y,
                    d.reimAmount,
                  ],
                });
              }
            } else {
              //异地报销
              //判断异地报销为多地 or 单地
              if (d.reimFacility.indexOf(",") > 0) {
                const reimFacilitys = d.reimFacility.split(",");
                const amounts = d.facilityAmount.split(",");

                for (let j = 0; j < reimFacilitys.length; j++) {
                  reimFacilitys[j] = getRealFacilityCode(reimFacilitys[j]); // 兼容中心血站为7位机构码

                  const reimFacilityName = Object.hasOwn(
                    facilityInfo,
                    reimFacilitys[j],
                  )
                    ? facilityInfo[reimFacilitys[j]].cityName
                    : reimFacilitys[j];
                  pointHash[reimFacilitys[j]] = true;

                  if (d.applyFacility !== reimFacilitys[j]) {
                    //已经有这个机构的异地报销数据，累加
                    if (Object.hasOwn(remoteReimHash, d.applyFacility)) {
                      const _thisIndex = remoteReimHash[d.applyFacility];
                      remoteReimDate[_thisIndex].value[2] += d.reimAmount;
                    } //没有这个机构数据，push
                    else {
                      remoteReimHash[d.applyFacility] = remoteReimDate.length; //记录index
                      remoteReimDate.push({
                        name: applyFacilityName,
                        value: [
                          facilityInfo[d.applyFacility].x,
                          facilityInfo[d.applyFacility].y,
                          d.reimAmount,
                        ],
                      });
                    }

                    //已经有这个机构的异地报销数据，累加
                    if (Object.hasOwn(remoteReimHash, reimFacilitys[j])) {
                      const _thisIndex = remoteReimHash[reimFacilitys[j]];
                      remoteReimDate[_thisIndex].value[2] += d.reimAmount;
                    } //没有这个机构数据，push
                    else {
                      remoteReimHash[reimFacilitys[j]] = remoteReimDate.length; //记录index
                      remoteReimDate.push({
                        name: reimFacilityName,
                        value: [
                          facilityInfo[reimFacilitys[j]].x,
                          facilityInfo[reimFacilitys[j]].y,
                          d.reimAmount,
                        ],
                      });
                    }

                    //已经有这两个个机构的异地报销数据，累加
                    if (
                      Object.hasOwn(
                        lineHash,
                        d.applyFacility + "" + reimFacilitys[j],
                      )
                    ) {
                      const _thisIndex =
                        lineHash[d.applyFacility + "" + reimFacilitys[j]];
                      lines[_thisIndex].value += amounts[j];
                      // lines[_thisIndex][1].value += amounts[j];
                    } //没有这两个机构数据，push
                    else {
                      lineHash[d.applyFacility + "" + reimFacilitys[j]] =
                        lines.length; //记录index
                      lines.push(
                        {
                          name: applyFacilityName,
                          coords: [
                            [
                              facilityInfo[d.applyFacility].x,
                              facilityInfo[d.applyFacility].y,
                            ],
                            [
                              facilityInfo[reimFacilitys[j]].x,
                              facilityInfo[reimFacilitys[j]].y,
                            ],
                          ],
                          value: amounts[j],
                        },
                        // {
                        //   name: reimFacilityName,
                        //   coords: [
                        //     facilityInfo[reimFacilitys[j]].x,
                        //     facilityInfo[reimFacilitys[j]].y,
                        //   ],
                        //   value: amounts[j],
                        // },
                      );
                    }
                  } else {
                    //异地含本地的是否计算在内？算本地还是算到异地？
                  }
                }
              } // 异地只有一个机构
              else {
                d.reimFacility = getRealFacilityCode(d.reimFacility);
                const reimFacilityName = Object.hasOwn(
                  facilityInfo,
                  d.reimFacility,
                )
                  ? facilityInfo[d.reimFacility].cityName
                  : d.reimFacility;
                pointHash[d.reimFacility] = true;

                //已经有这个机构的异地报销数据，累加
                if (Object.hasOwn(remoteReimHash, d.applyFacility)) {
                  const _thisIndex = remoteReimHash[d.applyFacility];
                  remoteReimDate[_thisIndex].value[2] += d.reimAmount;
                } //没有这个机构数据，push
                else {
                  remoteReimHash[d.applyFacility] = remoteReimDate.length; //记录index
                  remoteReimDate.push({
                    name: applyFacilityName,
                    value: [
                      facilityInfo[d.applyFacility].x,
                      facilityInfo[d.applyFacility].y,
                      d.reimAmount,
                    ],
                  });
                }

                //已经有这个机构的异地报销数据，累加
                if (Object.hasOwn(remoteReimHash, d.reimFacility)) {
                  const _thisIndex = remoteReimHash[d.reimFacility];
                  remoteReimDate[_thisIndex].value[2] += d.reimAmount;
                } //没有这个机构数据，push
                else {
                  remoteReimHash[d.reimFacility] = remoteReimDate.length; //记录index
                  remoteReimDate.push({
                    name: reimFacilityName,
                    value: [
                      facilityInfo[d.reimFacility].x,
                      facilityInfo[d.reimFacility].y,
                      d.reimAmount,
                    ],
                  });
                }
                console.log(lineHash, lines, "lineHash");
                //已经有这两个个机构的异地报销数据，累加
                if (
                  Object.hasOwn(lineHash, d.applyFacility + "" + d.reimFacility)
                ) {
                  const _thisIndex =
                    lineHash[d.applyFacility + "" + d.reimFacility];
                  lines[_thisIndex].value += d.reimAmount;
                  // lines[_thisIndex][1].value += d.reimAmount;
                } //没有这两个机构数据，push
                else {
                  lineHash[d.applyFacility + "" + d.reimFacility] =
                    lines.length; //记录index
                  lines.push(
                    {
                      name: applyFacilityName,
                      coords: [
                        [
                          facilityInfo[d.applyFacility].x,
                          facilityInfo[d.applyFacility].y,
                        ],
                        [
                          facilityInfo[d.reimFacility].x,
                          facilityInfo[d.reimFacility].y,
                        ],
                      ],
                      value: d.reimAmount,
                    },
                    // {
                    //   name: reimFacilityName,
                    //   coords: [
                    //     facilityInfo[d.reimFacility].x,
                    //     facilityInfo[d.reimFacility].y,
                    //   ],
                    //   value: d.reimAmount,
                    // },
                  );
                }
              }
            }
          }
        });
        Object.keys(facilityInfo).forEach((key) => {
          if (!Object.hasOwn(remoteReimHash, key) && key.length == 5) {
            if (Object.hasOwn(localReimHash, key)) {
              pointData.push({
                name: facilityInfo[key].cityName,
                value: [facilityInfo[key].x, facilityInfo[key].y, 1],
              });
            } else {
              pointData.push({
                name: facilityInfo[key].cityName,
                value: [facilityInfo[key].x, facilityInfo[key].y, 0],
              });
            }
          }
        });

        //其他节点数据
        series.push({
          name: "无报销地图节点",
          type: "scatter",
          coordinateSystem: "geo",
          data: pointData,
          symbol: "circle",
          symbolSize: screenWidthData.current.symbolsize_city,
          roam: false, //鼠标缩放
          label: {
            formatter: "{b}",
            position: "top",
            show: true,
            textStyle: {
              //fontFamily: 'SimHei',
              fontSize: screenWidthData.current.fontsize_city,
              fontWeight: "bold",
            },
          },
          itemStyle: {
            color: function (item) {
              if (item.value[2] > 0) {
                return "#0096ff";
              } else {
                return "#5e6e84";
              }
            },
          },
        });

        //本地报销数据
        //本地报销
        series.push({
          name: "本地报销节点",
          type: "scatter",
          coordinateSystem: "geo",
          data: localReimData,
          symbol: "circle",
          symbolSize: screenWidthData.current.symbolsize_reimcity,
          roam: false, //鼠标缩放
          label: {
            //formatter: '{b}',
            formatter: function (item) {
              //return item.name+'\n\n'+item.value[2];
              return "¥" + item.value[2];
            },
            position: [15, -5],
            show: true,
            textStyle: {
              color: "#0096ff",
              //fontFamily: 'SimHei',
              fontSize: screenWidthData.current.fontsize_city,
              fontWeight: "bold",
            },
          },
          itemStyle: {
            color: "#0096ff",
            shadowColor: "rgba(255,255,255,0.3)",
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: 15,
          },
        });

        //异地报销数据
        series.push({
          name: "异地报销节点",
          type: "effectScatter",
          coordinateSystem: "geo",
          data: remoteReimDate,
          symbolSize: screenWidthData.current.symbolsize_reimcity,
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
              color: "#06ebc8",
              //fontFamily: 'SimHei',
              fontSize: screenWidthData.current.fontsize_city,
              fontWeight: "bold",
            },
          },
          itemStyle: {
            color: "#06ebc8" /*,
                        shadowColor: 'rgba(255,255,255,0.3)',
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowBlur: 15*/,
          },
        });
        console.log(
          remoteReimHash,
          lines,
          remoteReimDate,
          localReimData,
          "lines",
        );
        //异地报销连线
        // series.push({
        //   name: "异地报销连线",
        //   type: "lines",
        //   data: lines,
        //   zlevel: 2,
        //   effect: {
        //     show: true,
        //     period: 5,
        //     symbol: "arrow", //arrow circle arrowPath
        //     symbolSize: screenWidthData.current.symbolsize_line,
        //     color: "rgba(8,233,201,1)", //
        //     trailLength: 0, // 0.1
        //   },
        //   lineStyle: {
        //     color: "#06ebc8",
        //     width: 1.5,
        //     opacity: 0.5,
        //     /*,curveness: 0.5*/
        //   },
        //   label: {
        //     show: true,
        //     textStyle: {
        //       color: "#06ebc8",
        //       //fontFamily: 'SimHei',
        //       //fontWeight: 'bold',
        //       fontSize: screenWidthData.current.fontsize_value,
        //     },
        //     formatter: "  ¥{c}  ",
        //     position: "end",
        //   },
        //   animation: false,
        // });
        echartsData.current.setOption({ series: series });
      });
  };

  function initData() {
    const facilityInfoStr = window.sessionStorage.getItem("facilityInfo");
    if (!facilityInfoStr || !JSON.parse(facilityInfoStr)) {
      getRecordsReim(facilityInfo);
    } else {
      const sessionStorageFacilityInfo = JSON.parse(facilityInfoStr);
      getRecordsReim(sessionStorageFacilityInfo);
    }
  }

  return <div className={styles.map_wrap} ref={mapRef}></div>;
};

export default Map;
