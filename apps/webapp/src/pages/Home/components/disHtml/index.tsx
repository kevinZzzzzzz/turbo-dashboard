import React, { useState, useEffect, memo } from "react";
import { keyCodeMapper, multiClassName } from "@/utils";
import styles from "./index.module.scss";
import MapComp from "./map";
import RealTimeRecord from "./realTimeRecord";
import StatisComp from "./statisComp";
import UseFacility from "@/hooks/useFacility";
import UseReload from "@/hooks/useReload";

const bloodInventoryList = [
  {
    label: "红细胞",
    value: "rbc",
  },
  {
    label: "血小板",
    value: "plt",
  },
  {
    label: "血浆",
    value: "plm",
  },
  {
    label: "冷沉淀",
    value: "crp",
  },
];
enum bloodInventoryKeyMap {
  "rbc" = 0,
  "plt" = 1,
  "plm" = 2,
  "crp" = 3,
}
const bloodInventMap = {
  rbc: [1000, 3000, 5000, 8000],
  plt: [50, 100, 200, 500],
  plm: [5000, 10000, 15000, 20000],
  crp: [1000, 2000, 3000, 5000],
};
enum bloodInventoryEnum {
  "红细胞类" = "rbc",
  "血小板类" = "plt",
  "血浆类" = "plm",
  "冷沉淀类" = "crp",
}
type bloodType = "rbc" | "plt" | "plm" | "crp";
//分界值数组

