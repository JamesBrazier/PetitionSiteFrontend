<template>
    <b-modal :id="id" centered header-bg-variant="info" header-text-variant="white"
     footer-bg-variant="light">
        <template v-slot:modal-title>
            <slot name="title"></slot>
        </template>

        <slot></slot>

        <template v-slot:modal-footer="{ ok, cancel, close }">
            <slot name="footer" :cancel=cancel :ok=ok :close=close>
                <b-button variant="danger" @click="cancel()">
                    Back
                </b-button>
            </slot>
        </template>
    </b-modal>
</template>

<script>
export default {
    props: {
        "id": String
    }
}
</script>