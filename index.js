const fs = require('fs');
const csvToObj = require('csv-to-js-parser').csvToObj;
const readlineSync = require('readline-sync');
const log4js = require('log4js');
const logger = log4js.getLogger('dodgyFileName');
const format = require('date-fns/format');
const {loadFile} = require('./loadFile');

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

const dodgyFileName = "DodgyTransactions2015.csv";
const goodFileName = "Transactions2014.csv";
let filename = dodgyFileName;
let inputData = loadFile(filename);

class Bank {
        date;
        from;
        to;
        narrative;
        amount;
        constructor(date, from, to, narrative, amount) {
                this.date = date;
                this.from = from;
                this.to = to;
                this.narrative = narrative;
                this.amount = amount;
        }
}
class Account {
        holder;
        balance;
        constructor(holder, balance) {
                this.holder = holder;
                this.balance = balance;
        };
}

let bank = [];
try {
    for (let i = 0; i < inputData.length; i++) {
        let amount = parseFloat(inputData[i]['Amount'])

        let dateFromFile  = inputData[i]['Date'] //date string in dd/mm/yyyy format

        let dateArray = dateFromFile.split("/");
        let day = parseInt(dateArray[0], 10);
        let month = parseInt(dateArray[1], 10)-1;
        let year = parseInt(dateArray[2], 10);

        let outputDate = new Date(year, month, day);

        if (isNaN(outputDate)) {
            logger.error(`Date is not valid (${inputData[i]['Date']}), 
                From ${inputData[i]['From']} to ${inputData[i]['To']}, 
                narrative: ${inputData[i]['Narrative']}`);
        } else if (isNaN(amount)) {
            logger.error(`Amount (${amount}) is not a number on ${inputData[i]['Date']}: from ${inputData[i]['From']} to ${inputData[i]['To']}`)
        } else {
            bank.push(new Bank((format(outputDate, 'd-M-yyyy')), inputData[i]['From'], inputData[i]['To'], inputData[i]['Narrative'], amount));
            logger.info(`Transaction added: ${inputData[i]['Date']}), 
                From ${inputData[i]['From']} to ${inputData[i]['To']}, 
                narrative: ${inputData[i]['Narrative']}`);
        }
    }
}
catch(err) {
    logger.error(err)
}
let accounts = [];

bank.forEach(transaction =>
     {
            if (accounts.some(account => account['holder'] === transaction['from'])) {
                    let account = accounts.find(account => account['holder'] === transaction['from']);
                    let balance = parseFloat(account['balance']) - parseFloat(transaction['amount']);
                    account['balance'] = balance.toFixed(2);
                logger.info(`Balance decremented for ${account['holder']} by ${transaction['amount']}`);
            } else {
                    accounts.push(new Account(transaction['from'], parseFloat(transaction['amount']).toFixed(2) * -1));
                logger.info(`Account created for ${transaction['to']} 
                with balance (${parseFloat(transaction['amount']).toFixed(2)}`);
            }

            if (accounts.some(account => account['holder'] === transaction['to'])) {
                    let account = accounts.find(account =>
                        account['holder'] === transaction['to']);
                    let balance = parseFloat(account['balance']) + parseFloat(transaction['amount']);
                    account['balance'] = balance.toFixed(2);
                logger.info(`Balance incremented for ${account['holder']} by ${transaction['amount']}`);
            } else {
                    accounts.push(new Account(transaction['to'], parseFloat(transaction['amount']).toFixed(2)));
                logger.info(`Account created for ${transaction['to']} 
                    with balance (${parseFloat(transaction['amount']).toFixed(2)}`);
            }
    });

        function printAll() {
            for (const key of Object.keys(accounts)) {
                console.log(key, accounts[key]);
            }
        }
        function printAccount(holder) {
            let fromAccounts = bank.filter(transaction => transaction.from === holder);
            for (const key of Object.keys(fromAccounts)) {
                console.log(key, fromAccounts[key]);
            }
            let toAccounts = bank.filter(transaction => transaction.to === holder);
            for (const key of Object.keys(toAccounts)) {
                console.log(key, toAccounts[key]);
            }
        }
let option = readlineSync.question('What would you like to output? List All or List [Account holder]');
if (option === "List All") {
    printAll();
} else {
    let holder = option.substring(5);
    if (accounts.some(account => account['holder'] === holder)) {
        printAccount(holder);
    } else {
        console.log("Please enter a valid account holder");
    }
}