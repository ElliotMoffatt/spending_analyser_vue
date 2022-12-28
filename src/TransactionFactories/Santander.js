import { Transaction } from '@/Transaction.js';

// JavaScript source code

export const ParserSettings = {
    transactionSeperator: "\n\n",
    detailSeperator: "\n",
    rowsToExclude: 2,
};


export function parseSantander(rawText) {
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
        transactions.push(readTextAsTransaction(transactionsTextArray[i]));
    }
    return transactions
}

function readTextAsTransaction(rawString) {
    var lines = rawString.split(ParserSettings.detailSeperator).filter(el => el != null);
    for (var i = 0; i < lines.length; i++) {
        lines[i] = lines[i].split(":")[1].trim();
    }
    const date = parseDateText(lines[0]);
    const description = lines[1];
    const amount = parseFloat(lines[2]);
    const balance = parseFloat(lines[3]);

    return new Transaction(date, description, amount, balance)
}

function parseDateText(dateString) {
    const dateParts = dateString.split("/");

    // month is 0-based, that's why we need dataParts[1] - 1
    return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
}