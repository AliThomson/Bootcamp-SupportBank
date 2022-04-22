const fs = require("fs");
const csvToObj = require('csv-to-js-parser').csvToObj;
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });

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
        let inputData = parser.parseString(accountData);
        return inputData;
    }
}