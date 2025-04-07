## ui地址

https://lanhuapp.com/web/#/item/project/detailDetach?tid=bab9fcb9-7665-47b6-b232-38fce35704d0&pid=3dfd221b-bf38-4059-af83-120daa71534a&project_id=3dfd221b-bf38-4059-af83-120daa71534a&image_id=f8cbf61a-050b-48b3-afc7-61768f47d94b&fromEditor=true&type=image

## 链接参数说明

访问链接加上area=js 或 area=fj 即可
js: 江苏
fj: 福建
!!!目前只做了江苏和福建两个地方

```
/App.tsx
// 获取链接上参数 并存储再sessionStorage, 默认江苏 -> js
const area = getUrlParamsByKey("area");
```

并且福建可以有做假数据 链接参数加上?area=fj&demo=1 即可
