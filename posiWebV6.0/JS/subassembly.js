//@param:orai 原始json 
//@param:all 是否为全国
var posiName = []
var gui = {
	"ONEHUN": "150人以内", "FIVEHUN": "150-500人", "THOUHUN": "500-1000人",
	"FIVETHOUHUN": "1000-5000人", "TENTHOU": "5000-10000人", "MORETENTHOU": "10000人以上"
}
var degrees = ['不限', '小学', '初中及以下', '初中', '职高', '高技', '中专', '高中', '大专', '高职', '本科', '硕士', '博士']
var mapDegree = new Map()
for (let i = 0; i < degrees.length; i++) {
	let degree = degrees[i]
	mapDegree.set(degree, i + 1)
}

// 首页
//最高最低薪资
function loadHistogramOne(orai, all, address) {
	let tStroe = []
	// 1实例化对象
	var myChart = echarts.init(document.querySelector(".bar .chart"));
	// 2. 指定配置项和数据
	var option = {
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
		tooltip: {
			trigger: 'axis',
			formatter: function (params) {
				var name = params[0].name
				var cmp = params[0].value
				var how = params[1].value
				return name + '<br>' + "最高薪资 :" + cmp + '<br>' + "最低薪资 : " + how
			},
		},
		grid: {
			left: "5%",
			top: "10%",
			right: "5%",
			bottom: "15%",
			containLabel: true
		},
		itemStyle: {
			barBorderRadius: 3,
		},
		dataZoom: { //实现缩放功能
			show: true,
			realtime: true,
			start: 0,
			end: 1200 / orai.length,
			maxSpan: 1200 / orai.length,
			minSpan: 5,
			height: 12,
			bottom: '2%',
			left: '0.5%',
			right: '0.5%'
		},
		toolbox: {
			show: true,
			feature: {
				dataView: {
					show: true,
					readOnly: false
				},
				magicType: {
					show: true,
					type: ['bar', 'line', 'stack', 'tiled']
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			// 职位名称
			data: [],
			//修改刻度标签
			axisLabel: {
				color: "#4c9bfd",
				fontSize: '20px'
			},

			splitLine: {
				show: false
			},

			scale: true,
			/*按比例显示*/

		}],
		yAxis: [{
			type: 'value',
			axisLabel: {
				color: "#4c9bfd",
				fontSize: '20px'
			},
			axisLine: {
				lineStyle: {
					color: "rgba(255,255,255,1)",
					width: 1,
					type: "solid"
				}
			},

			splitLine: {
				show: false
			}

		}],
		series: [{
			name: '最高薪资',
			type: 'line',
			color: ["#ff8001"],
			data: [],
			barGap: '0%',/*多个并排柱子设置柱子之间的间距*/
		},
		{
			name: '最低薪资',
			type: 'line',
			color: ['#2f89cf'],
			data: []
		},
		],
		label: {
			// 柱图头部显示值
			show: true,
			position: "top",
			color: "#ffffff",
			fontSize: "10px",
			formatter: (params) => {
				if (params.seriesIndex == 0) {
					tStroe[params.dataIndex] = params.value
					return parseInt(params.value)
				} else {
					return tStroe[params.dataIndex] == params.value ? "" : parseInt(params.value)
				}
			}
		},
	};

	if (all) {
		bar1.address = '全国'
	} else {
		bar1.address = address
	}
	sort(orai, (o1, o2) => { return ((o1.SALEMAX - o1.SALEMIN) - (o2.SALEMAX - o2.SALEMIN)) }, true)
	// 填充data字段
	for (var i = 0; i < orai.length; i++) {
		var dataJson = orai[i]
		if (dataJson.SALEMAX >= 500 || dataJson.SALEMAX < dataJson.SALEMIN) continue
		option.xAxis[0].data.push(dataJson.POSINAME) //添加职位名称
		option.series[0].data.push(dataJson.SALEMAX) //添加最高薪资
		option.series[1].data.push(dataJson.SALEMIN) //添加最低薪资
	}
	if (orai.length < 16) {
		option.dataZoom.maxSpan = 100
		option.dataZoom.end = 100
	}
	if (orai.length == 0) option.title.show = true
	// 3. 把配置项给实例对象
	myChart.setOption(option);
	// 4. 让图表跟随屏幕自动的去适应
	window.addEventListener("resize", function () {
		myChart.resize();
	});
}
// 平均薪资
function loadHistogramThree(orai, all, address, id) {
	var myColor = ["#87CEFA", "#00BFFF", "#1E90FF", "#6495ED", "#6A5ACD"];
	// 1实例化对象
	var myChart = echarts.init(document.querySelector(id ? ("#" + id) : ".bar3 .chart"));
	// 2. 指定配置项和数据
	var option = {
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
		tooltip: {
			trigger: 'axis'
		},
		grid: {
			left: "5%",
			top: "10%",
			right: "5%",
			bottom: "15%",
			containLabel: true
		},
		itemStyle: {
			barBorderRadius: 3,
		},
		dataZoom: { //实现缩放功能
			show: true,
			realtime: true,
			start: 0,
			end: 1200 / orai.length,
			minSpan: 1200 / orai.length,
			maxSpan: 1200 / orai.length,
			height: 12,
			bottom: '2%',
			left: '0.5%',
			right: '0.5%'
		},
		toolbox: {
			show: true,
			feature: {
				dataView: {
					show: true,
					readOnly: false
				},
				magicType: {
					show: true,
					type: ['line', 'bar']
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			// 职位名称
			data: [],
			//修改刻度标签
			axisLabel: {
				color: "#4c9bfd",
				fontSize: '20px'
			},
			scale: true,

			splitLine: {
				show: false
			}

			/*按比例显示*/

		}],
		yAxis: [{
			type: 'value',
			axisLabel: {
				color: "#4c9bfd",
				fontSize: '20px'
			},
			axisLine: {
				lineStyle: {
					color: "rgba(255,255,255,1)",
					width: 1,
					type: "solid"
				}
			},

			splitLine: {
				show: false
			}

		}],
		series: [{
			name: '平均薪资',
			type: 'bar',
			barWidth: 13,

			color: (v) => {
				if (v.value > 50) return myColor[4]
				if (v.value > 40) return myColor[3]
				if (v.value > 30) return myColor[2]
				if (v.value > 20) return myColor[1]
				if (v.value > 10) return myColor[0]
				else return "#9370DB"
			},
			label: {
				// 柱图头部显示值
				show: true,
				position: "top",
				color: "#ffffff",
				fontSize: "10px",
				formatter: (params) => {
					return parseInt(params.value)
				}
			},
			data: []
		}]
	};


	sort(orai, (o1, o2) => { return o1.SALEAVG - o2.SALEAVG }, true)
	// 填充data字段
	for (var i = 0; i < orai.length; i++) {
		var dataJson = orai[i]
		if (dataJson.SALEMAX >= 500) continue
		option.xAxis[0].data.push(dataJson.POSINAME) //添加职位名称
		option.series[0].data.push(parseFloat(dataJson.SALEAVG).toFixed(2)) //添加平均薪资
	}
	if (orai.length < 16) {
		option.dataZoom.maxSpan = 100
		option.dataZoom.end = 100
	}
	if (orai.length == 0) option.title.show = true
	// 3. 把配置项给实例对象
	myChart.setOption(option);
	// 4. 让图表跟随屏幕自动的去适应
	window.addEventListener("resize", function () {
		myChart.resize();
	});
}



// 竞争度
function loadHistogramFour(orai, all, address) {

	// 1实例化对象
	var myChart = echarts.init(document.querySelector(".bar4 .chart"), 'infographic');
	// 2. 指定配置项和数据
	var option = {
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

		splitLine: {
			show: false
		},
		tooltip: {
			trigger: 'axis',
			formatter: function (params) {
				var name = params[0].name
				var cmp = params[0].value
				var how = params[1].value
				var tips = ''
				return name + '<br>' + "竞争指数 :" + cmp + '<br>' + "难度指数 : " + how
			},

		},
		grid: {
			left: "0%",
			top: "4%",
			right: "0%",
			bottom: "4%",
			containLabel: true
		},
		itemStyle: {
			barBorderRadius: 3,
		},
		dataZoom: { //实现缩放功能
			show: true,
			realtime: true,
			start: 0,
			end: 1200 / orai.length,
			maxSpan: 1200 / orai.length,
			minSpan: 3,
			height: 12,
			bottom: '2%',
			left: '0.5%',
			right: '0.5%'
		},
		toolbox: {
			show: true,
			feature: {
				dataView: {
					show: true,
					readOnly: false
				},
				magicType: {
					show: true,
					type: ['line', 'bar']
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			// 职位名称
			data: [],
			//修改刻度标签
			axisLabel: {
				color: "#4c9bfd",
				fontSize: '20px'
			},
			scale: true,
			/*按比例显示*/

		}],
		yAxis: [{
			type: 'value',
			axisLabel: {
				color: "#4c9bfd",
				fontSize: '20px'
			},
			axisLine: {
				show: false
			},

		}],
		series: [{
			name: '职位竞争指数',
			type: 'bar',
			color: ["#02a6b5"],
			barGap: '0%',/*多个并排柱子设置柱子之间的间距*/
			data: []
		},
		{
			name: '职位难度',
			type: 'bar',
			color: ['#bfab2e'],
			data: []
		},
		],
		label: {
			// 柱图头部显示值
			show: true,
			position: "top",
			color: "#ffffff",
			fontSize: "10px",
			formatter: (params) => {
				return parseInt(params.value)
			}
		},
	};

	if (all) {
		bar4.address = '全国'
	} else {
		bar4.address = address
	}
	// 填充data字段
	for (var i = 0; i < orai.length; i++) {
		var dataJson = orai[i]
		option.xAxis[0].data.push(dataJson.POSINAME) //添加职位名称
		option.series[0].data.push(dataJson.CMPWEIGHT) //添加平均薪资
		option.series[1].data.push(dataJson.cmpWithAW) //添加平均薪资
	}
	if (orai.length < 16) {
		option.dataZoom.maxSpan = 100
		option.dataZoom.end = 100
	}
	if (orai.length == 0) option.title.show = true
	// 3. 把配置项给实例对象
	myChart.setOption(option);
	// 4. 让图表跟随屏幕自动的去适应
	window.addEventListener("resize", function () {
		myChart.resize();
	});
}

//职位本身雷达图
function rader(data, search, cmp) {

	// 1. 实例化对象
	var myChart = echarts.init(document.querySelector(".rader .chart"));
	// 2.指定配置
	let options = {
		color: ['#67F9D8', '#FFE434', "#FAEBD7	", "#F4A460"],
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
		legend: {
			data: ['对比职业', '查询职业'],
			textStyle: {
				color: "rgba(255,255,255,.5)",
				fontSize: "10"
			},
			orient: 'vertical',
			left: '0%',
			bottom: '12%'
		},
		radar: {
			center: ['50%', '45%'],
			// shape: 'circle',
			indicator: [],
			startAngle: 100,
			splitNumber: 4,
			axisName: {
				formatter: '【{value}】',
				color: '#428BD4'
			},
			splitArea: {
				areaStyle: {
					color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
					shadowColor: 'rgba(0, 0, 0, 0.2)',
					shadowBlur: 10
				}
			},
			axisLine: {
				lineStyle: {
					color: 'rgba(211, 253, 250, 0.8)'
				}
			},
			splitLine: {
				lineStyle: {
					color: 'rgba(211, 253, 250, 0.8)'
				}
			}
		},
		series: [{ name: '', type: 'rader', data: [] }, { name: '', type: 'rader', data: [] }]
	};


	if (data[0].length == 0) {
		options.title.show = true
	} else {
		if (data[0][0].SALEMIN < 5) {
			data[0][0].SALEMIN = 6.5
		}
		if (data[0].length == 0) {
			options.radar.indicator = [
				{ name: '平均薪资', max: parseInt(parseFloat(data[0][0].SALEAVG) * 1.5) },
				{ name: '招聘人数', max: parseInt(parseFloat(data[0][0].NEEDPER) * 1.5) },
				{ name: '最高学历', max: degrees.length },
				{ name: '最低学历', max: degrees.length },
				{ name: '最高薪资', max: parseInt(parseFloat(data[0][0].SALEMAX) * 1.5) },
				{ name: '最低薪资', max: parseInt(parseFloat(data[0][0].SALEMIN) * 1.5) }
			]
		}
		for (var i = 0; i < data.length; i++) {

			let degreeIdx = -1
			options.series[i] = {
				name: (i == 0 ? '查询职业:' : '对比职业:') + (i == 0 ? search : cmp),
				type: 'radar',
				data: [
					{
						value: [],
						name: (i == 0 ? '查询职业:' : '对比职业:') + (i == 0 ? search : cmp),
						label: {
							show: true,
							formatter: function (params) {
								degreeIdx++
								return degreeIdx == 2 || degreeIdx == 3 ? degrees[parseInt(params.value) - 1] : params.value;
							},
							textStyle: {
								fontSize: 16,
								color: options.color[2 + i]
							}
						},
						areaStyle: {
							color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
								{
									color: options.color[i],
									offset: 0
								},
								{
									color: options.color[i],
									offset: 1
								}
							])
						}
					}
				]
			}

			options.legend.data[i] = (i == 0 ? '查询职业:' : '对比职业:') + (i == 0 ? search : cmp)

			var dataJson = data[i][0]
			if (dataJson.SALEMIN < 5) {
				dataJson.SALEMIN = '6.5'
			}
			if (i == 1) {
				options.radar.indicator = [
					{ name: '平均薪资', max: parseInt(Math.max(parseFloat(dataJson.SALEAVG), parseFloat(data[0][0].SALEAVG)) * 1.25) },
					{ name: '招聘人数', max: Math.max(parseInt(dataJson.NEEDPER), parseInt(data[0][0].NEEDPER)) * 2 },
					{ name: '最高学历', max: degrees.length },
					{ name: '最低学历', max: degrees.length },
					{ name: '最高薪资', max: parseInt(Math.max(parseFloat(dataJson.SALEMAX), parseFloat(data[0][0].SALEMAX)) * 1.25) },
					{ name: '最低薪资', max: parseInt(Math.max(parseFloat(dataJson.SALEMIN), parseFloat(data[0][0].SALEMIN)) * 1.25) }
				]
			}

			options.series[i].data[0].value.push(parseInt(dataJson.SALEAVG))
			options.series[i].data[0].value.push(parseInt(dataJson.NEEDPER))
			options.series[i].data[0].value.push(mapDegree.get(dataJson.DEGREEMAX))
			options.series[i].data[0].value.push(mapDegree.get(dataJson.DEGREEMIN))
			options.series[i].data[0].value.push(parseInt(dataJson.SALEMAX))
			options.series[i].data[0].value.push(parseInt(dataJson.SALEMIN))
		}

	}

	myChart.setOption(options, true);
	// 4. 让图表跟随屏幕自动的去适应
	window.addEventListener("resize", function () {
		myChart.resize();
	});
	if (window.screen) {//判断浏览器是否支持window.screen判断浏览器是否支持screen    
		var myw = screen.availWidth;   //定义一个myw，接受到当前全屏的宽    
		var myh = screen.availHeight;  //定义一个myw，接受到当前全屏的高    
		window.moveTo(0, 0);           //把window放在左上脚    
		window.resizeTo(myw, myh);     //把当前窗体的长宽跳转为myw和myh    
	}
}

//经验 
function loadSectorGraphOne(orai, all, address, id) {
	// 1. 实例化对象
	var myChart = echarts.init(document.querySelector(id ? id : ".pie .chart"));
	// 2.指定配置
	var option = {
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
			orient: 'horizontal',
			right: 'right',
			// 修改小图标的大小
			itemWidth: 10,
			itemHeight: 10,
			// 修改图例组件的文字为 12px
			textStyle: {
				color: "rgba(255,255,255,.5)",
				fontSize: "10"
			}
		},
		series: [{
			name: "经验分布:",
			type: "pie",
			// 这个radius可以修改饼形图的大小
			// radius 第一个值是内圆的半径 第二个值是外圆的半径
			radius: ["40%", "60%"],
			center: ["50%", "45%"],
			avoidLabelOverlap: true,
			// 链接图形和文字的线条
			// 图形的文字标签
			label: {
				fontSize: 20
			},
			labelLine: {
				// length 链接图形的线条
				length: 6,
				// length2 链接文字的线条
				length2: 8
			},
			// 链接文字和图形的线是否显示
			emphasis: {
				label: {
					show: true,
					fontSize: '20',
					fontWeight: 'bold'
				}
			},
			data: []
		}]
	}
	if (all) {
		pie.address = '全国'
	} else {
		pie.address = address
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
	myChart.setOption(option);
	// 监听浏览器缩放，图表对象调用缩放resize函数
	window.addEventListener("resize", function () {
		myChart.resize();
	});
}

// 公司规模
function loadSectorGraphThree(orai, all, address) {
	var myChart = echarts.init(document.querySelector(".pie3 .chart"));
	var option = {
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
			bottom: "0%",
			itemWidth: 10,
			itemHeight: 10,
			textStyle: {
				color: "rgba(255,255,255,.5)",
				fontSize: "12"
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
		}]
	};
	if (all) {
		gra3.address = '全国'
	} else {
		gra3.address = address
	}
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
	myChart.setOption(option);
	// 监听浏览器缩放，图表对象调用缩放resize函数
	window.addEventListener("resize", function () {
		myChart.resize();
	});
}

