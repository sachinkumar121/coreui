<template>
    <CModal
        :visible="show"
        alignment="center"
        backdrop="static"
        @close="closePopup"
    >
        <CModalHeader>
            <CModalTitle>Bulk Operation</CModalTitle>
        </CModalHeader>
        <CModalBody class="text-center py-4">
            <template v-if="status == 'success'">
                <Icon icon="tabler:circle-check" class="success" :width="70" :height="70" />
                <div>
                    All records were successfully added.<br>
                </div>
            </template>
            <template v-else>
                <Icon icon="tabler:exclamation-circle" class="issue" :width="70"  :height="70" />
                <div>Some records were not added, see rows for specific errors.</div>
            </template>
            <strong v-if="number_of_records > 0">Number of records: {{ number_of_records }}</strong>
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" @click="closePopup">Close</CButton>
            <CButton color="primary" @click="closePopup" v-if="status == 'success'">Ok</CButton>
            <CButton color="danger" @click="closePopup" v-else>View Errors</CButton>
        </CModalFooter>
    </CModal>
</template>

<script>
import { Icon } from '@/common/Icon';

export default {
    name: "BulkOperationPopup",
    components: {
        Icon
    },
    watch: { 
        visible: function(newVal) {
            this.show = newVal;
        }
    },
    data() {
        return ({
            show: this.visible
        });
    },
    props: {
        visible: {
            default: false,
            type: Boolean
        },
        status: {
            type: String,
            required: true,
            validator(value) {
                return ['success', 'error'].includes(value)
            }
        },
        number_of_records: {
            type: Number,
            required: true,
            default: 0,
            validator(value) {
                return value >= 0;
            }
        },
        redirect_to: {
            default: null,
            type: String
        },
    },
    methods: {
        closePopup() {
            this.show = false;
            if (this.status == 'success') {
                this.$router.push(this.redirect_to);
            } else {
                this.$emit('bulk-popup:close');
            }
        }
    }

}
</script>
<style scoped>
.modal-body svg {
    stroke-width: 1;
    margin-bottom: 15px;
}
.modal-body svg.issue {
    color: #e55353;
}
.modal-body svg.success {
    color: #33AB55;
}
.modal-body div {
    font-size: 21px;
    max-width: 340px;
    margin: 0 auto;
}
.btn.btn-secondary:hover,
.btn.btn-secondary:focus {
    color: #000;
    background-color: #c3c3c3;
}
</style>