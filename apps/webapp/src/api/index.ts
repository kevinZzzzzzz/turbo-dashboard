import { HttpRequest, AxiosResponse } from "@dashboard/utils";
const http = new HttpRequest();
// 设置代理
const setProxy = (url: string): string => {
  return !import.meta.env.PROD ? "/api" + url : url;
};
console.log(import.meta.env, "环境变量");

const getReimTotal = async (
  data: any = {},
): Promise<AxiosResponse<any, any>> => {
  return await http.get(
    setProxy("/service/dashboard/statistics/reimTotal"),
    false,
  );
};
getReimTotal();
export default {
  /*
    for example：
  */
  async getReimTotal(data: any = {}): Promise<AxiosResponse<any, any>> {
    return await http.get(
      setProxy("/service/dashboard/statistics/reimTotal"),
      false,
    );
  },
};
