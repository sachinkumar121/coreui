<template>
    <div class="coupon-div position-relative w-100">
        <input type="text" class="form-control" placeholder="Coupon Code" v-model.trim="coupon_code" @keyup.enter="$emit('onApplyCoupon', coupon_code)" :disabled="disabled">
        <Icon class="coupon-div-search-icon" icon="tabler:search-icon" @click="!disabled ? $emit('onSearchClick') : null" />
        <button class="position-absolute btn btn-primary" @click="$emit('onApplyCoupon', coupon_code)" :disabled="disabled">Apply</button>
    </div>
</template>
<script>
import { Icon } from '@/common/Icon'

export default {
    name: 'CouponInput',
    emits: ['onApplyCoupon', 'onSearchClick'],
    components: {
        Icon
    },
    props: {
        clearInput: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        clearInput(newValue) {
            if (newValue) {
                this.coupon_code = null;
            }
        }
    },
    data() {
        return ({
            coupon_code: null
        })
    }
}
</script>
<style lang="scss" scoped>
.coupon-div {
    input {
        padding-right: 70px;
        padding-left: 30px;
    }
    button {
        border-radius: 0 5px 5px 0;
        right: 0;
        top: 0;
        height: 44px;
        &.btn-primary {
            background-color: var(--link-color);
            border-color: var(--link-color);
        }
    }
    .coupon-div-search-icon {
        position: absolute;
        top: 9px;
        left: 7px;
        width: 20px !important;
        cursor: pointer;
    }
}
</style>