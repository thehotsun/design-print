import designOptions from "../define/obRenderOptions";
import TabDefine from "../define/TabDefine";

export default {
  computed: {
    designOptions() {
      return designOptions;
    },
    renderOptions() {
      const { renderOptionList, curTabIndex } = designOptions;
      return renderOptionList[curTabIndex];
    },
    renderOptionList() {
      return designOptions.renderOptionList;
    },
    printWidgetList() {
      const { renderOptionList, curTabIndex } = designOptions;
      return renderOptionList[curTabIndex].printWidgetList;
    },
    curTabIndex() {
      return designOptions.curTabIndex;
    },
    curWidget() {
      return designOptions.curWidget;
    }
  },
  methods: {
    setCurTabIndex(val) {
      designOptions.curTabIndex = val;
    },
    setCurWidget(target, currentTarget) {
      designOptions.curWidget.target = target;
      designOptions.curWidget.currentTarget = currentTarget;
    },
    addTabData(index) {
      designOptions.renderOptionList.push(new TabDefine({ index }));
    },
    delTabData(index) {
      designOptions.renderOptionList.splice(index, 1);
    }
  }
};
