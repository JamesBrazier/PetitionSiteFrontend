<template>
    <div class="image">
        <img :src="src" alt="" :class="failed ? 'failed' : null"
        @load="failed = false" @error="failed = true" />

        <slot v-if="failed" name="alt">
            {{ alt }}
        </slot>
    </div>
</template>

<script>
export default {
    data() {
       return {
           failed: false
       } 
    },
    props: {
        "src": String,
        "alt": String,
        "rounded": Boolean,
        "fluid": Boolean
    }
}
</script>

<style scoped>
.failed {
    visibility: hidden;
    width: 0%;
    height: 0%;
}

.image {
    text-align: center !important;
}

.image img {
    border-radius: 0.25rem !important;
    max-width: 100%;
    height: auto;
}
</style>