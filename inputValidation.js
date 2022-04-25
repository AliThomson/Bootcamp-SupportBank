const format = require("date-fns/format");
const log4js = require("log4js");
const logger = log4js.getLogger('filename');
module.exports = {
    // Change all these so each file type has one function which takes the inputData and returns an output data object
    setCsvInput: function (inputData, i) {
        let dateFromFile = inputData[i]['Date'];
        let outputDate = formatDate(dateFromFile);

        let amount = parseFloat(inputData[i]['Amount'])
        if (isNaN(amount)) {
            logger.error(`i = ${i}, Amount (${amount}) is not a number on ${inputData[i]['Date']}: from ${inputData[i]['From']} to ${inputData[i]['To']}`)
        } else {

            let outputData = {
                date: outputDate,
                from: inputData[i]['From'],
                to: inputData[i]['To'],
                narrative: inputData[i]['Narrative'],
                amount: amount
            }
            return outputData;
        };
    },

    setJsonInput: function (inputData, i) {
        let dateFromFile = inputData[i]['Date'];
        let outputDate = formatDate(dateFromFile);

        let amount = parseFloat(inputData[i]['Amount']);
        if (isNaN(amount)) {
            logger.error(`i = ${i}, Amount (${amount}) is not a number on ${inputData[i]['Date']}: from ${inputData[i]['FromAccount']} to ${inputData[i]['ToAccount']}`)
        } else {

            let outputData = {
                date: outputDate,
                from: inputData[i]['FromAccount'],
                to: inputData[i]['ToAccount'],
                narrative: inputData[i]['Narrative'],
                amount: amount
            }
            return outputData;
        }
    },
    setXmlInput: function (inputData, i) {
        let outputData = {
            date: inputData[i]['Date'],
            from: inputData[i]['Parties']['From'],
            to: inputData[i]['Parties']['To'],
            narrative: inputData[i]['Description'],
            amount: inputData[i]['Value']
        };
        return outputData;
    }
}

function formatDate(dateFromFile) {
    let outputDate = "";
    if (dateFromFile.includes("/")) {
        let dateArray = dateFromFile.split("/");
        let day = parseInt(dateArray[0], 10);
        let month = parseInt(dateArray[1], 10) - 1;
        let year = parseInt(dateArray[2], 10);
        outputDate = new Date(year, month, day);
    } else {
        outputDate = Date.parse(dateFromFile);
    }

    if (isNaN(outputDate)) {
        logger.error(`Date is not valid (${dateFromFile})`);
    } else {
        outputDate = format(outputDate, 'dd-MM-yyyy');
    }
    return outputDate;
}