import { TrDefine, TdDefine } from "@/define/customTableDefine";
export function mergeCell(range) {
  range = range || this.selectRange;
  const { colStartIndex, rowStartIndex, rowEndIndex, colEndIndex } = range;
  if (colStartIndex === colEndIndex && rowStartIndex === rowEndIndex) return;
  const target = this.getAxisTd(rowStartIndex - 1, colStartIndex - 1);
  console.log("target", target);
  const colspan = colEndIndex - colStartIndex + 1;
  const rowspan = rowEndIndex - rowStartIndex + 1;
  target.attrs.colspan = colspan;
  target.attrs.rowspan = rowspan;
  for (let index = 0; index < rowspan; index++) {
    let tdIndex, length;
    if (index === 0) {
      tdIndex = colStartIndex;
      length = colspan - 1;
    } else {
      tdIndex = colStartIndex - 1;
      length = colspan;
    }
    for (let j = 0; j < length; j++) {
      const target = this.getAxisTd(rowStartIndex - 1 + index, tdIndex * 1 + j);
      const { options, attrs } = target;
      options.isDelete = 1;
      options.mergeNodeAxis.rowIndex = rowStartIndex;
      options.mergeNodeAxis.colIndex = colStartIndex;
      attrs.rowspan = 1;
      attrs.colspan = 1;
    }
  }
}

export function delColumn() {
  const {
    selectRange: { colStartIndex, colEndIndex },
    options: {
      bodyOptions: { trList }
    },
    resetSelectRange
  } = this;
  const rawOperateTdList = [];
  const delLength = colEndIndex - colStartIndex + 1;
  trList.map((item) => {
    const delColArr = item.tdList.slice(colStartIndex - 1, colEndIndex);
    delColArr.map((td) => {
      let {
        options: {
          isDelete,
          mergeNodeAxis: { rowIndex, colIndex }
        },
        attrs: { colspan, rowspan }
      } = td;
      // 先遍历循环，吧所有需要操作得节点筛选出来
      if (isDelete || colspan > 1 || rowspan > 1) {
        const target = this.getAxisTd(rowIndex - 1, colIndex - 1);
        const {
          attrs: { rowspan, colspan }
        } = target;

        const rawOperateInfo = {
          colStartIndex: colIndex,
          rowStartIndex: rowIndex,
          rowspan,
          colspan
        };

        // 没有相同坐标则说明是新的需要操作的td
        if (
          !rawOperateTdList.some((item) => {
            return item.colStartIndex === rawOperateInfo.colStartIndex && item.rowStartIndex === rawOperateInfo.rowStartIndex;
          })
        ) {
          rawOperateTdList.push(rawOperateInfo);
        }
      }
    });
  });
  console.log("rawOperateTdList", rawOperateTdList);
  rawOperateTdList.map((td) => {
    // 坐标大于等于选中范围得坐标且尾坐标超出当前删除范围 更改 mergeNodeAxis,然后直接删除rowspan相应长度
    if (td.colStartIndex >= colStartIndex && td.colStartIndex + td.colspan - 1 > colEndIndex) {
      const spanRecudeLength = colEndIndex - td.colStartIndex + 1;
      const target = this.getAxisTd(td.rowStartIndex - 1, colEndIndex);
      target.attrs.rowspan = td.rowspan;
      target.attrs.colspan = td.colspan - spanRecudeLength;
      target.options.isDelete = 0;
      // 坐标小于删除范围得头坐标，直接删除colspan相应长度
    } else if (td.colStartIndex < colStartIndex) {
      const originColEndIndex = td.colspan - 1 + td.colStartIndex;
      let spanRecudeLength;
      if (originColEndIndex < colEndIndex) {
        spanRecudeLength = originColEndIndex - colStartIndex + 1;
      } else {
        spanRecudeLength = delLength;
      }
      const target = this.getAxisTd(td.rowStartIndex - 1, td.colStartIndex - 1);
      target.attrs.colspan = target.attrs.colspan - spanRecudeLength;
    }
  });
  trList.map((item) => {
    item.tdList.splice(colStartIndex - 1, colEndIndex - colStartIndex + 1);
  });
  this.resetAxisInfo();
  // 删除后清空选中范围
  resetSelectRange();
}

