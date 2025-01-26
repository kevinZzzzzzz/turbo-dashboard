import React, { useState, useEffect, memo } from "react";
import styles from "./index.module.scss";
import lengendImg from "@/assets/images/reim/lengend.png";

const Reim = () => {
  return (
    <>
      <div className={styles["container-fluid"] + " " + styles.map_example}>
        <div id="mapleft">
          <div className={styles["charts-wrap"]}>
            <div className={styles["page-title"]}>本地报销与异地报销监控</div>
            <div id="map2" className={styles.map}></div>

            <div className={styles.caption}>
              <div className={styles.lengend}>
                <img src={lengendImg} />
              </div>
              <div
                className={styles["scroll-outWrap"]}
                id="statisticsTemplateDiv"
              >
                <script type="text/template" id="statisticsTemplate">
                  <ul className="marquee-content-items">
                    {/* <marquee direction="up" scrolldelay="200" height="100%">
                        <li><span className="icon_action">截止当前<%=endTime%>止：</span>已接收</li>
                        <li>本地报销<%=datas.localReimTimes%>笔(<%=datas.localReimAmount%>元)</li>
                        <li>异地报销<%=datas.remoteReimTimes%>笔(<%=datas.remoteReimAmount%>元)</li>
                        <li>累计报销<%=datas.localReimAmount+datas.remoteReimAmount%>元</li>
                    </marquee> */}
                  </ul>
                </script>
              </div>
            </div>
          </div>
        </div>
        <div id="maplog">
          <div className="panel panel-default">
            <div className="panel-heading">
              <b>实时监控记录</b>
              <span id="recordCount" className="badge badge-purple"></span>
            </div>
            <div className="panel-body">
              <div className="log-scroll" id="logWarp"></div>
              {/* <script type="text/template" id="logTemplate">
              <%if(datas.length>0){%>
              <ul className="log_list">
                  <%for(var i=0;i
                  <datas.length
                  ;i++){ var d=datas[i];%>
                  <li className="news-item">
                      <p className="log-title">
                          <span><%=d.name%></span>
                          <span className="text-<%=d.label%>"><%if(d.label=='regular'){%>本地报销<%}else if(d.label=='success'){%>异地报销<%}%></span>
                          <span><%=d.time%></span>
                      </p>

                      <div className="log-info"><%=d.desc%></div>
                  </li>
                  <%}%>
              </ul>
              <%}else{%>
              <p className="no-logData">暂无更新</p>
              <%}%>
            </script> */}
            </div>
          </div>
        </div>
      </div>
      <div className="footer hidden">
        <div className="item">
          <span>
            <i className="glyphicon glyphicon-arrow-left"></i>血液库存与调剂监控
          </span>
        </div>
        <div className="item item_selected">
          <span>本地报销与异地报销监控</span>
        </div>
        <div className="item">
          <span>
            献血者分布与屏蔽监控
            <i className="glyphicon glyphicon-arrow-right"></i>
          </span>
        </div>
      </div>
    </>
  );
};

export default Reim;
