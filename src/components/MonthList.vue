<template>
    <div class="breakdownRow">
        <div class="row">
            <div class="col">
                <h4>Months</h4>
                <Month v-for="month in months" class="monthList" :month="month" :isSelected="isSelectedMonth(month)" :key="month.title" v-on:setMonth="setSelectedMonth"></Month>
            </div>
            <div class="col">
                <h4 v-if="selectedMonth">{{selectedMonth.title}}</h4>
                <Category v-for="category in categoriesWithTransactions"
                          class="categoryList"
                          :isSelected="isSelectedCategory(category) "
                          :category="category"
                          :monthTitle="selectedMonth.title"
                          :key="category.name"
                          v-on:setCategory="setSelectedCategory"></Category>
            </div>
            <div class="col transactionList">
                <h4 v-if="selectedCategory">{{selectedCategory.name}}</h4>
                <TransactionList v-if="selectedCategory" :transactionList="selectedCategory.mergedTransactions"></TransactionList>
            </div>
        </div>
    </div>
    
</template>

<style>
    .breakdownTitle{
        border-bottom: 1px solid lightgrey;
        margin: 10px
    }

    .breakdownRow{
        max-height:75vh;
        padding: 5px;
        margin:5px;
    }

</style>

<script>
    import Month from './Month.vue';
    import Category from "./Category.vue";
    import TransactionList from "./TransactionList.vue";

    export default {
        components: {
            Month,
            Category,
            TransactionList
        },
        props: {
            months: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                selectedMonth: null,
                selectedCategory: null
            }
        },
        computed: {
            categoriesWithTransactions() {
                if (!this.selectedMonth) {
                    return [];
                }
                return this.selectedMonth.categories.filter(cat => cat.transactions.length > 0);
            },
        },
        watch: {
            selectedMonth: function () {
                this.selectedCategory = null;
            }
        },
        methods: {
            setSelectedMonth(month) {
                this.selectedMonth = month;
            },
            setSelectedCategory(category) {
                this.selectedCategory = category;
            },

            isSelectedMonth(month) {
                return this.selectedMonth != null && month.title == this.selectedMonth.title
            },

            isSelectedCategory(category) {
                return this.selectedCategory != null && category.name == this.selectedCategory.name
            }
        }
    }
</script>