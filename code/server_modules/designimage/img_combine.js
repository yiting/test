
var gm = require('gm');
var pageJson = "";
const draw = require('./draw');
const qlog = require("../log/qlog");
let logger ;

var inputDir = "";
// var outputDir = "";
var tmpFiles = [];
// var rootNode ;
var projectName;
var fs = require('fs');
var hasMaskChildren = false;
const exec = require('child_process').exec;
const BIN='./server_modules/designimage/Contents/Resources/sketchtool/bin/sketchtool';
var targetDir;
var logData={
    "costTime":0,
    "num":{
        "_makePreComposeImage":0,
        "_combineTwoShape":0,
        "_combineShapeGroupNodeWithNative":0
    }
}

//合图方法1：输入节点，先合并最里面的组，然后往外合并，直至合完，返回合成的bitmap节点
//mask方法1：输入节点和mask图层，输出该mask后的bitmap节点
//slice方法1：输入含slice的节点，输出slice后的bitmap节点

//"convert circle_left.gif circle_right.gif -compose Darken -composite    circle_intersection.gif"
//gm翻译为 outputImage.out("convert","circle_left.gif","circle_right.gif","-compose","Darken","-composite","circle_intersection.gif");

var ImageCombine = function(){
    this.rootNode = undefined;
    this.generateId = undefined;
    this.that = this;
    this.outputDir = undefined;
    // this.targetDir = undefined;
    this.init = function(param){
        inputDir = param.inputDir;      
        pageJson = param.pageJson;
        draw.init(param);
        that = this;
        logData.num._makePreComposeImage = 0;
        logData.num._combineTwoShape = 0;
        logData.costTime = new Date().getTime();
        projectName = param.projectName;
        this.generateId = param.generateId;
        this.outputDir = param.outputDir;
        if(this.generateId){
            this.outputDir += this.generateId+"/";  
        }
        targetDir = param.outputDir;
        logger= qlog.getInstance(qlog.moduleData.img);
        //logger.error('Cheese is too ripe!');
    }
    this.combineNode = function(node,param){
        var that = this;
        var  main = async () => {
            // let rootNode = rootNode; 
            var newNode = {};
            var outputImage ;
            if(param && param.width && param.height){
                outputImage=  gm(param.width, param.height,"#00ffffff");
            }else{
                outputImage=  gm(node.width, node.height,"#00ffffff");
            }
            
            var outputPath ;
            if(node._origin && node._origin._class == "text"){
                node.path = node._origin.do_objectID+".png";
            }
            if(node.path){
                node.path = node.path.substring(node.path.lastIndexOf("/")+1,node.path.length)
                outputPath = that.outputDir+that._getTmpFileName(node.path);
            }
            var imageChildren = node._imageChildren || [node];
            var isGroup = (node._imageChildren && node._imageChildren.length > 1) == true;
            var path;

            if(typeof that.rootNode == "undefined"){
                that.rootNode = node;
            }

            

            if(node.id.indexOf("_")== -1 && !(param && param.cantNative == true) && ( typeof node.isModified == "undefined" || node.isModified == false ) ){
                if(that.rootNode.id == node.id){
                    path = await this.combineShapeGroupNodeWithNative(node,true);
                    that.rootNode = undefined;
                }else{
                    path = await this.combineShapeGroupNodeWithNative(node);
                }
                return new Promise(function (resolve, reject) {
                    var newNode = {
                        _class : "combineImg",
                        x : node.x,
                        y : node.y,
                        width : node.width,
                        height : node.height,
                        path : path
                    }
                    resolve(newNode);
                });
            }else{

                hasMaskChildren = this.hasMaskChildren(imageChildren);

                for(var i =0,ilen = imageChildren.length;i<ilen;i++){
                    var item = imageChildren[i]; 
                    var origin = item._origin;
                    var isNeedCompositeAlpha = true;
                    // if(origin.do_objectID.indexOf('F1CCCE24-105E-4B48-ACAB-CCBEB5DE8C87')>-1){
                    //     console.log(112);
                    // }
                    // if(item.clippingMaskMode == 0 && item.shouldBreakMaskChain == false){//遇到遮罩层，则从这层网上找，将所有被遮罩的图层都合成一张图
                    // 针对shapeGroup做处理
                    if(item._imageChildren && item._imageChildren.length>0 && item.id.indexOf("_")> -1){//&& item.isModified
                        var tmpNode = await this.combineNode(item);
                        path = tmpNode.path;
                    }
                    else {

                        var childNode ;
                        // if(origin._class == "group" || origin._class == "triangle" || origin._class == "shapeGroup" || origin._class == "symbolMaster" || origin._class == "symbolInstance" || origin._class == "oval" || origin._class == "bitmap" || origin._class == "rectangle" || origin._class == "shapePath"){
                            if(origin.layers && origin.layers.length == 1){
                                childNode = origin.layers[0];
                                if(origin.do_objectID.indexOf("B291364C-00E0-496B-9B00-055E84D8E69B")>-1){
                                    // console.log(11);
                                }
                                // if(!hasMaskChildren){
                                    path = await this.combineShapeGroupNodeWithNative(item);
                                    isNeedCompositeAlpha = false;
                                // }else{
                                //     path = await draw.image(origin,childNode);
                                    
                                //     this._handleRotation(item);
                                // }
                                
                                
                                
                                // if(that._isQMask(item)){
                                //     item.maskPath = path;
                                //     // outputPath = outputDir+that._getTmpFileName(item.maskPath);
                                //     if(param && param.masked == true){
                                //         item.path = path;
                                //         // outputPath = outputDir+that._getTmpFileName(item.path);
                                //     }
                                // }else if(item.path){
                                //     try{
                                //         fs.renameSync(that.outputDir+that._getTmpFileName(path),that.outputDir+that._getTmpFileName(item.path),function(err){
                                //         });
                                //         path = item.path;
                                //         // outputPath = outputDir+that._getTmpFileName(path);
                                //     }catch(e){
                                //         console.error(e);
                                //         //如果绘图失败，则用原生绘图
                                //         // if(await this.isRecommendCombineShapeGroupNodeWithNative()){
                                //         path = await this.combineShapeGroupNodeWithNative(origin,false);
                                //         // }
                                //         isNeedCompositeAlpha = false;
                                //     }
                                // }
                                // //若有需要，给合成的shapeGroup加透明度
                                // if(isNeedCompositeAlpha){
                                //     await that._compositeAlpha(origin,path);  
                                // }
                            }else{
                                // if(await that.isRecommendCombineShapeGroupNodeWithNative(origin)){//使用sketch原生合成
                                    path = await this.combineShapeGroupNodeWithNative(item);
                                    //原生合成不再需要再处理额外的透明度等操作
                                // }else{
                                //     childNode = await this.combineShapeGroupNode(origin);
                                //     path = childNode.image._ref;
                                //     //若有需要，给合成的shapeGroup加透明度
                                //     await that._compositeAlpha(origin,path); 
                                // }
                            }
                            if(that._isQMask(item)){
                                item.maskPath = path;
                                // outputPath = outputDir+that._getTmpFileName(item.maskPath);
                                if(param && param.masked == true){
                                    item.path = path;
                                    // outputPath = outputDir+that._getTmpFileName(item.path);
                                }
                            }else if(item.path){
                                try{
                                    fs.renameSync(that.outputDir+that._getTmpFileName(path),that.outputDir+that._getTmpFileName(item.path),function(err){
                                    });
                                    path = item.path;
                                    // outputPath = outputDir+that._getTmpFileName(path);
                                }catch(e){
                                    logger.error(e);
                                    // console.error(e);
                                    //如果绘图失败，则用原生绘图
                                    // if(await this.isRecommendCombineShapeGroupNodeWithNative()){
                                    path = await this.combineShapeGroupNodeWithNative(item,false);
                                    // }
                                    isNeedCompositeAlpha = false;
                                }
                            }
                            //若有需要，给合成的shapeGroup加透明度
                            if(isNeedCompositeAlpha){
                                await that._compositeAlpha(origin,path);  
                            }
                            //json直接将symbol的值移过来，其id与item的id不一样，此时需要将其改为item的id对应的path
                            if(origin._class == "symbolMaster"){
                                try{
                                    fs.renameSync(this.outputDir+that._getTmpFileName(path),this.outputDir+that._getTmpFileName(item.path),function(err){});
                                }catch(e){
                                    logger.error(e);
                                    // console.error(e);
                                }
                            }
                        // }else{
                        //     childNode = origin;
                        //     path = await draw.image(origin,childNode,that.outputDir);
                        // }
                        if(path && path != "" && !item.path && !that._isQMask(item)){
                            item.path = path;
                            if(typeof outputPath == "undefined"){
                                outputPath = that.outputDir+that._getTmpFileName(path); 
                            }                 
                        }
                        // await that._handleTmpFiles(childNode.do_objectID,"t_"+path,{"push":true});
                    }
                    
                    if(that._isQMask(item) && ilen>1){//遇到遮罩层，则从这层往上找，将所有被遮罩的图层都合成一张图
                        var maskData = await this.maskNode(node,i);
                        if(maskData){
                            var newNode = maskData.newNode;
                            i = maskData.lastMaskedIndex;
                            outputImage.in('-page', "+0+0").in(that.outputDir+that._getTmpFileName(newNode.path));
                        }
                    }
                    else if(!origin || (origin && origin._class != "slice")){    //else if(item._class == "bitmap" || item._class == "shapeGroup" ){    
                        //如果图片含有旋转样式，则要重新计算图片的坐标
                        this._handleRotation(item);
                        outputImage.in('-page', this._getLocationText(item.x,item.y,isGroup)).in(that.outputDir+that._getTmpFileName(item.path));
                        //console.log("生成图片："+item.image._ref);
                    }
                }

                return new Promise(function (resolve, reject) {
                    var newNode = {};
                    // console.log(outputPath);
                    if(outputPath.indexOf("img47_A3EF52E2-5F26-4E5D-865D-E485B29A79B1")>-1){
                        // console.log(22);
                    }
                    outputImage.mosaic().write(outputPath,function (e) {
                        if(e) {
                            logger.error(e);
                            // console.error(e.message)
                        }
                        newNode = {
                            _class : "combineImg",
                            x : node.x,
                            y : node.y,
                            width : node.width,
                            height : node.height,
                            path : node.path
                        }
                        // console.log("合并图片 x:"+newNode.x+ " y:"+newNode.y+"  ref:"+newNode.path);

                        that._handleTmpFiles(node.id,that._getTmpFileName(node.path));

                        resolve(newNode);
                    });
                });

            }  
                
                
        }
        try{
            return main();
        }catch(e){
            logger.error(e);
            // console.log(e);
        }
        
    }
    this.combineShapeGroupNode = function(node){
        var  main = async () => {
            var newNode = {};
            var tmpNode = {};
            var outputImage =  gm();
            var outputPath = this.outputDir+that._getTmpFileName(node.do_objectID)+".png";
            var layers = node.layers || [node];
            var isGroup = node._class == "group" || (node._class == "shapeGroup" && node.layers.length>1) || node._class == "artboard";
            
            if(typeof that.rootNode == "undefined"){
                that.rootNode = node;
            }
            
            
               // console.log("开始合并："+outputPath);
                for(var i =0,ilen = layers.length;i<ilen;i++){
                    var item = layers[i]; 
                    if(item._class != "group" && item._class != "slice"){
                        var path ;
                        var childNode ;
                        if(item._class == "shapeGroup"){
                            if(item.layers.length == 1){
                                childNode = item.layers[0];
                                path = await draw.image(item,childNode,that.outputDir);
                            }else{
                                childNode = await this.combineShapeGroupNode(item);
                                path = childNode.image._ref;
                            }                           
                        }else{
                            childNode = item;
                            path = await draw.image(node,childNode,that.outputDir);
                        }
                        if(path && path != ""){
                            item.image = item.image || {};
                            item.image._ref = path;
                            // that._handleTmpFiles(childNode.do_objectID,path);                          
                        }else{
                            continue;
                        }
                        //如果图片含有旋转样式，则要重新计算图片的坐标
                        this._handleRotation(item);
                        if(ilen>1){
                            item = await this._makePreComposeImage(item);
                        }
                    }
                    
                    if(item._class != "group" && item._class != "slice"){    //else if(item._class == "bitmap" || item._class == "shapeGroup" ){    
                        // outputImage.in('-page', this._getLocationText(item.frame.x,item.frame.y,isGroup)).in(outputDir+that._getTmpFileName(item.image._ref));
                        //console.log("生成图片："+item.image._ref);
                        if(i == 0){
                            tmpNode = item;
                        }else if(i > 0 ){
                            tmpNode = await that._combineTwoShape(tmpNode,item,node.do_objectID+".png");
                        }
                    }
                }        
                
                return new Promise(function (resolve, reject) {
                    var newNode = {};
                    if(layers.length == 1){
                        newNode._class = "combineImg";
                        newNode.frame = {
                            x : node.frame.x,
                            y : node.frame.y,
                            width : node.frame.width,
                            height : node.frame.height
                        }
                        newNode.image = {
                            "_ref": node.do_objectID+".png"
                        }
                        resolve(newNode);
                    }else{
                        gm(outputPath).trim().write(outputPath,function (e) {
                            if(e) {
                                logger.error(e);
                                // console.log(e.message)
                            }
                            newNode._class = "combineImg";
                            newNode.frame = {
                                x : node.frame.x,
                                y : node.frame.y,
                                width : node.frame.width,
                                height : node.frame.height
                            }
                            newNode.image = {
                                "_ref": node.do_objectID+".png"
                            }
                            resolve(newNode);
                            
                        });
                    }
                });
            
        }
        try{
            return main();
        }catch(e){
            logger.error(e);
            // console.log(e);
        }
    }
    this.combineShapeGroupNodeWithNative = function(item,isReleaseFile){
        var  main = async () => {
            // var queryParam = req.query;
            // sketchFile = "designFile/"+queryParam.sketchFile;
            var that = this;
            return new Promise(function (resolve, reject) {
                var outputDir = that.outputDir;
                var node = item._origin;
                imgid = node.do_objectID;
                var command = `${BIN} export layers --output=${outputDir} --formats=png ${'./data/upload_file/'+projectName} --item=${imgid}`;
                var filePath;
                var fileName ;
                // command = `./server_modules/designimage/Contents/Resources/sketchtool/bin/sketchtool list layers  ./data/upload_file/20181029145053_空白页推荐游戏2.sketch —item=DC51D000-5164-4444-A290-5762135D4131`;
                // command = `./server_modules/designimage/Contents/Resources/sketchtool/bin/sketchtool export layers --output=./public/result/bc4f5440-cdcf-11e8-a39c-712f9937d34d/ --formats=png ./data/upload_file/20181012113433_1单页.sketch --item=14A47E63-7037-482D-843F-0B234D12A70C`;
                // console.log(command);
                logData.num._combineShapeGroupNodeWithNative ++ ;
                exec(command, function(a,b,c){
                    if(a){
                        logger.error(a);
                        // console.log(a);
                    }
                    var newFileName = b.substring(9,b.length-1);
                    if(newFileName.indexOf('Group')>-1){
                        // console.log(3);
                    }
                    if(isReleaseFile){
                        fileName = item.path;
                        filePath = targetDir+fileName;
                    }else{
                        fileName = node.do_objectID+".png";
                        filePath = outputDir+that._getTmpFileName(fileName);
                    }
                    try{
                        fs.renameSync(outputDir+newFileName,filePath,function(err){});
                    }catch(e){
                        logger.error(e);
                        // console.error(e);
                    }
                    
                    resolve(fileName);
                });
            });
        }
        try{
            return main();
        }catch(e){
            logger.error(e);
            // console.log(e);
        }
    }
    //将shapeGroup中的每个图层按数据位移放在一张大的透明图中，因为gm不能在做集合运算时加上-page等属性，所以只能先如此合一张图出来，再单纯做集合运算。
    this._makePreComposeImage = function(node){
        var that = this;
        logData.num._makePreComposeImage++;
        var  main = async () => {
            return new Promise(function (resolve, reject) { 
                gm(500,500,'none')
                .in('-page',that._getLocationText(node.frame.x+250,node.frame.y+250,true))
                .in(that.outputDir+that._getTmpFileName(node.image._ref))
                .mosaic().write(that.outputDir+that._getTmpFileName(node.image._ref),function (e){
                    if(e) {
                        logger.error(e.message);
                        // console.log(e.message)
                    }
                    resolve(node);
                });
            });
        }
        return main(); 
    }
    //若有需要，给合成的shapeGroup加透明度
    this._compositeAlpha = function(origin,path){
        var that = this;
        var  main = async () => {
            return new Promise(function (resolve, reject) {            
                if(origin.style.contextSettings && origin.style.contextSettings.opacity){
                    var imageMagick = gm.subClass({ imageMagick: true });
                    imageMagick(that.outputDir+that._getTmpFileName(path)).opacity(origin.style.contextSettings.opacity).write(that.outputDir+that._getTmpFileName(path),function(e){
                        resolve(origin);
                    });
                }else{
                    resolve(origin);
                }
            });
        }
        return main(); 
    }
    //合并shapeGroup中的两个图层。例如shapeGroup中有3个图层，则需要1和2合，生成t1，t1再和3合，如此类推。gm没找到多个图层一起进行集合运算的办法，就是这么蛋疼。
    this._combineTwoShape = function(node1,node2,outputRelativePath){
        var that = this;
        logData.num._combineTwoShape++;
        var  main = async () => {
            var outputImage;
            return new Promise(function (resolve, reject) { 
                outputImage = gm().in(that.outputDir+that._getTmpFileName(node1.image._ref))
                if(node2.booleanOperation == 0){//union √ Over
                    outputImage.in("-compose", "Over");
                }else if(node2.booleanOperation == 1){//substract Out
                    outputImage.in("-compose", "Out");
                }else if(node2.booleanOperation == 2){//intersect In
                    outputImage.in("-compose", "In");
                }else if(node2.booleanOperation == 3){//none different √
                    outputImage.in("-compose", "Xor");
                }
                outputImage.in(that.outputDir+that._getTmpFileName(node2.image._ref)).command("composite").write(that.outputDir+that._getTmpFileName(outputRelativePath),function (e) {
                    if(e) {
                        logger.error(e.message);
                        // console.log(e.message)
                    }
                    var newNode = {};
                    newNode._class = "tmpCombineImg";
                    newNode.image = {
                        "_ref": outputRelativePath
                    }
                    resolve(newNode);
                });
            });
        }
        return main(); 
    }
    //合成一个有遮罩的节点的图片
    this.maskNode = function(maskGrouupNode,maskIndex){
        var that = this;
        var  main = async () => {
            var imageChildren = maskGrouupNode._imageChildren;
            var outputPath ;
            var outputImage =  gm(maskGrouupNode.width, maskGrouupNode.height,"#00ffffff");
            var maskItem ;    
            var exec = require('child_process').exec;
            for(var i =maskIndex,ilen = imageChildren.length;i<ilen;i++){
                var item = imageChildren[i]; 
                if(item.type == "QMask"){//这个图层是mask
                    maskItem = item;
                    for(var j =0,jlen = item.maskedNodes.length;j<jlen;j++){
                        for(var k=i,klen=imageChildren.length;k<klen;k++){
                            if(imageChildren[k].id == item.maskedNodes[j]){
                                if(imageChildren[k].id.indexOf("A7BCF1B0-92D6-444C-8CA0-9311BBB5ED5C")){
                                    // console.log(12);
                                }
                                imageChildren[k].maskedNodes = [];
                                var tmpParam = {
                                    "cantNative":true,
                                    "masked":true
                                };
                                if(imageChildren[k]._origin._class == "text"){
                                    tmpParam.cantNative = false;
                                }
                                tmpParam.width =  maskItem.width;
                                tmpParam.height = maskItem.height;
                                var newNode = await this.combineNode(imageChildren[k],tmpParam);
                                if(newNode.path){
                                    var x = newNode.x - maskItem.x >0?newNode.x - maskItem.x:0;
                                    var y = newNode.y - maskItem.y >0?newNode.y - maskItem.y:0;
                                    outputImage.in('-page', this._getLocationText(x,y)).in(that.outputDir+that._getTmpFileName(newNode.path));
                                }
                                break;
                            }
                        }        
                    }

                    return new Promise(function (resolve, reject) { 
                        outputPath = that.outputDir+that._getTmpFileName("m_"+maskItem.id)+".png";                  
                        outputImage.mosaic().write(outputPath, function (e){
                            if(e) {
                                // console.log(e.message)
                                logger.error(e.message);
                            }
                    
                            gm(outputPath).crop(maskItem.width, maskItem.height, maskItem.x,maskItem.y).write(outputPath, function (e){
                                if(e) {
                                    // console.log(e.message)
                                    logger.error(e.message);
                                }
                                var gmComposite = 'gm composite -compose in ' + outputPath + ' ' + that.outputDir+that._getTmpFileName(maskItem.maskPath) + ' ' + outputPath
                                try{
                                    exec(gmComposite, function(err) {
                                        // if (err) throw err;
                                        var newNode = {
                                            _class : "combineImg",
                                            x : maskItem.x,
                                            y : maskItem.y,
                                            width : maskItem.width,
                                            height : maskItem.height,
                                            path : maskItem.id+".png"
                                        }
                                        // console.log("合成遮罩图片 x:"+newNode.x+ " y:"+newNode.y+"  ref:"+newNode.path);
    
                                        // that._handleTmpFiles(maskItem.id,"t_"+maskItem.id+".png")
    
                                        // 如果 maskItem._origin.style.fills[0].isEnabled = true 则多叠上mask图层做背景
                                        if(maskItem._origin.style.fills && maskItem._origin.style.fills[0].isEnabled == true){
                                            gm(maskItem.width, maskItem.height,"#00ffffff")
                                                .in(that.outputDir+that._getTmpFileName(maskItem.maskPath))
                                                .in(outputPath)
                                                .mosaic().write(that.outputDir+that._getTmpFileName(maskItem.maskPath), function (e){
                                                    if (err) throw err;
                                                    resolve({
                                                        "newNode" : newNode,
                                                        "lastMaskedIndex": k
                                                    });
                                                });
                                        }else{
                                            resolve({
                                                "newNode" : newNode,
                                                "lastMaskedIndex": k
                                            });
                                        }
    
                                        
                                    });
                                }catch(e){
                                    logger.error(e);
                                    // console.error(e);
                                }
                                
                            });
                        });
                    });

                }              
            }
        }
        return main();
    }
    //合成切片图片，目前还没用上
    this.sliceNode = function(sliceNode,groupNode){
        var  main = async () => {
            var layers = groupNode.layers;
            var outputImage;         
            var outputPath = that.outputDir+that._getTmpFileName(sliceNode.do_objectID)+".png";     
            if(sliceNode._class == "slice"){
                if(sliceNode.exportOptions.layerOptions == 0){ // 对整个设计稿切片，传入的groupNode是最外层json的node节点
                    outputImage =gm(inputDir+"previews/preview.png").resize(groupNode.frame.width,groupNode.frame.height);
                    //获取切片的绝对定位
                    //从别处获得abX,abY
                    sliceNode.frame.abX = 604;
                    sliceNode.frame.abY = 2336;
                    outputImage.crop(sliceNode.frame.width, sliceNode.frame.height, sliceNode.frame.abX,sliceNode.frame.abY);

                    return new Promise(function (resolve, reject) {
                        var newNode = {
                            "_class":"combineImg",
                            "frame":{
                                x : sliceNode.frame.x,
                                y : sliceNode.frame.y,
                                width : sliceNode.frame.width,
                                height : sliceNode.frame.height,
                                
                            },
                            "image" : {
                                "_ref": outputPath
                            }
                        };
                        outputImage.write(outputPath, function (e){
                            if(e) {
                                logger.error(e.message);
                                // console.log(e.message)
                            }
                            // that._handleTmpFiles(sliceNode.do_objectID,outputPath)
                            resolve(newNode);
                        });  
                                          
                    });                  
                }else if(sliceNode.exportOptions.layerOptions == 2){ // 只对该group切片,groupNode是这个group的节点
                    var newGroupNode = await this.combineNode(groupNode,{"isSlice":true});                   
                    outputImage = gm(newGroupNode.image._ref)
                    .crop(sliceNode.frame.width, sliceNode.frame.height, sliceNode.frame.x,sliceNode.frame.y);
                    
                    return new Promise(function (resolve, reject) {                       
                        outputImage.write(outputPath, function (e){
                            if(e) {
                                logger.error(e.message);
                                // console.log(e.message)
                            }      
                            var newNode = {
                                "_class":"combineImg",
                                "frame":{
                                    x : sliceNode.frame.x,
                                    y : sliceNode.frame.y,
                                    width : sliceNode.frame.width,
                                    height : sliceNode.frame.height,
                                    
                                },
                                "image" : {
                                    "_ref": outputPath
                                }
                            };                
                            // that._handleTmpFiles(sliceNode.do_objectID,outputPath);
                            resolve(newNode);
                        });                        
                    });
                }       
            }
        }
        return main();
    },
    this.getSliceNode = function(node){
        var layers = node.layers;
        var that = this;       
        var resultArr = [];
        if(typeof layers == "undefined"){
            return resultArr;
        }
        for(var i =0,ilen = layers.length;i<ilen;i++){
            var item = layers[i]; 
            if(item._class == "slice"){
                resultArr.push(item);
            }
        }       
        return resultArr;
    }
    //获取元素在图片中的位置，如果元素是在一个组里面，则需要获取其位置，否则如果元素是单张图输出，则无需位置信息。
    this._getLocationText=function(x,y,isGroup){
        var text =  "";
        if(typeof isGroup != "undefined" && isGroup == false){
            text =  "+0+0";
            return text;
        }
        if(x>=0){
            text +="+";
        }
        text += x;
        if(y>=0){
            text +="+";
        }
        text += y;
        return text;
    }
    //在删除临时文件之前，将目标图片前面的临时图片标识去掉
    this._renameTargetFiles = function(){
        var that = this;
        try{
            fs.renameSync(that.outputDir+that._getTmpFileName(that.rootNode.path),targetDir+that.rootNode.path); 
        }catch(e){
            // console.error(e);
            logger.error(e);
            
        }
        that.rootNode = undefined ;
    }
    //给临时文件加标识
    this._getTmpFileName = function(path){
        return "t_"+path;
    }
    //删除临时文件，返回剩余文件数组
    this.deleteTmpFiles = function(targetDir){
        // console.log("开始删除临时图片");
        var files = [];
        var remainFiles = [];
        var that = this;
        if(fs.existsSync(targetDir)) {
            files = fs.readdirSync(targetDir);
            files.forEach(function(file, index) {
                var curPath = targetDir + "/" + file;
                var isFile = fs.statSync(curPath).isFile();//是文件
                var isDir = fs.statSync(curPath).isDirectory();//是文件夹
                if(isFile){
                    if(targetDir == that.outputDir){
                        remainFiles.push(curPath);
                    }else{
                        fs.unlinkSync(curPath);
                    } 
                }
                if(isDir){
                    that.deleteTmpFiles(curPath)
                }

            });  
            if(targetDir != this.outputDir){
                fs.rmdirSync(targetDir);
            }
        }
        return remainFiles;
    }
    //处理临时文件
    //如果node的id和根目录的id一样，则重命名目标图片名，以前的删除
    //param : push :直接进行
    this._handleTmpFiles = function(do_objectID,outputPath,param){
        var that = this;
        if(that.rootNode && do_objectID == that.rootNode.id){
            that._renameTargetFiles();
        }
    },
    this.getLogData = function(){
        logData.costTime = (new Date().getTime() - logData.costTime)/1000;
        logger.debug(logData);
        // console.log(logData);
        return logData;
    }
    this._isQMask = function(item){
        var result = false;
        if(item.type == "QMask" && item.maskedNodes.length>0){
            result = true;
        }
        return result;
    }
    this._handleRotation = function(item){
        return ;
        var _origin = item._origin || item;
        if(_origin.rotation){
            if(_origin.do_objectID.indexOf("DD933089-F2F8-42F6-8022-35F9A7210450")>-1){
                console.log(333);
            }
            if(item._origin){
                // item.x = item.x+(0-0.5*_origin.frame.width)*Math.cos((_origin.rotation)/360*2*Math.PI)-(-_origin.frame.height*0.5)*Math.sin((_origin.rotation)/360*2*Math.PI)+0.5*_origin.frame.width;
                // item.y = item.y-((0-0.5*_origin.frame.width)*Math.sin((_origin.rotation)/360*2*Math.PI)-(-_origin.frame.height*0.5)*Math.cos((_origin.rotation)/360*2*Math.PI)-0.5*_origin.frame.height);

                var x = item.x;
                var y = item.y;
                var rx0 = x + 0.5*_origin.frame.width;
                var ry0 = y + 0.5*_origin.frame.height;
                var rotation = _origin.rotation;

                item.x = (x-rx0)*Math.cos((_origin.rotation)/360*2*Math.PI)-(y-ry0)*Math.sin(_origin.rotation/360*2*Math.PI)+rx0;
                item.y = (x-rx0)*Math.sin((_origin.rotation)/360*2*Math.PI)+(y-ry0)*Math.cos(_origin.rotation/360*2*Math.PI)+ry0;

                // item.x = item.x + (0.5*_origin.frame.width-_origin.frame.height*Math.sin((360-_origin.rotation)/360*2*Math.PI));
                // item.y = item.y + (0.5*_origin.frame.height-_origin.frame.height*Math.cos((360-_origin.rotation)/360*2*Math.PI));
            }else{
                _origin.frame.x = _origin.frame.x + (0.5*_origin.frame.width-_origin.frame.height*Math.sin((360-_origin.rotation)/360*2*Math.PI));
                _origin.frame.y = _origin.frame.y + (0.5*_origin.frame.height-_origin.frame.height*Math.cos((360-_origin.rotation)/360*2*Math.PI));
            }
            
        }
    }
    this.hasMaskChildren = function(imageChildren){
        var result = false;
        for(var i=0,ilen=imageChildren.length;i<ilen;i++){
            if(this._isQMask(imageChildren[i])){
                result = true;
                break;
            }
        }
        return result;
    }
}

module.exports = {
    ImageCombine : ImageCombine
}

