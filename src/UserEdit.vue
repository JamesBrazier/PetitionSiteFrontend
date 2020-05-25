<template>
    <div>
        <back-bar text="Back"></back-bar>

        <div style="max-width: 40rem" class="m-2 w-75 mx-auto">
            <upload v-model="image" :base-img="$rootUrl + 'users/' + id + '/photo?cache=' + $cache"
             :remove="!creating" avatar></upload>

            <b-card bg-variant="light" class="mt-3">
                <input-field label="Name:" :state="valid.name" invalid="Please enter your name" 
                 v-model="user.name" placeholder="Name"></input-field>

                <input-field label="Email:" :state="valid.email" :invalid="valid.emailMsg"
                 v-model="user.email" placeholder="Email" prepend="@"></input-field>
                
                <input-field label="Home City (Optional):" v-model="user.city" 
                 placeholder="Home City"></input-field>

                <input-field label="Home Country (Optional):" v-model="user.country" 
                 placeholder="Home Country"></input-field>

                <div v-if="creating">
                    <input-field label="Password:" prepend="*" placeholder="Password"
                     :state="valid.password" v-model="user.password" type="password"
                     invalid="Please enter a password"></input-field>

                    <input-field label="Repeat Password:" prepend="*" placeholder="Password"
                     :state="valid.repeat" invalid="Passwords do not match" type="password"
                     v-model="repeat"></input-field>
                </div>

                <div v-else-if="passwordToggle">
                    <input-field label="Current Password:" prepend="*" placeholder="Password"
                     :state="valid.current" invalid="Incorrect password"
                     v-model="user.currentPassword" type="password"></input-field>

                    <input-field label="New Password:" prepend="*" placeholder="Password"
                     :state="valid.password" v-model="user.password" type="password"
                     invalid="Please enter current and a new password to change"></input-field>

                    <input-field label="Repeat New Password:" prepend="*" placeholder="Password"
                     :state="valid.repeat" invalid="Passwords do not match" type="password"
                     v-model="repeat"></input-field>
                </div>

                <b-button v-else variant="info" @click="passwordToggle = true">
                    Change Password
                </b-button>

                <template v-slot:footer>
                    <b-button v-if="creating" variant="info" @click="postNewUser()">
                        Sign me up!
                    </b-button>

                    <b-button v-else variant="info" @click="postChanges()">
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
            passwordToggle: false,
            image: undefined,
            valid: {
                name: true,
                email: true,
                emailMsg: null,
                current: true,
                password: true,
                repeat: true
            },
            user: {
                name: "",
                city: undefined,
                country: undefined,
                email: "",
                currentPassword: "",
                password: ""
            },
            repeat: ""
        }
    },
    props: ["id"],
    mounted() {    
        if (this.id == null) {
            this.creating = true;
        } else if (this.$user.userId == null) {
            //if the user's not logged in, leave
            this.$router.replace({ name: "home" });
        } else {
            this.user.name = this.$user.name;
            this.user.city = this.$user.city;
            this.user.country = this.$user.country;
            this.user.email = this.$user.email;
        }
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
        postChanges()
        {
            let valid = true;

            for (const field in this.user) {
                if (this.user[field] === "" || this.user[field] === null) {
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

                    if (this.image === undefined) { //no change
                        this.$router.push({ name: 'user', params: { id: this.id } });
                    } else if (this.image === null) { //delete
                        this.$http.delete(
                            this.$rootUrl + "users/" + this.id + "/photo",
                            { headers: {
                                "X-Authorization": this.$user.token
                            }}
                        ).then((_) => {
                            this.$cache++;
                            this.$router.replace({ name: 'user', params: { id: this.id } });
                        }).catch((err) => {
                            this.$throwErr(err);
                        })
                    } else { //new image
                        this.$http.put(
                            this.$rootUrl + "users/" + this.id + "/photo",
                            this.image.data,
                            { headers: {
                                "X-Authorization": this.$user.token,
                                "Content-Type": this.image.type
                            }}
                        ).then((_) => {
                            this.$cache++;
                            this.$router.replace({ name: 'user', params: { id: this.id } });
                        }).catch((err) => {
                            this.$throwErr(err);
                        });
                    }
                }).catch((err) => {
                    if (err.response.status === 400) {
                        //shouldn't have to check status messages but whatever
                        if (err.response.statusText.match("email")) {
                            this.valid.current = true;
                            this.valid.email = false;
                            this.valid.emailMsg = "Email is already in use";
                        } else {
                            this.valid.email = true;
                            this.valid.current = false;
                        }
                    } else {
                        this.$throwErr(err);
                    }
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

            if (this.user.email && this.user.email.match(this.$emailRegex)) {
                this.valid.email = true;
            } else {
                this.valid.email = false;
                this.valid.emailMsg = "Please enter a valid email";
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
                    this.$http.post(
                        this.$rootUrl + "users/login",
                        {
                            email: this.user.email,
                            password: this.user.password
                        }
                    ).then((res) => {
                        delete this.user.password;
                        this.$user = {...this.user, ...res.data};

                        if (this.image) {
                            this.$http.put(
                                this.$rootUrl + "users/" + res.data.userId + "/photo",
                                this.image.data,
                                { headers: {
                                    "X-Authorization": res.data.token,
                                    "Content-Type": this.image.type
                                }}
                            ).then((_) => {
                                this.$cache++;
                                this.$router.replace({ name: 'home' });
                            }).catch((err) => {
                                this.$throwErr(err);
                            });
                        } else {
                            this.$router.replace({ name: 'home' });
                        }
                    }).catch((err) => {
                        this.$throwErr(err);
                    });
                }).catch((err) => {
                    if (err.response.status === 400) {
                        this.valid.email = false;
                        this.valid.emailMsg = "Email is already in use";
                    } else {
                        this.$throwErr(err);
                    }
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