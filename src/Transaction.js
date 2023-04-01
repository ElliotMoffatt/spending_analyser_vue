import { incomeCategoryName, otherCategoryName } from '@/Settings.js';
//import { CategoryConfig } from '@/CategoryConfig.js'

export class Transaction {
    /**
     * @param{Date} date
     * @param{string} description
     * @param{number} amount
     * @param{CategoryConfig[]} categoryConfigs
     * */
    constructor(date, description, amount, categoryConfigs) {
        this.date = date;
        this.description = description;
        this.amount = amount;
        this.getCategoryFromConfigs(categoryConfigs)
    }

    get month() {
        return this.date.getMonth()
    }

    get year() {
        return this.date.getFullYear()
    }

    isDifferentMonth(otherTransaction) {
        return this.month != otherTransaction.month || this.year != otherTransaction.year
    }

    increaseAmount(extra) {
        this.amount += extra;
    }

    tidyDescription(descriptionFillerWords) {
        var cleanedDescription = this.description.replace(/\s\s+/g, ' ');
        for (var i = 0; i < descriptionFillerWords.length; i++) {
            cleanedDescription = cleanedDescription.replaceAll(descriptionFillerWords[i], "");
        }
        this.description = cleanedDescription.split(",")[0].replace(/[0-9]/g, '').trim();
    }

    getCategory(categoryKeywords) {
        if (this.amount > 0) {
            this.category = incomeCategoryName
        }
        else {
            for (const property in categoryKeywords) {
                for (const word of categoryKeywords[property]) {
                    if (this.description.includes(word)) {
                        this.category = property;
                        return;
                    }
                }
            }
            this.category = otherCategoryName;
        }
    }

    getCategoryFromConfigs(categoryConfigs) {
        if (categoryConfigs == null) {
            return;
        }

        for (var i = 0; i < categoryConfigs.length; i++) {
            if (categoryConfigs[i].isTransactionInCategory(this.description, this.amount)) {
                this.category = categoryConfigs[i].categoryName;
                break;
            }
        }
    }
}
