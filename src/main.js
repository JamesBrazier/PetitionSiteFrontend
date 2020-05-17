import Vue from "vue"
import { BootstrapVue, BootstrapVueIcons, componentsPlugin } from "bootstrap-vue"
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

const router = new VueRouter({
    routes: [
        {
            path: "/",
            name: "home",
            component: home
        },{
            path: "/users/:id",
            name: "user",
            component: user,
            props: true
        },{
            path: "/petitions/:id",
            name: "petition",
            component: petition,
            props: true
        },{
            path: "/signup",
            name: "signup",
            component: signUp
        }
    ],
    mode: "history"
});

Vue.prototype.$rootUrl = "http://csse-s365.canterbury.ac.nz:4001/api/v1/";
Object.defineProperty(Vue.prototype, '$user', {
    get() 
    {
        return this.$root.$data.user;
    },
    set(value) 
    {
        this.$root.$data.user = value;
    }
});
Vue.prototype.$throwErr = function(err)
{
    this.$bvToast.toast(
        err.response ? `${err.response.status} ${err.response.statusText}` : err.message, 
        {
            title: "Error!",
            variant: "danger",
            //toaster: "b-toaster-top-full",
            autoHideDelay: 30000,
            solid: true,
            appendToast: true
        }
    );
    console.error(err.toJSON());
}

new Vue({
    el: '#app',
    router: router,
    render: h => h(app),
    data: {
        user: {}
    }
});
