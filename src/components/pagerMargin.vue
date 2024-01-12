<template>
  <div class="hiprint_pager_margin">
    <div
      class="left_top pager_margin_tag"
      style="left: 13.3465pt; top: 13.3465pt"
    ></div>
    <div
      class="right_top pager_margin_tag"
      style="right: 13.3465pt; top: 13.3465pt"
    ></div>
    <div
      class="left_bottom pager_margin_tag"
      style="left: 13.3465pt; bottom: 13.3465pt"
    ></div>
    <div
      class="right_bottom pager_margin_tag"
      style="right: 13.3465pt; bottom: 13.3465pt"
    ></div>
  </div>
</template>

<style lang="less" scoped>
.hiprint_pager_margin {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
  pointer-events: none;
  border: 0;
  top: 0;
  left: 0;
}
.hiprint_pager_margin .left_top {
  border-top: none !important;
  border-left: none !important;
}
.hiprint_pager_margin .right_top {
  border-top: none !important;
  border-right: none !important;
}
.hiprint_pager_margin .right_bottom {
  border-bottom: none !important;
  border-right: none !important;
}
.hiprint_pager_margin .left_bottom {
  border-bottom: none !important;
  border-left: none !important;
}
.hiprint_pager_margin .pager_margin_tag {
  position: absolute;
  width: 15pt;
  height: 15pt;
  border: 1px solid #e5e5e5;
}
</style>
