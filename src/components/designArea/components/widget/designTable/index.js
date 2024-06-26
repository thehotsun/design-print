import "./index.less";
import { ContextMenu, findNearestTd, mergeStyle } from "@/utils/index";

import Draggable from "vuedraggable";
import mapObData from "@/mixins/mapObData";
// import { cloneDeep } from "lodash";
import { getMenus } from "./menus";
import { mergeCell, delColumn, delRow, bottomInsertRow, topInsertRow, rightInsertColumn, leftInsertColumn, resetAxisInfo } from "./cellOperate";

export default {
  name: "designTable",
  components: { Draggable },
  mixins: [mapObData],
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
        // 用于左击也能选中当前td
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
      operateHistory: [],
      mergeCell: mergeCell.bind(this),
      delColumn: delColumn.bind(this),
      delRow: delRow.bind(this),
      bottomInsertRow: bottomInsertRow.bind(this),
      topInsertRow: topInsertRow.bind(this),
      rightInsertColumn: rightInsertColumn.bind(this),
      leftInsertColumn: leftInsertColumn.bind(this),
      resetAxisInfo: resetAxisInfo.bind(this)
    };
  },

  watch: {
    // 处理setCurWidget事件
    selectRange: {
      deep: true,
      handler(val) {
        const { colStartIndex, rowStartIndex, rowEndIndex, colEndIndex } = val;
        if (colStartIndex > 0 && colEndIndex > 0 && rowStartIndex > 0 && rowEndIndex > 0) {
          const target = this.printWidgetList.find((item) => item.options === this.options);
          const currentTarget = [];
          for (let i = 0; i < rowEndIndex - rowStartIndex + 1; i++) {
            for (let j = 0; j < colEndIndex - colStartIndex + 1; j++) {
              const element = this.options.bodyOptions.trList[rowStartIndex + i - 1].tdList[colStartIndex + j - 1];
              currentTarget.push(element);
            }
          }
          this.setCurWidget(target, currentTarget);
        }
      }
    }
  },
  async created() {
    this.init();
  },

  methods: {
    init() {
      const that = this;
      this.menuSinglton = ContextMenu({
        menus: getMenus(that)
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
    clearValue() {},

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
      if (rowIndex > 0 && colIndex > 0 && (rowindex * 1 !== rowIndex || colindex * 1 !== colIndex)) {
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
      let {
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
        curTd,
        onlyShow
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
      const draggableStyle = mergeStyle("height: 100%;overflow-y: auto; display:flex;padding: 4px 10px;", options.styleForm);
      // TODO style这里table默认宽度187是否需要更改？
      return (
        <td
          {...{
            attrs,
            on: listeners
          }}
          style={style}
        >
          <div class="tdContent" style={{ background: attrs.rowspan > 1 || attrs.colspan > 1 ? "#fff" : "" }}>
            {onlyShow ? (
              <span>{options.inputValue}</span>
            ) : checkShowInput(attrs, rowIndex, colIndex) ? (
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
                style={draggableStyle}
                class={
                  checkIsSelect({ colIndex: attrs["data-colindex"], rowIndex: attrs["data-rowindex"] }) ? (options.styleForm.backgroundColor ? "selected" : "selected black") : ""
                }
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
