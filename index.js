const fs = require('fs');
const csvToObj = require('csv-to-js-parser').csvToObj;

const accountData = fs.readFileSync('Transactions2014.csv').toString();
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

let bank = []
for (let i=0;i<obj.length; i++)
{
    bank.push(new Bank((obj[i]['Date']), obj[i]['From'], obj[i]['To'], obj[i]['Narrative'], parseFloat(obj[i]['Amount'])));
}
let accounts = [];

// Object.keys(bank).forEach((key) =>
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

        for (const key of Object.keys(bank)) {
                console.log(key, bank[key]);
        }
        for (const key of Object.keys(accounts)) {
                console.log(key, accounts[key]);
        }

