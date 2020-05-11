<template>
    <div>
        <b-sidebar v-model="advFilter" id="filter" title="Filter Petitions" variant="info" shadow>
            <b-form>
            </b-form>
        </b-sidebar>

        <b-alert v-for="(error, index) in errors" :key="error"
         dismissible @dismissed="error.remove(index)" variant="danger" show>
            Error: {{ error.message }}
        </b-alert>

        <b-navbar variant="info" type="dark" toggleable sticky>
            <b-navbar-brand left>
                Petitions
            </b-navbar-brand>

            <b-dropdown text="User" variant="light" right>
                <b-dropdown-item>
                    <router-link :to="{ name: 'user', params: { id: 6 } }">
                        Account
                    </router-link>
                </b-dropdown-item>
            </b-dropdown>
        </b-navbar>
        <b-navbar variant="light" type="dark" fixed>
            <b-button variant="info" v-b-toggle.filter>
                <b-icon-filter></b-icon-filter>
            </b-button>

            <b-nav-form class="mx-3" v-if="!advFilter">
                <b-form-input v-model="search.text" placeholder="Search"></b-form-input>
                <b-button variant="info"><b-icon-search></b-icon-search></b-button>
            </b-nav-form>
        </b-navbar>

        <div v-for="(petition) in petitions" :key="petition" class="my-2">
            <b-card class="w-75 mx-auto" 
            :img-src="'http://csse-s365.canterbury.ac.nz:4001/api/v1/petitions/' + petition.petitionId + '/photo'"
            :title="petition.title" :sub-title="'Author: ' + petition.authorName">
                <b-card-text>
                    Signatures: {{ petition.signatureCount }}
                </b-card-text>
                <b-button variant="info" size="sm" @click="signPetition">
                    Sign
                </b-button>
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
            advFilter: false,
            search: {
                text: ""
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
                console.log(res.data);
                this.petitions = res.data;
            }).catch((err) => {
                this.errors.push(err);
            })
        },

        signPetition: function()
        {

        }
    }
}
</script>