const fs = require('fs');
const csvToObj = require('csv-to-js-parser').csvToObj;

const accountData = fs.readFileSync('Transactions2014.csv').toString();
const accounts =
    {
        Date:     {type: 'string'},
        From:         {type: 'string', group:1},
        To:      {type: 'string'},
        Narrative:   {type: 'string'},
        Amount:           {type: 'number'}
    };
let obj = csvToObj(accountData);
for (const acc in obj) {
        for (const key of Object.keys(obj)) {
                console.log(key, obj[key]);
        }

        // console.log(`${acc.Date}: ${obj[acc.Date]}`);
}

