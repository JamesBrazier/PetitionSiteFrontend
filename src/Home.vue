<template>
    <div>
        <b-sidebar v-model="advFilter" id="filter" title="Filter Petitions" variant="info" shadow lazy>
            <div class="m-3">
                <input-field label="Title:" type="search" v-model="search.q" placeholder="Search...">
                </input-field>

                <b-form-group label="Category:">
                    <b-form-select v-model="search.categoryId" :options="categories">
                    </b-form-select>
                </b-form-group>

                <b-form-group label="Order:">
                    <b-form-select v-model="search.sortBy" :options="orderings">
                    </b-form-select>
                </b-form-group>

                <input-field label="Number Per Page:" :state="validNum(pages.limit)" prepend="#"
                 invalid="Please input a number" v-model="pages.limit" placeholder="Number...">
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

            <b-button variant="success" :disabled="$user.userId == null" :to="{ name: 'create petition' }">
                <b-icon-plus-circle class="mr-1"></b-icon-plus-circle>
                Create Petition
            </b-button>
        </b-navbar>

        <pagination v-model="pages.number" :per-page="parseInt(pages.limit)" :limit="5" 
         :total="pages.total" @input="filterPetitions" class="mt-2"></pagination>

        <petition-small v-for="petition in listPetitions" :key="petition.title"
            @click="$router.push({ name: 'petition', params: { id: petition.petitionId }})"
            :data="petition" style="max-width: 60rem;" class="mt-2 mb-3 w-75 mx-auto">
        </petition-small>

        <p v-if="listPetitions.length < 1" class="text-center mt-5">
            No petitions match search criteria
        </p>
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
            listPetitions: [],
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
                text: "Alphabetical Z -> A"
            },{
                value: "ALPHABETICAL_ASC",
                text: "Alphabetical A -> Z"
            }],
            pages: {
                number: 0,
                total: 0,
                limit: 10
            },
            search: {
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
            this.petitions = res.data;
        }).catch((err) => {
            this.$throwErr(err);
        });
    },
    methods: {
        getPetitions()
        {
            this.pages.number = 0;
            if (isNaN(this.pages.limit)) {
                return;
            }

            if (this.search.q === "") {
                this.search.q = undefined;
            }

            this.$http.get(this.$rootUrl + "petitions",
                { params: this.search }
            ).then((res) => {
                this.pages.total = res.data.length;
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
            if (!isNaN(num) || num === undefined) {
                return true;
            }
            return false;
        }
    },
    computed: {
        filterPetitions()
        {
            this.listPetitions = [];
            let end = this.pages.number + this.pages.limit;

            for (let i = this.pages.number; i < end; ++i) {
                if (this.petitions[i] != null) {
                    this.listPetitions.push(this.petitions[i]);
                }
            }
        },
    },
    components: {
        "petition-small": petitionSmall,
        "input-field": inputField,
        pagination
    }
}
</script>