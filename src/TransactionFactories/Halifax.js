import { Transaction } from '@/Transaction.js';

export const ParserSettings = {
    transactionSeperator: "\n",
    detailSeperator: `,`,
    rowsToExclude: 1
};

export function parseHalifax(rawText) {
    var transactionsTextArray = rawText
        .toLowerCase()
        .replace(/\uFFFD/g, ' ')
        .replace(/\t/g, '')
        .replace(/\xa0/g, ' ')
        .split(ParserSettings.transactionSeperator)
        .filter(x => x != null && x != '');

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
    var lines = rawString
        .split(ParserSettings.detailSeperator)
        .filter(el => el != null)

    if (lines.length > 0) {
        const date = parseDateText(lines[0]) || new Date();
        const description = lines[4] || "";

        const debit = parseFloat(lines[5]) || 0
        const credit = parseFloat(lines[6]) || 0
        const amount = credit - debit;

        return new Transaction(date, description, amount)
    }

}

function parseDateText(dateString) {
    const dateParts = dateString.split("/");

    // month is 0-based, that's why we need dataParts[1] - 1
    return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
}