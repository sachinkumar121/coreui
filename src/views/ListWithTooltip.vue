<template>
    <span class="">{{ firstItemName }}</span>
    <div class="c-sub-text text-hidden d-inline-block">
        <a v-if="show_more_item && itemsListHtml" class="text-underline" v-c-tooltip="{content: itemsListHtml}"><Icon icon="tabler:plus" :height="15"  /><u>{{ items.length - 1}} more</u></a>
    </div>
</template>

<script>
import { Icon } from '@/common/Icon';

export default {
    name: "ListWithTooltip",
    props: {
        items: {
            type: Array
        },
        map: {
            type: Function,
            default: (option) => option.name,
        }
    },
    components: {
        Icon
    },
    data() {
        return ({
            itemsListHtml: null,
            firstItemName: null,
            show_time: true,
            total_time: 0,
            show_more_item: true
        });
    },
    created() {
        this.generateItemsListHtml();
    },
    methods: {
        generateItemsListHtml() {            
            let itemNameArr = this.items.map((val) => this.map(val));

            this.firstItemName = itemNameArr.shift() || null;
            if (!itemNameArr.length) {
                this.show_more_item = false;
            } else {
                this.itemsListHtml = itemNameArr.map(s => `<li>${s}</li>`).join("\r\n");
            }
        },
    }
}
</script>