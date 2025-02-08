<template>
    <div>
        <Alerts 
            :alertData="alertData" 
            :show="show"
            @alertClosed="show = 0"
            v-if="show_alert" 
        />
        <h4 class="h5 mb-4">
            {{ title }} 
            <Icon
                icon="tabler:info-circle"
                class="theme-color cursor-pointer"
                style="top: 0"
                :width="24"
                :height="24"
                @click="() => { visibleAdvanceBusinessHourHelpModal = true }"
            />
        </h4>
        <div class="row">
            <div class="col-md-6 col-lg-4">
                <h6>Timezone</h6>
                <div class="timezone-select-outer mb-4">
                    <MbscSelect
                        v-model="business_timezone"
                        :touchUi="false"
                        :defaultSelection="business_timezone"
                        :data="timezones"
                        :buttons="[]"
                        :filter="true"
                        display="anchored"
                        labelStyle="stacked"
                        inputStyle="box"
                        placeholder="Please select..."
                    >
                        <template #item="item">
                            
                            <div class="md-item-template md-item-template-custom">
                                <div v-if="item.isGroup" class="md-group-item-title">
                                    {{item.display}}
                                </div>
                                <template v-else>
                                    <div class="md-item-template-title">
                                    <span>{{ item.data.text }}</span>
                                    </div>
                                    <div class="md-item-template-time">{{ item.data.time }}</div>
                                </template>
                            </div>
                        </template>
                    </MbscSelect>
                </div>
            </div>
        </div>
        <div class="row" v-if="is_business_user == false">
            <div class="col-md-8">
                <input
                    type="checkbox" class="form-check-input"
                    v-model="keep_my_hours_same_as_business_hours"
                />&nbsp;
                <label class="control-label mb-0">
                    <b>Keep {{ user_fullname }}'s schedule hours same as business hours</b>
                </label>
                
            </div>
            <br />
            <br />
        </div>
        <div class="row">
            <div class="col-lg-8 col-md-10">
                <CAccordion v-if="simple_bh_view==false" >
                    <WeekAccordionItem 
                            v-for="(weekData, index) in advanced_business_hours.week_day_hours" 
                            :simple_bh_view="simple_bh_view"
                            :week-data="weekData" 
                            :key="index" 
                            :week-number="index + 1" 
                            :invalid-week-data="invalid_slots_data[index] || null" 
                            :class="invalid_slots_data[index] && invalid_slots_data[index].length > 0 ? `invalid-week` : null" 
                            :disabled="keep_my_hours_same_as_business_hours"></WeekAccordionItem>
                </CAccordion>
                <CAccordion v-if="simple_bh_view==true && advanced_business_hours" :active-item-key="1">
                    <WeekAccordionItem 
                            :simple_bh_view="simple_bh_view"
                            :week-data="(!advanced_business_hours || !advanced_business_hours.week_day_hours)?[]:advanced_business_hours.week_day_hours[simple_bhview_store_index]" 
                            :key="weekkey" 
                            :week-number="simple_bhview_store_index + 1" 
                            :invalid-week-data="invalid_slots_data[simple_bhview_store_index] || null" 
                            :class="invalid_slots_data[simple_bhview_store_index] && invalid_slots_data[simple_bhview_store_index].length > 0 ? `invalid-week` : null" 
                            :disabled="keep_my_hours_same_as_business_hours"></WeekAccordionItem>
                </CAccordion>

                <div class="row">
                    <div class="col-md-4 mr-auto d-flex justify-content-md-start flex-wrap gap-1 max-w-custom">
                    <button
                            :disabled="v$.$invalid"
                            class="btn btn-info"
                            @click="switchView"
                        >
                            Switch to {{simple_bh_view?"Advanced":"Simple"}} view
                        </button>
                    </div>
                    <div class="col-md-8 mr-auto d-flex justify-content-md-end flex-wrap gap-1 max-w-custom">
                        <button class="btn btn-secondary" @click="goBack">
                            Cancel
                        </button>
                        &nbsp;
                        <button
                            class="btn btn-success"
                            @click="addUpdateAdvancedBusinessHours"
                        >
                            Update
                        </button>
                        
                    </div>
                </div>
            </div> 
        </div>
        <InfoHelperModal 
            :visible="visibleAdvanceBusinessHourHelpModal"
            title="Help Advanced Business Hour"
            :body-lines='["Set your advanced business hours of operation.", "In the first line, set regular hours for ex: Mon - Fri.", "In next line, set for weekend or other days for ex: Sat - Sun.", "Is Closed means business is closed for the entire day.", "If you need finer control on different days, it can be done in app/website."]'
            @modal:close="visibleAdvanceBusinessHourHelpModal = false"
        />
    </div>
