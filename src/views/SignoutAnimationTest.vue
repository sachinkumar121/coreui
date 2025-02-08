<template>
    <select name="" id="" v-model="selectedAnimation" style="position: relative; z-index: 100;">
        <option value="SignoutAnimationFade">Animation Bottom to Top</option>  
        <option value="SignoutAnimation2">Animation Bounce & Fade Top</option>  
        <option value="SignoutAnimation3">Animation Bounnce & Fade Bottom</option>  
        <option value="SignoutAnimation4">Animation Left - Spin - Right Fade</option>  
        <option value="SignoutAnimation5">Animation Left - Right Fade</option>  
    </select>
    
    <div style="width: 100%;">
        <component 
            class="animation-outer"
            :is="selectedAnimation"
        ></component>

    </div>
</template>
<script>

import SignoutAnimationFade from '@/animation/components/SignoutAnimationFade.vue'
import SignoutAnimation2 from '@/animation/components/SignoutAnimation2.vue'
import SignoutAnimation3 from '@/animation/components/SignoutAnimation3.vue'
import SignoutAnimation4 from '@/animation/components/SignoutAnimation4.vue'
import SignoutAnimation5 from '@/animation/components/SignoutAnimation5.vue'

export default {
    name: "SignoutAnimationTest",
    components: {
        SignoutAnimationFade,
        SignoutAnimation2,
        SignoutAnimation3,
        SignoutAnimation4,
        SignoutAnimation5
    },
    data() {
        return {
            selectedAnimation: null
        }
    }
}
</script>