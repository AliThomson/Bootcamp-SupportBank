const fs = require("fs");
const csvToObj = require('csv-to-js-parser').csvToObj;
const xml2js = require('xml2js');
//const parser = new xml2js.Parser({ attrkey: "ATTR" });
const convert = require('xml-js');

module.exports = {
    loadCsvData: function (accountData) {
        let inputData = csvToObj(accountData);
        return inputData;
    },
    loadJsonData: function (accountData) {
        let inputData = JSON.parse(accountData);
        return inputData;
    },
    loadXmlData: function (accountData) {
         let fullInputData = convert.xml2js(accountData, {compact: false});
         //parser.parseString(accountData, (error) => {
            // if(error !== null) {
            //     console.log(error);
            // }});
        let inputData = fullInputData.elements[0].elements;

        return inputData;
    }

}