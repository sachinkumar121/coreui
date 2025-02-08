<template>
    <Vue3Lottie 
        ref="lottieAnimation"
        :animationData="animationData" 
        :height="300" 
        :width="300"
        :loop="1"
        @onComplete="$emit('completed')"
    />
</template>

<script>
import { Vue3Lottie } from 'vue3-lottie';
import ThankYouAnimationJSON from '@/animation/json-data/ThankYouAnimation.json'

export default {
    name: "ThankYouAnimation",
    emits: ['completed'],
    data() {
        return {
            animationData: ThankYouAnimationJSON
        }
    },
    components: {
        Vue3Lottie
    },
    methods: {
        onAnimationComplete() {
            this.$refs.lottieAnimation.destroy();
        }
    }
}
</script>