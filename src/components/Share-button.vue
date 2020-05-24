<template>
    <a target="_blank" class="share-btn" :href="links[site] + link" v-b-tooltip="display[site]">
        <img :src="'/src/assets/' + site + '.png'" :alt="site" />
    </a>
</template>

<script>
export default {
    data() {
        return {
            links: {
                "facebook": "http://www.facebook.com/sharer.php?u=",
                "twitter": "https://twitter.com/share?url=",
                "reddit": "http://reddit.com/submit?url=",
                "linkedin": "http://www.linkedin.com/shareArticle?mini=true&amp;url=",
                "tumblr": "http://www.tumblr.com/share/link?url=",
                "google": "https://plus.google.com/share?url=",
                "email": "mailto:?Body=",
            },
            display: {
                "facebook": "Facebook",
                "twitter": "Twitter",
                "reddit": "Reddit",
                "linkedin": "LinkedIn",
                "tumblr": "Tumblr",
                "google": "Google Plus",
                "email": "Email",
            }
        }
    },
    props: {
        "site": String, 
        "link": String
    },
    methods: {
        capitalize(str)
        {
            return str[0].toUpperCase() + str.substr(1);
        }
    }
}
</script>

<style scoped>
.share-btn img {
    width: 50px;
    border-radius: 3px;
    /* padding: 5px; */
    border: 0;
    box-shadow: 0;
    display: inline;
}

.share-btn {
    padding: 5px;
}

.facebook {
    background-color: #3b5998;
    border-color: #3b5998;
}

.twitter {
    background-color: #00a9f1;
    border-color: #00a9f1;
}

.reddit {
    background-color: #FF4500;
    border-color: #FF4500;
}

.linkedin {
    background-color: #007bb6;
    border-color: #007bb6;
}

.tumblr {
    background-color: #34526f;
    border-color: #34526f;
}

.google {
    background-color: #DC4E41;
    border-color: #DC4E41;
}

.email {
    background-color: #17a2b8;
    border-color: #17a2b8;
}
</style>