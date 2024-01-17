<template>
  <div>
    <el-tabs :value="curTabIndex" type="card" editable @tab-remove="removeTab" @tab-add="addTab" @tab-click="handleTabChange">
      <el-tab-pane v-for="item in renderOptionList" :key="item.index" :label="'分页 ' + (item.index * 1 + 1)" :name="item.index">
        <div class="print-component-design">
          <div class="print-printPanel panel-index-2">
            <div class="hiprint-printPaper design" original-height="148" style="width: 210mm; height: 147mm">
              <div class="hiprint-printPaper-content">
                <div class="hiprint-headerLine" style="position: absolute; width: 100%; border-top: 1px dashed rgb(201, 190, 190); height: 7pt; top: 0pt"></div>
                <div class="hiprint-footerLine" style="position: absolute; width: 100%; border-top: 1px dashed rgb(201, 190, 190); height: 7pt; top: 408pt"></div>

                <div
                  class="hiprint-referLine hideheaderLinetarget hiprint-referLine-x"
                  style="
                    position: absolute;
                    width: 7pt;
                    border-left: 1px dashed rgb(138, 143, 153);
                    height: 100%;
                    left: -12px;
                    top: 0px;
                    border-top-color: rgb(138, 143, 153);
                    border-right-color: rgb(138, 143, 153);
                    border-bottom-color: rgb(138, 143, 153);
                  "
                  id="cadec79d9f3d4fd89ce069f5a9e4aece"
                  direction="x"
                ></div>
                <span
                  class="hiprint-paperNumber"
                  style="
                    position: absolute;
                    cursor: pointer;
                    font-size: 9pt;
                    font-family: SimSun;
                    font-weight: lighter;
                    color: rgb(46, 48, 51);
                    letter-spacing: 0.75pt;
                    line-height: initial;
                    left: 30pt;
                    bottom: 5pt;
                  "
                  >3
                  <div
                    panelindex="3"
                    class="resize-panel"
                    style="
                      width: 100%;
                      height: 100%;
                      top: 0px;
                      left: 0px;
                      position: absolute;
                      background-color: rgba(0, 0, 0, 0.09);
                      cursor: pointer;
                      display: none;
                      color: rgb(0, 0, 0);
                    "
                  ></div
                ></span>
                <div class="widgetRenderArea">
                  <div v-for="item in printWidgetList" :key="item.options.customAttrs.id">
                    <component :is="item.widgetType.type" :options="item.options"></component>
                  </div>
                </div>
              </div>
              <hiprint-rul-wrapper></hiprint-rul-wrapper>
              <grid-svg></grid-svg>
              <hiprint-pager-margin></hiprint-pager-margin>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import grid from "./components/layout/svg/grid";
import hiprintRulWrapper from "./components/layout/rulWrapper";
import hiprintPagerMargin from "./components/layout/pagerMargin";

import designTable from "./components/widget/designTable";

import mapObData from "@/mixins/mapObData";

export default {
  name: "designArea",
  components: {
    customTable: designTable,
    gridSvg: grid,
    hiprintRulWrapper,
    hiprintPagerMargin
  },
  mixins: [mapObData],

  data() {
    return {};
  },

  methods: {
    handleTabChange(targetName) {
      console.log("handleTabChange", targetName.index);
      this.setCurTabIndex(targetName.index);
    },
    addTab() {
      let newTabName = `${this.renderOptionList.length}`;
      this.addTabData(newTabName);
      this.setCurTabIndex(newTabName);
    },
    removeTab(targetName) {
      console.log("targetName", targetName);
      this.delTabData(targetName);
      const length = this.renderOptionList.length;
      if (targetName === `${length}`) {
        this.setCurTabIndex(`${length - 1}`);
      } else {
        this.setCurTabIndex(targetName);
        this.renderOptionList.map((item, index) => {
          item.index = `${index}`;
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.print-component-design {
  background-color: #f7f8fa;
  position: relative;
}
.hiprint-printPaper {
  position: relative;
  padding: 0 0 0 0;
  page-break-after: always;
  overflow-x: hidden;
  overflow: hidden;
  .hiprint-printPaper-content {
    position: absolute;
    width: 100%;
    height: 100%;
    color: #000;
  }
}

::v-deep .hiprint-printPaper * {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
}

.hiprint-printPanel .hiprint-printPaper:last-child {
  page-break-after: avoid;
}

.hiprint-printPaper.design {
  margin: 0px auto;
  margin-top: 16px;
  background-color: #ffffff !important;
  border: 1px solid transparent !important;
  overflow: visible;
}
.hiprint-printPaper,
.hiprint-printPanel {
  box-sizing: border-box;
  border: 0px;
}
.widgetRenderArea {
  position: relative;
  padding: 28.3465pt;
  width: 100%;
  height: 100%;
}
</style>
