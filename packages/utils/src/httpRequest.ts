import axios from "axios"

export class HttpRequest {
  /* 
    isSta: 表示医院端调用血站端的接口
    isLocal: 用来表示请求本地目录下文件
    isShowToast: 表示是否展示toast
    isMap: 高德地图接口
  */
  get(url: string, isMap?: boolean) {
    return this.request({ method: "GET", url }, isMap)
  }
  post(url: string, data?: any, isMap?: boolean) {
    return this.request({ method: "POST", url, data }, isMap)
  }
  request(config: any, isMap?: boolean) {
    const instance = axios.create()
    this.interceptor(instance, isMap)
    return instance(config)
  }
  interceptor(instance: any, isMap?: boolean) {
    // 请求拦截
    instance.interceptors.request.use(
      (config: any) => {
        config.baseURL = isMap
          ? "https://restapi.amap.com/v3"
          : location.origin || ""
        config.timeout = 5000 // 请求超时
        // config.baseURL = process.env.NODE_ENV === 'development' ? 'http://192.168.110.15:85/bigScreen' : 'http://192.168.110.15:85/bigScreen';
        return config
      },

      (error: any) => {
        return Promise.reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      (response: any) => {
        const { status, data } = response
        if (!data.hasOwnProperty("code")) {
          data.code = 0
        }
        return new Promise((resolve, reject) => {
          if (status === 200) {
            if (isMap) {
              resolve(data)
            } else {
              switch (+data.code) {
                case 0: // 正常返回
                  resolve(data)
                  break
                default: // 其余异常
                  reject(data)
                  break
              }
            }
          }
        })
      },
      (error: any) => {
        const {
          request: { status },
        } = error
        return Promise.reject(error)
      }
    )
  }
}
