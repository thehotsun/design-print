<template>
  <div class="design_print_widget_list relative">
    <div>组件列表</div>
    <el-scrollbar>
      <el-menu class="el-menu-horizontal" mode="horizontal">
        <el-menu-item v-for="(item, index) in list" :key="index" @click="handleClick(item)">
          <div class="relative menu-item">
            <i :class="item.icon"></i>
            {{ item.text }}
            <i v-if="item.icon2" :class="item.icon2"></i>
          </div>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
    <div v-if="showtableSetting" class="absolute gridSetting">
      <tableSetting @handleTable="handleTable"></tableSetting>
    </div>
  </div>
</template>

<script>
import tableSetting from "./components/tableSetting.vue";
import customTableDefine from "../../define/customTableDefine";
import renderOptions from "../../define/obRenderOptions";
export default {
  name: "widgetList",
  components: {
    tableSetting
  },
  data() {
    return {
      list: [
        // 在这里添加你的列表项
        { text: "表格", icon: "el-icon-s-grid", icon2: "el-icon-caret-bottom", showPanel: true }
      ],
      showtableSetting: true,
      renderOptions
    };
  },
  methods: {
    handleClick(item) {
      // 在这里处理点击事件
      if (item.text === "表格") {
        this.showtableSetting = !this.showtableSetting;
      }
    },
    handleTable([row, column]) {
      this.showtableSetting = false;
      renderOptions.printWidgetList.push(
        new customTableDefine({
          row,
          column
        })
      );
      console.log("handleTable", row, column);
    }
  }
};
</script>

<style lang="less" scoped>
.design_print_widget_list {
}
.scrollbar-wrap {
}
.el-menu-horizontal {
  display: flex;
  align-items: center;
}
.el-menu-horizontal .el-menu-item {
  display: flex;
  align-items: center;
}
.el-menu-horizontal .el-menu-item i {
  margin-left: 0px;
  margin-right: 0px;
}
.menu-item {
  // overflow: initial;
  // height: 100%;
}
::v-deep .el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: none;
}
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.gridSetting {
  z-index: 99;
  left: 10px;
  top: 60px;
}
</style>
