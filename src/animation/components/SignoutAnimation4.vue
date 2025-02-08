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
import SignoutAnimation4JSON from '@/animation/json-data/SignoutAnimation4.json'
export default {
    name: "SignoutAnimation4",
    data() {
        return {
            animationData: SignoutAnimation4JSON
        }
    },
    components: {
        Vue3Lottie
    },
    methods: {
    }
}
</script>