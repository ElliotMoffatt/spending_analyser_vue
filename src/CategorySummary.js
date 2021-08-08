export class CategorySummary {
    constructor(name) {
        this.name = name;
        this.total = 0;
        this.count = 0;
        this.average = 0;
        this.max = null;
        this.min = null;
    }

    analyseInstance(categoryInstance) {
        this.total += categoryInstance.total;
        this.count++;
        this.average = (this.total / this.count).toFixed(2);
        if (this.max === null) {
            this.max = categoryInstance.total.toFixed(2)
        } else {
            this.max = Math.max(this.max, categoryInstance.total).toFixed(2)
        }
        if (this.min === null) {
            this.min = categoryInstance.total.toFixed(2)
        } else {
            this.min = Math.min(this.min, categoryInstance.total).toFixed(2)
        }
    }
}