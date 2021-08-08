import { Transaction } from '@/Transaction.js';

export class Category {
    constructor(categoryName) {
        this.name = categoryName;
        this.total = 0;
        this.transactions = [];
        this.mergedTransactions = [];
    }

    addTransaction(tx) {
        this.transactions.push(tx);
        this.total += tx.amount;
    }

    mergeTransactions() {
        this.mergedTransactions = [];
        this.transactions.forEach(function (transaction) {
            var matchingTransaction = this.mergedTransactions.find(tx => tx.description == transaction.description);
            if (matchingTransaction) {
                matchingTransaction.increaseAmount(transaction.amount)
            }
            else {
                this.mergedTransactions.push(new Transaction(transaction.description, transaction.amount));
            }
        }, this)
    }
}