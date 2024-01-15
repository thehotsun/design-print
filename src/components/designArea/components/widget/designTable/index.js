import "./index.less";
export default {
  name: "designTable",

  props: {
    onlyShow: Boolean,
    formData: Object,
    options: Object
  },
  data() {
    return { formRef: "q" };
  },

  watch: {},
  async created() {
    this.init();
  },

  methods: {
    init() {},
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
      const listeners = {};
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
