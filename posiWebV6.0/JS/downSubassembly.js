//经验 
function downExpImg(orai,myCharts) {
	// 1. 实例化对象
	// 2.指定配置
	var option = {
		backgroundColor:'white', //rgba设置透明度0.1
		title: {
			show: false,
			text: '暂无数据',
			x: 'center',
			y: 'center',
			textStyle: {
				color: '#65ABE7',
				fontWeight: 'normal',
				fontSize: 16
			}
		},
		color: ["#065aab", "#066eab", "#0682ab", "#0696ab", "#06a0ab"],
		tooltip: {
			trigger: "item",
			formatter: "{a} <br/>{b}: {c} ({d}%)"
		},

		legend: {
			bottom: "1%",
			// 修改小图标的大小
			itemWidth: 20,
			itemHeight: 20,
			// 修改图例组件的文字为 12px
			textStyle: {
				color: "black",
				fontSize: "20"
			}
		},
		series: [{
			name: "经验分布:",
			type: "pie",
			// 这个radius可以修改饼形图的大小
			// radius 第一个值是内圆的半径 第二个值是外圆的半径
			radius: ["40%", "60%"],
			center: ["50%", "45%"],
			avoidLabelOverlap: false,
			// 图形上的文字
			label: {
				show: true,
				position: 'inside',
				formatter: '{d}%',
				fontSize: 10
			},
			// 链接文字和图形的线是否显示

			data: [],
		}],
		animation: false
	}
	//填充数据
	// 填充data字段
	var i = orai.size
	orai.forEach((val, key) => {
		if (i != 1)
			option.series[0].data.push({
				value: val,
				name: key == 0 ? "不限" : "经验" + key + "年"
			}) //添加职位名称
		i--
	})
	if (orai.get("count") == 0) option.title.show = true
	myCharts.setOption(option);
	// 监听浏览器缩放，图表对象调用缩放resize函数
	window.addEventListener("resize", function () {
		myCharts.resize();
	});
}

// 公司规模
function downCPNImg(orai,myCharts) {
	var option = {
		backgroundColor:'white',
		title: {
			show: false,
			text: '暂无数据',
			x: 'center',
			y: 'center',
			textStyle: {
				color: '#65ABE7',
				fontWeight: 'normal',
				fontSize: 16
			}
		},
		color: [
			"#006cff",
			"#60cda0",
			"#ed8884",
			"#ff9f7f",
			"#0096ff",
			"#9fe6b8",
			"#32c5e9",
			"#1d9dff"
		],
		tooltip: {
			trigger: "item",
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		legend: {
			bottom: "1%",
			itemWidth: 20,
			itemHeight: 20,
			textStyle: {
				color: "black",
				fontSize: "20"
			}
		},
		series: [{
			name: "公司规模:",
			type: "pie",
			radius: "55%",
			center: ["50%", "50%"],
			// 图形的文字标签
			label: {
				position: 'inside',
				formatter: '{d}%',
				fontSize: 10
			},
			labelLine: {
				// length 链接图形的线条
				length: 6,
				// length2 链接文字的线条
				length2: 8
			},
			data: []
		}],
		animation: false
	};
	//填充数据
	// 填充data字段
	for (var i = 0; i < orai.length; i++) {
		for (let key in orai[i][0]) {
			if (orai[i][0][key] != 0) {
				option.series[0].data.push({
					value: orai[i][0][key],
					name: gui[key]
				}) //添加职位名称
			}
		}
	}
	if (orai.length == 0) option.title.show = true
	myCharts.setOption(option,true);
	// 监听浏览器缩放，图表对象调用缩放resize函数
	window.addEventListener("resize", function () {
		myCharts.resize();
	});
}

// 学历
function downDegreeImg(orai,myChart) {
	var option = {
		backgroundColor:'white',
		title: {
			show: false,
			text: '暂无数据',
			x: 'center',
			y: 'center',
			textStyle: {
				color: '#65ABE7',
				fontWeight: 'normal',
				fontSize: 20
			}
		},
		color: [
			"#006cff",
			"#60cda0",
			"#ed8884",
			"#ff9f7f",
			"#0096ff",
			"#9fe6b8",
			"#32c5e9",
			"#1d9dff"
		],
		tooltip: {
			trigger: "item",
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		legend: {
			bottom: "0%",
			itemWidth: 20,
			itemHeight: 20,
			textStyle: {
				color: "black",
				fontSize: "20"
			}
		},
		series: [{
			name: "地区分布:",
			type: "pie",
			radius: ["30%", "50%"],
			center: ["50%", "40%"],
			roseType: "radius",
			// 图形的文字标签
			label: {
				fontSize: 20
			},
			// 链接图形和文字的线条
			labelLine: {
				// length 链接图形的线条
				length: 6,
				// length2 链接文字的线条
				length2: 8
			},
			data: []
		}],
		animation: false
	}
	//填充数据
	// 填充data字段
	for (var i = 0; i < orai[0].length; i++) {
		var dataJson = orai[0][i]
		option.series[0].data.push({
			value: dataJson.COUNT,
			name: dataJson.DEGREE
		}) //添加职位名称
	}
	if (orai[0].length == 0) option.title.show = true
	myChart.setOption(option);
	// 监听浏览器缩放，图表对象调用缩放resize函数
	window.addEventListener("resize", function () {
		myChart.resize();
	});
}
