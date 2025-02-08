<template>
    <div class="item-wrapper">
        <div class="row">
            <div class="loader-align" v-if="loading">
                <span class="loader"></span>
            </div>
            <div v-else-if="posItems?.length == 0" class="no-items-found py-5">
                <img src="/img/no-result.svg" alt="no image found">
                <p class="h5 mt-4 d-block fw-normal">No items found.</p>
            </div>
            <Item :style="itemStyle" v-else @click="onItemSelect(item)" :item="item" v-for="(item, index) in paginatedItems" :key="index"/>
        </div>
    </div>
    <Pagination 
        v-if="showPagination" 
        :prevDisabled="current_page == 0"
        :nextDisabled="current_page == maxNoOfPages - 1"
        @on-prev-click="showPrevItems"
        @on-next-click="showNextItems"
    />
</template>
<script>
import Item from "@/ui_components/pos/Item.vue"
import Pagination from "@/ui_components/pos/Pagination.vue"
import utils_lib from '@/helpers/utils_lib';
import usePos from '@/composables/usePos';

export default {
    name: 'PosItemContainer',
    setup: () => {
        const { getItemNumericInfo } = usePos();
        return { getItemNumericInfo }
    },
    components: {
        Item,
        Pagination
    },
    props: {
        items: {
            type: Array,
            default: []
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return ({
            no_of_rows: 3,
            items_per_row: 4,
            current_page: 0,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        })
    },
    computed: {
        itemStyle() {
            return {
                width: `${100 / this.items_per_row}%`
            };
            if (this.windowWidth > 1140) {
            } 
        },
        showPagination() {
            return this.items.length > (this.no_of_rows * this.items_per_row);
        },
        posItems() {
            return utils_lib.arrayChunk(this.items, this.items_per_row * this.no_of_rows);
        },
        paginatedItems() {
            return this.posItems[this.current_page];
        },
        maxNoOfPages() {
            return this.posItems.length;
        }
    },
    mounted() {
        this.updateDeviceOrientation();
        // Listen for window resize events and update windowWidth
        window.addEventListener('resize', this.updateDeviceOrientation);
    },
    beforeDestroy() {
        // Clean up the event listener when the component is destroyed
        window.removeEventListener('resize', this.updateDeviceOrientation);
    },
    watch: {
        items() {
            this.current_page = 0;
        }
    },
    methods: {
        async onItemSelect(item) {
            await this.$store.commit('pos/addToCart', item);
        },
        showNextItems() {
            this.current_page++;
        },
        showPrevItems() {
            this.current_page--;
        },
        updateDeviceOrientation() {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
            this.updateItemNumericInfo();
        },
        updateItemNumericInfo() {
            const display_profile = this.getItemNumericInfo(this.windowWidth, this.windowHeight);
            this.no_of_rows = display_profile.no_of_rows;
            this.items_per_row = display_profile.items_per_row;
        }
    }
}
</script>
<style lang="scss" scoped>
    .item-wrapper {
        min-height: 362px;
    }
     .no-items-found {
        text-align: center;
        img {
            width: 245px;
            display: inline-block;
        }
    }
    .loader-align {
        min-height: 500px;
        display: flex;
        justify-content: center;
        align-items: center;
        .loader {
            width: 48px;
            height: 48px;
            border: 5px solid #ACCAFF36;
            border-bottom-color: #ACCAFF;
            border-radius: 50%;
            display: inline-block;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;
        }

        @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    } 
}
@media (max-width: 1180px) {
    .item-wrapper {
        min-height: 174px;
    }
}
</style>