<template>
    <CModal 
        :visible="show"
        aria-labelledby="PurchaseCreateModal"
        @close="onModalClose"
        :unmount-on-close="true"
    >
        <CModalHeader>
            <CModalTitle id="PurchaseCreateModal">{{ title || "Purchase Create Status" }}</CModalTitle>
        </CModalHeader>
        <CModalBody class="text-center">
            <div class="row">
                <div class="col-md-6">
                    <label class="control-label">
                        <b>Order Status </b>&nbsp;
                    </label>
                </div>
                <div class="col-md-6" color="danger">
                    <b>{{ order_status }}</b>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <label class="control-label">
                        <b>Payment Status </b>&nbsp;
                    </label>
                </div>
                <div class="col-md-6" color="danger">
                    <b>{{ payment_status }}</b>
                </div>
            </div>
        </CModalBody>
        <CModalFooter>
            <CButton v-if="invoice_number!=''" :disabled="is_view_invoice_disabled" @click="$emit('onRedirectToInvoice')"
            color="primary">View Invoice</CButton>
            <CButton v-else color="warning" @click="$emit('onClose')">{{payment_modal_button_text}}</CButton>
        </CModalFooter>
    </CModal>
</template>

<script>

export default {
    name: 'PurchaseCreateModal',
    emits: ['onClose', 'onRedirectToInvoice', 'onClose'],
    props: {
        title: {
            default: "Purchase Create Status",
            type: String
        },
        invoice_number: {
            type: String,
            default: ''
        },
        order_status: {
            type: String
        },
        payment_status: {
            type: String
        },
        payment_modal_button_text: {
            type: String
        },
        is_view_invoice_disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return ({
            show: this.visible
        })
    },
    watch: {
        visible: function(newVal) {
            this.show = newVal;
        }
    },
    methods: {
        onModalClose() {
            this.$emit('onClose');
        }
    }
}
</script>