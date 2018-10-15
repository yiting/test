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
	parseColor(sketchColor) {
		return "rgba(" +
			Math.round(sketchColor.red * 255) + "," +
			Math.round(sketchColor.green * 255) + "," +
			Math.round(sketchColor.blue * 255) + "," +
			Math.round((1-sketchColor.alpha)* 255) +
		")";
	},
	/**
	 * 获取填充颜色
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	getFillColor(data) {
		if (data.style.fills && data.style.fills[data.style.fills.length - 1].isEnabled) {
			// let color = data.style.fills[0].color;
			let color = data.style.fills[data.style.fills.length - 1].color;
			return this.parseColor(color)
		} else {
			return "rgba(255,255,255,255)"
		}
	},
	/**
	 * 获取描边数据
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	getBorder(data){
		var border={
			width:0,
			color:"rgba(255,255,255,0)",
			type:1
		}
		if (data.style.borders && data.style.borders[0].isEnabled) {
			//width
			border.width=data.style.borders[0].thickness
			//color
			let color = data.style.borders[0].color;
			border.color = this.parseColor(color);
			//描边位置
			border.type=data.style.borders[0].position
		};
		return border;
	},
	//圆形的绘制
	circle(data) {
		//待定
	},
	/**
	 * 获point点的绘图数据
	 * @param  {[type]} w      [description]
	 * @param  {[type]} h      [description]
	 * @param  {[type]} data   [description]
	 * @param  {[type]} offset 偏移量
	 * @return {[type]}        [description]
	 */
	getDrawPoint(w, h, data, offset) {
		offset = offset || {x:0,y:0,w:0,h:0};
		let point = data.match(/([-.e\d]+)/g);
		return (Math.round(parseFloat(point[0]) * (w-0+offset.w) * 10000) / 10000 + offset.x) + "," +
			(Math.round(parseFloat(point[1]) * (h-0+offset.h) * 10000) / 10000 + offset.y)
	},
	/**
	 * 圆角的处理,对路径进行2次变幻
	 * @param  {[type]} points [description]
	 * @return {[type]}        [description]
	 */
	borderRadius(points) {
		/**
		 * 获取点的数据
		 * @param  {[type]} w      [description]
		 * @param  {[type]} h      [description]
		 * @param  {[type]} data   [description]
		 * @param  {[type]} offset [description]
		 * @return {[type]}        [description]
		 */
		getPoint=(point)=>{
			point = point.point.match(/([-.e\d]+)/g);
			return {
				x:parseFloat(point[0]),
				y:parseFloat(point[1])
			}
		};
		/**
		 * 获取三角形的边长
		 * @param  {[type]} p1 [description]
		 * @param  {[type]} p2 [description]
		 * @return {[type]}    [description]
		 */
		getLengthOfTwoPoint=(p1,p2)=>{
			return Math.sqrt(
				Math.pow(p1.x-p2.x,2)+
				Math.pow(p1.y-p2.y,2)
			);
		}
		/**
		 * 创建新的路径节点
		 * @param  {[type]} beforePoint [前一个节点]
		 * @param  {[type]} curPoint    [当前节点]
		 * @param  {[type]} afterPoint  [后一个节点]
		 * @return {[type]}             [description]
		 */
		createNewPoint=(points,current)=>{
			// let newPoint1,newPoint2;
			// return [newPoint1,newPoint2];
			// 假设为一个三角形，当前point角度为A,对边为a；前一个角度为B,对边为b；后一个角度为C，对边为c;
			let A,B,C,a,b,c;
			console.log(getPoint(points[1]));
			// a=getLengthOfTwoPoint(
			// 	getPoint(points[current-1]),
			// 	getPoint(points[current])
			// );
			//一条边的长
			console.log("一条边的长度：",
				
			)
			return points;
		}
		for (let index = 0; index < points.length; index++) {
			//一个点变2个点
			if (points[index].cornerRadius > 0) {
				//获取前后的点
				points=createNewPoint(points, index);
				index++;
			}
		}
		return points;
	},
	/**
	 * 修正path的操控点
	 * @return {[type]} [description]
	 */
	correctPath(points) {
		//修正操控点
		for (let y = 0; y < points.length; y++) {
			if (points[y].hasCurveFrom) {
				points[y].curveFrom = points[y].curveFrom;
			} else {
				points[y].curveFrom = points[y].point;
			}
			if (points[y].hasCurveTo) {
				points[y].curveTo = points[y].curveTo;
			} else {
				points[y].curveTo = points[y].point;
			}
		}
		return points;
	},
	/**
	 * path的绘制命令
	 * @param  {[type]} points [description]
	 * @return {[type]}        [description]
	 */
	pathCommand(points, width, height, offset, isClosed) {
		//路径起始点
		let pathCommand,length;
		pathCommand= "m" + this.getDrawPoint(width, height, points[0].point, offset) + " ";
		length = points.length;
		if (!isClosed) {
			length--
		}
		//路径
		for (let i = 0; i < length; i++) {
			pathCommand += "C";
			pathCommand += this.getDrawPoint(width, height, points[i].curveTo, offset) + " ";
			try {
				pathCommand += this.getDrawPoint(width, height, points[i + 1].curveFrom, offset) + " ";
				pathCommand += this.getDrawPoint(width, height, points[i + 1].point, offset) + " ";
			} catch (e) {
				pathCommand += this.getDrawPoint(width, height, points[0].curveFrom, offset) + " ";
				pathCommand += this.getDrawPoint(width, height, points[0].point, offset) + " ";
			}
		}
		//路径重点
		if (isClosed) {
			pathCommand += "z";
		}
		return pathCommand;
	},
	/**
	 * [getPath description]
	 * @param  {[type]} imageData [description]
	 * @param  {[type]} offset    偏移量number
	 * @return {[type]}           [description]
	 */
	getPath(imageData, ratio,offset) {
		let data = JSON.parse(JSON.stringify(imageData));
		let width = data.frame.width * ratio;
		let height = data.frame.height * ratio;
		let isClosed = imageData.isClosed;
		//绘制的point，和绘制命令
		let points, command;
		//im的bug
		width--;
		height--;
		//im的bug
		//异常处理
		if(data.points.length<2){
			return "";
		}
		//倒序
		points = data.points.reverse();
		//修正path的操控点
		points = this.correctPath(points)
		//圆角处理
		points = this.borderRadius(points)
		//绘制命令
		command = this.pathCommand(points, width, height, offset, isClosed)
		return command;
	},
	/**
	 * 获取矩形的数据
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	// getRectangle(imageData, ratio) {
	// 	let data = JSON.parse(JSON.stringify(imageData));
	// 	let width = data.frame.width * ratio;
	// 	let height = data.frame.height * ratio;
	// 	//暂时只支持居中描边（sketch默认）
	// 	let offset = this.getBorder(imageData).width / 2;
	// 	//倒序
	// 	let points = data.points.reverse();
	// 	let pathCommand = "";
	// 	try {
	// 		pathCommand += this.getDrawPoint(width, height, points[3].point, offset) + " ";
	// 		pathCommand += this.getDrawPoint(width, height, points[1].point, offset) + " ";
	// 	} catch (error) {}
	// 	if (data.fixedRadius) {
	// 		pathCommand += data.fixedRadius * ratio + ",";
	// 		pathCommand += data.fixedRadius * ratio;
	// 	} else {
	// 		pathCommand += "1" + ",";
	// 		pathCommand += "1"
	// 	}
	// 	return pathCommand;
	// },
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
		let data = JSON.parse(JSON.stringify(data));
		//倒序
		let points = data.points.reverse();
		//修正操控点
		points = this.correctPath(points)
		//连续贝塞尔曲线，分段
		newPoints = [];
		for (let j = 0; j < points.length; j++) {
			if (j > 0 && j < (points.length - 1)) {
				let startPoint = JSON.parse(JSON.stringify(points[j]));
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
		let temp = [];
		let w = data.frame.width;
		let h = data.frame.height;
		for (let i = 0; i < points.length; i++) {
			temp = temp.concat(
				this.getDrawPoint(w, h, points[i].curveFrom),
				this.getDrawPoint(w, h, points[i].point),
				this.getDrawPoint(w, h, points[i].curveTo)
			)
		}
		return temp;
	}
}
module.exports = sketchToGm;