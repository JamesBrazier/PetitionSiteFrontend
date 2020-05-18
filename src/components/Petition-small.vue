<template>
    <b-card v-b-tooltip="'Click for view'" @click="$emit('click')" bg-variant="light" no-body>
        <b-card-img-lazy :src="$rootUrl + 'petitions/' + data.petitionId + '/photo'" top>
        </b-card-img-lazy>

        <div class="m-3">
            <b-card-title>
                {{ data.title }}
            </b-card-title>

            <b-card-sub-title>
                Author: {{ data.authorName }}
            </b-card-sub-title>

            <b-card-text class="mt-2">
                {{ data.signatureCount }} signatures
            </b-card-text>
        </div>
    </b-card>
</template>

<script>
export default {
    props: ["data"]
}
</script>