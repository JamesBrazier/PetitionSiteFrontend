<template>
    <div>
        <b-sidebar v-model="advFilter" id="filter" title="Filter Petitions" variant="info" shadow lazy>
            <div class="m-3">
                <b-form-group label="Title:" label-for="srch-q">
                    <b-form-input if="srch-q" v-model="search.q" placeholder="Search..."></b-form-input>
                </b-form-group>

                <b-form-group label="Category:" label-for="srch-c">
                    <b-form-select id="srch-c" v-model="search.categoryId" :options="categories"></b-form-select>
                </b-form-group>

                <b-form-group label="Order:" label-for="srch-o">
                    <b-form-select id="srch-o" v-model="search.sortBy" :options="orderings"></b-form-select>
                </b-form-group>

                <b-form-group label="Number to Show:" label-for="srch-n" :state="!isNaN(search.count)" 
                 invalid-feedback="Please input a number">
                    <b-input-group prepend="#">
                        <b-form-input id="srch-n" v-model="search.count" placeholder="Number..."></b-form-input>
                    </b-input-group>
                </b-form-group>

                <b-form-group label="Number to Skip:" label-for="srch-s" :state="!isNaN(search.startIndex)" 
                 invalid-feedback="Please input a number">
                    <b-input-group prepend="#">
                        <b-form-input id="srch-s" v-model="search.startIndex" placeholder="Start after..."></b-form-input>
                    </b-input-group>
                </b-form-group>

                <b-form-group>
                    <b-button variant="info" @click="getFilteredPetitions" v-b-toggle.filter>Apply</b-button>
                    <b-button variant="danger" v-b-toggle.filter>Cancel</b-button>
                </b-form-group>
            </div>
        </b-sidebar>

        <b-navbar variant="light" type="dark" fixed>
            <b-button variant="info" v-b-toggle.filter @click="getCategories()">
                <b-icon-filter></b-icon-filter>
            </b-button>

            <b-nav-form><b-input-group class="mx-3" v-if="!advFilter">
                <b-form-input v-model="search.q" placeholder="Search..."></b-form-input>
                <b-input-group-append>
                    <b-button variant="info" @click="getFilteredPetitions"><b-icon-search></b-icon-search></b-button>
                </b-input-group-append>
            </b-input-group></b-nav-form>
        </b-navbar>

        <div v-for="petition in petitions" :key="petition.title" class="my-2">
            <petition-small @click="$router.push({ name: 'petition', params: { id: petition.petitionId }})"
             :data="petition" style="max-width: 60rem;" class="w-75 mx-auto">
            </petition-small>
        </div>
    </div>
</template>

<script>
import petitionSmall from "./components/Petition-small.vue"

export default {
    data () {
        return {
            petitions: [],
            advFilter: false,
            categories: [{
                value: null,
                text: "All"
            }],
            orderings: [{
                value: "SIGNATURES_DESC",
                text: "Signatures Descending"
            },{
                value: "SIGNATURES_ASC",
                text: "Signatures Ascending"
            },{
                value: "ALPHABETICAL_DESC",
                text: "Alphabetical Descending"
            },{
                value: "ALPHABETICAL_ASC",
                text: "Alphabetical Ascending"
            }],
            search: {
                startIndex: null,
                count: null,
                q: null,
                categoryId: null,
                authorId: null,
                sortBy: "SIGNATURES_DESC"
            },
            startIndexValid: true,
            countValid: true
        }
    },
    mounted: function() 
    {
        this.getPetitions();
    },
    methods: {
        getPetitions: function() 
        {
            this.$http.get("http://csse-s365.canterbury.ac.nz:4001/api/v1/petitions")
            .then((res) => {
                this.petitions = res.data;
            }).catch((err) => {
                this.$emit("error", err);
            });
        },

        getFilteredPetitions: function()
        {
            if (isNaN(this.search.startIndex) || 
                (this.search.startIndex !== null && 
                this.search.startIndex.trim() === ""))
            {
                this.search.startIndex = undefined;
            }

            if (isNaN(this.search.count) || 
                (this.search.count !== null && 
                this.search.count.trim() === ""))
            {
                this.search.count = undefined;
            }

            if (this.search.q === "") {
                this.search.q = undefined;
            }

            this.$http.get("http://csse-s365.canterbury.ac.nz:4001/api/v1/petitions",
                { params: this.search }
            ).then((res) => {
                this.petitions = res.data;
            }).catch((err) => {
                this.$emit("error", err);
            });
        },

        getCategories: function()
        {
            this.$http.get("http://csse-s365.canterbury.ac.nz:4001/api/v1/petitions/categories")
            .then((res) => {
                this.categories = this.categories.splice(0, 1);

                for (const category of res.data) {
                    this.categories.push({
                        value: category.categoryId,
                        text: category.name
                    });
                }
            }).catch((err) => {
                this.$emit("error", err);
            });
        }
    },
    components: {
        "petition-small": petitionSmall
    }
}
</script>