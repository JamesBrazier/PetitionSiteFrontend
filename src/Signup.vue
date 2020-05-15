<template>
    <div style="max-width: 80rem;" class="m-2 w-75 mx-auto">
        <b-card title="Sign up">
            <div v-if="creating">
                <input-field label="Name:" :state="valid.name" invalid="Please enter your name" 
                 v-model="user.name" placeholder="Jane Doe"></input-field>

                <input-field label="Email:" :state="valid.email" invalid="Please enter a valid email"
                 type="email" v-model="user.email" placeholder="jane.doe@email.com" prepend="@"></input-field>

                <input-field label="Password:" type="password" v-model="user.password" placeholder="Password"
                 :state="valid.password" invalid="Please enter a password" prepend="*"></input-field>

                <input-field label="Repeat Password:" type="password" v-model="repeat" 
                 :state="valid.repeat" invalid="Passwords do not match" placeholder="Password" 
                 prepend="*"></input-field>

                <input-field label="Home City (Optional):" v-model="city" 
                 placeholder="New York"></input-field>

                <input-field label="Home Country (Optional):" v-model="country" 
                 placeholder="United States of America"></input-field>
            </div>

            <div v-else>
                Your account has been created and is ready to go!
            </div>

            <template v-slot:footer>
                <b-button v-if="creating" variant="info" @click="postUser()">Sign me up!</b-button>
                <b-button variant="danger" @click="$router.go(-1)">Back</b-button>
            </template>
        </b-card>
    </div>
</template>

<script>
import inputField from "./components/input-field.vue"

export default {
    data () {
        return {
            creating: true,
            valid: {
                all: true,
                name: true,
                email: true,
                password: true,
                repeat: true
            },
            user: {
                name: "",
                email: "",
                password: ""
            },
            repeat: "",
            city: "",
            country: ""
        }
    },
    methods: {
        postUser: function() {
            this.valid.all = true;

            if (this.name !== "") {
                this.valid.name = true;
            } else {
                this.valid.name = false;
                this.valid.all = false;
            }

            if (this.email.includes('@')) {
                this.valid.email = true;
            } else {
                this.valid.email = false;
                this.valid.all = false;
            }
            
            if (this.password !== "") {
                this.valid.password = true;
            } else {
                this.valid.password = false;
                this.valid.all = false;
            }

            if (this.repeat === this.password) {
                this.valid.repeat = true;
            } else {
                this.valid.repeat = false;
                this.valid.all = false;
            }

            if (this.valid.all) {
                if (this.city === "") this.user.city = this.city;
                if (this.country === "") this.user.country = this.country;
                
                this.$http.post(
                    "http://csse-s365.canterbury.ac.nz:4001/api/v1/users/register", 
                    this.user
                ).then((res) => {
                    this.creating = false;
                }).catch((err) => {
                    this.$emit("error", err);
                });
            }
        }
    },
    components: {
        "input-field": inputField
    }
}
</script>