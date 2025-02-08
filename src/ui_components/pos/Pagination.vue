<template>
    <div class="d-flex justify-content-between align-items-center pagination-icon">
        <Icon icon="tabler:circle-arrow-left" :class="{'disabled': prevDisabled}" :width="40" :height="40" @click="() => { !prevDisabled ? $emit('onPrevClick') : null }" />
        <Icon icon="tabler:circle-arrow-right" :class="{'disabled': nextDisabled}" :width="40" :height="40" @click="() => { !nextDisabled ? $emit('onNextClick') : null }" />
    </div>
</template>
<script>
import { Icon } from '@/common/Icon'
export default {
    name: 'Pagination',
    props: {
        prevDisabled: {
            type: Boolean,
            default: false
        },
        nextDisabled: {
            type: Boolean,
            default: false
        }
    },
    components: {
        Icon
    },
    emits: ['onPrevClick', 'onNextClick']
}
</script>
<style lang="scss" scoped>
.pagination-icon {
    padding-top: 15px;
    .icon-tabler {
        color: var(--link-color);
        cursor: pointer;
        stroke-width: 1.5px;
    }
    .disabled {
        color: #9A9AB0;
        opacity: .8;
    }
}
</style>