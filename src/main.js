import Vue from "vue"
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue"
import axios from "axios"
import VueAxios from "vue-axios"
import VueRouter from "vue-router"

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

import app from "./App.vue"
import home from "./Home.vue"
import user from "./User.vue"
import petition from "./Petition.vue"
import signUp from "./Signup.vue"

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueAxios, axios);
Vue.use(VueRouter);

console.log

const router = new VueRouter({
    routes: [
        {
            path: "/",
            name: "home",
            component: home
        },{
            path: "/users/:id",
            name: "user",
            component: user
        },{
            path: "/petitions/:id",
            name: "petition",
            component: petition
        },{
            path: "/signup",
            name: "signup",
            component: signUp
        }
    ],
    mode: "history"
})

new Vue({
    el: '#app',
    router: router,
    render: h => h(app),
    data: {
        user: {}
    }
})
