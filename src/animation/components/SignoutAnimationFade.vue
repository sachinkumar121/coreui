<template>
    <Vue3Lottie 
        ref="lottieAnimation"
        :animationData="animationData" 
        :height="1000" 
        :width="1000"
        :loop="100"
    />
</template>
<script>
import { Vue3Lottie } from 'vue3-lottie';
import SignoutAnimationJSON from '@/animation/json-data/SignoutAnimation.json'
export default {
    name: "SignoutAnimationFade",
    data() {
        return {
            animationData: SignoutAnimationJSON
        }
    },
    components: {
        Vue3Lottie
    },
    methods: {
    }
}
</script>
<style>
.animation-outer svg {
    max-width: 100%;
}
</style>