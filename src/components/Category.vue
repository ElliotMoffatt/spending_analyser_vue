<template>
    <div class="category"  @click="emitSelectedCategory" v-bind:style="categoryStyle">
        <div class="row" align="center">
            <div class="col h5">
                {{category.name}}
            </div>
        </div>
        <div class="row" align="center">
            <div class="col">
                Total: &#163;{{category.total.toFixed(2)}}
            </div>
        </div>
    </div>
</template>

<style>
    .category{
        border: solid 1px grey;
        border-radius: 5px;
        margin: 10px;
        padding:5px;
        cursor: pointer;
        overflow:hidden
    }


</style>

<script>


    export default {
        components: {
        },
        props: {
            category: {
                type: Object,
                required: true
            },
            isSelected: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                mergeTransactions: true
            }
        },
        computed: {
            uniqueCategoryTitle() {
                return this.monthTitle + "-" + this.category.name
            },

            categoryStyle() {
                return {
                    'background-color': this.isSelected ? "rgba(100, 100, 100, 0.3)" : ""
                }
            },
        },
        methods: {
            emitSelectedCategory() {
                this.$emit("setCategory", this.category);
            }
        }
    }
</script>