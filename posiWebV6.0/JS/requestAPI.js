// 获取url中的端口号
function getPort() {
	return window.location.port
}

const ip =  '119.96.188.91:32643/posiWeb'/*这边改ip*/
console.log(ip)
const getAddress = function (address, bet) {
	var json = { "sql": "select * from POSIINFO.PROVINCE where PROVINCE LIKE '%" + address + "%' " + (bet ? bet : "") }
	return new Promise((resolve) => {
		$.ajax({
			data: JSON.stringify(json),
			url: "http://" + ip + "/doSql",
			type: "POST",
			dataType: "json",
			contentType: 'application/json;charset=utf-8',
			Headers: {
				"Access-Control-Allow-Origin": "*"
			},
			success(res) {
				resolve(res)
			},
			error(err) {
				console.log(json.sql)
				console.log(err)
			}
		})
	})
}

const getPosiName = function (address, level) {
	let sql = address == '全国' ? ('select POSINAME FROM POSIINFO.ALLDINFO' + (level ? " WHERE LEVEL = '" + level + "'" : "") + ' ORDER BY NEEDPER DESC LIMIT 500') : ("SELECT POSINAME from POSIINFO.ADDRESSDINFO WHERE ADDRESS LIKE '%" + address + "%'" + (level ? " AND LEVEL = '" + level + "'" : "") + " ORDER BY NEEDPER DESC limit 500")
	console.log(sql)
	return new Promise((resolve) => {
		ajaxModule(sql).then((ret) => {
			console.log(ret)
			resolve(ret[0])
		})
	})
}

const getInfoByAddress = function (tableName, fields, posiName, address, level) {
	var str = "";
	for (var s of fields) {
		str += s + ","
	}
	str = str.substring(0, str.length - 1)
	var json = !posiName ? { "sql": "select " + str + " from POSIINFO." + tableName + " where address LIKE '%" + address + "%'" + (level ? " AND LEVEL='" + level + "'" : "") } : { "sql": "select " + str + " from POSIINFO." + tableName + " where address LIKE '%" + address + "%'" + (level ? " AND LEVEL='" + level + "'" : "") + (posiName ? " AND POSINAME='" + posiName + "'" : "") }
	return new Promise((resolve) => {
		$.ajax({
			data: JSON.stringify(json),
			url: "http://" + ip + "/doSql",
			type: "POST",
			dataType: "json",
			Headers: {
				"Access-Control-Allow-Origin": "*"
			},
			contentType: 'application/json;charset=utf-8',
			success(res) {
				console.log()
				resolve(res)
			}, error(err) {
				console.log(json.sql)
				console.log(err)
			}
		})
	})
}

const getInfoWithFields = function (tableName, fields) {
	return new Promise((resolve) => {
		$.ajax({
			data: getFieldsArray(fields, tableName),
			url: "http://" + ip + "/getFields",
			type: "POST",
			dataType: "json",
			contentType: 'application/json;charset=utf-8',
			Headers: {
				"Access-Control-Allow-Origin": "*"
			},
			success(res) {
				resolve(res)
			}, error(err) {
				console.log(getFieldsArray(fields, tableName))
				console.log(err)
			}
		})
	})
}

function getFieldsArray(fields, tableName) {
	return JSON.stringify({
		"fields": fields,
		"tableName": [tableName]
	})
}

function ajaxModule(sql, doJob) {
	console.log(sql)
	return new Promise(function (resolve) {
		var json = { "sql": sql }
		$.ajax({
			data: JSON.stringify(json),
			url: "http://" + ip + "/doSql",
			type: "POST",
			dataType: "json",
			contentType: 'application/json;charset=utf-8',
			Headers: {
				"Access-Control-Allow-Origin": "*"
			},
			success(res) {
				if (doJob)
					resolve([doJob.callback(doJob.field, res)])
				else
					resolve([res])
			}, error(err) {
				console.log(sql)
				console.log(err)
			}
		})
	})
}