// 学历
function loadSectorGraphTwo(orai, all, address, id) {
	var myChart = echarts.init(document.querySelector(id ? id : ".pie2 .chart"));
	var option = {
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
			orient: 'horizontal',
			right: 'right',
			itemWidth: 10,
			itemHeight: 10,
			textStyle: {
				color: "rgba(255,255,255,.5)",
				fontSize: "12"
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
		}]
	};
	if (all) {
		gra2.address = '全国'
	} else {
		gra2.address = address
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


// 职位信息页面
// 关键字云图
function keyWordCloud(orai, id) {

	const diedData = "电子技术,suse,电机控制,html5,计算,建设,仿真,图片搜索,andriod,客户体验,ios,kettle,iot,微服务,算法,tea,图像处理,信息技术,前沿,无线通信,物联网,数字政府,kibana,c#,操作,调试,zookeeper,云计算语言,数据通信,特征,ai,资源调度,无人机,redhat,analysis,cdm,ips,数据结构,数据中心,a算法,时间序列,ar,系统功能,贝叶斯分类,通信系统,智能驾驶,工具,验收,上位机,sdk,文本分析,数控,搜索引擎,框架,回归,scrapy-redis,搜索算法,推荐引擎,底层,bi,企业信息化,hoo,图形图像,评审,引擎,散列表,高速,selenium,计算机图形,spark,laas,主机,人工智能,saml,攻防,seo,嵌入式驱动,数据挖掘,spare,云安全,rdbms,kvm,c,数字货币,交互设计,弹性计算,交互,电子工程,离线,machine learning,科研,forests,红黑树,审查,descent,r,最优化,rdd,cv,协同过滤,haproxy,自然语言处理,信息管理,hama,spider,naive,kylin,rds,事务管理,变频器,有限元分析,数据流,搜索,风控,dp,机器智能,认证,kinesis,文件系统,知识,交换机,sgd,数据架构,视觉算法,高性能计算,多线程,网络传输,elb,桌面,视频编码,micro-batch,并行,指纹,物理层,swift,expert analysis,metastore,zabbix,生物信息学,链路,推荐,elk,推荐系统,视频处理,生物科学,微信开放平台,电子硬件,gpu,统计,dynamodb,flink,vision,shell,sparse,电子,开发框架,scrum,http,流计算,图像识别,组件,驱动器,多媒体,计算机视觉,data mining,异构,搜索推荐,分布式,认知,视觉,接口,模拟,同步,高精度,智能家居,输出,solr,在线教育,人脸识别,c/c++,规划,高性能,数据安全,安卓,协议栈,k8s,项目设计,流程,go,视频编辑,问答系统,vpn,音视频,regression,增强现实,角色模型,hue,云计算平台,cross fold,组网,模式,数据仓库,tomcat,模式识别,recommendation,一体化,网络平台,elasticsearch,数学算法,设备,安全管理,model,ic,avro,algorithm,ocr,reduce,数字信号,python,工业机器人,dns,distributed,嵌入式c,加密,classification,决策树,排序,通信协议,监控系统,加密算法,路由,开发技术,安全技术,机电,kafka,新媒体,分类算法,cloudwatch,autoscaling,data flow,algorithms,crystal,spss,js,应用市场,声学模型,推理,特征提取,数据分析,管理软件,预测,echarts,摄影测量,控制器,stochastic,基础架构,系统设计,模块,控制算法,map,cloudformation,ui/ux,erp,自然语言理解,cnn,max,芯片,联机,java web,zeppelin,医学图像,流程管理,rabbitmq,pandas,电气,界面开发,模拟电路,数据建模,人机交互,php,数据迁移,传感器,智能硬件,安全审计,分布式计算,数据质量,性能测试,模型,数字化,桌面应用,recognition,动漫,giraph,集群,tcp/ip,加速器,推荐算法,microservices,pig,回归分析,judgment,数据模型,apache spark,derby,算法设计,大数据存储,图像,投资理财,etl,运作,ml,商业智能,方案,j2ee开发,nginx,流式计算,日志收集,导航,图像算法,信息中心,流媒体,综合布线,生物信息,统计分析,设施,爬虫,rnn,质量,语音,nfs,战略规划,自动控制,解码器,unix,软件框架,互联网安全,算法类,dsp,iptables,容器,内核开发,机械手,二叉树,u3d,智能家电,分布式存储,网页设计,硬件技术,storage,jquery,sql,智能,unity,运输,语言模型,联机分析,postgresql,sqs,paas,资源,mongodb,crm,软件集成,二维,软件平台,跨平台,协作,信息安全,总线,lda,系统结构,连接器,3d打印,大数据平台,ruby,pa,子系统,pb,phoenix,ceph,虚拟化,自然语言,c++算法,微信,online,编解码,clustering,sqoop,scikit,嵌入式,r2,支持向量机,cluster,css,三维,数字电路,360全景,分布式数据库,架构设计,ssm,计算技术,虚拟机,lambda,实时,java,3d渲染,基础设施,ext4,xnet,驱动开发,软件开发,s3,界面设计,几何算法,智能语音,qt,深度学习,hcatalog,tf/idf,mxnet,公有云,unity3d,开放平台,前端设计,并行计算,网络安全,javascript,nosql,二维码,解决方案,云技术,功能,cassandra,matplotlib,作业,离线计算,大数据,memcached,小游戏,内核驱动,图形算法,文件,驱动,个性化,距离算法,d-stream,ddos,opsworks,numpy,机器处理,算法优化,面向过程,数字设计,iam,thrift,k-means,pytorch,vector,文字识别,机械臂,arm,activemq,百度云,数字孪生,storm,rocketmq,机器翻译,工具链,gradient,存储引擎,工控,svn,svm,建模,运行,tb,报表,机械学习,2d,电脑,nlp,gossip,dataset,v4,ic设计,云原生,protobuf,kubernetes,fpga开发,数据统计,coreos,智能设备,目标检测,硬件测试,文本,dbms,sws,微信公众号,可穿戴,frequency,3c,图形学,logstash,3d,canopy,paxos,ui,机器学习,3g,系统平台,mysql,日志,面向对象,高并发,oracle,智能终端,小语种,优化算法,工业4.0,感知,cloudtrail,语音识别,dense,单片机,node.js,4g,vi,mllib,仪表,视频图像,云服务,数值计算,消息队列,ids,.net,dataframe,support,电子商务,电商,4s,crunch,sequential,批处理,android,图算法,语音合成,识别算法,智能系统,docker,mesos,d3.js,graphs,5g,控制技术,安全策略,debian,linux,pcb设计,硬件设计,go语言,hadoop,waf,hbase,pattern recognition,量化交易,镜像,canary,游戏引擎,虚拟现实,社交媒体,windows,音频,智慧城市,集成电路,网络协议,engineer,控制策略,scribe,无线网络,mahout,安全,广告平台,声纹识别,dirichlet,learner,优化,渗透测试,olap,定位,hdfs,aws,hiveql,技术文档,图,路径规划,modeling,software,网格,raft,.net开发,图形开发,媒体,redis,底层驱动,硬件电路,电路设计,视觉设计,调度,移动游戏,建站,optimization,故障诊断,实时计算,azkaban,cloudstack,性能分析,软件质量,用户界面,openid,近邻算法,streams,持续交付,关系网,hyper.v,计算机图像,绘图,跟踪算法,impala,视频监控,akka,scrapy,框架设计,室内设计,文本挖掘,电子设计,产品质量,sparksql,诊断,识别,软件性能,saas,关键词提取,量化,链表,系统需求,算法分析,openstack,map/reduce,开发环境,相似度矩阵,centos,分类,hive,xfs,c语言,pattern,数据引擎,挖掘,通信技术,存储系统,数据收集,lot,光通信,tensorflow,computer,数据存储,自动化测试,网页,web,ambari,内核,强化学习,地理信息,云计算,信息流,调优,云数据库,echart,oozie,fdd,图像增强,移动通信,fluentd,excel,聚类,文本处理,集成测试,可视化,工业自动化,ebs,revit,调度算法,模具,yarn,三维重建,图形引擎,机器人,灰度发布,用户画像,图数据库,客户化,神经网络,语义分析,分析模型,cloud,科学研究,spark streaming,数据科学,连接,flume,界面,部署,j2ee,动画,自媒体,视频,人机对话,matlab,数学建模,编码,ubuntu,音效,mining,专家判断,设备管理,信号处理,数据清洗,卫星导航,mapreduce,adas,zeromq,图形界面,信息系统,计算引擎,移动前端,数据抓取,tb/pb,算法检验,raid,scala,mybatis,pyspark,队列,并行算法,结构化,machine-learning,computing,cap,互联网+,平台,bayes,数据库,fuzzy,san,sas,持续集成,chef,数字,tensor,渲染,b树,puppet,数据,机器视觉,评估,opencv,函数式编程,spark,sparksql,sparkstream,sparkmllib";
	const dieDataList = diedData.split(",")
	console.log(dieDataList)
	const wordChart = echarts.init(document.getElementById(id));
	const options = {
		series: [{
			type: 'wordCloud',
			shape: 'circle', //circle cardioid diamond triangle-forward triangle
			left: 0,
			right: 0,
			top: 0,
			right: 0,
			width: '100%',
			height: '100%',


			gridSize: 20, //值越大，word间的距离越大，单位像素
			sizeRange: [10, 42], //word的字体大小区间，单位像素
			rotationRange: [-45, 45], //word的可旋转角度区间

			data: []
		}],
		backgroundColor: 'rgba(0,0,0,0)'
	};

	if (orai[0].length == 0) {
		for (let i = 0; i < 56; i++) {
			let str = dieDataList[i]
			options.series[0].data.push({
				name: str,
				textStyle: {
					normal: {
						color: getRandom(),
					},
					emphasis: {
						shadowBlur: 2,
						shadowColor: '#000'
					}
				},
				value: i % 4
			}) //添加职位名称
		}
	} else {
		for (var i = 0; i < orai[0].length; i++) {
			var dataJson = orai[0][i]
			options.series[0].data.push({
				name: dataJson.NAME,
				textStyle: {
					normal: {
						color: getRandom(),
					},
					emphasis: {
						shadowBlur: 2,
						shadowColor: '#000'
					}
				},
				value: dataJson.COUNT,
			}) //添加职位名称

		}

	}
	wordChart.setOption(options);
	window.addEventListener("resize", function () {
		wordChart.resize();
	});
}

function Img3d(data) {
	var myChart = echarts.init(document.querySelector(".threeD .chart"));
	option = {
		grid3D: {},
		xAxis3D: {
			type: 'category',
			axisLine: {
				lineStyle: {
					color: "#fff",
				},
			},
			axisLabel: {
				show: true,
				textStyle: {
					color: "#fff",
				},
			},
		},
		yAxis3D: {
			axisLine: {
				lineStyle: {
					color: "#fff",
				},
			},
			axisLabel: {
				show: true,
				textStyle: {
					color: "#fff",
				},
			},
		},
		zAxis3D: {
			axisLine: {
				lineStyle: {
					color: "#fff",
				},
			},
			axisLabel: {
				show: true,
				textStyle: {
					color: "#fff",
				},
			},
		},
		dataset: {
			dimensions: [
				'学历',
				'平均薪资',
				'样本量',
			],
			source: data
		},
		axisLine: {
			lineStyle: {
				color: 'yellow' //坐标轴轴线颜色
			}
		},
		series: [
			{
				type: 'scatter3D',
				symbolSize: 2.5,
				encode: {
					x: '学历',
					y: '样本量',
					z: '平均薪资',
					tooltip: [0, 1, 2, 3, 4]
				},
				color: (item) => {
					return item.data[1] > 20 ? 'skyblue' : 'yellow'
				}
			}
		]
	};
	myChart.setOption(option);
	// 监听浏览器缩放，图表对象调用缩放resize函数
	window.addEventListener("resize", function () {
		myChart.resize();
	});
}


function getData3D(address) {
	return new Promise(resolve => {
		ajaxModule("select DEGREE,SALEAVG,CMPWEIGHT from POSIINFO.DEGREEDINFO WHERE POSICOUNT  BETWEEN 8 AND 8000 " + (address ? ("AND ADDRESS LIKE '" + address + "'") : "") + " LIMIT 20000 ")
			.then(ret => {
				let data = ret[0]
				let retData = []
				sort(data, (e1, e2) => {
					return mapDegree.get(e1) - mapDegree.get(e2)
				})
				for (let i = 0; i < data.length; i++) {
					if (data[i].SALEAVG > 50) continue
					retData.push([
						data[i].DEGREE,
						data[i].SALEAVG,
						data[i].CMPWEIGHT
					])
				}
				resolve(retData)
			})
	})
}

// 需求量信息页面
// 前五岗位需求量职位折线图
function brokenLine(orai, id) {
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.querySelector("#" + id));
	var option = {
		tooltip: {
			trigger: 'axis'
		},
		textStyle: {
			color: "#4c9bfd"
		},
		legend: {
			show: true,
			data: [],
			textStyle: {
				color: "#4c9bfd"
			},
			selected: {

			}
		},
		grid: {
			left: '10%',
			right: '10%',
			bottom: '15%',
			containLabel: true
		},
		toolbox: {
			feature: {
				saveAsImage: {}
			}
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: []
		},
		yAxis: {
			type: 'value',
			splitLine: {
				show: false
			}
		},
		series: []
	}
	//   数组分组
	orai = groupBy(orai, "POSINAME")
	let list = []
	for (let i = 0; i < orai.length; i++) {
		option.series[i] = {
			name: orai[i].field,
			type: 'line',
			smooth: true,
			data: []
		}
		option.legend.data.push(orai[i].field)
		if (i != 0)
			option.legend.selected[orai[i].field] = false
		for (let k = 0; k < orai[i].data.length; k++) {
			if (orai[i].data[k].NEEDPER > 200) continue
			if (list.indexOf(orai[i].data[k].DATE) == -1) {
				list.push(orai[i].data[k].DATE)
			}
			option.series[i].data.push([orai[i].data[k].DATE, orai[i].data[k].NEEDPER])
		}
	}

	list.sort((e1, e2) => {
		return Date.parse(e1) - Date.parse(e2)
	})

	list.forEach((e) => {
		option.xAxis.data.push(e)
	})
	// 重新把配置好的新数据给实例对象
	myChart.setOption(option);
	// 4. 让图表跟随屏幕自动的去适应
	window.addEventListener("resize", function () {
		myChart.resize();
	});
}

