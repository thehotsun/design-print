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
    return { formRef: "q", menuSinglton: null };
  },

  watch: {},
  async created() {
    this.init();
  },

  methods: {
    init() {
      this.menuSinglton = ContextMenu({
        menus: [
          {
            name: "合并单元格",
            onClick: function (e) {
              console.log("menu1 clicked", e);
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

      const listeners = {};
      return (
        <td
          {...{
            attrs,
            on: listeners
          }}
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
          {tdList.map((item) => {
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
      const { handleContextmenu } = this;
      const listeners = {
        contextmenu: handleContextmenu
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
