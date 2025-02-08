<template>
    <div class="p-3 border rounded-2 customer-wrap position-relative mb-3">
        <div class="position-absolute btn btn-close close-position" @click="$emit('onCustomerRemove')"></div>
        <p class="h6 fw-bold mb-2">{{customer.first_name}} {{customer.last_name}}</p>
        <div class="customer-detail">
            <p class="mb-0">{{customer.email}}</p>
            <p class="mb-0">{{customer.phone}}</p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Customer Details',
    props: {
        customer: {
            type: Object,
            default: null
        }
    },
    emits: ['onCustomerRemove']
}
</script>
<style lang="scss" scoped>
.close-position {
    right: 0;
    top: 10px;
}
.customer-detail {
    p {
        font-weight: 500;
        font-size: 15px;
        color: var(--text-gray);
    }
}
.customer-wrap {
    .btn-close {
        width: 15px;
        /* background: #fff; */
        opacity: .8;
        background-size: 10px;
        height: 15px;
        border-radius: 15px;
        padding: 6px;
        right: 10px;
    }
}
</style>