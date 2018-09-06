/**
 * functionName
 * @param  {Object} option 主流程传进来的参数
 * @return {Optimize}        返回原对象
 */
function functionName(data, option) {
    fn(data.data, option);
    return this;
}

function fn(json) {
    /**
     * todo
     */
}
module.exports = function(data, conf, opt) {
    Object.assign(Option, opt);
    Object.assign(Config, conf);
    fn(data);
}