export * from "./time";
/* 
  处理元素多个classname，且支持按条件挂载
*/
export const multiClassName = (arr: any) => {
  return arr.map((d: any) => `${d}`).join(" ");
};

/**
 * 获取城市名称
 * @param d
 * @returns
 */
export const getRealCityName = (d) => {
  let name = d.name.substring(0);
  let cityName = "";
  if (d.hasOwnProperty("cityName")) {
    cityName = d.cityName;
  } else if (d.hasOwnProperty("city")) {
    cityName = d.city;
  }
  if (
    name.indexOf(cityName.substr(0, 2)) === -1 ||
    name.indexOf("分中心") > -1
  ) {
    // let keywords = ["省", "自治区", "特别行政区", "市", "区", "县", "血液中心", "分中心", "中心血站", "血站", "分站", "中心血库", "血库"];
    let keywords = [
      "市",
      "区",
      "县",
      "血液中心",
      "分中心",
      "中心血站",
      "中心血库",
    ]; // 福建的关键词，提高效率
    for (let k in keywords) {
      let p = name.indexOf(keywords[k]);
      if (p > -1) {
        if (p >= 2) {
          // 最少两个字
          cityName = name.substring(0, p);
          if (cityName.length >= 4) {
            cityName.substr(0, 2);
          }
        }
        if (p + keywords[k].length <= name.length) {
          name = name.substring(p + keywords[k].length);
        }
        if (cityName !== "" && name === "") {
          // 中断匹配
          break;
        }
      }
    }
  }
  return cityName;
};

export enum keyCodeMapper {
  btnOK = 13,
  btnBack = 27,
  btnUp = 38,
  btnDown = 40,
  btnRight = 39,
  btnLeft = 37,
  btnInfo = 32,
  btnCtrl = 17,
  btnR = 82,
  btnEsc = 27,
  btnF11 = 122,
}

/**
 *    数据标准化
 *    params：num
 */
export const formatNum = function (num: number | string) {
  if (typeof num !== "number" && typeof num !== "string") return;
  if (typeof num === "string" && num.includes("%")) return num;
  if (!num) return 0;
  const nums = typeof num === "number" ? num + "" : num;
  function formatN(data) {
    return data
      .split("")
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + ",") + prev;
      });
  }
  let result: any = 0;
  if (nums.includes(".")) {
    const a = nums.split(".")[0];
    const b = nums.split(".")[1];
    result = formatN(a) + "." + formatN(b);
  } else {
    result = formatN(nums);
  }
  return result;
};
/* 
  获取链接上的参数值
  name: 参数名称
  str: 链接地址
*/
export function getUrlParamsByKey(param: string, url = window.location.href) {
  const reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)", "i");
  const r = url.split("?")[1].match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
