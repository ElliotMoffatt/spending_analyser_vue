import { incomeCategoryName, otherCategoryName } from '@/Settings.js';

export class Transaction {
    /**
     * @param{Date} date
     * @param{string} description
     * @param{number} amount
     * */
    constructor(date, description, amount) {
        this.date = date;
        this.description = description;
        this.amount = amount;
        
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
}
