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

                <b-form-group label="Number to Show:" label-for="srch-n">
                    <b-input-group prepend="#">
                        <b-form-input id="srch-n" v-model="search.count" placeholder="Number..."></b-form-input>
                    </b-input-group>
                </b-form-group>

                <b-form-group label="Number to Skip:" label-for="srch-s">
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

        <b-sidebar id="profile" title="Sign in" variant="info" shadow lazy right>

        </b-sidebar>

        <b-alert v-for="(error, index) in errors" :key="error.message"
         dismissible @dismissed="errors.splice(index, 1)" variant="danger" show>
            Error: {{ error.message }}
        </b-alert>

        <b-navbar variant="info" type="dark" toggleable sticky>
            <b-navbar-brand left>
                Petitions
            </b-navbar-brand>

            <b-button v-if="user == null" variant="light" v-b-toggle.profile>
                <b-icon-people-circle></b-icon-people-circle>
                Sign in
            </b-button>

            <b-dropdown v-else :text="user.name" variant="light" right>
                <b-dropdown-item>
                    <router-link :to="{ name: 'user', params: { id: 6 } }">
                        Account
                    </router-link>
                </b-dropdown-item>
                <b-dropdown-item>
                    Logout
                </b-dropdown-item>
            </b-dropdown>
        </b-navbar>

        <b-navbar variant="light" type="dark" fixed>
            <b-button v-if="viewing == null" variant="info" v-b-toggle.filter @click="getCategories()">
                <b-icon-filter></b-icon-filter>
            </b-button>

            <b-button v-else variant="info" @click="setViewing(0)">Back</b-button>

            <b-nav-form><b-input-group class="mx-3" v-if="!advFilter && viewing == null">
                <b-form-input v-model="search.q" placeholder="Search..."></b-form-input>
                <b-input-group-append>
                    <b-button variant="info" @click="getFilteredPetitions"><b-icon-search></b-icon-search></b-button>
                </b-input-group-append>
            </b-input-group></b-nav-form>
        </b-navbar>

        <div v-if="viewing == null">
            <div v-for="(petition) in petitions" :key="petition.title" class="my-2">
                <b-card style="max-width: 60rem;" class="w-75 mx-auto" v-b-tooltip="'Click for details'"
                :img-src="'http://csse-s365.canterbury.ac.nz:4001/api/v1/petitions/' + petition.petitionId + '/photo'"
                :title="petition.title" :sub-title="'Author: ' + petition.authorName"
                @click="setViewing(petition.petitionId)">
                    <b-card-text>
                        {{ petition.signatureCount }} signatures
                    </b-card-text>
                </b-card>
            </div>
        </div>

        <div v-else class="my-2">
            <b-card style="max-width: 60rem;" class="w-75 mx-auto"
             :img-src="'http://csse-s365.canterbury.ac.nz:4001/api/v1/petitions/' + viewing.petitionId + '/photo'"
             :title="viewing.title" :sub-title="viewing.signatureCount + ' signatures'">
                <b-card-text>
                    {{ viewing.description }}
                </b-card-text>
                <b-button variant="info" @click="setViewing(0)">Back</b-button>
            </b-card>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            errors: [],
            petitions: [],
            viewing: null,
            user: null,
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
            }
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
                console.error(err);
                this.errors.push(err);
            });
        },

        getFilteredPetitions: function()
        {
            for (const field in this.search) {
                if (this.search[field] === "") 
                    this.search[field] = undefined;
            }

            this.$http.get("http://csse-s365.canterbury.ac.nz:4001/api/v1/petitions",
                { params: this.search }
            ).then((res) => {
                this.petitions = res.data;
            }).catch((err) => {
                console.error(err);
                this.errors.push(err);
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
                console.error(err);
                this.errors.push(err);
            });
        },

        setViewing: function(id)
        {
            if (id > 0) {
                this.$http.get("http://csse-s365.canterbury.ac.nz:4001/api/v1/petitions/" + id)
                .then((res) => {
                    this.viewing = res.data;
                }).catch((err) => {
                    console.error(err);
                    this.errors.push(err);
                });
            } else {
                this.viewing = null;
            }
        },

        signPetition: function()
        {

        }
    },
    computed: {
        checkNumber()
        {
            return this.search.count == null || 
                   this.search.count === "" || 
                   Number(this.search.count) === NaN;
        }
    }
}
</script>