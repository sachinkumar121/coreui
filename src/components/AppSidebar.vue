<script setup>
import { RouterLink } from 'vue-router'

import { logo } from '@/assets/brand/logo'
import { sygnet } from '@/assets/brand/sygnet'
import { AppSidebarNav } from '@/components/AppSidebarNav.js'
import { useSidebarStore } from '@/stores/sidebar.js'
import { useThemeStore } from '@/stores/theme.js'

const sidebar = useSidebarStore()
const currentTheme = useThemeStore()
</script>

<template>
  <CSidebar
    class="border-end"
    :colorScheme="currentTheme.theme"
    position="fixed"
    :narrow="sidebar.narrow"
    :unfoldable="sidebar.unfoldable"
    :visible="sidebar.visible"
    @visible-change="(value) => sidebar.toggleVisible(value)"
  >
    <CSidebarHeader class="border-bottom">
      <RouterLink custom to="/dashboard" v-slot="{ href, navigate }">
        <CSidebarBrand v-bind="$attrs" as="a" :href="href" @click="navigate">
          <div class="sidebar-brand-full">
            <CImage src="/img/logo-icon.png" :height="32" :viewBox="`0 0 556 134`"/>
            <span class="text mt-1">SkySalon</span>
          </div>
          <div class="sidebar-brand-narrow">
            <CImage src="/img/logo-icon.png" :height="32" :viewBox="`0 0 556 134`"/>
          </div>
        </CSidebarBrand>
      </RouterLink>
      <CCloseButton class="d-lg-none" :[currentTheme.theme]="true" @click="sidebar.toggleVisible()" />
    </CSidebarHeader>
    <AppSidebarNav />
    <CSidebarFooter class="border-top d-none d-lg-flex" v-if="false">
      <CSidebarToggler @click="sidebar.toggleUnfoldable()" />
    </CSidebarFooter>
  </CSidebar>
</template>
<style scoped lang="scss">
    *,
    .nav-item,
    .nav-link {
        font-family: 'Overpass', sans-serif;
    }
    a, .color-a {
        color: #6D57E4;
    }
    .nav-link {
        font-size: 16px;
    }
    .fw-500 {
        font-weight: 500;
    }
    
    
    

    .nav-link.nav-group-toggle {
        background-color: #fff;
        color : #000;
    }
</style>
