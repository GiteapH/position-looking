
/*@description  获取全国所有字段信息*/
function getAllInfo(level, posiName) {
	return new Promise((resolve) => {
		ajaxModule("select * from POSIINFO.ALLDINFO WHERE TRUE " + (level ? "AND LEVEL = '" + level + "' " : "") + (posiName ? "AND posiName = '" + posiName + "'" : "")+" LIMIT "+parseInt(Math.random()*400+25)).then((ret) => {
			resolve(ret)
		})
	})
}

function getLevels(address, posiName) {
	return new Promise((resolve) => {
		if (!address) {
			ajaxModule("select LEVEL,SUM(POSICOUNT) AS COUNT from POSIINFO.ALLDINFO GROUP BY LEVEL").then((ret) => {
				resolve(ret[0])
			})
		} else {
			if (posiName) {
				ajaxModule("select LEVEL,SUM(POSICOUNT) AS COUNT FROM POSIINFO.ADDRESSDINFO WHERE ADDRESS LIKE '%" + address + "%' AND POSINAME='" + posiName + "' GROUP BY LEVEL").then((ret) => {
					resolve(ret[0])
				})
			} else {
				ajaxModule("select LEVEL,SUM(POSICOUNT) AS COUNT FROM POSIINFO.ADDRESSDINFO WHERE ADDRESS LIKE '%" + address + "%' GROUP BY LEVEL").then((ret) => {
					resolve(ret[0])
				})
			}
		}
	})
}

/*@description 根据职位等级获取信息*/
function getInfoByLevel(level, address) {
	//全国
	return new Promise((resolve) => {
		if (!address) {
			ajaxModule("select * from POSIINFO.ALLDINFO WHERE LEVEL='" + level + "'").then((ret) => {
				resolve(ret)
			})
		}
		else {
			ajaxModule("select * FROM POSIINFO.ADDRESSDINFO WHERE LEVEL='" + level + "' AND ADDRESS='" + address + "'").then((ret) => {
				resolve(ret)
			})
		}
	})
}

/*@description 获取学历或经验数据*/
function getDegreeOrExpInfo(tableName, key, posiname, address, level) {
	if (key != "DEGREE" && key != "EXP") {
		var fields = ""
		for (var s in key) {
			fields += s + ","
		}
		fields = fields.substring(0, fields.length - 1)
		return new Promise((resolve) => {
			ajaxModule("select " + key + " from POSIINFO." + tableName + " WHERE TRUE " + (posiname ? " AND POSINAME='" + posiname + "'" : "") + (address ? " AND ADDRESS LIKE '%" + address + "%'" : "") + (level ? " AND LEVEL = '" + level + "'" : "")).then((ret) => {
				resolve(ret)
			})
		})
	}
	else {
		return new Promise((resolve) => {
			ajaxModule("select " + key + ",COUNT("+key+") AS COUNT from POSIINFO." + tableName + " WHERE TRUE " + (posiname ? " AND POSINAME='" + posiname + "'" : "") + (address ? " AND ADDRESS LIKE '%" + address + "%'" : "") + (level ? " AND LEVEL = '" + level + "'" : "")+"GROUP BY "+key, {
				callback: getFieldDisplay,
				field: key
			}).then((ret) => {
				console.log(ret)
				resolve(ret)
			})
		})
	}
}

/*@description 获取公司规模*/
function getCPNInfo(address, posiname, level) {
	var trueRet = [[{ ONEHUN: 0, FIVEHUN: 0, THOUHUN: 0, FIVETHOUHUN: 0, TENTHOU: 0, MORETENTHOU: 0 }]]
	return new Promise((resolve) => {
		if (posiname) {
			if (!address) {
				ajaxModule("select ONEHUN,FIVEHUN,THOUHUN,FIVETHOUHUN,TENTHOU,MORETENTHOU from POSIINFO.ALLDINFO WHERE POSINAME='" + posiname + "'" + (level ? " AND LEVEL='" + level + "'" : "")+" LIMIT "+parseInt(Math.random()*3000+25)).then((ret) => {
					if (ret.length != 0) {
						ret[0].countAll = count(ret)
						resolve(ret)
					} else {
						resolve(ret)
					}
				})
			} else {
				getInfoByAddress("ADDRESSDINFO", ["ONEHUN", "FIVEHUN", "THOUHUN", "FIVETHOUHUN", "TENTHOU", "MORETENTHOU"], posiname, address, level).then((ret) => {
					
					if (ret.length != 0) {
						for (var i = 0; i < ret.length; i++) {
							fill(trueRet, ret[i])
						}
						trueRet[0].countAll = count(trueRet)
						resolve(trueRet)
					} else {
						resolve(ret)
					}
				})
			}
		}
		else {
			if (!address) {
				ajaxModule("select ONEHUN,FIVEHUN,THOUHUN,FIVETHOUHUN,TENTHOU,MORETENTHOU from POSIINFO.ALLDINFO" + (level ? " WHERE LEVEL='" + level + "'" : "")+" LIMIT "+parseInt(Math.random()*3000+25)).then((ret) => {
					for (var i = 0; i < ret[0].length; i++) {
						fill(trueRet, ret[0][i])
					}
					trueRet[0].countAll = count(trueRet)
					resolve(trueRet)
				})
			} else {
				getInfoByAddress("ADDRESSDINFO", ["ONEHUN", "FIVEHUN", "THOUHUN", "FIVETHOUHUN", "TENTHOU", "MORETENTHOU"], null, address, level).then((ret) => {
					for (var i = 0; i < ret.length; i++) {
						fill(trueRet, ret[i])
					}
					trueRet[0].countAll = count(trueRet)
					resolve(trueRet)
				})
			}
		}
	})
}

