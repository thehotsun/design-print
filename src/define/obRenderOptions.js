export default {
  index: 1,
  paperType: "A4",
  height: 148,
  width: 210,
  paperHeader: 0,
  paperFooter: 415.52755905511816,
  paperNumberLeft: 550.2755905511812,
  paperNumberTop: 393.52755905511816,
  pageNumberStyle: {
    paperNumberType: "paperNo",
    paperNumberPosition: "居左",
    fontSize: "9",
    fontFamily: "SimSun",
    fontWeight: "lighter",
    letterSpacing: "0.75",
    color: "#2e3033"
  },
  paperMarginTop: 10,
  paperMarginRight: 10,
  paperMarginBottom: 10,
  paperMarginLeft: 10,
  printBackgroundImage: false,
  backgroundImage: "",
  backgroundImageName: "",
  printWidgetList: [
    {
      options: {
        // customAttrs对应右侧选中元素后展示的仪表盘
        customAttrs: {
          id: "",
          left: 34.5,
          top: 112.5,
          height: 75,
          width: 553,
          title: "自定义表格",
          textAlign: "center",
          row: 2,
          column: 4,
          tableBorderTop: "solid",
          tableBorderLeft: "solid",
          tableBorderBottom: "solid",
          tableBorderRight: "solid",
          zIndex: "90"
          // 横向坐标
          // tableBorderCrosswise: "solid",
          // 纵向坐标
          // tableBorderLengthways: "solid",
        },
        // attrs直接赋值给table标签
        attrs: { border: "0", cellpadding: "0", cellspacing: "0" },
        bodyOptions: {
          attrs: {},
          trList: [
            {
              attrs: {},
              tdList: [
                {
                  attrs: {
                    colspan: 1,
                    rowspan: 2
                  },
                  options: {
                    value: "22222222阿三大苏打实打实啊实打实的啊实打实大苏打"
                  }
                },
                {
                  attrs: {
                    colspan: 1,
                    rowspan: 1
                  }
                },
                {
                  attrs: {
                    colspan: 1,
                    rowspan: 1
                  }
                }
              ]
            },
            {
              attrs: {},
              tdList: [
                {
                  attrs: {
                    colspan: 3,
                    rowspan: 2
                  },
                  options: {
                    value: "22222222阿三大苏打实打实啊实打实的啊实打实大苏打"
                  }
                },
                {
                  attrs: {
                    colspan: 1,
                    rowspan: 1
                  }
                },
                {
                  attrs: {
                    colspan: 1,
                    rowspan: 1
                  }
                }
              ]
            },
            {
              attrs: {},
              tdList: [
                {
                  attrs: {
                    colspan: 1,
                    rowspan: 1
                  },
                  options: {
                    value: "22222222阿三大苏打实打实啊实打实的啊实打实大苏打"
                  }
                },
                {
                  attrs: {
                    colspan: 1,
                    rowspan: 1
                  },
                  options: {
                    value: "22222222阿三大苏打实打实啊实打实的啊实打实大苏打"
                  }
                },
                {
                  attrs: {
                    colspan: 1,
                    rowspan: 1
                  }
                }
              ]
            },
            {
              attrs: {},
              tdList: [
                {
                  attrs: {
                    colspan: 1,
                    rowspan: 1
                  },
                  options: {
                    value: "22222222阿三大苏打实打实啊实打实的啊实打实ssssssssssssssssss大苏打"
                  }
                },
                {
                  attrs: {
                    colspan: 1,
                    rowspan: 1
                  }
                },
                {
                  attrs: {
                    colspan: 1,
                    rowspan: 1
                  }
                }
              ]
            }
          ]
        },
        useThead: false,
        headOptions: {
          attrs: {},
          trOptions: {
            attrs: {},
            tdList: []
          }
        }
      },
      widgetType: {
        type: "customTable"
      }
    }
  ]
};
