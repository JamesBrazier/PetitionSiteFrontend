<template>
    <b-card v-b-tooltip="'Click for view'" @click="$emit('click')"
     :img-src="'http://csse-s365.canterbury.ac.nz:4001/api/v1/petitions/' + data.petitionId + '/photo'"
     :title="data.title" :sub-title="'Author: ' + data.authorName">
        <b-card-text>
            {{ data.signatureCount }} signatures
        </b-card-text>
    </b-card>
</template>

<script>
export default {
    props: ["data"]
}
</script>