export function delRow() {
  const {
    selectRange: { rowStartIndex, rowEndIndex },
    options: {
      bodyOptions: { trList }
    },
    resetSelectRange
  } = this;
  const rawOperateTdList = [];
  const delLength = rowEndIndex - rowStartIndex + 1;
  const delRowArr = trList.slice(rowStartIndex - 1, rowEndIndex);
  delRowArr.map((tr) => {
    tr.tdList.map((td) => {
      let {
        options: {
          isDelete,
          mergeNodeAxis: { rowIndex, colIndex }
        },
        attrs: { colspan, rowspan }
      } = td;
      // 先遍历循环，吧所有需要操作得节点筛选出来
      if (isDelete || colspan > 1 || rowspan > 1) {
        const target = this.getAxisTd(rowIndex - 1, colIndex - 1);
        const {
          attrs: { rowspan, colspan }
        } = target;

        const rawOperateInfo = {
          colStartIndex: colIndex,
          rowStartIndex: rowIndex,
          rowspan,
          colspan
        };

        // 没有相同坐标则说明是新的需要操作的td
        if (
          !rawOperateTdList.some((item) => {
            return item.colStartIndex === rawOperateInfo.colStartIndex && item.rowStartIndex === rawOperateInfo.rowStartIndex;
          })
        ) {
          rawOperateTdList.push(rawOperateInfo);
        }
      }
    });
  });
  console.log("rawOperateTdList", rawOperateTdList);
  rawOperateTdList.map((td) => {
    // 坐标大于等于选中范围得坐标且尾坐标超出当前删除范围 更改 mergeNodeAxis,然后直接删除rowspan相应长度
    if (td.rowStartIndex >= rowStartIndex && td.rowStartIndex + td.rowspan - 1 > rowEndIndex) {
      const spanRecudeLength = rowEndIndex - td.rowStartIndex + 1;
      const target = this.getAxisTd(rowEndIndex, td.colStartIndex - 1);
      target.attrs.rowspan = td.rowspan - spanRecudeLength;
      target.attrs.colspan = td.colspan;
      target.options.isDelete = 0;
      // 坐标小于删除范围得头坐标，直接删除rowspan相应长度
    } else if (td.rowStartIndex < rowStartIndex) {
      const originRowEndIndex = td.rowspan - 1 + td.rowStartIndex;
      let spanRecudeLength;
      if (originRowEndIndex < rowEndIndex) {
        spanRecudeLength = originRowEndIndex - rowStartIndex + 1;
      } else {
        spanRecudeLength = delLength;
      }
      const target = this.getAxisTd(td.rowStartIndex - 1, td.colStartIndex - 1);
      target.attrs.rowspan = target.attrs.rowspan - spanRecudeLength;
    }
  });
  trList.splice(rowStartIndex - 1, delLength);
  this.resetAxisInfo();
  // 删除后清空选中范围
  resetSelectRange();
}

