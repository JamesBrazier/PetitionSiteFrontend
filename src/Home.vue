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

                <input-field label="Number Per Page:" :state="validNum(search.count)" prepend="#"
                 invalid="Please input a number" v-model="search.count" placeholder="Number...">
                </input-field>

                <b-button variant="info" @click="getPetitions(0)" v-b-toggle.filter>Apply</b-button>
                <b-button variant="danger" v-b-toggle.filter>Cancel</b-button>
            </div>
        </b-sidebar>

        <b-navbar variant="light" type="dark" border-variant="info" style="z-index: 1;" toggleable sticky>
            <b-nav-form>
                <b-button variant="info" v-b-toggle.filter @click="getCategories()">
                    <b-icon-funnel-fill></b-icon-funnel-fill>
                </b-button>

                <b-input-group class="mx-3" v-if="!advFilter">
                    <b-form-input type="search" v-model="search.q" placeholder="Search..."></b-form-input>

                    <b-input-group-append>
                        <b-button variant="info" @click="getPetitions(0)">
                            <b-icon-search></b-icon-search>
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-nav-form>

            <b-button variant="success" :disabled="$user.userId == null" :to="{ name: 'create' }">
                <b-icon-plus-circle class="mr-1"></b-icon-plus-circle>
                Create Petition
            </b-button>
        </b-navbar>

        <pagination v-model="search.startIndex" :perPage="pages.per" limit="5" :total="pages.total" 
         class="mt-2" @input="getPetitions(search.startIndex)"></pagination>

        <div v-for="petition in petitions" :key="petition.title" class="mt-2 mb-3">
            <petition-small @click="$router.push({ name: 'petition', params: { id: petition.petitionId }})"
             :data="petition" style="max-width: 60rem;" class="w-75 mx-auto">
            </petition-small>
        </div>
    </div>
</template>

<script>
import petitionSmall from "./components/Petition-small.vue"
import inputField from "./components/Input-field.vue"
import pagination from "./components/Pagination.vue"

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
            pages: {
                total: 0,
                per: 20
            },
            search: {
                startIndex: 0,
                count: 20,
                q: "",
                categoryId: null,
                sortBy: "SIGNATURES_DESC"
            }
        }
    },
    mounted() 
    {
        this.$http.get(this.$rootUrl + "petitions"
        ).then((res) => {
            this.pages.total = res.data.length;
            this.petitions = res.data.slice(0, this.search.count);
        }).catch((err) => {
            this.$throwErr(err);
        });
    },
    methods: {
        getPetitions(start)
        {
            if (isNaN(this.search.count)) {
                return;
            } else if (this.search.count === "") {
                this.search.count = undefined;
            }
            this.pages.per = parseInt(this.search.count);

            this.search.startIndex = start;

            if (this.search.q === "") {
                this.search.q = undefined;
            }

            this.$http.get(this.$rootUrl + "petitions",
                { params: this.search }
            ).then((res) => {
                this.petitions = res.data;
            }).catch((err) => {
                this.$throwErr(err);
            });
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
        "input-field": inputField,
        pagination
    }
}
</script>