//需求量
function loadHistogram(orai, all, address) {
	sort(orai, (e1, e2) => { return e1.NEEDPER - e2.NEEDPER }, true)
	var myColor = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"];
	// 1. 实例化对象
	var myChart = echarts.init(document.querySelector(".bar2 .chart"));
	// 2. 指定配置和数据
	var option = {
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
		grid: {
			top: "10%",
			left: "19%",
			bottom: "10%"
			// containLabel: true
		},
		// 不显示x轴的相关信息
		xAxis: {
			show: false
		},
		yAxis: [{
			type: "category",
			inverse: true,
			data: [],

			// 把刻度标签里面的文字颜色设置为白色
			axisLabel: {
				show: true,
				color: "#fff",
				formatter: function (params) {
					var val = "";
					if (params.length > 4) {
						val = params.substr(0, 4) + '...';
						return val;
					} else {
						return params;
					}
				}

			},
			scale: true /*按比例显示*/
		},
		{
			data: [], //全国总量
			show: false,
			inverse: false,
			// 不显示y轴的线
			axisLine: {
				show: false
			},
			// 不显示刻度
			axisTick: {
				show: false
			},
			// 把刻度标签里面的文字颜色设置为白色
			axisLabel: {
				color: "#fff"
			}
		}
		],
		series: [{
			name: "条",
			type: "bar",
			data: [], //地区占有
			yAxisIndex: 0,
			// 修改第一组柱子的圆角
			itemStyle: {
				barBorderRadius: 20,
				// 此时的color 可以修改柱子的颜色
				color: (v) => {
					if (v.value > 1500) return myColor[4]
					if (v.value > 1000) return myColor[3]
					if (v.value > 500) return myColor[2]
					if (v.value > 100) return myColor[1]
					if (v.value > 50) return myColor[0]
					else return "#39aa20"
				},
			},
			// 柱子之间的距离
			barCategoryGap: 50,
			//柱子的宽度
			barWidth: 10,
			// 显示柱子内的文字
			label: {
				show: true,
				position: "inside",
				// {c} 会自动的解析为 数据  data里面的数据
				formatter: function (v) {
					return v.data
				}
			}
		}],

		dataZoom: [{
			start: 0, //默认为0
			end: 1000 / orai.length, //默认为100
			type: 'slider',
			maxValueSpan: 9, //显示数据的条数(默认显示10个)
			show: true,
			yAxisIndex: [0],
			handleSize: 0, //滑动条的 左右2个滑动条的大小
			height: '80%', //组件高度
			left: 700, //左边的距离
			right: 10, //右边的距离
			top: 10, //上边边的距离
			borderColor: "rgba(43,48,67,0.8)",
			fillerColor: '#33384b', //滑动块的颜色
			backgroundColor: 'rgba(13,33,117,0.5)', //两边未选中的滑动条区域的颜色
			showDataShadow: false, //是否显示数据阴影 默认auto
			showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
			realtime: true, //是否实时更新
			filterMode: 'filter',
			yAxisIndex: [0, 1], //控制的y轴
		},
		//滑块的属性
		{
			type: 'inside',
			show: true,
			yAxisIndex: [0, 1],
			start: 1, //默认为1
			end: 10, //默认为100
		}
		]

	};
	// if (all) {
	// 	hot.address = '全国'
	// 	hot.display = "总数"
	// } else {
	// 	hot.address = address
	// 	hot.display = "占比"
	// }
	//填充数据
	// 填充data字段
	posiName = []
	for (var i = 0; i < orai.length; i++) {
		var dataJson = orai[i]
		option.yAxis[0].data.push(dataJson.POSINAME) //添加职位名称
		option.series[0].data.push(dataJson.NEEDPER) //添加占用信息
		option.yAxis[1].data.push(5000) //
		posiName.push(dataJson.POSINAME)
	}
	if (orai.length <= 15) {
		option.dataZoom[0].end = 100
		option.dataZoom[1].end = 100
	}
	if (orai.length == 0) option.title.show = true
	// 3. 把配置给实例对象
	extension(myChart)
	myChart.setOption(option);
	// 4. 让图表跟随屏幕自动的去适应
	window.addEventListener("resize", function () {
		myChart.resize();
	});
}

