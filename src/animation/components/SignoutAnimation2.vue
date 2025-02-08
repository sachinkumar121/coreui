<template>
    <Vue3Lottie 
        ref="lottieAnimation"
        :animationData="animationData" 
        :height="300" 
        :width="300"
        :loop="1"
    />
</template>
<script>
import { Vue3Lottie } from 'vue3-lottie';
import SignoutAnimation2JSON from '@/animation/json-data/SignoutAnimation2.json'
export default {
    name: "SignoutAnimation2",
    data() {
        return {
            animationData: SignoutAnimation2JSON
        }
    },
    components: {
        Vue3Lottie
    },
    methods: {
    }
}
</script>