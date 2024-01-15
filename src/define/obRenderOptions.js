import Vue from "vue";
import TabDefine from "./TabDefine";
const options = Vue.observable({
  curTabIndex: "0",
  curWidget: {},
  renderOptionList: [new TabDefine({})]
});

export default options;
