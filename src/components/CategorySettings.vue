<template>
    <div class="categorySettings row">
        <div class="col col-4">
            <ul class="list-group categoriesList">
                <li class="list-group-item"
                    v-for="category in Object.keys(categories)"
                    @click="selectedCategory = category"
                    :key="category.name"
                    v-bind:style="categoryListItemStyle(category)">{{category}}</li>
            </ul>
            <div class="input-group mt-1">
                <input type="text" class="form-control" id="newCategory" placeholder="Add new category">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" @click="addCategory()">Add</button>
                </div>
            </div>
        </div>
        <div class="col col-8" v-if="selectedCategory">
            <div class="input-group m-2">
                <input type="text" class="form-control" id="renameCategory" v-bind:value="selectedCategory">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" @click="renameCategory()">Rename category</button>
                </div>
                <div class="input-group-append">
                    <button class="btn btn-outline-danger inline-flex" type="button" @click="deleteCategory()">Delete category</button>
                </div>
            </div>
            
            <p class="mt-4">Add words which identify a transaction as belonging to this category</p>

            <div class="input-group mb-1" v-for="(word, idx) in categories[selectedCategory]" :key="idx">
                <input type="text" class="form-control" v-bind:value="word" :key="idx" @change="updateWord(idx, this.value)">
                <div class="input-group-append" :key="idx">
                    <button :key="idx" class="btn btn-outline-secondary" type="button" @click="removeWord(idx)">&times;</button>
                </div>
            </div>
            <div class="input-group mb-3">
                <input type="text" class="form-control" id="newWord">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" @click="addWord()">Add phrase</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    .categorySettings {
        margin: 20px;
    }

    .categoriesList{
        cursor: pointer;
    }
</style>

<script>
    export default {
        props: {
            categoriesProp: {
                type: Object,
                required: true
            }
        },
        emits: [
            "update:categories",
            ],
        data() {
            return {
                categories: this.categoriesProp,
                selectedCategory: null
            }
        },
        watch: {
            categoriesProp: {
                deep: true,
                handler: function (newVal) {
                    this.categories = newVal;
                }
            },
            categories: {
                deep: true,
                handler: function (newVal) {
                    if (newVal != this.categoriesProp) {
                        this.$emit("update:categories", newVal);
                    }
                }
            }
        },
        methods: {
            categoryListItemStyle(category) {
                return {
                    'background-color': category == this.selectedCategory ? "rgba(100, 100, 100, 0.3)" : ""
                }
            },

            addCategory() {
                const newCatName = document.getElementById("newCategory").value;
                if (newCatName) {
                    this.categories[document.getElementById("newCategory").value] = [];
                    this.selectedCategory = document.getElementById("newCategory").value;
                }
                document.getElementById("newCategory").value = "";
            },

            deleteCategory() {
                delete this.categories[this.selectedCategory];
                this.selectedCategory = null;
            },

            renameCategory() {
                var newKey = document.getElementById("renameCategory").value;
                this.categories[newKey] = this.categories[this.selectedCategory];
                delete this.categories[this.selectedCategory];
                this.selectedCategory = newKey;
            },

            addWord() {
                this.categories[this.selectedCategory].push(document.getElementById("newWord").value);
                document.getElementById("newWord").value = "";
            },

            removeWord(idx) {
                this.categories[this.selectedCategory].splice(idx, 1);
            },

            updateWord(idx, newWord) {
                this.categories[this.selectedCategory][idx] = newWord;
            }
        }
    }
</script>