<template>
    <div 
        v-if="$route.name != 'Dashboardv2' || ($route.name == 'Dashboardv2' && !$store.state.scheduler_view_preferences.hide_filter)"
        class="sidebar-outer"
        :visible="sidebarVisible"
        :class="{'sidebar-collapse': !sidebarVisible, 'pos-sidebar-outer': $route.name == 'POS', 'dashboardv2-sidebar-outer': $route.name == 'Dashboardv2'}" 
        >
        <div  class="sidebar-wrap" 
        :class="{'sidebar-wrap-msg-conversation' : ($route.name == 'Conversation Manager' || $route.name == 'POS'), 'collapse-custom': !sidebarVisible}"
        >
        <CSidebarBrand class="d-flex align-items-center justify-content-between overflow-hidden">
            <div class="d-flex align-items-center">
                <router-link class="c-sidebar-brand d-md-down-none" to="/dashboard" target="_self">
                    <CImage src="/img/logo-icon.png" :height="55" :viewBox="`0 0 ${minimize ? 110 : 556} 134`"/>
                </router-link>
                <span class="text text-hidden mt-1">SkySalon</span>
            </div>
            <button class="header-toggler round-btn rotate-btn toggle-sidebar" type="button" aria-label="Toggle navigation" @click="$store.commit('toggleSidebar')">
                <Icon icon="tabler:x" :height="21" />
            </button>
        </CSidebarBrand>
        <AppSidebarNav :id="'app-sidebar'" />
        </div>
    </div>
</template>

<script>
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import PerfectScrollbar from 'perfect-scrollbar';

import { computed } from 'vue'
import { useStore } from 'vuex'
import AppSidebarNav from './AppSidebarNav.vue'
import { logoNegative } from '@/assets/brand/logo-negative'
import { sygnet } from '@/assets/brand/sygnet'
import { Icon } from '@/common/Icon';
    
export default {
    name: 'AppSidebar',
    components: {
        AppSidebarNav,
        Icon
    },
    mounted() {
        this.generatePs();
    },
    updated() {
        let sidebarContainer = document.getElementById('app-sidebar');
        if (this.ps) {
            this.ps.destroy();
        }
        this.generatePs();
    },
    data() {
        return ({
            ps: null
        })
    },
    methods: {
        removeBodyClass() {
            var body = document.body
            body.classList.remove('no-scroll')
        },
        closeSidebar(fromOverlay = false) {
            if (fromOverlay && !this.sidebarVisible) {
                return
            }
            this.$store.commit('toggleSidebar')
        },
        generatePs() {
            let sidebarContainer = document.getElementById('app-sidebar');
            if (sidebarContainer) {
                this.ps = new PerfectScrollbar(sidebarContainer);
            }
        },
        handleOverlayClick() {
            this.closeSidebar(true)
        },
    },
    watch: {
        $route: function () {
            // if (this.sidebarVisible) this.closeSidebar()
        },
    },
    setup() {
        const store = useStore();
        const windowWidth = window.innerWidth;
        // console.log("APP Side barsqt... ", store)
        return {
            windowWidth,
            logoNegative,
            sygnet,
            navItems () {
                return this.$store.state.sb_nav_items
            },
            show  : computed(() => store.state.sidebarShow), 
            minimize () {
            return this.$store.state.sidebarMinimize 
            },
            sidebarUnfoldable: computed(() => store.state.sidebarUnfoldable),
            sidebarVisible: computed(() => store.state.sidebarVisible),
        }
    }
}
</script>
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