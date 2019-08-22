export default (list: string[]) => {
  const files = list.map(path => {
    return `<File path="${path}"/>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
  <Project version="3">
    <Files>
      <File path="/com.cust"></File>
      <File path="/com.proj"></File>
      <File path="/src/app.lua"></File>
      <File path="/src/app.xml"></File>
      <File path="/src/font.xml"></File>
      <File path="/src/manifest.xml"></File>
      <File path="/src/script/script/ams.lua"></File>
      <File path="/src/script/animate.lua"></File>
      <File path="/src/script/domainList.lua"></File>
      <File path="/src/script/love.lua"></File>
      <File path="/src/script/p_util.lua"></File>
      <File path="/src/util/README.md"></File>
      <File path="/src/util/cache.lua"></File>
      <File path="/src/util/eventBus.lua"></File>
      <File path="/src/util/net.lua"></File>
      <File path="/src/util/report.lua"></File>
      <File path="/src/util/animate.lua"></File>
      <File path="/src/util/domainList.lua"></File>
      <File path="/src/util/layout.lua"></File>
      <File path="/src/util/qq.lua"></File>
      <File path="/src/util/util.lua"></File>
      <File path="/src/view/dataReport.lua"></File>
      <File path="/src/view/index.lua"></File>
      <File path="/src/view/index.xml"></File>
        ${files.join('')}
    </Files>
  </Project>`;
};
