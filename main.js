"use strict";

const bachelorConfig = {
    sheetName: 'Tabelle1',
    headerRange: 'A1:L1',
    valueRange: 'A2:L82',
    xlsx: "imi-lep-ws19.xlsx"
}
const masterConfig = {
    sheetName: 'Tabelle1',
    headerRange: 'A1:L1',
    valueRange: 'A85:L106',
    xlsx: "imi-lep-ws19.xlsx"
}

const planungWS20 = {
    sheetName: 'Gesamt',
    headerRange: 'A1:W1',
    valueRange: 'A2:W90',
    xlsx: "FB4-service-export-Lehrplanung_08.05.2020_WS20.xls"

}

const xlsx2ModuleList = require("./xlsxScanner").xlsx2ModuleList
const htw2uas = require("./schemaConverter").htw2uas;
const groupModules = require("./schemaConverter").groupModules;
const extractAndMap =  require("./schemaConverter").extractAndMap;
const bachelor = xlsx2ModuleList(bachelorConfig)
const master = xlsx2ModuleList(masterConfig)
const ws19 = xlsx2ModuleList(planungWS20)
//console.log(bachelor)
//console.log(master)

//const bachelorUAS = bachelor.map(m => htw2uas(m)).reduce(groupModules,{})
//console.log(bachelorUAS)
const fieldMapping = {
    'Sem. von': 'semester',
    'B / M': 'bm',
    name: 'name',
    teacher: 'teacher',
    Modulverantwortlicher: 'responsible'
}
const all = bachelor.concat(master).concat(ws19).map(m => htw2uas(m)).reduce(groupModules,{})
console.log(all.B1)
const listWS19 = extractAndMap(all,
    fieldMapping)
//console.log(listWS19)
//console.log(all.WT1)
for (const code in listWS19){
    const m = listWS19[code]
   // console.log("%s; %s; %s; %s %s; %s",m.bm,code,m.name,m.teacher.firstName,m.teacher.lastName,m.responsible)
    console.log([m.bm,code,m.name,m.teacher.firstName+ " "+ m.teacher.lastName,m.responsible].join(", "))
}

//console.log(ws19)

//const util = require("util")
//for (const m of bachelorUAS){
//    console.log(util.format("|%s | %s | %s %s |",m.code, m.name, m.teacher.firstName, m.teacher.lastName))
//}
//for (const code of imiB){
//    m = code[0]
//    console.log(util.format("|%s | %s | %s %s |",m.code, m.name, m.teacher.firstName, m.teacher.lastName))
//}
