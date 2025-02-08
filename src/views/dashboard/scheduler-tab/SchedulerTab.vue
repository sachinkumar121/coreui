<template>
    <div class="scheduler-tab">
        <!-- <vuestic-date-picker
            
            :value="startDate"
            @input="onStartDatePickerInput"
        >
        </vuestic-date-picker> -->

        <!--<vuestic-date-picker ref="endDatePicker" :value="endDate" @input="onEndDatePickerInput"></vuestic-date-picker>-->
        <div class="row controls-div">
            <div class="settings-text">Settings</div>
            <div class="col-md-4 col-lg-3">
                <flat-pickr
                    ref="startDatePicker"
                    :config="date_picker_config"
                    :modelValue="startDate"
                    @on-change="onStartDatePickerInput"
                    placeholder="Date"
                >
                </flat-pickr>
            </div>
            <div class="col-md-4 col-lg-2 d-flex">
                <label class="control-label">
                    <b>Zoom:</b>
                </label>
                <div>
                    <select
                class="form-select"
                    v-model="internal_svprefs.zoommins"
                    @change="setViewZoomMins"
                >
                        <option value="5">5 Mins</option>
                        <option value="15">15 Mins</option>
                        <option value="30">30 Mins</option>
                        <option value="45">45 Mins</option>
                        <option value="60">60 Mins</option>
                    </select>
                </div> 
            </div>

            <div class="col-md-4 col-lg-3">
                <input
                    type="checkbox"
                    class="form-check-input"
                    v-model="internal_svprefs.skip_unavailable_shading"
                    @change="redounavailableshading"
                />&nbsp;
                <label class="control-label mb-0">
                    <b>Skip Unavailable Shading</b>
                </label>
                <br/>
                <template v-if="user_type != 1 && user_type != 3">
                    <input  
                        type="checkbox" class="form-check-input"
                        v-model="internal_svprefs.view_team_members_only" 
                        @change="updateTeamMembersList"
                    />&nbsp;
                    <label class="control-label">
                        <b>View team members only</b> 
                    </label>
                    
                </template>
            </div>
            <div class="col-md-4 col-lg-2" v-if="false">
                <button class="btn btn-primary" @click="disableAckedAnimation">
                    disableAckedAnimation</button
                ><br />

                <CButton
                class="btn"
                    color="primary"
                    @click="
                        () => {
                            visibleLiveDemo = true
                            onBookingCompleted()
                        }
                    "
                    >Add Booking v2</CButton
                >
                <CModal
                    :visible="visibleLiveDemo"
                    @close="
                        () => {
                            visibleLiveDemo = false
                        }
                    "
                >
                    <CModalHeader>
                        <CModalTitle>Modal title</CModalTitle>
                    </CModalHeader>
                    <CModalBody
                        >Woohoo, you're reading this text in a
                        modal!</CModalBody
                    >
                    <CModalFooter>
                        <CButton
                            color="secondary"
                            @click="
                                () => {
                                    visibleLiveDemo = false
                                }
                            "
                        >
                            Close
                        </CButton>
                        <CButton color="primary">Save changes</CButton>
                    </CModalFooter>
                </CModal>
            </div>
            <div class="d-none"></div>
            <div class="col-md-8 col-lg-4">
                <div class="gap-3 justify-content-end d-flex">

                <input
                    class="btn btn-primary"
                    type="button"
                    value="Add Booking"
                    @click="AddBookingButtonAction"
                />
                <!-- Temporarily don't show page based usage 
                <input
                    class="btn btn-info"
                    type="button"
                    value="Add Booking Page"
                    @click="$router.push({name: 'Add Booking'})"
                />
                -->
                <input
                    class="btn btn-info"
                    type="button"
                    value="Daily Agenda View"
                    @click="$router.push({name: 'Dashboardv2'})"
                />
                </div>
            </div>
        </div>

        <br />
        <div class="row modal-custom-r" id="schedular_div" ref="schedular_div">
            <div class="col-md-12">
                <scheduler
                    ref="scheduler"
                    :time-ranges-feature="true"
                    :columns="columns"
                    :row-height="60"
                    :autoHeight="viewoptions.auto_height"
                    :height="viewoptions.scheduler_height"
                    :bar-margin="barMargin"
                    :events="events"
                    :resources="resources"
                    :time-ranges="timeRanges"
                    :resourceTimeRanges="resourceTimeRanges"
                    :start-date="startDate"
                    :end-date="endDate"
                    :event-renderer="eventRenderer"
                    :column-lines-feature="true"
                    :force-fit="false"
                    :view-preset="viewPreset"
                    event-style="colored"
                    :eventResizeFeature="eventResizeFeature"
                    :eventTooltipFeature="eventTooltipFeature"
                    :eventDragFeature="eventDragFeature"
                    @eventselectionchange="onEventSelectionChange"
                    :eventEditFeature="{showDeleteButton: false}"
                    :timeRangesFeature="timeRangesFeature"
                    :listeners="listeners"
                    :mode="viewoptions.mode"
                    :resourceTimeRangesFeature="enableResourceTimeRangesFeature"
                    :eventMenuFeature="eventContextMenu"
                    :key="schedTabKey"
                >
                </scheduler>
                <EventEditorModal 
                    :visible="showEditor"
                    @close="showEditor = false"
                />
                <!-- <EventEditor
                    :visible="showEditor"
                    @modal:close="onCloseEditor"
                    ref="eventEditor"
                    :eventRecord="eventRecord"
                    :eventStore="eventStore"
                    :resourceId="resourceId"
                    @close="onCloseEditor"
                ></EventEditor> -->
            </div>
        </div>
    </div>