export function bottomInsertRow() {
  const {
    selectRange: { rowEndIndex },
    options: {
      bodyOptions: { trList }
    },
    mergeCell
  } = this;
  const operateTdList = [];
  const column = trList[0].tdList.length;
  let tr = new TrDefine(column, rowEndIndex + 1);
  if (rowEndIndex < trList.length) {
    const formTdList = trList[rowEndIndex].tdList;
    for (let index = 0; index < formTdList.length; index++) {
      const formTd = formTdList[index];
      let {
        options: {
          isDelete,
          mergeNodeAxis: { rowIndex, colIndex }
        },
        attrs: { rowspan, colspan }
      } = formTd;
      if (isDelete || rowspan > 1 || colspan > 1) {
        const target = this.getAxisTd(rowIndex - 1, colIndex - 1);
        const {
          attrs: { rowspan, colspan }
        } = target;
        const operateInfo = {
          colStartIndex: colIndex,
          rowStartIndex: rowIndex,
          rowEndIndex: rowspan * 1 + rowIndex,
          colEndIndex: colspan - 1 + colIndex
        };

        // 没有相同坐标则说明是新的需要操作的yd
        if (
          !operateTdList.some((item) => {
            return item.colStartIndex === operateInfo.colStartIndex && item.rowStartIndex === operateInfo.rowStartIndex;
          })
        ) {
          operateTdList.push(operateInfo);
        }
      }
    }
  }
  trList.splice(rowEndIndex, 0, tr);
  this.resetAxisInfo();
  this.$nextTick(() => {
    operateTdList.map((operateInfo) => {
      mergeCell(operateInfo);
    });
  });
}
export function topInsertRow() {
  const {
    selectRange: { rowStartIndex },
    options: {
      bodyOptions: { trList }
    },
    mergeCell
  } = this;
  const operateTdList = [];
  const column = trList[0].tdList.length;
  let formIndex = rowStartIndex - 2;
  let tr = new TrDefine(column, rowStartIndex);

  if (formIndex >= 0) {
    const formTdList = trList[formIndex].tdList;
    for (let index = 0; index < formTdList.length; index++) {
      const formTd = formTdList[index];
      let {
        options: {
          isDelete,
          mergeNodeAxis: { rowIndex, colIndex }
        },
        attrs: { rowspan, colspan }
      } = formTd;
      if (isDelete || rowspan > 1 || colspan > 1) {
        const target = this.getAxisTd(rowIndex - 1, colIndex - 1);
        const {
          attrs: { rowspan, colspan }
        } = target;
        const operateInfo = {
          colStartIndex: colIndex,
          rowStartIndex: rowIndex,
          rowEndIndex: rowspan * 1 + rowIndex,
          colEndIndex: colspan - 1 + colIndex
        };

        // 没有相同坐标则说明是新的需要操作的yd
        if (
          !operateTdList.some((item) => {
            return item.colStartIndex === operateInfo.colStartIndex && item.rowStartIndex === operateInfo.rowStartIndex;
          })
        ) {
          operateTdList.push(operateInfo);
        }
      }
    }
  }
  trList.splice(rowStartIndex - 1, 0, tr);
  this.resetAxisInfo();
  this.selectRange.rowStartIndex++;
  this.selectRange.rowEndIndex++;
  this.$nextTick(() => {
    operateTdList.map((operateInfo) => {
      mergeCell(operateInfo);
    });
  });
}
export function rightInsertColumn() {
  const {
    selectRange: { colEndIndex },
    options: {
      bodyOptions: { trList }
    },
    mergeCell
  } = this;
  const operateTdList = [];
  const curTdLength = trList[0].tdList.length;
  trList.map((item) => {
    let td;
    // 如果等于长度，相当于新加一行初始行，
    if (colEndIndex === curTdLength) {
      const {
        options: { isHead },
        attrs
      } = item.tdList[0];
      td = new TdDefine({ colIndex: colEndIndex + 1, rowIndex: attrs["data-rowindex"], isHead });
    } else {
      const {
        options: {
          isHead,
          isDelete,
          mergeNodeAxis: { rowIndex, colIndex }
        },
        attrs,
        attrs: { colspan, rowspan }
      } = item.tdList[colEndIndex];
      td = new TdDefine({ colIndex: colEndIndex + 1, rowIndex: attrs["data-rowindex"], isHead });
      // 否则要复制目标行的某些信息
      // 如果当前td被合并，则需要复制相关合并信息
      if (isDelete || colspan > 1 || rowspan > 1) {
        const target = this.getAxisTd(rowIndex - 1, colIndex - 1);
        const {
          attrs: { rowspan, colspan }
        } = target;
        const operateInfo = {
          colStartIndex: colIndex,
          rowStartIndex: rowIndex,
          rowEndIndex: rowspan - 1 + rowIndex,
          colEndIndex: colspan * 1 + colIndex
        };
        console.log(rowIndex, colIndex, rowspan, colspan, operateInfo);

        // 没有相同坐标则说明是新的需要操作的yd
        if (
          !operateTdList.some((item) => {
            return item.colStartIndex === operateInfo.colStartIndex && item.rowStartIndex === operateInfo.rowStartIndex;
          })
        ) {
          operateTdList.push(operateInfo);
        }
      }
    }
    item.tdList.splice(colEndIndex, 0, td);
  });
  this.resetAxisInfo();
  this.$nextTick(() => {
    console.log(operateTdList);
    operateTdList.map((operateInfo) => {
      mergeCell(operateInfo);
    });
  });
}
export function leftInsertColumn() {
  const {
    selectRange: { colStartIndex },
    options: {
      bodyOptions: { trList }
    },
    mergeCell
  } = this;
  const operateTdList = [];
  let index = colStartIndex - 2;
  trList.map((item) => {
    let td;
    // 如果小于0，相当于新加一行初始行，
    if (index < 0) {
      index = 0;
      const {
        options: { isHead },
        attrs
      } = item.tdList[index];
      td = new TdDefine({ colIndex: colStartIndex, rowIndex: attrs["data-rowindex"], isHead });
    } else {
      let {
        options: {
          isHead,
          isDelete,
          mergeNodeAxis: { rowIndex, colIndex }
        },
        attrs,
        attrs: { colspan, rowspan }
      } = item.tdList[index];
      td = new TdDefine({ colIndex: colStartIndex, rowIndex: attrs["data-rowindex"], isHead });
      // 否则要复制目标行的某些信息
      // 如果当前td被合并，则需要复制相关合并信息
      if (isDelete || colspan > 1 || rowspan > 1) {
        const target = this.getAxisTd(rowIndex - 1, colIndex - 1);
        const {
          attrs: { rowspan, colspan }
        } = target;
        const operateInfo = {
          colStartIndex: colIndex,
          rowStartIndex: rowIndex,
          rowEndIndex: rowspan - 1 + rowIndex,
          colEndIndex: colspan * 1 + colIndex
        };

        // 没有相同坐标则说明是新的需要操作的yd
        if (
          !operateTdList.some((item) => {
            return item.colStartIndex === operateInfo.colStartIndex && item.rowStartIndex === operateInfo.rowStartIndex;
          })
        ) {
          operateTdList.push(operateInfo);
        }
      }
    }
    item.tdList.splice(colStartIndex - 1, 0, td);
  });
  this.selectRange.colStartIndex++;
  this.selectRange.colEndIndex++;
  this.resetAxisInfo();
  this.$nextTick(() => {
    operateTdList.map((operateInfo) => {
      mergeCell(operateInfo);
    });
  });
}

