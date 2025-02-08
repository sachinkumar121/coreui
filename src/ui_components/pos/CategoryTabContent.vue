<template>
    <CNav variant="tabs" role="tablist" class="gap-3">
        <CNavItem v-for="category in renderedCategories" :key="category.id">
            <div
                :active="selectedCategory.id == category.id"
                @click="$emit('onCategorySelect', category)"
            >
                <Category :name="category.name"/>
            </div>
        </CNavItem>
        <div class="show-link-outer">
            <p v-if="categories.length > visible_no_of_cat" @click="() => { visible_no_of_cat = categories.length }" class="show-all-link mb-0">Show All</p>
            <p v-if="visible_no_of_cat === categories.length" @click="() => { visible_no_of_cat = 5 }" class="clear-all-link show-all-link mb-0">Hide categories</p>
        </div>
    </CNav>
</template>
<script>
import Category from "@/ui_components/pos/Category.vue"
export default {
    name: 'CategoryTabContent',
    components: {
        Category
    },
    emits: ['onCategorySelect'],
    props: {
        categories: {
            type: Array,
            default: []
        },
        selectedCategory: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            visible_no_of_cat: 5
        }
    },
    computed: {
        renderedCategories() {
            return this.categories.slice(0, this.visible_no_of_cat)
        }
    }
}
</script>
<style lang="scss" scoped>
    .nav-item {
        border-radius: var(--cui-border-radius) !important;
        &:focus, &:focus-visible, &:focus-within {
            outline-color: var(--border-color-d9);
            background-color: var(--link-color);
            color: #fff;
            border-color: #fff ;
            box-shadow: 0 0 1px 3px rgba($color: #6D57E4, $alpha: .3);
            .button-category {
                outline-color: var(--border-color-d9);
                background-color: var(--link-color);
                color: #fff;
                border-color: #fff;
            }
        }
    }
    .show-link-outer {
        height: 54px;
        display: inline-flex;
        align-items: flex-end;
        .show-all-link {
            color: var(--link-color);
            font-weight: 700;
            text-decoration: underline;
            font-size: 16px;
            display: inline-block;
            cursor: pointer;
        }
    }
    
</style>