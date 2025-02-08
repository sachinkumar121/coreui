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
import CompleteAnimationJSON from '@/animation/json-data/CompleteAnimation.json'

export default {
    name: "CompleteAnimation",
    emits: ['completed'],
    data() {
        return {
            animationData: CompleteAnimationJSON
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