export function resetAxisInfo() {
  const trList = this.options.bodyOptions.trList;
  trList.map((trItem, trIndex) => {
    trItem.tdList.map((tdItem, tdIndex) => {
      tdItem.attrs["data-rowindex"] = trIndex + 1;
      tdItem.attrs["data-colindex"] = tdIndex + 1;
      const { rowspan, colspan } = tdItem.attrs;
      if (!tdItem.options.isDelete) {
        tdItem.options.mergeNodeAxis.colIndex = tdIndex + 1;
        tdItem.options.mergeNodeAxis.rowIndex = trIndex + 1;
      }
      if (rowspan > 1 && colspan > 1) {
        for (let index = 0; index < rowspan; index++) {
          for (let j = 0; j < colspan; j++) {
            const target = this.getAxisTd(trIndex + index, tdIndex + j);
            target.options.mergeNodeAxis.colIndex = tdIndex + 1;
            target.options.mergeNodeAxis.rowIndex = trIndex + 1;
          }
        }
      } else if (rowspan > 1) {
        for (let index = 0; index < rowspan; index++) {
          const target = this.getAxisTd(trIndex + index, tdIndex);
          target.options.mergeNodeAxis.colIndex = tdIndex + 1;
          target.options.mergeNodeAxis.rowIndex = trIndex + 1;
        }
      } else if (colspan > 1) {
        for (let index = 0; index < colspan; index++) {
          const target = this.getAxisTd(trIndex, tdIndex + index);
          target.options.mergeNodeAxis.colIndex = tdIndex + 1;
          target.options.mergeNodeAxis.rowIndex = trIndex + 1;
        }
      }
    });
  });
}
