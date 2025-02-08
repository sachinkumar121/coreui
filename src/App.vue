<script setup>
import { onBeforeMount } from 'vue'
import { useColorModes } from '@coreui/vue'

import { useThemeStore } from '@/stores/theme.js'

const { isColorModeSet, setColorMode } = useColorModes(
  'coreui-free-vue-admin-template-theme',
)
const currentTheme = useThemeStore()

onBeforeMount(() => {
  const urlParams = new URLSearchParams(window.location.href.split('?')[1])
  let theme = urlParams.get('theme')

  if (theme !== null && theme.match(/^[A-Za-z0-9\s]+/)) {
    theme = theme.match(/^[A-Za-z0-9\s]+/)[0]
  }

  if (theme) {
    setColorMode(theme)
    return
  }

  if (isColorModeSet()) {
    return
  }

  setColorMode(currentTheme.theme)
})
</script>

<script>
import "vue-select/dist/vue-select.css";
import MessageCreditToast from "./views/message_center/MessageCreditToast";
import AnimationContainer from '@/animation/AnimationContainer.vue';
// import ChatSupport from "./views/chatsupport/ChatSupport";
import { LiveUpdate } from '@capawesome/capacitor-live-update';
import { mapState } from 'vuex';
import { App as CapacitorApp } from '@capacitor/app';

export default {
  name: 'App',
  components: {
    MessageCreditToast,
    AnimationContainer,
    // ChatSupport
  },
  computed: {
    ...mapState({
        show_animation_view(state){

          if(this.$globalSkyAppSettings?.enable_app_animations !== false)
          {
            if (state.user_data?.ui_preferences)
            {
                if (state.user_data.ui_preferences.enable_celebration_animations !== true )
                {
                  console.log("debg: show_animation_view Returning false;;;;;... ", state.user_data.ui_preferences)
                  return false;
                }
                return true;
            } else {
              return true;
            }
          }
          // console.log(" debg: show_animation_view R Returning falasdse;;;;;... ")
          return false;
        } //end show animation view
    })
  },
  mounted() {

    CapacitorApp.addListener('backButton', data => {
          console.log('Back buttons called state:', data);
          try
          {
            if(data && data.canGoBack)
            {
              this.$router.back();
            }
            if(!data)
            {
              this.$router.back(); //blind attempt
            }
          }
          catch(Ex)
          {
            console.log("Back Listener exception", Ex)
          }
    });

  },
  methods:{
    async syncAndUpdate(){
      try{
        const result = await LiveUpdate.sync();
        if (result.nextBundleId) {
            await LiveUpdate.reload();
        }
      }catch(err){
        console.error(err);
      }
    }
  }
}
</script>

<template>
  <div class="app-navbar-notch"></div>
  <message-credit-toast />
  <router-view />
  <animation-container 
    v-if="show_animation_view"
  />
</template>

<style lang="scss">
// Import Main styles for this application
@import 'styles/style';
</style>
