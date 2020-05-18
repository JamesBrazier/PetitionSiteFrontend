<template>
    <b-navbar variant="light" type="dark" style="z-index: 1;" sticky>
        <b-button @click="$router.go(-1)" variant="danger">
            {{ text }}
        </b-button>
        <slot></slot>
    </b-navbar>
</template>

<script>
export default {
    props: ["text"]
}
</script>