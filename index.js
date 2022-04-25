const fs = require('fs');
const readlineSync = require('readline-sync');
const log4js = require('log4js');
const {loadData} = require('./loadFile');
const {formatInput} = require('./inputValidation');

const logger = log4js.getLogger('filename');
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
const jsonFileName = "Transactions2013.json";
const filename = readlineSync.question('Which file would you like to import?');

let accountData = "";
try {
    accountData = fs.readFileSync(filename, "utf8").toString();
}
catch (err) {
    logger.error("Can't find that file", err);
}

const fileType = filename.split('.').pop().toLowerCase();
const inputData = loadData(accountData, fileType)


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

for (let i = 0; i < inputData.length; i++) {
    try {
        const outputData = formatInput(fileType, inputData, i);

        if (outputData) {
            bank.push(new Bank(outputData['date'], outputData['from'], outputData['to'], outputData['narrative'], outputData['amount']));
            logger.info(`Transaction added: ${outputData['date']}), 
            From ${outputData['from']} to ${outputData['to']}, 
            narrative: ${outputData['narrative']}`);
        }
    }
    catch(err) {
        logger.error("Could not add transaction", err);
    }
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