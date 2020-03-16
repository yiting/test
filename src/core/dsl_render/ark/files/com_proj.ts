export default (list: string[]) => {
  const files = list.map(path => {
    return `<File path="${path}"/>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
  <Project version="3">
    <Files>
      <File path="app.lua"></File>
      <File path="app.xml"></File>
      <File path="font.xml"></File>
      <File path="manifest.xml"></File>
      <File path="script/script/ams.lua"></File>
      <File path="script/animate.lua"></File>
      <File path="script/domainList.lua"></File>
      <File path="script/love.lua"></File>
      <File path="script/p_util.lua"></File>
      <File path="util/README.md"></File>
      <File path="util/cache.lua"></File>
      <File path="util/eventBus.lua"></File>
      <File path="util/net.lua"></File>
      <File path="util/report.lua"></File>
      <File path="util/animate.lua"></File>
      <File path="util/domainList.lua"></File>
      <File path="util/layout.lua"></File>
      <File path="util/qq.lua"></File>
      <File path="util/util.lua"></File>
      <File path="view/dataReport.lua"></File>
      <File path="view/index.lua"></File>
      <File path="view/index.xml"></File>
        ${files.join('')}
    </Files>
  </Project>`;
};
