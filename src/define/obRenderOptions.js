import Vue from "vue";
import TabDefine from "./TabDefine";
const options = Vue.observable({
  curTabIndex: "0",
  curWidget: {
    currentTarget: {},
    target: {}
  },
  renderOptionList: [new TabDefine({})]
});

export default options;
