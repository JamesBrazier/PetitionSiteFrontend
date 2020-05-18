<template>
    <b-card no-body>
        <b-row :title="badge"
         v-b-popover.hover.top="data.signedDate ? 'Signed on ' + formatDate(data.signedDate) : null">
            <b-col sm="3" class="my-auto">
                <b-avatar :src="$rootUrl + 'users/' + data.signatoryId + '/photo'" 
                 class="my-1 ml-3" variant="dark" :badge="badge" badge-variant="info">
                 <!-- @click="$router.push({name: 'user', params: { id: data.signatoryId }})"> -->
                </b-avatar>
            </b-col>

            <b-col class="my-auto">
                <h5>{{ data.name }}</h5>
                <b-card-sub-title>{{ formatLoc }}</b-card-sub-title>
            </b-col>
        </b-row>
    </b-card>
</template>

<script>
export default {
    data() {
        return {
            toggle: false
        }
    },
    props: ["data", "badge"],
    methods: {
        formatDate(date)
        {
            let str = new Date(date).toUTCString();
            return str.substr(0, 16) + " at " + str.substr(17, 5);
        }
    },
    computed: {
        formatLoc() 
        {
            if (this.data.city != null) {
                if (this.data.country != null) {
                    return this.data.city + ", " + this.data.country;
                } else {
                    return this.data.city;
                }
            } else {
                if (this.data.country != null) {
                    return this.data.country;
                }
            }
        }
    }
}
</script>