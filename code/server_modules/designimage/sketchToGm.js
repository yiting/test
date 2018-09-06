/**
 * @author bowentang
 * @version 1.0
 * @data 2018/08/16
 * @description  sketch 50.1 为基准
 */
//获取基本绘制的数据
const sketchToGm = {
	/**
	 * 获取颜色
	 * @param  {sketchColor} sketchColor [description]
	 * @return {gmcolor}             [description]
	 */
	getColor(sketchColor) {
		return "rgba(" +
			Math.round(sketchColor.red * 255) + "," +
			Math.round(sketchColor.green * 255) + "," +
			Math.round(sketchColor.blue * 255) + "," +
			Math.round((1-sketchColor.alpha) * 255) +
		")";
	},
	getPoint(w, h, data,offset) {
		var point = data.match(/([-.e\d]+)/g);
		offset=offset || 0;
		return (Math.round(parseFloat(point[0]) * w * 100)/100+offset) + "," +
			(Math.round(parseFloat(point[1]) * h * 100) /100+offset)
	},
	/**
	 * 获取填充颜色
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	getFillColor(data) {
		if (data.style.fills && data.style.fills[data.style.fills.length-1].isEnabled) {
			// var color = data.style.fills[0].color;
			var color = data.style.fills[data.style.fills.length-1].color;
			return this.getColor(color)
		} else {
			return "rgba(255,255,255,0)"
		}
	},
	/**
	 * 获取描边宽度
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	getBorderWidth(data) {
		// position
		if(data.style.borders && data.style.borders[0].isEnabled){
			return data.style.borders[0].thickness
		}else{
			return 0
		}
	},
	/**
	 * 获取描边颜色
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	getBorderColor(data) {
		if (!data.style.borders || !data.style.borders[0].isEnabled) {
			return null
		}
		if (data.style.borders) {
			var borders = data.style.borders[0].color;
			return this.getColor(borders)
		} else {
			return "rgba(255,255,255,0)"
		}
	},
	//圆形的绘制
	circle(data){
		//待定
	},
	/**
	 * 获取path的路径数据
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	/**
	 * [getPath description]
	 * @param  {[type]} imageData [description]
	 * @param  {[type]} offset    偏移量number
	 * @return {[type]}           [description]
	 */
	getPath(imageData,ratio) {
		var data = JSON.parse(JSON.stringify(imageData));
		let width = data.frame.width*ratio;
		let height = data.frame.height*ratio;
		//暂时只支持居中描边（sketch默认）
		let offset=this.getBorderWidth(imageData)*ratio/2;
		//sketh 特殊bug修复
		// if(imageData["_class"]=="oval"){
			width--;
			height--;	
		// }
		//倒序
		var points = data.points.reverse();
		//修正操控点
		for (var y = 0; y < points.length; y++) {
			points[y].curveFrom = points[y].hasCurveFrom ? points[y].curveFrom : points[y].point;
			points[y].curveTo = points[y].hasCurveTo ? points[y].curveTo : points[y].point;
		}
		//绘制命令
		var pathCommand = "m" + this.getPoint(width, height, points[0].point,offset) + " ";
		var length=points.length;
		if(!imageData.isClosed){
			length--
		}
		for (var i = 0; i <length; i++) {
			pathCommand += "C";
			pathCommand += this.getPoint(width, height, points[i].curveTo,offset) + " "
			try {
				pathCommand += this.getPoint(width, height, points[i + 1].curveFrom,offset) + " "
				pathCommand += this.getPoint(width, height, points[i + 1].point,offset) + " "
			} catch (e) {
				pathCommand += this.getPoint(width, height, points[0].curveFrom,offset) + " "
				pathCommand += this.getPoint(width, height, points[0].point,offset) + " "
			}
		}
		if(imageData.isClosed){
			pathCommand += "z";
		}
		//翻译成svg
		return pathCommand;
	},
	/**
	 * 获取矩形的数据
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	getRectangle(imageData,ratio) {
		var data = JSON.parse(JSON.stringify(imageData));
		let width = data.frame.width*ratio;
		let height = data.frame.height*ratio;
		//暂时只支持居中描边（sketch默认）
		let offset=this.getBorderWidth(imageData)/2;
		//倒序
		var points = data.points.reverse();
		var pathCommand = "";
		try{
			pathCommand += this.getPoint(width, height, points[3].point,offset) + " ";
			pathCommand += this.getPoint(width, height, points[1].point,offset) + " ";
		}catch(error){}
		if (data.fixedRadius) {
			pathCommand += data.fixedRadius*ratio + ",";
			pathCommand += data.fixedRadius*ratio;
		}else{
			pathCommand += "1" + ",";
			pathCommand += "1"
		}
		return pathCommand;
		//path
		//gradient
		//radisu
		// return Math.random();
	},
	/**
	 * @param  {sketch data}
	 * @return {draw data}
	 */
	getTriangle(data) {
		//path
		//gradient
		//radisu
	},
	/**
	 * 连续贝塞尔曲线的数据--等待
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	getBezierPath(data) {
		var data = JSON.parse(JSON.stringify(data));
		//倒序
		var points = data.points.reverse();
		//修正操控点
		for (var y = 0; y < points.length; y++) {
			points[y].curveFrom = points[y].hasCurveFrom ? points[y].curveFrom : points[y].point;
			points[y].curveTo = points[y].hasCurveTo ? points[y].curveTo : points[y].point;
		}
		//连续贝塞尔曲线，分段
		newPoints = [];
		for (var j = 0; j < points.length; j++) {
			if (j > 0 && j < (points.length - 1)) {
				var startPoint = JSON.parse(JSON.stringify(points[j]));
				delete points[j].curveTo;
				delete startPoint.curveFrom;
				newPoints.push(points[j]);
				newPoints.push(startPoint)
			} else {
				newPoints.push(points[j]);
			}
		}
		points = newPoints;
		//没有闭合的话，掐掉头尾
		if (!data.isClosed) {
			delete points[0].curveFrom;
			delete points[points.length - 1].curveTo;
		};
		//准备绘制数据
		var temp = [];
		var w = data.frame.width;
		var h = data.frame.height;
		for (var i = 0; i < points.length; i++) {
			temp = temp.concat(
				this.getPoint(w, h, points[i].curveFrom),
				this.getPoint(w, h, points[i].point),
				this.getPoint(w, h, points[i].curveTo)
			)
		}
		return temp;
	}
}
module.exports = sketchToGm;