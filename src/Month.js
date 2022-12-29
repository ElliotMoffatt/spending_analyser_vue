import { incomeCategoryName, otherCategoryName } from '@/Settings.js';
import { Category } from './Category';

export class Month {
    constructor(transactionArray, categoryKeywords) {
        this.transactions = transactionArray;
        this.isComplete = true;
        this.setTitle();
        this.setNetIncome();
        this.categoriseTransactions(categoryKeywords);
        this.mergeTransactions();
    }

    setTitle() {
        if (this.transactions.length > 0) {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
            const date = this.transactions[0].date;
            this.title = monthNames[date.getMonth()] + " " + String(date.getFullYear());
        }
        else {
            this.title = "Undated"
        }
    }

    setNetIncome() {
        this.netIncome = 0
        this.transactions.forEach(function (transaction) {
            this.netIncome += transaction.amount;
        }, this)
    }

    categoriseTransactions(categoryKeywords) {
        var categoryNames = Object.keys(categoryKeywords);
        categoryNames.push(otherCategoryName);
        categoryNames.push(incomeCategoryName);

        this.categories = []

        categoryNames.forEach(function (categoryName) {
            this.categories.push(new Category(categoryName))
        }, this)

        this.transactions.forEach(function (transaction) {
            var category = this.categories.find(cat => cat.name == transaction.category)
            if (category == null) {
                console.log(this.categories);
                console.log(transaction.category);
            }
            category.addTransaction(transaction);
        }, this)

    }

    mergeTransactions() {
        this.categories.forEach(function (category) {
            category.mergeTransactions();
        })
    }
}