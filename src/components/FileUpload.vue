<template>
    <div class="fileUpload">
        <div class="row">
            <div class="col-auto">
                Select .txt to analyse:
            </div>
            <div class="col-auto">
                <input type="file" role="button" class="form-control-file" id="fileToLoad" accept=".txt" @change="loadFileAsText()">
            </div>
        </div>
    </div>
</template>

<style scoped>
    .fileUpload{
        border: solid 1px grey;
        border-radius: 5px;
        padding:5px;
        margin:auto;
        width:fit-content;
    }

    .fileUpload > .row{
        margin: auto;
        width: fit-content;
    }

</style>

<script>
    import { Transaction } from '@/Transaction.js';
    import { Month } from '@/Month.js';


    export default {
        name: 'FileUpload',
        props: {
            descriptionFillerWords: {
                type: Array,
                required: true
            },
            categoryKeywords: {
                type: Object,
                required: true
            }
        },
        data: function () {
            return {
                transactions: [],
                months: []
            }
        },
        computed: {

        },
        watch: {
            transactions: function () {
                this.tidyAndCategoriseTransactions();
                this.createMonths();
            },

            descriptionFillerWords: function () {
                if (this.transactions.length > 0) {
                    this.tidyAndCategoriseTransactions();
                    this.createMonths();
                }
            },

            categoryKeywords: {
                deep: true,
                handler: function() {
                    if (this.transactions.length > 0) {
                        this.tidyAndCategoriseTransactions();
                        this.createMonths();
                    }
                }
            },

            months: function () {
                this.$emit("update:months", this.months);
            }
        },
        methods: {
            loadFileAsText() {
                var fileToLoad = document.getElementById("fileToLoad").files[0];
                var vm = this;
                var fileReader = new FileReader();

                fileReader.onload = function (fileLoadedEvent) {
                    var rawText = fileLoadedEvent.target.result;
                    var transactionsTextArray = rawText.toLowerCase().replace(/\uFFFD/g, ' ').replace(/\t/g, '').replace(/\xa0/g, ' ').split("\n\n");
                    transactionsTextArray.shift();
                    transactionsTextArray.shift();

                    var transactions = [];
                    for (var i = 0; i < transactionsTextArray.length; i++) {
                        transactions.push(new Transaction(transactionsTextArray[i]));
                    }
                    vm.transactions = transactions;

                };

                fileReader.readAsText(fileToLoad, "ANSI");
            },

            tidyAndCategoriseTransactions() {
                this.transactions.forEach(function (transaction) {
                    transaction.tidyDescription(this.descriptionFillerWords);
                    transaction.getCategory(this.categoryKeywords);
                }, this)
            },

            findFirstInMonthTransactions() {
                var firstInMonthTransactionIndices = [0];
                for (var i = 1; i < this.transactions.length - 1; i++) {
                    if (this.transactions[i].date.getMonth() != this.transactions[i - 1].date.getMonth()) {
                        firstInMonthTransactionIndices.push(i);
                    }
                }
                if (firstInMonthTransactionIndices[firstInMonthTransactionIndices.length - 1] != this.transactions.length - 1) {
                    firstInMonthTransactionIndices.push(this.transactions.length - 1);
                }
                return firstInMonthTransactionIndices;
            },

            createMonths() {
                var months = [];
                var firstInMonthTransactionIndices = this.findFirstInMonthTransactions();

                for (var i = 0; i < firstInMonthTransactionIndices.length - 2; i++) {
                    const monthsTransactions = this.transactions.slice(firstInMonthTransactionIndices[i], firstInMonthTransactionIndices[i + 1]);
                    months.push(new Month(monthsTransactions, this.categoryKeywords));
                }
                months.push(new Month(this.transactions.slice(firstInMonthTransactionIndices[firstInMonthTransactionIndices.length - 1]), this.categoryKeywords));

                this.months = months;

                this.months[0].isComplete = false;
                this.months[this.months.length-1].isComplete = false;
            },

            
        },
        mounted() {

        }
    }
</script>