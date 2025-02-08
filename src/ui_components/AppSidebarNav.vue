<template>
    <CSidebarNav
        :id="'app-sidebar'"
        :class="{'sidebar-visible': sidebarVisible}" class="px-0"
    >
        <li v-for="navItem in navItems" :key="navItem.name" class="nav-item dropdown-item">
            <router-link
                class="nav-link rounded-0"
                :to="navItem.to"
                :custom="false"
                v-if="navItem.to">
                <Icon :icon="navItem.icon" :height="24" />
                <span class="text text-hidden">{{ navItem.name }}</span>
            </router-link>
            
        </li>
    </CSidebarNav>
</template>

<script>
const setTopStyle = function() {
    let fromTop = $(this)[0].getBoundingClientRect().top;
    $(this).find('span.text').css("top", fromTop);
};
const normalizePath = (path) =>
  decodeURI(path)
    .replace(/#.*$/, '')
    .replace(/(index)?\.(html)$/, '')

const isActiveLink = (route, link) => {
  if (link === undefined) {
    return false
  }

  if (route.hash === link) {
    return true
  }

  const currentPath = normalizePath(route.path)
  const targetPath = normalizePath(link)

  return currentPath === targetPath || currentPath.startsWith(targetPath);
}

import { Icon } from '@/common/Icon';

export default {
    name: "AppSidebarNav",
    components: {
        Icon
    },
    methods: {
        computedClasses(navItem) {
            return {
                'active': this.isNavGroupActive(navItem),
                // 'show': this.isNavGroupActive(navItem),
                'show': this.sidebarVisible && this.activeNavGroup == navItem.name
                // 'show': this.sidebarVisible && this.isNavGroupActive(navItem)
            }
        },
        isActiveItem(route, item) {
            if (isActiveLink(route, item.to)) {
                return true
            }

            if (item.items) {
                return item.items.some((child) => this.isActiveItem(route, child))
            }

            return false
        },

        isNavGroupActive(item) {
            return item.items.some((child) => this.isActiveItem(this.$route, child));
        },
        
        isNavGroupShouldVisible(navItem) {
            if (!this.sidebarVisible) {
                return this.sidebarVisible;
            } else {
                return this.isNavGroupActive(navItem);
            }
        },
        onVisibleChange() {
            if (!this.sidebarVisible) {
                // console.log(this.globalHide);
            }
        },
        onNavGroupClick(navItem) {
            if (!this.sidebarVisible) {
                this.$store.commit({
                    type: 'updateSidebarVisible',
                    value: true,
                });
            }
            this.activeNavGroup = navItem.name;
        }
    },
    data() {
        return ({
            navItems: [],
            globalHide: false,
            activeNavGroup: null
        });
    },
    computed: {
        // navItems() {
        //     this.$store.state.sb_nav_items[0]._children;
        // },
        sidebarVisible() {
            return this.$store.state.sidebarVisible;
        }
    },
    watch: {
        "$store.state.sb_nav_items"(items) {
            this.navItems = items[0]._children;
        },
        
        $route (to, from) {
            // console.log(to);
            // console.log(from);
            // this.show = false;
            if (screen.width < 1025) {
                this.$store.commit({
                    type: 'updateSidebarVisible',
                    value: false
                });
            }
        }
    },
    mounted() {
        let activeNavGroup = this.navItems.filter(nv => nv.component == "CNavGroup").map(nv => {
            nv.active = this.isNavGroupActive(nv);
            return nv;
        }).find(nv => nv.active);
        if (activeNavGroup) {
            this.activeNavGroup = activeNavGroup.name;
        }
        this.$store.commit({
            type: 'updateSidebarVisible',
            value: this.sidebarVisible,
        });
        // $("div.collapse-custom > ul#app-sidebar li").on('click', setTopStyle).on("mouseover", setTopStyle);
    },
    created() {
        // console.log(this.$store.state.sb_nav_items[0]._children);
        this.navItems = this.$store.state.sb_nav_items[0]._children;
    }
}
</script>
<style lang="scss" scoped>
    .nav-item {
        &:focus, &:focus-within, &:focus-visible {
            outline: 0;
            box-shadow: none !important;
        }
    }
</style>
<style lang="scss">

    .nav-item,
    .nav-item .nav-link,
    .nav-item .nav-link svg,
    .nav-item .nav-link span {
        color  : var(--text-primary-color);
    }
    
    .nav-item {
        .nav-link{
            svg {
                &:not(.icon-tabler) {
                    path {
                        fill: var(--text-primary-color);
                    }
                }
            }
            &:hover, &.active, &.router-link-active, &:focus {
                svg {
                    &:not(.icon-tabler) {
                        path {
                            fill: #6D57E4 !important;
                        }
                    }
                }   
            }
        }
        &.dropdown {
            .nav-link {
                svg {
                    path {
                        fill: none;
                    }
                }
                &:hover, &.active {
                    svg {
                        &:not(.icon-tabler) {
                            path {
                                fill: none !important;
                            }
                        }
                    }   
                }
            }
        }
    }
   </style>