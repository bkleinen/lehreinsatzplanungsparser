"use strict"

const fs = require('fs');
const XLSX = require('xlsx');
/* equivalent to `var wb = XLSX.readFile("sheetjs.xlsx");` */

module.exports.xlsx2ModuleList =
    function xlsx2ModuleList(config) {
        console.log("config: "+JSON.stringify(config))
        var buf = fs.readFileSync(config.xlsx);
        var wb = XLSX.read(buf, {type: 'buffer'});
        const sheet = wb.Sheets[config.sheetName]
        if (sheet == undefined) {
            console.log("error: could not find sheet " + config.sheetName + " in file "+ config.xlsx)
        }
        //console.log(wb);
        //console.log(wb);
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const rangeRegex = /(\D+)(\d+):(\D+)+(\d+)/
        const headerRangeParts = config.headerRange.match(rangeRegex) // ['A1:L1', 'A','1','L','1']
        const i = alphabet.indexOf(headerRangeParts[3])
        const columnNames = Array.from(alphabet.substring(0, i + 1))
        const headerRow = headerRangeParts[2]
        const headers = columnNames.map(c => {
            const field = c + headerRow
            //console.log(field)
            return {
                title: sheet[field].v,
                column: c
            }
        })


        const range = config.valueRange.match(rangeRegex)
        const result = []
        const fromRow = parseInt(range[2]), toRow = parseInt(range[4])
        for (var row = fromRow; row <= toRow; row++) {
            const rowObject = {}
            for (var header of headers) {
                const field = header.column + row
                const sheetObject = sheet[field]
                if (typeof sheetObject !== 'undefined') {
                    rowObject[header.title] = sheet[field].v
                } else {
                    //console.log("undefinded: " + field)
                }
            }
            result.push(rowObject)
        }
        return result
    }