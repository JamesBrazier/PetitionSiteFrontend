import Vue from "vue"
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue"
import axios from "axios"
import VueAxios from "vue-axios"
import VueRouter from "vue-router"

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

import app from "./App.vue"
import home from "./Home.vue"
import users from "./Users.vue"

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueAxios, axios);
Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: "/",
            name: "home",
            component: home
        },{
            path: "/users/:id",
            name: "user",
            component: users
        }
    ],
    mode: "history"
})



new Vue({
    el: '#app',
    router: router,
    render: h => h(app),
    data: {
        test: "lkahfoa"
    }
})
