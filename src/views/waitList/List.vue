<template>
  <div class="mt-3">
        <message-center-credits />
        <Alerts
        :alertData="alertData"
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <div v-if="waitlist_feature_enabled" class="row justify-content-between controls-div ">
            <div class="settings-text">Search By</div>
                <div class="col-md-6 mb-3 d-flex align-items-start">
                    <label class="control-label"><b>Name</b></label>
                    <input
                    v-model="search"
                    class="form-control placeholder-no-fix"
                    @keyup="searchWaitList()"
                    type="text"
                    />
                </div>
          <div class="col-md-6  d-flex align-items-start">
            <label class="control-label"><b>Phone</b></label>
            <input
              v-model="searchPhone"
              class="form-control placeholder-no-fix"
              @keyup="searchWaitListByPhone()"
              type="text"
            />
          </div>
                <div class="col-md-4 d-flex align-items-end">
                    <input
                        class="btn btn-primary"
                        type="button"
                        value="New Waitlist Request "
                        @click="this.$router.push('/manage_waitlist/add')"
                    />
                </div>
        </div>
        <div v-else class="row justify-content-between controls-div">
                 <div class="col-md-4 d-flex align-items-end">
                    <input
                        class="btn btn-primary"
                        type="button"
                        value="Enable waitlist feature "
                        @click="this.$router.push('/settings/wait_list_settings')"
                    />
                </div>
        </div>
        <br/>
        <div class="col-md-12">
        
        </div>
        <div class="table-responsive">
          <table bordered class="table table-bordered w-100">
            <thead>
                <tr>
                    <th>Customer Info</th>
                    <th>Services</th>
                    <th>Service Providers</th>
                    
                    <th>Preferred Day/Times</th>
                    <th>Wait List Status</th>
                    <th>Matching Slots</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody v-if="this.Wlist.length">
                <tr v-for="(item) in this.Wlist" :key="item._id">
                  <td> <span v-html="getCustomerOrParentName(item)"></span>
                      <br>
                      <small> 
                        
                      <span >ID: {{item.waitlist_order_id}}</span>
                        
                      <span v-if ="item.customer_phone"><br>{{item.customer_phone}}</span>
                      <span v-if ="item.customer_email"><br>{{item.customer_email}}</span>
                      </small>
                      <br>
                      Priority: {{item.priority}}
                    </td>
                    <td>
                      <span v-html="getServiceNames(item)"></span>
                      
                    </td>
                    <td>
                      <span v-html="getProvidersName(item)"></span>
                        </td>
                    
                    <td>
                      {{ getPreferredDaysOfWeek( item.preferred_days_of_week)}}
                      <span><br>{{getPreferredTimes(item.preferred_times)}}</span>

                            </td>
                    <td>
                      <p v-if="!item.canceled_on">{{waitListStatus[item.wait_list_status ]}}
                          <small v-if="item.wait_list_status!=3">
                            <br>  <span>Exp.: </span>
                              <span v-html="getFormattedDate(item.wait_list_expiry_date, 'MMM/DD hh:mm a')"></span>
                          </small>
                      </p>
                      <p v-else>{{waitListStatus[item.wait_list_status ]}}
                          <small>
                            <br>  <span>On: </span>
                              <span v-html="getFormattedDate(item.canceled_on, 'MMM/DD hh:mm a')"></span>
                          </small>
                      </p>
                      <div v-if="item.wait_list_status==3 && item.converted_to_order_id">
                          
                          <CButton color="link"  @click="$router.push('/bookings/detail/'+ item.converted_to_order_id)">{{item.converted_booking_service_order_id}}</CButton></div>
                    
                      
                    </td>
                    <!--Matching Slots -->
                    <td>
                      <table v-if="item.wait_list_status!=3 && item.wait_list_status!=2  &&  item.avail_slots && item.avail_slots.data && item.avail_slots.data.length>0">

                          <tr>
                              <th>Date &amp; Time</th>
                              <th>Provider</th>
                          </tr>
                          <tr  v-for="(avi) in item.avail_slots.data" :key="avi.day_start_time">
                              <td colspan="2">
                                  <button class="btn btn-primary btn-sm" 
                                      @click="convertToBookingWithMatchingSlot(avi,item)">
                                      {{getSlotDisplayString(avi,item)}}</button>
                      
                                      </td>
                              
                          </tr>
                          
                      </table>
                      <p v-else>None yet</p>
                    </td>

                    <td class="action_column">
                      <button class="btn btn-success btn-sm" v-if="!item.canceled_on && item.wait_list_status!=3" 
                                                          @click="this.$router.push('/manage_waitlist/add/'+item._id)">Edit</button>
                      <br>
                      <button class="btn btn-primary btn-sm" v-if="!item.canceled_on && item.wait_list_status!=3" 
                                                                  @click="convertHandler(item._id)">Convert</button>
                      <br>
                      <button class="btn btn-success btn-sm" v-if="!item.canceled_on && item.wait_list_status!=3" 
                                                                  @click="findSlotsHandler(item._id)">Find Slots</button>
                      <br>
                      <button class="btn btn-danger btn-sm" v-if="!item.canceled_on && item.wait_list_status!=3" @click="cancelHandler(item._id)">Cancel</button>
                      
                      <button class="btn btn-warning btn-sm" v-if="!item.canceled_on && item.wait_list_status!=3" 
                                                                  @click="notifyUserOfSlots(item)">Notify</button>
                      
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="8" class="text-center">
                      <div class="py-5">
                        <img src="/img/no-result.svg" alt="" class="img-empty"> 
                        <p class="h5 mt-4 d-block fw-normal">
                          No bookings found for search criteria
                        </p>
                      </div>
                    </td>
                </tr>
            </tbody>
          </table>
        </div>
       
        <Pagination class="mt-2"
            v-if="Wlist.length"
            :size="'sm'"
            :ariaLabel="'Waitlist results pages'"
            :activePage.sync="page"
            :pages="pageCount"
            @update:activePage="setPage"
        />

      <CModal :visible="show_client_notes_modal" @close="closeNotesModal">
            <CModalHeader>
              <CModalTitle>{{client_notes_modal_title}}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div class="row">

                    <div class="col-md-12" >
                            {{client_note}}
                    </div>

                </div>


                <br>
                <div class="row">
                    <div class="col-md-12" color="danger">
                    <b> {{cn_error_message}}</b>
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="closeNotesModal()" color="success">OK</CButton>
            </CModalFooter>
    </CModal>
    <CModal  backdrop="static" :visible="show_convert_waitList_modal"  @close="show_convert_waitList_modal=false">
      <CModalHeader>
        <CModalTitle>Wait List: {{convertModalButtonText}} </CModalTitle>
      </CModalHeader>
      <CModalBody v-if="false">
        <div class="row">
          <div class="col-md-4" color="primary">
            <label class="control-label">
              <b>Preferred Date: </b>&nbsp;
            </label>

          </div>
          <div class="col-md-8 mb-3">
            <flat-pickr
              ref="waitListDatePicker"
              :config="this.date_picker_config"
              :modelValue="this.converted_waitList_date"
              v-model="this.converted_waitList_date"
              placeholder="Date">
            </flat-pickr>
          </div>
          <div class="col-md-4" color="primary">
            <label class="control-label">
              <b>Preferred Providers: </b>&nbsp;
            </label>
          </div>
          <div class="col-md-8">
            <v-select multiple :options="provider_option" v-model="convert_preferred_service_provider" :reduce="name => name.id" label="name" />
          </div>
        </div>
        <br>
        <div class="row">
          <div class="col-md-12" color="danger">
            <b> {{cancel_error_message}}</b>
          </div>
        </div>
      </CModalBody>
      <CModalFooter class="d-flex justify-content-between">
        <CButton @click="show_convert_waitList_modal=false"  color="danger"  class="mr-auto">Cancel</CButton>
        
        <CButton @click="convertOrFindSlot()" color="primary">  
            <CSpinner aria-hidden="true" v-if="show_spinner" component="span" size="sm"></CSpinner>
            {{convertModalButtonText}}</CButton>
        
      </CModalFooter>
    </CModal>

    <CModal :visible="show_cancel_waitList_modal" @close="show_cancel_waitList_modal=false">
        <CModalHeader>
            <CModalTitle>Cancel Wait List</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <div class="row">
             <div class="col-md-4" color="danger">
                      <label class="control-label">
                         <b>Cancel reason: </b>&nbsp;
                     </label>

            </div>
            <div class="col-md-8">
                   <input
                    v-model="cancel_reason"
                    placeholder="Type in a cancellation note "
                    class="form-control placeholder-no-fix"
                    type="text"
                    />
            </div>

         </div>
        <br>
        <div class="row">
             <div class="col-md-12" color="danger">
               <b> {{cancel_error_message}}</b>
            </div>
         </div>
         </CModalBody>
        <CModalFooter class="d-flex justify-content-between">
            <CButton @click="cancelAsNoShow()" :disabled="cancel_reason!==''" color="danger" class="mr-auto">Cancel as No Show</CButton>
            <CButton @click="cancelAsRegular()" :disabled="cancel_reason===''" color="danger">Regular Cancel</CButton>
        </CModalFooter>
        </CModal>
  </div>
