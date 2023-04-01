export class CategoryConfig {
    constructor(name, keywords, { isIgnoredBySummary = false, minAmount = null, maxAmount = null } = {}) {
        this.name = name;
        this.keywords = keywords;
        this.isIgnoredBySummary = isIgnoredBySummary;
        this.minAmount = minAmount;
        this.maxAmount = maxAmount
    }

    get categoryName() {
        return this.name;
    }

    get config() {
        return {
            name: this.name,
            keywords: this.keywords,
            options: {
                isIgnoredBySummary: this.isIgnoredBySummary,
                minAmount: this.minAmount,
                maxAmount: this.maxAmount
                }
            }
    }

    isTransactionInCategory(transDescription, transAmount) {
        if (this.minAmount !== null && transAmount < this.minAmount) {
            return false;
        }
        else if (this.maxAmount !== null && transAmount > this.maxAmount) {
            return false
        }
        else {
            for (const property in this.keywords) {
                for (const word of this.keywords[property]) {
                    if (transDescription.includes(word)) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}