</template>

<script>
import Scheduler from './Scheduler.vue'
import EventEditorModal from '@/ui_components/booking/EventEditorModal.vue'

import moment from 'moment-timezone'
import booking_helper from '../../../helpers/booking_helper'
import flatPickr from 'vue-flatpickr-component'
import login_helper from '../../../helpers/login_helper'
import 'flatpickr/dist/flatpickr.css'
import {
    AjaxHelper,
    DateHelper,
    Popup,
    Tooltip,
    MessageDialog,
    ResourceModel,
    EventModel,
} from 'bryntum-scheduler'
import {crono} from 'vue-crono'
// import { ResourceModel, EventModel, DateHelper, Scheduler, Toast, WidgetHelper, MessageDialog } from '../../build/scheduler.module.js?442139';
import EventEditor from './EventEditor.vue'
// import VuesticDatePicker from '../../../vuestic-theme/vuestic-components/vuestic-date-picker/VuesticDatePicker.vue';
class Employee extends ResourceModel {
    static get fields() {
        return [
            // { name : 'available', type : 'boolean', defaultValue : false },
            // { name : 'statusMessage', defaultValue : 'Gone fishing' }
        ]
    }

    get cls() {
        return this.available ? '' : 'unavailable'
    }
}
function resource_set(
    businesscontext,
    resourceTimeRanges,
    resource,
    startdate,
    enddate,
) {
    resourceTimeRanges.push({
        resourceId: resource.id,
        startDate: moment(startdate).format('YYYY-MM-DD HH:mm'),
        endDate: moment(enddate).format('YYYY-MM-DD HH:mm'),
        // name          : 'Unavailable',
        cls: 'custom',
    })
}
import {mapState} from 'vuex'