// 薪资信息页面
// 术语薪资柱状图
function keyInfo(orai, all, address) {
	var myColor = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"];
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.querySelector(".bar1 .chart"));
	option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
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
		grid: {
			left: "10%",
			top: "15%",
			right: "10%",
			bottom: "15%",
			containLabel: true
		},
		itemStyle: {
			barBorderRadius: 3,
		},
		dataZoom: { //实现缩放功能
			show: true,
			realtime: true,
			start: 0,
			end: 1200 / orai.length,
			minSpan: 1,
			maxSpan: 1200 / orai.length,
			height: 12,
			bottom: '2%',
			left: '0.5%',
			right: '0.5%'
		},
		toolbox: {
			show: true,
			feature: {
				dataView: {
					show: true,
					readOnly: false
				},
				magicType: {
					show: true,
					type: ['line', 'bar']
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			// 职位名称
			data: [],
			//修改刻度标签
			axisLabel: {
				color: "#4c9bfd",
				fontSize: '20px'
			},
			scale: true,
			/*按比例显示*/

		}],
		yAxis: [{
			type: 'value',
			axisLabel: {
				color: "#4c9bfd",
				fontSize: '20px'
			},
			axisLine: {
				lineStyle: {
					color: "rgba(255,255,255,1)",
					width: 1,
					type: "solid"
				}
			}
		}],
		series: [{
			name: '平均薪资',
			type: 'bar',
			color: (v) => {
				if (v.value > 50) return myColor[4]
				if (v.value > 40) return myColor[3]
				if (v.value > 30) return myColor[2]
				if (v.value > 20) return myColor[1]
				if (v.value > 10) return myColor[0]
				else return "#39aa20"
			},
			barWidth: 13,
			label: {
				// 柱图头部显示值
				show: true,
				position: "top",
				color: "#ffffff",
				fontSize: "10px",
				formatter: (params) => {
					return params.value
				}
			},
			data: []
		}]
	};
	sort(orai, (e1, e2) => {
		return e1.SALEAVG - e2.SALEAVG
	}, true)
	// 填充data字段
	for (var i = 0; i < orai.length; i++) {
		var dataJson = orai[i]
		if (dataJson.SALEMAX >= 500) continue
		option.xAxis[0].data.push(dataJson.KEYNAME) //添加关键术语
		option.series[0].data.push(parseFloat(dataJson.SALEAVG).toFixed(2))//添加平均薪资
	}
	if (orai.length < 16) {
		option.dataZoom.maxSpan = 100
		option.dataZoom.end = 100
	}

	// 3. 把配置和数据给实例对象
	myChart.setOption(option);
	// 4. 让图表跟随屏幕自动的去适应
	window.addEventListener("resize", function () {
		myChart.resize();
	});
}


