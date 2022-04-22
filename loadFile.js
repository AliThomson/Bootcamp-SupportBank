const fs = require("fs");
const csvToObj = require('csv-to-js-parser').csvToObj;

module.exports = {
    loadFile: function (filename) {
        let fileType = filename.split('.').pop();
        let inputData = [];
        if (fileType === 'JSON') {
            //do json stuff
        }
        if (fileType === 'csv') {
            //do csv stuff
            const accountData = fs.readFileSync(filename).toString();
            inputData = csvToObj(accountData);

        }
        if (fileType === 'XML') {
            //do xml stuff
        }
        return inputData;
    }
}