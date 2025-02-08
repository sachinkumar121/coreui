<template>
<div>
    <CRow>
      <CCol sm="12">
        <table class="table table-bordered table-hover" v-if='booking_detail.service_order_id'>
          <tbody>
          <tr>
            <td>Booking Id:</td>
            <td>{{booking_detail.service_order_id}}</td>
          </tr>
          <tr>
            <td>Customer Name:</td>
            <td>{{booking_detail.customer.first_name}} {{booking_detail.customer.last_name}}</td>
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
            <td colspan="2" class="align-middle"><h4 class="mb-0">Services</h4></td>
          </tr>
          <tr v-for="(service, index) in booking_detail.services" :key="index">
            <td>{{service.name}} ({{service.time}} min)</td>
            <td>{{currency_symbol}}{{service.price}}</td>
          </tr>
          <tr>
            <td>Coupon</td>
            <td>{{coupon_name }}</td>
          </tr>
         
          <tr>
            <td><h4 class="mb-0">Invoice Sub Total</h4></td>
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
            <td><h4 class="mb-0">Invoice Total</h4></td>
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
                        <th>Operation</th>
                        <th>Detail</th>
                    </tr>
                </thead>
                <tbody> 
                    <tr v-for="logentry in booking_log" v-bind:key="logentry._id"> 
                        
                        <td>{{getFormattedDate(logentry.created_at)}}</td> 
                        <td>{{ logentry.object_name + "/" +  logentry.object_operation}}</td> 
                        <td>{{ logentry.log_message }}</td> 
                    </tr>  
                </tbody>
            </table>
         </CCol>
    </CRow>
    <EventEditor v-if="showEditor == true"
        ref="eventEditor"
        v-model   = "showEditor"
        :eventRecord = "eventRecord"
        :eventStore  = "eventStore"
        :resourceId  = "resourceId"
    ></EventEditor>
  </div>
</template>
<script>

import moment from 'moment'
import PhoneNumber from 'awesome-phonenumber'
import EventEditor from '../dashboard/scheduler-tab/EventEditor'
export default {
    name: 'DetailBooking',
    components: {   EventEditor },
    watch:{
            showEditor: function() {
            if(this.showEditor == false){
                this.getBookingDetail();
            }
        }
    } ,
    data (){
      return({
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
        booking_log : []
      })
  },
  
  created(){
      this.getBookingDetail();
  },
  props:['booking_id'],
  methods:{
    editHandler(booking_id){
        console.log("Booking Id ",booking_id)
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
    this.$schedsdk.getBookingDetail({_id:this.$route.params.booking_id}).then((result)=>{
      this.booking_detail = result.data
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
  }
  }
  
}
</script>