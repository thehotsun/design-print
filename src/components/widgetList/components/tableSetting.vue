<template>
  <div class="print-single-component-table ng-scope ng-hide" ng-click="$event.stopPropagation();" style="top: 111px; left: 678.5px">
    <div class="print-single-component-table-title">
      <span v-if="tableTrNum === 0" class="">插入表格</span>
      <span v-else>{{ transformAxis(tableTrNum)[0] }}X{{ transformAxis(tableTrNum)[1] }}表格</span>
      <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
        <i class="el-icon-question"></i>
      </el-tooltip>
    </div>
    <div class="print-single-component-table-matrix" @mouseleave="handleMouseleave" @mouseup="handleMouseup" @mousedown="handleMousedown">
      <div style="display: flex; flex-wrap: wrap; height: 144px; width: 180px">
        <div
          v-for="(item, index) in 80"
          :key="index"
          @mouseenter="handleMouseenter"
          style="margin: 2px; border: 1px solid rgb(100, 100, 100); box-sizing: border-box; width: 14px; height: 14px; background-color: rgb(255, 255, 255)"
          :data-index="item"
          :class="check(transformAxis(item), transformAxis(tableTrNum)) ? 'active' : ''"
        ></div>
      </div>
    </div>
    <el-button type="text" class="print-single-component-table-button" @click="openTableDialog">
      <i class="el-icon-s-grid"></i>
      <span> 自定义表格 </span>
    </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableTrNum: 0,
      isProcessing: false
    };
  },
  methods: {
    openTableDialog() {
      
    },
    handleMouseenter(e) {
      if (this.isProcessing) {
        this.tableTrNum = e.target.dataset.index;
      }
    },
    handleMouseleave() {
      this.tableTrNum = 0;
    },
    handleMouseup() {
      this.isProcessing = false;
      if (this.tableTrNum > 0) {
        this.$emit("handleTable", this.transformAxis(this.tableTrNum));
      }
    },
    handleMousedown() {
      console.log("handleMousedown");
      this.isProcessing = true;
    },
    transformAxis(num) {
      const numStr = `${num}`;
      if (numStr.length === 1) {
        return [1, num];
      } else {
        if (numStr[1] === "0") {
          return [Number(numStr[0]), 10];
        }
        return [Number(numStr[0]) + 1, Number(numStr[1])];
      }
    },
    check([a, b], [c, d]) {
      if (a <= c && b <= d) {
        return true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.print-single-component-table {
  width: 180px;
  height: 200px;
  background: #fff;
  border: 1px solid #f2f2f2;
  padding: 10px 20px;
  box-shadow: 0px 0px 8px 0px rgba(4, 0, 0, 0.2);
  border-radius: 4px;
  font-size: 14px;
}
.print-single-component-table-title {
  margin-bottom: 8px;
  width: 100%;
  height: 20px;
  letter-spacing: 0px;
  color: #2e3033;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.print-single-component-table-button {
  color: #2e3033;
  display: flex;
  height: 20px;
  align-items: center;
  margin-top: 8px;
  letter-spacing: 0px;
  cursor: pointer;
}
.active {
  background-color: #2e3033 !important;
}
</style>
