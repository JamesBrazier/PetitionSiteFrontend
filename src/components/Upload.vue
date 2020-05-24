<template>
    <b-card no-body border-variant="light" bg-variant="light" footer-bg-variant="light">
        <div v-if="avatar" class="text-center">
            <span :src="baseImg" class="avatar">
                <img id="upload-image" :src="baseImg" alt="" :class="failed ? 'invis' : null"
                 @load="failed = false" @error="failed = true" />

                <b-icon-camera v-if="failed"></b-icon-camera>
            </span>
        </div>
        
        <div v-else class="text-center">
            <img id="upload-image" :src="baseImg" alt="" :class="failed ? 'invis' : 'image'"
            @load="failed = false" @error="failed = true" />

            <b-icon-camera v-if="failed" variant="dark" font-size="5rem"></b-icon-camera>
        </div>

        <template v-slot:footer>
            <b-button variant="info" @click="inputElement.click()">
                <b-icon-upload class="mr-1"></b-icon-upload>
                Upload
            </b-button>

            <b-button v-if="reset" variant="danger" @click="cancelFile()">
                Reset
            </b-button>

            <b-button variant="danger" @click="removeImage()">
                <b-icon-x class="mr-1"></b-icon-x>
                Remove
            </b-button>

            <input type="file" accept="image/png, image/jpeg, image/gif" id="upload-input"
             class="invis" @change="uploadFile()"/>
        </template>
    </b-card>
</template>

<script>
import image from "./Image"

export default {
    data() {
        return {
            failed: false,
            inputElement: null,
            imageElement: null
        }
    },
    props: {
        "value": Object,
        "base-img": String,
        "avatar": Boolean,
        "reset": Boolean
    },
    mounted() {
        this.inputElement = document.getElementById("upload-input");
        this.imageElement = document.getElementById("upload-image");
    },
    methods: {
        uploadFile()
        {
            const file = this.inputElement.files[0];

            const urlReader = new FileReader();
            urlReader.onload = (function(image) { //capture the image element
                return function(event) { image.src = event.target.result; }; 
            })(this.imageElement);
            urlReader.readAsDataURL(file);

            const dataReader = new FileReader();
            dataReader.onload = (function(vm, type) {
                return function(event) { vm.$emit("input", { data: event.target.result, type}); };
            })(this, file.type);
            dataReader.readAsArrayBuffer(file);
        },
        cancelFile()
        {
            this.imageElement.src = this.baseImg;
            this.$emit("input", undefined);
        },
        removeImage()
        {
            this.imageElement.src = " ";
            this.$emit("input", null);
        }
    },
    components: {
        "my-image": image
    }
}
</script>

<style scoped>
.invis {
    visibility: hidden !important;
    width: 0% !important;
    height: 0% !important;
}

.image {
    border-radius: 0.25rem;
    max-width: 100%;
    max-height: auto;
}

.avatar {
    border-radius: 50% !important;
    background-color: #343a40;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
    margin-bottom: 1rem;
    width: 15rem;
    height: 15rem;
}

.avatar img {
    width: 90%;
    height: 90%;
    max-width: 100%;
    max-height: auto;
    border-radius: inherit;
}

.avatar svg {
    width: 60%;
    height: auto;
    color: #fff;
    max-width: 100%;
}

</style>