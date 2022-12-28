<template>
    <div class="transaction">
        <div>{{transaction.description}} : &#163;{{transaction.amount.toFixed(2)}}</div>
        <div v-if="transaction.date">Date: {{formattedDate}}</div>
        <div v-if="transaction.balance">Balance: &#163;{{transaction.balance}}</div>
    </div>
</template>

<style>
    .transaction{
        border-bottom: solid 1px grey;
    }
</style>

<script>
    export default {
        props: {
            transaction: {
                type: Object,
                required: true
            }
        },
        data() {
            return {

            }
        },
        computed: {
            formattedDate() {
                if (!this.transaction.date) {
                    return null;
                }
                return `${this.transaction.date.getDay()}/${this.transaction.date.getMonth() + 1}/${this.transaction.date.getFullYear()}`;
            }
        }
    }
</script>