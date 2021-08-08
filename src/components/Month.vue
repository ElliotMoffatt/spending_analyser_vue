<template>
    <div class="month" v-bind:style="monthStyle" @click="emitSelectedMonth" >
        <div class="h4">{{month.title}} <span v-if="!month.isComplete" style="color:red;cursor:help" :title="elementTitle">*</span></div>
        <div>Net Income: &#163;{{month.netIncome.toFixed(2)}}</div>
    </div>
</template>

<style>
    .month {
        border: solid 1px grey;
        border-radius: 5px;
        margin: 10px;
        padding: 5px;
        overflow: hidden;
        cursor: pointer;
    }
</style>

<script>
    export default {
        components: {
        },
        props: {
            month: {
                type: Object,
                required: true
            },
            isSelected: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            categoriesWithTransactions() {
                return this.month.categories.filter(cat => cat.transactions.length > 0);
            },

            monthStyle() {
                return {
                    'border-color': this.month.isComplete ? "grey" : "red",
                    'background-color': this.isSelected ? "rgba(100, 100, 100, 0.3)" : ""
                }
            },

            elementTitle() {
                return this.month.isComplete ? "" : "This month was at the edge of the uploaded data, so likely doesn't include all transactions made in the month. Analysis is misleading"
            }
        },
        methods: {
            emitSelectedMonth() {
                this.$emit("setMonth", this.month);
            }
        }
    }
</script>