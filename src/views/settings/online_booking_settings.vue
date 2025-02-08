<template>
  <div>
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <br>
        <div class="col-md-4">
            <div class="form-group" >
                <label class="control-label"><b>Search</b></label>
                <input 
                v-model="search"
                class="form-control placeholder-no-fix" 
                @keyup="getSettingsList()"
                type="text" 
                />
            </div>
        </div>

        <br>
            <div class="col-md-8" v-if="booking_url=='not enabled'">
                 <div class="form-group" >
                    <label class="control-label"><b>Online Booking URL: </b> &nbsp; Not yet enabled. Enable below by 'Enable online bookings'</label>
                </div>
                 <div class="form-group" >
                    <label class="control-label"><b>Products/Package sales URL: </b> &nbsp; Not yet enabled. Needs online booking to be enabled.</label>
                </div>
            </div>
              <div class="col-md-8" v-else>
                 <div class="form-group" >
                    <label class="control-label"><b>Online Booking URL: </b> &nbsp; 
                    <a :href=booking_url target="_blank" class="link-urls">{{this.booking_url}}</a> </label> &nbsp; 
                    <label v-if="booking_url_info!=''">(<a :href=booking_url_info target="_blank">use instructions</a>)</label> 
                </div>
                <div class="form-group" >
                    <label class="control-label"><b>QR Code for Online Booking URL: </b> &nbsp; 
                    </label><img :src=this.booking_url_qrcode_data />
                </div>
                <div class="form-group" >
                    <label class="control-label"><b>Products/Package sales URL: </b> &nbsp; 
                    <a :href=product_url target="_blank" class="link-urls">{{this.product_url}}</a> </label> &nbsp; 
                    <label v-if="booking_url_info!=''">(<a :href=booking_url_info target="_blank">use instructions</a>)</label> 
                </div>
               
            </div>
        <CRow>
            <div class="col-md-12 mb-3">
                <div class="form-group">
                    <button @click='saveSettings'  class="btn btn-success float-end">
                        {{ save_button_text }}</button>
                </div>
            </div>
        </CRow>
         
            
        <table class="table table-bordered">
          <thead>
              <tr>
                  <!-- <th>S.no</th> -->
                  <th>Name</th>
                  
                  <th>Action</th> 
              </tr>
          </thead>
          <tbody v-if="list.length">
              <tr v-for="item in listofsettings"   :key="item.name" class="tr-web-setting">
                  
                   
                  <td v-if="item.type == 'group'" colspan="2" class="text-center"> 
                        <strong>{{item.name}}</strong>
                  </td>
                  <td v-else>{{item.name}} 
                            <CIcon v-if="item.description && item.description.length>2" 
                                name="cil-CommentSquare"  
                                v-c-popover="getDescriptionObj(item)"/>
                        
                  </td>
                   <td v-if="item.type == 'number'"> 
                     <span >{{getPreSymbol(  item)}} &nbsp;<input 
                          class="col-md-2  placeholder-no-fix form-control " 
                        
                          type="text" 
                          v-model="website_booking_widget_setting[item.field]"
                          />&nbsp;{{getPostSymbol( item)}}</span>
                  </td>
                   <td v-if="item.type == 'text'"> 
                     <textarea 
                          class="form-control placeholder-no-fix" 
                           v-model="website_booking_widget_setting[item.field]"
                          ></textarea>
                  </td>
                  <td v-else-if="item.type == 'toggle'"> 
                    <CFormSwitch v-model="website_booking_widget_setting[item.field]"
                         :value="getSettingField(item.field)"
                        @change="changeAction($event.target.value)"/>
                    </td>
                   <td v-else-if="item.type == 'colorpicker'"> 
                       <chrome-picker  
                       v-if="website_booking_widget_setting[item.field]"
                        v-model="website_booking_widget_setting[item.field]"></chrome-picker>
                  </td>   
                   <td v-else-if="item.type == 'metadata'"> 
                       <span>{{getItemMetadata(item)}}</span>
                       
                  </td>                    
                  <td v-else-if="item.type == 2"> 
                    Icon 
                  </td>
                  
                  <td v-else-if="item.type == 'date_time_utc'"> 
                        <flat-pickr  v-model="website_booking_widget_setting[item.field]" 
                            :config="date_picker_config_utc_save" 
                            placeholder="Show Until Date"></flat-pickr>
                    </td>

               
              </tr>

              <tr>
                  <td colspan="2" class="text-end"> <button @click='saveSettings' 
                        class="btn btn-success">{{ save_button_text }} </button></td>
              </tr>
               
          </tbody>
      </table>
    </CCol>
    </CRow>
    </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import QRCode from 'qrcode'
