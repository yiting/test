let Level = 0;
module.exports.level = function(level){
    console.info(`Logger level is ${Level}`);
}
module.exports.log = function(info){
    console.log(info)
}
module.exports.trace = function(info){
    console.trace(info)
}
module.exports.debug = function(info){
    console.debug(info)
}
module.exports.error = function(error){
    console.error(error);
}