<template>
    <div>
        <b-alert v-for="(error, index) in errors" :key="error.message"
         dismissible @dismissed="errors.splice(index, 1)" variant="danger" show>
            Error: {{ error.message }}
        </b-alert>

        <b-navbar variant="info" type="dark" toggleable sticky>
            <b-navbar-brand :to="{ name: 'home' }" left>
                Petition Site
            </b-navbar-brand>

            <b-button v-if="user == null" variant="light" v-b-toggle.profile>
                <b-icon-people-circle></b-icon-people-circle>
                Sign in
            </b-button>

            <b-dropdown v-else variant="light" right>
                <template v-slot:button-content>
                    <b-icon-people-circle></b-icon-people-circle>
                    {{ user.name }}
                </template>

                <b-dropdown-item :to="{ name: 'user', params: { id: user.userId } }">
                    Account
                </b-dropdown-item>

                <b-dropdown-item @click="logout()">
                    Logout
                </b-dropdown-item>
            </b-dropdown>
        </b-navbar>

        <b-sidebar id="profile" title="Sign in" variant="info" shadow lazy right>
            <template v-slot:default="{ hide }">
                <div class="m-3">
                    <b-form-group label="Email:" label-for="ln-e" :state="validEmail"
                    invalid-feedback="Please enter a valid email">
                        <b-input-group prepend="@">
                            <b-input id="ln-e" type="email" v-model="email" placeholder="Email"></b-input>
                        </b-input-group>
                    </b-form-group>

                    <b-form-group label="Password:" label-for="ln-p">
                        <b-input-group prepend="*">
                            <b-input id="ln-p" type="password" v-model="password" placeholder="Password"></b-input>
                        </b-input-group>
                    </b-form-group>

                    
                        <b-button variant="info" @click="login(); if (validEmail) hide()">Sign in</b-button>
                    <b-button variant="danger" v-b-toggle.profile>Cancel</b-button>

                    <div class="my-3">
                        Don't have an account?
                        <router-link :to="{ name: 'signup' }">Sign up!</router-link>
                    </div>

                    <!-- <b-button variant="info" v-b-toggle.profile>Sign up</b-button> -->
                </div>
            </template>
        </b-sidebar>

        <router-view @error="errors.push($event)"></router-view>
    </div>
</template>

<script>
export default {
    data () {
        return {
            errors: [],
            validEmail: true,
            email: "",
            password: "",
            user: null
        }
    },
    methods: {
        login: function()
        {
            if (this.email.includes('@')) {
                this.validEmail = true;


            } else {
                this.validEmail = false;
            }
        },

        logout: function()
        {
            this.user = null;
        }
    }
}
</script>