<template>
  <div class="content">
    <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 10px">
      <span class="previewData">预览数据:</span>
      <el-select v-model="previewData" placeholder="请选择预览数据" style="margin-right: 10px">
        <el-option v-for="item in previewOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button type="primary" @click="preview">预览</el-button>
      <el-button type="success" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      previewData: "",
      previewOptions: [
        { label: "数据1", value: "data1" },
        { label: "数据2", value: "data2" }
        // 可以根据实际需要添加更多预览数据选项
      ]
    };
  },
  methods: {
    preview() {
      // 实现预览逻辑
      console.log("预览数据：", this.previewData);
    },
    save() {
      // 实现保存逻辑
      console.log("保存数据");
    }
  }
};
</script>

<style lang="less" scoped>
.previewData {
  margin-right: 10px;
}
</style>
