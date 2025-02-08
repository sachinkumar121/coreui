<template>
    <div >
        <!-- <vuestic-date-picker
            
            :value="startDate"
            @input="onStartDatePickerInput"
        >
        </vuestic-date-picker> -->

        <!--<vuestic-date-picker ref="endDatePicker" :value="endDate" @input="onEndDatePickerInput"></vuestic-date-picker>-->
    <div>
      <CContainer>
      <CRow class="justify-content-evenly">
        <CCol xs="6">
          <label> Choose Providers</label>
            <v-select multiple :options="resources" v-model="select" label="name" />
        </CCol>
        <CCol xs="2">
          <label> From
            <CFormSelect
              :aria-label=from
              :options="options"
              v-model="from"
            >
            </CFormSelect>
          </label>
        </CCol>
        <CCol xs="2">
          <label> To
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
      </div>
        <br/>
        <div class="row" id="xmycalendar">
        </div>
          <div class="row" id="mycalendar">
        </div>
        <eventEditor
            :eventRecord = eventRecord
            :eventStore  = "eventStore"
            :key="eeditorTabKey"
      :resourceId="resourceId"
      :schedInst="schedInst"
            @close       = "onCloseEditor"
      ref="eventEditor"
      v-model="showEditor"
        ></eventEditor> 
        
    </div>
      
</template>

<script>
import 'mobiscroll/dist/js/mobiscroll.javascript.min.js';
import 'mobiscroll/dist/css/mobiscroll.javascript.min.css';

import moment from 'moment-timezone'
import booking_helper from '../../../helpers/booking_helper';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
  import {DateHelper, ResourceModel} from 'bryntum-scheduler';
import { crono } from 'vue-crono';
// import { ResourceModel, EventModel, DateHelper, Scheduler, Toast, WidgetHelper, MessageDialog } from '../../build/scheduler.module.js?442139';
import EventEditor from './EventEditor.vue';
  //import * as  mobiscroll from '@mobiscroll/javascript';
  //import '@mobiscroll/javascript/dist/css/mobiscroll.min.css';
// import VuesticDatePicker from '../../../vuestic-theme/vuestic-components/vuestic-date-picker/VuesticDatePicker.vue';
class Employee extends ResourceModel {
    static get fields() {
        return [
            // { name : 'available', type : 'boolean', defaultValue : false },
            // { name : 'statusMessage', defaultValue : 'Gone fishing' }
        ];
    }

