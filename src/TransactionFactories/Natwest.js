import { Transaction } from '@/Transaction.js';

export const ParserSettings = {
    transactionSeperator: "\n",
    detailSeperator: `","`,
    rowsToExclude: 3
};

export function parseNatwest(rawText) {
    var transactionsTextArray = rawText
        .toLowerCase()
        .replace(/\uFFFD/g, ' ')
        .replace(/\t/g, '')
        .replace(/\xa0/g, ' ')
        .split(ParserSettings.transactionSeperator);

    for (var j = 0; j < ParserSettings.rowsToExclude; j++) {
        transactionsTextArray.shift();
    }

    var transactions = [];
    for (var i = 0; i < transactionsTextArray.length; i++) {
        var trans = readTextAsTransaction(transactionsTextArray[i])
        if (trans) {
            transactions.push(trans);
        }
    }
    return transactions
}

function readTextAsTransaction(rawString) {
    //var lines = rawString
    //    .split(ParserSettings.detailSeperator)
    //    .filter(el => el != null)
    //    .map(x => x.replace(/["]+/g, ''));

    var lines = rawString.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
    lines = lines || [];
    lines = lines.filter(el => el != null).map(x => x.replaceAll(`"`, ``));

    if (lines.length > 0) {
        const date = parseDateText(lines[0]) || new Date();
        const description = lines[2] || "";
        const amount = parseFloat(lines[3]) || 0;

        return new Transaction(date, description, amount)
    }

}

function parseDateText(dateString) {
    const dateParts = dateString.split("/");

    // month is 0-based, that's why we need dataParts[1] - 1
    return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
}