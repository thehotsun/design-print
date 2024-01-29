<template>
  <div class="design_print_data_source">
    数据
    <el-scrollbar class="side-scroll-bar">
      <div class="panel-container">
        <el-tabs v-model="firstTab" class="no-bottom-margin indent-left-margin">
          <el-tab-pane name="componentLib">
            <span slot="label">表单字段</span>
            <el-collapse v-model="activeNames" class="widget-collapse">
              <el-collapse-item v-for="(item, index) in basicFields" :name="index" :key="index" :title="item[0].fieldName">
                <draggable
                  tag="ul"
                  ghost-class="ghost"
                  :list="item"
                  :clone="handleFieldWidgetClone"
                  :move="checkFieldMove"
                  :sort="false"
                  :group="{ name: 'dragGroup', pull: 'clone', put: false }"
                  @end="onFieldDragEnd"
                >
                  <li v-for="(ctn, index) in item" :key="index" class="container-widget-item" :title="ctn.displayName">
                    <span>{{ ctn.displayName }}</span>
                  </li>
                </draggable>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
// import { cloneDeep } from "lodash";
// import { generateId } from "@/utils/index";

export default {
  name: "dataSource",
  components: {
    Draggable
  },
  props: {
    designer: Object
  },
  data() {
    return {
      firstTab: "componentLib",
      activeNames: ["1", "2", "3", "4"],
      basicFields: []
    };
  },
  mounted() {
    this.loadWidgets();
  },
  methods: {
    getWidgetLabel(widget) {
      return widget.type;
    },

    loadWidgets() {
      this.basicFields = [
        [
          {
            type: "",
            alias: "",
            icon: "text-field",
            displayName: "标题",
            fieldName: "值1",
            fieldExpression: "${值1.name}",
            id: ""
          },
          {
            id: "",
            type: "",
            alias: "",
            icon: "text-field",
            displayName: "值",
            fieldName: "值1",
            fieldExpression: "${值1.value}"
          }
        ],
        [
          {
            type: "",
            alias: "",
            icon: "text-field",
            displayName: "标题",
            fieldName: "值2",

            fieldExpression: "${值2.name}",
            id: ""
          },
          {
            id: "",
            type: "",
            alias: "",
            icon: "text-field",
            displayName: "值",
            fieldName: "值2",
            fieldExpression: "${值2.value}"
          }
        ]
      ];
      this.activeNames = [];
      this.basicFields.map((item, index) => {
        this.activeNames.push(index);
      });
    },

    handleFieldWidgetClone(origin) {
      console.log("origin", origin);
      // let newWidget = cloneDeep(origin);
      // let tempId = generateId();
      // newWidget.id = tempId;
      // console.log("newWidget", newWidget);
      return origin.fieldExpression;
    },

    /* draggable组件的move钩子是在内部子组件被拖放到其他draggable组件时触发！！ */
    checkFieldMove(evt) {
      console.log("checkFieldMove", evt);
      return true;
    },

    onFieldDragEnd(evt) {
      //console.log('Drag end of container: ')
      console.log("onFieldDragEnd", evt);
    }
  }
};
</script>

<style lang="less" scoped>
.color-svg-icon {
  -webkit-font-smoothing: antialiased;
  color: #7c7d82;
}

.side-scroll-bar {
  ::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}

div.panel-container {
  padding-bottom: 10px;
}

.no-bottom-margin ::v-deep .el-tabs__header {
  margin-bottom: 0;
}

.indent-left-margin {
  ::v-deep .el-tabs__nav {
    margin-left: 20px;
  }
}

.el-collapse-item ::v-deep ul > li {
  list-style: none;
}

.widget-collapse {
  border-top-width: 0;

  ::v-deep .el-collapse-item__header {
    margin-left: 8px;
    font-style: italic;
    font-weight: bold;
  }

  ::v-deep .el-collapse-item__content {
    padding-bottom: 6px;

    ul {
      padding-left: 10px; /* 重置IE11默认样式 */
      margin: 0; /* 重置IE11默认样式 */
      margin-block-start: 0;
      margin-block-end: 0.25em;
      padding-inline-start: 10px;

      &:after {
        content: "";
        display: block;
        clear: both;
      }

      .container-widget-item,
      .field-widget-item {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        width: 98px;
        float: left;
        margin: 2px 6px 6px 0;
        cursor: move;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        background: #fff;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        padding: 0 8px;
      }

      .container-widget-item:hover,
      .field-widget-item:hover {
        background: #f1f2f3;
        border-color: #409eff;

        .color-svg-icon {
          color: #409eff;
        }
      }

      .drag-handler {
        position: absolute;
        top: 0;
        left: 160px;
        background-color: #dddddd;
        border-radius: 5px;
        padding-right: 5px;
        font-size: 11px;
        color: #666666;
      }
    }
  }
}

.el-card.ft-card {
  border: 1px solid #8896b3;
}

.ft-card {
  margin-bottom: 10px;

  .bottom {
    margin-top: 10px;
    line-height: 12px;
  }

  /*
    .image-zoom {
      height: 500px;
      width: 620px
    }
    */

  .ft-title {
    font-size: 13px;
    font-weight: bold;
  }

  .right-button {
    padding: 0;
    float: right;
  }

  .clear-fix:before,
  .clear-fix:after {
    display: table;
    content: "";
  }

  .clear-fix:after {
    clear: both;
  }
}
</style>
