<template>
    <div class="home container">
        <FileUpload v-on:update:months="updateMonths" :descriptionFillerWords="descriptionFillerWords" :categoryKeywords="categoryKeywords"></FileUpload>

        <div class="container mt-3">
            <ul class="nav nav-tabs">
                <li class="active nav-item"><a class="nav-link" data-toggle="tab" href="#breakdown">Month-by-Month breakdown</a></li>
                <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#summary">Summary</a></li>
                <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#settings">Category settings</a></li>
                <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#fillers">Filler word settings</a></li>
            </ul>

            <div class="tab-content">
                <div id="breakdown" class="tab-pane fade in active">
                    <MonthList :months="months"></MonthList>
                </div>
                <div id="summary" class="tab-pane fade">
                    <SummaryVue :months="months"></SummaryVue>
                </div>
                <div id="settings" class="tab-pane fade">
                    <CategorySettings :categoriesProp="categoryKeywords" v-on:update:categories="updateCategorySettings"></CategorySettings>
                </div>
                <div id="fillers" class="tab-pane fade">
                    <FillerWordsList :wordsProp="descriptionFillerWords" v-on:update:words="updateFillerWords"></FillerWordsList>
                </div>
            </div>
        </div>


    </div>
</template>

<style>
    .home{
        padding:30px
    }
</style>

<script>
// @ is an alias to /src
    import MonthList from '@/components/MonthList.vue'
    import FileUpload from '@/components/FileUpload.vue'
    import FillerWordsList from '@/components/FillerWordsList.vue'
    import CategorySettings from '@/components/CategorySettings.vue'
    import SummaryVue from '@/components/Summary.vue'
    import { descriptionFillerWords, categoryKeywords } from '@/Settings.js';


export default {
        name: 'Home',
        components: {
            MonthList,
            FileUpload,
            FillerWordsList,
            CategorySettings,
            SummaryVue
        },
        data: function() {
            return {
                months: [],
                summary: null,
                includeIncompleteMonthsInSummary: false,
                descriptionFillerWords,
                categoryKeywords
            }
        },
        computed: {

        },
        watch: {
            descriptionFillerWords: function () {
                this.updateSettingsInStorage();
            },

            categoryKeywords: {
                deep: true,
                handler: function () {
                    this.updateSettingsInStorage();
                }
            },
        },
        methods: {
            updateMonths: function (payload) {
                this.months = payload;
            },

            getSettingsFromStorage() {
                if (localStorage.getItem('spendingAnalyserDescriptionFillerWords') !== null) {
                    this.descriptionFillerWords = JSON.parse(localStorage.getItem('spendingAnalyserDescriptionFillerWords'));
                }
                if (localStorage.getItem('spendingAnalyserCategoryKeywords') !== null) {
                    this.categoryKeywords = JSON.parse(localStorage.getItem('spendingAnalyserCategoryKeywords'));
                }
            },

            updateSettingsInStorage() {
                localStorage.setItem('spendingAnalyserDescriptionFillerWords', JSON.stringify(this.descriptionFillerWords));
                localStorage.setItem('spendingAnalyserCategoryKeywords', JSON.stringify(this.categoryKeywords));
            },

            updateFillerWords: function (newWords) {
                this.descriptionFillerWords = newWords;
            },

            updateCategorySettings: function (newCategories) {
                this.categoryKeywords = newCategories;
            }
        },
        mounted() {
            this.getSettingsFromStorage();
        }
}
</script>
