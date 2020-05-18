<template>
    <div>
        <back-bar text="Cancel"></back-bar>

        Petitions {{ id ? 'edit ' + id : 'create' }}
    </div>
</template>

<script>
import inputField from "./components/Input-field.vue"
import petitionSmall from "./components/Petition-small.vue"
import backBar from "./components/Back-bar.vue"

export default {
    props: ["id"],
    components: {
        "input-field": inputField,
        "petition-small": petitionSmall,
        "back-bar": backBar
    }
}
</script>