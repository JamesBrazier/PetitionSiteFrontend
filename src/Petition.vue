<template>
    <div>
        <back-bar text="Back"></back-bar>

        <div style="max-width: 80rem;" class="m-2 w-75 mx-auto">
            <b-card no-body border-variant="light" bg-variant="light" footer-bg-variant="light">
                <b-img-lazy :src="$rootUrl + 'petitions/' + petition.petitionId + '/photo'" 
                 fluid center rounded>
                </b-img-lazy>

                <template v-if="mode !== 0" v-slot:footer>
                    <upload></upload>
                </template>
            </b-card>

            <div v-if="mode === 0" class="mt-3">
                <b-alert variant="danger" :show="petition.closeIn < 0">
                    Petition has closed!
                </b-alert>

                <b-alert variant="success" :show="checkSigned($user.userId)">
                    You've signed this petition!
                </b-alert>
            </div>

            <b-card v-if="mode !== 0" class="mt-3" bg-variant="light">
                <input-field label="Title:" v-model="petitionEdit.title" :state="valid.title"
                 invalid="Please enter a title"></input-field>

                <b-form-group label="Category:" :state="valid.category"
                 invalid-feedback="Please select a category">
                    <b-form-select :options="categories" v-model="petitionEdit.categoryId" 
                     style="max-width: 25rem;" :state="valid.category ? null : false"></b-form-select>
                </b-form-group>

                <b-form-group label="Description:" :state="valid.description"
                 invalid-feedback="Please enter a description">
                    <b-form-textarea v-model="petitionEdit.description" rows="10"
                     :state="valid.description ? null : false"></b-form-textarea>
                </b-form-group>

                <b-form-group label="Closing Date:" :state="valid.closingDate"
                 invalid-feedback="Please enter a closing date in the future or disable">
                    <b-form-checkbox variant="info" v-if="mode === 2" v-model="closingDateSet"
                     class="mb-1" inline switch>
                        {{ closingDateSet ? 'Closes on' : 'No closing date' }}
                    </b-form-checkbox>

                    <b-form-datepicker variant="info" :min="petition.createdDate" selected-variant="info"
                     style="max-width: 25rem;" v-model="petitionEdit.closingDate" 
                     :disabled="!closingDateSet" :state="valid.closingDate ? null : false" value-as-date>
                    </b-form-datepicker>
                </b-form-group>

                <template v-slot:footer>
                    <b-button v-if="mode === 2" variant="info" @click="postNew()">
                        Create
                    </b-button>

                    <div v-else>
                        <b-button variant="info" @click="postUpdate()">
                            Save
                        </b-button>

                        <b-button variant="danger" @click="mode = 0">
                            Cancel
                        </b-button>
                    </div>
                </template>
            </b-card>

            <b-card v-else :title="petition.title" :sub-title="'Category: ' + petition.category" 
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
                                Created on {{ petition.createdDatePretty }}
                            </b-list-group-item>

                            <b-list-group-item v-if="petition.closeIn">
                                {{ 
                                    petition.closeIn >= 0 ?
                                    "Closing on " + petition.closingDatePretty + " (in " + petition.closeIn + " days)" :
                                    "Closed on " + petition.closingDatePretty + " (" + (-petition.closeIn) + " days ago)"
                                }}
                            </b-list-group-item>
                        </b-list-group>
                    </b-col>
                </b-row>

                <template v-slot:footer>
                    <b-button variant="info" v-if="checkAuthored($user.userId)" 
                        :disabled="petition.closeIn < 0" @click="setEditing()">
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

            <b-card v-if="mode === 0" class="text-center mt-3" bg-variant="light" no-body
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
                        <b-button variant="info" @click="copyToClipboard('share-link'); shared = true">
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
import userSmall from "./components/User-small"
import backBar from "./components/Back-bar"
import shareButton from "./components/Share-button"
import inputField from "./components/Input-field"
import modal from "./components/Modal"
import upload from "./components/Upload"

const Viewing = 0, Editing = 1, Creating = 2;

