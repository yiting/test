
const merge = require('./designjson_optimize_merge');
const structure =  require('./designjson_optimize_structure');
const transfer =  require('./designjson_optimize_transfer');
// import transfer from './dom_optimize_transfer';

let optimize = _document => {
    structure(_document);
    merge(_document);
    transfer(_document);
}
module.exports = optimize;