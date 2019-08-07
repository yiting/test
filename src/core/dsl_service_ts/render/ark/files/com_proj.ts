export default (list: string[]) => {
  const files = list.map(path => {
    return `<File path="${path}"/>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
        <Project version="3">
            <Files>
                ${files.join('')}
            </Files>
        </Project>`;
};
