<template>
    <div>
        <b-button variant="info" @click="$emit('upload', $event.target.image)" pill>
            <b-icon-upload class="mr-1"></b-icon-upload>
            Upload
        </b-button>

        <b-button variant="danger" @click="$emit('remove')" pill>
            <b-icon-x class="mr-1"></b-icon-x>
            Remove
        </b-button>
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>

</style>