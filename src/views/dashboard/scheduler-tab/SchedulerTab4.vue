<template>
    <div class="d-flex flex-wrap">
        <!-- <CContainer> -->
            <CRow class="controls-div" v-if="!internal_svprefs.hide_filter">
                <div class="settings-text">Options</div>
                <CCol sm="12" md="5" lg="4" xxl="4" class="mt-2 mt-md-0">
                    <div class="form-floating filter-status">
                        <v-select id="filter_resources" 
                            placeholder=""
                            label="name" 
                            multiple :options="resources" v-model="select"  
                            :class="{'options-selected': select.length > 0}">
                            <template v-slot:no-options>
                                Type to search..
                            </template>
                            <template v-slot:option="option" >
                                <div class="d-center">
                                    {{ option.name }}
                                </div>
                            </template>
                            <template v-slot:selected-option="option" >
                                <div class="selected d-center">
                                    {{ option.name }}
                                </div>
                            </template>
                        </v-select>
                        <label for="select-status">Choose Providers</label>
                    </div>
                </CCol>
                <CCol sm="12" md="7" lg="8" xxl="8" class="mt-2 mt-md-0">
                    <CRow>
                        <div class="col-md-6">
                            <div class="mb-2">
                                <span>Viewing {{from}} - {{to}}<a href="javascript:void(0)" @click.prevent="openTimeRangePopup"> (change)</a></span> <br>
                            </div>
                            <input  
                                type="checkbox"
                                class="form-check-input"
                                v-model="internal_svprefs.horizontal_mode" 
                                @change="switch_scheduler_view_mode"
                                /> &nbsp;
                            <label class="control-label">
                            Horizontal Schedule
                            </label>
                            <br>
                            <template v-if="user_type != 1 && user_type != 3">
                                <input  
                                    type="checkbox" class="form-check-input"
                                    v-model="internal_svprefs.view_team_members_only" 
                                    @change="updateTeamMembersList"
                                    />&nbsp;
                                <label class="control-label">
                                View team members only
                                </label>
                            </template>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <div class="index-color index-available"></div>
                                <p class="mb-0 pt-1">Available/Gap Between Appointment</p>
                            </div>
                            <div class="d-flex align-items-center gap-2">
                                <div class="index-color index-lunch"></div>
                                <p class="mb-0 pt-1">Lunch/Unavailable</p>
                            </div>
                        </div>
                        <button
                            class="header-toggler round-btn refresh-btn ms-1 transition close-btn-filter"
                            @click="hideFilter"
                            type="button"
                            alt="cross-icon-btn"
                            color="primary"
                        >
                            <Icon icon="tabler:x" :height="24" />
                        </button>
                    </CRow>
                </CCol>
            </CRow>
        <!-- </CContainer> -->
        
        <div class="row w-100 calender-wrap position-relative">
            <div class="position-relative button-float-wrap">
                <span @click="toggleFilter" class="cursor-pointer">
                    <Icon icon="tabler:settings" :height="20" v-if="internal_svprefs.hide_filter"/>
                    <Icon icon="tabler:settings-filled" :height="20" v-else/>
                </span>
            </div>
            <div id="mycalendar" class="col-md-12 px-0"> 
            <MbscEventcalendar
                :clickToCreate="false"
                :dragToCreate="false"
                :dragToMove="true"
                :dragToResize="false"
                :eventDelete="false"
                :view="myMbView"
                :data="myMbEvents"
                :resources="myMbResources"
                :groupBy="scheduleGrouping"
                :invalid="invalidRanges"
                @cell-double-click="handleCellDoubleClick"
                @event-double-click="handleEventDoubleClick"
                @selected-date-change="handleSelectedDateChange"
            >
            <template #resource="resource">
                <span v-html="handleRenderResource(resource)"></span>
            </template>
            </MbscEventcalendar>
            <MbscToast
                :message="toastMessage"
                :isOpen="isToastOpen"
                @close="handleToastClose"
                />
            </div>
        </div>
        <EventEditorModal 
                    :visible="showEditor"
                    @close="onCloseEditor"
                    :event-record="eventRecord"
                    :resourceId="resourceId"
                    :key="schedTabKey" />

        <CModal
            :visible="show_time_range"
            alignment="center"
            @close="closeTimeRangePopup"
            >
            <CModalHeader>
                <CModalTitle>Set calendar view's Time Range</CModalTitle>
            </CModalHeader>
            <CModalBody class="text-center py-4">
                <CContainer>
                    <CRow class="justify-content-evenly">
                        <CCol >
                            <label>
                                From
                                <CFormSelect
                                    :aria-label=from
                                    :options="options"
                                    v-model="from"
                                    >
                                </CFormSelect>
                            </label>
                        </CCol>
                        <CCol>
                            <label>
                                To
                                <CFormSelect
                                    aria-label=:to
                                    :options="endOptions"
                                    v-model="to"
                                    >
                                </CFormSelect>
                            </label>
                        </CCol>
                    </CRow>
                </CContainer>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" @click="closeTimeRangePopup">Close</CButton>
                <CButton color="primary" @click="closeTimeRangePopup">Update</CButton>
            </CModalFooter>
        </CModal>
    </div>
