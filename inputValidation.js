const format = require("date-fns/format");
const log4js = require("log4js");
const logger = log4js.getLogger('filename');
const moment = require('moment');
moment().format();

exports.formatInput = function (fileType, transaction) {
    if (fileType === "csv") {
        const dateFromFile = transaction.Date;
        let outputDate = moment(dateFromFile, "DD-MM-YYYY");
        if (outputDate.isValid()) {
            outputDate = moment(outputDate).format("Do MMM YYYY");
            let amount = parseFloat(transaction.Amount);
            if (isNaN(amount)) {
                logger.error(`Amount (${transaction.Amount}) is not a number on ${transaction.Date}: from ${transaction.From} to ${transaction.To}`)
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
        } else {
            logger.error(`Date is not valid (${dateFromFile})`);
        }
    } else if (fileType === "json") {
        const dateFromFile = transaction.Date;
        let outputDate = moment(dateFromFile, "YYYY-MM-DD");
        if (outputDate.isValid()) {
            outputDate = moment(outputDate).format("Do MMM YYYY");
            const amount = parseFloat(transaction.Amount);
            if (isNaN(amount)) {
                logger.error(`Amount (${amount}) is not a number on ${transaction.Date}: from ${transaction.FromAccount} to ${transaction.ToAccount}`)
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
        }
    } else if (fileType ==="xml") {
        let dateFromFile = transaction.attributes.Date;
        //Convert julian date to gregorian
        //First subtract the julian date of 1st Jan 1970 from our julian date
        //Then multiply this by the number of milliseconds in a day
        const jd1stJan1970 = 25569;
        const msInADay = 86400000;
        let outputDate = moment((dateFromFile-jd1stJan1970)*msInADay);
        if (outputDate.isValid()) {
            outputDate = moment(outputDate).format("Do MMM YYYY");
            let amount = parseFloat(transaction.elements[1].elements[0].text);
            if (isNaN(amount)) {
                logger.error(`Amount (${amount}) is not a number on ${transaction.Date}: from ${transaction.FromAccount} to ${transaction.ToAccount}`);
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
        }
    };
}