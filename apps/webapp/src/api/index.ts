import { funcUtil, getUrlParamsByKey } from "@/utils";
import { HttpRequest, AxiosResponse } from "@dashboard/utils";
import { formatGetParams } from "hoslink-xxx";
const http = new HttpRequest();
// 设置代理
const setProxy = (url: string): string => {
  return !import.meta.env.PROD ? "/api" + url : url;
};
console.log(import.meta.env, "环境变量");
const fakeMode = !!getUrlParamsByKey("demo");
console.log(fakeMode, "fakeMode11111111");
export default {
  async getServerTime(data?: any): Promise<AxiosResponse<any, any>> {
    return await http.get(
      !fakeMode
        ? setProxy(`/service/dashboard/servertime${formatGetParams(data)}`)
        : "./json/servertime.json?v=1",
      false,
    );
  },
  async getFacility(data?: any): Promise<AxiosResponse<any, any>> {
    return await http.get(
      !fakeMode
        ? setProxy(`/service/dashboard/dicts/facility${formatGetParams(data)}`)
        : "./json/facility.json?v=1",
      false,
    );
  },
  async getTypeSumByCity(data?: any): Promise<AxiosResponse<any, any>> {
    return await http.get(
      !fakeMode
        ? setProxy(
            `/service/dashboard/statistics/bloodstore/typesumbycity${formatGetParams(data)}`,
          )
        : "./json/typesumbycity.json?v=1",
      false,
    );
  },
  async getRecords(data: number): Promise<AxiosResponse<any, any>> {
    return await http.get(
      !fakeMode
        ? setProxy(`/service/dashboard/records/dispatch?${funcUtil.prox(data)}`)
        : "./json/recordDispatch.json?v=1",
      false,
    );
  },
  async getReimTotal(data?: any): Promise<AxiosResponse<any, any>> {
    return await http.get(
      setProxy(
        `/service/dashboard/statistics/reimTotal${formatGetParams(data)}`,
      ),
      false,
    );
  },
  async getEventsList(data: number): Promise<AxiosResponse<any, any>> {
    return await http.get(
      !fakeMode
        ? setProxy(`/service/dashboard/events/dispatch?${funcUtil.prox(data)}`)
        : "./json/eventsDispatch.json?v=1",
      false,
    );
  },
  async getStatisticsByBloodSubtype(
    data: number,
  ): Promise<AxiosResponse<any, any>> {
    return await http.get(
      !fakeMode
        ? setProxy(
            `/service/dashboard/statistics/dispatch/bybloodsubtype?${funcUtil.prox(data)}`,
          )
        : "./json/bybloodsubtype.json?v=1",
      false,
    );
  },
  async getReimRelation(data?: any): Promise<AxiosResponse<any, any>> {
    return await http.get(
      setProxy(
        `/service/dashboard/statistics/v1/reimRelation${formatGetParams(data)}`,
      ),
      false,
    );
  },
  async getReimFacilityStatistics(
    data?: any,
  ): Promise<AxiosResponse<any, any>> {
    return await http.get(
      setProxy(
        `/service/dashboard/statistics/reimFacility${formatGetParams(data)}`,
      ),
      false,
    );
  },
  async getOnline(data?: any): Promise<AxiosResponse<any, any>> {
    return await http.get(setProxy(`/service/network/status`), false);
  },
  async getReimDay(data?: any): Promise<AxiosResponse<any, any>> {
    return await http.get(
      setProxy(`/service/dashboard/statistics/reimDay${formatGetParams(data)}`),
      false,
    );
  },
  async getReimDetail(data?: any): Promise<AxiosResponse<any, any>> {
    return await http.get(
      setProxy(
        `/service/dashboard/statistics/v1/reimDetail${formatGetParams(data)}`,
      ),
      false,
    );
  },
  async getRecordsReim(data?: any): Promise<AxiosResponse<any, any>> {
    return await http.get(
      setProxy(`/service/dashboard/records/reim${formatGetParams(data)}`),
      false,
    );
  },
  async getEventsReim(data?: any): Promise<AxiosResponse<any, any>> {
    return await http.get(
      setProxy(`/service/dashboard/events/reim${formatGetParams(data)}`),
      false,
    );
  },
  async getReimRemoteType(data?: any): Promise<AxiosResponse<any, any>> {
    return await http.get(
      setProxy(
        `/service/dashboard/statistics/reim/remotetype${formatGetParams(data)}`,
      ),
      false,
    );
  },
  async getDonationBystation(data?: any): Promise<AxiosResponse<any, any>> {
    return await http.get(
      setProxy(
        `/service/dashboard/statistics/donation/bystation${formatGetParams(data)}`,
      ),
      false,
    );
  },
  async getHrdBystation(data?: any): Promise<AxiosResponse<any, any>> {
    return await http.get(
      setProxy(
        `/service/dashboard/statistics/hrd/bystation${formatGetParams(data)}`,
      ),
      false,
    );
  },
  async getEventsHrd(data?: any): Promise<AxiosResponse<any, any>> {
    return await http.get(
      setProxy(`/service/dashboard/events/hrd${formatGetParams(data)}`),
      false,
    );
  },
};
