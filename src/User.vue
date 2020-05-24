<template>
    <div>
        <back-bar text="Back"></back-bar>

        <div style="max-width: 40rem" class="m-2 w-75 mx-auto">
            <b-card class="text-center" bg-variant="light" border-variant="light">
                <b-avatar variant="dark" size="15rem" icon="camera"
                :src="$rootUrl + 'users/' + $user.userId + '/photo?cache=' + $cache">
                </b-avatar>
            </b-card>

            <b-card class="my-3" :title="$user.name" :sub-title="formatLoc" bg-variant="light">
                <b-card-text>
                    Email: {{ $user.email }}
                </b-card-text>

                <template v-slot:footer>
                    <b-button variant="info" :to="{ name: 'edit user', params: { id: $user.userId } }">
                        <b-icon-pencil-square class="mr-1"></b-icon-pencil-square>
                        Edit
                    </b-button>
                </template>
            </b-card>

            <b-card class="mt-3" header-bg-variant="info" 
             header-text-variant="white" footer-bg-variant="info" footer-text-variant="white" no-body>
                <template v-slot:header>
                    <h4 class="text-center">Your Petitions</h4>
                </template>

                <petition-small v-for="petition in petitions" :key="petition.title" :data="petition"
                 @click="$router.push({ name: 'petition', params: { id: petition.petitionId }})"
                 class="mx-3 my-3">
                </petition-small>

                <template v-slot:footer>
                    <div class="text-center">
                        <h4>Create New Petition?</h4>

                        <b-button variant="light" :to="{ name: 'create petition' }">
                            Express your opinion!
                        </b-button>
                    </div>
                </template>
            </b-card>
        </div>
    </div>
</template>

<script>
import backBar from "./components/Back-bar"
import petitionSmall from "./components/Petition-small"

export default {
    data() {
        return {
            petitions: []
        }
    },
    props: ["id"],
    mounted() {
        if (this.$user.userId == null) {
            //if the user's not logged in, leave
            this.$router.replace({ name: "home" });
            return;
        }

        this.$http.get(
            this.$rootUrl + "petitions",
            { params: {
                authorId: this.$user.userId
            }}
        ).then((res) => {
            this.petitions = res.data;
        }).catch((err) => {
            this.$throwErr(err);
        });
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
    computed: {
        formatLoc()
        {
            return this.$format.location(this.$user.city, this.$user.country);
        }
    },
    components: {
        "back-bar": backBar,
        "petition-small": petitionSmall
    }
}
</script>