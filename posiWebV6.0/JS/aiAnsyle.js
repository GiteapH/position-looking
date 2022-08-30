let map = new Map()

let selectMap = new Map()
//职位关键字聚类关系数据源


function posiNeedAI(chart) {
  new Promise((resolve) => {
    ajaxModule("SELECT CROWD,CLSET,REQUEST FROM POSIINFO.CONN " +
      "INNER JOIN POSIINFO.CX1 ON  CX1.CLUSTERS=CONN.CLUSTERS " +
      "INNER JOIN POSIINFO.CX2 ON CX2.TOPIC= CONN.TOPIC").then((ret) => {

        fillAITable(ret[0], chart)
        resolve(ret[0])
      })
  })
}

// 关系重要程度矩阵
function fillAITable(orai, chart) {
  let mapX = new Map()
  let mapY = new Map()
  let ix = 1, iy = 1, min = 100, max = -1
  for (let i = 0; i < orai.length; i++) {
    let tempJson = orai[i]
    let X = tempJson.CLSET
    let Y = tempJson.CROWD

    if (!mapX.has(X)) {
      table.tableData[0].push(X)
      mapX.set(X, ix++)
    }
    if (!mapY.has(Y)) {
      mapY.set(Y, iy)
      table.tableData.push(new Array(6))
      table.tableData[iy++][0] = Y
    }
    max = Math.max(max, parseFloat(tempJson.REQUEST) * 100)
    min = Math.min(min, parseFloat(tempJson.REQUEST) * 100)
  }
  let floor = (max - min) / 5

  for (let i = 0; i < orai.length; i++) {
    let num = parseFloat(orai[i].REQUEST * 100).toFixed(1)
    let X = mapX.get(orai[i].CLSET)
    let Y = mapY.get(orai[i].CROWD)
    if (num < min + floor * 1) {
      table.tableData[Y][X] = '⚝'
    }
    else if (num < min + floor * 2) {
      table.tableData[Y][X] = '⚝'.repeat(2)
    }
    else if (num < min + floor * 3) {
      table.tableData[Y][X] = '⚝'.repeat(3)
    }
    else if (num < min + floor * 4) {
      table.tableData[Y][X] = '⚝'.repeat(4)
    }
    else {
      table.tableData[Y][X] = '⚝'.repeat(5)
    }
  }

  HorizontalBar(mapX, mapY, orai, chart)
}


function HorizontalBar(mapX, mapY, data, myChart) {
  let option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'line' // 'shadow' as default; can also be 'line' or 'shadow'
      }
    },
    grid: {
      left: '18%',
      right: '0',
      containLabel: true
    },
    legend: {
      left: 'center',
      itemWidth: 10,//图例的宽度
      itemHeight: 10,//图例的高度
      textStyle: {//图例文字的样式
        color: '#ccc',
        fontSize: 16
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: { //调整文字倾斜角度和颜色
        interval: 0,
        rotate: 45,
        margin: 2,
        textStyle: {
          color: "#fff"
        }
      },
      splitLine: false
    },
    yAxis: {
      type: 'category',
      data: ["大数据算法工程师", "大数据开发工程师", "大数据运维工程师", "大数据架构师"],
      axisLabel: { //调整文字倾斜角度和颜色
        interval: 0,
        margin: 2,
        textStyle: {
          color: "#fff"
        }
      }
    },
    series: [

      {
        name: '大数据平台',
        type: 'bar',
        barWidth: 15,
        stack: 'total',
        itemStyle: {
          barBorderRadius: [10, 10, 10, 10] // 统一设置四个角的圆角大小,
        },
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: []
      },
      {
        name: '程序设计',
        type: 'bar',
        barWidth: 15,
        stack: 'total',
        itemStyle: {
          barBorderRadius: [10, 10, 10, 10] // 统一设置四个角的圆角大小
        },
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: []
      },
      {
        name: "机器学习",
        type: 'bar',
        barWidth: 15,
        stack: 'total',
        itemStyle: {
          barBorderRadius: [10, 10, 10, 10] // 统一设置四个角的圆角大小
        },
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: []
      },
      {
        name: '大数据技术',
        type: 'bar',
        barWidth: 15,
        stack: 'total',
        itemStyle: {
          barBorderRadius: [10, 10, 10, 10] // 统一设置四个角的圆角大小
        },
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: []
      },
      {
        name: '算法',
        type: 'bar',
        barWidth: 15,
        stack: 'total',
        itemStyle: {
          barBorderRadius: [10, 10, 10, 10] // 统一设置四个角的圆角大小
        },
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: []
      }
    ]
  };
  for (let i = 0; i < data.length; i++) {
    let num = parseFloat(data[i].REQUEST * 100).toFixed(1)
    let X = mapX.get(data[i].CLSET)
    let Y = mapY.get(data[i].CROWD)
    option.series[X - 1].data[Y - 1] = num
  }

  
  // 3. 把配置项给实例对象
  myChart.setOption(option);
  // 4. 让图表跟随屏幕自动的去适应
  window.addEventListener("resize", function () {
    myChart.resize();
  });


}

function cloudWord(data, charts) {
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

  for (var i = 0; i < data[0].length; i++) {
    var dataJson = data[0][i].SKILLS.split(" ")

    for (let str of dataJson) {
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
        value: 5,
      }) //添加职位名称  
    }
    
    charts.setOption(options,true);
    window.addEventListener("resize", function () {
      charts.resize();
    });
  }
}

function AiInfoAnsyle(data) {
  outter.needper = data[0]
  outter.saleavg = data[1]
}



// 选择框调控
// 生成map获得RESENAME 与 JOBNAME映射

function RESE2JobName() {
  return new Promise(resolve => {
    ajaxModule("SELECT JOBNAME,RESENAME FROM POSIINFO.PREDICT ").then(ret => {
      
      for (let i = 0; i < ret[0].length; i++) {
        let RESENAMES = ret[0][i].RESENAME.split(" ")
        let j = 0
        for (let RESENAME of RESENAMES) {
          map.set(RESENAME, ret[0][i].JOBNAME)
          if (!selectMap.has(ret[0][i].JOBNAME)) {
            selectMap.set(ret[0][i].JOBNAME, [{
              "label":RESENAME,
              "value":j
            }])
          } else {
            selectMap.get(ret[0][i].JOBNAME).push({
              "label":RESENAME,
              "value":j
            })
          }
          j++
        }
      }

      
      resolve([map, selectMap])
    })
  })
}


function whenChange(posiname, map) {
  return new Promise(resolve => {
    ajaxModule("SELECT *  FROM POSIINFO.PREDICT WHERE JOBNAME='" + map.get(posiname) + "'").then(ret => {
      resolve(ret)
    })
  })
}

function reloadAiAnsyle(posiName) {
  return new Promise(resolve=>{
    if (map.size == 0) {
      RESE2JobName().then(maps => {
        whenChange(posiName, maps[0]).then(data => {
          
          // skills 的 Charts
          skills.posiname = posiName + " "
          outter.posiname = posiName + " "
          cloudWord(data, echarts.init(document.querySelector(".skills .chart")))
          AiInfoAnsyle([data[0][0].COUNT, data[0][0].SALARY])
          resolve(maps)
        })
      })
    }else{
      whenChange(posiName, map).then(data => {
        
        // skills 的 Charts
        skills.posiname = posiName + " "
        outter.posiname = posiName + " "
        cloudWord(data, echarts.init(document.querySelector(".skills .chart")))
        AiInfoAnsyle([data[0][0].COUNT, data[0][0].SALARY])
      })
    }
  })
}