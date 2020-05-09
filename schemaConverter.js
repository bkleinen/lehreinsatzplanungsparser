"use strict"

// https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
//import _ from "lodash" // Import the entire lodash library
// import { clone, cloneDeep } from "lodash" // Alternatively: Import just the clone methods from lodash

const _ = require('lodash')
const codeNameRegex = /\s*(\D{1,4}\d\d?(\.\d)?)(.+)/

module.exports.htw2uas = function (moduleHTW) {
    const uas = _.cloneDeep(moduleHTW)
    const codeName = moduleHTW['LV Name']
    const codeNameArray = codeName.match(codeNameRegex)
    if ((typeof codeNameArray === 'undefined') || (codeNameArray == null) || codeNameArray.length < 3) {
        console.error("could not parse" + codeName)
        //console.log(codeName)
    } else {
        uas.code = codeNameArray[1]
        uas.name = codeNameArray[3]
        delete uas['LV Name']
    }

    uas.teacher = {
        lastName: moduleHTW.Dozentname,
        firstName: moduleHTW.Dozentvorname,
        role: moduleHTW.Status
    }
    delete uas['Dozentname']
    delete uas['Dozentvorname']
    delete uas['Status']


    uas.semester = moduleHTW['Sem. von']

    //console.log(uas)
    return uas;
}

module.exports.groupModules = function (modules, module) {
    const code = module.code
    if (!(code in modules)) {
        modules[code] = {code: code, modules: []}
        modules[code] = { modules: []}
    }
    modules[code].modules.push(module)
    return modules
}

module.exports.extractAndMap = function(allModules,fieldMap){
    const result = {}
    for (const code in allModules){
        //console.log(code)
        const list = allModules[code].modules
        const fieldsForModule = {}
        for (const sourceField in fieldMap) {
            const targetField = fieldMap[sourceField]
            const module = list.find(m => {
                return !(m[sourceField] === undefined)
            })
            if (module === undefined){
                console.log("Module " + code+ ":no field with name " + sourceField)
                //console.log(JSON.stringify(list))
            } else {
                fieldsForModule[targetField] = module[sourceField]
            }
        }
        result[code] = fieldsForModule
    }
    return result
}