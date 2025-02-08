<template>
    <div :class="!allowMultipleSlots ? 'card' : null">
        <div :class="!allowMultipleSlots ? 'card-body pt-4 px-2 px-sm-3' : null">

            <slot name="header" :addBusinessHours="addBusinessHours">
                <h6 class="mb-4">
                    Set business hours
                    <Icon
                        icon="tabler:info-circle"
                        class="theme-color cursor-pointer"
                        style="top: 0"
                        :width="24"
                        :height="24"
                        @click="
                            () => {
                                visibleBusinessHourHelpModal = true
                            }
                        "
                    />
                </h6>
            </slot>
            
            <div class="row">
                <div class="col-md-12 custom-hour-style" v-if="!allowMultipleSlots">
                    <div class="d-sm-flex form-group align-items-center height-min" v-for="(day, index) in days" :key="index">
                        <div class="form-check form-check-day pe-5">
                            <input
                                :disabled="disabled"
                                class="form-check-input"
                                type="checkbox"
                                :id="day.label"
                                :checked="!day.is_closed" 
                                @change="($event) => day.is_closed = !day.is_closed"
                            />
                            <label class="form-check-label mb-0" :for="day.label"
                                >{{ day.label }}</label
                            >
                        </div>
                        <div class="d-flex align-items-center">
                            <div
                                class="d-flex align-items-center day-hour-input"
                            >
                                <span v-if="day.is_closed" class="">Closed</span>
                                <template v-else>
                                    <flat-pickr :disabled="disabled" v-model="day.begin_hours" :config="{...time_picker_config, maxTime: day.end_hours ? convertTime12to24(day.end_hours): null}" placeholder="Start Time" />
                                    <span class="px-1 px-sm-4">-</span>
                                    <flat-pickr :disabled="disabled" v-model="day.end_hours" :config="{...time_picker_config, minTime: day.begin_hours ? convertTime12to24(day.begin_hours) : null}" placeholder="End Time" />
                                </template>
                                
                            </div>

                            <div class="ps-1 ps-sm-4">
                                <div>
                                    <Icon
                                        @click="!disabled ? clearDayHours(day) : null"
                                        v-c-tooltip="{
                                            content: 'Clear',
                                            placement: 'top',
                                        }"
                                        class="cursor-pointer"
                                        icon="tabler:eraser"
                                        :height="24"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <template v-else>
                    <div v-for="(day, dayIndex) in days" :key="dayIndex" class="col-md-12 custom-hour-style">
                        <div class="d-sm-flex form-group align-items-start height-min">
                            <div class="form-check pe-4 d-flex">
                                <input
                                    :disabled="disabled"
                                    class="form-check-input"
                                    type="checkbox"
                                    :id="day.label"
                                    :checked="!day.is_closed" 
                                    @change="($event) => day.is_closed = !day.is_closed"
                                />
                                <label class="form-check-label mb-0 ps-2" :for="day.label"
                                >{{ day.label }}</label
                                >
                               
                            </div>
                            <div class="d-flex align-items-start">
                                <div class="day-hour-input">
                                    <span v-if="day.is_closed" class="">Closed</span>
                                    <template v-else>
                                        <div v-for="(slot, slotIndex) in day.slots" :key="slotIndex"  class="d-flex mb-3 align-items-center">
                                            <div class="d-flex align-items-center" :class="isInvalidSlot(day, slotIndex) ? 'invalid-slot-container' : null">
                                                <flat-pickr :disabled="disabled" v-model="slot.begin_hours" :config="{...time_picker_config, maxTime: slot.end_hours ? convertTime12to24(slot.end_hours): null}" placeholder="Start Time" :class="isInvalidSlot(day, slotIndex) ? 'invalid-time-input' : null"/>
                                                <span class="px-1 px-sm-4">-</span>
                                                <flat-pickr :disabled="disabled" v-model="slot.end_hours" :config="{...time_picker_config, minTime: slot.begin_hours ? convertTime12to24(slot.begin_hours) : null}" placeholder="End Time" :class="isInvalidSlot(day, slotIndex) ? 'invalid-time-input' : null" />
                                            </div>
                                            <div class="d-flex">
                                                <div @click="addSlot(dayIndex)" class="ps-1 ps-sm-4">
                                                    <Icon
                                                        v-c-tooltip="{
                                                            content: 'Add New Slot',
                                                            placement: 'top',
                                                        }"
                                                        class="cursor-pointer"
                                                        icon="tabler:plus"
                                                        :height="24"
                                                    />
                                                </div>
                                                
                                                <div class="ps-1 ps-sm-4">
                                                    <div>
                                                        <Icon
                                                            @click="!disabled ? clearDayHours(slot) : null"
                                                            v-c-tooltip="{
                                                                content: 'Clear Slot Values',
                                                                placement: 'top',
                                                            }"
                                                            class="cursor-pointer"
                                                            icon="tabler:eraser"
                                                            :height="24"
                                                        />
                                                    </div>
                                                </div>
                            
                                                <div class="ps-1 ps-sm-4">
                                                    <Icon
                                                        @click="!disabled ? showCopyHoursSelector(day) : null"
                                                        icon="tabler:copy"
                                                        v-c-tooltip="{
                                                            content: 'Copy Slot',
                                                            placement: 'top',
                                                        }"
                                                        class="cursor-pointer"
                                                        :height="24"/>
                                                </div>
                                                <div v-if="day.slots.length > 1 && slotIndex > 0" >
                                                    <div @click="removeSlot(dayIndex, slotIndex)" class="ps-1 ps-sm-4">
                                                        <Icon
                                                            class="cursor-pointer"
                                                            icon="tabler:trash"
                                                            v-c-tooltip="{
                                                            content: 'Remove Slot',
                                                            placement: 'top',
                                                            }"
                                                            :height="24"
                                                        />
                                                    </div>
                                                </div>
                                            </div> 
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <div class="row" v-if="showBreakHours">
                <div class="col-md-12 custom-hour-style">
                    <h6>Break hours</h6>
                    <div class="d-sm-flex form-group align-items-center height-min">
                        <div class="form-check form-check-day ps-0 pe-5">
                            <p class="mb-sm-0 mb-2 break-hours-label">
                                Business break hours
                            </p>
                        </div>
                        <div class="d-flex align-items-center">
                            <div class="d-flex align-items-center day-hour-input">
                                <flat-pickr  :disabled="disabled" v-model="break_begin_hours" :config="{...time_picker_config, maxTime: break_end_hours ? convertTime12to24(break_end_hours) : null}" placeholder="Break Start Time" />
                                <span class="px-1 px-sm-4">-</span>
                                <flat-pickr :disabled="disabled" v-model="break_end_hours" :config="{...time_picker_config, minTime: break_begin_hours ? convertTime12to24(break_begin_hours) : null}" placeholder="Break End Time" />
                            </div>
                            
                            <div class="ps-1 ps-sm-4">
                                <div class="copy-icon-outer">
                                    <Icon
                                        @click="!disabled ? clearBreakHours() : null"
                                        v-c-tooltip="{
                                            content: 'Clear',
                                            placement: 'top',
                                        }"
                                        class="cursor-pointer"
                                        icon="tabler:eraser"
                                        :height="24"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <slot name="footer" :addBusinessHours="addBusinessHours"></slot>
            
        </div>

        <InfoHelperModal 
            :visible="visibleBusinessHourHelpModal"
            title="Help Service Category"
            :body-lines='["Set your business hours of operation.", "In the first line, set regular hours for ex: Mon - Fri.", "In next line, set for weekend or other days for ex: Sat - Sun.", "Is Closed means business is closed for the entire day.", "If you need finer control on different days, it can be done in app/website."]'
            @modal:close="visibleBusinessHourHelpModal = false"
        />
        <CopyHoursModal 
            :visible="from_day_num > 0"
            :from-day-num="from_day_num"
            @copyHoursToDays="onCopyHoursToDays"
            @close="from_day_num = 0"
        />
    </div>
