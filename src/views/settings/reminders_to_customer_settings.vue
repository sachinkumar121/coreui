<template>
  <div class="pt-2">
    <div class="row">
        <h5>Appointment Reminder Settings</h5><br><br>
    </div>
    <FilterSection>
        <template v-slot:filter-section-heading>
            <div class="settings-text">Search Settings</div>
        </template>
        <template v-slot:search-input>
            <input 
            v-model="search"
            class="form-control placeholder-no-fix" 
            @keyup="getSettingsList()"
            type="text" 
            />
        </template>
        <template v-slot:actions>
            <button class="btn btn-primary" 
                    @click="$router.push('/settings/business_messaging')">View Business Text/SMS Settings </button>
            <span>&nbsp;&nbsp;</span>
            <button class="btn btn-warning" 
                    @click="$router.push('/standalonepurchases')"> Purchase Credits </button>
        </template>
    </FilterSection>
        <div class="row  controls-div">
            <div class="col-md-8">
                <div class="form-group" >
                   <label class="control-label"><b>Business Text Messaging Enabled? </b>
                         &nbsp; <span v-if="business_messaging_settings.enable_business_customer_text_sms">Yes</span>
                         <span v-else>No. Enable here in <a href="javascript:void(0)" @click.prevent="$router.push('/settings/business_messaging')"> messaging settings</a></span>
                         </label>
                         <br>
                         <label class="control-label"><b>Business Voice Calling Enabled? </b>
                         &nbsp; <span v-if="business_messaging_settings.enable_business_customer_voice_calling">Yes</span>
                         <span v-else>No. Enable here in <a href="javascript:void(0)" @click="$router.push('/settings/business_messaging')"> text settings</a></span>
                         </label>  
                         

                </div>
             </div>
        </div>
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
          <br>

         <table class="table table-bordered">
          <thead>
              <tr>
                  <!-- <th>S.no</th> -->
                  <th>Name</th>
                  
                  <th>Action</th> 
              </tr>
          </thead>
          <tbody v-if="list.length">
              <tr v-for="item in listofsettings"   :key="item.name">
                  
                   
                  <td v-if="item.type == 'group'" colspan="2" class="text-center"> 
                        <strong>{{item.name}}</strong> 
                            &nbsp; <CIcon v-if="item.description && item.description.length>2" 
                                name="cil-CommentSquare"  
                                v-c-popover="getDescriptionObj(item)"/>
                  </td>
                  <td v-else>{{item.name}} 
                            <CIcon v-if="item.description && item.description.length>2" 
                                name="cil-CommentSquare"  
                                v-c-popover="getDescriptionObj(item)"/>
                        
                  </td>
                   <td v-if="item.type == 'number'"> 
                     <span class="col-md-4 col-lg-3 col-xl-2 d-inline-flex align-items-center" >{{getPreSymbol(  item)}} &nbsp;<input 
                          class=" form-control placeholder-no-fix" 
                        
                          type="text" 
                          v-model="reminder_to_customer_settings[item.field]"
                          />&nbsp;{{getPostSymbol( item)}}</span>
                  </td>
                   <td v-if="item.type == 'text'"> 
                     <textarea 
                          class="form-control placeholder-no-fix" 
                           v-model="reminder_to_customer_settings[item.field]"
                          ></textarea>
                  </td>
                  <td v-else-if="item.type == 'toggle'"> 
                    <CFormSwitch v-model="reminder_to_customer_settings[item.field]"
                         :value="getSettingField(item.field)"
                        @change="changeAction($event.target.value)"/>
                    </td>
                   <td v-else-if="item.type == 'colorpicker'"> 
                       <chrome-picker  
                        v-if="reminder_to_customer_settings[item.field]"
                        v-model="reminder_to_customer_settings[item.field]"></chrome-picker>
                  </td>   
                   <td v-else-if="item.type == 'metadata'"> 
                       <span>{{getItemMetadata(item)}}</span>
                       
                  </td>                    
                  <td v-else-if="item.type == 2"> 
                    Icon 
                  </td>
                  <td v-else-if="item.type == 'checkbox_options'"> 
                      <span  v-for="option in item.options_list"   :key="option.name">
                            <input v-if="option.is_enabled" type="checkbox" class="form-check-input" 
                            v-model="expanded_option_maps[item.field+'_'+option.value]">
                             <span v-if="option.is_enabled" >&nbsp;{{option.name}} 
                        &nbsp;&nbsp;</span>
                        </span> 
                  </td>
                  
                  <td v-else-if="item.type == 'date_time_utc'"> 
                        <flat-pickr  v-model="reminder_to_customer_settings[item.field]" 
                            :config="date_picker_config_utc_save" 
                            placeholder="Show Until Date"></flat-pickr>
                    </td>

               
              </tr>

              <tr>
                  <td colspan="2" class="text-center"> <button @click='saveSettings' 
                        class="btn btn-success float-end">{{ save_button_text }} </button></td>
              </tr>
               
          </tbody>
      </table>

    
    </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import FilterSection from '@/ui_components/FilterSection'
