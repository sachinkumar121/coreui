<template>
<div>
    <Alerts 
      :alertData="alertData" 
      :show="show"
      @alertClosed="show = 0"
      v-if="alert"
    />
    <CRow>
      <CCol sm="12">
        <div v-if="!isCustomerUserType && !is_booking_canceled && booking_detail.meeting_info && !booking_detail.meeting_info.provider">
          <ButtonLoader
            class="float-end mt-1 me-lg-2 mb-3"
            :class="{'active-svg': creating_meeting}"
            @click="createMeeting"
            color="primary"
          >Create Meeting</ButtonLoader>
        </div>
        <table class="table table-bordered table-hover">
           <tbody v-if="loading">
                <tr>
                    <td colspan="2">
                        Loading details...
                    </td>
                </tr>
          </tbody>
          
          <tbody v-else>
          <tr>
            <td colspan="2" class="align-middle"><h4 class="mb-0 h5">Booking Details: {{getCustomerOrParentName(booking_detail)}} </h4></td>
          </tr>
         
          <tr>
            <td>Booking Id:</td>
            <td>{{booking_detail.service_order_id}}</td>
          </tr>
          <tr>
            <td>Customer Name:</td>
            <td>{{getCustomerOrParentName(booking_detail)}}</td>
          </tr>
          <tr>
            <td>Phone</td>
            <td> {{getPhoneFormatted(booking_detail.customer.phone, 'US')  }}</td>
          </tr>
          <tr>
            <td>Provider</td>
            <td>{{booking_detail.service_provider.first_name}} {{booking_detail.service_provider.last_name}}</td>
          </tr>
          <tr>
            <td>Service Date and Time</td>
            <td>{{getFormattedDate(booking_detail.service_start_date) }}</td>
          </tr>
           <tr>
            <td>Resources (Rooms/Tables)</td>
            <td>{{getResourcesAssigned(booking_detail.assigned_resource_ids) }}</td>
          </tr>
           <tr>
            <td>Booking Created Time</td>
            <td>{{getFormattedDate(booking_detail.booking_request_date) }}</td>
          </tr>
           <tr>
            <td>Was Forced Booking</td>
            <td>{{ booking_detail.was_actually_forced==true?"Yes":"No" }}</td>
          </tr>
          <tr>
            <td>Is a Walkin?</td>
            <td>{{ getWalkinCustomerDetails(booking_detail)==null?"No":"Yes" }}</td>
          </tr>
            <tr>
            <td>Booking Source</td>
            <td>{{ getBookingSource(booking_detail.booking_source) }}</td>
          </tr>
          <tr v-if="booking_detail.cancel_user_reason && (booking_detail.type==2||booking_detail.type==1||booking_detail.type==8)">
            <td>Cancel Reason</td>
            <td>{{ booking_detail.cancel_user_reason=="false"?"Canceled" : booking_detail.cancel_user_reason}} Code: {{booking_detail.type}}
                <span v-if="booking_detail.canceled_due_to_no_show == true">[No Show]</span>

            </td>
            
            
          </tr>
          <tr v-if="booking_detail.type==2||booking_detail.type==1||booking_detail.type==8">
            <td>Cancel Date</td>
            <td>{{getFormattedDate(booking_detail.canceled_on) }}</td>
          </tr>
           
          <tr>
            <td colspan="2" class="align-middle"><h4 class="mb-0 h5">Services</h4></td>
          </tr>
          <tr v-for="(service, index) in booking_detail.services" :key="index">
            <td>{{service.name}} ({{service.time}} min)</td>
            <td>{{currency_symbol}}{{service.price}}</td>
          </tr>
          <tr>
            <td>Coupon</td>
            <td>{{coupon_name }}</td>
          </tr>
           
          <template v-if="show_meeting_info">
            <tr>
              <td colspan="2" class="align-middle">
                <div class="d-flex justify-content-between items-center">
                  <h4 class="mb-0 h5">Meetings Details </h4>
                  <ButtonLoader
                    class="border-radius-14 min-height-44 ms-1 px-2 px-sm-3 px-xxl-3 float-end"
                    :class="{'active-svg': deleting_meeting}"
                    @click="deleteMeeting"
                    color="danger"
                  >Delete Meeting</ButtonLoader>
                </div>
              </td>
            </tr>
            <tr>

            <td>Meeting Provider</td>
              <td>{{booking_detail.meeting_info.provider}}</td>
            </tr>
            
            <tr>
            <td>Subject</td>
              <td>{{booking_detail.meeting_info.meeting_subject}}</td>
            </tr>
            <tr>
              <td>Host Start URL</td>
              <td>
                <ButtonLoader
                  v-if="is_host_start_url_expired"
                  :class="{'active-svg': generating_meeting_link}"
                  @click="refreshMeetingInfo"
                  color="primary"
                >Get Start URL</ButtonLoader>
                <template v-else>
                  <a :href="booking_detail.meeting_info.host_start_url" target="_blank">Click for Host Join </a> (Do not share outside)
                </template>
              </td>
            </tr>
            <tr>
              <td>Participant Join URL</td>
              <td>
                <a :href="booking_detail.meeting_info.join_url" target="_blank"> {{booking_detail.meeting_info.join_url}}</a>
              </td>
            </tr>
            <tr>
              <td>Meeting Join ID</td>
              <td>
                {{booking_detail.meeting_info.join_meeting_id}}
              </td>
            </tr>
            
            <tr>
              <td>Meeting Password</td>
              <td>{{booking_detail.meeting_info.password}}</td>
            </tr>
            <br>

          </template>
          <tr>
            <td><h4 class="mb-0 h5">Invoice Sub Total</h4></td>
            <td class="align-middle">{{currency_symbol}}{{invoice_sub_total}} ({{payment_type_string}})</td>
          </tr>
          <tr>
             
            <td> Taxes  </td>
            <td class="align-middle">{{currency_symbol}}{{invoice_tax_total}}</td>
          </tr>
          <tr>
            <td>Tip</td>
            <td>{{currency_symbol}}{{tip}}</td>
          </tr>

          
          <tr>
            <td><h4 class="mb-0 h5">Invoice Total</h4></td>
            <td class="align-middle">{{currency_symbol}}{{invoice_total}} ({{payment_type_string}})</td>
          </tr>
         <tr>
            <td>Amount Paid</td>
            <td>{{currency_symbol}}{{total_amount}}</td>
          </tr>
          <tr>
            <td>Amount Due</td>
            <td>{{currency_symbol}}{{due_amount}}</td>
          </tr>
          <tr>
            <td>Link to Invoice</td>
            <td><button class="btn btn-primary btn-sm" @click="$router.push('/invoices/detail/'+ invoice_number)">Invoice {{invoice_number}}</button></td>
          </tr>
          <tr>
            <td>Customer External Manage View</td>
            <td><button class="btn btn-primary btn-sm" @click="getExternalManageBooking(booking_detail.manage_booking_key)">External Manage Booking</button></td>
          </tr>
          <tr v-if="getHintHasPaperworkEnabled()">
            <td>Paperwork complete?</td>
            <td><button class="btn btn-primary btn-sm" @click="getExternalManageBooking(booking_detail.manage_booking_key)">{{booking_detail.customer.is_paperwork_complete_hint?'Yes':'No'}}</button>
              &nbsp; <button type="button" @click="
                                    $router.push(
                                        '/customers/list_paperwork/' + booking_detail.customer._id,
                                    )
                                "
                                class="btn btn-secondary btn-sm"
                            >
                                View Paperwork Status
                </button>
            </td>
          </tr>
          
          <tr v-if="!isCustomerUserType">
            <td>Edit Booking</td>
            <td><button class="btn btn-info btn-sm" @click="editHandler(booking_detail._id)">Edit this booking</button></td>
          </tr>
          </tbody> 
        </table>
        </CCol>
    </CRow>
    <CRow v-if='booking_log.length'>
        <CCol sm="12">
            Booking Log
        </CCol>
    </CRow>
    <CRow v-if='booking_log.length'>
         <CCol sm="12">
             <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Employee</th>
                        <th>Operation</th>
                        <th>Detail</th>
                    </tr>
                </thead>
                <tbody> 
                    <tr v-for="logentry in booking_log" v-bind:key="logentry._id"> 
                        
                        <td>{{getFormattedDate(logentry.created_at)}}</td> 
                        <td>{{getEmployeeName(logentry)}}</td>
                        <td>{{ logentry.object_name + "/" +  logentry.object_operation}}</td> 
                        <td>{{ logentry.log_message }}</td> 
                    </tr>  
                </tbody>
            </table>
         </CCol>
    </CRow>
    
    <EventEditor 
            :visible="showEditor"
            @modal:close="showEditor = false"
            ref="eventEditor"
            :eventRecord="eventRecord"
            :eventStore="eventStore"
            :resourceId="resourceId"
            
        ></EventEditor>
  </div>
