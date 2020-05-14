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

        </b-sidebar>

        <router-view @error="errors.push($event)"></router-view>
    </div>
</template>

<script>
export default {
    data () {
        return {
            errors: [],
            user: null
        }
    },
    methods: {
        logout: function()
        {
            this.user = null;
        }
    }
}
</script>