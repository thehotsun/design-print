<template>
  <div class="print-component-design">
    <div class="print-printPanel panel-index-2">
      <div
        class="hiprint-printPaper design"
        original-height="148"
        style="width: 210mm; height: 147mm"
      >
        <div class="hiprint-printPaper-content">
          <div
            class="hiprint-headerLine"
            style="
              position: absolute;
              width: 100%;
              border-top: 1px dashed rgb(201, 190, 190);
              height: 7pt;
              top: 0pt;
            "
          ></div>
          <div
            class="hiprint-footerLine"
            style="
              position: absolute;
              width: 100%;
              border-top: 1px dashed rgb(201, 190, 190);
              height: 7pt;
              top: 408pt;
            "
          ></div>

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
        </div>
        <hiprint-rul-wrapper></hiprint-rul-wrapper>
        <grid-svg></grid-svg>
        <hiprint-pager-margin></hiprint-pager-margin>
      </div>
    </div>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import grid from './components/svg/grid'
import hiprintRulWrapper from './components/rulWrapper'
import hiprintPagerMargin from './components/pagerMargin'
export default {
  name: 'App',

  components: {
    HelloWorld,
    gridSvg: grid,
    hiprintRulWrapper,
    hiprintPagerMargin,
  },
}
</script>

<style lang="less" scoped>
.print-component-design {
  background-color: #f7f8fa;
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

.hiprint-printPaper * {
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
</style>
