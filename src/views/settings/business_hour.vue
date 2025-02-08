<template>
    <div>
        <Alerts
            :alertData="alertData"
            :show="show"
            @alertClosed="alertClosedFn"
            v-if="alert"
        />
        <h4 class="h5 mb-4">{{ title }}</h4>
        <div class="row">
            <div class="col-md-6 col-lg-4">
                <h6>Timezone</h6>
                <!-- <div class="d-flex align-items-center gap-3">
                    <label class="d-flex align-items-center gap-2">
                        <input name="time_notation" type="radio" value="12h" v-model="time_notation">
                        <span>am/pm</span>
                    </label>
                    <label class="d-flex align-items-center gap-2">
                        <input name="time_notation" type="radio" value="24h" v-model="time_notation">
                        <span>24h</span>
                    </label>
                </div> -->
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
                    <b
                        >Keep {{ user_fullname }}'s schedule hours same as
                        business hours</b
                    >
                </label>
                
            </div>
            <br />
            <br />
        </div>

        <Hours
            @businessHoursInfoSubmitted="onBusinessHoursInfoSubmitted"
            :initial-days-value="days"
            :break-begin-hours="break_start"
            :break-end-hours="break_end"
            :disabled="keep_my_hours_same_as_business_hours"
            :time-picker-config="time_picker_config"
        >
            <template #header>{{ null }}</template>
            <template v-slot:footer="{addBusinessHours}">
                <div class="row">
                    <div class="col-md-10 mr-auto d-flex justify-content-md-end flex-wrap gap-1 max-w-custom">
                        <button
                            class="btn btn-info"
                            @click.prevent="
                                $router.push(
                                    '/users/scheduled_time_off/' + user_id,
                                )
                            "
                        >
                            Manage Time Off
                        </button>
                        &nbsp;
                        <button
                            :disabled="v$.$invalid"
                            class="btn btn-success"
                            @click="manageOrSwitchAdvancedBusinessHours"
                        >
                            Switch to Advanced Business Hours
                        </button>
                        &nbsp;
                        <button
                            class="btn btn-success"
                            @click="addBusinessHours"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </template>
        </Hours>
        <div class="row">
            <div class="col-md-8">
                 
                <label class="control-label mb-0">
                    <b>Advanced valid </b> <b>{{ advanced_bh_valid}}</b><br>
                    <b>Simple valid </b> <b>{{simple_bh_valid}}</b>
                </label>
                
            </div>
            <br />
            <br />
        </div>

    </div>
</template>
<script>
import '@mobiscroll/vue/dist/css/mobiscroll.vue.min.css'
import { MbscSelect, setOptions } from '@mobiscroll/vue'
setOptions({
  theme: 'ios',
  themeVariant: 'light'
})
import {required} from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import moment from 'moment-timezone'
import Alerts from '../Alerts'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import Hours from '@/ui_components/start-wizard/Hours.vue'
import appHelper from '@/helpers/app_helper'
import utils_lib from '@/helpers/utils_lib'
import daysMixins from '@/mixins/days'
import country_json from "../../../countries";
import useDateTime from '@/composables/useDateTime';

