import { incomeCategoryName, otherCategoryName } from '@/Settings.js';

export class Transaction {
    constructor(rawString, amount) {
        if (amount === undefined) {
            var lines = rawString.split("\n").filter(el => el != null);
            for (var i = 0; i < lines.length; i++) {
                lines[i] = lines[i].split(":")[1].trim();
            }
            this.setDate(lines[0]);
            this.description = lines[1];
            this.amount = parseFloat(lines[2]);
            this.balance = parseFloat(lines[3]);
        }
        else {
            this.description = rawString;
            this.amount = amount;
        }
        
    }

    increaseAmount(extra) {
        this.amount += extra;
    }

    setDate(dateString) {
        var dateParts = dateString.split("/");

        // month is 0-based, that's why we need dataParts[1] - 1
        this.date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
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
