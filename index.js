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

const bank = new Bank(obj);
let accounts = [];
for (const transaction in bank) {
        console.log("From: " + transaction.from);
        if (accounts.some(account => account.name === transaction.from))
        {
                let account = accounts.find(account => account.name === transaction.from);
                account.balance = account.balance - transaction.amount;
        }
        else
        {
                accounts.push(new Account(transaction.from, (transaction.amount)*-1));
        }

        if (accounts.some(account => account.name === transaction.to))
        {
                let account = accounts.find(account => account.name === transaction.to);
                account.balance = account.balance + transaction.amount;
        }
        else
        {
                accounts.push(new Account(transaction.to, transaction.amount));
        }
        for (const key of Object.keys(bank)) {
                // console.log(key, bank[key]);
        }
        for (const key of Object.keys(accounts)) {
                console.log(key, accounts[key]);
        }
}