export default {
    name: 'BusinessHours',
    mixins: [daysMixins],
    setup: () => {
        const { convertTimestampToDateTime, convertTimeToFormat } = useDateTime();
        return { convertTimestampToDateTime, convertTimeToFormat, v$: useVuelidate() };
    },
    components: {
        Alerts,
        flatPickr,
        Hours,
        MbscSelect
    },
    data() {
        return {
            timer: null,
            time_notation: "12h",
            business_hours: [],
            business_timezone: this.$store.state.business_settings.business_info.used_time_zone || 'America/Los_Angeles',
            timezones: country_json.map(d => (d.timezones.map(o => ({ text: o, group: d.name, value: o })))).flat(),
            title: 'Business Hours Update',
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
                },
            ],
            alert: false,
            show: 0,
            alertData: {
                message: '',
                type: '',
            },
            time_picker_config: {
                // altFormat: "F j, Y",
                altInput: true,
                noCalendar: true,
                enableTime: true,
                time_24hr: false,
                monthSelectorType: 'static',
            },
            user_id: '',
            break_start: '',
            break_end: '',
            keep_my_hours_same_as_business_hours: false,
            is_business_user: true,
            user_fullname: '',
            advanced_business_hours: null,

            advanced_bh_valid: false,
            simple_bh_valid: false,
        }
    },
    validations() {
        return {
            user_id: { required }
        }
    },
    watch: {
        time_notation() {
            this.updateTimes();
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
        let params = {}
        if (this.$route.params.user_id &&
            this.$route.params.user_id.length > 2) 
        {
            this.user_id = this.$route.params.user_id
            this.is_business_user = false
            params = {service_provider_id: this.user_id}
            this.$schedsdk
                .get_user_detail(params)
                .then((result) => {
                    this.processUserDataResult(result)
                })

        } 
        else 
        {
            //Get for business user
            this.$schedsdk
                .get_business_user_id({
                    create_if_needed: 1,
                    return_full_data: true,
                })
                .then((result) => {
                    this.processUserDataResult(result)
                })
            this.is_business_user = true
        } //end else
    },
    methods: {
        async manageOrSwitchAdvancedBusinessHours() 
        {
            let advbh_setting_uri = this.$route.params.user_id &&
            this.$route.params.user_id.length > 2 ? `/settings/manage_business_hours_v2/user/${this.$route.params.user_id}` : `/settings/manage_business_hours_v2`;

            if (this.advanced_business_hours.is_valid) 
            {
                this.$router.push(advbh_setting_uri)
            } 
            else 
            {
                try 
                {
                    let result = await this.$schedsdk.convertSimpleBHToAdvancedBH({
                        user_id: this.user_id
                    });
                    if (!result.status) {
                        this.alertData = {
                            message: result.message,
                            type: 'danger',
                        }
                        this.alert = true
                        this.show = 4;
                    } else {
                        this.$router.push(advbh_setting_uri);
                    }
                } catch (error) {
                    this.alertData = {
                        message: error.message,
                        type: 'danger',
                    }
                    this.alert = true
                    this.show = 4
                }
            }
        },
        updateTimes() {
            this.timezones.map(t => {
                t.time = this.convertTimeToFormat(t.value, this.timeFormat);
                t.combined = `${t.text} (${t.time})`;
                return t;
            })
        },
        setupHoursProp(businessHours) {
            let that = this
            this.business_hours = businessHours
            this.business_hours.map((d, i) => {
                if (i == 0) {
                    that.break_start = d.break_begin_hours
                        ? utils_lib.getFormattedDate(
                              d.break_begin_hours,
                              'hh:mm A',
                          )
                        : null
                    that.break_end = d.break_end_hours
                        ? utils_lib.getFormattedDate(
                              d.break_end_hours,
                              'hh:mm A',
                          )
                        : null
                }
                let {display, label} = appHelper.getDayLabel(d.day_num)
                d.display = display
                d.label = label

                d.begin_hours = d.begin_hours
                    ? utils_lib.getFormattedDate(d.begin_hours, 'hh:mm A')
                    : null
                d.end_hours = d.end_hours
                    ? utils_lib.getFormattedDate(d.end_hours, 'hh:mm A')
                    : null

                d.break_begin_hours = d.break_begin_hours
                    ? utils_lib.getFormattedDate(d.break_begin_hours, 'hh:mm A')
                    : null
                d.break_end_hours = d.break_begin_hours
                    ? utils_lib.getFormattedDate(d.break_end_hours, 'hh:mm A')
                    : null
                return d
            })
        },
        onBusinessHoursInfoSubmitted(hoursData) {
            this.days = hoursData
            this.UpdateBusinessHours()
        },
        fillSimpleBusinessHours(simple_business_hours) {
            let user_day_hours = simple_business_hours.day_hours
            let breakk_hours_is_set = false;
            let break_hours_rec_index = -1;

            for (let i = 0; i < simple_business_hours.day_hours.length; i++) {
                this.days.map((day_obj) => {
                    //console.log("----s-s- ", user_day_hours[i].day_num,"  ",user_day_hours[i].begin_hours)
                    if (day_obj.day_num == user_day_hours[i].day_num) 
                    {
                        let {display, label} = appHelper.getDayLabel(
                            day_obj.day_num,
                        )
                        day_obj.display = display
                        day_obj.label = label

                        if (user_day_hours[i].begin_hours != 0) {
                            // day_obj.begin_hours = user_day_hours[i].begin_hours
                            day_obj.begin_hours = this.convertTimestampToDateTime(user_day_hours[i].begin_hours, 'HH:mm', this.business_timezone)
                            // day_obj.begin_hours = utils_lib.getFormattedDate(user_day_hours[i].begin_hours, "hh:mm A");
                            // day_obj.begin_hours = null;
                        } else {
                            day_obj.begin_hours = null
                        }

                        if (user_day_hours[i].end_hours != 0) {
                            // day_obj.end_hours = user_day_hours[i].end_hours
                            day_obj.end_hours = this.convertTimestampToDateTime(user_day_hours[i].end_hours, 'HH:mm', this.business_timezone)
                            // day_obj.end_hours = utils_lib.getFormattedDate(user_day_hours[i].end_hours, "hh:mm A");
                            // day_obj.end_hours = null;
                        } else {
                            day_obj.end_hours = null
                        }
                        day_obj.by_appointment_only =
                            user_day_hours[i].by_appointment_only
                        day_obj.is_closed = user_day_hours[i].is_closed
                    }
                    if (breakk_hours_is_set == false) 
                    {
                        if (user_day_hours[i].break_begin_hours != 0 &&
                            user_day_hours[i].break_end_hours != 0) 
                        {
                            // this.break_start = user_day_hours[i].break_begin_hours
                            // this.break_end = user_day_hours[i].break_end_hours

                            this.break_start = this.convertTimestampToDateTime(user_day_hours[i].break_begin_hours, 'HH:mm', this.business_timezone)
                            this.break_end = this.convertTimestampToDateTime(user_day_hours[i].break_end_hours, 'HH:mm', this.business_timezone)
                            breakk_hours_is_set = true;
                            break_hours_rec_index = i;
                            //console.log("=asd=as=d=as=d  BREAK HOURS ",  this.break_start,  this.break_end )
                            
                            // this.break_start = utils_lib.getFormattedDate(user_day_hours[i].break_begin_hours, "hh:mm A");
                            // this.break_end = utils_lib.getFormattedDate(user_day_hours[i].break_end_hours, "hh:mm A");
                        } 
                        else 
                        {
                            this.break_start = null
                            this.break_end = null
                        }
                    }
                })
            } //End for
        },
        UpdateBusinessHours() {
            // e.preventDefault();
            this.v$.$touch()
            let data = {
                use_simple_business_hours: true,
                user_id: [],
                simple_business_hours: [],
            }
            // console.log(this.days);
            let timezone = this.business_timezone || this.$store.state.business_settings.business_time_zone
            let start_service_date_moment = moment(Date.now()).startOf('day')
            let day_hours = []
            for (let i = 0; i < this.days.length; i++) {
                let sbh = {
                    begin_hours: 0,
                    break_begin_hours: 0,
                    break_end_hours: 0,
                    by_appointment_only: false,
                    day_num: 1,
                    end_hours: 0,
                    is_closed: false,
                    isCollided: false,
                }
                sbh.day_num = this.days[i].day_num
                if (
                    this.days[i].begin_hours != '' &&
                    this.days[i].end_hours != ''
                ) {
                    let startintzstr =
                        start_service_date_moment.format('YYYY-MM-DD') +
                        ' ' +
                        this.days[i].begin_hours
                    let endintzstr =
                        start_service_date_moment.format('YYYY-MM-DD') +
                        ' ' +
                        this.days[i].end_hours
                    let start_day = moment.tz(startintzstr, timezone).valueOf()
                    let end_day = moment.tz(endintzstr, timezone).valueOf()
                    if (start_day < end_day) {
                        sbh.begin_hours = start_day
                        sbh.end_hours = end_day
                    }
                    if (
                        this.days[i].break_begin_hours != '' &&
                        this.days[i].break_end_hours != ''
                    ) {
                        let breakStartintzstr =
                            start_service_date_moment.format('YYYY-MM-DD') +
                            ' ' +
                            this.days[i].break_begin_hours
                        // console.log(breakStartintzstr);
                        let breakEndintzstr =
                            start_service_date_moment.format('YYYY-MM-DD') +
                            ' ' +
                            this.days[i].break_end_hours
                        // console.log(breakEndintzstr);

                        let bs = moment
                            .tz(breakStartintzstr, timezone)
                            .valueOf()
                        let be = moment.tz(breakEndintzstr, timezone).valueOf()
                        if (bs < be) {
                            sbh.break_begin_hours = bs
                            sbh.break_end_hours = be
                        }
                    }
                }
                sbh.by_appointment_only = this.days[i].by_appointment_only
                sbh.is_closed = this.days[i].is_closed
                day_hours.push(sbh)
            }
            // console.log(simple_business_hours)
            let sbs_hours = {day_hours: day_hours, is_valid: true}
            if (this.is_business_user == false) {
                sbs_hours.use_same_as_businesss_sbs_hours =
                    this.keep_my_hours_same_as_business_hours
            }
            let req = {
                user_id: [this.user_id],
                simple_business_hours: sbs_hours,
                use_simple_business_hours: true,
                timezone: this.business_timezone
            }

            // console.log("payload");
            // console.log(req);
            // return false;
            if (!this.v$.$invalid) {
                this.alert = false
                // console.log(req)
                this.$schedsdk
                    .addSimpleBusinesshours(req)
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

        processUserDataResult(result)
        {
            let data;
            if (result.status == 1) 
            {
                if (!this.is_business_user)
                {
                    data = result.data;
                    this.title =
                    'Edit Work Schedule for ' +
                    data.first_name +
                    ' ' +
                    data.last_name;
                    this.user_fullname =
                        data.first_name +
                        ' ' +
                        data.last_name
                } else {
                    data = result.full_obj;
                    this.user_id = result.full_obj._id;
                }
            
                
                this.advanced_business_hours = data.advanced_business_hours;
                this.advanced_bh_valid = data.use_advanced_business_hours ||false
                this.simple_bh_valid = data.use_simple_business_hours || false

                if (this.advanced_bh_valid)
                {
                    let redirectobj = { name: 'Manage Business Hours' }
                    if (!this.is_business_user)
                    {   
                        redirectobj.name = 'Manage Business Hours for User'
                        redirectobj.params = {user_id: this.user_id}
                    }
                    this.$router.push(redirectobj)
                    return;
                }
                console.log(" advanced hours --- ", this.advanced_business_hours.source_sbh_day_hours )
                console.log(" simple hours --- ", data.simple_business_hours )
                if (data.simple_business_hours &&
                    data.simple_business_hours.day_hours.length) 
                {
                    // this.setupHoursProp(data.simple_business_hours.day_hours);
                    this.fillSimpleBusinessHours(data.simple_business_hours)
                    this.keep_my_hours_same_as_business_hours =
                        data.simple_business_hours.use_same_as_businesss_sbs_hours
                }
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
<style>
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
.max-w-custom {
    max-width: 610px;
}
</style>