<template>
    <div class="d-lg-none" @click="$emit('toggle-class')">
        <div class="d-inline-flex rounded-circle fw-semibold cart-bg ms-2 position-relative align-items-center justify-content-center cursor-pointer">
            <Icon class="me-0" icon="tabler:shopping-cart" :height="18"/>
            <!-- <span>Cart</span> -->
            <!-- <div class="count position-absolute d-inline-flex justify-content-center text-white align-items-center rounded-circle text-sm">{{ count }}</div>  -->
        </div>
    </div>
</template>
<script>
import { Icon } from '@/common/Icon'

export default {
    name: 'CartCount',
    components: {
        Icon,
    },
    props: {
        count: {
            type: Number,
            default: 0
        }
    },
}
</script>
<style lang="scss">
    .cart-bg {
        background: rgb(109 87 228 / 6%);
        width: 44px;
        height: 44px;
        color: --var(--text-primary-color);
        svg {
            margin-right: 5px;
        }
        .count {
            right: 0;
            top: 0;
            width: 20px;
            height: 20px;
            background: var(--link-color)
        }
    }
</style>