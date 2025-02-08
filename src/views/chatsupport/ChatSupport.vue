<template>
    <div v-if="iframevisible">
        <iframe style="width: 400px; height: 600px;" 
            src="https://app.fastbots.ai/embed/cm3j7v18o0do4s5bmx0fyj0qu"></iframe>
    </div>
</template>
<script>

export default {
    name: 'ChatSupport',
    data() {
        return { 
            loaded: false,
            iframevisible: false
        }
    },
    mounted() {
        this.iframevisible =  this.$globalSkyAppSettings?.enable_ai_chatbot_for_support || false;
        
    },
    methods: {
         
    }
}
</script>
