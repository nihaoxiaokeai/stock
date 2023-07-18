import * as React from "react";
import { Toast } from "antd-mobile";
import StockWarningPage from "./components/waringInfo";
import { getInfoList } from "./config";
import * as api from "../../services/stockWarning";
import * as qs from "query-string";

const { useEffect } = React;

const StockPage = React.memo(
  React.forwardRef((props, ref) => {
    // 标题
    document.title = "库存金额已超过目标";

    // state
    const [infoList, setInfoList] = React.useState(getInfoList(null));
    const [processType, setProcessType] = React.useState(0);
    const [processedTime, setProcessedTime] = React.useState("");
    const [processMemo, setProcessMemo] = React.useState("");
    const [submit, setSubmit] = React.useState(false);

    useEffect(() => {
      const params = qs.parse(window.location.search);
      const { msgid } = params;
      getStockWarningInfo({ msgid });
    }, []);

    // 获取警告信息接口
    const getStockWarningInfo = (params: any) => {
      Toast.loading("加载中....");
      api
        .getWarningInfo(params)
        .then((rs: any) => {
          Toast.hide();
          setProcessType(rs.processType || 0);
          setProcessMemo(rs.processMemo || "");
          setProcessedTime(rs.processedTime || "");
          setInfoList(getInfoList(rs || {}));
        })
        .catch((err) => {
          Toast.hide();
        });
    };

    // 提交警告信息接口
    const submitStockWaringInfo = (params: any, callback: any) => {
      Toast.loading("提交中...", 10000);
      const urlParams = qs.parse(window.location.search);
      const { msgid } = urlParams;

      api
        .submitWarningInfo({ data: params, msgid })
        .then((rs: any) => {
          Toast.hide();
          callback(true);
          Toast.success("提交成功", 1);
        })
        .catch((err) => {
          Toast.hide();
          callback(false);
          Toast.fail("提交失败，请稍后重试~", 1);
        });
    };

    // 提交
    const onSubmitChange = (info: object, callback: any) => {
      submitStockWaringInfo(info, callback);
    };

    // 渲染
    return (
      <StockWarningPage
        processType={processType}
        processedTime={processedTime}
        processMemo={processMemo}
        infoList={infoList}
        onSubmitChange={onSubmitChange}
      />
    );
  })
);

export default StockPage;
