const fs = require("fs");
const csvToObj = require('csv-to-js-parser').csvToObj;

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
        let inputData = [];
        return inputData;
    }
}