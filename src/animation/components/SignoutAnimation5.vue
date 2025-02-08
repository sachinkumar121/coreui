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
import SignoutAnimation5JSON from '@/animation/json-data/SignoutAnimation5.json'
export default {
    name: "SignoutAnimation5",
    data() {
        return {
            animationData: SignoutAnimation5JSON
        }
    },
    components: {
        Vue3Lottie
    },
    methods: {
    }
}
</script>