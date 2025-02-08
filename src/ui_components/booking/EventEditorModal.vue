<template>
    <CModal
        size="lg"
        :visible="show"
        @close="close"
        backdrop="static"
        class="modal-dark"
    >
        <CModalHeader :close-button="true">
            <CModalTitle
                >{{ eventName }}
                <CSpinner
                    aria-hidden="true"
                    v-if="show_spinner"
                    component="span"
                    size="sm"
                ></CSpinner
            ></CModalTitle>
        </CModalHeader>
        <CModalBody>
            <EventEditorCore 
                :event_record="eventRecord"
                @stop-spinner="show_spinner = false"
                @modal:close="close"
                @booking-created-or-updated = "$emit('refreshData')"
            />
        </CModalBody>
        <!-- <bookingChangeAssignedResource
            :key="chass_key"
            @modelValueUpdate="bookingResourceChangeDone"
            v-if="show_change_assigned_resource"
            :assigned_resource_ids="res_assigned_resource_ids"
            :booking_id="eventRecord.data._id"
            :booking_service_order_id="eventRecord.data.service_order_id"
        ></bookingChangeAssignedResource> -->
    </CModal>
</template>
<script>
import EventEditorCore from '@/ui_components/booking/EventEditorCore.vue'

export default {
    name: 'EventEditorModal',
    emits: ['close', 'refreshData'],
    components: {
        EventEditorCore
    },
    props: {
        eventRecord: {
            type: Object,
            default: {data: {}}
        },
        resourceId: {
            type: [String, Number],
            required: false
        }
    },
    computed: {
        eventName() {
            return this.eventRecord.data?.service_order_id ? 'EditCX Booking ' + this.eventRecord.data.service_order_id : 'Add Booking';
        }
    },
    data() {
        return {
            show: this.visible,
            show_spinner: true
        }
    },
    methods: {
        close() {
            this.show = false;
            this.$emit('close');
        },
    }
}
</script>