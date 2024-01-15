function TableDefine({ row, column, useThead = false }) {
  const headOptions = getHeadOptions({ row, column, useThead });
  const bodyOptions = getBodyOptions({ row, column, useThead });
  return {
    options: {
      // customAttrs对应右侧选中元素后展示的仪表盘
      customAttrs: {
        id: +new Date(),
        left: 34.5,
        top: 112.5,
        height: 75,
        width: 553,
        title: "自定义表格",
        textAlign: "center",
        row,
        column,
        tableBorderTop: "solid",
        tableBorderLeft: "solid",
        tableBorderBottom: "solid",
        tableBorderRight: "solid",
        zIndex: "90"
        // 横向坐标
        // tableBorderCrosswise: "solid",
        // 纵向坐标
        // tableBorderLengthways: "solid",
      },
      // attrs直接赋值给table标签
      attrs: { border: "0", cellpadding: "0", cellspacing: "0" },
      bodyOptions,
      useThead,
      headOptions
    },
    widgetType: {
      type: "customTable"
    }
  };
}

function getHeadOptions({ useThead, column }) {
  const trOptions = new TrDefine(column);
  if (useThead) {
    console.log();
  } else {
    return {
      attrs: {},
      trOptions
    };
  }
}

function getBodyOptions({ row, column }) {
  const trList = [];
  for (let index = 0; index < row; index++) {
    trList.push(new TrDefine(column));
  }
  return {
    attrs: {},
    trList
  };
}

function TrDefine(column) {
  const tdList = [];
  for (let index = 0; index < column; index++) {
    tdList.push(new TdDefine());
  }
  return {
    attrs: {},
    tdList
  };
}

function TdDefine() {
  return {
    attrs: {
      colspan: 1,
      rowspan: 1
    },
    options: {
      value: ""
    }
  };
}
export default TableDefine;