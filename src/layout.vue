<template>
  <div class="design_print_layout">
    <el-container>
      <el-header>
        <operationArea></operationArea>
      </el-header>
      <el-main>
        <el-container>
          <el-aside>
            <dataSource></dataSource>
          </el-aside>
          <el-main>
            <el-container>
              <el-header>
                <widgetList></widgetList>
              </el-header>
              <el-main>
                <designArea></designArea>
              </el-main>
            </el-container>
          </el-main>
          <el-aside style="overflow-x: hidden">
            <panel></panel>
          </el-aside>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import dataSource from "./components/dataSource";
import panel from "./components/panel";
import designArea from "./components/designArea";
import widgetList from "./components/widgetList";
import operationArea from "./components/operationArea";

export default {
  name: "design_print_layout",
  components: {
    dataSource,
    panel,
    designArea,
    widgetList,
    operationArea
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less" scoped>
::v-deep ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>
