<template>
    <div>
        <back-bar text="Back"></back-bar>
        User {{ id }}
    </div>
</template>

<script>
import backBar from "./components/Back-bar"

export default {
    props: ["id"],
    components: {
        "back-bar": backBar
    }
}
</script>