//默认统计数据
// let default_bloodgroup = "amount"; //ABO总计;
function DisPage(props: any) {
  const area = sessionStorage.getItem("area");
  //血液库存与调剂数据对象
  let bloodStoreData = { rbc: [], plt: [], plm: [], crp: [] };
  let dispatchData = { rbc: [], plt: [], plm: [], crp: [] };
  let pointData = { rbc: [], plt: [], plm: [], crp: [] };
  const [bloodType, setBloodType] = useState<bloodType>("rbc");
  const [bloodStore, setBloodStore] = useState(bloodStoreData);
  const [dispatchDataStore, setDispatchDataStore] = useState(dispatchData);
  const [pointDataStore, setPointDataStore] = useState(pointData);
  const [isMapMounted, setIsMapMounted] = useState(false);
  const { reloadNum } = UseReload();
  const { facilityInfo, getFacilityName } = UseFacility();

  useEffect(() => {
    initBuildMap();
    initKeydown(true);
    return () => {
      setIsMapMounted(false);
      initKeydown(false);
    };
  }, [reloadNum]);
  /**
   * 处理切换血液类型
   * @param type 血液类型
   */
  const handleChangeBloodType = (type) => {
    setBloodType(type);
  };
  // 库存刻度数值
  const captionList = useMemo(() => {
    const listT = bloodInventMap[bloodType];
    const arrT: Array<string> = [];
    listT.forEach((d, i) => {
      if (!i) {
        arrT.push(`0-${d}U`);
      } else if (i == listT.length - 1) {
        arrT.push(`${listT[i - 1]}-${d}U`);
        arrT.push(`≥${d}U`);
      } else {
        arrT.push(`${listT[i - 1]}-${d}U`);
      }
    });
    return arrT;
  }, [bloodType]);

  // 初始化地图数据展示
  const initBuildMap = () => {
    const getTypeSumByCity = window.$api.getTypeSumByCity({
      type: "all",
      province: area,
    });
    const getRecords = window.$api.getRecords(45);
    Promise.all([getTypeSumByCity, getRecords]).then((res: any) => {
      const [stores, dispatches] = res;
      let facilityStore_hash = { rbc: {}, plt: {}, plm: {}, crp: {} }; // 各机构库存情况
      let points_hash = { rbc: {}, plt: {}, plm: {}, crp: {} }; // 排重需要的HASH MAP
      let dispatch_map = { rbc: {}, plt: {}, plm: {}, crp: {} }; // 同个调拨路径的 MAP
      stores?.forEach((d) => {
        if (d.type) {
          // 各机构总库存情况
          facilityStore_hash[d.type][d.facility] = d["amount"];
        }
      });
      // 处理调剂关系线路列表
      dispatches?.forEach((m) => {
        let bloodType = bloodInventoryEnum[m.bloodType] || "";
        if (bloodType) {
          let t = [];
          const stationFrom = m.stationFrom?.substring(0, 5);
          const stationTo = m.stationTo?.substring(0, 5);
          // 已经有相同路径的调剂数据
          if (
            dispatch_map[bloodType].hasOwnProperty(stationFrom + "" + stationTo)
          ) {
            const _index =
              dispatch_map[bloodType][stationFrom + "" + stationTo];
            if (
              dispatchData[bloodType][_index] &&
              dispatchData[bloodType][_index].length
            ) {
              dispatchData[bloodType][_index][0].value += m.amount;
              dispatchData[bloodType][_index][1].value += m.amount;
            }
          } else {
            if (facilityInfo.current.hasOwnProperty(stationFrom)) {
              t.push({
                name: facilityInfo.current[stationFrom].cityName,
                coord: [
                  facilityInfo.current[stationFrom].x,
                  facilityInfo.current[stationFrom].y,
                ],
                value: m.amount,
              });
              if (!points_hash[bloodType].hasOwnProperty(stationFrom)) {
                pointData[bloodType].push({
                  name: facilityInfo.current[stationFrom].cityName,
                  value: [
                    facilityInfo.current[stationFrom].x,
                    facilityInfo.current[stationFrom].y,
                    facilityStore_hash[bloodType][stationFrom],
                  ],
                });
                points_hash[bloodType][stationFrom] = true;
              }
            }
            if (facilityInfo.current.hasOwnProperty(stationTo)) {
              t.push({
                name: facilityInfo.current[stationTo].cityName,
                coord: [
                  facilityInfo.current[stationTo].x,
                  facilityInfo.current[stationTo].y,
                ],
                value: m.amount,
              });
              if (!points_hash[bloodType].hasOwnProperty(stationTo)) {
                pointData[bloodType].push({
                  name: facilityInfo.current[stationTo].cityName,
                  value: [
                    facilityInfo.current[stationTo].x,
                    facilityInfo.current[stationTo].y,
                    facilityStore_hash[bloodType][stationTo],
                  ],
                });
                points_hash[bloodType][stationTo] = true;
              }
            }
            dispatchData[bloodType].push(t);
            dispatch_map[bloodType][stationFrom + "" + stationTo] =
              dispatchData[bloodType].length - 1;
          }
        }
      });
      for (let i in dispatchData) {
        let n = dispatchData[i];
        if (n.length > 0) {
          let temp = n;
          dispatchData[i] = [];
          temp.forEach((d) => {
            if (d[0] && d[1]) {
              dispatchData[i].push({
                coords: [d[0]?.coord, d[1]?.coord],
                name: d[0]?.name,
                value: d[0]?.value,
              });
            }
          });
        }
      }
      // 库存数据
      stores?.forEach((o) => {
        if (
          !points_hash[o.type].hasOwnProperty(o.facility) &&
          facilityInfo.current.hasOwnProperty(o.facility)
        ) {
          // 排除与调剂节点重复的点
          bloodStoreData[o.type].push({
            name: facilityInfo.current[o.facility].cityName,
            value: [
              facilityInfo.current[o.facility].x,
              facilityInfo.current[o.facility].y,
              o["amount"],
            ],
          });
        }
      });
      setIsMapMounted(true);
      // 库存网点
      setBloodStore(bloodStoreData);
      // 调拨血袋数量
      setDispatchDataStore(dispatchData);
      // 调拨起始点
      setPointDataStore(pointData);
    });
  };
  const initKeydown = (flag) => {
    let pointIdx = bloodInventoryKeyMap[bloodType];
    window[flag ? "addEventListener" : "removeEventListener"](
      "keydown",
      (event: any) => {
        !keyCodeMapper[event.keyCode] && event.preventDefault();
        switch (event.keyCode) {
          case keyCodeMapper.btnUp:
            pointIdx = !pointIdx ? 3 : pointIdx - 1;
            handleChangeBloodType(bloodInventoryKeyMap[pointIdx]);
            break;
          case keyCodeMapper.btnDown:
            pointIdx = pointIdx == 3 ? 0 : pointIdx + 1;
            handleChangeBloodType(bloodInventoryKeyMap[pointIdx]);
            break;
          default:
            break;
        }
      },
    );
  };
  return (
    <div className={styles.page}>
      <div className={styles.page_pageLeft}>
        <h2 className={styles.page_pageLeft_title}>血液库存与调剂监控</h2>
        <ul className={styles.page_pageLeft_control}>
          {bloodInventoryList?.map((d, i) => {
            return (
              <li
                key={i}
                className={multiClassName([
                  styles.page_pageLeft_control_item,
                  bloodType === d.value &&
                    styles["page_pageLeft_control_item-active"],
                ])}
                onClick={() => {
                  handleChangeBloodType(d.value);
                }}
              >
                {d.label}
              </li>
            );
          })}
        </ul>
        <div className={styles.page_pageLeft_caption}>
          <div className={styles.page_pageLeft_caption_mark}>
            <div className={styles.page_pageLeft_caption_mark_img}></div>
            <ul className={styles.page_pageLeft_caption_mark_list}>
              {captionList?.map((d, i) => {
                return (
                  <li
                    className={styles.page_pageLeft_caption_mark_list_item}
                    key={i}
                  >
                    {d}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={styles.page_pageLeft_caption_statis}>
            <StatisComp />
          </div>
        </div>
        {isMapMounted && (
          <MapComp
            bloodType={bloodType}
            bloodStoreData={bloodStore}
            dispatchData={dispatchDataStore}
            pointData={pointDataStore}
            bloodInventMap={bloodInventMap}
          />
        )}
      </div>
      <div className={styles.page_pageRight}>
        <RealTimeRecord
          facilityInfo={facilityInfo}
          getFacilityName={getFacilityName}
        />
      </div>
    </div>
  );
}
export default memo(DisPage);
