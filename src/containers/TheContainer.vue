<template>
    <div
        class="d-flex font-overpass"
        :class="{'old-nav': navItems.length > 15}"
    >
        <AppSideBar class="print-d-none" />
        <div class="w-100 section-right" :class="{'sticky-sidebar': $route.name == 'Dashboardv2'}">
            <AppHeader v-if="showAppHeader" class="print-d-none header-sticky" />
            <CContainer fluid class="wrap-body" :class="{'pt-0': $route.name == 'Dashboardv2'}">
                <!-- <button
                    class="btn btn-primary btn-primary-new border-radius-14 min-height-44 ms-1 px-2 px-sm-3 px-xxl-3 mt-3 d-sm-none"
                    type="button" @click="goBack()" v-show="showBackBtn"
                >
                    <Icon
                        icon="tabler:chevron-left"
                        :height="24"
                        class="ms-1"
                    />
                    Back
                </button> -->
                <AutoSignOff
                    v-if="idle_user_logout_minutes"
                    :idle_user_logout_minutes="idle_user_logout_minutes"
                />
                <router-view />
            </CContainer>
            <AppFooter class="print-d-none" v-if="$route.name != 'Dashboardv2' && $route.name != 'POS'"/>
        </div>
    </div>
</template>

<script>
import {CContainer} from '@coreui/vue'
import AppSideBar from '@/ui_components/AppSidebar.vue'
import AppHeader from '@/ui_components/AppHeader.vue'
import AppFooter from '@/ui_components/AppFooter.vue'
import {Icon} from '@/common/Icon'
import AutoSignOff from '@/ui_components/AutoSignOff.vue'

export default {
    name: 'TheContainer',
    components: {
        AppSideBar,
        AppHeader,
        AppFooter,
        CContainer,
        AutoSignOff,
        Icon,
    },
    computed: {
        showBackBtn() {
            console.log("history length => ", history.length)
            return history.length > 0 ? true : false
        },
        showAppHeader() {
            if (this.$route.name != 'POS') {
                if (this.$route.name == 'Dashboardv2') {
                    return !(this.$store.state.scheduler_view_preferences.hide_top_header);
                }
                return true;
            }
        }
    },
    data() {
        return {
            idle_user_logout_minutes:
                this.$store.state.business_settings.idle_user_logout_minutes,
            navItems: [],
        }
    },
    created() {
        this.navItems = this.$store.state.sb_nav_items[0]._children
    },  
    methods:{
        goBack(){
            console.log("Here")
        }
    }
   
}
</script>

<style lang="scss">

@media (min-width: 1200px) {
    .old-nav {
        .sidebar-outer {
            width: 19rem;
            &.sidebar-collapse {
                width: 67px;
            }
        }
        .sidebar-outer + .section-right {
            padding-left: 19rem;
        }
        .sidebar-outer.sidebar-collapse + .section-right {
            padding-left: 67px;
        }
    }
}
@media (max-width: 1199.98px) {
    .old-nav {
        .sidebar-outer {
            // width: 17rem;
            background: rgb(0,0,0,0.4);
            width: 100vw;
            &.sidebar-collapse {
                width: 67px;
            }
            &.sidebar-collapse + .section-right {
                padding-left: 67px;
            }
        }
        .sidebar-outer + .section-right {
            padding-left: 17rem;
        }
    }
}
@media (max-width: 1024px) {
    .old-nav {
        .sidebar-outer.sidebar-collapse + .section-right {
            padding-left: 67px;
        }
    }
}
@media (max-width: 575.98px) {
    .old-nav {
        .sidebar-outer + .section-right {
            padding-left: 0;
        }
        .sidebar-outer.sidebar-collapse + .section-right {
            padding-left: 0;
        }
    }
}

</style>
