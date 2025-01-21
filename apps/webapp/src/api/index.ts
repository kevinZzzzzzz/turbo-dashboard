import { funcUtil } from "@/utils";
import { HttpRequest, AxiosResponse } from "@dashboard/utils";
import { formatGetParams } from "hoslink-xxx";
const http = new HttpRequest();
// 设置代理
const setProxy = (url: string): string => {
  return !import.meta.env.PROD ? "/api" + url : url;
};
console.log(import.meta.env, "环境变量");

export default {
  async getServerTime(data: any = {}): Promise<AxiosResponse<any, any>> {
    return await http.get(
      setProxy(`/service/dashboard/servertime${formatGetParams(data)}`),
      false,
    );
  },
  async getFacility(data: any = {}): Promise<AxiosResponse<any, any>> {
    return await http.get(
      setProxy(`/service/dashboard/dicts/facility${formatGetParams(data)}`),
      false,
    );
  },
  async getTypeSumByCity(data: any = {}): Promise<AxiosResponse<any, any>> {
    return await http.get(
      setProxy(
        `/service/dashboard/statistics/bloodstore/typesumbycity${formatGetParams(data)}`,
      ),
      false,
    );
  },
  async getRecords(data: number): Promise<AxiosResponse<any, any>> {
    return await http.get(
      setProxy(`/service/dashboard/records/dispatch?${funcUtil.prox(data)}`),
      false,
    );
  },
  async getReimTotal(data: any = {}): Promise<AxiosResponse<any, any>> {
    return await http.get(
      setProxy(
        `/service/dashboard/statistics/reimTotal${formatGetParams(data)}`,
      ),
      false,
    );
  },
};
