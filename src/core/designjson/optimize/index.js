const merge = require('./merge');
const structure = require('./structure');
// const calculator = require('./calculator');
// import transfer from './dom_optimize_transfer';
/**
 * 优化器
 * @param {*} node 优化节点
 * @param {Object} option 优化配置
 */
let optimize = (node, option) => {
  structure(node);
  merge(node, option);
  // calculator(node);
  // transfer(node);
};
module.exports = optimize;
