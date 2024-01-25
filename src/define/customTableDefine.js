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
  const trOptions = new TrDefine(column, 1, true);
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
    trList.push(new TrDefine(column, index + 1));
  }
  return {
    attrs: {},
    trList
  };
}

export function TrDefine(column, rowIndex, isHead = false) {
  const tdList = [];
  for (let index = 0; index < column; index++) {
    tdList.push(new TdDefine({ colIndex: index + 1, rowIndex, isHead }));
  }
  return {
    attrs: {},
    tdList
  };
}

export function TdDefine({ colIndex, rowIndex, isHead }) {
  return {
    attrs: {
      colspan: 1,
      rowspan: 1,
      "data-colindex": colIndex,
      "data-rowindex": rowIndex
    },
    options: {
      isDelete: 0,
      isHead,
      inputValue: "",
      dragValList: []
    }
  };
}
export default TableDefine;
