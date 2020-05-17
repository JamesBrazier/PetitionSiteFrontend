<template>
    <b-card v-b-tooltip="'Click for view'" @click="$emit('click')" bg-variant="light"
     :img-src="$rootUrl + 'petitions/' + data.petitionId + '/photo'"
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