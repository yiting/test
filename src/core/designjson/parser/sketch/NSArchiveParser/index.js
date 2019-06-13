const archiveParser = require('./archive-parser');
const plistParser = require('./plist-parser');

function NSArchiveParser(val) {
  let res = '';
  try {
    let obj = plistParser(val);
    res = archiveParser(obj);
  } catch (err) {}
  return res;
}

module.exports = NSArchiveParser;
