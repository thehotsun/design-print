import "./index.less";
import { ContextMenu, findNearestTd } from "@/utils/index";
import { TrDefine, TdDefine } from "@/define/customTableDefine";
import Draggable from "vuedraggable";
import { cloneDeep } from "lodash";

export default {
  name: "designTable",
  components: { Draggable },
  props: {
    onlyShow: Boolean,
    formData: Object,
    options: Object
  },
  data() {
    return {
      formRef: "q",
      menuSinglton: null,
      // 这里的坐标是经过（如果有合并单元格）换算后的第几行第几列
      selectRange: {
        colStartIndex: 0,
        rowStartIndex: 0,
        rowEndIndex: 0,
        colEndIndex: 0,
        source: ""
      },
      isProcessing: false,
      showInputAxis: {
        rowIndex: 0,
        colIndex: 0
      },
      draggingColumn: {
        rowIndex: 0,
        colIndex: 0
      },
      dragging: false,
      curTd: {},
      operateHistory: []
    };
  },

  watch: {},
  async created() {
    this.init();
  },

  methods: {
    init() {
      const that = this;
      this.menuSinglton = ContextMenu({
        menus: [
          {
            name: "合并单元格",
            onClick: function (e) {
              e.stopPropagation();
              that.hideMenu();
              console.log("menu1 clicked", e);
              that.operateHistory.push({
                node: cloneDeep(that.selectRange),
                type: "合并单元格"
              });
              that.mergeCell();
            }
          },
          {
            name: "左侧插入列",
            onClick: function (e) {
              e.stopPropagation();
              that.hideMenu();
              console.log("menu2 clicked", e);
              that.leftInsertColumn();
              that.operateHistory.push({
                node: cloneDeep(that.selectRange),
                type: "左侧插入列"
              });
            }
          },
          {
            name: "右侧插入列",
            onClick: function (e) {
              e.stopPropagation();
              that.hideMenu();
              that.rightInsertColumn();
              console.log("menu3 clicked", e);
              that.operateHistory.push({
                node: cloneDeep(that.selectRange),
                type: "右侧插入列"
              });
            }
          },
          {
            name: "上方插入行",
            onClick: function (e) {
              e.stopPropagation();
              that.hideMenu();
              that.topInsertRow();
              that.operateHistory.push({
                node: cloneDeep(that.selectRange),
                type: "上方插入行"
              });
              console.log("menu3 clicked", e);
            }
          },
          {
            name: "下方插入行",
            onClick: function (e) {
              e.stopPropagation();
              that.hideMenu();
              that.bottomInsertRow();
              console.log("menu2 clicked", e);
              that.operateHistory.push({
                node: cloneDeep(that.selectRange),
                type: "下方插入行"
              });
            }
          },
          {
            // TODO 合并状态删除行有问题

            name: "删除行",
            onClick: function (e) {
              e.stopPropagation();
              that.hideMenu();
              that.delRow();
              that.operateHistory.push({
                node: cloneDeep(that.selectRange),
                type: "删除行"
              });
              console.log("menu3 clicked", e);
            }
          },
          {
            // TODO 合并状态删除列有问题
            name: "删除列",
            onClick: function (e) {
              e.stopPropagation();
              that.hideMenu();
              that.delColumn();
              that.operateHistory.push({
                node: cloneDeep(that.selectRange),
                type: "删除列"
              });
              console.log("menu2 clicked", e);
            }
          },
          {
            name: "清除内容",
            onClick: function (e) {
              e.stopPropagation();
              that.hideMenu();
              that.clearValue();
              console.log("menu3 clicked", e);
            }
          }
        ]
      });
      document.addEventListener("click", () => {
        this.hideMenu();
        this.resetShowInputAxis();
        this.resetSelectRange();
        this.handleMouseup();
      });
    },
    resetShowInputAxis() {
      console.log("resetShowInputAxis");
      this.showInputAxis.rowIndex = 0;
      this.showInputAxis.colIndex = 0;
    },
    mergeCell(range) {
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
    },
    clearValue() {},
    delColumn() {
      const {
        selectRange: { colStartIndex, colEndIndex },
        options: {
          bodyOptions: { trList }
        },
        resetSelectRange
      } = this;
      trList.map((item) => {
        item.tdList.splice(colStartIndex - 1, colEndIndex - colStartIndex + 1);
        for (let index = colStartIndex - 1; index < item.tdList.length; index++) {
          item.tdList[index].attrs["data-colindex"] = index + 1;
        }
      });
      // 删除后清空选中范围
      resetSelectRange();
    },
    delRow() {
      const {
        selectRange: { rowStartIndex, rowEndIndex },
        options: {
          bodyOptions: { trList }
        },
        resetSelectRange
      } = this;
      trList.splice(rowStartIndex - 1, rowEndIndex - rowStartIndex + 1);
      for (let index = rowStartIndex - 1; index < trList.length; index++) {
        trList[index].tdList.map((item) => {
          item.attrs["data-rowindex"] = index + 1;
        });
      }
      // 删除后清空选中范围
      resetSelectRange();
    },
    bottomInsertRow() {
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
    },
    topInsertRow() {
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
    },
    rightInsertColumn() {
      const {
        selectRange: { colEndIndex },
        options: {
          bodyOptions: { trList }
        },
        mergeCell
      } = this;
      const operateTdList = [];
      trList.map((item) => {
        let td;
        // 如果等于长度，相当于新加一行初始行，
        if (colEndIndex === trList[0].tdList.length) {
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
    },
    leftInsertColumn() {
      const {
        selectRange: { colStartIndex },
        options: {
          bodyOptions: { trList }
        },
        mergeCell
      } = this;
      const operateTdList = [];
      trList.map((item) => {
        let td;
        let index = colStartIndex - 2;
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
    },
    resetAxisInfo() {
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
    },

    checkIsSelect({ colIndex, rowIndex }) {
      const { colStartIndex, rowStartIndex, rowEndIndex, colEndIndex } = this.selectRange;
      return colStartIndex <= colIndex && colEndIndex >= colIndex && rowStartIndex <= rowIndex && rowEndIndex >= rowIndex;
    },
    checkShowInput(attrs, rowIndex, colIndex) {
      const result = attrs["data-rowindex"] === rowIndex && attrs["data-colindex"] === colIndex;
      if (result) {
        this.$nextTick(() => {
          this.$refs[`${rowIndex}${colIndex}`].focus();
        });
        this.curTd = this.getAxisTd(rowIndex - 1, colIndex - 1);
      }
      return result;
    },
    handleTdMouseenter(e) {
      if (this.isProcessing) {
        console.log(this.isProcessing, "handleTdMouseenter", e.currentTarget);
        const {
          rowSpan,
          colSpan,
          dataset: { rowindex, colindex }
        } = e.currentTarget;
        this.selectRange.rowEndIndex = rowindex - 1 + rowSpan * 1;
        this.selectRange.colEndIndex = colindex - 1 + colSpan * 1;
      }
    },
    handleMouseleave() {
      // if (this.isProcessing) {
      // }
    },
    resetSelectRange() {
      this.selectRange.rowStartIndex = 0;
      this.selectRange.colStartIndex = 0;
      this.selectRange.rowEndIndex = 0;
      this.selectRange.colEndIndex = 0;
      this.selectRange.source = "";
    },
    handleTdMouseMove(e) {
      if (this.dragging) return;
      const { currentTarget } = e;
      const { rowindex, colindex } = currentTarget.dataset;
      let rect = currentTarget.getBoundingClientRect();
      const bodyStyle = document.body.style;
      // 这个8要和td的padding-left一致 只有第一行可以拖拽
      if (rect.width > 12 && rect.right - e.pageX < 8 && rowindex === "1") {
        bodyStyle.cursor = "col-resize";
        currentTarget.style.cursor = "col-resize";
        this.draggingColumn = {
          rowIndex: rowindex,
          colIndex: colindex
        };
      } else if (!this.dragging) {
        bodyStyle.cursor = "";
        currentTarget.style.cursor = "";
        this.draggingColumn = {
          rowIndex: 0,
          colIndex: 0
        };
      }
    },
    handleMouseup() {
      // clearTimeout(this.timer);
      this.isProcessing = false;
    },
    handleTdMousedown(e) {
      // event.button==0 默认。没有按任何按钮。
      // event.button==1 鼠标左键
      // event.button==2 鼠标右键
      // event.button==3 鼠标左右键同时按下
      // event.button==4 鼠标中键
      // event.button==5 鼠标左键和中键同时按下
      // event.button==6 鼠标右键和中键同时按下
      // event.button==7 所有三个键都按下
      // clearTimeout(this.timer);
      if ([0, 1].includes(e.button)) {
        const {
          draggingColumn: { rowIndex, colIndex }
        } = this;
        // 此时为拖拽事件
        if (rowIndex > 0 && colIndex > 0) {
          const {
            dataset: { rowindex, colindex }
          } = e.currentTarget;
          this.dragging = true;
          const tableLeft = this.$refs.designPrintTable.getBoundingClientRect().left;
          const columnRect = e.currentTarget.getBoundingClientRect();
          //  const minLeft = columnRect.left - tableLeft + 30;
          const dragState = {
            startMouseLeft: e.clientX,
            startLeft: columnRect.right - tableLeft,
            startColumnLeft: columnRect.left - tableLeft,
            tableLeft,
            columnWidth: columnRect.width
          };
          document.onselectstart = function () {
            return false;
          };
          document.ondragstart = function () {
            return false;
          };
          console.log(dragState, dragState.columnWidth);

          const handleMouseMove = (event) => {
            const deltaLeft = event.clientX - dragState.startMouseLeft;
            console.log(deltaLeft);
            const target = this.getAxisTd(rowindex - 1, colindex - 1);
            // TODO td最小宽高，px转换mm
            this.$set(target.attrs.style, "width", dragState.columnWidth + deltaLeft + "px !important");
          };

          const handleMouseUp = () => {
            if (this.dragging) {
              document.body.style.cursor = "";
              this.dragging = false;
              this.draggingColumn = {
                rowInde: 0,
                colIndex: 0
              };
            }

            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.onselectstart = null;
            document.ondragstart = null;
          };
          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        } else {
          this.isProcessing = true;
          const {
            dataset: { rowindex, colindex },
            colSpan,
            rowSpan
          } = e.currentTarget;
          console.log("handleTdMousedown", e.currentTarget, rowindex, colindex);
          this.selectRange.rowEndIndex = rowindex - 1 + rowSpan * 1;
          this.selectRange.rowStartIndex = rowindex * 1;
          this.selectRange.colEndIndex = colindex - 1 + colSpan * 1;
          this.selectRange.colStartIndex = colindex * 1;
          this.selectRange.source = "leftClickSelect";
          this.hideMenu();
        }
      }
    },

    handleTdclick(e) {
      const {
        dataset: { rowindex, colindex }
      } = e.currentTarget;
      const { rowIndex, colIndex } = this.showInputAxis;
      if (rowIndex !== 0 && colIndex !== 0 && (rowindex * 1 !== rowIndex || colindex * 1 !== colIndex)) {
        this.resetShowInputAxis();
      }
    },

    handleTdDblclick(e) {
      const {
        dataset: { rowindex, colindex }
      } = e.currentTarget;
      console.log("handleTdDblclick", e.currentTarget);
      this.showInputAxis.rowIndex = rowindex * 1;
      this.showInputAxis.colIndex = colindex * 1;
      this.resetSelectRange();
      // clearTimeout(this.timer);
    },
    hideMenu() {
      const menus = this.menuSinglton.getInstance();
      menus.style.display = "none";
    },

    showMenu(e) {
      const menus = this.menuSinglton.getInstance();
      menus.style.top = `${e.clientY}px`;
      menus.style.left = `${e.clientX}px`;
      menus.style.display = "block";
    },
    handleContextmenu(e) {
      e.preventDefault();
      const { source } = this.selectRange;
      if (source !== "leftClickSelect") {
        const {
          dataset: { rowindex, colindex },
          colSpan,
          rowSpan
        } = e.currentTarget;
        console.log("handleContextmenu", e.currentTarget, rowindex, colindex);
        this.selectRange.rowEndIndex = rowindex - 1 + rowSpan * 1;
        this.selectRange.rowStartIndex = rowindex * 1;
        this.selectRange.colEndIndex = colindex - 1 + colSpan * 1;
        this.selectRange.colStartIndex = colindex * 1;
        this.selectRange.source = "rightClickSelect";
      }
      this.showMenu(e);
    },
    setRenderOptions() {},
    getAxisTd(rowIndex, colIndex) {
      let targetTd;
      try {
        targetTd = this.options.bodyOptions.trList[rowIndex]?.tdList[colIndex];
      } catch (error) {
        console.error("根据坐标获取td报错，报错信息:", error);
        targetTd = {};
      }
      return targetTd;
    },
    handleInputMousedown(e) {
      e.stopPropagation();
    },
    onDragEnd(evt) {
      console.log("drag end", evt);
    },

    onDragAdd(evt) {
      const tdNode = findNearestTd(evt.to);
      const { rowindex, colindex } = tdNode.dataset;
      const target = this.getAxisTd(rowindex - 1, colindex - 1);
      this.$nextTick(() => {
        // 这里进行数组值和input值得映射
        target.options.inputValue = target.options.dragValList.join("");
      });
      console.log("onDragAdd", evt.to.tagName);
    },

    onDragUpdate(evt) {
      console.log("onDragUpdate", evt);
    },

    checkMove(evt) {
      console.log("checkMove", evt);
      return true;
    },
    getTdComp(tdOptions) {
      const {
        attrs: { style, ...attrs },
        options = {}
      } = tdOptions;
      const {
        handleTdMouseenter,
        handleTdMousedown,
        handleTdMouseMove,
        handleInputMousedown,
        checkIsSelect,
        checkShowInput,
        handleTdDblclick,
        handleTdclick,
        handleContextmenu,
        showInputAxis: { rowIndex, colIndex },
        checkMove,
        onDragUpdate,
        onDragAdd,
        onDragEnd,
        curTd
      } = this;
      const listeners = {
        mousedown: handleTdMousedown,
        mouseenter: handleTdMouseenter,
        mousemove: handleTdMouseMove,
        dblclick: handleTdDblclick,
        click: handleTdclick,
        contextmenu: handleContextmenu
      };
      const inputListeners = {
        change: function (val) {
          // 这里进行input值和数组值得映射
          const reg = /\$\{[^}]*\}/g;
          const arr = val.split(reg);
          const found = val.match(reg);
          const dragValList = [];
          for (let index = 0; index < arr.length; index++) {
            const value = arr[index];
            if (value) {
              dragValList.push(value);
            }
            if (index < arr.length - 1) {
              dragValList.push(found[index]);
            }
          }
          curTd.options.dragValList = dragValList;
          console.log("change", val, curTd.options.dragValList);
        }
      };

      // TODO style这里table默认宽度187是否需要更改？
      return (
        <td
          {...{
            attrs,
            on: listeners
          }}
          style={style}
          class={checkIsSelect({ colIndex: attrs["data-colindex"], rowIndex: attrs["data-rowindex"] }) ? "selected" : ""}
        >
          <div class="tdContent" style={{ background: attrs.rowspan > 1 || attrs.colspan > 1 ? "#fff" : "" }}>
            {checkShowInput(attrs, rowIndex, colIndex) ? (
              <el-input
                {...{
                  attrs,
                  on: inputListeners
                }}
                nativeOnMousedown={handleInputMousedown}
                v-model={options.inputValue}
                ref={"" + rowIndex + colIndex}
              ></el-input>
            ) : (
              <draggable
                style="height: 100%;overflow-y: auto"
                group="dragGroup"
                ghostClass="ghost"
                handle=".drag-handler"
                list={options.dragValList}
                animation={300}
                move={checkMove}
                onend={onDragEnd}
                onadd={onDragAdd}
                onupdate={onDragUpdate}
              >
                <transition-group name="fade" tag="div" class="valList">
                  {options.dragValList.map((fieldExpression, index) => {
                    return (
                      <span style="" key={index}>
                        {fieldExpression}
                      </span>
                    );
                  })}
                </transition-group>
              </draggable>
            )}
          </div>
        </td>
      );
    },
    getTrComp(options) {
      const { getTdComp } = this;
      const { attrs = {}, tdList = [] } = options;
      const listeners = {};
      return (
        <tr
          {...{
            attrs,
            on: listeners
          }}
        >
          {tdList
            .filter((item) => !item.options.isDelete)
            .map((item) => {
              return getTdComp(item);
            })}
        </tr>
      );
    },
    getTbodyComp(bodyOptions) {
      const { getTrComp } = this;
      const { attrs = {}, trList = [] } = bodyOptions;
      const listeners = {};
      return (
        <tbody
          {...{
            attrs,
            on: listeners
          }}
        >
          {trList.map((trOptions) => {
            return getTrComp(trOptions);
          })}
        </tbody>
      );
    },
    getTheadComp(headOptions) {
      const { getTrComp } = this;
      const { attrs = {}, trOptions = {} } = headOptions;
      const listeners = {};
      if (Object.keys(trOptions).length) {
        return (
          <thead
            {...{
              attrs,
              on: listeners
            }}
          >
            {getTrComp(trOptions)}
          </thead>
        );
      } else {
        return;
      }
    },
    getTableComp(tableOptions) {
      const { headOptions = {}, bodyOptions = {}, attrs = {}, useThead = false } = tableOptions;
      const { handleMouseleave, handleMouseup } = this;
      const listeners = {
        mouseleave: handleMouseleave,
        mouseup: handleMouseup,
        click: function (e) {
          console.log("table inputListeners");
          e.stopPropagation();
        }
      };

      const { getTbodyComp, getTheadComp } = this;
      return (
        <table
          {...{
            attrs,
            on: listeners
          }}
          ref="designPrintTable"
        >
          {useThead ? getTheadComp(headOptions) : ""}
          {getTbodyComp(bodyOptions)}
        </table>
      );
    },
    getSelectRangeComp() {
      return <div></div>;
    }
  },

  render() {
    const { formRef, getTableComp, options } = this;

    return (
      <div class="designTableWrapper" ref={formRef}>
        {getTableComp(options)}
      </div>
    );
  }
};
