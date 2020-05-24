<template>
    <div>
        <back-bar text="Cancel"></back-bar>

        <div style="max-width: 80rem;" class="m-2 w-75 mx-auto">
            <upload v-model="image" :base-img="$rootUrl + 'petitions/' + id + '/photo'"
             :reset="!creating"></upload>

            <b-card class="mt-3" bg-variant="light">
                <input-field label="Title:" v-model="petition.title" :state="valid.title"
                 invalid="Please enter a title"></input-field>

                <b-form-group label="Category:" :state="valid.category"
                 invalid-feedback="Please select a category">
                    <b-form-select :options="categories" v-model="petition.categoryId" 
                     style="max-width: 25rem;" :state="valid.category ? null : false"></b-form-select>
                </b-form-group>

                <b-form-group label="Description:" :state="valid.description"
                 invalid-feedback="Please enter a description">
                    <b-form-textarea v-model="petition.description" rows="10"
                     :state="valid.description ? null : false"></b-form-textarea>
                </b-form-group>

                <b-form-group label="Closing Date:" :state="valid.closingDate"
                 invalid-feedback="Please enter a closing date in the future or disable">
                    <b-form-checkbox variant="info" v-if="creating" v-model="closingDateSet"
                     class="mb-1" inline switch>
                        {{ closingDateSet ? 'Closes on' : 'No closing date' }}
                    </b-form-checkbox>

                    <b-form-datepicker variant="info" :min="petition.createdDate" selected-variant="info"
                     style="max-width: 25rem;" v-model="petition.closingDate" 
                     :disabled="!closingDateSet" :state="valid.closingDate ? null : false" value-as-date>
                    </b-form-datepicker>
                </b-form-group>

                <template v-slot:footer>
                    <b-button v-if="creating" variant="info" @click="postNew()">
                        Create
                    </b-button>

                    <b-button v-else variant="info" @click="postUpdate()">
                        Save
                    </b-button>
                </template>
            </b-card>
        </div>
    </div>
</template>

<script>
import backBar from "./components/Back-bar"
import inputField from "./components/Input-field"
import upload from "./components/Upload"

export default {
    data() {
        return {
            creating: false,
            petition: {
                title: "",
                description: "",
                categoryId: null,
                closingDate: undefined
            },
            closingDateSet: false,
            currentImage: "",
            image: undefined,
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
        }
    },
    props: ["id"],
    mounted() {
        if (this.$user.userId == null) {
            //if the user's not logged in, leave
            this.$router.replace({ name: "home" });
            return;
        }

        this.$http.get(
            this.$rootUrl + "petitions/categories"
        ).then((res) => {
            if (this.id == null) {
                this.creating = true;
                for (const category of res.data) {
                    this.categories.push({ value: category.categoryId, text: category.name });
                }
            } else {
                this.creating = false;

                this.$http.get(
                    this.$rootUrl + "petitions/" + this.id
                ).then((petition) => {
                    this.petition = {
                        title: petition.data.title,
                        description: petition.data.description,
                        categoryId: undefined,
                        closingDate: petition.data.closingDate ? 
                            new Date(petition.data.closingDate) :
                            undefined
                    }

                    this.currentImage = this.$rootUrl + "petitions/" + petition.data.petitionId + "/photo";
                    this.closingDateSet = petition.data.closingDate != null;
                
                    for (const category of res.data) {
                        if (category.name === petition.data.category) {
                            this.petition.categoryId = category.categoryId;
                        }

                        this.categories.push({ value: category.categoryId, text: category.name });
                    }
                }).catch(this.$throwErr);
            }
        }).catch(this.$throwErr);
    },
    watch: {
        $user: function(userOld, userNew) 
        {
            if (userNew.userId !== userOld.userId) { 
                //if the user logs out don't stay on this page
                this.$router.replace({ name: "home" });
            }
        }
    },
    methods: {
        validate()
        {
            let valid = true;

            if (this.petition.title === "") {
                this.valid.title = false;
                valid = false;
            } else {
                this.valid.title = true;
            }

            if (this.petition.categoryId == null) {
                this.valid.category = false;
                valid = false;
            } else {
                this.valid.category = true;
            }

            if (this.petition.description === "") {
                this.valid.description = false;
                valid = false;
            } else {
                this.valid.description = true;
            }

            if (this.closingDateSet && (this.petition.closingDate == null ||
                this.petition.closingDate <= Date.now())) 
            {
                this.valid.closingDate = false;
                valid = false;
            } else {
                this.valid.closingDate = true;
            }

            if (valid && this.petition.closingDate) {
                let str = this.petition.closingDate.toISOString();
                this.petition.closingDate = str.substr(0, 10) + ' ' + str.substr(11, 12);
            }

            return valid;
        },
        postUpdate()
        {
            if (this.validate()) {
                this.$http.patch(
                    this.$rootUrl + "petitions/" + this.id,
                    this.petition,
                    { headers: {
                        "X-Authorization": this.$user.token
                    }}
                ).then((res) => {
                    this.$router.push({ name: "petition", params: { id: this.id } });
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
                    this.petition,
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
        }
    },
    components: {
        "back-bar": backBar,
        "input-field": inputField,
        "upload": upload
    }
}
</script>