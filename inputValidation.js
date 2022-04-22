const format = require("date-fns/format");
module.exports = {
    formatDate: function (inputDate) {
        let dateArray = inputDate.split("/");
        let day = parseInt(dateArray[0], 10);
        let month = parseInt(dateArray[1], 10) - 1;
        let year = parseInt(dateArray[2], 10);

        let outputDate = new Date(year, month, day);
        return outputDate;
    },
    setCsvFromInput: function (inputData, i) {
        let from = inputData[i]['From'];
        return from;
    },
    setCsvToInput: function (inputData, i) {
        let to = inputData[i]['To'];
        return to;
    },
    setJsonFromInput: function (inputData, i) {
        let from = inputData[i]['FromAccount'];
        return from;
    },
    setJsonToInput: function (inputData, i) {
        let to = inputData[i]['ToAccount'];
        return to;
    }
}