<template>
    <div>
        <back-bar text="Back"></back-bar>

        <div style="max-width: 80rem;" class="m-2 w-75 mx-auto">
            <b-card no-body border-variant="" bg-variant="light">
                <b-img :src="$rootUrl + 'petitions/' + petition.petitionId + '/photo'" fluid center rounded>
                </b-img>
            </b-card>

            <div class="mt-3">
                <b-alert variant="danger" :show="petition.closeIn < 0">
                    Petition has closed!
                </b-alert>

                <b-alert variant="success" :show="checkSigned($user.userId)">
                    You've signed this petition!
                </b-alert>
            </div>

            <b-card :title="petition.title" :sub-title="'Category: ' + petition.category" bg-variant="light">
                <b-card-text>
                    {{ petition.description }}
                </b-card-text>

                <b-row>
                    <b-col>
                        <b-card-text>
                            Author:
                            <user-small style="width: 16rem;" class="mb-2"
                             :data="{name: petition.authorName, signatoryId: petition.authorId, 
                             city: petition.authorCity, country: petition.authorCountry}">
                            </user-small>
                        </b-card-text>
                    </b-col>

                    <b-col md="8">
                        <b-list-group style="max-width: 20rem">
                            Dates:
                            <b-list-group-item class="mt-2">
                                Created on {{ petition.createdDate }}
                            </b-list-group-item>

                            <b-list-group-item v-if="petition.closeIn">
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
                    <b-button variant="info" v-if="checkAuthored($user.userId)" 
                     :disabled="petition.closeIn < 0" :to="{ name: 'edit', params: { id: id }}">
                        <b-icon-pencil-square class="mr-1"></b-icon-pencil-square>
                        Edit
                    </b-button>

                    <b-button variant="info" v-else-if="petition.signed" 
                     :disabled="petition.closeIn < 0" @click="unsignPetition()">
                        <b-icon-person-dash-fill class="mr-1"></b-icon-person-dash-fill> 
                        Remove Signature
                    </b-button>

                    <b-button variant="info" :disabled="$user.userId == null || petition.closeIn < 0"
                     @click="signPetition()" v-else>
                        <b-icon-person-plus-fill class="mr-1"></b-icon-person-plus-fill> 
                        Sign
                    </b-button>

                    <b-button variant="info" v-b-modal.share :disabled="petition.closeIn < 0">
                        <b-icon-link45deg font-scale="1.3"></b-icon-link45deg>
                        Share
                    </b-button>
                </template>
            </b-card>

            <b-card class="text-center mt-3 w-100" bg-variant="light" no-body
             header-bg-variant="info" header-text-variant="white"
             footer-bg-variant="info" footer-text-variant="white">
                <template v-slot:header>
                    <h4>
                        Users who signed
                    </h4>
                    {{ petition.signatureCount }} signatures
                </template>

                <b-row class="text-left my-3 mx-auto">
                    <b-col v-for="user in signatures" :key="user.name" align-h="start">
                        <user-small :data="user" style="width: 16rem;" class="my-1"
                         :badge="getBadge(user, $user.userId)">
                        </user-small>
                    </b-col>
                </b-row>

                <template v-if="!petition.signed && !petition.closeIn < 0"
                 v-slot:footer>
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

        <b-modal id="share" centered header-bg-variant="info" header-text-variant="white"
         footer-bg-variant="light">
            <template v-slot:modal-title>
                <b-icon-link45deg></b-icon-link45deg>
                Share
            </template>



            <template v-slot:modal-footer="{ cancel }">
                <b-button variant="danger" @click="cancel()">
                    Cancel
                </b-button>
            </template>
        </b-modal>
    </div>
</template>

<script>
import userSmall from "./components/User-small"
import backBar from "./components/Back-bar"

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
            let str = date.toUTCString();
            return str.substr(0, 16) + " at " + str.substr(17, 5);
        }

        this.$http.get(
            this.$rootUrl + "petitions/" + this.id
        ).then((res) => {
            this.petition = res.data;
            this.petition.createdDate = formatDate(new Date(res.data.createdDate));

            if (this.petition.closingDate) {
                this.petition.closingDate = new Date(this.petition.closingDate);
                this.petition.closeIn = Math.round((this.petition.closingDate - Date.now()) / 86400000);
                this.petition.closingDate = formatDate(this.petition.closingDate);
            }

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
        getBadge(user, userId)
        {
            if (user.signatoryId === userId) {
                return "You";
            } else if (user.signatoryId === this.petition.authorId) {
                return "Author";
            } else {
                return null;
            }
        },
        checkSigned(userId)
        {
            for (const user of this.signatures) {
                if (user.signatoryId === userId) {
                    return this.petition.signed = true;
                }
            }
            return this.petition.signed = false;
        },
        checkAuthored(userId)
        {
            if (this.petition.authorId === userId) {
                return this.petition.authored = true;
            }
            return this.petition.authored = false;
        }
    },
    components: {
        "user-small": userSmall,
        "back-bar": backBar
    }
}
</script>