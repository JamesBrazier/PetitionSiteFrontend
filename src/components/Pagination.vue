<template>
    <div class="text-center">
        <b-button-group style="z-index: 0;">
            <b-button variant="outline-info" :disabled="value === 0"
             @click="$emit('input', 0)">
                <b-icon-chevron-double-left></b-icon-chevron-double-left>
            </b-button>

            <b-button variant="outline-info" :disabled="value === 0"
             @click="$emit('input', value - perPage)">
                <b-icon-chevron-left></b-icon-chevron-left>
            </b-button>

            <b-button v-for="index in getPages" :key="index" @click="$emit('input', index)"
             :variant=" index === value ? 'info' : 'outline-info'">
                {{ index + 1 }}-{{ index + perPage }}
            </b-button>

            <b-button v-if="ellipsis" variant="outline-info" class="text-dark" disabled>
                <b-icon-three-dots></b-icon-three-dots>
            </b-button>

            <b-button variant="outline-info" @click="$emit('input', value + perPage);"
             :disabled="value === end">
                <b-icon-chevron-right></b-icon-chevron-right>
            </b-button>

            <b-button variant="outline-info" :disabled="value === end"
             @click="$emit('input', end)">
                <b-icon-chevron-double-right></b-icon-chevron-double-right>
            </b-button>
        </b-button-group>
    </div>
</template>

<script>
export default {
    data() {
        return {
            end: 0,
            ellipsis: false,
        }
    },
    props: ["value", "perPage", "limit", "total"],
    computed: {
        getPages()
        {
            const halfLimit = (Math.round(this.limit / 2)) * this.perPage;
            let list = [];
            let start = this.value - halfLimit;
            let end = this.total;

            this.end = this.total % this.perPage;
            this.end = this.end === 0 ? this.total - this.perPage : this.total - this.end;

            if (this.value < halfLimit) {
                start = 0;
            }

            if (this.value + halfLimit < end) {
                end = this.value + halfLimit;
                this.ellipsis = true;
            } else {
                this.ellipsis = false;
            }

            for (let i = start; i < end; i += this.perPage) {
                list.push(i);
            }

            return list;
        }
    }
}
</script>