<template>
    <div class="menu-wrap pt-sm-4 pb-sm-5 px-sm-5 px-2">
        <SearchBox 
            initialFocus
            :initial-term="searchedMenu"
            @input="setSearchTerm"
            @clear-search="resetSearchTerm"
        />
        <SearchResults 
            :term="searchTerm"
            :pageSections="pageSections"
            @show-all="showAll"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex'

import SearchResults from './SearchResults.vue'
import SearchBox from './SearchBox.vue'
import useMenuSearch from '@/composables/useMenuSearch';

export default {
    name: 'ManageBusiness',
    components: {
        SearchResults,
        SearchBox
    },
    setup: () => {
        const { pageSections, searchTerm, populatePageSections, searchMenus, showAll, setSearchTerm, resetSearchTerm } = useMenuSearch();
        return { pageSections, searchTerm, populatePageSections, searchMenus, showAll, setSearchTerm, resetSearchTerm };
    },
    computed: mapState({
        searchedMenu: state => state.search_preferences.manage_business
    }),
    mounted() {
        this.populatePageSections();
        if (this.searchedMenu) {
            this.searchTerm = this.searchedMenu;
            this.searchMenus();
        }
    }
}
</script>

<style lang="scss">
:root.dark-theme {
    .menu-wrap {
        .search-box {
            border: 1px solid #d9d9d9;
            background-color: transparent;
            color: #fff;
        }
        ul {
            a {
                svg:not(.icon-tabler) {
                    path {
                        fill: var(--text-primary-color);
                    }
                }
            }
        }
    }
}
input[type='search']::-webkit-search-decoration:hover,
input[type='search']::-webkit-search-cancel-button:hover {
    cursor: pointer;
}
@mixin transition($time) {
    transition: all $time ease;
}
@mixin center {
    top: 50%;
    transform: translateY(-50%);
}
.loader {
    svg {
        path {
            fill: var(--text-primary-color);
        }
    }
}
.search-box-wrap {
    position: relative;
    max-width: 824px;
    button {
        &.search-button {
            svg {
                path {
                    color: var(--text-primary-color);
                }
            }
        }
    }
    .search-button {
        position: absolute;
        border: 0;
        background: transparent;
        font-size: 21px;
        right: 27px;
        top: 9px;
        cursor: pointer;
        border-left: 1px solid var(--text-primary-color);
        padding-left: 15px;
        &.search-button-loader {
            right: 36px;
            top: 9px;
            padding-left: 12px;
            height: 33.5px;
        }
        svg {
            height: 26px !important;
            width: 26px !important;
        }
    }
}
.menu-wrap {
    .img-empty {
        max-width: 200px;
    }

    .search-box {
        border: 1px solid #d9d9d9;
        background-color: #f9f8ff;
        width: 100%;
        max-width: 812px;
        min-height: 54px;
        border-radius: 35px;
        margin-bottom: 34px;
        padding: 10px 75px 10px 19px;
        font-size: 20px;
        font-weight: 500;

        &:focus {
            outline: none;
        }
    }
    h5 {
        font-weight: 500;
        border-color: var(--border-color);
        padding-bottom: 9px;
        border-width: 0 0 1px 0;
        border-style: solid;
    }
    ul {
        list-style-type: none;
        a {
            background: rgba(109, 87, 228, 0.12);
            box-shadow: 0px 3px 11px rgba(0, 0, 0, 0.05);
            min-width: 256px;
            height: 62px;
            border-radius: 5px;
            color: var(--text-primary-color);
            font-size: 20px;
            transition: ease 0.5s all;
            margin-bottom: 15px;
            border: 1px solid var(--border-color);
            svg {
                &.stroke-color {
                    path {
                        stroke: var(--text-primary-color);
                    }
                }
                &.stroke-no-fill {
                    path {
                        stroke: var(--text-primary-color);
                        fill: none;
                    }
                }
                &.fill-no-stroke {
                    path {
                        fill: none;
                    }
                }
            }
            &:hover {
                text-decoration: none;
                background: rgba(109, 87, 228, 0.3);
            }
            span {
                position: relative;
                top: 2px;
            }
        }
    }
}

// Media
@media only screen and (max-width: 575px) {
    .menu-wrap {
        h5 {
            font-size: 16px;
        }
        ul a {
            font-size: 16px;
            height: 49px;
        }
    }

    @media (max-width: 500px) {
        .menu-wrap .search-box {
            min-height: 38px !important;
            padding: 5px 48px 5px 18px;
            font-size: 16px;
        }

        .search-box-wrap .search-button svg {
            height: 22px !important;
            width: 22px !important;
        }
        
        .search-box-wrap .search-button {
            top: 7px;
            font-size: 14px;
            right: 10px;
            padding-left: 7px;
            &.search-button-loader {
                top: 7px;
                font-size: 14px;
                right: 16px;
                padding-left: 7px;
                height: 23.5px;
            }
        }
    }
}
</style>
