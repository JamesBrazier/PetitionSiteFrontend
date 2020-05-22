<template>
    <b-form-group :label="label" :state="state"
     :invalid-feedback="invalid" :valid-feedback="valid">
        <b-input-group :prepend="prepend">
            <input :value="value" :type="type" :placeholder="placeholder"
             @input="$emit('input', $event.target.value)" :disabled="disabled"
             :class="'form-control' + (state == null || state ? '' : ' is-invalid')">
        </b-input-group>
    </b-form-group>
</template>

<script>
export default {
    props: [
        "label", "state", "invalid", "valid", "disabled", 
        "type", "value", "placeholder", "prepend"
    ]
}
</script>