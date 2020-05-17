<template>
    <div>
        <b-sidebar v-model="advFilter" id="filter" title="Filter Petitions" variant="info" shadow lazy>
            <div class="m-3">
                <input-field label="Title:" type="search" v-model="search.q" placeholder="Search...">
                </input-field>

                <b-form-group label="Category:" label-for="srch-c">
                    <b-form-select id="srch-c" v-model="search.categoryId" :options="categories">
                    </b-form-select>
                </b-form-group>

                <b-form-group label="Order:" label-for="srch-o">
                    <b-form-select id="srch-o" v-model="search.sortBy" :options="orderings">
                    </b-form-select>
                </b-form-group>

                <input-field label="Number to Show:" :state="validNum(search.count)" prepend="#"
                 invalid="Please input a number" v-model="search.count" placeholder="Number...">
                </input-field>

                <input-field label="Number to Skip:" :state="validNum(search.startIndex)" prepend="#"
                 invalid="Please input a number" v-model="search.startIndex" placeholder="Start after...">
                </input-field>

                <b-button variant="info" @click="getPetitions()" v-b-toggle.filter>Apply</b-button>
                <b-button variant="danger" v-b-toggle.filter>Cancel</b-button>
            </div>
        </b-sidebar>

        <b-navbar variant="light" type="dark" border-variant="info" fixed>
            <b-button variant="info" v-b-toggle.filter @click="getCategories()">
                <b-icon-filter></b-icon-filter>
            </b-button>

            <b-nav-form>
                <b-input-group class="mx-3" v-if="!advFilter">
                    <b-form-input type="search" v-model="search.q" placeholder="Search..."></b-form-input>

                    <b-input-group-append>
                        <b-button variant="info" @click="getPetitions()">
                            <b-icon-search></b-icon-search>
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-nav-form>
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
import inputField from "./components/input-field.vue"

export default {
    data() {
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
                startIndex: "",
                count: 20,
                q: "",
                categoryId: null,
                sortBy: "SIGNATURES_DESC"
            }
        }
    },
    mounted() 
    {
        this.$http.get(this.$rootUrl + "petitions",
        {params: {
            count: 20
        }} 
        ).then((res) => {
            this.petitions = res.data;
        }).catch((err) => {
            this.$throwErr(err);
        });
    },
    methods: {
        getPetitions()
        {
            let valid = true;

            if (isNaN(this.search.startIndex)) {
                valid = false;
            } else if (this.search.startIndex === "") {
                this.search.startIndex = undefined;
            }

            if (isNaN(this.search.count)) {
                valid = false;
            } else if (this.search.count === "") {
                this.search.count = undefined;
            }

            if (this.search.q === "") {
                this.search.q = undefined;
            }

            if (valid) {
                this.$http.get(this.$rootUrl + "petitions",
                    { params: this.search }
                ).then((res) => {
                    this.petitions = res.data;
                }).catch((err) => {
                    this.$throwErr(err);
                });
            }
        },
        getCategories()
        {
            this.$http.get(this.$rootUrl + "petitions/categories")
            .then((res) => {
                this.categories = this.categories.splice(0, 1);

                for (const category of res.data) {
                    this.categories.push({
                        value: category.categoryId,
                        text: category.name
                    });
                }
            }).catch((err) => {
                this.$throwErr(err);
            });
        },
        validNum(num)
        {
            return !isNaN(num) || num === undefined; 
        }
    },
    components: {
        "petition-small": petitionSmall,
        "input-field": inputField
    }
}
</script>