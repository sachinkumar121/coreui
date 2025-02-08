<template>
<div>
   
    <CRow>
      <CCol sm="12">
                <POEditor
                        ref="eventEditor"
                        v-model   = "showEditor"
                        :eventRecord = "eventRecord"
                        :eventStore  = "eventStore"
                        :resourceId  = "resourceId"
                        :in_customer_id = "customer_id"
                ></POEditor>
      </CCol>
    </CRow>
  </div>
</template>

<script>

import moment from 'moment-timezone'
import 'flatpickr/dist/flatpickr.css';
import flatPickr from 'vue-flatpickr-component';
import { crono } from 'vue-crono';
import POEditor from '../purchase_order/POEditor.vue';
import login_helper from '../../helpers/login_helper';
function sendMessage(msg) {
  'use strict';
  //var msgId = '[iFrameSizerTest]:';

  //document.getElementsByTagName('iframe')[0].contentWindow.postMessage( msgId + msg, '*' );

  //console.log('Sending '+msg);
  document.getElementsByTagName('iframe')[0].iFrameResizer.sendMessage(msg);
}
export default {
    name : 'scheduler-tab',
    mixins: [crono],
    components : {
        flatPickr,
        POEditor
    },
    //Crono package is a simpler alternative to handle repeated job. 
    //We could if necessary replace with setInterval and clearInterbal on beforeDestroy
    /*cron:
     {
        time: 8 * 60 * 1000, //5 mins in millisecs
        method: 'pollForBookingData'
    },*/
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
                    handler: function(newVal, oldVal) 
                            {   // watch it
                                //console.log('Prop changed: ', newVal, ' | was: ', oldVal)
                                this.save_viewprefs_to_store()
                            },
                    deep: true, //If we want members to be watched.
                }
    }, //end watch
    data() {
        return {
            schedTabKey: 0,
            customer_id: null,
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
            timeRanges : [],
            resourceTimeRanges : [],
             
            showEditor  : true,
            eventRecord : null,
            eventStore  : null,
            resourceId  : null,
            listeners   : {
                    beforeeventedit : this.beforeEventEditHandler
            }
            
        };
    },

    methods : {
        AddBookingButtonAction(){
            // this.eventRecord.startdate = this.startDate;
            // this.showEditor = true;
            // me.startDate = moment(eventRecord.data.service_start_date).format("YYYY-MM-DD"),
            //                       me.startTime = moment(eventRecord.data.service_start_date).format("HH:mm"),
            console.log(moment().add(10,'minutes').format("YYYY-MM-DD"))
            Object.assign(this, {
                    eventStore  : {},
                    resourceId  : '',
                    eventRecord : {data:{startDate:moment().add(10,'minutes').format("YYYY-MM-DD")}},
                    showEditor  : true
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

        pollForBookingData(){
               // this.bookingDataPoll = setTimeout(() => {
                                    //console.log("TMBooking Data Poll exec......")
                                    //this.getData();
                                    //if (this.$refs.scheduler.schedulerInstance != null)
                                    {
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
                   
        },
        getEvents(date){
            let timezone = this.$store.state.business_settings.business_time_zone;
            let business_context = {business_settings: this.$store.state.business_settings};
           // let start_day = moment.tz(date, timezone).valueOf();
            this.$schedsdk.getBookingList({page_no:1}).then((result)=>{
                let events = [];
                for(let i=0;i<result.data.length;i++)
                {
                    if (result.data[i].type>=3 && result.data[i].type<=7)
                    {
                      //  events.push(booking_helper.booking_to_bryn_event_record(business_context,result.data[i] ))
                    }
                    
                }
                this.events = events;
                
                if (this.$refs.scheduler && this.$refs.scheduler.schedulerInstance)
                {
                  //this.$refs.scheduler.schedulerInstance.scrollToNow({block: 'center'})
                }
                else
                {
                    console.log("======== No scheduler Instance")
                }
            })
            
        },

        getResourceTimeRanges(date)
        {
            if (this.enableResourceTimeRangesFeature == false)
            {
                return;
            }
            let resourceTimeRanges = [];
            let timezone         = this.$store.state.business_settings.business_time_zone;
            let business_context = {business_settings: this.$store.state.business_settings};
            let startDay         = moment.tz(date,timezone).startOf('day').valueOf();
            let endDay           = moment.tz(date,timezone).endOf('day').valueOf();
            for(let j=0;j<this.resources.length;j++)
            {
              
            }
            this.resourceTimeRanges = resourceTimeRanges;
            
        },
        cancelHandler() {
            this.$refs.eventEditor.cancelHandler();
        },
        addEvent() {
            this.$refs.scheduler.addEvent();
        },
        removeEvent() {
            this.$refs.scheduler.removeEvent();
            this.selectedEvent = '';
        },
        onBeforeSave(){
            console.log("Save new booking feature ")
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
            }
            else {
                this.selectedEvent = '';
            }
        },

         beforeEventEditHandler(event) {
                console.log("-s-df-sd-f in openEfiti");
                console.log(event)
                this.openEditor(event);
                
                return false;
            },
            
        openEditor({source, resourceRecord, eventRecord}) {
            console.log(" open editor source.eventStore --- ")
            console.log( source.eventStore);    
            console.log( eventRecord);    
                Object.assign(this, {
                    eventStore  : source.eventStore,
                    resourceId  : resourceRecord.id,
                    eventRecord : eventRecord,
                    showEditor  : true
                });
            },

        onCloseEditor() {
                //console.log("EDIROR CLOSESDASDASD");
               // if(this.$refs.scheduler.schedulerInstance) 
                {
                 // /  this.$refs.scheduler.schedulerInstance.refresh();
                }
            },
        setViewZoomMins(event) 
        {
            let value = event.target.value;
            this.internal_svprefs.zoommins = value;
          
            let zoomLevel = 17;
            if (value == 5)
            {
                zoomLevel =19
            }
            if (value == 15)
            {
                zoomLevel =18
            }
            if (value == 30)
            {
                zoomLevel =17
            }
            if (value == 45)
            {
                zoomLevel =16
            }
            if (value == 60)
            {
                zoomLevel =15
            }
            //this.$refs.scheduler.schedulerInstance.zoomLevel=zoomLevel;
            
        },
        //Switch scheduler view is not used here but used at parent because
        //Scheduler redraw does not keep various listeners etc.
        //It isn't supported at scheduler level.
        //So we reinit component at parent.
        async switch_scheduler_view_mode(e)
        {
            //Since the mode is horizontal_mode, its already changed.
            //this.internal_svprefs.horizontal_mode = e.target.checked? true: false;
        //    await this.do_switch_scheduler_view_mode(this.internal_svprefs.horizontal_mode )
                //Do a full refresh as there is an error in scheduler
            console.log("asdasdasd full refresh")
            //this.forceSchedRerender()
            //Have no choice but to reload as listeners need to reload
           //this.$router.go();
        }, 
        
        save_viewprefs_to_store()
        {
               this.$store.commit('SET_SCHEDULER_VIEW_PREFS', this.internal_svprefs);
        },
        checkandSetResourceTimeRanges()
        {
            if (this.internal_svprefs.skip_unavailable_shading == true)
            {
                this.resourceTimeRanges = [];
                this.enableResourceTimeRangesFeature = false;
            }
            else
            {
                this.enableResourceTimeRangesFeature = true;
                //this.getResourceTimeRanges(this.$refs.scheduler.schedulerInstance.startDate);
            }
            //if(this.$refs.scheduler.schedulerInstance) 
            {
           //     this.$refs.scheduler.schedulerInstance.refresh();
            }
         
        },
        redounavailableshading(e)
        {

            this.internal_svprefs.skip_unavailable_shading = e.target.checked? true: false;
            this.checkandSetResourceTimeRanges()
            
        },

     
    },
    beforeUnmount () {
       
    },
    created() {
        this.internal_svprefs = this.viewoptions;
        this.customer_id =  this.$route.params.customer_id;
        this.getData();
        
        
    },
    
    mounted() {
            //In our case after zooming we should not change view of time span 
            //otherwise its confusing.bryntum.query('scheduler').zoomLevel=19
         
            //this.$refs.scheduler.schedulerInstance.zoomKeepsOriginalTimespan = true;
        
            
  }

};

</script>