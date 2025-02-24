import { useRef, useEffect } from "react";
import * as echarts from "echarts";
import styles from "./index.module.scss";
import UseFacility from "@/hooks/useFacility";
import moment from "moment";
import { formatNum, getTheMoment } from "@/utils";
import { areaMap } from "@/constant/area";

const peoplePath =
  "path://M340.995,302.885c7.896,0,14.295-6.228,14.295-13.912c0-7.681-6.398-13.906-14.295-13.906   c-7.893,0-14.291,6.225-14.291,13.906C326.704,296.657,333.103,302.885,340.995,302.885z M355.068,305.751h-28.149   c-10.629,0-19.255,8.36-19.312,18.689c0,0.019-0.003,0.038-0.003,0.054v36.797c0,3.311,2.761,6,6.164,6   c3.406,0,6.168-2.689,6.168-6v-34.089h2.944v97.121c0,4.449,3.707,8.051,8.275,8.051c4.572,0,8.275-3.602,8.275-8.051v-57.088   h3.131v57.088c0,4.449,3.703,8.051,8.272,8.051c4.575,0,8.278-3.602,8.278-8.051v-97.121h2.944v34.089c0,3.311,2.755,6,6.168,6   c3.399,0,6.161-2.689,6.161-6V324.44C374.33,314.111,365.704,305.751,355.068,305.751z";

const markerPath =
  "path://M336.344,416.006c-5.559,20.342-37.852,61.495-37.852,61.495  s-27.896-32.856-37.736-57.299c-0.805-1.824-1.572-3.703-1.991-5.7c-1.609-6.748-1.268-11.613-1.268-9.992  c0-22.364,18.13-41.995,40.495-41.995c22.364,0,40.495,18.13,40.495,40.495C338.487,407.558,337.727,411.926,336.344,416.006z   M297.983,375.5c-15.186,0-27.497,12.311-27.497,27.497c0,15.186,12.311,27.497,27.497,27.497s27.497-12.311,27.497-27.497  C325.479,387.811,313.169,375.5,297.983,375.5z M297.979,417.504c-8.007,0-14.499-6.491-14.499-14.499  c0-8.007,6.491-14.498,14.499-14.498c8.007,0,14.498,6.491,14.498,14.498C312.477,411.013,305.985,417.504,297.979,417.504z";

function converColor(value) {
  if (value >= 400) {
    return "rgba(101,28,238,1)";
  } else if (value >= 300) {
    return "rgba(116,68,206,1)";
  } else if (value >= 200) {
    return "rgba(1,149,255,1)";
  } else if (value >= 100) {
    return "rgba(0,216,255,1)";
  } else {
    return "rgba(8,233,201,1)";
  }
}

