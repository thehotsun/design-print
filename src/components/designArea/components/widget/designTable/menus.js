import { cloneDeep } from "lodash";
export function getMenus(that) {
  return [
    {
      name: "合并单元格",
      onClick: function (e) {
        e.stopPropagation();
        that.hideMenu();
        console.log("menu1 clicked", e);
        that.operateHistory.push({
          node: cloneDeep(that.selectRange),
          type: "合并单元格"
        });
        that.mergeCell();
      }
    },
    {
      name: "左侧插入列",
      onClick: function (e) {
        e.stopPropagation();
        that.hideMenu();
        console.log("menu2 clicked", e);
        that.leftInsertColumn();
        that.operateHistory.push({
          node: cloneDeep(that.selectRange),
          type: "左侧插入列"
        });
      }
    },
    {
      name: "右侧插入列",
      onClick: function (e) {
        e.stopPropagation();
        that.hideMenu();
        that.rightInsertColumn();
        console.log("menu3 clicked", e);
        that.operateHistory.push({
          node: cloneDeep(that.selectRange),
          type: "右侧插入列"
        });
      }
    },
    {
      name: "上方插入行",
      onClick: function (e) {
        e.stopPropagation();
        that.hideMenu();
        that.topInsertRow();
        that.operateHistory.push({
          node: cloneDeep(that.selectRange),
          type: "上方插入行"
        });
        console.log("menu3 clicked", e);
      }
    },
    {
      name: "下方插入行",
      onClick: function (e) {
        e.stopPropagation();
        that.hideMenu();
        that.bottomInsertRow();
        console.log("menu2 clicked", e);
        that.operateHistory.push({
          node: cloneDeep(that.selectRange),
          type: "下方插入行"
        });
      }
    },
    {
      name: "删除行",
      onClick: function (e) {
        e.stopPropagation();
        that.hideMenu();
        that.delRow();
        that.operateHistory.push({
          node: cloneDeep(that.selectRange),
          type: "删除行"
        });
        console.log("menu3 clicked", e);
      }
    },
    {
      // TODO 合并状态删除列有问题
      name: "删除列",
      onClick: function (e) {
        e.stopPropagation();
        that.hideMenu();
        that.delColumn();
        that.operateHistory.push({
          node: cloneDeep(that.selectRange),
          type: "删除列"
        });
        console.log("menu2 clicked", e);
      }
    },
    {
      name: "清除内容",
      onClick: function (e) {
        e.stopPropagation();
        that.hideMenu();
        that.clearValue();
        console.log("menu3 clicked", e);
      }
    }
  ];
}
