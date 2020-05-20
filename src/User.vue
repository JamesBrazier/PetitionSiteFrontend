<template>
    <div>
        <back-bar text="Back"></back-bar>

        <div style="max-width: 40rem" class="m-2 w-75 mx-auto">
            <b-card class="text-center" bg-variant="light" border-variant="light">
                <b-avatar variant="dark" size="15rem" icon="camera" badge-variant="transparent" 
                 badge-offset="-15px" :src="$rootUrl + 'users/' + $user.userId + '/photo'"
                 style="z-index: 0;">
                    <template v-if="editing" v-slot:badge>
                        <b-button variant="info" v-b-modal.file pill>
                            <b-icon-upload class="mr-1"></b-icon-upload>
                            Upload
                        </b-button>
                    </template>
                </b-avatar>
            </b-card>

            <b-card v-if="editing" class="my-3" bg-variant="light">
                <input-field label="Name:" v-model="user.name" :placeholder="$user.name"></input-field>

                <input-field label="Email:" prepend="@" :placeholder="$user.email" :state="valid.email"
                 invalid="Please enter a valid email" v-model="user.email"></input-field>

                <input-field label="Home City:" v-model="user.city" :placeholder="$user.city"></input-field>

                <input-field label="Home Country:" v-model="user.country" :placeholder="$user.country">
                </input-field>
                
                <div v-if="passwordToggle">
                    <input-field label="Current Password:" prepend="*" placeholder="Password"
                     :state="valid.password" invalid="Please enter current and new password to change"
                     v-model="user.currentPassword" type="password"></input-field>

                    <input-field label="New Password:" prepend="*" placeholder="Password"
                     :state="valid.password" v-model="user.password" type="password"></input-field>

                    <input-field label="Repeat New Password:" prepend="*" placeholder="Password"
                     :state="valid.repeat" invalid="Passwords do not match" type="password"
                     v-model="repeat"></input-field>
                </div>

                <b-button v-else variant="info" @click="passwordToggle = true">
                    Change Password
                </b-button>

                <template v-slot:footer>
                    <b-button variant="info" @click="postChanges()">
                        Save
                    </b-button>

                    <b-button variant="danger" @click="editing = passwordToggle = false">
                        Cancel
                    </b-button>
                </template>
            </b-card>

            <b-card v-else class="my-3" :title="$user.name" :sub-title="formatLoc" bg-variant="light">
                <b-card-text>
                    Email: {{ $user.email }}
                </b-card-text>

                <template v-slot:footer>
                    <b-button variant="info" @click="editing = true;">
                        <b-icon-pencil-square class="mr-1"></b-icon-pencil-square>
                        Edit
                    </b-button>
                </template>
            </b-card>

            <b-card class="mt-3 pb-3" header-bg-variant="info" header-text-variant="white" no-body>
                <template v-slot:header>
                    <h4 class="text-center">Your Petitions</h4>
                </template>

                <petition-small v-for="petition in petitions" :key="petition.title" :data="petition"
                 @click="$router.push({ name: 'petition', params: { id: petition.petitionId }})"
                 class="mx-3 mt-3">
                </petition-small>
            </b-card>
        </div>

        <modal id="file">
            <template v-slot:title>
                <b-icon-file-earmark-arrow-up></b-icon-file-earmark-arrow-up>
                Upload File
            </template>


        </modal>
    </div>
</template>

<script>
import backBar from "./components/Back-bar"
import inputField from "./components/Input-field"
import petitionSmall from "./components/Petition-small"
import modal from "./components/Modal"

export default {
    data() {
        return {
            editing: false,
            passwordToggle: false,
            petitions: [],
            valid: {
                email: true,
                password: true,
                repeat: true
            },
            user: {
                name: undefined,
                city: undefined,
                country: undefined,
                email: undefined,
                currentPassword: undefined,
                password: undefined
            },
            repeat: undefined
        }
    },
    props: ["id"],
    mounted() {
        this.$http.get(
            this.$rootUrl + "petitions",
            { params: {
                authorId: this.$user.userId
            }}
        ).then((res) => {
            this.petitions = res.data;
        }).catch((err) => {
            this.$throwErr(err);
        });
    },
    watch: {
        $user: function(user, _) 
        {
            if (user.userId == null) {
                this.$router.replace({ name: "home" });
            }
        }
    },
    methods: {
        postChanges()
        {
            let valid = true;

            console.log(this.user);

            for (const field in this.user) {
                if (this.user[field] === "") {
                    this.user[field] = undefined;
                }
            }

            if (this.user.email && !this.user.email.match(this.$emailRegex)) {
                this.valid.email = false;
                valid = false;
            } else {
                this.valid.email = true;
            }

            if (this.user.currentPassword || this.user.password) {
                if (this.user.currentPassword && this.user.password) {
                    if (this.user.password !== this.repeat) {
                        this.valid.repeat = false;
                        valid = false;
                    } else {
                        this.valid.repeat = true;
                    }
                    this.valid.password = true;
                } else {
                    this.valid.password = false;
                    valid = false;
                }
            } else {
                this.valid.password = true;
            }

            if (valid) {
                console.log(this.user, this.$user);

                this.$http.patch(
                    this.$rootUrl + "users/" + this.$user.userId,
                    this.user,
                    { headers: {
                        "X-Authorization": this.$user.token
                    }}
                ).then((res) => {
                    for (const field in this.user) {
                        if (this.user[field] && this.$user[field] !== undefined) {
                            this.$user[field] = this.user[field];
                        }
                        this.user[field] = undefined;
                    }

                    this.editing = this.passwordToggle = false;
                }).catch((err) => {
                    this.$throwErr(err);
                });
            }
        }
    },
    computed: {
        formatLoc()
        {
            return this.$formatLoc(this.$user.city, this.$user.country);
        }
    },
    components: {
        "back-bar": backBar,
        "input-field": inputField,
        "petition-small": petitionSmall,
        modal
    }
}
</script>