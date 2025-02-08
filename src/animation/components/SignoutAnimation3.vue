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
import SignoutAnimation3JSON from '@/animation/json-data/SignoutAnimation3.json'
export default {
    name: "SignoutAnimation3",
    data() {
        return {
            animationData: SignoutAnimation3JSON
        }
    },
    components: {
        Vue3Lottie
    },
    methods: {
    }
}
</script>