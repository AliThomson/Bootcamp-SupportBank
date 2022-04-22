const fs = require('fs');
const csvToObj = require('csv-to-js-parser').csvToObj;
const readlineSync = require('readline-sync');
const log4js = require('log4js');
const logger = log4js.getLogger('dodgyFileName');
const format = require('date-fns/format');

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

const accountData = fs.readFileSync(dodgyFileName).toString();
let obj = csvToObj(accountData);
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
    for (let i = 0; i < obj.length; i++) {
        let amount = parseFloat(obj[i]['Amount'])
        if (isNaN(amount)) {
            logger.error(`Amount is not a number on ${obj[i]['Date']}: from ${obj[i]['From']}: to ${obj[i]['To']}`)
        }
        // let inputDate = format(new Date(obj[i]['Date']), 'yyyy-MM-dd')//Date.parse(obj[i]['Date']);
        let inputDate  = obj[i]['Date'] //date string in dd/mm/yyyy format

        let dateArray = inputDate.split("/");
        let day = parseInt(dateArray[0], 10);
        let month = parseInt(dateArray[1], 10)-1;
        let year = parseInt(dateArray[2], 10);

        let outputDate = new Date(year, month, day);

        if (isNaN(outputDate)) {
            logger.error(`Date is not valid(${obj[i]['Date']}): from ${obj[i]['From']}: to ${obj[i]['To']} narrative: ${obj[i]['Narrative']}`)
        }
        bank.push(new Bank((obj[i]['Date']), obj[i]['From'], obj[i]['To'], obj[i]['Narrative'], amount));
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
            } else {
                    accounts.push(new Account(transaction['from'], parseFloat(transaction['amount']).toFixed(2) * -1));
            }

            if (accounts.some(account => account['holder'] === transaction['to'])) {
                    let account = accounts.find(account => account['holder'] === transaction['to']);
                    let balance = parseFloat(account['balance']) + parseFloat(transaction['amount'])
                    account['balance'] = balance.toFixed(2);
            } else {
                    accounts.push(new Account(transaction['to'], parseFloat(transaction['amount']).toFixed(2)));
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