</template>
<script>
import { Icon } from '@/common/Icon';
import InfoHelperModal from '@/common/InfoHelperModal.vue';
import CopyHoursModal from '@/ui_components/start-wizard/CopyHoursModal.vue';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment-timezone';
import daysMixins from '@/mixins/days';

export default {
    name: 'SetupHours',
    emits: ['businessHoursInfoSubmitted'],
    mixins: [daysMixins],
    components: {
        Icon,
        InfoHelperModal,
        flatPickr,
        CopyHoursModal
    },
    props: {
        initialDaysValue: {
            type: Object,
            required: false,
            default: []
        },
        breakBeginHours: {
            required: false,
            default: null
        },
        breakEndHours: {
            required: false,
            default: null
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },
        timePickerConfig: {
            type: Object,
            required: false,
            default: {
                altInput: true,
                altFormat: "G:i K",
                dateFormat: "G:i K",
                noCalendar: true,
                enableTime: true,
                monthSelectorType: "static"
            }
        },
        showBreakHours: {
            type: Boolean,
            default: true
        },
        allowMultipleSlots: {
            type: Boolean,
            default: false
        },
        invalidDays: {
            type: Array || null
        }
    },
    watch: {
        breakBeginHours(val) {
            if (val) {
                this.break_begin_hours = val;
                // this.break_begin_hours = this.convertTimestampToDateTime(val, 'HH:mm', this.timezone);
            }
        },
        breakEndHours(val) {
            if (val) {
                this.break_end_hours = val;
                // this.break_end_hours = this.convertTimestampToDateTime(val, 'HH:mm', this.timezone);
            }
        }
    },
    created() {
        
        if (this.initialDaysValue && this.initialDaysValue.length > 0) {
            this.days = [...this.initialDaysValue];
        }
    },
    data() {
        return {
            time_picker_config: this.timePickerConfig,
            visibleBusinessHourHelpModal: false,
            break_begin_hours: this.breakBeginHours,
            break_end_hours: this.breakEndHours,
            from_day_num: 0
        }
    },
    methods: {
        isInvalidSlot(day, slotIndex) {
            if (this.invalidDays && this.invalidDays.length > 0) {
                let invalidDay = this.invalidDays.find(d => d.day_num == day.day_num)
                if ((invalidDay?.overlapped_slots_index || []).length > 0) {
                    return invalidDay.overlapped_slots_index.includes(slotIndex);
                }
                if (invalidDay && invalidDay.hasOwnProperty('slots_valid')) {
                    return !invalidDay.slots_valid;
                }
            }
        },
        convertTime12to24(time12h) {
            if (this.time_picker_config.dateFormat == 'G:i K') {
                return moment(time12h, 'hh:mm A').format('HH:mm');
            }
            return time12h;
        },
        showCopyHoursSelector(day) {
            this.from_day_num = 0; 
            this.from_day_num = day.day_num
        },

        clearBreakHours() {
            this.break_begin_hours = null;
            this.break_end_hours = null;
        },

        clearDayHours(day) {
            day.begin_hours = null;
            day.end_hours = null;
        },
        
        onCopyHoursToDays(daysNum) {
            if (daysNum) {
                this.copyDayHoursToDays(this.from_day_num, daysNum);
            }
            this.from_day_num = 0;
        },

        copyDayHoursToDays(from_day, dest_days) {
            let that = this;
            let fromDay = that.days.find(d => d.day_num == from_day);

            that.days.forEach(d => {
                if (dest_days.includes(d.day_num)) {
                    if (that.allowMultipleSlots) {
                        d.slots = fromDay.slots.map(s => ({begin_hours: s.begin_hours, end_hours: s.end_hours}));
                    } else {
                        d.begin_hours = fromDay.begin_hours;
                        d.end_hours = fromDay.end_hours;
                    }
                    d.is_closed = fromDay.is_closed;
                }
            });
        },

        addBusinessHours(e) {
            e.preventDefault();
            let that = this;

            let data = that.days.map(d => {
                if (d.begin_hours && d.end_hours) {
                    d.break_begin_hours = that.break_begin_hours;
                    d.break_end_hours = that.break_end_hours;
                }
                return d;
            });
            
            that.$emit('businessHoursInfoSubmitted', data);
        },

        addSlot(dayIndex) {
            this.days[dayIndex].slots.push({ begin_hours: '', end_hours: '' });
        },
        removeSlot(dayIndex, slotIndex) {
            if (this.days[dayIndex].slots.length > 1) {
                this.days[dayIndex].slots.splice(slotIndex, 1);
            }
        }
    },
    mounted() {
        // Add the class to the body when the component is mounted
        document.body.classList.add('hours-component');
    },
    beforeUnmount() {
        // Remove the class from the body when the component is unmounted
        document.body.classList.remove('hours-component');
    }
}
</script>
<style lang="scss">
.height-min {
    min-height: 44px;
}
h6 {
    color: var(--text-primary-color);
}
.invalid-time-input {
    border-color: red !important;
}
.invalid-slot-container {
    input {
        border-color: red !important;
    }
}
.height-min {
    min-height: 44px;
}
.custom-hour-style {
    .icon {
      rect {
        stroke-width: 1.2 !important;
      }
    }
    .card {
      background: transparent;
      border: 0;
    }
    
  
    .input-small {
      max-width: 150px;
    }
    .form-field-height {
      min-height: 280px;
    }
    .form-check-label {
      color: var(--text-primary-color);
      min-width: 92px;
    }
    div.form-check {
      padding-left: 2rem;
      .form-check-input {
        margin-left: -2.2em;
        //border: 1px solid #C9C9C9;
      }
    }
    .control-label {
      b {
        font-weight: 500;
      }
    }
    .btn {
      min-width: 150px;
      min-height:44px;
      font-size: 16px;
      &.btn-light {
        color: #000;
        text-transform: capitalize;
      }
    }
    .day-hour-input {
      input.form-control {
        width: 93px;
        background: transparent;
        border: 1px solid #C9C9C9;
      }
    }
    .copy-icon-outer {
      background-color: rgba($color: #D9D9D9, $alpha: .2);
      padding: 3px;
      border-radius: 3px;
      display: inline-block;
    }
    .form-check-day {
      min-width: 180px;
    }
    .break-hours-label {
      max-width: 400px;
      width: 100%;
    }
  }
.hours-component {
    .flatpickr-calendar.animate.open {
        max-width: 140px;
    }
    .flatpickr-time {
        .numInputWrapper {
            width: 33%;
        }
        .flatpickr-am-pm {
            width: 33%;
        }
        input.flatpickr-hour,
        input.flatpickr-minute,
        input.flatpickr-second {
            padding-right: 8px;
        }
    }
}
  
  @media only screen and (max-width: 400px) {
    .custom-hour-style {
        .day-hour-input input.form-control {
            font-size: 12px;
            width: 66px;
            padding: 5px;
            min-height: 38px;
        }
        svg {
            width: 20px !important;
        }
    }
  }
  
</style>