/*------------------刷新雷达图--------------------*/
function reloadRader(searchPosi, cmpPosi, address) {
	let whereOne = [['AND', 'POSINAME', '=', "'" + searchPosi + "'"]]
	let whereTwo = [['AND', 'POSINAME', '=', "'" + cmpPosi + "'"]]
	if (address) {
		whereOne.push(['AND', 'ADDRESS', 'LIKE', "'%" + address + "%'"])
		whereTwo.push(['AND', 'ADDRESS', 'LIKE', "'%" + address + "%'"])
	}
	// 雷达图
	getFieldInKey(address ? "ADDRESSDINFO" : 'ALLDINFO', ['SALEAVG', 'NEEDPER', 'DEGREEMAX', 'DEGREEMIN', 'SALEMAX', 'SALEMIN'], whereOne).then((searchRet) => {
		if (cmpPosi) {
			getFieldInKey(address ? "ADDRESSDINFO" : 'ALLDINFO', ['SALEAVG', 'NEEDPER', 'DEGREEMAX', 'DEGREEMIN', 'SALEMAX', 'SALEMIN'], whereTwo).then((cmpPosiRet) => {
				searchRet.push(cmpPosiRet[0])

				rader(searchRet, searchPosi, cmpPosi)
			})
		} else {
			rader(searchRet, searchPosi, cmpPosi)
		}
	})
}


// 更新首页视图
function reload(address, level, isCounty, posiName, isCieLevel, isPosiName, inputChange) {

	let exist = false
	// 是否为县级城市
	let all = address == '全国'
	if (!inputChange) {
		// 下拉框等级（无默认为不限）
		getLevels(all ? null : address).then((retLevel) => {
			select.count = 0
			select.$nextTick(() => {
				select.options = []
				for (let i = 0; i < retLevel.length; i++) {
					select.options.push({
						label: retLevel[i].LEVEL + "(" + retLevel[i].COUNT + ")",
						value: retLevel[i].LEVEL,
					})
					select.count += parseInt(retLevel[i].COUNT)
				}
				if (select.options.length > 0) {
					select.value = isCieLevel ? isCieLevel : select.options[0].value
				}
				getPosiName(address, select.value).then((ret) => {
					select.origin = [{
						label: '不限',
						value: 0
					}]
					select.options2 = [{
						label: '不限',
						value: 0
					}]
					select.$nextTick(() => {
						for (let i = 1; i <= ret.length; i++) {
							select.origin.push({
								label: ret[i - 1].POSINAME,
								value: i
							})
							select.options2.push({
								label: ret[i - 1].POSINAME,
								value: i
							})
							if (ret[i - 1].POSINAME == posiName)
								exist = true
						}
						if (select.origin.length == 1) {
							select.selectValue = select.origin[0]
							posiName = null
						}
						else if ((isPosiName || select.options.length > 1) || !exist) {
							select.selectValue = isPosiName ? isPosiName : select.origin[1]
							posiName = select.selectValue.label
						}
						// 刷新雷达图
						if (posiName) {
							bar3.isClassify = true
							bar1.isClassify = true
							raderVue.isClassify = false
							raderVue.count = 0
							raderVue.$nextTick(() => {
								raderVue.options = []
								for (let i = 0; i < retLevel.length; i++) {
									raderVue.options.push({
										label: retLevel[i].LEVEL + "(" + retLevel[i].COUNT + ")",
										value: retLevel[i].LEVEL,
									})
									raderVue.count += parseInt(retLevel[i].COUNT)
								}

								if (raderVue.options.length > 0) {
									raderVue.value = raderVue.options[0].value
									raderVue.onChange(raderVue.value)
								}
							});
						}
						else {
							bar3.isClassify = false
							bar1.isClassify = false
							raderVue.isClassify = true
						}
					})

				})
			});
		})
	}
	else {
		if (posiName) {
			bar3.isClassify = true
			bar1.isClassify = true
			raderVue.isClassify = false
		}
		else {
			bar3.isClassify = false
			bar1.isClassify = false
			raderVue.isClassify = true
		}
	}
	if (all) {
		table.isAll = true
		reloadAll(level, posiName, raderVue.value, false)
		table.styleTable = "height: 5.0rem;"
		return
	}
	table.styleTable = "height: 1.7rem;"
	table.isAll = false
	if (!isCounty) {
		hot.address = address
		let sql = "SELECT SUM(NEEDPER) AS COUNT,ADDRESS" + (posiName ? ",MAX(SALEAVG) AS MAXAVGSALE" : "") + " FROM POSIINFO.ADDRESSDINFO WHERE PREPROVINCE LIKE '%" + address + "%' AND CITYTYPE = '1' " + (level ? "AND LEVEL = '" + level + "' " : "") + (posiName ? "AND POSINAME = '" + posiName + "' " : "") + "GROUP BY ADDRESS ORDER BY SUM(NEEDPER) LIMIT 10"
		ajaxModule(sql).then((ret) => {
			hot.tableData = []
			hot.$nextTick(() => {
				hot.count = ret[0].length
				for (let i = 0; i < ret[0].length; i++) {
					hot.tableData.push({
						"one": ret[0][i].ADDRESS,
						"two": ret[0][i].COUNT,
						"three": posiName ? ret[0][i].MAXAVGSALE : "-"
					})
				}
				hot.style = hot.tableData.length <= 3 ? "" : "animation: row  " + hot.tableData.length +
					"s linear infinite;"
				$(".monitor .marquee").hover(() => {
					document.getElementById("tableHot").style.animationPlayState =
						'paused'
				})
				$(".monitor .marquee").mouseleave(() => {
					document.getElementById("tableHot").style.animationPlayState =
						'running'
				})
			})
		})
	}
	// 表格重加载
	getFieldInKey("ADDRESSDINFO", ['*'], [['AND', 'ADDRESS', 'LIKE', "'%" + address + "%'"]], level, posiName).then((ret) => {
		table.tableData = []

		table.$nextTick(() => {
			for (let i = 0; i < ret[0].length; i++) {
				table.tableData.push({
					"one": ret[0][i].POSINAME.substring(0, ret[0][i]
						.POSINAME.indexOf("(") == -1 ? ret[0][i]
							.POSINAME.length : ret[0][i]
								.POSINAME.indexOf("(")),
					"two": parseFloat((ret[0][i].SALEAVG)).toFixed(2),
					"three": parseFloat((ret[0][i].SALEMAX)).toFixed(2),
					"four": ret[0][i].NEEDPER,
					"five": ret[0][i].POSICOUNT,
					"six": ret[0][i].LEVEL,
					"seven": ret[0][i].CMPWEIGHT
				})

			}
			table.style = table.tableData.length < 2 ? "" : "animation: row  " + table.tableData.length + "s linear infinite;"
			$(".monitor .marquee").hover(() => {
				document.getElementById("tableLis").style.animationPlayState = 'paused'
			})
			$(".monitor .marquee").mouseleave(() => {
				document.getElementById("tableLis").style.animationPlayState = 'running'
			})
		})
	})
	// 经验分布
	getDegreeOrExpInfo("EXPDINFO", "EXP", posiName, address, level).then((ret) => {
		loadSectorGraphOne(ret[0], all, address)
	})
	// 学历分布
	ajaxModule("select DEGREE,COUNT(DEGREE) AS COUNT FROM POSIINFO.DEGREEDINFO where address LIKE '%" + address + "%' " + (posiName ? " AND POSINAME = '" + posiName + "'" : "") + "group by degree").then((ret) => {
		loadSectorGraphTwo(ret, all, address)
	});
	// 最高最低薪资
	getFieldInKey("ADDRESSDINFO", ["POSINAME", "SALEMAX", "SALEMIN"], [
		["AND", "ADDRESS", "LIKE", "'%" + address + "%'"]
	], level, posiName).then((ret) => {
		loadHistogramOne(ret[0], all, address)
	});
	// 平均薪资
	getFieldInKey("ADDRESSDINFO", ["POSINAME", "SALEAVG"], [
		["AND", "ADDRESS", "LIKE", "'%" + address + "%'"]
	], level, posiName).then((ret) => {
		loadHistogramThree(ret[0], all, address)
	});
	// 公司规模
	getCPNInfo(address, posiName, level).then((ret) => {
		loadSectorGraphThree(ret, all, address)
	})
	// if(isCounty){
	// 	// 县级显示人数需求
	// 	let fields = ["POSINAME", "NEEDPER"]
	// 	if (!all) fields.push("CMPWEIGHT")
	// 	getFieldInKey("ADDRESSDINFO", fields, [
	// 		["AND", "ADDRESS", "LIKE", "'%" + address + "%'"]
	// 	],level).then(ret) => {

	// 		loadHistogramTwo(ret[0], all, address)
	// 	});
	// }
	// 竞争权值
	getCMPWeight(posiName, address, level).then((ret) => {

		loadHistogramFour(ret, all, address)
	})
}

