<template>
    <div class="fillerWordsList">
        <p>Add words/phrases to this list to remove filler words from transaction descriptions. NB: whitespace matters</p>
        <div class="input-group mb-1" v-for="(word, idx) in words"  :key="idx">
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
</template>

<style>
    .fillerWordsList{
    margin: 20px;
    }
</style>

<script>
    export default {
        props: {
            wordsProp: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                words: this.wordsProp
            }
        },
        watch: {
            wordsProp: function (newVal) {
                this.words = newVal
            },
            words: function (newVal) {
                if (newVal != this.wordsProp) {
                    this.$emit("update:words", newVal);
                }
            }
        },
        methods: {
            removeWord: function (idx) {
                this.words.splice(idx, 1);
            },

            updateWord: function (idx, newWord) {
                this.words[idx] = newWord;
            },

            addWord: function () {
                this.words.push(document.getElementById("newWord").value);
                document.getElementById("newWord").value = "";
            }
        }
    }
</script>