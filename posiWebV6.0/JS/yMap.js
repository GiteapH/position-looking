// 地区个数
// // 地区个数
// const map = new Map()
// getAllInfo(name.replaceAll(/[省|市]/g,"")).then((ret)=>{
// 	for(let i=0;i<ret.length;i++){
// 		map.set(ret[i].PROVINCE,ret[i].COUNT)
// 	}
// })
// 初始化


reloadAllPosicount(0, 0);
var alladcode
//地图模块
(function () {
	var myChart = echarts.init(document.querySelector(".map .chart"));
	//各省份的地图json文件
	loadMap('100000', '全国', myChart); //初始化全国地图
	var timeFn = null;
	//单击切换到省级地图，当mapCode有值,说明可以切换到下级地图
	myChart.on('click', function (params) {

		clearTimeout(timeFn);
		//由于单击事件和双击事件冲突，故单击的响应事件延迟250毫秒执行
		timeFn = setTimeout(function () {
			var name = params.name; //地区name
			let clickRegionCode = alladcode.filter(areaJson => {
				return areaJson.properties.name === params.name
			})[0].properties.adcode;
			loadMap(clickRegionCode, name, myChart).then((ret) => {
				if (ret == true) {
					preCode.push([clickRegionCode, params.name])
				};
			})
			reloadPosicount(name.replaceAll(/[省|市|自治区|壮族自治区|回族自治区|维吾尔族自治区]/g, "").substring(0,2), select.start, select.end)
			tempAddress = name.replaceAll(/[省|市|自治区|壮族自治区|回族自治区|维吾尔族自治区]/g, "").substring(0,2)
			return
		}, 250);
	});


	// 绑定双击事件，返回全国地图
	myChart.on('dblclick', function (params) {
		//当双击事件发生时，清除单击事件，仅响应双击事件
		clearTimeout(timeFn);
		if (preCode.length != 1) {
			preCode.pop()
			let codeAdd = preCode[preCode.length - 1]
			loadMap(codeAdd[0], codeAdd[1], myChart);
			reloadPosicount(codeAdd[1].replaceAll(/[省|市|自治区|壮族自治区|回族自治区|维吾尔族自治区]/g, "").substring(0,2), select.start, select.end)
			tempAddress = codeAdd[1].replaceAll(/[省|市|自治区|壮族自治区|回族自治区|维吾尔族自治区]/g, "").substring(0,2)

		} else {
			tempAddress = '全国'
		}
	});
	// 监听浏览器缩放，图表对象调用缩放resize函数
	window.addEventListener("resize", function () {
		myChart.resize();
	});
})();

/**
获取对应的json地图数据，然后向echarts注册该区域的地图，最后加载地图信息
@params {String} mapCode:json数据的地址
@params {String} name: 地图名称
*/
function loadMap(mapCode, name, myChart) {
	return new Promise((resolve) => {
		if (preCode.length <= 2) {
			$(".container").show()
			$("#loadAdd").text("正在获取 " + name + " 地图数据")
			$.get('http://' + ip + '/getMap?code=' + mapCode, function (data) {
				data = JSON.parse(data)
				alladcode = data.features
				var allData = []

				if (data) {
					let proc = []
					for (var i = 0; i < data.features.length; i++) {
						let tName = data.features[i].properties.name
						if (tName != "") {
							proc.push(new Promise((resolve) => {
								ajaxModule("SELECT SUM(NEEDPER) AS COUNT FROM POSIINFO.ADDRESSDINFO WHERE ADDRESS LIKE '%" + tName.replaceAll(/[省|市|自治区|壮族自治区|回族自治区|维吾尔族自治区]/g, "") + "%' GROUP BY ADDRESS")
									.then((ret) => {
										$("#loadAdd").text('加载' + tName + "中..")
										let count = 0
										for (let e = 0; e < ret[0].length; e++) {
											count += ret[0][0].COUNT == null ? 0 : parseInt(ret[0][0].COUNT)
										}

										allData.push({
											name: tName,
											value: ((select.start == 0 && select.end == 0) || (count >= select.start && count <= select.end)) ? count : 0
										})
										resolve(allData)
									})
							}))
						}
					}
					Promise.all(proc).then((res) => {
						$(".container").hide()
						let Data = res[0]
						let max = 0
						echarts.registerMap(name, data);
						for (let data in Data) {
							max = Math.max(max, Data[data].value)
						}

						var option = {
							layoutCenter: ['50%', '70%'],
							layoutSize: 280, //位置
							title: {
								text: name,
								left: 'center',

								textStyle: {
									color: "white",
									fontSize: 30,
									fontFamily: 'sans-serif'
								}
							},
							tooltip: {
								show: true,
								formatter: function (params) {
									if (params.data) return params.name + '：' +
										params.data['value']
								},
							},
							visualMap: {
								type: 'continuous',
								text: ['', '招聘数量'],
								showLabel: true,
								left: '50',
								min: 0,
								max: max,
								inRange: {
									color: ['rgba(135,206,235,0.75)', 'rgba(72,61,139,0.8)'
									]
								},
								splitNumber: 0,
								bottom: 100,
								textStyle: {
									color: "#7986ff"
								}
							},
							series: [{
								name: 'MAP',
								type: 'map',
								map: name,
								selectedMode: false, //是否允许选中多个区域
								label: {
									normal: {
										show: true
									},
									emphasis: {
										show: true
									}
								},
								zoom: 2, //当前视角的缩放比例
								roam: true, //是否开启平游或缩放
								scaleLimit: { //滚轮缩放的极限控制
									min: -1,
									max: 80
								},

								data: Data
							}]
						};
						myChart.setOption(option, true);
					})
					resolve(true)
				}
			}).fail(() => {
				resolve(false)
			})
		}
	})
}