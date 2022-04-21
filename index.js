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
        bank.push(new Bank(obj[i]));
}
console.log("Length = " + bank.length);
console.log(`Bank.from: ${obj[0]['From']}`)
console.log(`Bank.from: ${bank[0]['from']}`)
let accounts = [];

// for (const transaction in bank) {
// for (let i=0;i<bank.length; i++)

// Object.keys(bank).forEach((key) =>
bank.forEach(transaction =>
     {
            // console.log(`From: ${transaction['from']}`);

            if (accounts.some(account => account.name === bank.from)) {
                    let account = accounts.find(account => account.name === bank.from);
                    account.balance = account.balance - bank.amount;
            } else {
                    console.log("here");
                    accounts.push(new Account(bank.from, (bank.amount) * -1));
            }

            if (accounts.some(account => account.name === bank.to)) {
                    let account = accounts.find(account => account.name === bank.to);
                    account.balance = account.balance + bank.amount;
            } else {
                    accounts.push(new Account(bank.to, bank.amount));
            }
    });

        for (const key of Object.keys(bank)) {
                console.log(key, bank[key]);
        }
        for (const key of Object.keys(accounts)) {
                // console.log(key, accounts[key]);
        }