    get cls() {
        return this.available ? '' : 'unavailable';
    }
}
    
  function resource_set(businesscontext, resourceTimeRanges, resource, startdate, enddate) {
     resourceTimeRanges.push(
        { 
            resource      : resource.id,
            start     :  startdate ,
            end       :  enddate ,
        })
}
export default {
    name : 'scheduler-tab',
    mixins: [crono],
    components : {
        flatPickr,
      EventEditor,

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
                            scheduler_height        : svp.scheduler_height || 884
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
        select:null,
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
            stripeFeature:true,
            // resourceStore:{modelClass : Employee},
            crudManager : {
                autoLoad      : true,
                resourceStore : {
                    modelClass : Employee
                }
            },
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
                                this.vueobj.$schedsdk.cancelBooking(data).then((result)=>{
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
            }
            
        };
    },

    methods : {
        AddBookingButtonAction(startdateMs =0, resourceId = ''){
            // this.eventRecord.startdate = this.startDate;
            // this.showEditor = true;
            // me.startDate = moment(eventRecord.data.service_start_date).format("YYYY-MM-DD"),
            //                       me.startTime = moment(eventRecord.data.service_start_date).format("HH:mm"),
            
            console.log("==s=s=s" + resourceId)
            this.eeditorTabKey =moment().utc().valueOf();
            //console.log(moment().add(10,'minutes').format("YYYY-MM-DD"))
                   this.eventStore  = {},
                    this.resourceId  = resourceId,
                    this.eventRecord = {data:{}, _startDateMS: startdateMs},
                    this.showEditor  = true
               
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
      updateResources(select) {
       if(select.length ===0 ){
         select = this.resources;
       }
        this.mbEvCal.setOptions({
          resources: this.resources.filter((object) => {
            return select.indexOf(object) !== -1
          })
        })
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
            this.$schedsdk.get_users_list({}).then((result)=>{
                let resources = [];
                for(let i=0;i<result.data.length;i++){
            if (result.data[i].provider_show_in_internal_calendar === false) {
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
                
          this.resources.forEach((a) => {
            this.selected.push(a)
          })
            }).finally( () =>{
                this.getEvents(this.startDate);
                //
            });
            
            
        },
      getNonBookingEvents(date) {
           let timezone = this.$store.state.business_settings.business_time_zone;
           let business_context = {business_settings: this.$store.state.business_settings};
           let data = {
               start_date: date.getTime()
           }
                

           let that = this;
           this.$schedsdk.getNonBookingProviderOccupancyList(data).then((result)=>{
                let events = [];
                let mbevents = [];
          if (result.status === 1) {
            for (let i = 0; i < result.data.length; i++) {
                        //console.log("asdasdas")
                        //console.log(result.data[i])
              if (result.data[i].type) {
                            //events.push(booking_helper.booking_to_bryn_event_record(business_context,result.data[i] ))
                            //mbevents.push(booking_helper.booking_to_mobiscroll_event_record(business_context,result.data[i] ))
                            console.log(booking_helper.provider_occupied_record_to_mobiscroll(business_context,result.data[i]))
                            let v = booking_helper.provider_occupied_record_to_mobiscroll(business_context,result.data[i])
                            events.push(v.id)
                            mbevents.push(v)
                        }
                        
                    }
                    that.mbEvCal.removeEvent(events)
                    that.mbEvCal.addEvent( mbevents);
                }
                               
            })
         

        },
      getEvents(date,start,end) {
            let timezone = this.$store.state.business_settings.business_time_zone;
            let business_context = {business_settings: this.$store.state.business_settings};
           // let start_day = moment.tz(date, timezone).valueOf();
           let that = this;
           this.$schedsdk.getBookingList({page_no:1}).then((result)=>{
                let events = [];
                let mbevents = [];
          for (let i = 0; i < result.data.length; i++) {
            if (result.data[i].type >= 3 && result.data[i].type <= 7) {
                        events.push(booking_helper.booking_to_bryn_event_record(business_context,result.data[i] ))
                        mbevents.push(booking_helper.booking_to_mobiscroll_event_record(business_context,result.data[i] ))
                    }
                    
                }
                that.events = events;
                
                this.mbevents = mbevents;
                
                //console.log("asdassd00s0d");
               // console.log( that.mbevents);
               console.log("Asdasd ", mobiscroll)
                let scheduleView = 'day';
                let scheduleGrouping = 'date';
                that.mbEvCal = mobiscroll.eventcalendar('#mycalendar', 
                {
                    view: {
                         schedule: { 
                                    type: scheduleView,
                                    allDay: false,
                  startTime: start || '09:00',
                  endTime: end || '18:00',
                                    timeCellStep: 30,
                                    timeLabelStep: 30,
                                     }
                           },
                    dragToMove: true,
                    groupBy: scheduleGrouping,
                    resources: that.resources,
              renderDay: function (args) {
                let date = args.date;
                let formatDate = mobiscroll.util.datetime.formatDate;
                return '<div class="header-template-container">' +
                  '<div class="header-template-date">' +
                  '<div class="header-template-day-name">' + formatDate('DDDD', date) + '</div>' +
                  '<div class="header-template-day">' + formatDate('MMMM DD', date) + '</div>' +
                  '</div>';
              },
              renderResource: function (resource) {
                if (this.resources.length !== 0) {
                  return '<div class="header-resource-template-content">' +
                    '<img class="header-resource-avatar" style="max-width: 50px;max-height: 50px" src="' + resource.img + '"/>' +
                    '<div class="header-resource-name">' + resource.name + '</div>' +
                    '</div>';
                }
              },
                    onCellDoubleClick: function (event, inst) {
                        //console.log(event.date.getTime())
                        console.log("===s=s=s==s=s=s=")
                        console.log(inst)
                        console.log(event)
                        that.AddBookingButtonAction(event.date.getTime(), event.resource)
                    },
                     onEventUpdate: function (event, inst) {
                        console.log("===s=s=sEV UP==s=s=s=")
                        console.log(inst)
                        console.log(event)
                        
                        let newdate =  moment(event.event.start.getTime()).format("YYYY-MM-DD HH:mm a") 
                        let res = confirm("Allow reschedule to " +newdate)
                if (res === true) {
                            let data = {
                                    //_id:event.event.starta.id,
                                    service_order_id:event.event.service_order_id,
                                    
                                    new_service_start_timestamp: event.event.start.getTime()
                                }
                                
                  if (event.event.resource !== event.oldEvent.resource) {
                                data.new_service_provider_id = event.event.resource 
                            }                       
                            that.$schedsdk.rescheduleBooking(data).then((result)=>{
                                    // console.log(result)
                                    //context.finalize(true);
                    if (result.status === 1) {

                    } else {
                                          
                                    }
                                    
                  }).catch(() => {
                                   
                                })
                        }
                        return res;
                    },
                     onSelectedDateChange: function (event, inst) {
                         that.getResourceTimeRanges(event.date.getTime());
                         that.getNonBookingEvents(event.date)
                    },
                    onEventDoubleClick: function (event, inst) {
                        that.beforeEventEditHandler(event, inst)
              },
                });
                
            
                that.mbEvCal.setEvents( this.mbevents);
                //console.log("asdasdsasSETSKSKSK----" +  date.getTime())
                this.checkandSetResourceTimeRanges(date.getTime())
                //this.mbEvCal.setOptions( {invalid:  that.resourceTimeRanges});
                //console.log("asdasdsasSET")
                //console.log(that.resourceTimeRanges)
                that.getNonBookingEvents(date);
               
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
                    let prom = this.$schedsdk.get_availability(qdata)
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
                    me.mbEvCal.setOptions( {invalid:  me.resourceTimeRanges});
                });
        } else {
                    //console.log("asdasdsadLOCALLL")
                    //console.log(resourceTimeRanges);
                    me.resourceTimeRanges = resourceTimeRanges;
                    me.mbEvCal.setOptions( {invalid:  me.resourceTimeRanges});
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
            let H = startDate.getHours();
            let M = startDate.getMinutes();
            let S = startDate.getSeconds();
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
            //this.internal_svprefs.horizontal_mode = e.target.checked? true: false;
        //    await this.do_switch_scheduler_view_mode(this.internal_svprefs.horizontal_mode )
                //Do a full refresh as there is an error in scheduler
            console.log("asdasdasd full refresh")
            //this.forceSchedRerender()
            //Have no choice but to reload as listeners need to reload
           //this.$router.go();
        }, 
        
      save_viewprefs_to_store() {
               this.$store.commit('SET_SCHEDULER_VIEW_PREFS', this.internal_svprefs);
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
        //console.log("Created....  DASHSCHED TABE V2", mobiscroll)
        this.internal_svprefs = this.viewoptions;
      // let that = this
        this.getData();
        
    },
    
    mounted() {
            //In our case after zooming we should not change view of time span 
            //otherwise its confusing.bryntum.query('scheduler').zoomLevel=19
         
  
    // init mobiscroll date picker
 //   console.log(mobiscroll) 
  
 
   //end event calendar

   /*     mobiscroll.datepicker('#md-birthday', {
            max: new Date(),
            onSet: (ev, inst) => {
                // set the birthday field manually to update the view
                this.birthday = inst.getVal();
            }
        })*/
  }//end mounted

};

</script>

<style lang="scss" scoped>
  @import 'bryntum-scheduler/scheduler.classic-light.css';

.controls-div {
    float: left;
    width: 100%;
    border: 1px solid #d8dbe0;
    padding: 15px 4px;
    margin: 0 0 1rem 0!important;
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
        border-bottom    : 2px solid #555;
        background-color : #fff;
    }

    .b-grid-header-text-content {
        display         : flex;
        justify-content : center;
    }

    .b-grid-header,
    .b-sch-header-timeaxis-cell {
        background     : #fff;
        color          : #34495e;
        text-transform : uppercase;
        border-right   : none;
    }

    .b-sch-header-timeaxis-cell {
        border-bottom : 1px solid #999;
        align-items   : flex-start;
    }

    .b-sch-header-hours,
    .b-sch-header-minutes {
        line-height : 1em;
    }

    .b-sch-header-minutes {
        font-size : 0.5em;
    }

    .b-responsive-small .b-sch-header-minutes {
        display : none;
    }

    .b-resource-info dl {
        margin : 0;
    }

    .b-grid-vertical-overflow .b-grid-header-scroller:last-child,
    .b-columnlines .b-grid-cell:not(:last-child),
    .b-grid-cell {
        border-right : none;
    }

    .b-grid-row {
        border-bottom : 2px solid #eff4f5;
    }

    .b-grid-cell {
        color : #34495e;
    }

    .b-resource-info dd {
        color : #adb3b9;
    }

    .b-grid-splitter {
        background : transparent;
    }

    .b-sch-style-colored.b-sch-color-blue.b-sch-event:not(.b-sch-event-milestone),
    .b-sch-style-colored.b-sch-color-blue .b-sch-event:not(.b-sch-event-milestone) {
        color : #4ab2e3;
    }

    .b-sch-style-colored.b-sch-color-green.b-sch-event:not(.b-sch-event-milestone),
    .b-sch-style-colored.b-sch-color-green .b-sch-event:not(.b-sch-event-milestone) {
        color : #4ae387;
    }

    .b-sch-style-colored.b-sch-color-red.b-sch-event:not(.b-sch-event-milestone),
    .b-sch-style-colored.b-sch-color-red .b-sch-event:not(.b-sch-event-milestone) {
        color : #e34a4a;
    }


    .b-sch-event-wrap .b-sch-event section {
  flex-direction: column;
}

.b-sch-event-wrap .b-sch-event i.b-fa {
  margin-right: .5em;
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
  background: repeating-linear-gradient(-55deg, rgba(230, 50, 50, 0.7), rgba(230, 50, 50, 0.7) 5px, rgba(240, 50, 50, 0.4) 5px, rgba(240, 50, 50, 0.4) 10px);
}

.b-sch-event.unavailable {
  background-color: red !important;
  opacity: 1;
}

.b-sch-event-header {
  font-size: .8em;
}

.b-sch-event-footer {
  font-weight: 400;
}

.b-sch-tip-invalid .b-sch-tip-message:not(:empty) {
  color: red;
}

.b-sch-tip-invalid .b-sch-tip-message:not(:empty):before {
  margin-right: 0.5em;
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  content: "\F071";
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
  margin: .3em 0 0 0;
  padding: 0 0 0 4px;
}

.b-sch-resourcetimerange.custom {
    background : repeating-linear-gradient(
                    45deg,
                    rgba(255, 255, 255, .2),
                    rgba(255, 255, 255, .2) 10px,
                    rgba(190, 190, 190, .2) 10px,
                    rgba(190, 190, 190, .2) 20px
    ) rgba(255, 255, 255, 0);
    color : #888;
}
  .header-resource-avatar {
    max-height: 50px;
    max-width: 50px;
  }

  .header-resource-name {
    font-size: 14px;
  }


</style>
