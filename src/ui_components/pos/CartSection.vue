<template>
    <div :class="{ cart: isActive }" class="col-custom-4 py-3 divider-v cart-wrap d-inline-block">
        <div class="cart-section d-block">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: 'CartSection',
    props: {
        isActive: {
        type: Boolean,
        required: true,
        },
    },
}
</script>
<style lang="scss" scoped>
.divider-v {
    border-left: 1px solid #E1E1FB;
}
.col-custom-4 {
    width: 360px;
}
@media (min-width: 1140px) {
    .col-custom-4 {
        flex: 0 0 auto;
        width: 33.33333333%;
    }
}
</style>