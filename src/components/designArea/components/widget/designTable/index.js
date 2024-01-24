import "./index.less";
import { ContextMenu } from "@/utils/index";
export default {
  name: "designTable",

  props: {
    onlyShow: Boolean,
    formData: Object,
    options: Object
  },
  data() {
    return {
      formRef: "q",
      menuSinglton: null,
      selectRange: {
        colStartIndex: 0,
        rowStartIndex: 0,
        rowEndIndex: 0,
        colEndIndex: 0
      },
      isProcessing: false
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
            }
          },
          {
            name: "右侧插入列",
            onClick: function (e) {
              console.log("menu3 clicked", e);
            }
          },
          {
            name: "上方插入行",
            onClick: function (e) {
              console.log("menu3 clicked", e);
            }
          },
          {
            name: "下方插入行",
            onClick: function (e) {
              console.log("menu2 clicked", e);
            }
          },
          {
            name: "删除行",
            onClick: function (e) {
              console.log("menu3 clicked", e);
            }
          },
          {
            name: "删除列",
            onClick: function (e) {
              console.log("menu2 clicked", e);
            }
          },
          {
            name: "清除内容",
            onClick: function (e) {
              console.log("menu3 clicked", e);
            }
          }
        ]
      });
      document.addEventListener("click", this.hideMenu);
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
    checkIsSelect({ colIndex, rowIndex }) {
      const { colStartIndex, rowStartIndex, rowEndIndex, colEndIndex } = this.selectRange;
      return colStartIndex <= colIndex && colEndIndex >= colIndex && rowStartIndex <= rowIndex && rowEndIndex >= rowIndex;
    },
    handleMouseenter(e) {
      if (this.isProcessing) {
        console.log(this.isProcessing, "handleMouseenter", e.target);
        // const colSpan = e.target.colSpan;
        const {
          rowSpan,
          colSpan,
          dataset: { rowindex, colindex }
        } = e.target;
        this.selectRange.rowEndIndex = rowindex * 1 + (rowSpan * 1 - 1);
        this.selectRange.colEndIndex = colindex * 1 + (colSpan * 1 - 1);
      }
    },
    handleMouseleave() {
      // if (this.isProcessing) {
      //   this.selectRange.rowStartIndex = 0;
      //   this.selectRange.colStartIndex = 0;
      //   this.selectRange.rowEndIndex = 0;
      //   this.selectRange.colEndIndex = 0;
      // }
    },
    handleMouseup() {
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
      console.log("handleMousedown", e);
      if ([0, 1].includes(e.button)) {
        this.isProcessing = true;
        this.selectRange.rowStartIndex = Number(e.target.dataset.rowindex);
        this.selectRange.colStartIndex = Number(e.target.dataset.colindex);
        this.selectRange.rowEndIndex = Number(e.target.dataset.rowindex);
        this.selectRange.colEndIndex = Number(e.target.dataset.colindex);
      }
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
    getTdComp(tdOptions) {
      const { attrs = {}, options = {} } = tdOptions;
      const { handleMouseenter, checkIsSelect } = this;
      const listeners = {
        mouseenter: handleMouseenter
      };
      return (
        <td
          {...{
            attrs,
            on: listeners
          }}
          class={checkIsSelect({ colIndex: attrs["data-colindex"], rowIndex: attrs["data-rowindex"] }) ? "selected" : ""}
        >
          <div>{options.value}</div>
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
      const { handleMouseleave, handleMouseup, handleMousedown } = this;
      const listeners = {
        mouseleave: handleMouseleave,
        mouseup: handleMouseup,
        mousedown: handleMousedown
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
        {/* {getSelectRangeComp()} */}
      </div>
    );
  }
};