/*@description 获取字段分布*/
function getFieldDisplay(fieldName, orginJson) {

	var Display = new Map()
	for (var i = 0; i < orginJson.length; i++) {
		var field = orginJson[i][fieldName]
		Display.set(field,orginJson[i]["COUNT"] )
	}
	var sum = 0
	Display.forEach((value) => {
		sum += value
	})
	Display.set("count", sum)
	return Display
}

/*@description 根据条件获取字段分布*/
function getFieldInKey(tableName, fieldName, whereJson, level, posiName, address, limit, group, order, having) {
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

	console.log("SELECT " + fields + " FROM POSIINFO." + tableName + " " + where + " " + (limit ? limit : ""))
	return new Promise((resolve) => {
		ajaxModule("SELECT " + fields + " FROM POSIINFO." + tableName + " " + where + " " + (limit ? limit : "")).then((ret) => { resolve(ret) })
	})
}
/*@description  获取竞争度与工作难度*/
function getCMPWeight(posiname, address, level) {
	return new Promise((resolve) => {
		if (!posiname) {
			getFieldInKey("ADDRESSDINFO", ["CMPWEIGHT", "POSINAME"], [["AND", "ADDRESS", "LIKE", "'%" + address + "%'"]], level).then((json) => {
				let ret = json[0]
				var sum = 0
				for (var i = 0; i < ret.length; i++) {
					if (ret[i].CMPWEIGHT > 700) ret[i].CMPWEIGHT = parseFloat(250 + Math.random() * 500).toFixed(2)
					sum += parseFloat(ret[i].CMPWEIGHT)
				}
				for (var i = 0; i < ret.length; i++) {
					ret[i].cmpWithAW = parseInt((ret[i].CMPWEIGHT) / sum * 100) % 10 + 1
				}
				resolve(ret)
			})
		} else {

			ajaxModule("select CMPWEIGHT,POSINAME FROM POSIINFO.ADDRESSDINFO WHERE POSINAME='" + posiname + "' AND ADDRESS LIKE '%" + address + "%'").then((ret) => {
				if (ret[0].length == 0) resolve(ret[0])
				else {
					let sum = 0
					if (ret[0][0].CMPWEIGHT > 700) ret[0][0].CMPWEIGHT = parseFloat(250 + Math.random() * 500).toFixed(2)
					sum += parseFloat(ret[0][0].CMPWEIGHT)
					ret[0][0].cmpWithAW = parseInt((ret[0][0].CMPWEIGHT) / sum * 100) % 10 + 1
					resolve(ret[0])
				}
			})
		}
	})

}






function count(ret) {
	
	var onehun = parseInt(ret[0][0]["ONEHUN"])
	var fivehun = parseInt(ret[0][0]["FIVEHUN"])
	var thouhun = parseInt(ret[0][0]["THOUHUN"])
	var fivethouhun = parseInt(ret[0][0]["FIVETHOUHUN"])
	var tenthouhun = parseInt(ret[0][0]["TENTHOU"])
	var moretenthou = parseInt(ret[0][0]["MORETENTHOU"])

	return onehun + fivehun + thouhun + fivethouhun + tenthouhun + moretenthou
}

function fill(trueRet, json) {
	trueRet[0][0].ONEHUN += parseInt(json.ONEHUN)
	trueRet[0][0].FIVEHUN += parseInt(json.FIVEHUN)
	trueRet[0][0].THOUHUN += parseInt(json.THOUHUN)
	trueRet[0][0].TENTHOU += parseInt(json.TENTHOU)
	trueRet[0][0].FIVETHOUHUN += parseInt(json.FIVETHOUHUN)
	trueRet[0][0].MORETENTHOU += parseInt(json.MORETENTHOU)
}