const merge = require('./merge');
const structure = require('./structure');
const calculator = require('./calculator');
// import transfer from './dom_optimize_transfer';
/**
 * 优化器
 * @param {*} node 优化节点
 * @param {Object} option 优化配置
 * @param {Object} option.aiData ai数据
 * @param {Object} option.ruleMap 合图规则
 */
let optimize = (node, { aiData, ruleMap }) => {
  structure(node);
  merge(node, aiData, ruleMap);
  calculator(node);
  // transfer(node);
};
module.exports = optimize;