</template>

<script>
import CTableWrapper from './Table.vue';
import Pagination from "@/common/Pagination";
import EventEditor from '../dashboard/scheduler-tab/EventEditor'
import Alerts from '../Alerts'
import moment from 'moment'
import flatPickr from "vue-flatpickr-component";
import 'flatpickr/dist/flatpickr.css';
import  '../../assets/css/common.css';
import utils_lib from '../../helpers/utils_lib';
import MessageCenterCredits from '@/common/MessageCreditsCheck';
export default {
  name: 'List',
  components: { CTableWrapper,Pagination, Alerts, EventEditor,flatPickr, MessageCenterCredits },
  watch:{
  },
  data (){
      return({
          visibleLiveDemo: false,
          date_range_picker_config: {
            altFormat: "F j, Y",
            altInput: true,
             mode: "range"
        },
        Wlist:[],
        date_picker_config: {
          altFormat: "F j, Y",
          altInput: true,
        },
        service_option:[],
          search:'',
        searchPhone:'',
        waitListStatus:['waiting for setting','wait listed','cancelled','converted to booking'],//0 = waiting for setting, 1 = wait listed, 2 =cancelled, 3 = converted to booking
          showEditor  : false,
            eventRecord : {},
            eventStore  : {},
            resourceId  : null,
        alert:false,
        show:0,
        show_spinner: false,
        alertData:{
            message:'',
            type:''
        },
        booking_list:[],
        page:1,
        pageCount:1,
        waitlist_feature_enabled: this.$store.state.business_settings.wait_list_settings && this.$store.state.business_settings.wait_list_settings.wait_list_enable? true: false,
        timezone:this.$store.state.business_settings.business_time_zone,
        currency_symbol:this.$store.state.business_settings.business_currency_symbol,
        cards_on_file_list :[],
        show_pay_modal: false,
        pm_error_message: "",
        checkout_btn_disabled: false,
        checkout_text: 'Pay with card on file',
        selected_card_id : '',
        selected_booking_manage_key: '',
        selected_booking_service_id: '',
        selected_customer_id: '',
        show_paycof: true,
        show_client_notes_modal: false,
        client_note: "",
        client_notes_modal_title: "Client Notes",
        cn_error_message: "",
        show_linked_booking_info: false,
        linked_booking_info_text : "",
        linked_bookings_display_array: [],
        provider_option:[],
        filter_service_providers: [],
        show_user_details_modal: false,
        user_detail_obj: {_id: null},   //for display
        country_code: this.$store.state.business_settings.business_info.country_code,
        edit_obj_id: null,

        show_cancel_waitList_modal: false,
        cancel_reason: "",
        cancel_error_message: '',
        cancel_waitList_id: "",
        cancel_service_order_id: "",

        show_convert_waitList_modal:false,
        converted_waitList_date:null,
        convert_waitList_id:'',
        convert_preferred_service_provider:[],
        convertFindOperation: "",
        convertModalButtonText: ""
      })
  },
  created(){
    //this.getServicesList();
    //this.getProvidersList();
     this.getWaitList()
    },
  methods:{
    getCustomerOrParentName(item)
    {
      if (!item && !item.walkin_customer_first_name)
            {
              return "NA"
            }
        let customer_name = item.customer_first_name + " " + item.customer_last_name

        if (item.child_name && item.child_name.length>2 )//&& item.child_cust_id
        {
          customer_name = item.child_name + " /parent: " + customer_name;
        }
        return customer_name;
    },
    getServicesList() {
      this.$schedsdk.list_services({page_no: 1}).then((result) => {
        if (result.status === 1) {
          this.services_option = result.data
        }
      })
    },
    getServiceNames(item)
    {
        let svcname = [];
        
        item.preferred_services.forEach((service)=>{
             svcname.push(service.name)
              
        })
      return svcname
    },
    getProvidersName(item){
      let provName = [];
      item.preferred_service_providers.forEach((provider)=>{
          provName.push(provider.first_name + " " + provider.last_name)
       })
       if(provName.length ==0)
       {
        return "Any"
       }
      return provName.join(",")
    },
    getPhoneFormatted(phone)
    {
        if (phone && phone.length>0)
        {
            return utils_lib.getPhoneFormatted(phone, this.country_code)
        }
        return "";

    },
     getProvidersList() {
                 this.$schedsdk.get_users_list({}).then((result)=>{
                   let resources = [];
                   for (let i = 0; i < result.data.length; i++) {
                     resources.push({
                       "id": result.data[i]._id,
                       "name": result.data[i].first_name + ' ' + result.data[i].last_name,
                     })
                   }
                   this.provider_option=resources
                  
                })
            },
    getDateFormatted(timestamp)
    {
      if(timestamp.toString().length===13){
        timestamp=timestamp/1000
      }
        return  moment.unix(timestamp).format("MM/DD/YYYY");
        },
     searchWaitList() {
      let data={page :1, search_name: this.search }
       this.$schedsdk.getWaitList(data).then((result)=>{
       // console.log(result.data.items,result.data.total_items)
        this.Wlist =result.data.items
        this.pageCount = result.data.total_items
      });
    },
    searchWaitListByPhone(){
      let data={page :1, search_phone: this.searchPhone }
      this.$schedsdk.getWaitList(data).then((result)=>{
        console.log(result.data.items,result.data.total_items)
        this.Wlist =result.data.items
        this.pageCount = result.data.total_items
      });
    },
    getWaitList(){
           this.alert = false;
           this.show=0;
                     
      this.$schedsdk.getWaitList({page :1}).then((result)=>{
        if(result.status===1) {
          this.Wlist = result.data.items
          this.pageCount = result.data.total_items
        }
      }).catch((e)=>{
        console.log(e)
      });
    },
    setPage(pageNo){
      this.page = pageNo;
      this.getWaitList();
    },
     doCancel(data)
    {
        this.$schedsdk.cancelWaitList(data).then((result)=>{
                if(result.status === 1)
                {
                        this.alertData = {
                            message:result.message,
                            type:'success'
                        }
                        this.alert = true;
                        this.show=4;
                        this.getWaitList();
                }
                this.show_cancel_waitList_modal  = false
            }).catch(ex=>{
              console.log(ex)
                this.alertData = {
                        message:ex.data.message,
                        type:'danger'
                    }
                    this.alert = true;
                    this.show=4;
            })
    },
    cancelAsNoShow()
    {
            let data = {
                _id: this.cancel_waitList_id,
                cancel_user_reason: 'No Show'
            }
           this.doCancel(data);
    },
    cancelAsRegular()
    {
            let data = {
               _id: this.cancel_waitList_id,
                cancel_user_reason: this.cancel_reason
            }
           this.doCancel(data);
    },

    cancelHandler(waitList_id){
        // console.log("Cancel booking process")
        this.cancel_reason = "";
        this.cancel_error_message = '';
        this.cancel_waitList_id = waitList_id;

        this.show_cancel_waitList_modal = true
    },
    postConvertHandler(prom)
    {
        prom.then((result)=>{
                if(result.status == 1)
                {
                this.alertData = {
                    message:result.message,
                    type:'success'
                }
                this.getWaitList();
                }
                else
                {
                    this.alertData = {
                    message:result.message,
                    type:'danger'
                }
                }
                
                this.alert = true;
                this.show=4;
                this.show_convert_waitList_modal=false
    }).catch(ex=>{
        this.alertData = {
                message:ex.data.message,
                type:'danger'
            }
            this.alert = true;
            this.show=4;
        }).finally( ()=>{
            this.show_spinner = false;
        })

    },
    doConvert(data)
    {
        this.show_spinner = true;
       this.postConvertHandler( this.$schedsdk.convertWaitList(data))

    },
    doConvertSelectedSlot(data)
    {
        this.show_spinner = true;
       this.postConvertHandler( this.$schedsdk.convertASpecificSlot(data))

    },
    doFindSlots(data)
    {
        this.show_spinner = true;
        this.$schedsdk.findSlotsForWaitList(data).then((result)=>{
                if(result.status == 1)
                {
                this.alertData = {
                    message:result.message,
                    type:'success'
                }
                this.getWaitList();
                }
                else
                {
                    this.alertData = {
                    message:result.message,
                    type:'danger'
                }
                }
                
                this.alert = true;
                this.show=4;
                this.show_convert_waitList_modal=false
        }).catch(ex=>{
            this.alertData = {
                message:ex.data.message,
                type:'danger'
            }
            this.alert = true;
            this.show=4;
        }).finally( ()=>{
            this.show_spinner = false;
        })

    
    },
    getSlotDisplayString(avi, item)
    {
        return this.getFormattedDateTimeZone(avi.day_start_time, item.used_timezone, 'M/DD hh:mm a')
                + "/" +
                this.getSlotProviderName(avi)
    },
    convertToBookingWithMatchingSlot( avi, item)
    {
        let c = confirm("Try to book slot: " + this.getSlotDisplayString(avi, item) + " ?");
        if(!c)
        {
            return;
        }

        this.doConvertSelectedSlot({_id: item._id, slot: avi})

    },
    convertHandler(waitList_id)
    {
        this.convertFindOperation = "CONVERT";
        this.convertModalButtonText = "Convert";
        this.convert_waitList_id=waitList_id;
        this.show_convert_waitList_modal=true;
    },
    convertOrFindSlot(){
      let data={
        _id:this.convert_waitList_id,
        preferred_date:moment(this.converted_waitList_date).unix(),
        preferred_service_provider:this.convert_preferred_service_provider,
      }
      if( this.convertFindOperation == "CONVERT")
      {
            this.doConvert(data)
      }
       if( this.convertFindOperation == "FIND SLOTS")
      {
            this.doFindSlots(data)
      }
    },
    findSlotsHandler(waitList_id)
    {
        this.convertFindOperation = "FIND SLOTS"
        this.convertModalButtonText = "Find Slots"
        this.convert_waitList_id=waitList_id;
        this.show_convert_waitList_modal=true;
    },
    notifyUserOfSlots(item)
    {
      this.$schedsdk.notifyUserofSlots({_id: item._id}).then((result)=>{
                if(result.status === 1)
                {
                        this.alertData = {
                            message:result.message,
                            type:'success'
                        }
                        this.alert = true;
                        this.show=4;
                        this.getWaitList();
                }
                
            }).catch(ex=>{
              console.log(ex)
                this.alertData = {
                        message:ex.data.message,
                        type:'danger'
                    }
                    this.alert = true;
                    this.show=4;
            })
    },
    getFormattedDate: function (dt_unix, ft="MMM DD, YYYY hh:mm a") {
        if (dt_unix == null || dt_unix == 0)
        {
            return dt_unix;
        }
        return moment(dt_unix).format(ft);//"MMM DD, YYYY hh:mm a"
    },
    getFormattedDateTimeZone: function (dt_unix,time_zone, ft="MMM DD, YYYY hh:mm a") {
        if (dt_unix == null || dt_unix == 0)
        {
            return dt_unix;
        }
        return moment(dt_unix).tz(time_zone).format(ft);//"MMM DD, YYYY hh:mm a"
    },
    getSlotProviderName(avi)
    {
        if(avi && avi.user_data && avi.user_data.first_name)
        {
            return  avi.user_data.first_name + " " + avi.user_data.last_name
        }
    },
    getPreferredDaysOfWeek (numbers) {
      let days=['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
      let selectedDays=[]
      if(numbers.length>0){
        numbers.forEach((number)=>{
          selectedDays.push(days[number])
        })
      }
      else{
        selectedDays=days;
      }

      return selectedDays.join(',')

          },
          getTimeSlotAsString(hour)
          {
              if(hour>12)
              {
                  return (hour-12).toString() + " PM"
              }
              return hour.toString() + " AM"
          },
    getPreferredTimes (arr_times) 
    {
     
        let times = "Any time"
        let selected = [];
        if(arr_times)
      {
          
        arr_times.forEach((ts)=>{
            if(ts.begin_hour !== null && ts.end_hour !== null)
            {
                console.log(ts)
                selected.push(  this.getTimeSlotAsString(ts.begin_hour) + " - " + this.getTimeSlotAsString(ts.end_hour))      
            }
          
        })
      }
     

     if(selected.length)
     {
         times = selected.join(",")
     }
      return times

    }, 
    viewUserInfo(userobj, user_type)
    {
        let id = userobj._id;
        let that = this;
        that.user_detail_obj = {_id: null};
        this.$schedsdk.get_customer_detail(id).then((result)=>{
                if(result.status == 1)
                {
                     //
                    that.user_detail_obj = result.data;
                    that.show_user_details_modal = true;
                }
            })

    },
    viewNotes(item)
    {
        this.client_note = item.client_notes;
        this.client_notes_modal_title = "Client Notes"
        this.show_client_notes_modal = true;
    },
    //Reuse show_client_notes_modal
    viewCancelNotes(item)
    {
        this.client_note = item.cancel_user_reason;
        this.client_notes_modal_title = "Cancellation Notes";
        this.show_client_notes_modal = true;
    },
    viewLinkedBookingInfo(item, index)
    {
        this.linked_booking_info_text += ""
        let grouped_bookings = [];
        for(let k=0; k<this.booking_list.length; k++)
        {
            if (this.booking_list[k].linked_booking_hard_link == true &&
                this.booking_list[k].linked_booking_hard_tag == item.linked_booking_hard_tag)
            {
                grouped_bookings.push({
                    _id: this.booking_list[k]._id,
                    service_order_id: this.booking_list[k].service_order_id,
                    customer:  this.booking_list[k].customer,
                    service_provider: this.booking_list[k].service_provider
                })
            }
        }
        this.linked_bookings_display_array = grouped_bookings;
        this.show_linked_booking_info = true;
        this.linked_booking_info_text = "Grouped & Linked under " + item.linked_booking_hard_tag;

    },
    getResourcesList(item)
    {
        let rsclist = "";
        for(let k=0; k<item.assigned_resource_ids.length; k++)
        {
           rsclist += item.assigned_resource_ids[k].first_name + " ";
        }
        return rsclist;
    },
  getBookingSource(booking_source)
  {
      switch(booking_source)
      {
          case 1: return "App";
          case 2: return "Alexa";
          case 3: return "Web";
          case 4: return "Webchat";
          case 5: return "AdminWeb";
          case 6: return "GoogleHome";
          case 7: return "Facebook";
          case 8: return "Waitlist";
          case 99: return "Unloggedin";
          default: return 'Unknown ' + booking_source;


      }
  },
    alertClosedFn() {
        this.show = 0;
    },
    closeNotesModal()
    {
        this.show_client_notes_modal = false;
        this.client_note = "";
    },
    closeLinkedBookingModal()
    {
        this.show_linked_booking_info = false;
        this.linked_booking_info_text = "";
        this.linked_bookings_display_array = [];

    },
    closeUserInfoModal()
    {
        this.show_user_details_modal = false;
        this.user_detail_obj = {_id: null};
    },

  }

}
</script>
<style scoped>
    .action_column button {
        margin: 3px
    }
    .section_1 {
        /*background: white;*/
        margin-top: 30px;
        padding: 6px;
    }
</style>

