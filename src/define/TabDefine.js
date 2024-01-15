export default function TabDefine({ index = "1" }) {
  return {
    index,
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
    printWidgetList: []
  };
}
