<template>
    
    <CAccordionItem :item-key="weekNumber" class="mb-3" >
        <CAccordionHeader>
            <div>
                <span v-if="simple_bh_view==true">Simple Hours Setting</span>
                <span v-else>Week {{ weekNumber }}</span>
                <div class="copy-icon-outer ms-2" v-if="false">
                    <Icon 
                        @click.stop="!disabled ? showCopyWeekScheduleSelector(weekNumber) : null"
                        icon="tabler:copy"
                        v-c-tooltip="{
                            content: 'Copy',
                            placement: 'top',
                        }"
                        class="cursor-pointer"
                        :height="20"
                    />
                </div> 
            </div>
        </CAccordionHeader>
        <CAccordionBody>
            <Hours
                :initial-days-value="weekData"
                :show-break-hours="false"
                :allow-multiple-slots="true"
                :time-picker-config="time_picker_config"
                :invalid-days="invalidWeekData"
                :disabled="disabled"
            >
                <template #header>{{ null }}</template>
            </Hours>
        </CAccordionBody>
    </CAccordionItem>
</template>
<script>
import Hours from '@/ui_components/start-wizard/Hours.vue'

import daysMixins from '@/mixins/days';
import { Icon } from '@/common/Icon';
export default {
    name: 'WeekAccordionItem',
    mixins: [daysMixins],
    setup: () => {
        
        // const { convertTimestampToDateTime, convertTimeToFormat } = useDateTime();
        // return { convertTimestampToDateTime, convertTimeToFormat, v$: useVuelidate() };
    },
    data() {
        return {
            time_picker_config: {
                // altFormat: "F j, Y",
                altInput: true,
                noCalendar: true,
                enableTime: true,
                time_24hr: false,
                monthSelectorType: 'static',
            }
        }
    },
    components: {
        Hours,
        Icon
    },
    props: {
        weekNumber: {
            type: Number,
            required: true,
            default: 5
        },
        weekData: {
            type: Object,
            required: true
        },
        invalidWeekData: {
            type: Array || null
        },
        disabled: {
            type: Boolean,
            default: false
        },
        simple_bh_view:  {
            type: Boolean,
            default: false
        },
    },
    methods: {
        showCopyWeekScheduleSelector(week_number) {
            console.log(week_number)
        }
    }
}
</script>