export default {
    name: 'scheduler-tab',
    mixins: [crono],
    components: {
        Scheduler,
        flatPickr,
        EventEditor,
        EventEditorModal
    },

    //Crono package is a simpler alternative to handle repeated job.
    //We could if necessary replace with setInterval and clearInterbal on beforeDestroy
    cron: {
        time: 8 * 60 * 1000, //5 mins in millisecs
        method: 'pollForBookingData',
    },
    //SCHEDULER_VIEW_PREFS
    computed: {
        ...mapState({
            enable_celebration_animations: (state) =>
                state.user_data.ui_preferences.enable_celebration_animations ||
                null,
        }),

        viewoptions() {
            let svp = this.$store.state.scheduler_view_preferences

            return {
                zoommins                : svp.zoommins || 60,
                skip_unavailable_shading: svp.skip_unavailable_shading || false,
                horizontal_mode         : svp.horizontal_mode || false,
                mode                    : svp.mode || 'vertical',
                auto_height             : svp.auto_height || false,
                scheduler_height        : svp.scheduler_height || 884,
                view_team_members_only  : svp.view_team_members_only || false,
                hide_filter             : svp.hide_filter || true
            }
        }, // end view options
    }, //end computed

    //Watch internal prefs update
    watch: {
        internal_svprefs: {
            handler: function (newVal, oldVal) {
                // watch it
                //console.log('Prop changed: ', newVal, ' | was: ', oldVal)
                this.save_viewprefs_to_store()
            },
            deep: true, //If we want members to be watched.
        },
    }, //end watch
    data() {
        return {
            user_type: this.$store.state.user_data.type,
            user_id: this.$store.state.user_data._id,
            visibleLiveDemo: false,
            schedTabKey: 0,

            internal_svprefs: {},
            // mode: 'vertical',
            // autoHeight: false,
            //schedulerheight: 884,
            date_picker_config: {
                altFormat: 'F j, Y',
                altInput: true,
                // noCalendar: true,
                // enableTime: true,
                // time_24hr: true
            },
            scrollable: true,
            events: [],
            resources: [],
            timeRanges: [],
            resourceTimeRanges: [],
            searchDateHistoryMap: new Map(),
            bookingByDateAvailableMap: new Map(),
            barMargin: 5,
            startDate: moment().startOf('day').add(1, 'hours').toDate(),
            // endDate       : new Date(),
            endDate: moment().add(1, 'day').toDate(),
            centerDate: moment().toDate(), //Current date
            // resourceZones   : new Sch.data.EventStore(),
            selectedEvent: '',
            columns: [
                {
                    text: 'Staff',
                    width: 230,
                    field: 'name',
                    editor: false,
                    htmlEncode: false,
                    renderer({value, grid, record, cellElement}) {
                        const count = record.events.length,
                            image = value
                                ? value.toLowerCase() + '.jpg'
                                : 'none.png'

                        return `
                            <div class="b-resource-info">
                                <!-- <img alt="${value}" src="users/${image}" /> -->
                                <dl>
                                <dt>${value}</dt>
                                <dd class="b-resource-events">${count} event${
                            count !== 1 ? 's' : ''
                        }</dd>
                                </dl>
                            </div>
                        `
                    },
                },
            ],
            stripeFeature: true,
            // resourceStore:{modelClass : Employee},
            crudManager: {
                autoLoad: true,
                resourceStore: {
                    modelClass: Employee,
                },
            },
            eventContextMenu: {
                // Extra items for all events
                defaultItems: {
                    deleteEvent: false,
                },
                items: [
                    {
                        text: 'Cancel Booking',
                        icon: 'b-fa b-fa-fw b-fa-ban',
                        vueobj: this,
                        onItem({eventRecord}) {
                            console.log('Perform cancel operation')
                            console.log(eventRecord)

                            // cancelHandler();
                            let confirmed = confirm(
                                'Are you sure to cancel this booking',
                            )

                            if (confirmed) {
                                let data = {
                                    booking_id: eventRecord.data.id,
                                    service_order_id:
                                        eventRecord.data.service_order_id,
                                }

                                //let updated_booking = null;
                                //let is_new = false;
                                this.vueobj.$schedsdk
                                    .cancelBooking(data)
                                    .then((result) => {
                                        console.log('Cancel done... result...')
                                        console.log(result)
                                        if (
                                            result.status == 1 &&
                                            eventRecord.eventStore
                                        ) {
                                            //this.operation_result_message = result.message;
                                            //this.okDoneHandler()
                                            let s =
                                                eventRecord.eventStore.remove(
                                                    eventRecord,
                                                    true,
                                                )
                                            console.log('asdasdaasdkkkkasd s')
                                            console.log(s)
                                        }
                                    })
                                    .catch((ex) => {
                                        let mess = ''
                                        console.log('Error ==== in cancel')
                                        if (ex.data && ex.data.message) {
                                            mess = ex.data.message
                                        } else {
                                            mess = ex.message
                                        }
                                        console.log(mess)
                                    })
                                    .finally(() => {
                                        //
                                    })
                            }
                        },
                    },
                ], //end items
            },
            viewPreset: {
                base: 'minuteAndHour',
            },
            tickSize: 180,
            eventResizeFeature: {
                disabled: true,
            },
            eventDragFeature: {
                disabled: false,
                constrainDragToResource: true,
                validatorFn: (data, event) => {
                    if (event.type == 'mouseup') {
                        let currentDate = moment(new Date()).valueOf()
                        let startDate = moment(data.startDate).valueOf()
                        if (startDate < currentDate) {
                            //   return false
                        }
                    }
                },
            },

            eventTooltipFeature: {
                disabled: false,
                template: (data) => {
                    let v = `<dl>
                        <dt>Guest:</dt>
                        <dd>
                            ${data.eventRecord.name}
                        </dd>
                        <dt>Time:</dt>
                        <dd>
                            ${DateHelper.format(
                                data.eventRecord.startDate,
                                'H:mm',
                            )} - ${DateHelper.format(
                        data.eventRecord.endDate,
                        'H:mm A',
                    )}   
                            ${
                                data.eventRecord.get('service_time_mins')
                                    ? ` - ${data.eventRecord.service_time_mins} mins`
                                    : ''
                            }
                        </dd>
                        ${
                            data.eventRecord.get('note')
                                ? `<dt>Note:</dt><dd>${data.eventRecord.note}</dd>`
                                : ''
                        }
                        ${
                            data.eventRecord.get('image')
                                ? `<dt>Image:</dt><dd><img class="image" src="${data.eventRecord.get(
                                      'image',
                                  )}"/></dd>`
                                : ''
                        }
                    </dl>`
                    return v
                },
            },
            enableResourceTimeRangesFeature: true,
            eventEditFeature: {
                disabled: false,
            },
            timeRangesFeature: {
                showCurrentTimeLine: true,
            },
            eventRenderer: ({eventRecord}) => {
                return `
                    <div class="info">
                        <div class="name">${eventRecord.name}</div>
                        <div class="desc">${eventRecord.desc}</div>
                    </div>
                    `
            },
            showEditor: false,
            eventRecord: null,
            eventStore: null,
            resourceId: null,
            listeners: {
                beforeeventedit: this.beforeEventEditHandler,
            },
        }
    },

    methods: {
        updateTeamMembersList() {
            this.save_viewprefs_to_store();
            this.getData();
        },
        async disableAckedAnimation() {
            await this.$schedsdk
                .update_user_ui_preferences({
                    user_id: this.$store.state.user_data._id,
                    ui_preferences: {acked_keep_celebrations_msg: false},
                })
                .then(async (result) => {
                    if (result.status) {
                        await this.$store.commit('update_user_ui_preferences', {
                            key: 'acked_keep_celebrations_msg',
                            value: false,
                        })
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        async clearAnimation() {
            this.$skyEventListener.emit('CLEAR_ANIMATION')
            await this.$store.commit('set_ui_data', {
                key: 'show_acked_toastr',
                value: false,
            })
        },
        async onBookingCompleted() {
            let eventName = 'AEV_BOOKING_COMPLETED'
            this.$skyEventListener.generateEvent(eventName)
        },
        AddBookingButtonAction() {
            // this.eventRecord.startdate = this.startDate;
            // this.showEditor = true;
            // me.startDate = moment(eventRecord.data.service_start_date).format("YYYY-MM-DD"),
            //                       me.startTime = moment(eventRecord.data.service_start_date).format("HH:mm"),

            let current_mom = moment()
            let curr_min = current_mom.minute()
            let remaining = 10 - (curr_min % 10) //To Get to closest 10 minutes

            //console.log(current_mom.add(remaining,'minutes').format("YYYY-MM-DD"))
            let startdateMs = current_mom
                .add(10 + remaining, 'minutes')
                .valueOf() //10 + becuase of add 10 mins to current time.
            Object.assign(this, {
                eventStore: {},
                resourceId: '',
                eventRecord: {data: {}, _startDateMS: startdateMs},
                showEditor: true,
            })
        },
        openFullscreen() {
            let elem = this.$refs.schedular_div
            if (elem.requestFullscreen) {
                elem.requestFullscreen()
            } else if (elem.mozRequestFullScreen) {
                /* Firefox */
                elem.mozRequestFullScreen()
            } else if (elem.webkitRequestFullscreen) {
                /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen()
            } else if (elem.msRequestFullscreen) {
                /* IE/Edge */
                elem.msRequestFullscreen()
            }
        },
        forceSchedRerender() {
            this.schedTabKey += 1
        },

        pollForBookingData() {
            // this.bookingDataPoll = setTimeout(() => {
            console.log('TMBooking Data Poll exec......')
            this.getData()
            if (
                this.$refs &&
                this.$refs.scheduler &&
                this.$refs.scheduler.schedulerInstance != null
            ) {
                //  console.log("calling again........")
                // this.pollForBookingData();
            }
            //               }, 20000)
        },
        getData() {
            // AjaxHelper.get('./data/data.json', { parseJson : true }).then(response => {
            // Response has { resources, events, timeRanges }, can be applied directly
            //Object.assign(this, require('./data/data.json'));
            // });
            let valid_result = false
            let userListPromise = null;

            if (this.internal_svprefs.view_team_members_only && this.user_type != 1 && this.user_type != 3) {
                userListPromise = this.$schedsdk.get_colleagues({ user_id: this.user_id });
            } else {
                userListPromise = this.$schedsdk.get_users_list({});
            }

            userListPromise
                .then((result) => {
                    let resources = []
                    if (result.status != 1) {
                        login_helper.checkSessionExpiryAndRedirectToLogin(
                            result,
                            this.$schedsdk,
                            this.$router,
                        )
                    } else {
                        valid_result = true
                    }
                    for (let i = 0; i < result.data.length; i++) {
                        if (
                            result.data[i]
                                .provider_show_in_internal_calendar === false
                        ) {
                            continue
                        }
                        resources.push({
                            id: result.data[i]._id,
                            name:
                                result.data[i].first_name +
                                ' ' +
                                result.data[i].last_name,
                            role: 'Provider',
                            available: true,
                        })
                    }
                    this.resources = resources
                })
                .catch((ex) => {
                    login_helper.checkSessionExpiryAndRedirectToLogin(
                        ex,
                        this.$schedsdk,
                        this.$router,
                    )
                })
                .finally(() => {
                    if (valid_result) {
                        this.getEvents(this.startDate)
                        this.checkandSetResourceTimeRanges()
                    }
                    //
                })
        },
        getEvents(date) {
            let current_date = moment(new Date()).valueOf()
            let debug_print = false
            if (date == null || date == 0) {
                date = current_date
            }
            let timezone =
                this.$store.state.business_settings.business_time_zone
            let business_context = {
                business_settings: this.$store.state.business_settings,
            }
            let n_days = 7
            let search_day_moment = moment.tz(date, timezone).startOf('day')

            let search_day = search_day_moment.valueOf()
            let start_day = moment
                .tz(date, timezone)
                .startOf('day')
                .subtract(n_days, 'days')
                .valueOf()
            let end_day = moment
                .tz(date, timezone)
                .startOf('day')
                .add(n_days, 'days')
                .valueOf()

            let srchistData = this.searchDateHistoryMap.get(
                moment.tz(date, timezone).startOf('day').valueOf(),
            )

            if (debug_print) {
                console.log(
                    'Get for date: ',
                    date,
                    start_day,
                    end_day,
                    current_date,
                )
                console.log('History result for: ', start_day, srchistData)
                console.log(
                    'start day for: ',
                    search_day_moment.format('YYYY-MM-DD HH:mm'),
                    srchistData,
                )
            }
            if (srchistData == null) {
                this.searchDateHistoryMap.set(search_day, {
                    search_date: search_day,
                    range_begin_date: start_day,
                    range_end_date: end_day,
                    result_count: 0,
                    request_timestamp: 0,
                })
            } else {
                //check if we need to request.
                let diff_ms = current_date - srchistData.request_timestamp
                if (debug_print) {
                    console.log('srchistData  DIFF MS ', diff_ms)
                }

                if (srchistData.result_count == 0 && diff_ms < 10000) {
                    if (debug_print) {
                        console.log(
                            'srchistData  DIFF MS RETURNING early ',
                            diff_ms,
                        )
                    }

                    //returning early since it s only less than 10 seconds from last network query
                    return
                }

                if (this.bookingByDateAvailableMap.get(search_day) != null) {
                    if (debug_print) {
                        console.log(
                            'srchistData Already available RETURNING early ',
                            search_day,
                        )
                    }
                    //Already in event DB
                    return
                }
            }
            this.$schedsdk
                .getBookingList({
                    begin_booking_date: start_day,
                    end_booking_date: end_day,
                })
                .then((result) => {
                    let events = []
                    let earliest_event_date = 99999999990000
                    let latest_event_date = 0

                    for (let i = 0; i < result.data.length; i++) {
                        if (
                            result.data[i].type >= 3 &&
                            result.data[i].type <= 7
                        ) {
                            events.push(
                                booking_helper.booking_to_bryn_event_record(
                                    business_context,
                                    result.data[i],
                                ),
                            )

                            if (
                                result.data[i].service_start_date <
                                earliest_event_date
                            ) {
                                earliest_event_date =
                                    result.data[i].service_start_date
                            }
                            if (
                                result.data[i].service_start_date >
                                latest_event_date
                            ) {
                                latest_event_date =
                                    result.data[i].service_start_date
                            }
                        }
                    }
                    this.searchDateHistoryMap.set(search_day, {
                        search_date: search_day,
                        range_begin_date: start_day,
                        range_end_date: end_day,
                        result_count: result.data.length,
                        request_timestamp: moment.utc().valueOf(),
                    })

                    let startDateMoment = moment
                        .tz(earliest_event_date, timezone)
                        .startOf('day')

                    //.startOf('day').add(1, 'day');
                    let endDateMoment = moment
                        .tz(latest_event_date, timezone)
                        .startOf('day')

                    if (debug_print) {
                        console.log(
                            'startDateMoment *** *** ',
                            startDateMoment.valueOf(),
                            startDateMoment.format('YYYY-MM-DD HH:mm'),
                        )
                        console.log(
                            'endDateMoment *** *** ',
                            endDateMoment.valueOf(),
                            endDateMoment.format('YYYY-MM-DD HH:mm'),
                        )
                    }
                    //.startOf('day').subtract(1, 'day');
                    let counter = 0
                    try {
                        while (
                            startDateMoment.valueOf() <= endDateMoment.valueOf()
                        ) {
                            if (debug_print) {
                                console.log(
                                    'SET DATE Available for DATE ',
                                    startDateMoment.valueOf(),
                                    startDateMoment.format('YYYY-MM-DD HH:mm'),
                                )
                            }
                            this.bookingByDateAvailableMap.set(
                                startDateMoment.valueOf(),
                                1,
                            )
                            startDateMoment = startDateMoment.add(1, 'day')
                            //console.log("updated startMoment *** *** ", startDateMoment.valueOf(),startDateMoment.format("YYYY-MM-DD HH:mm"))

                            counter++
                        }
                        this.bookingByDateAvailableMap.set(
                            endDateMoment.valueOf(),
                            1,
                        )
                    } catch (ex) {
                        console.log('exasdlkjasdj-- ', ex)
                    }

                    //console.log("Bryn Event ", events)
                    this.events = events

                    if (
                        this.$refs.scheduler &&
                        this.$refs.scheduler.schedulerInstance
                    ) {
                        //this.$refs.scheduler.schedulerInstance.scrollToNow({block: 'center'})
                        // this.centerCalendar();
                    } else {
                        console.log('======== No scheduler Instance')
                    }
                })
        },
        centerCalendar(stDate) {
            const startDate = stDate
            let newStart = new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate(),
                // apply start/end time from previous date value
                11,
                0,
                0,
            )
            this.$refs.scheduler.schedulerInstance.scrollToDate(newStart, {
                block: 'center',
            })
        },
        getResourceTimeRanges(date) {
            if (this.enableResourceTimeRangesFeature == false) {
                return
            }
            let resourceTimeRanges = []
            let timezone =
                this.$store.state.business_settings.business_time_zone
            let business_context = {
                business_settings: this.$store.state.business_settings,
            }
            let startDay = moment.tz(date, timezone).startOf('day').valueOf()
            let endDay = moment.tz(date, timezone).endOf('day').valueOf()
            for (let j = 0; j < this.resources.length; j++) {
                this.$schedsdk
                    .get_availability({
                        user_id: this.resources[j].id,
                        date: moment.tz(date, timezone).valueOf(),
                    })
                    .then((result) => {
                        if (result.dates) {
                            let selected_array = []
                            for (let i = 0; i < result.dates.length; i++) {
                                if (
                                    result.dates[i].day_start_time >=
                                        startDay &&
                                    result.dates[i].day_end_time <= endDay
                                ) {
                                    selected_array.push(result.dates[i])
                                }
                            }
                            selected_array.sort((a, b) => {
                                return a.day_start_time - b.day_start_time
                            })
                            for (let a = 0; a < selected_array.length; a++) {
                                let startdate = 0
                                let enddate = 0

                                if (
                                    a == 0 &&
                                    selected_array[a].day_start_time != startDay
                                ) {
                                    startdate = startDay
                                    enddate = selected_array[a].day_start_time
                                    resource_set(
                                        business_context,
                                        resourceTimeRanges,
                                        this.resources[j],
                                        startdate,
                                        enddate,
                                    )
                                }
                                if (
                                    a > 0 &&
                                    selected_array[a - 1].day_end_time !=
                                        selected_array[a].day_start_time
                                ) {
                                    startdate =
                                        selected_array[a - 1].day_end_time
                                    enddate = selected_array[a].day_start_time
                                    resource_set(
                                        business_context,
                                        resourceTimeRanges,
                                        this.resources[j],
                                        startdate,
                                        enddate,
                                    )
                                }
                                if (
                                    a == selected_array.length - 1 &&
                                    selected_array[a].day_end_time != endDay
                                ) {
                                    startdate = selected_array[a].day_end_time
                                    enddate = endDay
                                    resource_set(
                                        business_context,
                                        resourceTimeRanges,
                                        this.resources[j],
                                        startdate,
                                        enddate,
                                    )
                                }
                            } //end for
                        } //If dates are valide
                    })
                    .catch((ex) => {
                        let startdate = startDay
                        let enddate = endDay
                        resource_set(
                            business_context,
                            resourceTimeRanges,
                            this.resources[j],
                            startdate,
                            enddate,
                        )
                    })
            }
            this.resourceTimeRanges = resourceTimeRanges
        },
        cancelHandler() {
            this.$refs.eventEditor.cancelHandler()
        },
        addEvent() {
            this.$refs.scheduler.addEvent()
        },
        removeEvent() {
            this.$refs.scheduler.removeEvent()
            this.selectedEvent = ''
        },
        onBeforeSave() {
            console.log('Save new booking feature ')
        },
        onStartDatePickerInput(selectedDates, value, instance) {
            const startDate = this.$refs.scheduler.schedulerInstance.startDate
            //console.log("asdsad--- onStartDatePickerInput", value)
            value = DateHelper.parse(value, 'YYYY-MM-DD')
            //console.log("asdsad--- onStartDatePickerInput post parse ", value)
            let H = startDate.getHours()
            let M = startDate.getMinutes()
            let S = startDate.getSeconds()
            //console.log("asdsad--- onStartDatePickerInput post parse hour: ", H)
            if (!value) {
                console.log('returning...early ')
                return
            }
            this.$refs.scheduler.schedulerInstance.startDate = new Date(
                value.getFullYear(),
                value.getMonth(),
                value.getDate(),
                // apply start/end time from previous date value
                H,
                M,
                S,
            )

            this.getEvents(this.$refs.scheduler.schedulerInstance.startDate)
            this.getResourceTimeRanges(
                this.$refs.scheduler.schedulerInstance.startDate,
            )
            this.centerCalendar(
                this.$refs.scheduler.schedulerInstance.startDate,
            )
        },

        // onEndDatePickerInput(value) {
        //     const startDate = this.$refs.scheduler.schedulerInstance.startDate;
        //     value = DateHelper.parse(value, 'Y-m-d');
        //     this.$refs.scheduler.schedulerInstance.endDate = value;
        // },
        //    onBeforeEventEdit : this.beforeEventEditHandler,
        onEventSelectionChange({selection}) {
            if (selection.length) {
                this.selectedEvent = selection[0].name
            } else {
                this.selectedEvent = ''
            }
        },

        beforeEventEditHandler(event) {
            console.log('-s-df-sd-f in openEfiti')
            //console.log(event)
            this.openEditor(event)

            return false
        },

        openEditor({source, resourceRecord, eventRecord}) {
            //console.log(" open editor source.eventStore --- ")
            //console.log( source.eventStore);
            //console.log( eventRecord);
            Object.assign(this, {
                eventStore: source.eventStore,
                resourceId: resourceRecord.id,
                eventRecord: eventRecord,
                showEditor: true,
            })
        },

        onCloseEditor() {
            this.showEditor = false
            this.$nextTick(
                () =>
                    function () {
                        if (this.$refs.scheduler.schedulerInstance) {
                            this.$refs.scheduler.schedulerInstance.refresh()
                        }
                    },
            )
            // console.log("EDIROR CLOSESDASDASD");
        },
        setViewZoomMins(event) {
            let value = event.target.value
            this.internal_svprefs.zoommins = value

            let zoomLevel = 17
            if (value == 5) {
                zoomLevel = 19
            }
            if (value == 15) {
                zoomLevel = 18
            }
            if (value == 30) {
                zoomLevel = 17
            }
            if (value == 45) {
                zoomLevel = 16
            }
            if (value == 60) {
                zoomLevel = 15
            }
            this.$refs.scheduler.schedulerInstance.zoomLevel = zoomLevel
        },
        //Switch scheduler view is not used here but used at parent because
        //Scheduler redraw does not keep various listeners etc.
        //It isn't supported at scheduler level.
        //So we reinit component at parent.
        async switch_scheduler_view_mode(e) {
            //Since the mode is horizontal_mode, its already changed.
            //this.internal_svprefs.horizontal_mode = e.target.checked? true: false;
            //    await this.do_switch_scheduler_view_mode(this.internal_svprefs.horizontal_mode )
            //Do a full refresh as there is an error in scheduler
            console.log('asdasdasd full refresh')
            //this.forceSchedRerender()
            //Have no choice but to reload as listeners need to reload
            //this.$router.go();
        },

        save_viewprefs_to_store() {
            this.$store.commit(
                'SET_SCHEDULER_VIEW_PREFS',
                this.internal_svprefs,
            )
        },
        checkandSetResourceTimeRanges() {
            if (this.internal_svprefs.skip_unavailable_shading == true) {
                this.resourceTimeRanges = []
                this.enableResourceTimeRangesFeature = false
            } else {
                this.enableResourceTimeRangesFeature = true
                if (
                    this.$refs.scheduler &&
                    this.$refs.scheduler.schedulerInstance
                ) {
                    this.getResourceTimeRanges(
                        this.$refs.scheduler.schedulerInstance.startDate,
                    )
                }
            }
            if (
                this.$refs.scheduler &&
                this.$refs.scheduler.schedulerInstance
            ) {
                this.$refs.scheduler.schedulerInstance.refresh()
            }
        },
        redounavailableshading(e) {
            this.internal_svprefs.skip_unavailable_shading = e.target.checked
                ? true
                : false
            this.checkandSetResourceTimeRanges()
        },
    },
    beforeUnmount() {},
    created() {
        this.internal_svprefs = this.viewoptions
        this.getData()
    },

    mounted() {
        //In our case after zooming we should not change view of time span
        //otherwise its confusing.bryntum.query('scheduler').zoomLevel=19

        this.$refs.scheduler.schedulerInstance.zoomKeepsOriginalTimespan = true

        this.$refs.scheduler.schedulerInstance.on({
            beforeEventEdit: (e) => {
                //console.log("befor edit event")
                this.beforeEventEditHandler(e)
                return false
            },

            afterEventDrop: ({eventRecords, context}) => {
                console.log('After event DROP...')
                console.log(eventRecords)
                /*
                                let data = {
                                    _id:eventRecords[0].data.id,
                                    service_order_id:eventRecords[0].data.service_order_id,
                                    new_service_start_timestamp:moment(eventRecords[0].data.startDate).valueOf()
                                }
                                console.log(data)
                                this.$schedsdk.rescheduleBooking(data).then((result)=>{
                                    console.log(result)
                                }).catch(ex=>{
                                    this.schedulerEngine.refresh();
                                })
                                */
            },
            beforeEventDropFinalize: async ({source: scheduler, context}) => {
                if (scheduler.confirmationsEnabled || true) {
                    console.log(context)
                    context.async = true
                    console.log('Old: ')
                    console.log(context.targetEventRecord)
                    console.log(context.newResource)
                    console.log(context.draggedRecords[0])

                    console.log('New: ')
                    const namesInQuotes = context.draggedRecords.map(
                            (eventRecord) => `"${eventRecord.name}"`,
                        ),
                        result = await MessageDialog.confirm({
                            title: 'Please confirm',
                            message: `${namesInQuotes.join(', ')} ${
                                namesInQuotes.length > 1 ? 'were' : 'was'
                            } moved. Allow this operation?`,
                        })

                    // `true` to accept the changes or `false` to reject them

                    // context.finalize(result === MessageDialog.yesButton);
                    let data = {
                        _id: context.draggedRecords[0].data.id,
                        service_order_id:
                            context.draggedRecords[0].data.service_order_id,
                        new_service_start_timestamp: moment(
                            context.startDate,
                        ).valueOf(),
                    }
                    // console.log(data)
                    this.$schedsdk
                        .rescheduleBooking(data)
                        .then((result) => {
                            // console.log(result)
                            context.finalize(true)
                        })
                        .catch((ex) => {
                            context.finalize(false)
                        })
                }
            },
            beforeEventAdd: ({source, evernRecord}) => {
                console.log('before Add event')
            },
            eventDragStart: (e) => {
                console.log(' event start drag...')
                //e.source.scrollManager.direction="both";
                //e.source.scrollManager.startScrollDelay=0;
            },
        })

        this.centerCalendar(this.$refs.scheduler.schedulerInstance.startDate)
    },
}
</script>

<style>
@import 'bryntum-scheduler/scheduler.classic-light.css';

.controls-div {
    float: left;
    width: 100%;
    border: 1px solid #d8dbe0;
    padding: 15px 4px;
    margin: 0 0 1rem 0 !important;
    padding-top: 20px;
    position: relative;
}
.settings-text {
    position: absolute;
    background: #fff;
    padding: 3px 6px;
    top: -15px;
    left: 15px;
    font-size: 16px;
    font-weight: bold;
}
/* MOBILE STYLES */
@media screen and (max-width: 767px) {
    .controls-div input.flatpickr-input {
        margin-bottom: 10px;
        width: 100%;
    }
    .controls-div input.form-control.input {
        margin-bottom: 15px;
    }
    .controls-div input.btn.btn {
        width: 100%;
        margin-bottom: 10px;
    }

    .controls-div input.btn.btn {
        width: 100%;
        margin-bottom: 10px;
    }

    .controls-div input.form-control.input {
        margin-bottom: 15px;
    }
}

.b-grid-header-container {
    border-bottom: 2px solid #555;
    background-color: #fff;
}

.b-grid-header-text-content {
    display: flex;
    justify-content: center;
}

.b-grid-header,
.b-sch-header-timeaxis-cell {
    background: #fff;
    color: #34495e;
    text-transform: uppercase;
    border-right: none;
}

.b-sch-header-timeaxis-cell {
    border-bottom: 1px solid #999;
    align-items: flex-start;
}

.b-sch-header-hours,
.b-sch-header-minutes {
    line-height: 1em;
}

.b-sch-header-minutes {
    font-size: 0.5em;
}

.b-responsive-small .b-sch-header-minutes {
    display: none;
}

.b-resource-info dl {
    margin: 0;
}

.b-grid-vertical-overflow .b-grid-header-scroller:last-child,
.b-columnlines .b-grid-cell:not(:last-child),
.b-grid-cell {
    border-right: none;
}

.b-grid-row {
    border-bottom: 2px solid #eff4f5;
}

.b-grid-cell {
    color: #34495e;
}

.b-resource-info dd {
    color: #adb3b9;
}

.b-grid-splitter {
    background: transparent;
}

.b-sch-style-colored.b-sch-color-blue.b-sch-event:not(.b-sch-event-milestone),
.b-sch-style-colored.b-sch-color-blue .b-sch-event:not(.b-sch-event-milestone) {
    color: #4ab2e3;
}

.b-sch-style-colored.b-sch-color-green.b-sch-event:not(.b-sch-event-milestone),
.b-sch-style-colored.b-sch-color-green
    .b-sch-event:not(.b-sch-event-milestone) {
    color: #4ae387;
}

.b-sch-style-colored.b-sch-color-red.b-sch-event:not(.b-sch-event-milestone),
.b-sch-style-colored.b-sch-color-red .b-sch-event:not(.b-sch-event-milestone) {
    color: #e34a4a;
}

.b-sch-event-wrap .b-sch-event section {
    flex-direction: column;
}

.b-sch-event-wrap .b-sch-event i.b-fa {
    margin-right: 0.5em;
}

.b-sch-event-wrap.b-drag-invalid .b-sch-event {
    background-color: red !important;
}

.b-sch-range {
    background: #d6d6d6;
    color: #333;
}

.b-theme-dark .b-sch-range {
    background: #777;
}

.b-timeline-subgrid .b-grid-row.unavailable {
    background: repeating-linear-gradient(
        -55deg,
        rgba(230, 50, 50, 0.7),
        rgba(230, 50, 50, 0.7) 5px,
        rgba(240, 50, 50, 0.4) 5px,
        rgba(240, 50, 50, 0.4) 10px
    );
}

.b-sch-event.unavailable {
    background-color: red !important;
    opacity: 1;
}

.b-sch-event-header {
    font-size: 0.8em;
}

.b-sch-event-footer {
    font-weight: 400;
}

.b-sch-tip-invalid .b-sch-tip-message:not(:empty) {
    color: red;
}

.b-sch-tip-invalid .b-sch-tip-message:not(:empty):before {
    margin-right: 0.5em;
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
    content: '\F071';
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    line-height: 1;
}

.restriction-title {
    padding: 10px 0 0 0;
}

.restriction-list {
    padding: 0 0 0 25px;
    margin: 0;
}

.restriction-list > li {
    margin: 0.3em 0 0 0;
    padding: 0 0 0 4px;
}

.b-sch-resourcetimerange.custom {
    background: repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.2),
            rgba(255, 255, 255, 0.2) 10px,
            rgba(190, 190, 190, 0.2) 10px,
            rgba(190, 190, 190, 0.2) 20px
        )
        rgba(255, 255, 255, 0);
    color: #888;
}
</style>
