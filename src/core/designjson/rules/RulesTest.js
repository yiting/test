const RulesEvaluation = require('./RulesEvaluation');

//testData1.json 包含颜色相似度、层级相似度、最小父层级相似度、大小相似度、相交相似度测试数据
//testData2.json 包含颜色复杂度数据
//symbol.json 包含symbol数据
//canCssData.json 能否css的测试数据
var nodelist =require("./testData/testData1.json");
var sliceArr = require("./testData/avatarSlice.json")
var aiArr = require("./testData/ai.json")

function main(){
    var ruleParamObj = {
        "ColorSimilar":{
            "weight":100
        },
        "SizeSimilar":{
            "weight":10
        },
        "IntersectSimilar":{
            "weight":10
        },
        "ZIndexSimilar":{
            "weight":100
        }
    };
    ruleParamObj.sliceArr = sliceArr;
    ruleParamObj.aiArr = aiArr;
    /**
     * 初始化
     * @param {Object} ruleParamObj 
     * ruleParamObj.XXXXXSimilar : 某个评分规则的入参，内含weight属性，表示该规则的权重
     * ruleParamObj.sliceArr : slice区域数组
     * ruleParamObj.aiArr : AI认为该合并的区域数组
     */
    var eva = new RulesEvaluation(ruleParamObj);
    for (let i = 0; i < nodelist.length; i++) {
        let node = nodelist[i];
        for (let j = i + 1; j < nodelist.length; j++) {
            let brother = nodelist[j];
            console.log("nodeA: "+ node.name + "   nodeB:"+ brother.name )
            eva.getEvaluationScore(node,brother);
            console.log("\n");
        }
    }
}

main();