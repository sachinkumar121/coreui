<template>
    <div>
        <button class="px-4 py-2 button-category rounded-2">{{ name }}</button>
    </div>
</template>
<script>
export default {
    name: 'Category',
    props: ['name'],
}
</script>
<style lang="scss" scoped>
.button-category {
    color: var(--text-primary-color);
    background: var(--category-btn-background);
    border: 2px solid var(--border-color-d9);
    font-size: 16px;
    font-weight: 500;
    transition: 0.5s ease;
    height: 53px;
    &:hover {
        background-color: var(--link-color);
        color: #fff;
        box-shadow: 0 0 1px 3px rgba($color: #6D57E4, $alpha: .3);
    }
    &:focus, &:visited {
        box-shadow: 0 0 1px 3px rgba($color: #6D57E4, $alpha: .3);
    }
}
div[active="true"] {
    .button-category {
        background-color: var(--link-color);
        color: #fff;
        box-shadow: 0 0 1px 3px rgba($color: #6D57E4, $alpha: .3);
    }
}
</style>