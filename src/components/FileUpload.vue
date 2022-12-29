<template>
    <div class="fileUpload">
        <div class="row">
            <div class="col-auto">
                Select data source:
            </div>
            <div class="col-auto" style="border-right: 1px solid">
                <select class="form-select" v-model="selectedDataSource">
                    <option selected :value="DataSource.Santander">Santander</option>
                    <option :value="DataSource.Natwest">Natwest</option>
                    <option :value="DataSource.Halifax">Halifax</option>
                </select>
            </div>
            <div class="col-auto">
                Select .txt or .csv to analyse:
            </div>
            <div class="col-auto">
                <input type="file" role="button" class="form-control-file" id="fileToLoad" accept=".txt,.csv" @change="loadFileAsText()">
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
    import { Month } from '@/Month.js';
    import { parseSantander } from '@/TransactionFactories/Santander.js';
    import { parseNatwest } from '@/TransactionFactories/Natwest.js';


    /**
     * Enum for the types of bank statement that can be parsed
     * */
    const DataSource = {
        Santander: 0,
        Natwest: 1,
        Halifax: 2
    };


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
                DataSource,
                selectedDataSource: DataSource.Santander,
                rawText: "",
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

            rawText: {
                handler: function (n) {
                    this.transactions = this.parseData(n);
                }
            },

            selectedDataSource: {
                handler: function () {
                    this.transactions = this.parseData(this.rawText);
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
                    vm.rawText = fileLoadedEvent.target.result;

                };

                fileReader.readAsText(fileToLoad, "ANSI");
            },

            /**
             * Given the raw text from the file upload, parses the data into a Transaction array using the selected parser
             * @param{string} rawText
             * @returns{Transaction[]}
             * */
            parseData(rawText) {
                switch (this.selectedDataSource) {
                    case DataSource.Santander:
                        return parseSantander(rawText);
                    case DataSource.Natwest:
                        return parseNatwest(rawText);
                    default:
                        return [];
                }
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