export default {
    data() {
        return {
            mode: Viewing,
            petition: {},
            petitionEdit: {},
            closingDateSet: false,
            signatures: [],
            valid: {
                title: true,
                category: true,
                description: true,
                closingDate: true
            },
            categories: [{
                value: null,
                text: "Category...",
                disabled: true
            }],
            shared: false,
            link: "https://canterbury.ac.nz/petitions/" + this.id
        }
    },
    props: ["id"],
    mounted() 
    {
        this.setup();
    },
    watch: {
        id: function(old, _)
        {
            this.setup();
        }
    },
    methods: {
        formatDate(date)
        {
            let str = date.toUTCString();
            return str.substr(0, 16) + " at " + str.substr(17, 5);
        },
        setup() {
            if (this.id == null) {
                this.setCreating();
            } else {
                this.mode = Viewing;
                
                this.$http.get(
                    this.$rootUrl + "petitions/" + this.id
                ).then((res) => {
                    this.petition = res.data;
                    this.setupDates();
                    this.getSignatures();
                }).catch((err) => {
                    this.$throwErr(err);
                });
            }
        },
        setupDates()
        {
            this.petition.createdDate = new Date(this.petition.createdDate);
            this.petition.createdDatePretty = this.formatDate(this.petition.createdDate);

            if (this.petition.closingDate) {
                this.petition.closingDate = new Date(this.petition.closingDate);
                this.petition.closeIn = 
                    Math.round((this.petition.closingDate - Date.now()) / 86400000);
                this.petition.closingDatePretty = this.formatDate(this.petition.closingDate);
            }
        },
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
                this.getSignatures();
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
        },
        setEditing()
        {
            this.$http.get(
                this.$rootUrl + "petitions/categories"
            ).then((res) => {
                this.petitionEdit = {
                    title: this.petition.title,
                    description: this.petition.description,
                    categoryId: undefined,
                    closingDate: this.petition.closingDate
                }

                this.closingDateSet = this.petition.closingDate != null;
            
                for (const category of res.data) {
                    if (category.name === this.petition.category) {
                        this.petitionEdit.categoryId = category.categoryId;
                    }

                    this.categories.push({ value: category.categoryId, text: category.name });
                }

                this.mode = Editing;
            }).catch((err) => {
                this.$throwErr(err);
            });
        },
        setCreating()
        {
            this.$http.get(
                this.$rootUrl + "petitions/categories"
            ).then((res) => {
                this.petitionEdit = {
                    title: "",
                    description: "",
                    categoryId: null,
                    closingDate: undefined
                }
            
                for (const category of res.data) {
                    this.categories.push({ value: category.categoryId, text: category.name });
                }

                this.mode = Creating;
            }).catch((err) => {
                this.$throwErr(err);
            });
        },
        validate()
        {
            let valid = true;

            if (this.petitionEdit.title === "") {
                this.valid.title = false;
                valid = false;
            } else {
                this.valid.title = true;
            }

            if (this.petitionEdit.categoryId == null) {
                this.valid.category = false;
                valid = false;
            } else {
                this.valid.category = true;
            }

            if (this.petitionEdit.description === "") {
                this.valid.description = false;
                valid = false;
            } else {
                this.valid.description = true;
            }

            if (this.closingDateSet && (this.petitionEdit.closingDate == null ||
                this.petitionEdit.closingDate <= Date.now())) 
            {
                this.valid.closingDate = false;
                valid = false;
            } else {
                this.valid.closingDate = true;
            }

            if (valid && this.petitionEdit.closingDate) {
                let str = this.petitionEdit.closingDate.toISOString();
                this.petitionEdit.closingDate = str.substr(0, 10) + ' ' + str.substr(11, 12);
            }

            return valid;
        },
        postUpdate()
        {
            if (this.validate()) {
                this.$http.patch(
                    this.$rootUrl + "petitions/" + this.id,
                    this.petitionEdit,
                    { headers: {
                        "X-Authorization": this.$user.token
                    }}
                ).then((res) => {
                    this.petition = {...this.petition, ...this.petitionEdit};
                    this.setupDates();
                    this.mode = Viewing;
                }).catch((err) => {
                    this.$throwErr(err);
                });
            }
        },
        postNew()
        {
            if (this.validate()) {
                this.$http.post(
                    this.$rootUrl + "petitions",
                    this.petitionEdit,
                    { headers: {
                        "X-Authorization": this.$user.token
                    }}
                ).then((res) => {
                    this.$http.post(
                        this.$rootUrl + "petitions/" + res.data.petitionId + "/signatures",
                        null,
                        { headers: {
                            "X-Authorization": this.$user.token
                        }}
                    ).then((_) => {
                        this.$router.replace({ name: 'petition', params: { id: res.data.petitionId } });
                    }).catch((err) => {
                        this.$throwErr(err);
                    });
                }).catch((err) => {
                    this.$throwErr(err);
                });
            }
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
            document.getElementById(id).select();
            document.execCommand("copy");
        }
    },
    components: {
        "user-small": userSmall,
        "back-bar": backBar,
        "share-button": shareButton,
        "input-field": inputField,
        modal,
        upload
    }
}
</script>