import "./index.less";
import { ContextMenu } from "@/utils/index";
import { TrDefine, TdDefine } from "@/define/customTableDefine";
import Draggable from "vuedraggable";

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
        colEndIndex: 0
      },
      isProcessing: false,
      showInputAxis: {
        rowIndex: 0,
        colIndex: 0
      }
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
              console.log("menu1 clicked", e);
              that.mergeCell();
            }
          },
          {
            name: "左侧插入列",
            onClick: function (e) {
              console.log("menu2 clicked", e);
              that.leftInsertColumn();
            }
          },
          {
            name: "右侧插入列",
            onClick: function (e) {
              that.rightInsertColumn();
              console.log("menu3 clicked", e);
            }
          },
          {
            name: "上方插入行",
            onClick: function (e) {
              that.topInsertRow();
              console.log("menu3 clicked", e);
            }
          },
          {
            name: "下方插入行",
            onClick: function (e) {
              that.bottomInsertRow();
              console.log("menu2 clicked", e);
            }
          },
          {
            name: "删除行",
            onClick: function (e) {
              that.delRow();
              console.log("menu3 clicked", e);
            }
          },
          {
            name: "删除列",
            onClick: function (e) {
              that.delColumn();
              console.log("menu2 clicked", e);
            }
          },
          {
            name: "清除内容",
            onClick: function (e) {
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
    mergeCell() {
      const {
        selectRange: { colStartIndex, rowStartIndex, rowEndIndex, colEndIndex },
        options: {
          bodyOptions: { trList }
        }
      } = this;
      const target = trList[rowStartIndex - 1].tdList[colStartIndex - 1];
      const colspan = colEndIndex - colStartIndex + 1;
      const rowspan = rowEndIndex - rowStartIndex + 1;
      target.attrs.colspan = colspan;
      target.attrs.rowspan = rowspan;
      for (let index = 0; index < rowspan; index++) {
        let tdIndex, length;
        if (index === 0) {
          tdIndex = colStartIndex;
          length = colspan - 1;
          // trList[rowStartIndex - 1 + index].tdList.splice(colStartIndex, colspan - 1);
        } else {
          tdIndex = colStartIndex - 1;
          length = colspan;
          // trList[rowStartIndex - 1 + index].tdList.splice(colStartIndex - 1, colspan);
        }
        for (let j = 0; j < length; j++) {
          const options = trList[rowStartIndex - 1 + index].tdList[tdIndex * 1 + j].options;
          options.isDelete = 1;
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
        }
      } = this;
      const column = trList[0].tdList.length;
      trList.splice(rowEndIndex, 0, new TrDefine(column, rowEndIndex + 1));
      for (let index = rowEndIndex + 1; index < trList.length; index++) {
        trList[index].tdList.map((item) => {
          item.attrs["data-rowindex"]++;
        });
      }
    },
    topInsertRow() {
      const {
        selectRange: { rowStartIndex },
        options: {
          bodyOptions: { trList }
        }
      } = this;
      const column = trList[0].tdList.length;
      trList.splice(rowStartIndex - 1, 0, new TrDefine(column, rowStartIndex));
      for (let index = rowStartIndex; index < trList.length; index++) {
        trList[index].tdList.map((item) => {
          item.attrs["data-rowindex"]++;
        });
      }
      this.selectRange.rowStartIndex++;
      this.selectRange.rowEndIndex++;
    },
    rightInsertColumn() {
      const {
        selectRange: { colEndIndex },
        options: {
          bodyOptions: { trList }
        }
      } = this;
      trList.map((item) => {
        const {
          options: { isHead },
          attrs
        } = item.tdList[0];
        item.tdList.splice(colEndIndex, 0, new TdDefine({ colIndex: colEndIndex + 1, rowIndex: attrs["data-rowindex"], isHead }));
        for (let index = colEndIndex + 1; index < item.tdList.length; index++) {
          item.tdList[index].attrs["data-colindex"]++;
        }
      });
    },
    leftInsertColumn() {
      const {
        selectRange: { colStartIndex },
        options: {
          bodyOptions: { trList }
        }
      } = this;
      trList.map((item) => {
        const {
          options: { isHead },
          attrs
        } = item.tdList[0];
        item.tdList.splice(colStartIndex - 1, 0, new TdDefine({ colIndex: colStartIndex, rowIndex: attrs["data-rowindex"], isHead }));
        for (let index = colStartIndex; index < item.tdList.length; index++) {
          item.tdList[index].attrs["data-colindex"]++;
        }
      });
      this.selectRange.colStartIndex++;
      this.selectRange.colEndIndex++;
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
      }
      return result;
    },
    handleMouseenter(e) {
      if (this.isProcessing) {
        console.log(this.isProcessing, "handleMouseenter", e.currentTarget);
        const {
          rowSpan,
          colSpan,
          dataset: { rowindex, colindex }
        } = e.currentTarget;
        this.selectRange.rowEndIndex = rowindex * 1 + (rowSpan * 1 - 1);
        this.selectRange.colEndIndex = colindex * 1 + (colSpan * 1 - 1);
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
    },
    handleMouseup() {
      // clearTimeout(this.timer);
      this.isProcessing = false;
    },
    handleMousedown(e) {
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
        this.isProcessing = true;
        const { rowindex, colindex } = e.currentTarget.dataset;
        console.log("handleMousedown", e.currentTarget, rowindex, colindex);
        this.selectRange.rowEndIndex = this.selectRange.rowStartIndex = rowindex * 1;
        this.selectRange.colEndIndex = this.selectRange.colStartIndex = colindex * 1;
      }
    },

    handleDblclick(e) {
      const {
        dataset: { rowindex, colindex }
      } = e.currentTarget;
      console.log("handleDblclick", e.currentTarget);
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
      this.showMenu(e);
    },
    setRenderOptions() {},
    onDragEnd(evt) {
      console.log("drag end", evt);
    },

    onDragAdd(evt) {
      console.log("onDragAdd", evt);
    },

    onDragUpdate(evt) {
      console.log("onDragUpdate", evt);
    },

    checkMove(evt) {
      console.log("checkMove", evt);
      return true;
    },
    getTdComp(tdOptions) {
      const { attrs = {}, options = {} } = tdOptions;
      const {
        handleMouseenter,
        handleMousedown,
        checkIsSelect,
        checkShowInput,
        handleDblclick,
        showInputAxis: { rowIndex, colIndex },
        checkMove,
        onDragUpdate,
        onDragAdd,
        onDragEnd
      } = this;
      const listeners = {
        mousedown: handleMousedown,
        mouseenter: handleMouseenter,
        dblclick: handleDblclick
      };
      const inputListeners = {
        change: function () {
          console.log("change");
        }
      };
      const length = this.options.bodyOptions.trList[0].tdList.length;
      // TODO style这里table默认宽度187是否需要更改？
      return (
        <td
          {...{
            attrs,
            on: listeners
          }}
          class={checkIsSelect({ colIndex: attrs["data-colindex"], rowIndex: attrs["data-rowindex"] }) ? "selected" : ""}
          style={{ width: 187 / length + "mm" }}
        >
          <div class="tdContent">
            {checkShowInput(attrs, rowIndex, colIndex) ? (
              <el-input
                {...{
                  attrs
                }}
                on={inputListeners}
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
                  {options.dragValList.map((item, index) => {
                    return (
                      <span style="" key={index}>
                        {item.id}
                      </span>
                    );
                  })}
                  <span key="inputValue">{options.inputValue}</span>
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
    const { formRef, getTableComp, options, handleContextmenu } = this;

    return (
      <div class="designTableWrapper" oncontextmenu={handleContextmenu} ref={formRef}>
        {getTableComp(options)}
      </div>
    );
  }
};
