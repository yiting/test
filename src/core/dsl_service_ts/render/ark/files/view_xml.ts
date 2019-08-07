export default (xmlStr: string) => {
  return xmlStr.replace(
    />/,
    ` metadatatype="shareData">
    <Event>
      <OnSetValue value="app.OnSetMetaData"/>
      <OnResize value="app.OnResize"/>
    </Event>`,
  );
};
