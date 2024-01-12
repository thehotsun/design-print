<template>
  <div class="design_print_layout">
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
      <el-aside>
        <panel></panel>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import dataSource from './components/dataSource'
import panel from './components/panel'
import designArea from './components/designArea'
import widgetList from './components/widgetList'
export default {
  name: 'design_print_layout',
  components: {
    dataSource,
    panel,
    designArea,
    widgetList,
  },
}
</script>
