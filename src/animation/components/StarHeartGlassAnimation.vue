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
import StarHeartGlassAnimationJSON from '@/animation/json-data/StarHeartGlassAnimation.json'

export default {
    name: "StarHeartGlassAnimation",
    emits: ['completed'],
    data() {
        return {
            animationData: StarHeartGlassAnimationJSON
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