//重置首页全国
function reloadAll(level, posiName, cmpPosi, once) {
	if (posiName) {
		bar3.isClassify = true
		bar1.isClassify = true
		raderVue.isClassify = false
		if (once)
			reloadRader(posiName, cmpPosi)
		hot.ciePosiname = true
	}
	else {
		bar3.isClassify = false
		bar1.isClassify = false
		raderVue.isClassify = true
		hot.ciePosiname = true
	}
	ajaxModule("select DEGREE,COUNT(DEGREE) AS COUNT FROM POSIINFO.DEGREEDINFO WHERE TRUE " + (level ? " AND LEVEL = '" + level + "'" : "") + (posiName ? " AND POSINAME = '" + posiName + "'" : "") + " group by degree").then((ret) => {
		loadSectorGraphTwo(ret, true)
	});
	getDegreeOrExpInfo("EXPDINFO", "EXP", posiName, null, level).then((ret) => {
		loadSectorGraphOne(ret[0], true)
	})
	// getFieldInKey("ALLDINFO", ["POSINAME", "NEEDPER"],null,level).then((ret) => {
	// 	loadHistogramTwo(ret[0], true)
	// });
	getFieldInKey("ALLDINFO", ["POSINAME", "SALEMAX", "SALEMIN"], null, level, posiName, null, "LIMIT " + parseInt(Math.random() * 1500 + 25)).then((ret) => {
		loadHistogramOne(ret[0], true)
	});
	getFieldInKey("ALLDINFO", ["POSINAME", "SALEAVG"], null, level, posiName, null, "LIMIT " + parseInt(Math.random() * 1500 + 25)).then((ret) => {
		loadHistogramThree(ret[0], true)
	});
	getCPNInfo(null, posiName, level).then((ret) => {
		loadSectorGraphThree(ret, true)
	})
	// 滚动视图
	getAllInfo(level, posiName).then((ret) => {
		table.$nextTick(() => {
			table.tableData = []
			for (let i = 0; i < ret[0].length; i++) {

				table.tableData.push({
					"one": ret[0][i].POSINAME.substring(0, ret[0][i]
						.POSINAME.indexOf("(") == -1 ? ret[0][i]
							.POSINAME.length : ret[0][i]
								.POSINAME.indexOf("(")),
					"two": parseFloat((ret[0][i].SALEAVG)).toFixed(2),
					"three": parseFloat((ret[0][i].SALEMAX)).toFixed(2),
					"four": ret[0][i].NEEDPER,
					"five": ret[0][i].POSICOUNT,
					"six": ret[0][i].LEVEL
				})
			}
			table.style = table.tableData.length < 3 ? "" : "animation: row  " + table.tableData.length +
				"s linear infinite;"
			$(".monitor .marquee").hover(() => {
				document.getElementById("tableLis").style.animationPlayState =
					'paused'
			})
			$(".monitor .marquee").mouseleave(() => {
				document.getElementById("tableLis").style.animationPlayState =
					'running'
			})
		})
	})
	// 最热城市全国范围
	let sql = "SELECT SUM(NEEDPER) AS COUNT,ADDRESS" + (posiName ? ",MAX(SALEAVG) AS MAXAVGSALE" : "") + " FROM POSIINFO.ADDRESSDINFO WHERE CITYTYPE = '1' " + (posiName ? "AND POSINAME='" + posiName + "'" : "") + (level ? "AND LEVEL='" + level + "'" : "") + "GROUP BY ADDRESS ORDER BY SUM(NEEDPER) DESC LIMIT 20"
	ajaxModule(sql).then((ret) => {

		hot.tableData = []
		hot.count = ret[0].length
		for (let i = 0; i < ret[0].length; i++) {
			hot.tableData.push({
				"one": ret[0][i].ADDRESS,
				"two": ret[0][i].COUNT,
				"three": posiName ? ret[0][i].MAXAVGSALE : "-"

			})
		}
		hot.style = hot.tableData.length <= 3 ? "" : "animation: row  " + hot.tableData.length + "s linear infinite;"
		$(".monitor .marquee").hover(() => {
			document.getElementById("tableHot").style.animationPlayState =
				'paused'
		})
		$(".monitor .marquee").mouseleave(() => {
			document.getElementById("tableHot").style.animationPlayState =
				'running'
		})
	})

}

