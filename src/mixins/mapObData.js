import designOptions from "../define/obRenderOptions";
import TabDefine from "../define/TabDefine";

export default {
  computed: {
    designOptions() {
      return designOptions;
    },
    renderOptions() {
      const { renderOptionList, curTabIndex } = designOptions;
      return renderOptionList[curTabIndex - 1];
    },
    printWidgetList() {
      const { renderOptionList, curTabIndex } = designOptions;
      return renderOptionList[curTabIndex - 1].printWidgetList;
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
    setCurWidget(val) {
      designOptions.curWidget = val;
    },
    addTabData(index) {
      designOptions.renderOptionList.push(new TabDefine({ index }));
    }
  }
};
