import * as React from "react";
import * as moment from "moment";
import {
  Button,
  Icon,
  Picker,
  DatePicker,
  TextareaItem,
  Toast,
} from "antd-mobile";
import "./index.scss";

const handlingList = [
  { label: "部分未及时领用", value: 1 },
  { label: "其它原因", value: 2 },
];

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

const defaultMinTimeStamp = moment("2000-01-01 00:00:00").valueOf();
const defaultMinDate = new Date(defaultMinTimeStamp);

const defaultMaxTimeStamp = moment("2030-01-01 23:59:59").valueOf();
const defaultMaxDate = new Date(defaultMaxTimeStamp);

const sevenAfterTimeStamp = moment(now)
  .add(+7, "days")
  .format("YYYY-MM-DD");
const sevenDate = new Date(sevenAfterTimeStamp);

const TextView = (props: any) => {
  const { info = {} } = props;
  return (
    <div className="stock-waring-info-unit">
      <span className="stock-waring-info-title">{info.title}：</span>
      <span className="stock-waring-info-text">{info.text}</span>
    </div>
  );
};

interface IProps {
  infoList?: any;
  processType?: any;
  processedTime?: any;
  processMemo?: any;
  onSubmitChange?: (
    info: object,
    callback?: (isFinish: boolean) => void
  ) => void;
}
const StockWarningPage = React.memo(
  React.forwardRef((props: IProps, ref) => {
    // 标题
    document.title = "库存金额已超过目标";

    // props
    const {
      infoList = [],
      processMemo,
      processType,
      processedTime,
      onSubmitChange,
    } = props;

    // state
    const [handling, setHandling] = React.useState(false);
    const [handleTime, setHandleTime] = React.useState(false);
    const [handlingInfo, setHandlingInfo] = React.useState({
      label: "请选择",
      value: 0,
    });
    const [timeInfo, setTimeInfo] = React.useState(now);
    const [textarea, setTextarea] = React.useState("");
    const [finish, setFinish] = React.useState(false);

    React.useEffect(() => {
      setHandling(processType !== 0);
      setHandleTime(processedTime !== "");
      setHandlingInfo(
        processType === 0
          ? {
              label: "请选择",
              value: 0,
            }
          : handlingList[processType - 1]
      );
      setTimeInfo(
        processedTime === "" ? now : new Date(moment(processedTime).valueOf())
      );
      setTextarea(processMemo);
      setFinish(processType !== 0);
    }, [processedTime]);

    // 处理方式
    const onHandling = (e: any) => {
      const key = handlingList.findIndex((v) => {
        return v.value == e[0];
      });

      // aba操作处理
      const selectInfo = handlingList[key];
      if (selectInfo.value !== handlingInfo.value) {
        setTimeInfo(now);
        setHandleTime(false);
      }

      // 设置选择信息
      setHandlingInfo(selectInfo);
      setHandling(true);
    };

    // 处理完成时间
    const onHandleTime = (e: any) => {
      if (handlingInfo.value === 0) {
        Toast.info("请选择处理方式");
        return;
      }
      setTimeInfo(e);
      setHandleTime(true);
    };

    const onTimeVisibleChange = (e: any) => {
      if (e && handlingInfo.value === 0) {
        Toast.info("请选择处理方式");
      }
    };

    // 补充说明
    const onTextareaChange = (e: any) => {
      setTextarea(e);
    };

    // 获取按钮禁用判断值
    const getButtonDisabled = () => {
      let disabled = true;
      if (handlingInfo.value === 1 && handleTime) {
        // 部分未及时领用
        disabled = false;
      } else if (handlingInfo.value === 2 && textarea.length !== 0) {
        // 其它原因
        disabled = false;
      }
      return disabled;
    };

    // 提交按钮
    const onButtonClick = () => {
      const params = {
        illustration: textarea,
        process_type: handlingInfo.value,
      };
      if (handlingInfo.value === 1) {
        Object.assign(params, {
          process_time: moment(timeInfo).format("YYYY-MM-DD HH:mm:ss"),
        });
      }
      if (onSubmitChange)
        onSubmitChange(params, (isFinish: boolean) => {
          setFinish(isFinish);
        });
    };

    // 渲染
    return (
      <div className="stock-waring-root">
        <div>
          {/* 信息 */}
          <div className="stock-waring-info">
            {infoList.map((item: any, index: any) => (
              <TextView key={`${index}`} info={item} />
            ))}
            {/* 红戳 */}
            {finish && (
              <img
                className="stock-red-stamp-image"
                src={require("assets/images/icon_processed_red.png")}
              />
            )}
          </div>

          {/* 处理方式 */}
          <div
            className="stock-waring-handling"
            style={{ height: handlingInfo.value === 1 ? "5.6rem" : "2.8rem" }}
          >
            <Picker
              value={[handlingInfo.value]}
              cols={1}
              data={handlingList}
              onChange={onHandling}
            >
              <div className="stock-waring-handling-unit">
                <span className="stock-waring-info-title">超标原因</span>
                <div className="stock-waring-arrow-text">
                  <span
                    className="stock-waring-info-text"
                    style={{ color: handling ? "#333" : "orange" }}
                  >
                    {handlingInfo.label}
                  </span>
                  <Icon style={{ color: "#ccc" }} type="right" />
                </div>
              </div>
            </Picker>

            {handlingInfo.value === 1 && (
              <>
                {/* 分割线 */}
                <div className="stock-waring-line" />

                {/* 处理完成时间 */}
                <DatePicker
                  mode="date"
                  value={timeInfo}
                  onOk={onHandleTime}
                  onVisibleChange={onTimeVisibleChange}
                  minDate={handlingInfo.value === 1 ? now : defaultMinDate}
                  maxDate={
                    handlingInfo.value === 1 ? sevenDate : defaultMaxDate
                  }
                >
                  <div className="stock-waring-handling-unit">
                    <span className="stock-waring-info-title">
                      处理完成时间
                    </span>
                    <div className="stock-waring-arrow-text">
                      <span
                        className="stock-waring-info-text"
                        style={{ color: handleTime ? "#333" : "orange" }}
                      >
                        {handleTime
                          ? `${moment(timeInfo).format("YYYY-MM-DD")}`
                          : "请选择"}
                      </span>
                      <Icon style={{ color: "#ccc" }} type="right" />
                    </div>
                  </div>
                </DatePicker>
              </>
            )}
          </div>

          {/* 补充说明 */}
          <div className="stock-waring-remark">
            <div className="stock-waring-text">说明:</div>
            <TextareaItem
              value={textarea}
              className="stock-textarea"
              placeholder="请输入超标原因/处理方式"
              rows={5}
              count={100}
              onChange={onTextareaChange}
            />
          </div>
        </div>
        {/* 提交按钮 */}
        {finish === false && (
          <div className="stock-waring-button">
            <Button
              className="button-text"
              style={{
                backgroundColor: getButtonDisabled() ? "#ccc" : "#0188ff",
              }}
              type="primary"
              disabled={getButtonDisabled()}
              onClick={onButtonClick}
            >
              提交
            </Button>
          </div>
        )}
      </div>
    );
  })
);

export default StockWarningPage;
