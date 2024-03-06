<template>
  <div class="design_print_panel" @click.stop="void 0">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="背景颜色">
        <el-color-picker v-model="form.backgroundColor"></el-color-picker>
      </el-form-item>
      <el-form-item label="左右对齐">
        <el-select v-model="form.align" placeholder="请选择对齐方式">
          <el-option label="左对齐" value="left"></el-option>
          <el-option label="中间对齐" value="middle"></el-option>
          <el-option label="右对齐" value="right"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="垂直对齐">
        <el-select v-model="form.verticalAlign" placeholder="请选择对齐方式">
          <el-option label="顶部对齐" value="top"></el-option>
          <el-option label="居中对齐" value="verticalMiddle"></el-option>
          <el-option label="顶部对齐" value="bottom"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字体">
        <el-select v-model="form.fontFamily" placeholder="请选择字体">
          <el-option label="宋体" value="SimSun"></el-option>
          <el-option label="黑体" value="SimHei"></el-option>
          <!-- 添加更多字体选项 -->
        </el-select>
      </el-form-item>
      <el-form-item label="字体大小">
        <el-input-number v-model="form.fontSize" :min="1" :max="100"></el-input-number>
      </el-form-item>
      <el-form-item label="是否字体变粗">
        <el-radio-group v-model="form.isBold">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否斜体">
        <el-radio-group v-model="form.isItalic">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否删除线">
        <el-radio-group v-model="form.isStrikethrough">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否下划线">
        <el-radio-group v-model="form.isUnderline">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="字体颜色">
        <el-color-picker v-model="form.color"></el-color-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import mapObData from "@/mixins/mapObData";
export default {
  name: "panel",
  mixins: [mapObData],
  data() {
    return {};
  },
  computed: {
    form() {
      const currentTarget = this.curWidget.currentTarget || {};
      if (Array.isArray(currentTarget)) {
        return currentTarget[0]?.options.styleForm;
      } else {
        return currentTarget?.options?.styleForm || {};
      }
    }
  },
  watch: {
    "form.align": function (val) {
      this.syncStyleForm(val, "align");
    },
    "form.verticalAlign": function (val) {
      this.syncStyleForm(val, "verticalAlign");
    },
    "form.fontFamily": function (val) {
      this.syncStyleForm(val, "fontFamily");
    },
    "form.isBold": function (val) {
      this.syncStyleForm(val, "isBold");
    },
    "form.isItalic": function (val) {
      this.syncStyleForm(val, "isItalic");
    },
    "form.isStrikethrough": function (val) {
      this.syncStyleForm(val, "isStrikethrough");
    },
    "form.isUnderline": function (val) {
      this.syncStyleForm(val, "isUnderline");
    },
    "form.fontSize": function (val) {
      this.syncStyleForm(val, "fontSize");
    },
    "form.backgroundColor": function (val) {
      this.syncStyleForm(val, "backgroundColor");
    },
    "form.color": function (val) {
      this.syncStyleForm(val, "color");
    }
  },
  methods: {
    syncStyleForm(val, key) {
      const currentTarget = this.curWidget.currentTarget || {};
      if (Array.isArray(currentTarget)) {
        currentTarget.map((item) => {
          item.options.styleForm[key] = val;
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.design_print_panel {
  padding: 20px 10px;
  padding-top: 50px;
  box-sizing: border-box;
}
.page-scroll {
  height: 100%;
}

.page-scroll .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
