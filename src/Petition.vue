<template>
    <div>
        <b-navbar variant="light" type="dark" fixed>
            <b-button @click="$router.go(-1)" variant="danger">
                Back
            </b-button>
        </b-navbar>

        <div style="max-width: 80rem;" class="m-2 w-75 mx-auto">
            <b-card :title="petition.title" :sub-title="'Category: ' + petition.category"
             :img-src="'http://csse-s365.canterbury.ac.nz:4001/api/v1/petitions/' + petition.petitionId + '/photo'">
                <b-alert variant="danger" :show="petition.closeIn < 0">
                    Petition has closed!
                </b-alert>
                
                <b-card-text>
                    {{ petition.description }}
                </b-card-text>

                <b-row>
                    <b-col>
                        <b-card-text>
                            Author:
                            <user-small style="width: 16rem;" class="my-2"
                             :data="{name: petition.authorName, signatoryId: petition.authorId, 
                             city: petition.authorCity, country: petition.authorCountry}">
                            </user-small>
                        </b-card-text>
                    </b-col>

                    <b-col md="7">
                        <b-list-group style="max-width: 20rem" class="mt-3">
                            Dates:
                            <b-list-group-item class="mt-2">
                                Created on {{ petition.createdDate }}
                            </b-list-group-item>

                            <b-list-group-item>
                                {{ 
                                    petition.closeIn >= 0 ?
                                    "Closing on " + petition.closingDate + " (in " + petition.closeIn + " days)" :
                                    "Closed on " + petition.closingDate + " (" + (-petition.closeIn) + " days ago)"
                                }}
                            </b-list-group-item>
                        </b-list-group>
                    </b-col>
                </b-row>

                <template v-slot:footer>
                    <b-button variant="info" :disabled="petition.closeIn < 0">
                        Sign
                    </b-button>

                    <b-button @click="$router.go(-1)" variant="danger">
                        Back
                    </b-button>
                </template>
            </b-card>

            <b-card class="text-center mt-4 w-100" text-variant="white" bg-variant="info"
             title="Users who have signed">
                {{ petition.signatureCount }} signatures
            </b-card>

            <b-card-group deck class="mx-auto">
                <user-small v-for="user in signatures" :key="user.name" 
                 :data="user" style="width: 16rem;" class="my-2"></user-small>

                <b-card v-if="petition.closeIn >= 0" style="max-width: 16rem; height: 9rem;"
                 class="text-center my-2" title="Sign Petition?" bg-variant="info"
                 text-variant="white">
                    <b-button class="my-auto" variant="light">
                        Join the effort! Add yours
                    </b-button>
                </b-card>
            </b-card-group>
        </div>
    </div>
</template>

<script>
import userSmall from "./components/User-small"

export default {
    data () {
        return {
            petition: {},
            signatures: []
        }
    },
    mounted: function() 
    {
        function formatDate(date)
        {
            let str = new Date(date).toUTCString();
            return str.substr(0, 16) + " at " + str.substr(17, 5);
        }

        this.$http.get(
            "http://csse-s365.canterbury.ac.nz:4001/api/v1/petitions/" + this.$route.params.id
        ).then((res) => {
            this.petition = res.data;
            this.petition.closeIn = Math.round((new Date(res.data.closingDate) - Date.now()) / 86400000);
            this.petition.createdDate = formatDate(res.data.createdDate);
            this.petition.closingDate = formatDate(res.data.closingDate);

            this.$http.get(
                "http://csse-s365.canterbury.ac.nz:4001/api/v1/petitions/" + this.$route.params.id + "/signatures"
            ).then((res) => {
                this.signatures = res.data;
            }).catch((err) => {
                this.$emit("error", err);
            });
        }).catch((err) => {
            this.$emit("error", err);
        });
    },
    methods: {

    },
    components: {
        "user-small": userSmall
    }
}
</script>