</template>
<script>
import '@mobiscroll/vue/dist/css/mobiscroll.vue.min.css'
import { MbscSelect, setOptions } from '@mobiscroll/vue'
setOptions({
  theme: 'ios',
  themeVariant: 'light'
})

import WeekAccordionItem from '@/ui_components/advanced_business_hours/WeekAccordionItem.vue';
import { Icon } from '@/common/Icon';
import InfoHelperModal from '@/common/InfoHelperModal.vue';
import {required} from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import moment from 'moment-timezone'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import appHelper from '@/helpers/app_helper'
import { isWeekHoursDataValid, attachIsOverlapProperty, attachInvalidHoursProperty, attachInvalidSlotsIndex, getInvalidSlotsData } from '@/helpers/advanced_business_hours_helper'

import utils_lib from '@/helpers/utils_lib'
import daysMixins from '@/mixins/days'
import country_json from "../../../../countries";
import useDateTime from '@/composables/useDateTime';
import { cloneDeep } from 'lodash'
import Alerts from '@/views/Alerts'

export default {
    name: 'AdvancedBusinessHours',
    mixins: [daysMixins],
    setup: () => {
        const { convertTimestampToDateTime, convertTimeToFormat } = useDateTime();
        return { convertTimestampToDateTime, convertTimeToFormat, v$: useVuelidate() };
    },
    components: {
        flatPickr,
        Icon,
        InfoHelperModal,
        WeekAccordionItem,
        MbscSelect,
        Alerts
    },
    data() {
        return {
            title: 'Manage Business Hours Update',
            visibleAdvanceBusinessHourHelpModal: false,
            timer: null,
            time_notation: "12h",
            no_of_weeks: 5,
            week_day_hours: [],
            advanced_business_hours: {},
            business_timezone: this.$store.state.business_settings.business_info.used_time_zone || 'America/Los_Angeles',
            timezones: country_json.map(d => (d.timezones.map(o => ({ text: o, group: d.name, value: o })))).flat(),
            time_picker_config: {
                // altFormat: "F j, Y",
                altInput: true,
                noCalendar: true,
                enableTime: true,
                time_24hr: false,
                monthSelectorType: 'static',
            },
            days: [
                {
                    display: 'Sun',
                    label: 'Sunday',
                    day_num: 1,
                    begin_hours: '',
                    end_hours: '',
                    by_appointment_only: false,
                    is_closed: false,
                    break_begin_hours: '',
                    break_end_hours: '',
                    slots: []
                },
                {
                    display: 'Mon',
                    label: 'Monday',
                    day_num: 2,
                    begin_hours: '',
                    end_hours: '',
                    by_appointment_only: false,
                    is_closed: false,
                    break_begin_hours: '',
                    break_end_hours: '',
                    slots: []
                },
                {
                    display: 'Tue',
                    label: 'Tuesday',
                    day_num: 3,
                    begin_hours: '',
                    end_hours: '',
                    by_appointment_only: false,
                    is_closed: false,
                    break_begin_hours: '',
                    break_end_hours: '',
                    slots: []
                },
                {
                    display: 'Wed',
                    label: 'Wednesday',
                    day_num: 4,
                    begin_hours: '',
                    end_hours: '',
                    by_appointment_only: false,
                    is_closed: false,
                    break_begin_hours: '',
                    break_end_hours: '',
                    slots: []
                },
                {
                    display: 'Thu',
                    label: 'Thursday',
                    day_num: 5,
                    begin_hours: '',
                    end_hours: '',
                    by_appointment_only: false,
                    is_closed: false,
                    break_begin_hours: '',
                    break_end_hours: '',
                    slots: []
                },
                {
                    display: 'Fri',
                    label: 'Friday',
                    day_num: 6,
                    begin_hours: '',
                    end_hours: '',
                    by_appointment_only: false,
                    is_closed: false,
                    break_begin_hours: '',
                    break_end_hours: '',
                    slots: []
                },
                {
                    display: 'Sat',
                    label: 'Saturday',
                    day_num: 7,
                    begin_hours: '',
                    end_hours: '',
                    by_appointment_only: false,
                    is_closed: false,
                    break_begin_hours: '',
                    break_end_hours: '',
                    slots: []
                },
            ],
            keep_my_hours_same_as_business_hours: false,
            invalid_slots_data: [],
            show_alert: false,
            show: 0,
            alertData: {message: '', type: ''},
            user_id: null,
            user_fullname: null,
            simple_bh_view: true,
            weekkey: 0,
            simple_bhview_store_index: 0
        }
    },
    validations() {
        return {
            user_id: { required }
        }
    },
    computed: {
        timeFormat() {
            return this.time_notation == '12h' ? 'hh:mma' : 'HH:mm'; 
        }
    },
    created() {
        this.updateTimes();
        // Update times every second
        this.timer = setInterval(this.updateTimes, 1000);

        if (this.$route.params.user_id &&
            this.$route.params.user_id.length > 2) 
        {
            this.user_id = this.$route.params.user_id
            this.is_business_user = false
            this.$schedsdk
                .get_user_detail({service_provider_id: this.user_id})
                .then((result) => {
                     this.processUserDataResult(result)
                })
            
        } 
        else 
        {
            // Get for business user
            this.is_business_user = true
            this.$schedsdk
                .get_business_user_id({
                    create_if_needed: 1,
                    return_full_data: true,
                })
                .then((result) => {
                    this.processUserDataResult(result)
                })
            
        }
    },
    methods: {
        goBack(){
           this.$router.go(-1)
        }, 
        scrollToTop() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        },
        updateTimes() {
            this.timezones.map(t => {
                t.time = this.convertTimeToFormat(t.value, this.timeFormat);
                t.combined = `${t.text} (${t.time})`;
                return t;
            })
        },
        switchView(type=null)
        {
            if (!type)
            {
                if (type =='s')
                {
                    this.simple_bh_view = true                
                }
                else
                {
                    this.simple_bh_view = false
                }
            }
            else
            {
                //toggle based on typoe
                this.simple_bh_view = !this.simple_bh_view
            }
        
            this.weekkey++
        },

        fillAdvancedBusinessHours(advanced_business_hours) {
            advanced_business_hours.week_day_hours = advanced_business_hours.week_day_hours.map((week_data) => {
                week_data.map((day_obj) => {
                    let {display, label} = appHelper.getDayLabel(
                            day_obj.day_num,
                        )
                    day_obj.display = display;
                    day_obj.label = label;
                    day_obj.slots = !day_obj.slots ? [{ begin_hours: '', end_hours: '' }] : day_obj.slots.map((slot) => {
                        if (slot.begin_hours != 0) {
                            slot.begin_hours = this.convertTimestampToDateTime(slot.begin_hours, 'HH:mm', this.business_timezone)
                        } else {
                            slot.begin_hours = null
                        }

                        if (slot.end_hours != 0) {
                            slot.end_hours = this.convertTimestampToDateTime(slot.end_hours, 'HH:mm', this.business_timezone)
                        } else {
                            slot.end_hours = null
                        }
                        return slot;
                    });
                    return day_obj;
                })
                return week_data;
            });
        },
        processUserDataResult(result)
        {
            this.weekkey++;
            if (result.status == 1) 
            {
                // console.log(result.data)
                // console.log(this.$store.state.user_data._id)
                if (!this.user_id)
                {
                    this.user_id = result.data.user_id;
                }
                
                this.user_fullname = result.data.first_name + ' ' + result.data.last_name;
                if (!this.is_business_user)
                {
                    this.title = 'Edit Work Schedule for ' + this.user_fullname;
                    this.advanced_business_hours = result.data.advanced_business_hours;
                } else {
                    this.advanced_business_hours = result.full_obj.advanced_business_hours;
                    this.user_id = result.full_obj._id;
                }
                
                if (this.advanced_business_hours) 
                {
                    this.keep_my_hours_same_as_business_hours = this.advanced_business_hours.use_same_as_businesss_abs_hours;
                    if ( this.advanced_business_hours.user_pref_bh_display_view == 2)
                    {
                        this.simple_bh_view = false
                    }
                    if (this.advanced_business_hours.week_day_hours.length) {
                        this.fillAdvancedBusinessHours(this.advanced_business_hours)
                    }
                }
            }
        },
        
        addUpdateAdvancedBusinessHours() {
            this.v$.$touch();
            let data = {
                user_id: [],
                use_advanced_business_hours: true,
                advanced_business_hours: [],
            }
            let timezone = this.business_timezone || this.$store.state.business_settings.business_time_zone;

            let start_of_the_day = moment(Date.now()).startOf('day');
            let week_day_hours = cloneDeep(this.advanced_business_hours.week_day_hours);

            week_day_hours = week_day_hours.map(week_data => (
                week_data.map((day) => {
                    delete day.display;
                    delete day.label;
                    day.slots = day.is_closed ? null : day.slots.map(({begin_hours, end_hours}) => {
                        if (begin_hours && end_hours && begin_hours != "" && end_hours != "") {
                            return {
                                begin_hours: moment.tz(start_of_the_day.format('YYYY-MM-DD') + ' ' + begin_hours, timezone).valueOf(),
                                end_hours: moment.tz(start_of_the_day.format('YYYY-MM-DD') + ' ' + end_hours, timezone).valueOf()
                            }
                        }
                    }).filter(Boolean);
                    return day;
                })
            ));
            
            //When its simple view the week 0 is cloned to other weeks
            if (this.simple_bh_view == true)
            {
                let max_weeks = 5; //There only be max 5 weeks in a month
                let ref_week = week_day_hours[0];
                let new_week_day_hours = [];
                for(let i=0; i<max_weeks; i++)
                {
                    new_week_day_hours.push(structuredClone(ref_week));
                }
                week_day_hours = new_week_day_hours;
            }

            attachInvalidHoursProperty(week_day_hours);
            attachIsOverlapProperty(week_day_hours);
            attachInvalidSlotsIndex(week_day_hours);
            //console.log(week_day_hours,"a=sdas=d=asd")
            // check if there are invalid slots. 
            let slotsAreValid = isWeekHoursDataValid(week_day_hours);
            if (!slotsAreValid) {
                this.invalid_slots_data = getInvalidSlotsData(week_day_hours);
                this.show_alert = true;
                this.show = 1;
                this.alertData = {
                    message: "Verify Failed: There are invalid slots.",
                    type: 'danger'
                }
                this.scrollToTop();
                return false;
            }
            
            let abs_hours = {
                week_day_hours: week_day_hours, 
                is_valid: true
            }
            if (this.is_business_user == false) {
                abs_hours.use_same_as_businesss_abs_hours = this.keep_my_hours_same_as_business_hours
            }

            abs_hours.source_sbh_day_hours = this.advanced_business_hours.source_sbh_day_hours;

            let req = {
                user_id: [this.user_id],
                advanced_business_hours: abs_hours,
                use_advanced_business_hours: true,
                timezone: this.business_timezone
            }
            if (this.simple_bh_view == true)
            {
                //
                req.clone_week_0_to_all = true;
                req.advanced_business_hours.user_pref_bh_display_view = 1
            }
            else
            {
                req.advanced_business_hours.user_pref_bh_display_view = 2
            }
            
            
            if (!this.v$.$invalid || this.keep_my_hours_same_as_business_hours) 
            {
                this.alert = false
                this.$schedsdk
                    .addAdvancedBusinesshours(req)
                    .then((result) => {
                        if (result.status == 1) {
                            if (this.is_business_user) {
                                this.$router.push('/settings')
                            } else {
                                this.$router.push(
                                    '/users/detail/' + this.user_id,
                                )
                            }
                        } else {
                            this.alertData = {
                                message: result.message,
                                type: 'danger',
                            }
                            this.alert = true
                            this.show = 4
                        }
                    })
                    .catch((ex) => {
                        this.alertData = {
                            message: ex.data.message,
                            type: 'danger',
                        }
                        this.alert = true
                        this.show = 4
                    })
            }
        },
        alertClosedFn() {
            this.show = 0
        },
    },
    unmounted() {
        clearInterval(this.timer)
    },
}
</script>
<style lang="scss">
    .invalid {
        border: 1px solid red;
        /* background-color: lightcoral; */
        color: red;
    }
    .error-msg {
        color: red;
    }
    .md-item-template-time {
    font-size: 14px;
    opacity: 0.8;
    }
    .timezone-select-outer .mbsc-ios.mbsc-textfield-wrapper-box {
        margin: 0;
    }
    .timezone-select-outer .mbsc-textfield {
        background: #ededed;
        height: 34px;
        font-size: 14px;
        position: relative;
        line-height: 2.6;
    }
    .timezone-select-outer .mbsc-ios.mbsc-select-icon {
        top: 7px;
        width: 18px;
    }
    .md-item-template-custom .md-group-item-title {
        padding-left: 15px;
        font-size: 16px;
    }
    .md-item-template.md-item-template-custom {
        display: flex;
        justify-content: space-between;
    }
    .copy-icon-outer {
        background-color: rgba($color: #D9D9D9, $alpha: .2);
        padding: 1px;
        border-radius: 3px;
        display: inline-block;
    }
    div.accordion-item {
        border-radius: 3px;
        &.invalid-week {
            border-color: red !important;
            overflow: hidden;
            .accordion-button {
                background-color: rgba(255, 0, 0, 0.075);
                color: red;
                &:not(.collapsed) {
                    color: red;
                    box-shadow: 0 0px 0.25rem rgb(219 31 31 / 22%)
                }
                &:focus {
                    box-shadow: 0 0px 0.25rem rgb(219 31 31 / 22%)
                }
            }
        }
        &:not(:first-of-type) {
            border: 1px solid var(--cui-accordion-border-color);
        }
    }
    .accordion-button, .accordion-button.collapsed  {
        color: var(--text-primary-color);   
    }
    .accordion-collapse {
        .accordion-body {
            background-color: var(--background-color-primary);
            border-radius: 0 0 3px 3px;
        }
    }
    .dark-theme {
        .accordion-button {
            background-color: var(--background-color-primary);
            color: var(--text-primary-color);
            &:after {
                background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>")
            }
            &.collapsed {
                border-radius: 5px;
                color  : #fff; 
                &:after {
                    background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'><path fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/></svg>")
                }
            }
            &:focus {
                box-shadow: none;
            }
        }
    }
    .dark-theme {
        .accordion-item.invalid-week {
            background-color: transparent;
            .accordion-button {
                background-color: rgb(255 0 0 / 25%);
                &.collapsed {
                    color: red;
                }
            }
        }
    }
    .dark-theme {
        .day-hour-input {
            .invalid-slot-container {
                input.form-control {
                    background-color: rgb(255 0 0 / 25%);
                }
            }
        }
    }
    .day-hour-input {
        input.form-control {
            width: 93px;
            background: transparent;
            border: 1px solid #C9C9C9;
        }
        .invalid-slot-container {
            input.form-control {
                border-color: red;
                background-color: rgba(255, 0, 0, 0.075);
            }
        }
    }
    .max-w-custom {
        max-width: 610px;
    }
</style>