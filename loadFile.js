const csvToObj = require('csv-to-js-parser').csvToObj;
const convert = require('xml-js');

exports.loadData = function (accountData, fileType) {
    if (fileType === 'csv') {
        return inputData = csvToObj(accountData);
    } else if (fileType === 'json') {
        return inputData = JSON.parse(accountData);
    } else if (fileType === 'xml') {
        const fullInputData = convert.xml2js(accountData, {compact: false});
        return inputData = fullInputData.elements[0].elements;
    } else {
        console.log("Please enter a valid file type (csv, json or xml)");
    }
}