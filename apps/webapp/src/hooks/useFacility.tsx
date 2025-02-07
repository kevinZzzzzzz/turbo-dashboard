import { getRealCityName } from "@/utils";
import { useState, useEffect } from "react";

function UseFacility() {
  const facilityInfo = useRef({});
  useEffect(() => {
    getFacilityInfo();
  }, []);
  const getFacilityInfo = () => {
    let facilityInfoT = {};
    let facilityInfoStr = window.sessionStorage.getItem("facilityInfo");
    if (!facilityInfoStr || !JSON.parse(facilityInfoStr)) {
      // 获取所有机构坐标信息
      window.$api.getFacility().then(function (data) {
        data.forEach((d) => {
          d.facilityCode = d.id;
          d.fullName = d.name;
          d.cityName = getRealCityName(d);
          if (d.id === "90017") {
            // 江苏省血液中心
            d.cityName = "江苏省血";
            d.x += 0.08;
            d.y -= 0.04;
          }
          facilityInfoT[d.id] = d;
        });
        if (data.length > 0) {
          window.sessionStorage.setItem(
            "facilityInfo",
            JSON.stringify(facilityInfoT),
          );
        }
        facilityInfo.current = facilityInfoT;
      });
    } else {
      facilityInfoT = JSON.parse(facilityInfoStr);
      facilityInfo.current = facilityInfoT;
    }
  };

  // 通过机构标号获取机构名称
  function getFacilityName(facility) {
    if (facilityInfo.current.hasOwnProperty(facility)) {
      return facilityInfo.current[facility].name;
    } else if (facilityInfo.current.hasOwnProperty(facility.substring(0, 5))) {
      return facilityInfo.current[facility.substring(0, 5)].name;
    } else {
      return "";
    }
  }

  // 多条件通过机构码获取机构名称
  const getFacilityValue = function (facility, type) {
    if (facilityInfo.current.hasOwnProperty(facility)) {
      return facilityInfo.current[facility][type];
    } else if (facilityInfo.current.hasOwnProperty(facility.substring(0, 5))) {
      return facilityInfo.current[facility.substring(0, 5)][type];
    } else {
      return "";
    }
  };
  // 通过机构码获取与字典一致的机构码
  const getRealFacilityCode = function (facility) {
    if (facility) {
      let code = facility;
      if (code.length === 12) {
        code = facility.substring(0, 7);
      } else if (code.length === 10) {
        code = facility.substring(0, 5);
      }

      if (facilityInfo.hasOwnProperty(code)) {
        return code;
      } else if (facilityInfo.hasOwnProperty(code.substring(0, 5))) {
        return code.substring(0, 5);
      }
    }
    return facility;
  };
  return {
    facilityInfo,
    getFacilityName,
    getFacilityValue,
    getRealFacilityCode,
  };
}
export default UseFacility;
