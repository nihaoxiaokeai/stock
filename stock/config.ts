// 信息数据处理
function getInfoList(params: any) {
  if (params === null) {
    const infoList = [
      { title: "时间", text: "" },
      { title: "库区编码", text: "" },
      {
        title: "实时库存金额",
        text: "",
      },
      { title: "超出比例（实时金额/目标金额-1）", text: "" },
      { title: "已连续推送", text: "" },
    ];
    return infoList;
  } else {
    const infoList = [
      { title: "时间", text: params.msgTime || "" },
      { title: "库区编码", text: params.depotId || "" },
      {
        title: "实时库存金额",
        text: params.stockAmount ? fmoney(params.stockAmount, 2) : "",
      },
      { title: "超出比例（实时金额/目标金额-1）", text: params.overRate || "" },
      { title: "已连续推送", text: params.pushedMonth || "" },
    ];
    return infoList;
  }
}

// 格式化
function fmoney(s: any, n: any) {
  n = n > 0 && n <= 20 ? n : 2;
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
  let l = s.split(".")[0].split("").reverse(),
    r = s.split(".")[1];
  let t = "";
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
  }
  return t.split("").reverse().join("") + "." + r;
}

export { getInfoList };
