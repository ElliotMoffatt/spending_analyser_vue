<template>
    <div class="transactionList">
        <Transaction v-for="(transaction, idx) in transactionList" :transaction="transaction" :key="'transaction-'+ idx"></Transaction>
    </div>
</template>

<style>
    .transactionList {
        overflow-y: auto;
    }
</style>

<script>
    import Transaction from "./Transaction.vue";

    export default {
        components: {
            Transaction
        },
        props: {
            transactionList: {
                type: Array,
                required: true
            },

        }
    }
</script>