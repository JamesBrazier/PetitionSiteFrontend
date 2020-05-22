<template>
    <div>
        <back-bar text="Back"></back-bar>

        <div style="max-width: 40rem" class="m-2 w-75 mx-auto">
            <b-card class="text-center" bg-variant="light" border-variant="light">
                <b-avatar variant="dark" size="15rem" icon="camera"
                :src="$rootUrl + 'users/' + $user.userId + '/photo'">
                </b-avatar>
                <upload class="mt-1"></upload>
            </b-card>

            <b-card v-if="mode === 1" class="my-3" bg-variant="light">
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

                    <b-button variant="danger" @click="mode = 0; passwordToggle = false">
                        Cancel
                    </b-button>
                </template>
            </b-card>

            <b-card v-else-if="mode === 2" title="Sign up" bg-variant="light" class="my-3">
                <input-field label="Name:" :state="valid.name" invalid="Please enter your name" 
                 v-model="user.name" placeholder="Jane Doe"></input-field>

                <input-field label="Email:" :state="valid.email" invalid="Please enter a valid email"
                 v-model="user.email" placeholder="jane.doe@email.com" prepend="@"></input-field>

                <input-field label="Password:" type="password" v-model="user.password" placeholder="Password"
                 :state="valid.password" invalid="Please enter a password" prepend="*"></input-field>

                <input-field label="Repeat Password:" type="password" v-model="repeat" 
                 :state="valid.repeat" invalid="Passwords do not match" placeholder="Password" 
                 prepend="*"></input-field>

                <input-field label="Home City (Optional):" v-model="user.city" 
                 placeholder="New York"></input-field>

                <input-field label="Home Country (Optional):" v-model="user.country" 
                 placeholder="United States of America"></input-field>

                <template v-slot:footer>
                    <b-button variant="info" @click="postNewUser()">
                        Sign me up!
                    </b-button>
                </template>
            </b-card>

            <b-card v-else class="my-3" :title="$user.name" :sub-title="formatLoc" bg-variant="light">
                <b-card-text>
                    Email: {{ $user.email }}
                </b-card-text>

                <template v-slot:footer>
                    <b-button variant="info" @click="mode = 1;">
                        <b-icon-pencil-square class="mr-1"></b-icon-pencil-square>
                        Edit
                    </b-button>
                </template>
            </b-card>

            <b-card v-if="mode === 0" class="mt-3" header-bg-variant="info" 
             header-text-variant="white" footer-bg-variant="info" footer-text-variant="white" no-body>
                <template v-slot:header>
                    <h4 class="text-center">Your Petitions</h4>
                </template>

                <petition-small v-for="petition in petitions" :key="petition.title" :data="petition"
                 @click="$router.push({ name: 'petition', params: { id: petition.petitionId }})"
                 class="mx-3 my-3">
                </petition-small>

                <template v-slot:footer>
                    <div class="text-center">
                        <h4>Create New Petition?</h4>

                        <b-button variant="light" :to="{ name: 'create' }">
                            Express your opinion!
                        </b-button>
                    </div>
                </template>
            </b-card>
        </div>
    </div>
</template>

<script>
import backBar from "./components/Back-bar"
import inputField from "./components/Input-field"
import petitionSmall from "./components/Petition-small"
import upload from "./components/Upload"

const Viewing = 0, Editing = 1, Creating = 2; 

export default {
    data() {
        return {
            mode: Viewing,
            passwordToggle: false,
            petitions: [],
            valid: {
                name: true,
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
        if (this.id == null) {
            this.mode = Creating;
        } else {
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
        }
    },
    watch: {
        $user: function(user, _) 
        {
            if (user.userId == null) { 
                //if the users logs out don't stay on this page
                this.$router.replace({ name: "home" });
            }
        }
    },
    methods: {
        postChanges()
        {
            let valid = true;

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

                    this.mode = Viewing; 
                    this.passwordToggle = false;
                }).catch((err) => {
                    this.$throwErr(err);
                });
            }
        },
        postNewUser()
        {
            let valid = true;

            if (this.user.name !== "") {
                this.valid.name = true;
            } else {
                this.valid.name = false;
                valid = false;
            }

            if (this.user.email.match(this.$emailRegex)) {
                this.valid.email = true;
            } else {
                this.valid.email = false;
                valid = false;
            }
            
            if (this.user.password !== "") {
                this.valid.password = true;
            } else {
                this.valid.password = false;
                valid = false;
            }

            if (this.repeat === this.user.password) {
                this.valid.repeat = true;
            } else {
                this.valid.repeat = false;
                valid = false;
            }

            if (valid) {
                if (this.user.city === "") this.user.city = undefined;
                if (this.user.country === "") this.user.country = undefined;
                
                this.$http.post(
                    this.$rootUrl + "users/register", 
                    this.user
                ).then((res) => {
                    this.mode = Viewing;

                    this.$http.post(
                        this.$rootUrl + "users/login",
                        {
                            email: this.user.email,
                            password: this.user.password
                        }
                    ).then((res) => {
                        delete this.user.password;
                        this.$user = {...this.user, ...res.data};
                    }).catch((err) => {
                        this.$throwErr(err);
                    });
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
        upload
    }
}
</script>