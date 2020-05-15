<template>
    <div>
        <b-card @click="$emit('click')" img-alt=" " :title="data.name"
         :img-src="'http://csse-s365.canterbury.ac.nz:4001/api/v1/users/' + data.signatoryId + '/photo'"
         :sub-title="formatLoc">
            <b-card-text v-if="data.signedDate != null">
                Signed: {{ formatDate }}
            </b-card-text>
        </b-card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            image: true
        }
    },
    props: ["data"],
    computed: {
        formatLoc: function() {
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
        },
        formatDate: function()
        {
            return this.data.signedDate.substr(0, 10);
        }
    }
}
</script>