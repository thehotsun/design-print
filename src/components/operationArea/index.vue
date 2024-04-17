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
    <el-dialog title="预览" custom-class="profession-dialog" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="900px">
      <div v-for="item in printWidgetListCopy" :key="item.options.id">
        <component :is="item.widgetType.type" :onlyShow="true" :options="item.options"></component>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mapObData from "@/mixins/mapObData";
import designTable from "@/components/designArea/components/widget/designTable";
import { cloneDeep } from "lodash";
export default {
  components: { customTable: designTable },
  mixins: [mapObData],
  data() {
    return {
      printWidgetListCopy: null,
      dialogVisible: false,
      previewData: "",
      previewOptions: [
        { label: "数据1", value: "data1" },
        { label: "数据2", value: "data2" }
        // 可以根据实际需要添加更多预览数据选项
      ],
      form: {
        值1: {
          name: "我是转换后的值1name",
          value: "我是转换后的值1value"
        },
        值2: {
          name: "我是转换后的值2name",
          value: "我是转换后的值2value"
        }
      }
    };
  },
  mounted() {},
  methods: {
    preview() {
      this.dialogVisible = true;
      this.printWidgetListCopy = cloneDeep(
        this.printWidgetList.map((item) => {
          item.options.bodyOptions.trList.map((tr) => {
            tr.tdList.map((td) => {
              const value = td.options.inputValue;
              console.log(value);
              const replacedStr = value.replace(/\${(.*?)}/g, (match, placeholder) => {
                // 在这里可以根据 placeholder 进行替换操作
                // 这里简单地返回了一个固定的字符串，你可以根据实际情况进行替换
                const fields = placeholder.split(".");
                console.log(match, "match", fields);
                return `${this.form[fields[0]][fields[1]]}`;
              });
              td.options.inputValue = replacedStr;
              console.log(replacedStr);
            });
          });
          return item;
        })
      );
      // 实现预览逻辑
      console.log("预览数据：", this.previewData);
    },
    save() {
      // 实现保存逻辑
      console.log("保存数据");
    },
    handleConfirm() {
      console.log("handleConfirm");
    }
  }
};
</script>

<style lang="less" scoped>
.previewData {
  margin-right: 10px;
}
</style>