// 更新职位信息视图
function reloadPosiInfo(address, level, posiName, pounchAdd) {
	// 是否为县级城市
	let all = address == '全国'
	// 下拉框等级（无默认为不限）
	getLevels(all ? null : address).then((ret) => {
		select.count = 0
		select.$nextTick(() => {
			select.options = []
			for (let i = 0; i < ret.length; i++) {
				select.options.push({
					label: ret[i].LEVEL + "(" + ret[i].COUNT + ")",
					value: ret[i].LEVEL,
				})
				select.count += parseInt(ret[i].COUNT)
			}
			if (pounchAdd)
				select.onChange(select.options[0].value)
		});
	})
	if (all) {
		// table.isAll = true
		reloadAllPosiinfo(level, posiName)
		// table.styleTable = "height: 5.0rem;"
		return
	}

	// 3d散点图

	getData3D(address).then(data => {
		Img3d(data)
	})

	// 滚动列表
	getFieldInKey("ORDININFO", ["*"], null, null, null, address, "LIMIT 50" + parseInt(Math.random() * 50).toString()).then((ret) => {
		list.tableData = []
		list.$nextTick(() => {
			for (let i = 0; i < ret[0].length; i++) {
				list.tableData.push({
					one: ret[0][i].ADDRESS,
					two: ret[0][i].COMPANY,
					three: ret[0][i].POSINAME,
					four: ret[0][i].NEEDPER,
					five: parseFloat(ret[0][i].SALEAVG).toFixed(2),
					six: ret[0][i].DEGREE,
					seven: (ret[0][i].EXP == '0' ? "经验不限" : ("至少" + ret[0][i].EXP + "年"))
				})
			}
			list.style = list.tableData.length < 2 ? "" : "animation: row  " + list.tableData.length + "s linear infinite;"
			$(".monitor .marquee").hover(() => {
				document.getElementById("tableList").style.animationPlayState = 'paused'
			})
			$(".monitor .marquee").mouseleave(() => {
				document.getElementById("tableList").style.animationPlayState = 'running'
			})
		})
	})
	// 高亮信息
	getFieldInKey("ADDRESSDINFO", ["SALEAVG,SALEMAX,SALEMIN,NEEDPER"], null, null, posiName, address).then((ret) => {
		let info = ret[0][0]
		left.saleavg = parseFloat(info.SALEAVG).toFixed(2)
		left.needper = info.NEEDPER
		right.max = parseFloat(info.SALEMAX).toFixed(2)
		right.min = parseFloat(info.SALEMIN).toFixed(2)
	})
	// 学历分布
	ajaxModule("select DEGREE,COUNT(DEGREE) AS COUNT FROM POSIINFO.DEGREEDINFO where address LIKE '%" + address + "%' " + (level ? " AND LEVEL = '" + level + "'" : "") + (posiName ? " AND POSINAME = '" + posiName + "'" : "") + "group by degree").then((ret) => {
		loadSectorGraphTwo(ret, all, address, "#DEGREE")
	});
	// 关键字云图
	getFieldInKey("KEYCOUNT", ["KEYNAME AS NAME", "COUNT"], null, null, posiName, null, "LIMIT " + (15 + parseInt(Math.random() * 15)).toString()).then((ret) => {

		console.log(ret)
		keyWordCloud(ret, "key")
	})
	// 福利云图
	getFieldInKey("DESCCOUNT", ["DESCNAME AS NAME", "COUNT"], null, null, posiName, null, "LIMIT " + (15 + parseInt(Math.random() * 15)).toString()).then((ret) => {
		keyWordCloud(ret, "desc")
	})
}
// 重置全国职位信息
function reloadAllPosiinfo(level, posiName) {
	// 滚动列表
	getFieldInKey("ORDININFO", ["*"], null, null, null, null, "LIMIT 150").then((ret) => {
		list.tableData = []
		list.$nextTick(() => {
			for (let i = 0; i < ret[0].length; i++) {
				list.tableData.push({
					one: ret[0][i].ADDRESS,
					two: ret[0][i].COMPANY,
					three: ret[0][i].POSINAME,
					four: ret[0][i].NEEDPER,
					five: parseFloat(ret[0][i].SALEAVG).toFixed(2),
					six: ret[0][i].DEGREE,
					seven: (ret[0][i].EXP == '0' ? "经验不限" : ("至少" + ret[0][i].EXP + "年"))
				})
			}
			list.style = list.tableData.length < 2 ? "" : "animation: row  " + list.tableData.length + "s linear infinite;"
			$(".monitor .marquee").hover(() => {
				document.getElementById("tableList").style.animationPlayState = 'paused'
			})
			$(".monitor .marquee").mouseleave(() => {
				document.getElementById("tableList").style.animationPlayState = 'running'
			})
		})
	})


	getData3D().then(data => {
		Img3d(data)
	})

	getFieldInKey("ALLDINFO", ["SALEAVG,SALEMAX,SALEMIN,NEEDPER"], null, null, posiName).then((ret) => {
		let info = ret[0][0]
		left.saleavg = parseFloat(info.SALEAVG).toFixed(2)
		left.needper = info.NEEDPER
		right.max = parseFloat(info.SALEMAX).toFixed(2)
		right.min = parseFloat(info.SALEMIN).toFixed(2)
	})
	ajaxModule("select DEGREE,COUNT(DEGREE) AS COUNT FROM POSIINFO.DEGREEDINFO WHERE TRUE" + (level ? " AND LEVEL = '" + level + "'" : "") + (posiName ? " AND POSINAME = '" + posiName + "'" : "") + " group by degree").then((ret) => {
		loadSectorGraphTwo(ret, true)
	});
	// 关键字云图
	getFieldInKey("KEYCOUNT", ["KEYNAME AS NAME", "COUNT"], null, null, posiName, null, "LIMIT " + (30 + parseInt(Math.random() * 15)).toString()).then((ret) => {

		console.log(ret)
		keyWordCloud(ret, "key")
	})
	// 福利云图
	getFieldInKey("DESCCOUNT", ["DESCNAME AS NAME", "COUNT"], null, null, posiName, null, "LIMIT " + (30 + parseInt(Math.random() * 15)).toString()).then((ret) => {
		keyWordCloud(ret, "desc")
	})
}

// 更新需求量信息视图
function reloadPosicount(address, start, end) {
	let all = address == '全国'
	if (all) {
		reloadAllPosicount(start, end)
		return
	}
	let where = (start != 0 || end != 0 ? [["AND NEEDPER BETWEEN ", start, " AND ", end]] : "")
	// 滚动列表
	getFieldInKey("ORDININFO", ["*"], where, null, null, address, "LIMIT " + parseInt(50 + Math.random() * 50).toString(),).then((ret) => {
		list.tableData = []
		list.$nextTick(() => {
			for (let i = 0; i < ret[0].length; i++) {
				list.tableData.push({
					one: ret[0][i].ADDRESS,
					two: ret[0][i].COMPANY,
					three: ret[0][i].POSINAME,
					four: ret[0][i].NEEDPER,
					five: parseFloat(ret[0][i].SALEAVG).toFixed(2),
					six: ret[0][i].DEGREE,
					seven: (ret[0][i].EXP == '0' ? "经验不限" : ("至少" + ret[0][i].EXP + "年"))
				})
			}
			list.style = list.tableData.length < 2 ? "" : "animation: row  " + list.tableData.length + "s linear infinite;"
			$(".monitor .marquee").hover(() => {
				document.getElementById("tableList").style.animationPlayState = 'paused'
			})
			$(".monitor .marquee").mouseleave(() => {
				document.getElementById("tableList").style.animationPlayState = 'running'
			})
		})
	})
	// 需求量
	ajaxModule(("SELECT POSINAME,NEEDPER FROM POSIINFO.ADDRESSDINFO WHERE ADDRESS LIKE '%" + address + "%' ") + (start != 0 || end != 0 ? ("AND NEEDPER BETWEEN " + start + " AND " + end) : "")).then((ret) => {
		loadHistogram(ret[0], all, address)
	})
	getFieldInKey("KEYCOUNT", ["KEYNAME AS NAME", "COUNT"], null, null, null, null, "LIMIT " + (15 + parseInt(Math.random() * (end - start)))).then((ret) => {
		keyWordCloud(ret, "key")
	})
	ajaxModule(getSQL(start, end, "PERNEED")).then((ret) => {
		brokenLine(ret[0], "date")

	})


}
// 重置全国需求量信息
function reloadAllPosicount(start, end) {
	let where = (start != 0 || end != 0 ? ([["AND NEEDPER BETWEEN ", start, " AND ", end]]) : "")
	// 滚动列表
	getFieldInKey("ORDININFO", ["*"], where, null, null, null, "LIMIT 150").then((ret) => {
		list.tableData = []
		list.$nextTick(() => {
			for (let i = 0; i < ret[0].length; i++) {
				list.tableData.push({
					one: ret[0][i].ADDRESS,
					two: ret[0][i].COMPANY,
					three: ret[0][i].POSINAME,
					four: ret[0][i].NEEDPER,
					five: parseFloat(ret[0][i].SALEAVG).toFixed(2),
					six: ret[0][i].DEGREE,
					seven: (ret[0][i].EXP == '0' ? "经验不限" : ("至少" + ret[0][i].EXP + "年"))
				})
			}
			list.style = list.tableData.length < 2 ? "" : "animation: row  " + list.tableData.length + "s linear infinite;"
			$(".monitor .marquee").hover(() => {
				document.getElementById("tableList").style.animationPlayState = 'paused'
			})
			$(".monitor .marquee").mouseleave(() => {
				document.getElementById("tableList").style.animationPlayState = 'running'
			})
		})
	})
	ajaxModule("SELECT POSINAME,NEEDPER FROM POSIINFO.ALLDINFO  " + (start != 0 || end != 0 ? ("WHERE NEEDPER BETWEEN " + start + " AND " + end) : "") + " LIMIT  15000").then((ret) => {
		loadHistogram(ret[0], true, null)
	})
	ajaxModule(getSQL(start, end, "PERNEED")).then((ret) => {
		brokenLine(ret[0], "date")

	})


	getFieldInKey("KEYCOUNT", ["KEYNAME AS NAME", "COUNT"], null, null, null, null, "LIMIT " + (30 + parseInt(Math.random() * 15))).then((ret) => {
		keyWordCloud(ret, "key")
	})

}

