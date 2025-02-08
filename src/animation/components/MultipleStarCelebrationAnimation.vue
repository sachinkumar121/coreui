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
import MultipleStarCelebrationAnimationJSON from '@/animation/json-data/MultipleStarCelebrationAnimation.json'

export default {
    name: "MultipleStarCelebrationAnimation",
    emits: ['completed'],
    data() {
        return {
            animationData: MultipleStarCelebrationAnimationJSON
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