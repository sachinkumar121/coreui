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
import HeartAnimationJSON from '@/animation/json-data/HeartAnimation.json'

export default {
    name: "HeartAnimation",
    emits: ['completed'],
    data() {
        return {
            animationData: HeartAnimationJSON
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