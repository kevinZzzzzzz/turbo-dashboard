export class DateTimeFormat {
  pattern: any;
  str: string;
  constructor(pattern) {
    this.pattern = pattern;
  }
  parse(str: string) {
    this.str = str;
    let date = getTheMoment();
    let y = this._getVal("y+", 2100);
    date.setFullYear(y ? (y < 100 ? y + 1900 : y) : 1970);
    //
    let m = this._getVal("M+", 12);
    date.setMonth(m ? m - 1 : 0);
    date.setDate(this._getVal("d+", 31) || 1);
    //
    date.setHours(this._getVal("H+", 23) || this._getVal("h+", 23) || 0);
    date.setMinutes(this._getVal("m+", 59) || 0);
    date.setSeconds(this._getVal("s+", 59) || 0);
    return date;
  }
  format(date) {
    let fmt = this.pattern;
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length),
      );
    }
    let o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "H+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
    };
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length),
        );
      }
    }
    return fmt;
  }
  _getVal(partRegex, maxValue) {
    if (new RegExp("(" + partRegex + ")").test(this.pattern)) {
      let rightLen = RegExp.rightContext.length || 0;
      let idx = RegExp.leftContext.length || 0;
      let len = this.pattern.length - rightLen;
      let val: any = this.str.substring(idx, len);
      val = new Number(val);
      if (val == "00") {
        return "00";
      }
      if (!isNaN(val) && val > 0 && val <= maxValue) {
        return val;
      } else {
        throw new Error(
          "Date[" +
            this.str +
            "] format error,pattern=" +
            this.pattern +
            ",partRegex=" +
            partRegex,
        );
      }
    }
    return false;
  }
}
/**
 * 获取服务器当前时间
 * @returns
 */
export const getTheMoment = () => {
  let d = new Date();
  let o = d.getTimezoneOffset() * 60 * 1000; // 时区毫秒数，某些设备默认不是中国时区
  let z = 8 * 60 * 60 * 1000; // 中国时区毫秒数，东八区
  let ms = d.getTime() + o + z + window.serverTimeDiff;
  return new Date(ms);
};

export const funcUtil = {
  toString: function (obj) {
    if (obj) {
      return JSON.stringify(obj);
    } else {
      return "" + obj;
    }
  },
  log: function (obj) {
    if (window.console) {
      if (obj && typeof obj == "object") {
        obj = this.toString(obj);
      }
      console.log(obj);
    }
  },
  logAble: function () {
    return window.console != null;
  },
  error: function (obj) {
    if (window.console && window.console.error) {
      console.error(obj);
    } else {
      if (window.Error) {
        throw new Error(obj);
      } else {
        alert(obj);
      }
    }
  },
  formatDate: function (date, pattern) {
    return new DateTimeFormat(pattern).format(date);
  },
  parseDate: function (dateStr, pattern) {
    return new DateTimeFormat(pattern).parse(dateStr);
  },
  prox: function (day) {
    let today = getTheMoment();
    let endTime = new DateTimeFormat("yyyy-MM-dd hh:mm:ss").format(today);
    let t = today.getTime() - 1000 * 60 * 60 * 24 * day;
    let yesterday = new Date(t);
    let startTime = new DateTimeFormat("yyyy-MM-dd hh:mm:ss").format(yesterday);
    return "startTime=" + startTime + "&endTime=" + endTime;
  },
  current: function () {
    let today = getTheMoment();
    let t = today.getTime() - 1000 * 60 * 60 * 24;
    let yesterday = new Date(t);
    yesterday.setHours(23);
    yesterday.setMinutes(59);
    yesterday.setSeconds(59);
    yesterday.setMilliseconds(59);
    let startTime = new DateTimeFormat("yyyy-MM-dd hh:mm:ss").format(yesterday);
    let endTime = new DateTimeFormat("yyyy-MM-dd hh:mm:ss").format(today);
    return "startTime=" + startTime + "&endTime=" + endTime;
  },
};
