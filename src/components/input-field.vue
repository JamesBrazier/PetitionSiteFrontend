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
    props: {
        "label": String,
        "state": undefined,
        "invalid": String,
        "valid": String,
        "disabled": Boolean,
        "type": String,
        "value": String,
        "placeholder": String,
        "prepend": String
    }
}
</script>