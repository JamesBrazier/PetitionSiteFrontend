<template>
    <div>
        <back-bar text="Back"></back-bar>

        <div style="max-width: 80rem;" class="m-2 w-75 mx-auto">
            <b-card no-body border-variant="light" bg-variant="light" footer-bg-variant="light">
                <b-img-lazy :src="$rootUrl + 'petitions/' + petition.petitionId + '/photo'" 
                 alt=" " fluid center rounded>
                </b-img-lazy>
            </b-card>

            <div class="mt-3">
                <b-alert variant="danger" :show="petition.closeIn < 0">
                    Petition has closed!
                </b-alert>

                <b-alert variant="success" :show="checkSigned($user.userId)">
                    You've signed this petition!
                </b-alert>
            </div>

            <b-card :title="petition.title" :sub-title="'Category: ' + petition.category" 
             bg-variant="light">
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
                        :disabled="petition.closeIn < 0" :to="{ name: 'edit petition', params: { id: id }}">
                        <b-icon-pencil-square class="mr-1"></b-icon-pencil-square>
                        Edit
                    </b-button>

                    <b-button variant="info" v-else-if="petition.signed" 
                     :disabled="petition.closeIn < 0" @click="unsign()">
                        <b-icon-person-dash-fill class="mr-1"></b-icon-person-dash-fill> 
                        Remove Signature
                    </b-button>

                    <b-button variant="info" :disabled="$user.userId == null || petition.closeIn < 0"
                     @click="sign()" v-else>
                        <b-icon-person-plus-fill class="mr-1"></b-icon-person-plus-fill> 
                        Sign
                    </b-button>

                    <b-button variant="info" v-b-modal.share :disabled="petition.closeIn < 0">
                        <b-icon-link45deg font-scale="1.3"></b-icon-link45deg>
                        Share
                    </b-button>

                    <b-button variant="danger" v-if="petition.authored" v-b-modal.confirm>
                        <b-icon-x-square class="mr-1"></b-icon-x-square>
                        Delete
                    </b-button>
                </template>
            </b-card>

            <b-card class="text-center mt-3" bg-variant="light" no-body
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

                <template v-if="!petition.signed && (!petition.closeIn || petition.closeIn >= 0)"
                 v-slot:footer>
                    <h4>
                        Sign Petition?
                    </h4>
                    <b-button class="my-auto" variant="light" :disabled="$user.userId == null"
                     @click="sign()">
                        Join the effort! Add yours
                    </b-button>
                </template>
            </b-card>
        </div>

        <modal id="share">
            <template v-slot:title>
                <b-icon-link45deg></b-icon-link45deg>
                Share
            </template>

            <div class="text-center">
                <share-button site="facebook" :link="link"></share-button>
                <share-button site="twitter" :link="link"></share-button>
                <share-button site="linkedin" :link="link"></share-button>
                <share-button site="reddit" :link="link"></share-button>
                <share-button site="email" :link="link"></share-button>

                <b-input-group prepend="Link" class="mt-3">
                    <b-input :value="link" placeholder="Link" id="share-link">Link</b-input>

                    <b-input-group-append>
                        <b-button variant="info" @click="copyToClipboard(); shared = true">
                            Copy
                        </b-button>
                    </b-input-group-append>
                </b-input-group>

                <b-alert class="mt-3 mb-0" variant="success" :show="shared" dismissible
                 @dismissed="shared = false">
                    Link copied to clipboard!
                </b-alert>
            </div>

            <template v-slot:footer="{ cancel }">
                <b-button variant="danger" @click="cancel(); shared = false">
                    Back
                </b-button>
            </template>
        </modal>

        <modal id="confirm">
            <template v-slot:title>
                Confirmation
            </template>

            <h5>Are you sure you want to delete this petition?</h5>
            This action is irreversible!

            <template v-slot:footer="{ cancel }">
                <b-button variant="danger" @click="remove(); cancel()">
                    <b-icon-x-square class="mr-1"></b-icon-x-square>
                    Delete
                </b-button>

                <b-button variant="danger" @click="cancel()">
                    Cancel
                </b-button>
            </template>
        </modal>
    </div>
</template>

<script>
import image from "./components/Image"
import userSmall from "./components/User-small"
import backBar from "./components/Back-bar"
import shareButton from "./components/Share-button"
import modal from "./components/Modal"

export default {
    data() {
        return {
            petition: {},
            signatures: [],
            shareLinkElement: null,
            shared: false,
            link: "https://canterbury.ac.nz/petitions/" + this.id
        }
    },
    props: ["id"],
    mounted() 
    {
        this.$http.get(
            this.$rootUrl + "petitions/" + this.id
        ).then((res) => {
            this.petition = res.data;
            
            this.petition.createdDate = this.$format.date(new Date(this.petition.createdDate));

            if (this.petition.closingDate) {
                this.petition.closingDate = new Date(this.petition.closingDate);
                this.petition.closeIn = 
                    Math.round((this.petition.closingDate - Date.now()) / 86400000);
                this.petition.closingDate = this.$format.date(this.petition.closingDate);
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
        sign()
        {
            this.$http.post(
                this.$rootUrl + "petitions/" + this.id + "/signatures",
                null,
                { headers: {
                    "X-Authorization": this.$user.token
                }}
            ).then((res) => {
                this.getSignatures(); //change
            }).catch((err) => {
                this.$throwErr(err);
            });
        },
        unsign()
        {
            this.$http.delete(
                this.$rootUrl + "petitions/" + this.id + "/signatures",
                { headers: {
                    "X-Authorization": this.$user.token
                }}
            ).then((res) => {
                this.getSignatures(); //change
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
        },
        remove()
        {
            this.$http.delete(
                this.$rootUrl + "petitions/" + this.id,
                { headers: {
                    "X-Authorization": this.$user.token
                }}
            ).then((res) => {
                this.$router.replace({ name: 'home' });
            }).catch((err) => {
                this.$throwErr(err);
            });
        },
        copyToClipboard(id)
        {
            if (this.shareLinkElement == null) {
                this.shareLinkElement = document.getElementById(id);
            }
            this.shareLinkElement.select();
            document.execCommand("copy");
        }
    },
    components: {
        "my-image": image,
        "user-small": userSmall,
        "back-bar": backBar,
        "share-button": shareButton,
        "modal": modal
    }
}
</script>