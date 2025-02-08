<template>
    <div :class="['item-icon rounded-circle d-inline-flex align-items-center justify-content-center mx-auto text-white', type === 'appointment' ? 'mb-2' : 'mb-4' ]">
        <div v-if="type === 'appointment'">
            <Icon icon="tabler:calendar-time" :height="22" />
        </div>
        <div v-else-if="type === 'product'">
            <Icon icon="tabler:product-icon" :height="22" />
        </div>
        <div v-else>
            <Icon icon="tabler:star-icon" :height="22" />
        </div>
    </div>
</template>
<script>
import { Icon } from '@/common/Icon'
export default {
    name: 'ItemIcon',
    components: {
        Icon,
    },
    props: ['type']
}
</script>
<style scoped>
.item-icon {
    width: 44px;
    height: 44px;
    background: var(--text-primary-color);
}
</style>
