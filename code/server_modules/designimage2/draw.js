/**
 * @author bowentang
 * @version 1.0
 * @data 2018/08/16
 * @description 图片的主绘制程序
 */
const gm = require('gm');
const imageMagick = gm.subClass({ imageMagick: true });
require('gm-base64');
let sketchToGm = require('./sketchToGm');

gm.prototype.opacity=function(opacity){
	return this.out("-alpha","set","-channel","A","-evaluate","multiply",opacity,"+channel");
}

// gm.opacity=()=>{
// 	convert img.png -alpha set -channel A -evaluate multiply 0.2 +channel result.png
// l result.png
// };
const draw = {
	/**
	 * 图片倍率，多倍图，暂时只支持矢量图
	 * @type {Number}
	 * *原则，绘图的参数步骤才缩放
	 */
	ratio:1,
	/**
	 * 测试图片输出
	 * @type {Boolean}
	 */
	testExportImage: true,
	/**
	 * 当前绘制的对象，由gm生成
	 * @type {[type]}
	 */
	drawImage: null,
	/**
	 * 导入文件的path
	 * @type {[type]}
	 */
	inputDir: "./",
	/**
	 * 导出文件的path
	 * @type {[type]}
	 */
	outputDir: "export/temp/",
	exportImage(imageExportPath) {
		//保存一份图片
		draw.drawImage.write(imageExportPath, function(a, b, c) {});
	},
	/**
	 * 额外样式绘制
	 * @param  {[type]} gm [description]
	 * @return {[type]}    [description]
	 */
	// style:(gm)=>{
	// 	return gm;
	// },
	/**
	 * 创建空白图
	 * @param  {[type]} width  [description]
	 * @param  {[type]} height [description]
	 * @return {[type]}        [description]
	 */
	createImage(imageData) {
		console.log(">当前绘制的类型:", imageData["_class"],",名称:", imageData["name"]);
		let width = imageData.frame.width + sketchToGm.getBorderWidth(imageData);
		let height = imageData.frame.height + sketchToGm.getBorderWidth(imageData);

		//如果含有fill图像的情况，则需要把图像也画上去
		var hasFillImage =false;
		var fillImageIndex = -1;
		/*if(imageData.style.fills.length>0){
			var fills = imageData.style.fills;
			for(var i=0,ilen=fills.length;i<ilen;i++){
				if(fills[i].image){
					hasFillImage = true;
					fillImageIndex = i ;
				}
			}
		}*/
		draw.drawImage = gm(width*draw.ratio, height*draw.ratio, "#000000ff");

		
		
		//填充操作分图片正常情况和图片在fill中两种，
		//正常情况时draw.fill(sketchToGm.getFillColor(imageData));
		//图片在fill中时draw.fill("rgba(255,255,255,255)");
		
		if(hasFillImage == true){
			draw.fill("rgba(255,255,255,255)");
			if(fills[fillImageIndex].image._ref.indexOf("b9ba12f5996c6eda3dd579b77faff1040db06512")>-1){
				console.log(222);
			}
			var command = 'image Over 0, 0, '+width*draw.ratio +','+ height*draw.ratio +',"'+ draw.inputDir+fills[fillImageIndex].image._ref + '"';
			draw.drawImage.draw(command);
		}else{
			// draw.drawImage = gm(width*draw.ratio, height*draw.ratio, "#000000ff");
			draw.fill(sketchToGm.getFillColor(imageData));
		}

		//暂时只支持居中描边（sketch默认）
		draw.stroke(
			sketchToGm.getBorderColor(imageData),
			sketchToGm.getBorderWidth(imageData)
		);
	},
	/**
	 * 初始化配置
	 * @param  {[type]} config [description]
	 * @return {[type]}     [description]
	 */
	init(config) {
		draw.inputDir = config.inputDir;
		draw.outputDir = config.outputDir+"t_";
	},
	/**
	 * 填充颜色的绘制
	 * @param  {[type]} gm [description]
	 * @return {[type]}    [description]
	 */
	fill(color) {
		draw.drawImage.fill(color);
	},
	/**
	 * 描边
	 * @return {[type]} [description]
	 */
	stroke(color, width) {
		if (color && width) {
			draw.drawImage.stroke(color);
			draw.drawImage.strokeWidth(width*draw.ratio);
		}
	},
	/**
	 * 渐变绘制
	 * @param  {[type]} gm [description]
	 * @return {[type]}    [description]
	 */
	gradient(gm) {
		return gm;
	},
	/**
	 * tansform图形
	 * @return {[type]} [description]
	 */
	transform:function(imageData){
		if(imageData.rotation){
			draw.drawImage.rotate("rgba(255,255,255,255)", (360-imageData.rotation)).trim()
		}
		if(imageData.isFlippedHorizontal){
			draw.drawImage.rotate("rgba(255,255,255,255)", (180)).trim()
		}
		if(imageData.parentNode && imageData.parentNode.rotation){
			draw.drawImage.rotate("rgba(255,255,255,255)", (360-imageData.parentNode.rotation)).trim()
		}
		if(imageData.parentNode && imageData.parentNode.isFlippedHorizontal){
			draw.drawImage.rotate("rgba(255,255,255,255)", (180)).trim()
		}
	},
	/**
	 * 三角形绘制
	 * @param  {[type]} gm [description]
	 * @return {[type]}    [description]
	 */
	triangle(gm) {
		return gm;
	},
	/**
	 * 矩形绘制
	 * @param  {[type]} imageData [description]
	 * @return {[type]}           [description]
	 */
	rectangle(imageData) {
		draw.createImage(imageData)
		//绘制
		draw.drawImage.out("-draw", "roundrectangle " + sketchToGm.getRectangle(imageData,draw.ratio))
		//保存图片
		draw.testExportImage && draw.exportImage(draw.outputDir + imageData.do_objectID + ".png")
		//返回绘制的对象
		return draw.drawImage;
		// -draw "roundrectangle 20,10 80,50 20,15"
	},
	/**
	 * 路径绘制
	 * @param  {[type]} imageData [description]
	 * @return {[type]}           [description]
	 */
	path(imageData) {
		draw.createImage(imageData)
		//绘制
		draw.drawImage.out("-draw", "stroke-linecap round path '" + sketchToGm.getPath(imageData,draw.ratio) + "'")

		//transform
		draw.transform(imageData);
		//保存图片
		draw.testExportImage && draw.exportImage(draw.outputDir + imageData.do_objectID + ".png")
		//返回绘制的对象
		return draw.drawImage;
	},
	/**
	 * 位图的绘制
	 * @return {[type]} [description]
	 */
	bitmap(imageData) {
		var imageMagick = gm.subClass({ imageMagick: true });
		//搬运位图
		let imagePath = draw.inputDir +  imageData.image._ref;
		let width = imageData.frame.width;
		let height = imageData.frame.height;
		//保存一份图片
		let imageExportPath = draw.outputDir + "t_"+ imageData.do_objectID + ".png";
		draw.drawImage=imageMagick(imagePath);
		//颜色填充
		try{
			if(imageData.style.fills && imageData.style.fills[imageData.style.fills.length - 1].color.alpha!=0){
				var color=sketchToGm.getFillColor(imageData);
				delete imageData.style.fills[imageData.style.fills.length - 1].color;
				draw.drawImage.out("\(","-clone","0","-fill",color,"-colorize","100%","\)","-alpha","set","8","-transparent","none","-compose","Over","-composite" )
			}
		}catch(e){}
		//透明度
		try{
			draw.drawImage.opacity(imageData.style.contextSettings.opacity)
		}catch(e){}
		//保存一份图片
		draw.exportImage(imageExportPath);
		//返回
		return draw.drawImage.resize(width)
	},
	/**
	 * 生成单张图片@daxiong
	 * @param  {[type]}   imageParentNode [description]
	 * @param  {[type]}   imageNode       [description]
	 * @param  {Function} callback        [description]
	 * @return {[type]}                   [description]
	 */
	image(imageParentNode, imageNode, callback) {
		let imageFullPath = draw.outputDir + imageNode.do_objectID + ".png";
		imageNode["style"] = imageParentNode.style;
		if(imageNode != imageParentNode){
			imageNode["parentNode"] = {};
			imageNode["parentNode"]["rotation"] = imageParentNode.rotation;
			imageNode["parentNode"]["isFlippedHorizontal"] = imageParentNode.isFlippedHorizontal;
		}
		return new Promise(function(resolve, reject) {
			//图片类型判断，差异处理
			switch (imageNode["_class"]) {
				//圆形
				case "oval":
					draw.path(imageNode).write(imageFullPath, function() {
						resolve(imageNode.do_objectID+".png")
					})
					break;
					//矩形
				case "rectangle":
					draw.path(imageNode).write(imageFullPath, function() {
						resolve(imageNode.do_objectID+".png")
					})
					break;
					//路径
				case "shapePath":
					draw.path(imageNode).write(imageFullPath, function() {
						resolve(imageNode.do_objectID+".png")
					})
					break;
					//五角星-归path
				case "star":
					draw.path(imageNode).write(imageFullPath, function() {
						resolve(imageNode.do_objectID+".png")
					})
					break;
					//多边形
				case "polygon":
					draw.path(imageNode).write(imageFullPath, function() {
						resolve(imageNode.do_objectID+".png")
					})
					break;
					//三角形
				case "triangle":
					draw.path(imageNode).write(imageFullPath, function() {
						resolve(imageNode.do_objectID+".png")
					})
					break;
					//位图
				case "bitmap":
					draw.bitmap(imageNode).write(imageFullPath, function() {
						resolve(imageNode.do_objectID+".png")
					})
					break;
				default:
					resolve(null)
					//抛出错误-保留
					break;
			}
		})
	},
	/**
	 * 批量生成图片
	 * @param  {[type]}   imagesData [description]
	 * @param  {Function} callback   [description]
	 * @return {[type]}              [description]
	 */
	images(imagesData, callback) {
		let base64Imaegs = [];
		let images = imagesData.length;
		for (let i = 0; i < imagesData.length; i++) {
			//图片类型判断，差异处理
			switch (imagesData[i]["_class"]) {
				//圆形
				case "oval":
					draw.path(imagesData[i])
						.toBase64('png', true, function(err, base64) {
							base64Imaegs.push(base64);
							if (--images == 0) {
								callback && callback(base64Imaegs);
							};
						});
					break;
					//矩形
				case "rectangle":
					//跳过
					draw.path(imagesData[i])
						.toBase64('png', true, function(err, base64) {
							base64Imaegs.push(base64);
							if (--images == 0) {
								callback && callback(base64Imaegs);
							};
						});
					break;
					//路径
				case "shapePath":
					//跳过
					draw.path(imagesData[i])
						.toBase64('png', true, function(err, base64) {
							base64Imaegs.push(base64);
							if (--images == 0) {
								callback && callback(base64Imaegs);
							};
						});
					break;
					//五角星-归path
				case "star":
					draw.path(imagesData[i])
						.toBase64('png', true, function(err, base64) {
							base64Imaegs.push(base64);
							if (--images == 0) {
								callback && callback(base64Imaegs);
							};
						});
					break;
					//多边形
				case "polygon":
					draw.path(imagesData[i])
						.toBase64('png', true, function(err, base64) {
							base64Imaegs.push(base64);
							if (--images == 0) {
								callback && callback(base64Imaegs);
							};
						});
					break;
					//三角形
				case "triangle":
					draw.path(imagesData[i])
						.toBase64('png', true, function(err, base64) {
							base64Imaegs.push(base64);
							if (--images == 0) {
								callback && callback(base64Imaegs);
							};
						});
					break;
					//位图
				case "bitmap":
					draw.bitmap(imagesData[i]).toBase64('png', true, function(err, base64) {
						base64Imaegs.push(base64);
						if (--images == 0) {
							callback && callback(base64Imaegs);
						};
					});
					break;
				default:
					console.dir("未知图形" + imagesData[i]["_class"])
					//抛出错误-保留
					if (--images == 0) {
						callback && callback(base64Imaegs);
					};
					break;
			}
		}
	}
}
module.exports = draw;