const Map = ({ changeNoticeData }) => {
  const area = sessionStorage.getItem("area");
  const { facilityInfo, getRealFacilityCode } = UseFacility();
  const mapRef = useRef(null);
  const echartsData = useRef(null);

  const echartsOption = {
    title: {
      show: false,
    },
    backgroundColor: "rgba(27,27,27,0)",
    geo: {
      map: areaMap[area]["name"],
      label: {
        emphasis: {
          show: false,
        },
      },
      roam: false, //鼠标缩放
      top: 25,
      bottom: 35,
      itemStyle: {
        areaColor: "rgba(50,60,72,0)",
        borderColor: "#39476a",
        borderWidth: 2,
        emphasis: {
          areaColor: "rgba(42,51,61,1)",
        },
      },
    },
    calculable: true,
  };

  const screenWidthData = useRef({
    symbolsize_city: 7,
    symbolsize_reimcity: 8,
    symbolsize_line: 7,
    fontsize_city: 15,
    symbolsize_point: 13,
    fontsize_value: 13,
    symbolsize_person: [11, 26],
    symbolsize_pin: [13, 17],
  });

  const initScreenWidthData = () => {
    const screenwidth = window.screen.width;
    if (screenwidth >= 1920) {
      screenWidthData.current.symbolsize_city = 8;
      screenWidthData.current.symbolsize_reimcity = 10;
      screenWidthData.current.symbolsize_line = 8;
      screenWidthData.current.fontsize_city = 14;
      screenWidthData.current.symbolsize_point = 15;
      screenWidthData.current.fontsize_value = 12;
      screenWidthData.current.symbolsize_pin = [17, 23];
      screenWidthData.current.symbolsize_person = [15, 34];
    }
  };

  useEffect(() => {
    initScreenWidthData();
    echartsData.current = echarts.init(mapRef.current);
    echartsData.current.hideLoading();
    echartsData.current.setOption(echartsOption);
    initData();
  }, []);

  const getRecordsReim = (facilityInfo) => {
    const today = getTheMoment();

    //获取机构献血人数
    const donationAjax = window.$api.getDonationBystation({
      startTime:
        moment(today).subtract(2, "day").format("YYYY-MM-DD") +
        " " +
        moment(today).format("HH:mm:ss"),
      endTime: moment(today).format("YYYY-MM-DD HH:mm:ss"),
    });

    const banlistAjax = window.$api.getHrdBystation({
      startTime:
        moment(today).subtract(2, "day").format("YYYY-MM-DD") +
        " " +
        moment(today).format("HH:mm:ss"),
      endTime: moment(today).format("YYYY-MM-DD HH:mm:ss"),
    });

    Promise.all([donationAjax, banlistAjax]).then(([data1, data2]) => {
      //献血人数
      const donations = [];
      //屏蔽及献血统计
      const data = {
        shield: 0,
        report: 0,
        donors: 0,
      };
      const cityPointData = [];
      const banlistPointData = [];
      const series = [];

      const donation = data1;
      const banlist = data2;
      if (donation.length > 0) {
        donation.forEach((d, i) => {
          d.station = getRealFacilityCode(d.station);
          const cityName = Object.hasOwn(facilityInfo, d.station)
            ? facilityInfo[d.station].cityName
            : d.station;
          if (facilityInfo.hasOwnProperty(d.station)) {
            donations.push({
              name: cityName,
              value: [
                facilityInfo[d.station].x,
                facilityInfo[d.station].y,
                d.people,
              ],
            });
          }
          //计算献血数量
          if (!data.donors) data.donors = 0;
          data.donors += d.people;
        });
      }

      if (banlist.length > 0) {
        banlist.forEach((d, i) => {
          const cityName = Object.hasOwn(facilityInfo, d.station)
            ? facilityInfo[d.station].cityName
            : d.station;

          if (
            d.station !== null &&
            d.station !== "" &&
            facilityInfo.hasOwnProperty(d.station)
          ) {
            banlistPointData.push({
              name: cityName,
              value: [
                facilityInfo[d.station].x,
                facilityInfo[d.station].y,
                d.Amount,
              ],
            });
            //计算屏蔽数量
            if (!data.shield) data.shield = 0;
            data.shield += d.Amount;
          } else {
            if (!data.report) data.report = 0;
            data.report += d.Amount;
          }
        });
      }

      Object.keys(facilityInfo).forEach((key) => {
        if (key.length === 5) {
          cityPointData.push({
            name: facilityInfo[key].cityName,
            value: [facilityInfo[key].x, facilityInfo[key].y, 1],
          });
        }
      });

      //临时特殊处理
      for (let i = 0; i < cityPointData.length; i++) {
        if (cityPointData[i].value[0] == 118.77977) {
          cityPointData[i].value[0] -= 0.1;
          cityPointData[i].value[1] += 0.1;
        }
        if (cityPointData[i].value[0] == 32.08964) {
          cityPointData[i].value[0] += 0.1;
          cityPointData[i].value[1] -= 0.1;
        }
      }

      //城市名称数据
      series.push({
        name: "城市名称",
        type: "scatter",
        coordinateSystem: "geo",
        data: cityPointData,
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
          color: "#5e6e84",
        },
      });

      //献血人群数据
      series.push({
        name: "献血人群分布",
        type: "scatter",
        coordinateSystem: "geo",
        data: donations,
        symbol: peoplePath,
        symbolSize: screenWidthData.current.symbolsize_person,
        roam: false, //鼠标缩放
        label: {
          position: "bottom",
          show: false,
          textStyle: {
            //color: '#ba00ff',
            //fontFamily: 'SimHei',
            fontSize: screenWidthData.current.fontsize_city,
            fontWeight: "bold",
          },
        },
        itemStyle: {
          color: function (item) {
            return converColor(item.value[2]);
          },
        },
      });

      series.push({
        name: "屏蔽点动画",
        type: "effectScatter",
        coordinateSystem: "geo",
        data: banlistPointData,
        symbolSize: screenWidthData.current.symbolsize_point,
        symbolOffset: [10, 14],
        showEffectOn: "render",
        rippleEffect: {
          brushType: "stroke",
        },
        roam: false, //鼠标缩放
        label: {
          position: "top",
          show: false,
          textStyle: {
            //color: '#ba00ff',
            //fontFamily: 'SimHei',
            fontSize: screenWidthData.current.fontsize_city,
            fontWeight: "bold",
          },
        },
        itemStyle: {
          color: "rgba(255,0,0,0.5)", //原来颜色rgba(186, 0, 186, 0.5)
        },
      });

      series.push({
        name: "屏蔽地标",
        type: "scatter",
        coordinateSystem: "geo",
        data: banlistPointData,
        symbol: markerPath,
        symbolSize: screenWidthData.current.symbolsize_pin,
        symbolOffset: [10, 6],
        roam: false, //鼠标缩放
        label: {
          position: "bottom",
          show: true,
          formatter: function (item) {
            return item.value[2];
          },
          textStyle: {
            //color: '#ba00ff',
            //fontFamily: 'SimHei',
            fontWeight: "bold",
            fontSize: screenWidthData.current.fontsize_city,
          },
        },
        itemStyle: {
          color: "red", //原来颜色ba00ba
        },
      });
      changeNoticeData(data);
      echartsData.current.setOption({ series: series });
    });
  };

  function initData() {
    const facilityInfoStr = window.sessionStorage.getItem("facilityInfo");
    if (!facilityInfoStr || !JSON.parse(facilityInfoStr)) {
      getRecordsReim(facilityInfo.current);
    } else {
      const sessionStorageFacilityInfo = JSON.parse(facilityInfoStr);
      getRecordsReim(sessionStorageFacilityInfo);
    }
  }

  return <div className={styles.map_wrap} ref={mapRef}></div>;
};

export default Map;