// 更新薪资信息
function reloadPosisalary(address, start, end) {
	let all = address == '全国'
	if (all) {
		reloadAllPosisalary(start, end)
		return
	}
	ajaxModule("SELECT SALEAVG,POSINAME FROM POSIINFO.ADDRESSDINFO WHERE ADDRESS LIKE '%" + address + "%' " + (start != 0 || end != 0 ? ("AND SALEAVG BETWEEN " + start + " AND " + end) : ""))
		.then((ret) => {
			loadHistogramThree(ret[0], false, address, "avgsale")
			let whereSQL = (start != 0 || end != 0 ? ("WHERE SALEAVG BETWEEN " + start + " AND " + end) : "")
			ajaxModule("SELECT KEYNAME,AVG(SALEAVG) AS SALEAVG FROM POSIINFO.KEYCOUNT " + whereSQL + " GROUP BY KEYNAME ").then((nRet) => {
				if (ret[0].length == 0) {
					nRet[0] = []
				}
				nRet[0] = shuffleArray(nRet[0], ret[0].length)
				keyInfo(nRet[0])
			})
		})

	ajaxModule(getSQL(start, end, "SALEAVG")).then((ret) => {
		brokenLine(ret[0], "date")
	})
	let where = (start != 0 || end != 0 ? [["AND SALEAVG BETWEEN ", start, " AND ", end]] : "")
	// 滚动列表
	getFieldInKey("ORDININFO", ["*"], where, null, null, address, "LIMIT " + parseInt(50 + Math.random() * 50).toString(),).then((ret) => {
		list.tableData = []
		list.$nextTick(() => {
			for (let i = 0; i < ret[0].length; i++) {
				list.tableData.push({
					one: ret[0][i].ADDRESS,
					two: ret[0][i].COMPANY,
					three: ret[0][i].POSINAME,
					four: ret[0][i].NEEDPER,
					five: parseFloat(ret[0][i].SALEAVG).toFixed(2),
					six: ret[0][i].DEGREE,
					seven: (ret[0][i].EXP == '0' ? "经验不限" : ("至少" + ret[0][i].EXP + "年"))
				})
			}
			list.style = list.tableData.length < 2 ? "" : "animation: row  " + list.tableData.length + "s linear infinite;"
			$(".monitor .marquee").hover(() => {
				document.getElementById("tableList").style.animationPlayState = 'paused'
			})
			$(".monitor .marquee").mouseleave(() => {
				document.getElementById("tableList").style.animationPlayState = 'running'
			})
		})
	})
}
// 重置全国薪资信息
function reloadAllPosisalary(start, end) {
	ajaxModule("SELECT SALEAVG,POSINAME FROM POSIINFO.ALLDINFO " + (start != 0 || end != 0 ? ("WHERE SALEAVG BETWEEN " + start + " AND " + end) : "" + " LIMIT 5000"))
		.then((ret) => {
			loadHistogramThree(ret[0], true, null, "avgsale")
		})

	ajaxModule(getSQL(start, end, "SALEAVG")).then((ret) => {

		brokenLine(ret[0], "date")
	})

	let whereSQL = (start != 0 || end != 0 ? ("WHERE SALEAVG BETWEEN " + start + " AND " + end) : "")
	ajaxModule("SELECT KEYNAME,AVG(SALEAVG) AS SALEAVG FROM POSIINFO.KEYCOUNT " + whereSQL + " GROUP BY KEYNAME ").then((ret) => {
		keyInfo(ret[0])
	})

	let where = (start != 0 || end != 0 ? ([["AND SALEAVG BETWEEN ", start, " AND ", end]]) : "")

	// 滚动列表
	getFieldInKey("ORDININFO", ["*"], where, null, null, null, "LIMIT 150").then((ret) => {
		list.tableData = []
		list.$nextTick(() => {
			for (let i = 0; i < ret[0].length; i++) {
				list.tableData.push({
					one: ret[0][i].ADDRESS,
					two: ret[0][i].COMPANY,
					three: ret[0][i].POSINAME,
					four: ret[0][i].NEEDPER,
					five: parseFloat(ret[0][i].SALEAVG).toFixed(2),
					six: ret[0][i].DEGREE,
					seven: (ret[0][i].EXP == '0' ? "经验不限" : ("至少" + ret[0][i].EXP + "年"))
				})
			}
			list.style = list.tableData.length < 2 ? "" : "animation: row  " + list.tableData.length + "s linear infinite;"
			$(".monitor .marquee").hover(() => {
				document.getElementById("tableList").style.animationPlayState = 'paused'
			})
			$(".monitor .marquee").mouseleave(() => {
				document.getElementById("tableList").style.animationPlayState = 'running'
			})
		})
	})
}


// 工具函数
// 排序 
function sort(vals, func, reverse) {
	vals.sort(func)
	if (reverse) vals.reverse()
}
//显示
function extension(chart2) {

	chart2.on('mouseover', function (e) {
		const component = e.componentType;
		const value = e.value;
		const offsetX = e.event.offsetX;
		const offsetY = e.event.offsetY;
		if (component === 'series') {
			$('.bar2 .chart').find('.echarts_tip').remove();
			$('.bar2 .chart').append(`
                       <div class="echarts_tip" style="bottom:${offsetY}px;left:${offsetX + 55}px;color:#1ca9d4;font-size:8px">
                           ${posiName[e.dataIndex]}(${value})
                       </div>
                   `)
		}
	})

	chart2.on('mouseout', function (e) {
		const component = e.componentType;
		if (component === 'series') {
			$('.bar2 .chart').find('.echarts_tip').remove();
		}
	})

}

function shuffleArray(array, num) {
	let curId = array.length;
	//There remain elements to shuffle
	while (0 !== curId) {
		//Pick a remaining element
		let randId = Math.floor(Math.random() * curId);
		curId -= 1;
		//Swap it with the current element.
		let tmp = array[curId];
		array[curId] = array[randId];
		array[randId] = tmp;
	}
	return array.slice(0, num);
}
// 随机颜色
function getRandom() {
	return 'rgb(' + [
		Math.round(Math.random() * 200 + 55),
		Math.round(Math.random() * 200 + 55),
		Math.round(Math.random() * 200 + 55)
	].join(',') + ')';
}
// 分组json
function groupBy(arr, field) {
	var map = {},
		dest = [];
	for (var i = 0; i < arr.length; i++) {
		var ai = arr[i];
		if (!map[ai[field]]) {
			dest.push({
				field: ai[field],
				data: [ai]
			});
			map[ai[field]] = ai;
		} else {
			for (var j = 0; j < dest.length; j++) {
				var dj = dest[j];
				if (dj.field == ai[field]) {
					dj.data.push(ai)
					break;
				}
			}

		}
	}
	return dest
}
// 取时间交集
function xar(a) {
	//todo
}

// 内联sql
// 获取内联sql
function getSQL(start, end, field) {
	let having = (start != 0 || end != 0 ? ("HAVING SUM(" + field + ") BETWEEN " + start + " AND " + end) : "")
	return "SELECT " + field + " AS NEEDPER,POSINAME,DATE FROM POSIINFO.DATEINFO WHERE POSINAME IN (" + setInner("DATEINFO", ["POSINAME"], [["AND", "LEVEL", "!=", "'实习生'"]], null, null, null, " LIMIT 5", "POSINAME", ["SUM(" + field + ")", "DESC"], having) + ") ";
}
function setInner(tableName, fieldName, whereJson, level, posiName, address, limit, group, order, having) {
	let where = "where true"
	if (whereJson) {
		for (let i = 0; i < whereJson.length; i++) {
			where += " " + whereJson[i][0] + " " + whereJson[i][1] + " " + whereJson[i][2] + " " + whereJson[i][3]
		}
	}
	if (address) {
		where += " AND ADDRESS LIKE '%" + address + "%'"
	}
	if (level) {
		where += " AND LEVEL = '" + level + "'"
	}
	if (posiName) {
		where += " AND POSINAME = '" + posiName + "'"
	}
	if (group) {
		where += " GROUP BY " + group + ""
	}
	if (having) {
		where += " " + having
	}
	if (order) {
		where += " ORDER BY " + order[0] + " " + order[1]
	}
	let fields = "";
	for (let str of fieldName) {
		fields += str + ","
	}
	fields = fields.substring(0, fields.length - 1)

	return "SELECT " + fields + " FROM POSIINFO." + tableName + " " + where + " " + (limit ? limit : "")
}

getArrRandomly = (arr) => {
	var len = arr.length;
	for (var i = len - 1; i >= 0; i--) {
		var randomIndex = Math.floor(Math.random() * (i + 1));
		var itemIndex = arr[randomIndex];
		arr[randomIndex] = arr[i];
		arr[i] = itemIndex;
	}
	return arr;
}