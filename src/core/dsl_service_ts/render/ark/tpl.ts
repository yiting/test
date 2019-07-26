export default (
  xmlStr: string,
  option: {
    width: number;
    height: number;
  },
) => `<View size="${option.width},${
  option.height
}" anchors="0" metadatatype="shareData">
  <Event>
    <OnSetValue value="app.OnSetMetaData"/>
    <OnResize value="app.OnResize"/>
    </Event>
        ${xmlStr}
    <View>
  `;