import Alerts from '../Alerts'
  
//import settings_json from "../../../settings";
import tag_to_route from "../../../tag_to_route";
import login_helper from '../../helpers/login_helper';
 
import { Chrome as Chromepicker } from '@ckpack/vue-color';

export default {
  name: 'OnlineBookingsSettings',
  components: { Alerts, flatPickr,
        'chrome-picker': Chromepicker,
        QRCode
    },
  data (){
      return({
          save_button_text: "Save Changes",

          search:'',
          list:[],
          original_list: [],
          tag_to_route:tag_to_route,
          allow_online_booking:true,
          alert:false,
          show:0,
          currency_symbol:this.$store.state.business_settings.business_currency_symbol,
          booking_url: 'not setup',
          booking_url_qrcode_data: '',
          booking_url_info: '',
          product_url: 'not setup',
          website_booking_widget_setting: {},
          web_payment_provider : '',
          alertData:{
              message:'',
              type:''
          },
           date_picker_config_utc_save: {
                    dateFormat: 'U',
                    altFormat: "F j, Y",
                    altInput: true,
                    minDate:Date.now()
                },
          color_test: {  hex: '#194d33e6'}
      })
  },
    computed: 
    {
         
        //Get only those that actually have been implemented
        listofsettings () 
            {
                const hfn = this.hasPage;
                return this.list.filter(function (el) {
                       // return (hfn(el.tag));
                       return true;
                    });
            }
  },
  beforeCreate(){
       
  },
  created(){
    
    this.original_list = [
            {name: "Basic Options",                             type: "group",  field: ''},
            {name: "Enable online bookings        ",            type: "toggle", field: 'allow_online_booking', description : "Enable online booking so your customers can book online"},
            
            {name: "Minimum advance booking hours",             type: "number", field: 'min_advance_booking_hours', unit:'hours' ,  description : "Minimum time in hours between request time and actual service time"},
            {name: "Reschedule upto hrs. before appt.",         type: "number", field: 'allow_rechedule_hours_before' ,unit:'hours'},
            {name: "Require Phone number while booking",        type: "toggle", field: 'require_phone'},
            {name: "Allow Coupons/Package codes when booking",  type: "toggle", field: 'allow_coupon_package_codes', 
                                                                description: 'Shows a field where your customers can enter package code or coupon code'},
            {name: "Allow booking for themselves or child",  type: "toggle", field: 'show_option_to_book_for_parent_or_dependent', 
                                                                description: 'During booking, customers can choose to book for themselves or their child (or pet, see settings -> booking settings for pets)'},
            {name: "Allow multiple services selection",  type: "toggle", field: 'allow_multiple_services_by_default', 
                                                                description: 'During booking, allow multiple services to be selected by customer?'},
       
       
            {name: "Use Department/Teams level booking",  type: "toggle", field: 'use_department_level_booking', 
                                                                description: 'If you have departments or teams like a sales team or onboarding team, your customers can book with that team rather than specific name. Note your should setup the team and employees who belong to that team before turning this on.'},
            {name: "Disability Accomodation: Allow customer to request", 
                                                                type: "toggle", field: 'allow_customer_to_request_dis_acc', 
                                                                description: 
                        'Customer will be allowed to request disability accomodation. If you have enabled resources assignment, this option will automatically first try to match resources that are marked as Disabled Access Friendly. How the booking will behave if such a resource is not matched is set in \'Fall back to regular resource\' option.'},
            
            {name: "Disability Accomodation: Fall back to regular resource, if not available", 
                                                                type: "toggle", field: 'fall_back_to_other_on_no_dis_acc', 
                                                                description: 
                        'If a resource match for disability request was not found, should application fallback and select another available resource. If you select no, the booking request is rejected.'},
            
      
      
            {name: "Payment Options",                           type: "group",  field: ''},
            {name: "Online web payment provider",               type: "metadata", field: 'ecommerce_payment_provider', description: 'To take payments when customer books online, a web payments provider must be set. This is done in Left menu-> Integrations -> Online Web Payments. Completing this allows you a seamless payment experience online.'},
           
            {name: "Require payment to hold",                   type: "toggle", field: 'require_full_payment',  description: 'Do you require a payment to hold a booking? If not, booking will be confirmed as soon as provider availability is found.'},
            {name: "Cancel appt. if unpaid within minutes",     type: "number", field: 'cancel_hold_booking_after_minutes',  unit:'minutes', description: 'If you require payment, how long to hold booking without payment before automatically cancelling for non-payment'},
           
            {name: "Deposit amount",                            type: "number", field: 'deposit_payment_amount', 
                                            unit:'currency', percent_symbol_refer: 'deposit_is_a_percent',
                                            description: 'On Clover, If you itemize items then when taking deposits (part payment of invoice), the deposit only cannot be refunded. First, the entire invoice needs to be fully paid. Then the whole invoice including the part deposit can be refunded. This is a Clover limitation'  },
            {name: "Deposit amount is a percent of invoice",    type: "toggle", field: 'deposit_is_a_percent'},
            {name: "Require payment only if over amount",       type: "number", field: 'require_payment_if_over_amount', unit:'currency'},
            {name: "Itemize online items into pay platform",    type: "toggle", field: 'itemize_online_payment_to_pay_platform',description: 'When taking payments, create an itemized order on the payment platform. This would help match payment platform receipts with app\'s receipts. Currently available on: Clover'},
            {name: "Itemize app's surcharge as platform's service charge type",    
                                                                type: "toggle", field: 'itemize_surcharge_as_type_service_charge',
                                                                description: 'When taking payments, with itemized order option, enabling this option will separate the surcharge as an \'additional charge\' of type surcharge. This would help match payment platform reports more easily with app\'s reports. A Service Charge must have been already created and enabled on payment platform side. Currently available on: Clover'},



            {name: "Payment Authorization text",                type: "text",   field: 'mandate_text'},

               
            {name: "Cancellation Policies",                         type: "group",  field: ''},
            {name: "Enable Cancellation Charge Policy",             type: "toggle", field: 'enable_cancellation_charge_policy',
                                description: 'Enable the below cancellation policies. If this is off, none of the cancellation settings below apply.'},
            {name: "Cancellation Charges",                          type: "number", field: 'cancellation_charge', unit:'currency', percent_symbol_refer: 'cancellation_charge_is_a_percent'},
            {name: "Cancellation charge is a percent of invoice",   type: "toggle", field: 'cancellation_charge_is_a_percent'},
            {name: "Free cancel window closes hrs. before start of appt.",    type: "number", field: 'no_charge_if_cancelled_hours_before_start', unit:'hours', 
                                description : "Free cancel means cancel charges are not applied. This field sets when free cancel window closes. For example, if you want to allow free cancellations upto 24 hours before the start of the appointment, set this to 24. If customer cancels 6 hours before the appointment, cancel charges will be applied."},
            {name: "Free cancel allowed upto hrs. after creating appt.",     type: "number", field: 'no_charge_if_cancelled_within_hours_after_book', unit:'hours',
                                description : "Sometimes a grace period (cancel without charge) after creating an appointment is needed. Customer may realize few minutes after booking they may not be able to make it. If you want to provide such a grace period, set how many hours after the creation of this booking this grace period is allowed. Zero indicates no such grace period."},
            {name: "Prevent any online cancellation by customer",   type: "toggle", field: 'fully_prevent_online_cancellation',  
                                description : "Once booking is created, customer is not allowed to cancel the booking. <b>Note:</b> Enabling prevents any customer cancellation and may result in more calls to your business. Reschedule online is allowed and employee is allowed to cancel."},
            {name: "Prevent online cancellation by customer once free cancel window is closed",   
                             type: "toggle", field: 'only_prevent_online_cancellation_after_free_cancel_window_closes' , 
                                description : "Once free cancel window (see setting above), customer is not allowed to cancel the booking. Reschedule online is allowed and employee is allowed to cancel."},
        
            {name: "Display Options",                           type: "group",  field: ''},
            {name: "Show prices in online booking",             type: "toggle", field: 'show_prices_in_online_booking'},
            {name: "Do not show 'anyone' in provider list",     type: "toggle", field: 'skip_anyone_option_in_provider_list'},
            {name: "Do not allow specific provider selection",   type: "toggle",
                             field: 'do_not_allow_specific_provider_selection',
                              description: 'Useful in letting system manage provider assignments. Also useful if you have providerless services like tanning beds/salt rooms/lounges'},
            
            {name: "List packages for purchase during booking", type: "toggle", field: 'list_packages_for_purchase_during_booking'},
            {name: "Do not remember customers on their browers", type: "toggle", field: 'do_not_use_saved_client_info_db', 
                            description: 'By default, customers are allowed to save their information on their own browsers when booking. This allows faster rebooks. If you have privacy requirements, turning this option "ON" will not allow allow users to save their information in their browsers'},
            {name: "Use click to select if services over ",type: "number", field: 'max_click_to_select_to_show' ,unit:'items', 
                                                                description: 'If you have item count over this number, the display becomes a drop down menu for selecting. Other wise, all services are shown for click/tap to select'},
            
  
        

            {name: "Show service by category",                  type: "toggle", field: 'show_service_by_category'},
            {name: "Show Business Info Header",                 type: "toggle", field: 'show_business_info_header'},
            {name: "Show Business Info Footer",                 type: "toggle", field: 'show_business_info_footer'},
            {name: "Show Powered By",                           type: "toggle", field: 'show_powered_by_info'},
            {name: "Banner Text/Announcement (on top of booking page)",      type: "text", field: 'booking_banner_text'},
            {name: "Banner Text Size (1 = small, 5 = large)",   type: "number", field: 'booking_banner_text_size'},
            {name: "Banner Text display until",                 type: "date_time_utc", field: 'booking_banner_display_until'},
            {name: "Banner Text color",                         type: "colorpicker", field: 'booking_banner_text_color'},
          
          
            {name: "Colors",                                    type: "group",  field: ''},
            {name: "Background Color",                          type: "colorpicker", field: 'v2_bg_color'},
            {name: "Primary Color",                             type: "colorpicker", field: 'v2_primary_color'},
            {name: "Text Color",                                type: "colorpicker", field: 'v2_text_color'},
            {name: "Text on Primary Color",                     type: "colorpicker", field: 'v2_text_on_primary_color'},
            {name: "Text on Background Color",                  type: "colorpicker", field: 'v2_text_on_bg_color'},
            {name: "Outer Background Color",                    type: "colorpicker", field: 'v2_outer_bg_color'}
                   
        ];
     this.list = this.original_list
     this.original_list.forEach(element => {
                if( element.type=='colorpicker')
                {
                    
                    if ( this.getSettingField(element.field) == "")
                    {
                        this.website_booking_widget_setting[element.field] = '#ffffff'
                    }
    
                }
             });
    this.$schedsdk.getIntegrationProviderStatus("ecommercepayments",{}).then(
                        (result)=>{
                                console.log("integratrion,as,das,d,");
                                console.log(result)
                                if(result.status == 1 && result.is_enabled == true)
                                {
                                    this.web_payment_provider = result.provider_name
                                }
                                else
                                {
                                    this.web_payment_provider =""
                                }
                                
                        });
    login_helper.get_and_save_business_settings(this.$schedsdk ,this.$store).then((tax_data)=>{
        //Got new business settings
        this.checkwebsitebookings(tax_data)
    });
  },
  methods:{
      
    getDescriptionObj(item)
    {
        
 
        let v = {
                    header: item.name + ' Description',
                    trigger: 'click',  
                    content: item.description,
                }
        return v;
    },
    async getQrCodeImage(url)
    {
        return await QRCode.toDataURL(url) 
         
    },
    getItemMetadata(item)
    {
            if(item.field == "ecommerce_payment_provider")
            {
                if (!this.web_payment_provider || 
                     this.web_payment_provider == "")
                {
                    let msg = "Not enabled." 
                    if (this.website_booking_widget_setting.require_full_payment == true ||
                        this.website_booking_widget_setting.deposit_payment_amount >0.001)
                    {
                      msg +=  " Please enabled in Integrations -> Online Web Payments."
                    }
                   return msg
                }
                else
                {
                    return "Enabled: " + this.web_payment_provider
                }
            }
            return "";
    }  ,
    hasPage(tag) {
      return Object.keys(this.tag_to_route).includes(tag);
    },
    getSettingField(field_name)
    {
        //console.log("asdasdasd" + field_name)
        return Object.prototype.hasOwnProperty.call(this.website_booking_widget_setting, field_name)? this.website_booking_widget_setting[ field_name] : ""
    },
    changeAction(value){
      this.alert = false;
      let toSaveValue = 1
      let message = "enable"
      if(value == "true"){
        toSaveValue = 0
        message = "disable"
      }
     
    },
    updateColorValue(ss)
    {
        console.log('asd color val ' +ss);
    },
    
    getPreSymbol(item){
        if(item.unit)
        {
            switch(item.unit)
            {
                case 'currency': 
                        //Check if this field's cross reference changer (%) is true, if so, return empty
                        //for "pre"
                        //else return symbol
                        if (item.percent_symbol_refer && 
                            item.percent_symbol_refer != '')
                        {
                            if (this.getSettingField(item.percent_symbol_refer) == true)
                            {
                              return ''  
                            }
                        }
                        return this.currency_symbol;
                default: return '';
            }
        }
        return '';

    },
    getPostSymbol(item){
        if(item.unit)
        {
            switch(item.unit)
            {
                case 'hours': return 'hours';
                case 'minutes': return 'minutes';
                case 'currency': 
                        //Check if this field's cross reference changer (%) is false, if so, return empty
                        //for "post" 
                        //else return "%"
                        
                        if (item.percent_symbol_refer && 
                            item.percent_symbol_refer != '')
                        {
                            if (this.getSettingField(item.percent_symbol_refer) == false)
                            {
                              return ''  
                            }
                            else
                            {
                              return "%"
                            }
                        }
                        return "";
                default: return '';
            }
        }
        return '';
    },
    checkwebsitebookings(data){
      // this.allow_online_booking = true
        //console.log("Settings data ..... ");
        //console.log(data);
        if(data && data.status == 1)
        {
          let buss =  data.business_setting;
          this.allow_online_booking = buss.allow_website_bookings;
          this.website_booking_widget_setting = buss.website_booking_widget_setting
          if (this.allow_online_booking )
          {
            this.booking_url = buss.booking_url; //buss.api_access_account_id;
            this.booking_url_info = buss.booking_url_info || "";
            this.getQrCodeImage(this.booking_url).then(data=>{
                    this.booking_url_qrcode_data = data})

            this.product_url = buss.products_url;
            this.website_booking_widget_setting.allow_online_booking = buss.allow_website_bookings
            this.website_booking_widget_setting.cancel_hold_booking_after_minutes =  buss.cancel_hold_booking_after_minutes
            if(this.website_booking_widget_setting.booking_banner_text_color == null ||
                this.website_booking_widget_setting.booking_banner_text_color == '')
            {
                this.website_booking_widget_setting.booking_banner_text_color = '#060606'
            }
          }
          else
          {
            this.booking_url = "not enabled";
            this.booking_url_info ="";
          }
          
        }
    },
    saveSettings(){
        
        if(this.allow_online_booking != this.website_booking_widget_setting.allow_online_booking)
        {
            //setting changed
            let toSaveValue = this.website_booking_widget_setting.allow_online_booking
            this.$schedsdk.update_online_booking_settings({allow_website_bookings:toSaveValue}).then(
                        (result)=>{

                        });
    
        }
          this.original_list.forEach(element => {
                if( element.type=='colorpicker')
                {
                    let v = this.getSettingField(element.field)
                    if ( v != "")
                    {
                        if (typeof v === 'string' || 
                            v instanceof String)
                        {
                            //ok
                        }
                        else if (v.hex && v.hex !="")
                        {
                            this.website_booking_widget_setting[element.field] =v.hex
                        }   
                    }
    
                }
                if (element.type=='date_time_utc') 
                {
                    let v = this.getSettingField(element.field)
                    if (v !== undefined && v!= null && v!=0)
                    {
                        //Convert to ms
                        this.website_booking_widget_setting[element.field] = null;
                        this.website_booking_widget_setting[element.field]  = (+v) * 1000
                        
                    }
                    
                }
             });
        this.save_button_text ="Saving..."
        /*
        if (this.website_booking_widget_setting.cancel_hold_booking_after_minutes == true)
        {
            this.website_booking_widget_setting.cancel_hold_booking_after_minutes =  30;
        }
        else
        {
            this.website_booking_widget_setting.cancel_hold_booking_after_minutes =0
        }
        */
        //console.log(this.website_booking_widget_setting['booking_banner_display_until'])
        //return;
        this.$schedsdk.update_web_widget_settings(this.website_booking_widget_setting).then((result)=>{  
            
            if(result.status == 1)
            {
               this.alertData = {
                    message:result.message,
                    type:'success'
                }
                
                login_helper.get_and_save_business_settings(this.$schedsdk ,this.$store).then((tax_data)=>{
                //Got new business settings
                this.checkwebsitebookings(tax_data);
                });
                
            }
            else
            {
                this.alertData = {
                    message:result.message,
                    type:'danger'
                }
                this.alert = true;
                this.show=4;
            }
                this.alert = true;
                this.show=4;
            }).catch(ex=>{
                this.alertData = {
                    message:ex.data.message,
                    type:'danger'
                }
                this.alert = true;
                this.show=4;
            }).finally(()=>{   
                this.save_button_text ="Done"
        });
    },
    getSettingsList(){
        // console.log("search")
        // console.log(this.search)
        this.search = this.search.trim();
        var result = this.original_list;
        var search = this.search;
        if(search)
        {
            var condition = new RegExp('.*' + search + '.*', 'i');
            result = result.filter(function (el) {
                 return (condition.test(el.name));
                });
          
        }
        this.list = result;
       
    },
      alertClosedFn() {
            this.save_button_text ="Save Changes"
            this.show = 0;
        }
  }
    
}
</script>
<style scoped>
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 45px;
  height: 23px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(22px);
  -ms-transform: translateX(22px);
  transform: translateX(22px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>

