
var gm = require('gm');
var pageJson = "";
const draw = require('./draw');

var inputDir = "";
var outputDir = "";
var tmpFiles = [];
var rootNode ;
var that;
var fs = require('fs');
var logData={
    "costTime":0,
    "num":{
        "_makePreComposeImage":0,
        "_combineTwoShape":0
    }
}

//合图方法1：输入节点，先合并最里面的组，然后往外合并，直至合完，返回合成的bitmap节点
//mask方法1：输入节点和mask图层，输出该mask后的bitmap节点
//slice方法1：输入含slice的节点，输出slice后的bitmap节点

//"convert circle_left.gif circle_right.gif -compose Darken -composite    circle_intersection.gif"
//gm翻译为 outputImage.out("convert","circle_left.gif","circle_right.gif","-compose","Darken","-composite","circle_intersection.gif");

module.exports = {
    init:function(param){
        inputDir = param.inputDir;
        outputDir = param.outputDir;        
        pageJson = param.pageJson;
        draw.init(param);
        that = this;
        logData.num._makePreComposeImage = 0;
        logData.num._combineTwoShape = 0;
        logData.costTime = new Date().getTime();
    },
    //param.isSlice:是否合并含有裁剪元素的节点，为true的时候无视slice节点，合并剩余的节点
    //合成一个节点图片
    combineNode: function(node,param){
        var  main = async () => {
            var newNode = {};
            var outputImage =  gm(node.width, node.height,"#00ffffff");
            var outputPath = outputDir+that._getTmpFileName(node.path);
            var imageChildren = node._imageChildren || [node];
            var isGroup = (node._imageChildren && node._imageChildren.length > 1) == true;
            
            // var exec = require('child_process').exec;
            // // var command = "convert "+outputDir+"1.png "+outputDir+"2.png -compose DstOut -composite "+outputDir+"3.png";
            // var command = "composite -compose Dst_Over -tile pattern:checkerboard \ "+outputDir+"31.png "+ outputDir+"32.png ";
            // // // gm.out("convert",outputDir+"t_11.png",outputDir+"t_2.png","-compose","Src","-composite",outputDir+"t_3.png");
            // exec(command,function(err){
            //     console.log(command);
            // })
            // return ;
            // var outputImage =  gm(212, 158,"#00ffffff");
            // outputImage.in(outputDir+"1.png");
            // outputImage.in(outputDir+"2.png");
            // outputImage.compose("In").mosaic()
            // console.log(outputPath);
            // gm()
            // .in(outputDir+"1.png")
            // .in("-compose", "In")
            // .in(outputDir+"2.png")
            // .command("composite")
            // .write(outputDir+"3.png",function (e) {
            //     if(e) {
            //         console.log(e.message)
            //     }
                
            // });
            // return ;

            // gm(500,500,'none')
            // // .command("composite")
            // .in('-page',"+0+0")
            // .in(outputDir+"6.png")
            // .mosaic().write(outputDir+"61.png",function (e) {
            //     gm(500,500,'none')
            //     // .command("composite")
            //     .in('-page',"+50+0")
            //     .in(outputDir+"7.png")
            //     .mosaic().write(outputDir+"71.png",function (e) {
            //         gm()
            //         .in(outputDir+"61.png")
            //         .in("-compose", "Xor")
            //         .in(outputDir+"71.png")
            //         .command("composite")
            //         .write(outputDir+"31.png",function (e) {
            //             if(e) {
            //                 console.log(e.message)
            //             }
            //             gm(outputDir+"31.png").trim().write(outputDir+"31.png",function (e) {
            //                 if(e) {
            //                     console.log(e.message)
            //                 }
                            
            //             });
            //         });
            //     });
            // });

            // return ;


            if(typeof rootNode == "undefined"){
                rootNode = node;
            }
            // if(node.name.indexOf("4 copy")>-1){//D6799224  A82BE333
            //     console.log(111);
            // }
            if(node.id.indexOf("DB86_3184")>-1){
                console.log(111);
            }
            //如果第一层子层无slice，或者param中没标明这次操作是在合并含有裁剪元素的节点，则做常规的图片合并
            // var sliceNodes = this.getSliceNode(node);
            // if((typeof param != "undefined" && param.isSlice == true) || sliceNodes.length==0 || rootNode.do_objectID != node.do_objectID){
                
                // 先忽略slice做合并图片
                // console.log("开始合并："+outputPath);
                for(var i =0,ilen = imageChildren.length;i<ilen;i++){
                    var item = imageChildren[i]; 
                    if(item.id.indexOf("21B1C8B6-90E9")>-1){
                        console.log(222);
                    }
                    var origin = item._origin;
                    // if(item.clippingMaskMode == 0 && item.shouldBreakMaskChain == false){//遇到遮罩层，则从这层网上找，将所有被遮罩的图层都合成一张图
                    // 针对shapeGroup做处理
                    if(origin._class != "group" && origin._class != "slice"){
                        var path ;
                        var childNode ;
                        if(origin._class == "shapeGroup"){
                            if(origin.layers.length == 1){
                                childNode = origin.layers[0];
                                path = await draw.image(origin,childNode);
                                if(that._isQMask(item)){
                                    item.maskPath = path;
                                }else if(item.path){
                                    try{
                                        fs.renameSync(outputDir+that._getTmpFileName(path),outputDir+that._getTmpFileName(item.path),function(err){
                                        });
                                        path = item.path;
                                    }catch(e){
                                        console.error(e);
                                    }
                                }
                            }else{
                                childNode = await this.combineShapeGroupNode(origin);
                                path = childNode.image._ref;
                            }
                            //若有需要，给合成的shapeGroup加透明度
                            await that._compositeAlpha(origin,path); 
          
                        }else{
                            childNode = origin;
                            path = await draw.image(origin,childNode);
                        }
                        if(path && path != "" && !item.path && !that._isQMask(item)){
                            item.path = path;
                                                      
                        }
                        // await that._handleTmpFiles(childNode.do_objectID,"t_"+path,{"push":true});
                    }
                    if(that._isQMask(item) && ilen>1){//遇到遮罩层，则从这层往上找，将所有被遮罩的图层都合成一张图
                        var maskData = await this.maskNode(node,i);
                        if(maskData){
                            var newNode = maskData.newNode;
                            i = maskData.lastMaskedIndex;
                            outputImage.in('-page', "+0+0").in(outputDir+that._getTmpFileName(newNode.path));
                        }
                    }else if(isGroup){//如果遇到组，则递归合成组里的图片
                        newNode = await this.combineNode(item);
                        outputImage.in('-page', this._getLocationText(newNode.x,newNode.y)).in(outputDir+that._getTmpFileName(newNode.path));
                    }else if(!isGroup && origin._class != "slice"){    //else if(item._class == "bitmap" || item._class == "shapeGroup" ){    
                        outputImage.in('-page', this._getLocationText(item.x,item.y,isGroup)).in(outputDir+that._getTmpFileName(item.path));
                        //console.log("生成图片："+item.image._ref);
                    }
                }        
                
                return new Promise(function (resolve, reject) {
                        var newNode = {};
                        outputImage.mosaic().write(outputPath,function (e) {
                            if(e) {
                                console.error(e.message)
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
            // }
             //否则如果第一层子层有slice图层，且该节点是根节点，且没有标明是忽略slice的图层合并，就做slice处理
            // else if(sliceNodes.length > 0 && (typeof param == "undefined" || typeof param.isSlice == "undefined") && rootNode.do_objectID == node.do_objectID){
            //     for(var i =0,ilen=sliceNodes.length;i<ilen;i++){
            //         var newNode = await this.sliceNode(sliceNodes[i],node);
            //         outputImage.in('-page', this._getLocationText(newNode.frame.x,newNode.frame.y)).in(newNode.image._ref);
            //     }                   
            //     return new Promise(function (resolve, reject) {

            //         outputImage.mosaic().write(outputPath,function (e) {
            //             if(e) {
            //                 console.log(e.message)
            //             }

            //             var newNode = {
            //                 "_class":"combineImg",
            //                 "frame":{
            //                     x : node.frame.x,
            //                     y : node.frame.y,
            //                     width : node.frame.width,
            //                     height : node.frame.height,
                                
            //                 },
            //                 "image" : {
            //                     "_ref": outputPath
            //                 }
            //             };
                        
            //             console.log("裁剪后图片 x:"+newNode.frame.x+ " y:"+newNode.frame.y+"  ref:"+newNode.image._ref);

            //             that._handleTmpFiles(node.do_objectID,outputPath)

            //             resolve(newNode);
            //         });
            //     });  
            // }
        }
        try{
            return main();
        }catch(e){
            console.log(e);
        }
        
    },
    //合成一个shapeGroup节点图片
    combineShapeGroupNode:function(node){
        var  main = async () => {
            var newNode = {};
            var tmpNode = {};
            var outputImage =  gm();
            var outputPath = outputDir+that._getTmpFileName(node.do_objectID)+".png";
            var layers = node.layers || [node];
            var isGroup = node._class == "group" || (node._class == "shapeGroup" && node.layers.length>1) || node._class == "artboard";
            
            if(typeof rootNode == "undefined"){
                rootNode = node;
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
                                path = await draw.image(item,childNode);
                            }else{
                                childNode = await this.combineShapeGroupNode(item);
                                path = childNode.image._ref;
                            }                           
                        }else{
                            childNode = item;
                            path = await draw.image(node,childNode);
                        }
                        if(path && path != ""){
                            item.image = item.image || {};
                            item.image._ref = path;
                            // that._handleTmpFiles(childNode.do_objectID,path);                          
                        }else{
                            continue;
                        }
                        //如果图片含有旋转样式，则要重新计算图片的坐标
                        if(item.rotation){
                            item.frame.x = item.frame.x + (0.5*item.frame.width-item.frame.height*Math.sin((360-item.rotation)/360*2*Math.PI));
                            item.frame.y = item.frame.y + (0.5*item.frame.height-item.frame.height*Math.cos((360-item.rotation)/360*2*Math.PI));
                        }
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
                                console.log(e.message)
                            }
                            //若有需要，给合成的图片加透明度
                            // if(node.do_objectID.indexOf("55B8987C-0E96")>-1){
                            //     console.log(333)
                            // }
                            // if(node.style.contextSettings && node.style.contextSettings.opacity){
                            //     var imageMagick = gm.subClass({ imageMagick: true });
                            //     imageMagick(outputPath).opacity(node.style.contextSettings.opacity).write(outputPath,function(e){
                            //         newNode._class = "combineImg";
                            //         newNode.frame = {
                            //             x : node.frame.x,
                            //             y : node.frame.y,
                            //             width : node.frame.width,
                            //             height : node.frame.height
                            //         }
                            //         newNode.image = {
                            //             "_ref": node.do_objectID+".png"
                            //         }
                            //         // console.log("合并图片 x:"+newNode.frame.x+ " y:"+newNode.frame.y+"  ref:"+newNode.image._ref);
            
                            //         // that._handleTmpFiles(node.do_objectID,outputPath,{"push":true});
            
                            //         resolve(newNode);
                            //     });
                            // }else{
                            //     newNode._class = "combineImg";
                            //     newNode.frame = {
                            //         x : node.frame.x,
                            //         y : node.frame.y,
                            //         width : node.frame.width,
                            //         height : node.frame.height
                            //     }
                            //     newNode.image = {
                            //         "_ref": node.do_objectID+".png"
                            //     }
                            //     // console.log("合并图片 x:"+newNode.frame.x+ " y:"+newNode.frame.y+"  ref:"+newNode.image._ref);
        
                            //     // that._handleTmpFiles(node.do_objectID,outputPath,{"push":true});
        
                            //     resolve(newNode);
                            // }

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
                            // console.log("合并图片 x:"+newNode.frame.x+ " y:"+newNode.frame.y+"  ref:"+newNode.image._ref);
    
                            // that._handleTmpFiles(node.do_objectID,outputPath,{"push":true});
    
                            resolve(newNode);
                            
                        });
                    }
                });
            
        }
        try{
            return main();
        }catch(e){
            console.log(e);
        }
        
    },
    //将shapeGroup中的每个图层按数据位移放在一张大的透明图中，因为gm不能在做集合运算时加上-page等属性，所以只能先如此合一张图出来，再单纯做集合运算。
    _makePreComposeImage:function(node){
        var that = this;
        logData.num._makePreComposeImage++;
        var  main = async () => {
            return new Promise(function (resolve, reject) { 
                gm(500,500,'none')
                .in('-page',that._getLocationText(node.frame.x+250,node.frame.y+250,true))
                .in(outputDir+that._getTmpFileName(node.image._ref))
                .mosaic().write(outputDir+that._getTmpFileName(node.image._ref),function (e){
                    if(e) {
                        console.log(e.message)
                    }
                    resolve(node);
                });
            });
        }
        return main(); 
    },
    //若有需要，给合成的shapeGroup加透明度
    _compositeAlpha:function(origin,path){
        var that = this;
        var  main = async () => {
            return new Promise(function (resolve, reject) {            
                if(origin.style.contextSettings && origin.style.contextSettings.opacity){
                    var imageMagick = gm.subClass({ imageMagick: true });
                    imageMagick(outputDir+that._getTmpFileName(path)).opacity(origin.style.contextSettings.opacity).write(outputDir+that._getTmpFileName(path),function(e){
                        resolve(origin);
                    });
                }else{
                    resolve(origin);
                }
            });
        }
        return main(); 
    },
    //合并shapeGroup中的两个图层。例如shapeGroup中有3个图层，则需要1和2合，生成t1，t1再和3合，如此类推。gm没找到多个图层一起进行集合运算的办法，就是这么蛋疼。
    _combineTwoShape:function(node1,node2,outputRelativePath){
        var that = this;
        logData.num._combineTwoShape++;
        var  main = async () => {
            var outputImage;
            return new Promise(function (resolve, reject) { 
                outputImage = gm().in(outputDir+that._getTmpFileName(node1.image._ref))
                if(node2.booleanOperation == 0){//union √ Over
                    outputImage.in("-compose", "Over");
                }else if(node2.booleanOperation == 1){//substract Out
                    outputImage.in("-compose", "Out");
                }else if(node2.booleanOperation == 2){//intersect In
                    outputImage.in("-compose", "In");
                }else if(node2.booleanOperation == 3){//none different √
                    outputImage.in("-compose", "Xor");
                }
                outputImage.in(outputDir+that._getTmpFileName(node2.image._ref)).command("composite").write(outputDir+that._getTmpFileName(outputRelativePath),function (e) {
                    if(e) {
                        console.log(e.message)
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
    },
    //合成一个有遮罩的节点的图片
    maskNode:function(maskGrouupNode,maskIndex){
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
                                var newNode = await this.combineNode(imageChildren[k]);
                                outputImage.in('-page', this._getLocationText(newNode.x,newNode.y)).in(outputDir+that._getTmpFileName(newNode.path));
                                break;
                            }
                        }        
                    }

                    return new Promise(function (resolve, reject) { 
                        outputPath = outputDir+that._getTmpFileName(maskItem.id)+".png";                  
                        outputImage.mosaic().write(outputPath, function (e){
                            if(e) {
                                console.log(e.message)
                            }
                    
                            gm(outputPath).crop(maskItem.width, maskItem.height, maskItem.x,maskItem.y).write(outputPath, function (e){
                                if(e) {
                                    console.log(e.message)
                                }
                                
                                var gmComposite = 'gm composite -compose in ' + outputPath + ' ' + outputDir+that._getTmpFileName(maskItem.maskPath) + ' ' + outputPath
                                exec(gmComposite, function(err) {
                                    if (err) throw err;
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
                                            .in(outputDir+that._getTmpFileName(maskItem.maskPath))
                                            .in(outputPath)
                                            .mosaic().write(outputPath, function (e){
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
                            });
                        });
                    });

                }              
            }
        }
        return main();
    },
    //合成切片图片，目前还没用上
    sliceNode : function(sliceNode,groupNode){
        var  main = async () => {
            var layers = groupNode.layers;
            var outputImage;         
            var outputPath = outputDir+that._getTmpFileName(sliceNode.do_objectID)+".png";     
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
                                console.log(e.message)
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
                                console.log(e.message)
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
    getSliceNode:function(node){
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
    },
    //获取元素在图片中的位置，如果元素是在一个组里面，则需要获取其位置，否则如果元素是单张图输出，则无需位置信息。
    _getLocationText:function(x,y,isGroup){
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
    },
    //在删除临时文件之前，将目标图片前面的临时图片标识去掉
    _renameTargetFiles:function(){
        try{
            fs.renameSync(outputDir+that._getTmpFileName(rootNode.path),outputDir+rootNode.path); 
        }catch(e){
            console.error(e);
            
        }
        rootNode = undefined ;
    },
    //给临时文件加标识
    _getTmpFileName:function(path){
        return "t_"+path;
    },
    //删除临时文件
    deleteTmpFiles:function(){
        console.log("开始删除临时图片");
        var files = [];
        if(fs.existsSync(outputDir)) {
            files = fs.readdirSync(outputDir);
            files.forEach(function(file, index) {
                var curPath = outputDir + "/" + file;
                if(file.indexOf("t_")>-1){
                    fs.unlinkSync(curPath);
                }
            });
        }

    },
    //处理临时文件
    //如果node的id和根目录的id一样，则重命名目标图片名，以前的删除
    //param : push :直接进行
    _handleTmpFiles:function(do_objectID,outputPath,param){
        if(rootNode && do_objectID == rootNode.id){
            that._renameTargetFiles();
        }
    },
    getLogData:function(){
        logData.costTime = (new Date().getTime() - logData.costTime)/1000;
        console.log(logData);
        return logData;
    },
    _isQMask:function(item){
        var result = false;
        if(item.type == "QMask" && item.maskedNodes.length>0){
            result = true;
        }
        return result;
    }
} 

//合图test
// (function(){
//     var layerNum = 4;
//     var layers = pageJson.layers[0].layers[layerNum].layers;
//     var outputImage =  gm(pageJson.layers[0].frame.width, pageJson.layers[0].frame.height);
//     for(var i =0,ilen = layers.length;i<ilen;i++){
//         var item = layers[i]; 
//         var img = inputDir+item.image._ref;        
//         outputImage.in('-page', '+'+item.frame.x+'+'+item.frame.y).in(img);
//     }
//     outputImage.mosaic().write(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".jpg",function (e) {
//         if(e) {
//             console.log(e.message)
//         }
//     });
// })();

//sliceTest
//不只是包含组元素
// 先用preview，之后要合一张全图
// (function(){
//     var layerNum = 3;
//     var layers = pageJson.layers[0].layers[layerNum].layers;
//     var outputImage;
    
//     var item = layers[2].layers[0]; 
//     if(item._class == "slice"){
//         if(item.exportOptions.layerOptions == 0){ // 切片包含背景
//             outputImage =gm(inputDir+"previews/preview.png").resize(pageJson.layers[0].frame.width,pageJson.layers[0].frame.height);
//             //获取切片的绝对定位
//             //从别处获得abX,abY
//             item.frame.abX = 604;
//             item.frame.abY = 2336;
//             outputImage.crop(item.frame.width, item.frame.height, item.frame.abX,item.frame.abY);
            
//             outputImage.write(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png", function (e){
//                 if(e) {
//                     console.log(e.message)
//                 }
//             });
            
//         }       
//     }
// })();

//sliceTest
//只是包含组元素
// (function(){
//     var layerNum = 2;
//     var layers = pageJson.layers[0].layers[layerNum].layers;
//     var outputImage;
    
//     var sliceItem = layers[2].layers[0]; 
//     if(sliceItem._class == "slice"){
//         if(sliceItem.exportOptions.layerOptions == 2){ // 切片不包含背景

//             //创建slice区域
//             outputImage = gm(sliceItem.frame.width, sliceItem.frame.height)

//             //合成组里所有图片
//             for(var i =0,ilen = layers[2].layers.length;i<ilen;i++){
//                 var item = layers[2].layers[i]; 
//                 if(item._class == "bitmap"){
//                     outputImage.in('-page', '+'+(item.frame.x-sliceItem.frame.x)+'+'+(item.frame.y-sliceItem.frame.y)).in(inputDir+item.image._ref);
//                 }
//             }
            
//             outputImage.mosaic().write(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png", function (e){
//                 if(e) {
//                     console.log(e.message)
//                 }
//             });
            
//         }       
//     }
// })();

//maskTest
//矩形mask
// (function(){
//     var layerNum = 1;
//     var layers = pageJson.layers[0].layers[layerNum].layers;
//     var outputImage =  gm(pageJson.layers[0].layers[layerNum].frame.width, pageJson.layers[0].layers[layerNum].frame.height);
//     var maskImage ;
//     var maskItem ; 

//     for(var i =0,ilen = layers.length;i<ilen;i++){
//         var item = layers[i]; 
//         if(item.shouldBreakMaskChain == true){
//             break;
//         }
//         if(typeof maskItem != "undefined" && item.shouldBreakMaskChain == false){
//             var text =  "";
//             if(item.frame.x>0){
//                 text +="+";
//             }
//             text += item.frame.x;

//             if(item.frame.y>0){
//                 text +="+";
//             }
//             text += item.frame.y;

//             outputImage.in('-page', text).in(inputDir+item.image._ref);
            
//         }
//         if(item.clippingMaskMode == "0"){//这个图层是mask
//             maskItem = item;
//             // maskImage =  gm(maskItem.frame.width, maskItem.frame.height,"#ddff99f3").write(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+"Mask.png", function (e){
//             //     if(e) {
//             //         console.log(e.message)
//             //     }
//             // });;
//         }
//     }
//     // outputImage.mosaic()
//     // // .crop(maskItem.frame.width, maskItem.frame.height, maskItem.frame.x,maskItem.frame.y)
//     // .mask(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+"Mask.png")
//     // .write(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png", function (e){
//     //     if(e) {
//     //         console.log(e.message)
//     //     }
//     // });

//     outputImage.mosaic()
//     .write(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png", function (e){
//         if(e) {
//             console.log(e.message)
//         }
//         // gm(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png").crop(maskItem.frame.width, maskItem.frame.height, maskItem.frame.x,maskItem.frame.y).write(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png", function (e){
//         //     if(e) {
//         //         console.log(e.message)
//         //     }
//         // });

//         // gm().command("composite")
//         // .in(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png", outputDir+pageJson.layers[0].layers[layerNum].do_objectID+"Mask.png", "-matte").write(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+"222.png", function (e){
//         //     if(e) {
//         //         console.log(e.message)
//         //     }
//         // });

//         gm(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png").crop(maskItem.frame.width, maskItem.frame.height, maskItem.frame.x,maskItem.frame.y).write(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png", function (e){
//             if(e) {
//                 console.log(e.message)
//             }
//             gm().command("composite")
//             .in(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png", outputDir+pageJson.layers[0].layers[layerNum].do_objectID+"Mask.png", "-matte").write(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+"222.png", function (e){
//                 if(e) {
//                     console.log(e.message)
//                 }
//             });
//         });

            
        

        
//         // gm(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png").mask(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+"Mask.png").write(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png", function (e){
//         //     if(e) {
//         //         console.log(e.message)
//         //     }
//         // });
//     });

//     // outputImage = gm(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png")
//     // .crop(maskItem.frame.width, maskItem.frame.height, maskItem.frame.x,maskItem.frame.y)
//     // .write(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png", function (e){
//     //     if(e) {
//     //         console.log(e.message)
//     //     }
//     // });

// })();

//maskTest
//不规则图形mask
// (function(){
    // var layerNum = 1;
    // var layers = pageJson.layers[0].layers[layerNum].layers;
    // var outputImage =  gm(pageJson.layers[0].layers[layerNum].frame.width, pageJson.layers[0].layers[layerNum].frame.height);
    // var maskImage ;
    // var maskItem ; 

    // var exec = require('child_process').exec;
    // function compositeMask(thumb, mask) {
    //     var gmComposite = 'gm composite -compose in ' + thumb + ' ' + mask + ' ' + thumb
    //     exec(gmComposite, function(err) {
    //     if (err) throw err
        
    //     })
    // }

    // for(var i =5,ilen = layers.length;i<ilen;i++){
    //     var item = layers[i]; 
    //     if(item.shouldBreakMaskChain == true){
    //         break;
    //     }
    //     if(typeof maskItem != "undefined" && item.shouldBreakMaskChain == false){
    //         var text =  "";
    //         if(item.frame.x>0){
    //             text +="+";
    //         }
    //         text += item.frame.x;

    //         if(item.frame.y>0){
    //             text +="+";
    //         }
    //         text += item.frame.y;

    //         outputImage.in('-page', text).in(inputDir+item.image._ref);
            
    //     }
    //     if(item.clippingMaskMode == "0"){//这个图层是mask
    //         maskItem = item;
    //         // maskImage =  gm(maskItem.frame.width, maskItem.frame.height,"#ddff99f3").write(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+"Mask.png", function (e){
    //         //     if(e) {
    //         //         console.log(e.message)
    //         //     }
    //         // });;
    //     }
    // }

    // outputImage.mosaic()
    // .write(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png", function (e){
    //     if(e) {
    //         console.log(e.message)
    //     }

    //     gm(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png").crop(maskItem.frame.width, maskItem.frame.height, maskItem.frame.x,maskItem.frame.y).write(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png", function (e){
    //         if(e) {
    //             console.log(e.message)
    //         }
    //         // gm().command("composite").compose("CopyOpacity")
    //         // .in(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png", outputDir+"star.png", "-matte").write(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+"33.png", function (e){
    //         //     if(e) {
    //         //         console.log(e.message)
    //         //     }
    //         // });
    //         // gm()
    //         // .in(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png").mask(outputDir+"star.png").write(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+"33.png", function (e){
    //         //     if(e) {
    //         //         console.log(e.message)
    //         //     }
    //         // });

    //         compositeMask(outputDir+pageJson.layers[0].layers[layerNum].do_objectID+".png",outputDir+"star.png");
    //     });

    // });

// })();

// gm().in(outputDir+pageJson.layers[0].layers[1].do_objectID+".png").mask(outputDir+"star.png").write(outputDir+pageJson.layers[0].layers[1].do_objectID+"33.png", function (e){
//     if(e) {
//         console.log(e.message)
//     }
// });

// var size = 100;
// var output = outputDir+pageJson.layers[0].layers[1].do_objectID+".png";
// // gm(size, size, 'none')
// // .fill(output)
// // .drawCircle(size/2,size/2, size/2, 0)
// // .write(output, function(err) {
// //    console.log(err || 'done');
// // });

// var exec = require('child_process').exec;
// function compositeMask(thumb, mask) {
//     var gmComposite = 'gm composite -compose in ' + thumb + ' ' + mask + ' ' + thumb
//     exec(gmComposite, function(err) {
//       if (err) throw err
      
//     })
//   }

