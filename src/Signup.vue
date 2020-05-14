<template>
    <div style="max-width: 80rem;" class="m-2 w-75 mx-auto">
        <b-card title="Sign up">
            <div v-if="creating">
                <b-form-group label="Name:" label-for="su-n" :state="valid.name"
                 invalid-feedback="Please enter your name">
                    <b-input id="su-n" v-model="name" placeholder="Jane Doe">
                    </b-input>
                </b-form-group>

                <b-form-group label="Email:" label-for="su-e" :state="valid.email"
                 invalid-feedback="Please enter a valid email">
                    <b-input-group prepend="@">
                        <b-input id="su-e" type="email" v-model="email" placeholder="jane.doe@email.com">
                        </b-input>
                    </b-input-group>
                </b-form-group>

                <b-form-group label="Password:" label-for="su-p">
                    <b-input-group prepend="*">
                        <b-input id="su-p" type="password" v-model="password" placeholder="Password">
                        </b-input>
                    </b-input-group>
                </b-form-group>

                <b-form-group label="Repeat Password:" label-for="su-rp" :state="valid.password"
                 invalid-feeback="Passwords do not match">
                    <b-input-group prepend="*">
                        <b-input id="su-rp" type="password" v-model="repeatPassword" placeholder="Password">
                        </b-input>
                    </b-input-group>
                </b-form-group>

                <b-form-group label="Home City (Optional):" label-for="su-c">
                    <b-input id="su-c" v-model="city" placeholder="New York">
                    </b-input>
                </b-form-group>

                <b-form-group label="Home Country (Optional):" label-for="su-cn">
                    <b-input id="su-cn" v-model="country" placeholder="USA">
                    </b-input>
                </b-form-group>
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
export default {
    data () {
        return {
            creating: true,
            valid: {
                name: true,
                email: true,
                password: true
            },
            name: "",
            email: "",
            password: "",
            repeatPassword: "",
            city: "",
            country: ""
        }
    },
    methods: {
        postUser: function() {
            let allValid = true;

            console.log(this.password, this.repeatPassword);

            if (this.name !== "") {
                this.valid.name = true;
            } else {
                this.valid.name = false;
                allValid = false;
            }

            if (this.email.includes('@')) {
                this.valid.email = true;
            } else {
                this.valid.email = false;
                allValid = false;
            }
            
            if (this.password === this.repeatPassword) {
                this.valid.password = true;
            } else {
                this.valid.password = false;
                allValid = false;
            }

            if (allValid) {
                if (this.city === "") this.city = undefined;
                if (this.country === "") this.country = undefined;
                

                this.creating = false;
            }
        }
    }
}
</script>