import Alerts from '../Alerts'
  
//import settings_json from "../../../settings";
import tag_to_route from "../../../tag_to_route";
import login_helper from '../../helpers/login_helper';
 
import { Chrome as Chromepicker } from '@ckpack/vue-color';

export default {
  name: 'OnlineBookingsSettings',
  components: { Alerts, flatPickr, FilterSection,
        'chrome-picker': Chromepicker },
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
          booking_url_info: '',
          product_url: 'not setup',
          website_booking_widget_setting: {},
          reminder_to_customer_settings: {},
          business_messaging_settings: {},
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
          color_test: {  hex: '#194d33e6'},
          expanded_option_maps : []
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
    this.channel_list =[
        {name: "E-Mail", value:  1, is_enabled:true},
        {name: "Text", value:  2, is_enabled:true},
        {name: "Voice", value:  3, is_enabled:true},
        {name: "Facebook", value:  4, is_enabled:false},
        {name: "Whatsapp", value:  5, is_enabled:false},
        
    ]
     this.channel_list_no_voice =[
        {name: "E-Mail", value:  1, is_enabled:true},
        {name: "Text", value:  2, is_enabled:true},
        {name: "Voice", value:  3, is_enabled:false},
        {name: "Facebook", value:  4, is_enabled:false},
        {name: "Whatsapp", value:  5, is_enabled:false},
        
    ]
    this.original_list = [
            {name: "Enabled Delivery Channels",                 type: "group",  field: '', 
                description : "Channels are mode of sending a message like email, voice phone call, text message, Facebook message. For each booking event, please select which channels we should send that message."+
                "\nIndividual customers may have set their own preference for text/voice calls and that will be honored."},
            {name: "Booking Created Event  ", type: "checkbox_options", options_list: this.channel_list_no_voice, field: 'booking_created', description : ""},
            {name: "Booking Cancelled Event    ",  type: "checkbox_options", options_list: this.channel_list_no_voice, field: 'booking_cancelled', description : ""},
            {name: "Booking Updated      ",  type: "checkbox_options", options_list: this.channel_list_no_voice, field: 'booking_updated', description : ""},
            {name: "Booking 1st Upcoming Reminder",  type: "checkbox_options", options_list: this.channel_list, field: 'booking_upcoming1', description : ""},
            {name: "Booking 2nd Upcoming Reminder",  type: "checkbox_options", options_list: this.channel_list, field: 'booking_upcoming2', description : ""},

            {name: "Appointment Reminders",                      type: "group",  field: ''},
            {name: "First reminder",     type: "number", field: 'booking_upcoming_remind_hours1',  unit:'hours', 
            description: 'How many hours ahead of the appointment time should we send a reminder to customer'},
            {name: "Second reminder",       type: "number", field: 'booking_upcoming_remind_hours2', unit:'hours'},
                   
        ];
     this.original_list.forEach(element => {
                if( element.type=='colorpicker')
                {
                    
                    if ( this.getSettingField(element.field) == "")
                    {
                        this.reminder_to_customer_settings[element.field] = '#ffffff'
                    }
    
                }
                if(element.type=="checkbox_options")
                {
                   //Expand to option_list_map;
                   let option_map_name =  element.field + "";
                   //this.expanded_option_maps[option_map_name] = new Map();
                   let me = this;
                   element.options_list.forEach(op => {
                       me.expanded_option_maps[option_map_name + "_" +op.value] = false;
                   })
                }
               
               
             });
     this.list = this.original_list
    
    this.$schedsdk.getIntegrationProviderStatus("ecommercepayments",{}).then(
                        (result)=>{
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
    getIsSelected(option_val, field_name)
    {
        var va = Object.prototype.hasOwnProperty.call(this.reminder_to_customer_settings, field_name);
      
      if (va)
        {
            let varv = this.reminder_to_customer_settings[field_name];
             return varv.includes(option_val) == true? true :false;
        }
        return false;

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
    check_if_channel_enabled()
    {
        //reminder_to_customer_settings
    },
    checkwebsitebookings(data){
      // this.allow_online_booking = true
        //console.log("Settings data ..... ");
        //console.log(data);
        if(data && data.status == 1)
        {
          let buss =  data.business_setting;
          this.allow_online_booking = buss.allow_website_bookings
          if (this.allow_online_booking )
          {
            this.booking_url = buss.booking_url; //buss.api_access_account_id;
            this.booking_url_info = buss.booking_url_info || "";
            this.product_url = buss.products_url;
            this.website_booking_widget_setting = buss.website_booking_widget_setting
            this.website_booking_widget_setting.allow_online_booking = buss.allow_website_bookings
            this.website_booking_widget_setting.cancel_hold_booking_after_minutes =  buss.cancel_hold_booking_after_minutes
          }
          else
          {
            this.booking_url = "not enabled";
            this.booking_url_info ="";
          }
          this.reminder_to_customer_settings = buss.reminder_to_customer_settings;
          this.business_messaging_settings = buss.business_messaging_settings;
        
          this.list.forEach(element => {
                if(element.type=="checkbox_options")
                {
                   //Expand to option_list_map;
                   let option_map_name =  element.field + "";
                   let me = this;
                   element.options_list.forEach(op => {
                       let v =  me.getIsSelected(op.value, element.field);
                      // me.expanded_option_maps[option_map_name].set(op.value, v)
                         me.expanded_option_maps[option_map_name + "_" +op.value] = v;
                   })
                //   console.log( me.expanded_option_maps)
                }
                
             });
          
        }
    },
    getArrayObjsFromOb(obj)
    {
        let ownProps = Object.keys( obj ),
        i = ownProps.length;
        let resArray = new Array(i); // preallocate the Array
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];
        return resArray;
    },
    saveSettings(){
        
       let me = this;
       let seen = {};
      this.getArrayObjsFromOb(this.expanded_option_maps).forEach((obj)=>{
            //console.log(obj);
            let value = obj[1]
            let v = obj[0].split("_");
            let channel = parseInt(v.pop());

            let orig_field = v.join("_");
            //console.log("key == " + orig_field + " channel " + channel + " val " + value)
            //console.log(seen[orig_field] )
            if (seen[orig_field] === undefined)
            {
                    me.reminder_to_customer_settings[orig_field] = [];
                    seen[orig_field] = true;
            }
            if(value == true)
            {
                me.reminder_to_customer_settings[orig_field].push(channel)
            }
        })
        this.save_button_text ="Saving..."
        this.$schedsdk.update_booking_reminder_settings({reminder_to_customer_settings: 
                    this.reminder_to_customer_settings}).then((result)=>{  
            
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
</style>

