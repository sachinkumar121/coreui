<template>
    <div class="d-flex align-items-center py-2 px-3 border-dotted rounded-2 justify-content-between mt-3 discount-wrap">
        <div class="d-flex gap-2 align-items-center flex-wrap">
            <p class="h6 text-uppercase mb-0">{{ coupon_code }}</p>
            <p class="mb-0 py-1 px-2 border rounded-2 c-bg">Coupon applied</p>
        </div>
        <div class="h6 text-uppercase mb-0 cursor-pointer" @click="$emit('onRemove')">
            remove
        </div>
    </div>
</template>
<script>
export default {
    name: 'Discount Section',
    props: {
        coupon_code: {
            type: [String, null],
            default: null
        }
    },
    emits: ['onRemove']
}
</script>
<style lang="scss" scoped>
.discount-wrap {
    border-style: dotted;
    background-color: rgba($color: #CEFAC7, $alpha: .6);
    border-color: var(--border-color);
}
.c-bg {
    background: rgb(255 255 255 / 69%);
}
</style>