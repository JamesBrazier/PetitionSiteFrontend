<template>
    <div>
        <b-navbar variant="light" type="dark" fixed>
            <b-button @click="$router.go(-1)" variant="danger">
                Back
            </b-button>
        </b-navbar>

        <div style="max-width: 80rem;" class="m-2 w-75 mx-auto">
            <b-card :title="petition.title" :sub-title="'Category: ' + petition.category" bg-variant="light"
             :img-src="$rootUrl + 'petitions/' + petition.petitionId + '/photo'">
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

                    <b-col md="8">
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
                    <b-button variant="info" v-if="checkSigned($user.userId)" 
                     :disabled="petition.closeIn < 0" @click="unsignPetition()">
                        Remove Signature
                    </b-button>
                    
                    <b-button variant="info" :disabled="$user.userId == null || petition.closeIn < 0"
                     @click="signPetition()" v-else>
                        Sign
                    </b-button>

                    <b-button @click="$router.go(-1)" variant="danger">
                        Back
                    </b-button>
                </template>
            </b-card>

            <b-card class="text-center mt-4 w-100" bg-variant="light" no-body
             header-bg-variant="info" header-text-variant="white"
             footer-bg-variant="info" footer-text-variant="white">
                <template v-slot:header>
                    <h4>
                        Users who signed
                    </h4>
                    {{ petition.signatureCount }} signatures
                </template>

                <b-row class="my-3 mx-auto">
                    <b-col v-for="user in signatures" :key="user.name" left>
                        <user-small :data="user" style="width: 16rem;" class="my-1"
                         :badge="user.signatoryId === petition.authorId ? 'Author' : null">
                        </user-small>
                    </b-col>
                </b-row>

                <template v-if="!petition.signed && petition.closeIn >= 0" v-slot:footer>
                    <h4>
                        Sign Petition?
                    </h4>
                    <b-button class="my-auto" variant="light" :disabled="$user.userId == null"
                     @click="signPetition()">
                        Join the effort! Add yours
                    </b-button>
                </template>
            </b-card>
        </div>
    </div>
</template>

<script>
import userSmall from "./components/User-small"

export default {
    data() {
        return {
            petition: {},
            signatures: []
        }
    },
    props: ["id"],
    mounted() 
    {
        function formatDate(date)
        {
            let str = new Date(date).toUTCString();
            return str.substr(0, 16) + " at " + str.substr(17, 5);
        }

        this.$http.get(
            this.$rootUrl + "petitions/" + this.id
        ).then((res) => {
            this.petition = res.data;
            this.petition.closeIn = Math.round((new Date(res.data.closingDate) - Date.now()) / 86400000);
            this.petition.createdDate = formatDate(res.data.createdDate);
            this.petition.closingDate = formatDate(res.data.closingDate);

            this.getSignatures();
        }).catch((err) => {
            this.$throwErr(err);
        });
    },
    methods: {
        getSignatures()
        {
            this.$http.get(
                this.$rootUrl + "petitions/" + this.id + "/signatures"
            ).then((res) => {
                this.signatures = res.data;
            }).catch((err) => {
                this.$throwErr(err);
            });
        },
        signPetition()
        {
            this.$http.post(
                this.$rootUrl + "petitions/" + this.id + "/signatures",
                null,
                { headers: {
                    "X-Authorization": this.$user.token
                }}
            ).then((res) => {
                this.getSignatures();
            }).catch((err) => {
                this.$throwErr(err);
            });
        },
        unsignPetition()
        {
            this.$http.delete(
                this.$rootUrl + "petitions/" + this.id + "/signatures",
                { headers: {
                    "X-Authorization": this.$user.token
                }}
            ).then((res) => {
                this.getSignatures();
            }).catch((err) => {
                this.$throwErr(err);
            });
        },
        checkSigned(userId)
        {
            for (const user of this.signatures) {
                if (user.signatoryId === userId) {
                    return this.petition.signed = true;
                }
            }
            return this.petition.signed = false;
        }
    },
    components: {
        "user-small": userSmall
    }
}
</script>