</template>
  


<script setup>
import '@mobiscroll/vue/dist/css/mobiscroll.vue.min.css'
import { ref, onMounted } from 'vue'
import { MbscEventcalendar, setOptions, getJson, MbscToast} from '@mobiscroll/vue' 
setOptions({
  theme: 'ios',
  themeVariant: 'light'
})
</script>

<script>
import '../../../assets/css/common.css';
import moment from 'moment-timezone'
import booking_helper from '../../../helpers/booking_helper';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {DateHelper, ResourceModel} from 'bryntum-scheduler';
import { crono } from 'vue-crono';
//import EventEditor from './EventEditor.vue';
import EventEditorModal from '@/ui_components/booking/EventEditorModal.vue'
import utils_lib from '../../../helpers/utils_lib';     
import { Icon } from '@/common/Icon'
function resource_set(businesscontext, resourceTimeRanges, resource, startdate, enddate) {
     resourceTimeRanges.push(
        { 
            resource      : resource.id,
            start     :  startdate ,
            end       :  enddate ,
        })
}   
import { uniqBy } from 'lodash';
export default {
    name : 'scheduler-tab',
    mixins: [crono],
    emits: ['toggleFilter'],
    components : {
        flatPickr,
      EventEditorModal,
      Icon

    },
    //Crono package is a simpler alternative to handle repeated job. 
    //We could if necessary replace with setInterval and clearInterbal on beforeDestroy
    cron:
     {
        time: 8 * 60 * 1000, //5 mins in millisecs
        method: 'pollForBookingData'
    },

  //SCHEDULER_VIEW_PREFS
    computed:{
        
         viewoptions (){
                    let svp = this.$store.state.scheduler_view_preferences
                    
                    return ({
                            zoommins                : svp.zoommins || 60,
                            skip_unavailable_shading: svp.skip_unavailable_shading || false,
                            horizontal_mode         : svp.horizontal_mode || false,
                            mode                    : svp.mode || 'vertical',
                            auto_height             : svp.auto_height || false,
                            scheduler_height        : svp.scheduler_height || 884,
                            view_team_members_only  : svp.view_team_members_only || false,
                            hide_filter             : svp.hide_filter || false,
                            hide_top_header         : svp.hide_top_header || true
                        })
              
        },  // end view options
        
    }, //end computed
    
    //Watch internal prefs update
    watch: {
                internal_svprefs: {
        handler: function () {   // watch it
                                //console.log('Prop changed: ', newVal, ' | was: ', oldVal)
                                this.save_viewprefs_to_store()
                            },
                    deep: true, //If we want members to be watched.
      },
      select :{
        handler: function (val) {
          this.updateResources(val)
        }
        },
      from : {
        handler: function (val) {
          this.endOptions= this.baseEndOptions.filter((time)=>{
            return val < time;
          })
          this.getEvents(this.startDate, val, this.to)
        }
      },
        to :{
          handler : function (val) {
            this.options = this.baseOptions.filter((time) =>{
              return val > time
            })
            this.getEvents(this.startDate,this.from,val)
          }
      },
      events:{
        handler:function (val) {
          this.$store.state.events=val.length;
        }
                }
    }, //end watch
    data() {
        return {
            myMbView : {
                          calendar: { labels: true }
                     },
            myMbEvents: [],
            toastMessage:  '',
            isToastOpen : false,
            invalidRanges: [],
            scheduleGrouping: 'date',
        show_time_range: false,
        schedapisdkref: null,
        select:[],
            provider_avail: {
                data: new Map(),
                timestamp : 0
            },
            schedTabKey: 0,
            eeditorTabKey: 0,
            mbEvCal: null,
            internal_svprefs: {},
           // mode: 'vertical',
           // autoHeight: false,
            //schedulerheight: 884,
            date_picker_config: {
                altFormat: "F j, Y",
                altInput: true,
                // noCalendar: true,
                // enableTime: true,
                // time_24hr: true
            },
            scrollable: true,
            events     : [],
            resources  : [],
            myMbResources: [],
            lastClickTimeStamp: 0,
            
            
        selected: [],
        options: [...Array(24)].map((e, i) => {
          return (i/2<5 ? '0' : '') + (i) + (':00');
        }),
        endOptions: [...Array(24)].map((e, i) => {
          return (i/2<5 ? '0' : '') + (i) + (':00');
        }),
        baseOptions:[...Array(24)].map((e, i) => {
          return (i/2<5 ? '0' : '') + (i) + (':00');
        }),
        baseEndOptions:[...Array(24)].map((e, i) => {
          return (i/2<5 ? '0' : '') + (i) + (':00');
        }),
        from: '09:00',
        to:'18:00',
            timeRanges : [],
            resourceTimeRanges : [],
            searchDateHistoryMap  : new Map(),
            bookingByDateAvailableMap : new Map(),

            barMargin     : 5,
            startDate     : moment().startOf("day").toDate(),
            // endDate       : new Date(),
            endDate       : moment().add(1,'day').toDate(),
            centerDate    : moment().toDate(), //Current date
            // resourceZones   : new Sch.data.EventStore(),
            selectedEvent : '',
            columns       : [
                {
                    text       : 'Staff',
                    width      : 230,
                    field      : 'name',
                    editor     : false,
                    htmlEncode : false,
                    renderer({ value, grid, record, cellElement }) {
                        const count = record.events.length,
                        image = value ? value.toLowerCase() + '.jpg' : 'none.png';

                        return `
                            <div class="b-resource-info">
                                <!-- <img alt="${value}" src="users/${image}" /> -->
                                <dl>
                                <dt>${value}</dt>
                                <dd class="b-resource-events">${count} event${count !== 1 ? 's' : ''}</dd>
                                </dl>
                            </div>
                        `;
                    }
                }
            ],
             
            eventContextMenu : {
                // Extra items for all events
                defaultItems:{
                    deleteEvent   : false,
                },
                items : [
                    {
                        text : 'Cancel Booking',
                        icon : 'b-fa b-fa-fw b-fa-ban',
                        vueobj: this,
              onItem({eventRecord}) {
                            console.log("Perform cancel operation")
                            console.log(eventRecord);
                            
                            // cancelHandler();
                            let confirmed = confirm("Are you sure to cancel this booking");

                if (confirmed) {
                                let data = {
                                    booking_id:eventRecord.data.id,
                                    service_order_id:eventRecord.data.service_order_id
                                }
                                            
                                //let updated_booking = null;
                                //let is_new = false;
                                this.schedapisdkref.cancelBooking(data).then((result)=>{
                                    console.log("Cancel done... result...");
                                    console.log(result);
                    if (result.status === 1 && eventRecord.eventStore) {
                                        //this.operation_result_message = result.message;
                                        //this.okDoneHandler()
                                        let s = eventRecord.eventStore.remove(eventRecord,true)
                                        console.log("asdasdaasdkkkkasd s");
                                        console.log(s);
                                    }
                                }).catch(ex=>{
                                        let mess ="";
                                        console.log("Error ==== in cancel");
                    if (ex.data && ex.data.message) {
                                            mess = ex.data.message
                    } else {
                                            mess   = ex.message;
                                        }                                        
                                        console.log(mess );
                                    }).finally(() =>{
                                        
                                        //
                                    })
                            }
                        }
                    }
                ] //end items
            },
            viewPreset : {
                base         : 'minuteAndHour'
            },
            tickSize       : 180,
            eventResizeFeature:{
                disabled: true

            },
            eventDragFeature:{
                disabled: false,
                constrainDragToResource :true,
                validatorFn: (data,event) => {
            if (event.type === "mouseup") {
                        let currentDate = moment(new Date()).valueOf();
                        let startDate = moment(data.startDate).valueOf();
              if (startDate < currentDate) {
                         //   return false
                        }
                    }
                }
            },
            
            eventTooltipFeature:{
                disabled: false,
                template : (data) => {
            let v = `
                    <dl>
                        <dt>Guest:</dt>
                        <dd>
                            ${data.eventRecord.name}
                        </dd>
                        <dt>Time:</dt>
                        <dd>
                            ${DateHelper.format(data.eventRecord.startDate, 'H:mm')} - ${DateHelper.format(data.eventRecord.endDate, 'H:mm A')}   
                            ${data.eventRecord.get('service_time_mins') ? ` - ${data.eventRecord.service_time_mins} mins` : ''}
                        </dd>
                        ${data.eventRecord.get('note') ? `<dt>Note:</dt><dd>${data.eventRecord.note}</dd>` : ''}
                        ${data.eventRecord.get('image') ? `<dt>Image:</dt><dd><img class="image" src="${data.eventRecord.get('image')}"/></dd>` : ''}
                    </dl>`;
                        return v;
                    }
            
            },
            enableResourceTimeRangesFeature: true,
            eventEditFeature: {
                disabled: false,
            },
            timeRangesFeature: {
                showCurrentTimeLine : true,
            },
            eventRenderer : ({ eventRecord }) => {
                return `
                    <div class="info">
                        <div class="name">${eventRecord.name}</div>
                        <div class="desc">${eventRecord.desc}</div>
                    </div>
                    `;
            },
            showEditor  : false,
            eventRecord : null,
            eventStore  : null,
            schedInst   : null,
            resourceId  : null,
            listeners   : {
                    beforeeventedit : this.beforeEventEditHandler
            },
            user_type: this.$store.state.user_data.type,
            user_id: this.$store.state.user_data._id
        };
    },

    methods : {
        toggleTopHeader() {
            this.internal_svprefs.hide_top_header = !(this.internal_svprefs.hide_top_header || false);
        },
        toggleFilter() {
            this.internal_svprefs.hide_filter = !(this.internal_svprefs.hide_filter || false);
            this.$emit('toggleFilter', !(this.internal_svprefs.hide_filter));
        },
        hideFilter() {
            this.internal_svprefs.hide_filter = true;
            this.$emit('toggleFilter', !(this.internal_svprefs.hide_filter));
        },
        showFilter() {
            this.internal_svprefs.hide_filter = false;
        },
        updateTeamMembersList() {
            this.save_viewprefs_to_store();
            this.getData();
        },
     handleCellDoubleClick (event, inst)
     {
        let thisTimeStamp = +new Date()
        //console.log(event.date.getTime())
        //console.log("===s=s=s==s=s=s=")
        //console.log(inst)
        //console.log(event)
        if (event && event.domEvent && event.domEvent.detail == 1)
        {
           return // event.detail == 1 means single click, 2 = double click
           //cell-double click is not firing to using single click to distingish
           //single vs. double
        }
        this.AddBookingButtonAction(event.date.getTime(), event.resource)
    },
    handleEventDoubleClick(event, inst) {
                        this.beforeEventEditHandler(event, inst)
    },
    handleEventUpdate (event, inst) 
    {
        let that = this
        console.log("===s=s=sEV UP==s=s=s=")
        console.log(inst)
        console.log(event)
        
        let newdate =  moment(event.event.start.getTime()).format("YYYY-MM-DD HH:mm a") 
        let res = confirm("Allow reschedule to " +newdate)
        if (res === true)
        {
            let data = 
                {
                    //_id:event.event.starta.id,
                    service_order_id:event.event.service_order_id,
                    new_service_start_timestamp: event.event.start.getTime()
                }
                
            if (event.event.resource !== event.oldEvent.resource) 
            {
                data.new_service_provider_id = event.event.resource 
            }                       
            that.schedapisdkref.rescheduleBooking(data).then((result)=>{
                        // console.log(result)
                        //context.finalize(true);
                    if (result.status === 1) {

                    } else 
                    {
                                
                    }
                        
            }).catch(() => {
                        
                    })
        }
        return res;
    },
    
    
    async handleSelectedDateChange(event, inst) 
    {
        let that = this
        if (!event || !event.date)
        {
            return;
        }
        that.getResourceTimeRanges(event.date.getTime());
        that.onStartDatePickerInput(event.date)
        await that.getNonBookingEvents(event.date)
    },
    handleEventDoubleClick(event, inst) 
    {
        let that = this
        that.beforeEventEditHandler(event, inst)
    },




     handleRenderDay(args)
     {
        //console.log("AASDK:LASKD:SAKD args ", args)
        let date = args.date;
        let formatDate = utils_lib.getFormattedDate; 
        return '<div class="header-template-container">' +
            '<div class="header-template-date">' +
            '<div class="header-template-day-name">'+ formatDate(date, 'DDDD') + '</div>' +
            '<div class="header-template-day"' + formatDate(date, 'MMMM DD') + '</div>' +
            '</div>';
     },
     handleRenderResource(resource)
     {
         
        if (this.resources.length !== 0) {
            return '<div class="header-resource-content" style="padding: -8px;">' +
            '<img class="header-resource-avatar" style="max-width: 40px;max-height: 40px" src="' + resource.img + '"/>' +
            '<div class="header-resource-name">' + resource.name + '</div>' +
            '</div>';
        }
     },
     handleEventClick(args) {
  this.toastMessage = args.event.title
  this.isToastOpen = true
},

 handleToastClose() {
    this.isToastOpen = false
},



        AddBookingButtonAction(startdateMs =0, resourceId = ''){
            // this.eventRecord.startdate = this.startDate;
            // this.showEditor = true;
            // me.startDate = moment(eventRecord.data.service_start_date).format("YYYY-MM-DD"),
            //                       me.startTime = moment(eventRecord.data.service_start_date).format("HH:mm"),
            
            console.log("ADD ACtion ==s=s=s" + resourceId)
            Object.assign(this, {
                    eventStore  : {},
                    resourceId  : resourceId,
                    eventRecord : {data:{}, _startDateMS: startdateMs},
                    showEditor  : true,
                    eeditorTabKey: moment().utc().valueOf()
                });
               
        },
        openFullscreen() {
            let elem = this.$refs.schedular_div;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
        },
        forceSchedRerender() {
            this.schedTabKey += 1;
        },
        openTimeRangePopup()
        {
            console.log("Asdsadsad 0a0s0d open")
            this.show_time_range = true;
        },
        closeTimeRangePopup()
        {
            this.show_time_range = false;
            this.$emit('modal:close');
        },
        getDefaultViewObj(start='09:00', end='22:00')
        {
            let scheduleView = 'day';

            if(this.internal_svprefs && this.internal_svprefs.mode == 'horizontal')
            {
                return {
                    timeline: {  //This is horizontal view
                            type: scheduleView,
                            startTime: start,
                            endTime:  end,
                            timeCellStep: 30,
                            timeLabelStep: 30,
                            }
                }
            }
             //Vertical
            return {
                    schedule: { 
                            type: scheduleView,
                            allDay: false,
                            startTime: start,
                            endTime:  end,
                            timeCellStep: 30,
                            timeLabelStep: 30,
                            }
                }
             
        },
      updateResources(select) {
       if(select.length ===0 ){
         select = this.resources;
       }
       this.myMbResources = this.resources.filter((object) => {
            return select.indexOf(object) !== -1
          })
        
      },
      refreshResources()
      {
        this.myMbResources = this.resources

      },
       refreshStartEnd(start,end)
      {
        if (start && end)
        {
            let v = this.getDefaultViewObj(start,end);
            //v.startTime = start;
            //v.endTime = end;
            //console.log("asdalskdksjd99sd", v)
            this.myMbView = v;
            //this.mbEvCal.renderDay()
        }
        //console.log("Referesh start end " , start , end)
        

      },
        pollForBookingData(){
               // this.bookingDataPoll = setTimeout(() => {
                                    console.log("TMBooking Data Poll exec......")
                                    this.getData();
                                    //if (this.$refs.scheduler.schedulerInstance != null)
                                    //{
                                       //  console.log("calling again........")
                                       // this.pollForBookingData();
                                    //}
                 //               }, 20000)
        },
        getData() {
            // AjaxHelper.get('./data/data.json', { parseJson : true }).then(response => {
                // Response has { resources, events, timeRanges }, can be applied directly
                //Object.assign(this, require('./data/data.json'));
            // });
            //return;
            let userListPromise = null;

            if (this.internal_svprefs.view_team_members_only && this.user_type != 1 && this.user_type != 3) {
                userListPromise = this.$schedsdk.get_colleagues({ user_id: this.user_id });
            } else {
                userListPromise = this.$schedsdk.get_users_list({});
            }

            userListPromise.then((result)=>{
                let resources = [];
                for(let i=0;i<result.data.length;i++)
                {
                    if (result.data[i].provider_show_in_internal_calendar === false) 
                    {
                        continue;
                    }
                    resources.push({
                        "id"   : result.data[i]._id,
                        "name" : result.data[i].first_name + ' ' + result.data[i].last_name,
                        "role" : "Provider",
                        "available": true,
                        "img": result.data[i].profile_pic ||'https://img.mobiscroll.com/demos/m2.png',
                    })
                }
                this.resources = resources;
                this.refreshResources();
                this.resources.forEach((a) => {
                        this.selected.push(a)
                })
            }).finally( () =>{
                this.getEvents(this.startDate);
                //
            });
            
            
        },
        async getNonBookingEvents(date) {
            let timezone = this.$store.state.business_settings.business_time_zone;
            let business_context = {business_settings: this.$store.state.business_settings};
            let data = {
                start_date: date.getTime()
            }

            let that = this;
            let events = [];
            let mbevents = [];
            const result = await this.schedapisdkref.getNonBookingProviderOccupancyList(data);
            
            if (result.status === 1) {
                for (let i = 0; i < result.data.length; i++) {
                    if (result.data[i].type) {
                        let v = booking_helper.provider_occupied_record_to_mobiscroll(business_context,result.data[i])
                        events.push(v.id)
                        mbevents.push(v)
                    }
                }
            }
            this.myMbEvents = uniqBy(this.myMbEvents.concat(mbevents), 'id')

        },
      getEvents(date,start,end) {
            this.refreshStartEnd(start,end)
            let current_date = moment(new Date()).valueOf();;
            let debug_print = false;
            if (date == null || date==0)
            {
                date = current_date
            }
            let timezone = this.$store.state.business_settings.business_time_zone;
            let business_context = {business_settings: this.$store.state.business_settings};
            let n_days = 7;
            let search_day_moment = moment.tz(date, timezone).startOf('day');
            
            let search_day = search_day_moment.valueOf();
            let start_day = moment.tz(date, timezone).startOf('day').subtract(n_days, 'days').valueOf();
            let end_day = moment.tz(date, timezone).startOf('day').add(n_days, 'days').valueOf();
            
            let srchistData = this.searchDateHistoryMap.get(moment.tz(date, timezone).startOf('day').valueOf());
            
            if(debug_print)
            {
                console.log("Get for date: ", date, start_day, end_day, current_date)
                console.log("History result for: ",  start_day, srchistData)
                console.log("start day for: ",   search_day_moment.format("YYYY-MM-DD HH:mm"), srchistData)
            }
            if (srchistData == null)
            {
               this.searchDateHistoryMap.set(search_day, {search_date: search_day, range_begin_date: start_day, range_end_date:end_day ,result_count: 0, request_timestamp: 0}) 
            }
            else
            {
                //check if we need to request.
                let diff_ms = current_date - srchistData.request_timestamp 
                if(debug_print)
                {
                    console.log("srchistData  DIFF MS ", diff_ms)
                }
                
                if (srchistData.result_count == 0 && 
                    diff_ms<10000 )
                {
                    if(debug_print)
                    {
                        console.log("srchistData  DIFF MS RETURNING early ", diff_ms)
                    }
                    
                    //returning early since it s only less than 10 seconds from last network query
                    return;
                }

                if(this.bookingByDateAvailableMap.get(search_day) != null)
                {
                    if(debug_print)
                    {
                        console.log("srchistData Already available RETURNING early ", search_day)
                    }
                    //Already in event DB
                    return;
                }

            }
           
           let that = this;
         
           this.schedapisdkref.getBookingList({begin_booking_date:start_day, end_booking_date:end_day}).then(async (result)=>{
                let events = [];
                let mbevents = [];
                let earliest_event_date = 99999999990000;
                let latest_event_date = 0;
            
            for (let i = 0; i < result.data.length; i++) 
            {
                if (result.data[i].type >= 3 && result.data[i].type <= 7) 
                {
                        events.push(booking_helper.booking_to_bryn_event_record(business_context,result.data[i] ))
                        mbevents.push(booking_helper.booking_to_mobiscroll_event_record(business_context,result.data[i] ))
                        if(result.data[i].service_start_date < earliest_event_date)
                        {
                            earliest_event_date = result.data[i].service_start_date    
                        }
                        if(result.data[i].service_start_date > latest_event_date)
                        {
                            latest_event_date = result.data[i].service_start_date    
                        }
                }
                    
            } //end for


            this.searchDateHistoryMap.set(search_day, {search_date: search_day, range_begin_date: start_day, range_end_date:end_day ,result_count: result.data.length, request_timestamp: moment.utc().valueOf()})

            let startDateMoment =   moment.tz(earliest_event_date, timezone).startOf('day') 
            
            //.startOf('day').add(1, 'day');
            let endDateMoment =   moment.tz(latest_event_date,timezone).startOf('day')
            
            if(debug_print)
            {
                console.log("startDateMoment *** *** ", startDateMoment.valueOf(),startDateMoment.format("YYYY-MM-DD HH:mm"))
                console.log("endDateMoment *** *** ", endDateMoment.valueOf(),endDateMoment.format("YYYY-MM-DD HH:mm"))
            }
            //.startOf('day').subtract(1, 'day');
            let counter = 0;
            try
            {
                while(startDateMoment.valueOf() <= endDateMoment.valueOf())
                {
                    
                    if(debug_print)
                    {
                        console.log("SET DATE Available for DATE ", startDateMoment.valueOf(),startDateMoment.format("YYYY-MM-DD HH:mm"))    
                    }                       
                    this.bookingByDateAvailableMap.set(startDateMoment.valueOf(), 1);
                    startDateMoment = startDateMoment.add(1, 'day');
                    //console.log("updated startMoment *** *** ", startDateMoment.valueOf(),startDateMoment.format("YYYY-MM-DD HH:mm"))
        
                    counter++;
                }
                this.bookingByDateAvailableMap.set(endDateMoment.valueOf(), 1);
            }
            catch(ex)
            {
                console.log("exasdlkjasdj-3- ", ex)
            } 
                that.events = events;
                
                this.myMbEvents = mbevents;
                
                //console.log("asdassd00s0d");
               // console.log( that.mbevents);
               
               //that.mbEvCal.setEvents( this.mbevents);
               
                //console.log("asdasdsasSETSKSKSK----" +  date.getTime())
                this.checkandSetResourceTimeRanges(date.getTime())
                //this.mbEvCal.setOptions( {invalid:  that.resourceTimeRanges});
                //console.log("asdasdsasSET")
                //console.log(that.resourceTimeRanges)
                
                await that.getNonBookingEvents(date);
               
            })
            
        },
        process_availability(result,
                            resource_obj, 
                            business_context, 
                            startDay, 
                            endDay,
                           resourceTimeRanges) {
        if (result && result.dates) {
                let selected_array = [];
          for (let i = 0; i < result.dates.length; i++) {
                    if(result.dates[i].day_start_time >= startDay && 
              result.dates[i].day_end_time <= endDay) {
                        selected_array.push(result.dates[i]);
                    }
                }
                selected_array.sort((a,b)=>{
                    return a.day_start_time-b.day_start_time
                })
          for (let a = 0; a < selected_array.length; a++) {
                    let startdate  = 0;
                    let enddate = 0;
                 
            if (a === 0 && selected_array[a].day_start_time !== startDay) {
                        startdate = startDay;
                        enddate   = selected_array[a].day_start_time;
                        resource_set(business_context, 
                                resourceTimeRanges, 
                                resource_obj, 
                                startdate, 
                                enddate );
                    }
            if (a > 0 && selected_array[a - 1].day_end_time !== selected_array[a].day_start_time) {
                        startdate = selected_array[a-1].day_end_time;
                        enddate   = selected_array[a].day_start_time;                   
                        resource_set(business_context, 
                                resourceTimeRanges, 
                                resource_obj, 
                                startdate, 
                                enddate );
                    
                    }
            if (a === selected_array.length - 1 && selected_array[a].day_end_time !== endDay) {
                        startdate = selected_array[a].day_end_time;
                        enddate   = endDay;
                        resource_set(business_context, 
                                resourceTimeRanges, 
                                resource_obj, 
                                startdate, 
                                enddate );
                        
                    }
                    
                } //end for
          if (selected_array.length === 0) {
                    //Nothing was selected for today, assume its closed.
                    let startdate = startDay;
                    let enddate   = endDay;
                    resource_set(business_context, 
                        resourceTimeRanges, 
                        resource_obj, 
                        startdate, 
                        enddate ); 
                
                }
               
            } //If dates are valid
        else {
               
                let startdate = startDay;
                let enddate   = endDay;
                resource_set(business_context, 
                            resourceTimeRanges, 
                            resource_obj, 
                            startdate, 
                            enddate ); 
                
            }
            
        },
      getResourceTimeRanges(date) {
            let resourceTimeRanges = [];
            let timezone         = this.$store.state.business_settings.business_time_zone;
            let business_context = {business_settings: this.$store.state.business_settings};
            let startDay         = moment.tz(date,timezone).startOf('day').valueOf();
            let endDay           = moment.tz(date,timezone).endOf('day').valueOf();
            let promise_array = [];
            let key_array = [];
            
            let me = this
        for (let j = 0; j < me.resources.length; j++) {
                let resource_obj =me.resources[j] 
                let qdata = {
                        user_id: resource_obj.id,
                        date   : moment.tz(date,timezone).valueOf()
                    };
                let key = qdata.user_id + "_" + date;
                //console.log(me.provider_avail.data)
                let getfromlocal = me.provider_avail.data.get(key);
          if (getfromlocal == null) {

                    key_array.push(key);
                    //console.log("REMOTE GET FOR  " + key)
                    let prom = this.schedapisdkref.get_availability(qdata)
              .then((result) => {
                                let lclResourceTimeRanges = []
                                me.process_availability(
                                                result,
                                                resource_obj, 
                                                business_context, 
                                                startDay, 
                                                endDay,
                                                lclResourceTimeRanges)
                                //console.log(lclResourceTimeRanges)
                          
                                return lclResourceTimeRanges;
              }).catch(() => {
                        
                                
                            let lclResourceTimeRanges = []
                            //Need to process as full day non avail since 404 would come
                             me.process_availability(
                                                null,
                                                resource_obj, 
                                                business_context, 
                                                startDay, 
                                                endDay,
                                                lclResourceTimeRanges)
                            return lclResourceTimeRanges;
                        })

                        promise_array.push(prom);


                } //rnf ig
          else {
                    //console.log("Asdasdas LOCAL")
                    //got locally
                    resourceTimeRanges = resourceTimeRanges.concat(getfromlocal);
                }


            }
        if (promise_array.length) {
                Promise.all(promise_array).then((values) => {
                    //console.log("asdasdsadREMOTE")
                    //console.log(values);
                    
            for (let i = 0; i < values.length; i++) {
                       // console.log("Asdasd " + key_array[i]);
                        //console.log("SET / SAVE remote in local  " + key_array[i])
                        me.provider_avail.data.set(key_array[i], values[i]);
                        resourceTimeRanges= resourceTimeRanges.concat(values[i])
                    }
                    me.resourceTimeRanges = resourceTimeRanges;
                    //console.log(resourceTimeRanges)
                    //me.mbEvCal.setOptions( {invalid:  me.resourceTimeRanges});
                    me.invalidRanges = me.resourceTimeRanges
                });
        } else {
                    //console.log("asdasdsadLOCALLL")
                    //console.log(resourceTimeRanges);
                    me.resourceTimeRanges = resourceTimeRanges;
                    //me.mbEvCal.setOptions( {invalid:  me.resourceTimeRanges});
                    me.invalidRanges = me.resourceTimeRanges
            }
            
            
        },
        cancelHandler() {
            this.$refs.eventEditor.cancelHandler();
        },
        addEvent() {
          //  this.$refs.scheduler.addEvent();
        },
        removeEvent() {
            //this.$refs.scheduler.removeEvent();
            this.selectedEvent = '';
        },
        onBeforeSave(){
            console.log("Save new booking feature ")
        },
        onStartDatePickerInput(value) {
            const startDate = Date();//this.$refs.scheduler.schedulerInstance.startDate;
            value = DateHelper.parse(value, 'YYYY-MM-DD');
            //console.log("Asdasdas0s0a0sd onStartDatePickerInput: ", value)
         
            let H = value.getHours();
            let M = value.getMinutes();
            let S = value.getSeconds();
            let newStart = new Date(
                value.getFullYear(),
                value.getMonth(),
                value.getDate(),
                // apply start/end time from previous date value
                H,
                M,
                S
            );
            /*this.$refs.scheduler.schedulerInstance.startDate = */
            this.getEvents(newStart);
            this.getResourceTimeRanges(newStart);
            
        },

        // onEndDatePickerInput(value) {
        //     const startDate = this.$refs.scheduler.schedulerInstance.startDate;
        //     value = DateHelper.parse(value, 'Y-m-d');
        //     this.$refs.scheduler.schedulerInstance.endDate = value;
        // },
    //    onBeforeEventEdit : this.beforeEventEditHandler,
        onEventSelectionChange({ selection }) {
            if (selection.length) {
                this.selectedEvent = selection[0].name;
        } else {
                this.selectedEvent = '';
            }
        },

         beforeEventEditHandler(event, schedInst = null) {
                console.log("-s-df-sd-f in openEfiti");
                console.log(event)
                if (!event.event.editable) {
                    return false;
                }
                let eventRecord = {data:  event.event, id:event.event.id}
                eventRecord.resourceId = eventRecord.data.resource;
                let resourceRecord = {id: event.event.resource}
                let source = {eventStore: null, schedInst:schedInst}
                this.openEditor({source, resourceRecord, eventRecord});
                
                return false;
            },
            
        openEditor({source, resourceRecord, eventRecord}) {
            console.log(" open editor source.eventStore --- ")
            console.log( source.eventStore);    
            console.log( eventRecord);    
                Object.assign(this, {
                    eventStore  : source.eventStore,
                    schedInst   : source.schedInst,
                    resourceId  : resourceRecord.id,
                    eventRecord : eventRecord,
                    showEditor  : true,
                    eeditorTabKey: moment().utc().valueOf()
                });
            },

        onCloseEditor() {
               this.showEditor=false;
               this.getData() 
            },
      setViewZoomMins(event) {
            let value = event.target.value;
            this.internal_svprefs.zoommins = value;
          
            let zoomLevel = 17;
        if (value === 5) {
                zoomLevel =19
            }
        if (value === 15) {
                zoomLevel =18
            }
        if (value === 30) {
                zoomLevel =17
            }
        if (value === 45) {
                zoomLevel =16
            }
        if (value === 60) {
                zoomLevel =15
            }
          //  this.$refs.scheduler.schedulerInstance.zoomLevel=zoomLevel;
            
        },
        //Switch scheduler view is not used here but used at parent because
        //Scheduler redraw does not keep various listeners etc.
        //It isn't supported at scheduler level.
        //So we reinit component at parent.
      async switch_scheduler_view_mode(e) {
            //Since the mode is horizontal_mode, its already changed.
            
           await this.do_switch_scheduler_view_mode(this.internal_svprefs.horizontal_mode )
           this.save_viewprefs_to_store()
                //Do a full refresh as there is an error in scheduler
            console.log("asdasdasd full refresh")
            this.forceSchedRerender()
            //Have no choice but to reload as listeners need to reload
            //this.$router.go();
        }, 
        
      save_viewprefs_to_store() {
               this.$store.commit('SET_SCHEDULER_VIEW_PREFS', this.internal_svprefs);
        },
        
         async do_switch_scheduler_view_mode(is_horizontal)
        {
            
            if (is_horizontal)
            {
                this.internal_svprefs.mode = 'horizontal';
                this.internal_svprefs.auto_height= true;
                this.internal_svprefs.scheduler_height=null
                
            }
            else
            {
                this.internal_svprefs.mode = 'vertical';
                this.internal_svprefs.auto_height= false;
                this.internal_svprefs.scheduler_height=484
            }
            let v = this.getDefaultViewObj(this.from, this.to);
            this.myMbView = v;
        },
      checkandSetResourceTimeRanges(date = null) {
            //console.log('asdasdasd=== ' + this.internal_svprefs.skip_unavailable_shading)
        if (date == null || date === 0) {
                date = moment().utc().valueOf()
            }
        if (this.internal_svprefs.skip_unavailable_shading === true) {
                this.resourceTimeRanges = [];
                this.enableResourceTimeRangesFeature = false;
        } else {
                this.enableResourceTimeRangesFeature = true;
                this.getResourceTimeRanges(date);
            }
           // if(this.$refs.scheduler.schedulerInstance) 
            {
              //  this.$refs.scheduler.schedulerInstance.refresh();
            }
         
        },
      redounavailableshading(e) {

        this.internal_svprefs.skip_unavailable_shading = !!e.target.checked;
            this.checkandSetResourceTimeRanges(null)
            
        },

     
    },
    beforeUnmount () {
       
    },
    created() {
          this.schedapisdkref = this.$schedsdk
          
        console.log("Created....  DASHSCHED TABE V2")
        this.internal_svprefs = this.viewoptions;
        let that = this
        this.getData();

    },
     
    mounted() {
            //In our case after zooming we should not change view of time span 
            //otherwise its confusing.bryntum.query('scheduler').zoomLevel=19
            let that = this
            this.scheduleGrouping = 'date';

            this.myMbView = that.getDefaultViewObj(),
            this.myMbResources = this.resources;
                
  }//end mounted

};

</script>
<style>
.mbsc-calendar .mbsc-schedule-invalid {
    background: #bfe2f4
}
.index-color {
    width: 16px;
    height: 16px;
    border-radius: 16px;
    border: 1px solid #e6e6e6;
}
.index-available {
    background: white;
}
.index-lunch {
    background: #bfe2f4;
}
.calender-wrap {
    margin: 0 0 1rem!important;
}
.button-float-wrap {
    z-index: 99;
    width: auto;
    display: inline-flex;
    gap: 4px;
    margin:0 auto;
    top: 22px;
    color: #007aff;
}
#mycalendar {
    top: -18px;
    position: relative;
}
.button-float-wrap button {
    border: 0;
}
.button-float-wrap button {
    margin-right: 3px;
}
.mbsc-ios.mbsc-calendar-controls {
    padding: 8px 2px;
}
.close-btn-filter {
    position: absolute;
    right: 10px;
    top: 10px;
}
.close-btn-filter:hover, .close-btn-filter:focus {
    background: var(--link-color);
    color: #fff;
}
.controls-div {
    padding-top: 40px;
}
.filter-filled-icon {
    fill: #007aff !important;
}
</style>