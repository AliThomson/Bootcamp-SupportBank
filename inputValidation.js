const format = require("date-fns/format");
const log4js = require("log4js");
const logger = log4js.getLogger('filename');
const moment = require('moment'); // require
moment().format();
module.exports = {
    formatInput: function (fileType, transaction) {
        if (fileType === "csv") {
            let dateFromFile = transaction.Date;
            let outputDate = formatDate(dateFromFile);

            let amount = parseFloat(transaction.Amount)
            if (isNaN(amount)) {
                logger.error(`i = ${i}, Amount (${amount}) is not a number on ${transaction.Date}: from ${transaction.From} to ${transaction.To}`)
            } else {

                let outputData = {
                    date: outputDate,
                    from: transaction.From,
                    to: transaction.To,
                    narrative: transaction.Narrative,
                    amount: amount
                }
                return outputData;
            }
        } else if (fileType === "json") {
            let dateFromFile = transaction.Date;
            let outputDate = formatDate(dateFromFile);

            let amount = parseFloat(transaction.Amount);
            if (isNaN(amount)) {
                logger.error(`i = ${i}, Amount (${amount}) is not a number on ${transaction.Date}: from ${transaction.FromAccount} to ${transaction.ToAccount}`)
            } else {

                let outputData = {
                    date: outputDate,
                    from: transaction.FromAccount,
                    to: transaction.ToAccount,
                    narrative: transaction.Narrative,
                    amount: amount
                }
                return outputData;
            }
        } else if (fileType ==="xml") {
            let dateFromFile = transaction.attributes.Date;
            let gregorianDate = moment((dateFromFile-25569)*86400000).format("DD/MM/yyyy");
            let outputDate = formatDate(gregorianDate);
            let amount = parseFloat(transaction.elements[1].elements[0].text);
            if (isNaN(amount)) {
                logger.error(`i = ${i}, Amount (${amount}) is not a number on ${transaction.Date}: from ${transaction.FromAccount} to ${transaction.ToAccount}`)
            } else {
                let outputData = {
                    date: outputDate,
                    from: transaction.elements[2].elements[0].elements[0].text,
                    to: transaction.elements[2].elements[1].elements[0].text,
                    narrative: transaction.elements[0].elements[0].text,
                    amount: amount
                };
                return outputData;
            }
        };
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