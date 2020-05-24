import Vue from "vue"
import { BootstrapVue, BootstrapVueIcons, componentsPlugin } from "bootstrap-vue"
import axios from "axios"
import VueAxios from "vue-axios"
import VueRouter from "vue-router"

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

import app from "./App.vue"
import home from "./Home.vue"
import petition from "./Petition.vue"
import petitionEdit from "./PetitionEdit.vue"
import user from "./User.vue"
import userEdit from "./UserEdit.vue"

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
            path: "/petitions/:id/edit",
            name: "edit petition",
            component: petitionEdit,
            props: true
        },{
            path: "/petitions/create",
            name: "create petition",
            component: petitionEdit
        },{
            path: "/users/:id/edit",
            name: "edit user",
            component: userEdit,
            props: true
        },{
            path: "/users/create",
            name: "create user",
            component: userEdit
        }
    ],
    mode: "history"
});

//The root url for the server
Vue.prototype.$rootUrl = "http://csse-s365.canterbury.ac.nz:4001/api/v1/";
//The basic pattern for an email
Vue.prototype.$emailRegex = /.+@.+\..+/;
//the global user
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
//A universal function for error feedback
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
//A universal function for formating user location
Vue.prototype.$format = {
    location(city, country)
    {
        if (city != null) {
            if (country != null) {
                return city + ", " + country;
            } else {
                return city;
            }
        } else {
            if (country != null) {
                return country;
            }
        }
    },
    date(date)
    {
        let str = date.toUTCString();
        return str.substr(0, 16) + " at " + str.substr(17, 5);
    }
}

new Vue({
    el: '#app',
    router: router,
    render: h => h(app),
    data: {
        user: {}
    }
});
