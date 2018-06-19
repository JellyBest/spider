const request = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const Entities = require('html-entities').XmlEntities;

var express = require('express');
var app = express();
// var fs = require("fs");
// var read_xlsx = require("read_xlsx");
var symbols =require("./excel.js");

const weather_url = 'http://rss.weather.gov.hk/rss/CurrentWeather_uc.xml';
const WEATHER_WARN_URL = 'http://www.gupiaodadan.com/buy-sell-601336';
//连接数据库
var mysql = require('mysql');
var connection = mysql.createConnection({
  host      : 'localhost',
  user      : 'root',
  password  : 'jelly520',
  database  : 'stock_info'
});
connection.connect(err => {
  if(err){
    console.log(err)
    return;
  }
    console.log("connected!")
});
const entities = new Entities();

const charset = require('superagent-charset');
const superagent = require('superagent');
charset(superagent);
let errCode = [];
function getAPILoad(symbol){
  //  errCode = [];
  let url = 'http://www.gupiaodadan.com/buy-sell-' + symbol;
  superagent.get(url).charset('gb2312').end((err, res) => {
    if(err){
      // console.log(symbol,err)
      errCode.push(symbol)
      console.log(errCode,'err');
    }else{
      let code = symbol;
      // console.log('--------------->', res.text);
      const $ = cheerio.load(res.text, {
        decodeEntities: true,
      });
      // let r = res.data.decode
      // let result = encodeURIComponent(res.data)
      // console.log("---------------",res.data,"test")
      // let t = entities.decode($('.tablecontent tr').eq(1).find('td').eq(1).text())
      // console.log(t,"test")
      let allValues = [];
      $('.tablecontent tr').each(function(){
        // console.log($(this).index())
        
        if($(this).index() > 0 ){
          let params = [];
          
          let text = ""; 
          let temp = [];
          $(this).find('td').each(function(){
            // text += $(this).text().replace(/\s/g, '') + " "
            if($(this).text() == '买入'){
              temp.push('buy');
            }else if($(this).text() == '卖出'){
              temp.push('sell');
            }
            else if(!$(this).text()){
              temp.push(null);
            }
            else{
              temp.push($(this).text().replace(/\s/g, ''));
            }
            
          })
          // console.log(temp,"temp")
          params = [code,temp[0],temp[5],temp[1],temp[2],temp[3],temp[4],temp[6],temp[7]];
          allValues.push(params);
          // insertStock(params);
          // text = text.replace(/\s/g, '')
          // console.log(text)
        }
    });
    insertStock([allValues]);
    }
    
  })
}
// console.log(symbols,'s')
// let symbols = [];
// //读取excel文件
// var excelBuffer = fs.readFileSync("./op.xlsx");

// read_xlsx.getWorkbook(excelBuffer).then(function(workbook){
// 	var sheetNames = workbook.getSheetNames();
// 	console.log(sheetNames);
// 	workbook.getSheet("Sheet2").then(function(sheet){
// 		var rowLen = sheet.getRows();
// 		var cellLen = sheet.getColumns();
//     console.log('rowLen',rowLen,'celllen',cellLen)
// 		for(var i=1; i<rowLen; i++) {
//       // let oneSheet = sheet.findCell("A"+i);
//       // let oneStr = oneSheet.getContents();
//       // console.log(oneStr);
// 			// for(var k=0; k<cellLen; k++) {
// 				var cell = sheet.getCell(i,0);
// 				// //If the cell is empty, it is possible that the cell does not exist return null!
// 				if(cell !== null) {
// 					console.log(cell.getName()+":"+cell.getContents())
//           symbols.push(cell.getContents());
// 				}
        
// 			// }
// 		}
//     console.log(symbols);
    for(let i = 0; i<symbols.length; i++){
      getAPILoad(symbols[i]);
    }
    // console.log(errCode,'err');
    // for(let i = 0; i<errCode.length; i++){
    //   getAPILoad(errCode[i]);
    // }
// getAPILoad('002567');
// 		// find cell by name
// 		// var a1Sheet = sheet.findCell("A10");
// 		// var a1Str = a1Sheet.getContents();
// 		// console.log(a1Str)
// 	})["catch"](function(err) {
// 		console.error(err.stack);
// 	});
// });



//插入数据
function insertStock(params){
//  console.log('param',params);
 let addStock = 'insert into stocks(code,date,op,first,last,high,low,price,roi) values ?';
  connection.query(addStock,params,function(error,rows,fields){
    if(error){
      console.log(error);
      return;
    }
    console.log(rows);
  });
};


//关闭连接
// connection.end( error => {
//   if(error){
//     console.log(error);
//     return;
//   }
//   console.log( 'connection end');
// })