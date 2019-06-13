
const RulesScore = require('./Rules')
class DistanceScore extends RulesScore {
    static getScore(node,brother) {
        let rect = getRect(node,brother);
        let a = rect.width - node.width - brother.width;
        let b = rect.height - node.height - brother.height;
        return -1 * (a + b) + this.MaxVal / this.MaxVal;
    }
}
module.exports = DistanceScore;