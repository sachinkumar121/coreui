<template>
    <EventEditorCore 
       :event_record="{data: {}}"
       :close-text="'Cancel'"
       @modal:close="$router.go(-1)"
    />
</template>

<script>
import EventEditorCore from '@/ui_components/booking/EventEditorCore.vue'
export default {
    name: "Add Booking",
    components: {
        EventEditorCore
    }
}
</script>