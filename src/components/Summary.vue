<template>
    <div class="summary">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Average</th>
                    <th>Max</th>
                    <th>Min</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="summary in summariesExceptIncome" :key="summary.name">
                    <td>{{summary.name}}</td>
                    <td>{{summary.average}}</td>
                    <td>{{summary.min}}</td>
                    <td>{{summary.max}}</td>
                </tr>
                <tr v-if="incomeSummary" class="incomeRow table-success">
                    <td>{{incomeSummary.name}}</td>
                    <td>{{incomeSummary.average}}</td>
                    <td>{{incomeSummary.max}}</td>
                    <td>{{incomeSummary.min}}</td>
                </tr>
                <tr v-if="totalAverageOutgoings" class="incomeRow table-danger">
                    <td>Average total outgoings</td>
                    <td>{{totalAverageOutgoings}}</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr v-if="averageNetIncome" class="incomeRow table-info">
                    <td>Average Net income</td>
                    <td>{{averageNetIncome}}</td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style>
    .summary{
        margin: 30px;
    }
    .incomeRow{
        margin-top: 5px;
    }
</style>

<script>
    import { CategorySummary } from '@/CategorySummary.js';

    export default {
        props: {
            months: {
                type: Array,
                required: true
            }
        },

        data() {
            return {
                summaries: [],
                includeIncompleteMonths: false,
            }
        },

        computed: {
            monthsToInclude() {
                return this.includeIncompleteMonths ? this.months : this.months.filter(month => month.isComplete)
            },

            summariesExceptIncome() {
                return this.summaries.filter(sum => sum.name != "income");
            },

            incomeSummary() {
                return this.summaries.find(sum => sum.name == "income");
            },

            totalAverageOutgoings() {
                if (this.summariesExceptIncome.length == 0) {
                    return 0;
                }
                return this.summariesExceptIncome.map(item => parseFloat(item.average)).reduce((prev, next) => prev + next).toFixed(2);
            },

            averageNetIncome() {
                if (this.summaries.length == 0) {
                    return 0;
                }
                return this.summaries.map(item => parseFloat(item.average)).reduce((prev, next) => prev + next).toFixed(2);
            }
        },

        watch: {
            monthsToInclude: {
                deep: true,
                handler: function () {
                    this.getSummaries();
                }
            }
        },

        methods: {
            getSummaries() {
                this.summaries = [];
                this.monthsToInclude[0].categories.forEach(function (cat) {
                    this.summaries.push(new CategorySummary(cat.name));
                }, this);

                this.monthsToInclude.forEach(function (month) {
                    month.categories.forEach(function (cat) {
                        var summary = this.summaries.find(x => x.name == cat.name);
                        if (summary != null) {
                            summary.analyseInstance(cat);
                        }
                    }, this)
                }, this)
            }
        }
    }
</script>