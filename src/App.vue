<template>
    <div>
        <b-alert v-for="(error, index) in errors" :key="error.message"
         dismissible @dismissed="errors.splice(index, 1)" variant="danger" show>
            Error: {{ error.message }}
        </b-alert>

        <b-navbar variant="info" type="dark" toggleable sticky>
            <b-navbar-brand :to="{ name: 'home' }" left>
                <b-icon-people-fill font-scale="1.5"></b-icon-people-fill>
                <b>Petition Site</b>
            </b-navbar-brand>

            <b-button v-if="user == null" variant="light" v-b-toggle.profile>
                <b-avatar size="1.7rem" class="mr-1" variant="dark"></b-avatar>
                Sign in
            </b-button>

            <b-dropdown v-else variant="light">
                <template v-slot:button-content>
                    <b-avatar size="1.7rem" class="mr-1" variant="dark" rounded="lg"
                     :src="'http://csse-s365.canterbury.ac.nz:4001/api/v1/users/' + user.userId + '/photo'">
                    </b-avatar>
                    {{ user.name }}
                </template>

                <b-dropdown-item :to="{ name: 'user', params: { id: user.userId } }">
                    Account
                </b-dropdown-item>

                <b-dropdown-item @click="logoutUser()">
                    Logout
                </b-dropdown-item>
            </b-dropdown>
        </b-navbar>

        <b-sidebar id="profile" title="Sign in" variant="info" shadow lazy right>
            <template v-slot:default="{ hide }">
                <div v-if="valid.login" class="m-3">
                    <b-alert variant="success" show @dismissed="hide()" dismissible>
                        Successful login!
                    </b-alert>

                    <b-button variant="info" v-b-toggle.profile>Close</b-button>
                </div>

                <div v-else class="m-3">
                    <input-field label="Email:" :state="valid.email" invalid="Please enter a valid email"
                    prepend="@" type="email" v-model="login.email" placeholder="Email"></input-field>

                    <input-field label="Password:" :state="valid.password" invalid="Please enter your password"
                    prepend="*" type="password" v-model="login.password" placeholder="Password"></input-field>

                    <b-alert variant="danger" :show="valid.login === false" dismissible>
                        Incorrect email or password!
                    </b-alert>

                    <b-button variant="info" v-if="!valid.login" @click="loginUser()">Sign in</b-button>
                    <b-button variant="danger" v-b-toggle.profile>Cancel</b-button>

                    <div class="my-3">
                        Don't have an account?
                        <router-link :to="{ name: 'signup' }">Sign up!</router-link>
                    </div>
                </div>
            </template>
        </b-sidebar>

        <router-view @error="pushErr($event)"></router-view>
    </div>
</template>

<script>
import inputField from "./components/input-field.vue"

export default {
    data () {
        return {
            errors: [],
            valid: {
                all: true,
                email: true,
                password: true,
                login: null,
            },
            login: {
                email: "",
                password: ""
            },
            user: null
        }
    },
    methods: {
        loginUser: function()
        {
            this.valid.all = true;
            this.valid.login = null;

            if (this.login.email.includes('@')) {
                this.valid.email = true;
            } else {
                this.valid.email = false;
                this.valid.all = false;
            }

            if (this.login.password !== "") {
                this.valid.password = true;
            } else {
                this.valid.password = false;
                this.valid.all = false;
            }

            if (this.valid.all) {
                this.$http.post(
                    "http://csse-s365.canterbury.ac.nz:4001/api/v1/users/login", 
                    this.login
                ).then((resln) => {
                    this.valid.login = true;
                    this.$http.get(
                        "http://csse-s365.canterbury.ac.nz:4001/api/v1/users/" + resln.data.userId,
                    ).then((resg) => {
                        this.user = {...resln.data, ...resg.data};
                        this.login = {email: "", password: ""};
                    }).catch((err) => {
                        this.pushErr(err);
                    });
                }).catch((err) => {
                    if (err.response.status === 400) {
                        this.valid.all = false;
                        this.valid.login = false;
                    } else {
                        this.pushErr(err);
                    }
                });
            }
        },
        logoutUser: function()
        {
            this.$http.post(
                "http://csse-s365.canterbury.ac.nz:4001/api/v1/users/logout", null,
                { headers: {
                    "X-Authorization": this.user.token
                }}
            ).then((err) => {
                this.user = null;
                this.valid.login = null;
            }).catch((err) => {
                this.pushErr(err);
            });
        },
        pushErr: function(err)
        {
            this.errors.push(err);
            throw err;
        }
    },
    components: {
        "input-field": inputField
    }
}
</script>