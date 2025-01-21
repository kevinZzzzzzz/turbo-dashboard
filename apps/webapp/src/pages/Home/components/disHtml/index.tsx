import React, { useState, useEffect, memo } from "react";
import { multiClassName } from "@/utils";
import styles from "./index.module.scss";
import MapComp from "./map";
import UseFacility from "@/hooks/useFacility";

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

//血液库存与调剂数据对象
let bloodStoreData = { rbc: [], plt: [], plm: [], crp: [] };
let dispatchData = { rbc: [], plt: [], plm: [], crp: [] };
let pointData = { rbc: [], plt: [], plm: [], crp: [] };
//默认血型
let default_bloodgroup = "amount"; //ABO总计
//获取数据期限
let getDay = 14;
function DisPage(props: any) {
  const [bloodType, setBloodType] = useState<bloodType>("rbc");
  const [bloodStore, setBloodStore] = useState(bloodStoreData);
  const [dispatchDataStore, setDispatchDataStore] = useState(dispatchData);
  const [pointDataStore, setPointDataStore] = useState(pointData);
  const [isMapMounted, setIsMapMounted] = useState(false);
  const { facilityInfo } = UseFacility();

  useEffect(() => {
    initBulidMap();
  }, []);
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

  const initBulidMap = () => {
    const getTypeSumByCity = window.$api.getTypeSumByCity({ type: "all" });
    const getRecords = window.$api.getRecords(45);
    Promise.all([getTypeSumByCity, getRecords]).then((res: any) => {
      const [stores, dispatches] = res;

      let facilityStore_hash = { rbc: {}, plt: {}, plm: {}, crp: {} }; // 映射库存需要
      let points_hash = { rbc: {}, plt: {}, plm: {}, crp: {} }; // 排重需要的HASH MAP
      let dispatch_map = { rbc: {}, plt: {}, plm: {}, crp: {} }; // 同个调拨路径的 MAP
      stores?.forEach((d) => {
        if (d.type) {
          facilityStore_hash[d.type][d.facility] = d[default_bloodgroup];
        }
      });
      dispatches?.forEach((m) => {
        let bloodType = bloodInventoryEnum[m.bloodType] || "";
        if (bloodType) {
          let t = [];
          let stationFrom = m.stationFrom;
          stationFrom = stationFrom.substring(0, 5);
          let stationTo = m.stationTo;
          stationTo = stationTo.substring(0, 5);
          // 已经有相同路径的调剂数据
          if (
            dispatch_map[bloodType].hasOwnProperty(stationFrom + "" + stationTo)
          ) {
            let _index = dispatch_map[bloodType][stationFrom + "" + stationTo];
            dispatchData[bloodType][_index][0].value += m.amount;
            dispatchData[bloodType][_index][1].value += m.amount;
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
      for (var i in dispatchData) {
        let n = dispatchData[i];
        if (n.length > 0) {
          let temp = n;
          dispatchData[i] = [];
          temp.forEach((d) => {
            let m = {
              coords: [d[0].coord, d[1].coord],
              name: d[0].name,
              value: d[0].value,
            };
            dispatchData[i].push(m);
          });
        }
      }
      // 库存数据
      stores.forEach((o) => {
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
              o[default_bloodgroup],
            ],
          });
        }
      });
      console.log(
        bloodStoreData,
        dispatchData,
        pointData,
        "bloodStoreData, dispatchData, pointData-----111-----",
      );
      setIsMapMounted(true);
      setBloodStore(bloodStoreData);
      setDispatchDataStore(dispatchData);
      setPointDataStore(pointData);
    });
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
          <div className={styles.page_pageLeft_caption_img}></div>
          <ul className={styles.page_pageLeft_caption_list}>
            {captionList?.map((d, i) => {
              return (
                <li className={styles.page_pageLeft_caption_list_item} key={i}>
                  {d}
                </li>
              );
            })}
          </ul>
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
      <div className={styles.page_pageRight}></div>
    </div>
  );
}
export default memo(DisPage);
