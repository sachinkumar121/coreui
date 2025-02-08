<template>
  <div class="c-app">
    <div class="c-body">
      <ExternalAppHeader :visibility="visibility_header" />
      <main class="c-main">
        <CContainer fluid>
          <router-view v-slot="{ Component }">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </router-view>
        </CContainer>
      </main>
      <ExternalAppFooter :visibility="visibility_footer"/>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ExternalAppHeader from '@/ui_components/ExternalAppHeader';
import ExternalAppFooter from '@/ui_components/ExternalAppFooter';

export default {
  name: 'ExternalContainer',
  components: {
    ExternalAppHeader,
    ExternalAppFooter
  },
  setup() {
    const route = useRoute();
    // Define the visibility based on query params with default values
    const visibility_header = computed(() => route.query.show_logo === '1' ? 1 : 0);
    const visibility_footer = computed(() => route.query.show_footer === undefined || route.query.show_footer === '1' ? 1 : 0);
    return {
      visibility_header,
      visibility_footer
    };
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
