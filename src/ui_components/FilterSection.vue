<template>
    <div class="row controls-div">
        <slot name="filter-section-heading">
            <div class="settings-text">Filter Options</div>
        </slot>
        <div class="col-md-4">
            <slot name="search-input" />
        </div>
        <div class="col-md-8 text-right justify-content-end d-flex flex-wrap align-items-center">
            <slot name="actions" />
        </div>
    </div>
</template>
<script>
export default {
    name: 'FilterSection',
}
</script>
<style scoped>
.settings-text {
    position: absolute;
    background: #fff;
    padding: 3px 6px;
    top: -15px;
    left: 15px;
    font-size: 16px;
    font-weight: bold;
}
</style>