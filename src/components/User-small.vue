<template>
    <div>
        <b-card @click="$emit('click')"
         :img-src="'http://csse-s365.canterbury.ac.nz:4001/api/v1/users/' + data.signatoryId + '/photo'"
         :title="data.name" :sub-title="data.city + ', ' + data.country">
            <b-card-text v-if="data.signedDate != null">
                Signed: {{ formatDate(data.signedDate) }}
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
    methods: {
        formatDate: function(data)
        {
            return data.substr(0, 10);
        }
    }
}
</script>