</template>
<script>

import moment from 'moment'
import PhoneNumber from 'awesome-phonenumber'
import EventEditor from '../dashboard/scheduler-tab/EventEditor'
import { BOOKING_TYPE,USR_TYPE } from '@silverskysoft/skysched-schemas'
import Alerts from '../Alerts.vue';
import ButtonLoader from '@/common/ButtonLoader.vue'

export default {
    name: 'DetailBooking',
    components: {   EventEditor, Alerts, ButtonLoader },
    watch:{
            showEditor: function() {
            if(this.showEditor == false){
                this.getBookingDetail();
            }
        }
    } ,
    data (){
      return({
        loading: false,
        booking_detail:{},
        payment_type_string:'',
        invoice_sub_total:0,
        invoice_tax_total:0,
        invoice_total:0,
        total_amount:0,
        paid_amount: 0,
        due_amount:0,
        tip:0,
        invoice_number: 'NA',
        coupon_name: '',
        timezone:this.$store.state.business_settings.business_time_zone,
        currency_symbol:this.$store.state.business_settings.business_currency_symbol,
        showEditor  : false,
        eventRecord : {},
        eventStore  : {},
        resourceId  : null,
        booking_log : [],
        show_meeting_info: false,
        is_booking_canceled: false,
        is_host_start_url_expired: false,
        alert: false,
        show: 0,
        alertData: {
          message: '',
          type: ''
        },
        deleting_meeting: false,
        creating_meeting: false,
        generating_meeting_link: false,
        user_type: this.$store.state.user_data.type,
      })
  },
  
  created(){
      this.getBookingDetail();
  },
  props:['booking_id'],
  unmounted() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  },
  computed: {
        isCustomerUserType(){
            return this.user_type == USR_TYPE.UT_CUSTOMER
        }
  },
  methods:{
    getExternalManageBooking(manage_booking_key)
    {
      let url = this.$store.state.skysched_global_api_base_url +
                'extpages/online_manage_booking/' +
                  manage_booking_key 
      window.open(url, '_blank');
    },
    editHandler(booking_id){
        //console.log("Booking Id ",booking_id)
        let thisRef = this;
        this.$schedsdk.getBookingDetail({_id:booking_id}).then((result)=>{

            // console.log(result.data.customer.email)
            thisRef.eventRecord.data = result.data;
            thisRef.eventRecord.data.id = result.data._id;
            thisRef.eventRecord.data.email = result.data.customer.email;
            thisRef.eventRecord.data.phone = result.data.customer.phone;
            thisRef.eventRecord.edit_booking_flag = 1;
            thisRef.eventRecord.resourceId = result.data.service_provider._id;
            // thisRef.resourceId = result.data;
            thisRef.showEditor = true;
        })
        
    },
    getHintHasPaperworkEnabled()
    {
      return this.$store.state.business_settings.hint_has_required_paperworks
    },
  getBookingLogs(booking_id, invoice_numbers)
  {
      if(this.$store.state.business_settings.show_booking_log_in_details != true)
      {
          return;
      }
        this.$schedsdk.get_booking_logs({booking_id:booking_id, invoice_numbers: invoice_numbers}
            ).then((result)=>{
            //this.booking_detail = result.data
            if (result.status == 1)
            {
               // console.log("asdasdasdasdas---s-s")
                this.booking_log = result.data
            }
        });
   
  },
  getBookingDetail(){
    this.loading = true;
    //console.log("Asdasd LOADINg")
    this.$schedsdk.getBookingDetail({_id:this.$route.params.booking_id}).then((result)=>{
      this.booking_detail = result.data
      this.show_meeting_info = this.booking_detail.meeting_info && this.booking_detail.meeting_info.provider && (this.booking_detail.type != BOOKING_TYPE.BT_MANUAL_CANCEL && this.booking_detail.type != BOOKING_TYPE.BT_CANCEL_AS_NO_SHOW);

      this.is_booking_canceled = this.booking_detail.type == BOOKING_TYPE.BT_MANUAL_CANCEL || this.booking_detail.type == BOOKING_TYPE.BT_CANCEL_AS_NO_SHOW

      if (this.booking_detail.meeting_info) {
        //console.log("asdasd EXPIRY ", this.booking_detail.meeting_info.host_start_url_expiry_time , moment().utc().valueOf())
        this.is_host_start_url_expired = this.booking_detail.meeting_info.host_start_url_expiry_time <= moment().utc().valueOf();
      }

      let payment_type = [];
      //Payment method = 0 = card, 1=cash
      for (let type = 0;type<result.data.invoice_info_summary.length;type++)
      {
       
        if(result.data.invoice_info_summary[type].payment_method === 0 && 
           payment_type.indexOf('Card') == -1)
        {
          payment_type.push('Card')
        }
        if(result.data.invoice_info_summary[type].payment_method === 1 && payment_type.indexOf('Cash') == -1)
        {
          payment_type.push('Cash')
        }
      }
      //TBD : Does not handle CASH and CARD payment
      let payment_method_used = 0;
      let b = 0;
      if (result.data.invoice_info.length >1)
      {
          if (result.data.invoice_info[1].compact_invoice_payments.length>0)
          {
              //cash payment
              payment_method_used = 1
          }
      }
      else
      {
          //card payment
          payment_method_used = 0;
      }
      //No loop, pick the invoice based on method used
      b = payment_method_used;
    this.total_amount= 0;
    this.invoice_tax_total = 0;
    this.invoice_sub_total = 0;
    let invoice_numbers = [];
    if(result.data.invoice_info !== undefined && result.data.invoice_info[b] !== undefined)
    {
        this.total_amount += result.data.invoice_info[b].invoice.final_paid_amount;
        this.invoice_number = result.data.invoice_info[b].invoice.invoice_number;
        invoice_numbers.push(this.invoice_number);
        for (let a = 0;a<result.data.invoice_info[b].compact_invoice_detail.length;a++)
        {
            let cid = result.data.invoice_info[b].compact_invoice_detail[a];
            if(cid.tx)
            {
                this.invoice_tax_total += cid.ep;
            }
            else if (cid.ic == "IC_TIP")
            {
                this.tip += cid.ep
            }
            else
            {
                this.invoice_sub_total += cid.ep;
            }
            
        }
        this.paid_amount = result.data.invoice_info[b].invoice.final_paid_amount;
    
    }
      this.invoice_sub_total = Math.round(this.invoice_sub_total * 100) / 100
      this.invoice_tax_total = Math.round(this.invoice_tax_total * 100) / 100
      this.tip = Math.round(this.tip * 100) / 100
      this.invoice_total = Math.round((this.invoice_sub_total + this.invoice_tax_total + this.tip)*100)/100;
      
      this.due_amount = this.invoice_total - this.paid_amount;
      if(payment_type.length-1 >= payment_method_used)
      {
        this.payment_type_string = payment_type[payment_method_used];
      }
      if (result.data.coupon && result.data.coupon.coupon_name != null)
      {
          let cpn =  result.data.coupon;
          this.coupon_name = cpn.coupon_name + " (" + (cpn.discount_type!=1?this.currency_symbol:"") +
                                     cpn.amount +  (cpn.discount_type==1?"%":"") + ")"
      }
      
      this.getBookingLogs(this.booking_detail._id, invoice_numbers);
    }).finally(ex=>{
           this.loading = false;
 
    });
  },
  getFormattedDate: function (dt_unix) {
      if (dt_unix == null || dt_unix == 0)
      {
          return dt_unix;
      }
      return moment(dt_unix).format("MMM DD, YYYY hh:mm a");//"MMM DD, YYYY hh:mm a"
  },
  getPhoneFormatted(phone, country_code ="US")
  {
      var pn = new PhoneNumber(phone, {regionCode: country_code});
      if (pn.isValid())
      {
          return pn.getNumber('national');
      }
      return null;
  },
  getResourcesAssigned(assigned_arr)
  {
      if (assigned_arr && assigned_arr.length>0)
      {
        let assigned_resource_names = Array.prototype.map.call(
            assigned_arr, s=>s.first_name).toString();
        return assigned_resource_names;
      }
      return "None";
  },
   getWalkinCustomerDetails(item)
        {
            let customer_name = null;
            if (item.is_walkin_booking == true)
            {
                if(item.walkin_customer_first_name && item.walkin_customer_first_name.length>=1)
                {
                    customer_name = item.walkin_customer_first_name + " " + (item.walkin_customer_last_name ||"")
                }
                else
                {
                    customer_name = "Walkin Customer"
                }
            }
            else if(item.walkin_customer_first_name && item.walkin_customer_first_name.length>=1)
            {
                customer_name = item.walkin_customer_first_name + " " + (item.walkin_customer_last_name ||"")
            }
            //console.log("asdsadasd0000as0d ", customer_name)
            return customer_name;
        },
        getCustomerOrParentName(item) {
            if (!item && !item.walkin_customer_first_name)
            {
              return "NA"
            }
            let customer_name = item.customer.first_name + " " + item.customer.last_name
            let walkin_customer = this.getWalkinCustomerDetails(item);
            if(walkin_customer != null)
            {
                customer_name = walkin_customer;
                return customer_name;
            } 
            if (item.child_name && item.child_name.length > 2 && item.child_cust_id) {
                customer_name = item.child_name + " /parent: " + customer_name;
            }
            return customer_name;
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
          case 90: return "Bulk Load Operation";
          case 99: return "Unloggedin";

          default: return 'Unknown ' + booking_source;
          
          
      }
  },
  getEmployeeName(logentry)
  {
    let emplist = this.$store.state.employee_list;
    if (emplist == null || emplist.length == 0)
    {
        return "NA";
    }
    let se_id = logentry.user_id;
    for(let i=0; i<emplist.length; i++)
    {
        if (emplist[i]._id == se_id)
        {
            return "" + emplist[i].first_name + " " + emplist[i].last_name
        }
    }
    return "NA"
  },

  async createMeeting() {
    this.creating_meeting = true;
    setTimeout(async () => {
      try {
        let that = this;
        const response = await this.$schedsdk.createOnlineMeeting(this.booking_detail);
        if (response.status == 1) {
          this.getBookingDetail();
        } else {
          this.alert = true;
          this.show = 4;
          this.alertData = {
            message: response.message,
            type: 'danger'
          }
          if (response.status == 2) {
            this.timeout = setTimeout(function() {
              that.$router.push('/integrations');
            }, 3000);
          }
        }
      } catch (error) {
        this.creating_meeting = false;
      } finally {
        this.creating_meeting = false;
      }
    }, 0);
  },
  async deleteMeeting() {
    this.deleting_meeting = true;
    setTimeout(async () => {
      let wantToDelete = confirm("Are you sure you want to delete the meeting");
      if (wantToDelete) {
        try {
          const response = await this.$schedsdk.deleteOnlineMeeting(this.booking_detail._id);
          if (response.status) {
            this.getBookingDetail();
            this.deleting_meeting = false;
          }
        } catch (error) {
          this.deleting_meeting = false;
        }
      } else {
        this.deleting_meeting = false;
      }
    }, 0);
  },
  async refreshMeetingInfo() {
    this.generating_meeting_link = true;
    setTimeout(async () => {
      try {
        const response = await this.$schedsdk.refreshOnlineMeetingInfo(this.booking_detail._id);
        if (response.status) {
          this.getBookingDetail();
          this.generating_meeting_link = false;
        }
      } catch (error) {
        this.generating_meeting_link = false;
      }
    }, 0);
  }

  }
  
}
</script>