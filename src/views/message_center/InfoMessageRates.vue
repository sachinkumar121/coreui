<template>
  <div class="pt-2">
      <div class="row">
        <h5>Message Rate Table</h5><br><br>
    </div>
  
    <div>
    <div class="row">
        <span>
        <CButton @click.prevent="showRateTable" color="primary">Show Rate Table</CButton>
    </span>
    </div>
    </div>
   <message-usage-summary-comp
                                :show_statistics="show_statistics"
                                :show_rates_table="show_rates_table"
                                @close="closeStatsModal"
                            />

    </div>
</template>

<script>
import Alerts from '../Alerts'
  
import settings_json from "../../../settings";
import tag_to_route from "../../../tag_to_route";
//import login_helper from '../../helpers/login_helper';
import utils_lib from '../../helpers/utils_lib';
import messageUsageSummaryComp from '@/common/MessageUsageSummaryComp';

//16,23:             <td> {{getPhoneFormatted(booking_detail.customer.phone, 'US')  }}</td>16,23:             <td> {{getPhoneFormatted(booking_detail.customer.phone, 'US')  }}</td>
import { Chrome as Chromepicker } from '@ckpack/vue-color';

export default {
  name: 'OnlineBookingsSettings',
  components: { Alerts, messageUsageSummaryComp,
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
          settings_obj: {},
          settings2_ro_data : {},
          show_statistics : false,
          show_rates_table: true,
          alertData:{
              message:'',
              type:''
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
            {name: "Options",                             type: "group",  field: ''},
            {name: "Enable Text/SMS messaging for reminders",   type: "toggle", field: 'enable_business_customer_text_sms',
             description: 'Appointment reminders can be set via text if this is enabled. Each message consumes some message credit'
                },
            {name: "Enable Two way Text/SMS (optional)",  type: "toggle", field: 'enable_two_way_text_sms',
                            description: 'Two way text allows customers to confirm or cancel appointments via replies to text. Each in or out message consumes some message credit'},
            {name: "Enable voice calls (optional)",       type: "toggle", field: 'enable_business_customer_voice_calling',
                    description: 'Enabling voice calls enables automatic calls to remind customer via an automated phone call. You must also enable voice channel in booking reminders.'},
 

           
            {name: "Handling unprocessed incoming messages", type: "group",  field: '', description:  
                    'Your assigned business phone receives responses from your customer like \
                        confirm appointment or check-in by text. \
                        These responses are automatically handled. \
                        <br>However, sometimes customers may text your business number for other help. \
                <br>You can have such messages forwarded to you by a text and/or email'},
            {name: "Enable Unprocessed Text/SMS Forwarding",     type: "toggle", 
                                        field: 'enable_unprocessed_text_forwarding',
                description: 'Enable Forward unprocessed text feature.'},
    /*        {name: "Enable  Unprocessed Voice Call Forwarding",     type: "toggle", 
                                        field: 'enable_unprocessed_call_forwarding',
                    description: 'Forward any voice calls to number below, if voice calls are not handled by app automatically.'},
*/
            {name: "Forward Unprocessed Text/SMS to phone",  type: "input", field: 'unprocessed_text_forwarding_phone'},
        //    {name: "Forward Unprocessed voice calls to phone",  type: "input", field: 'unprocessed_call_forwarding_phone'},
            {name: "Forward Unprocessed Text/SMS to E-Mail", type: "input",
                         field: 'unprocessed_text_forwarding_email',
                          description: 'Any unprocessed text/sms will be forwarded to the email provided here.'},
         
            {name: "Information",                         type: "group",  field: ''},
            {name: "Phone number assigned for your business", type: "label",  field: 'internal_text_messaging_phone_number',
                    description: 'Business phone number assigned to your business used to send appointment notifications and other text/voice messages to your customer.'},
            {name: "Phone number status", type: "label",  field: 'internal_text_messaging_phone_number_status'},
            {name: "Phone number used to send your business marketing texts", type: "label",  
                                                    field: 'internal_text_marketing_phone_number',
                        description: 'Business phone number assigned to your business used to send marketing/promotional messages. \
                                A separate number is used to increase your deliverability and to comply with FCC rules'},
            {name: "Phone number status (Marketing)", type: "label",  field: 'internal_text_marketing_phone_number_status'},
 
            {name: "Available Messaging Credits",         type: "label",  field: 'internal_total_available_credits',
                        description: 'Every message sent or received on any channel consumes some credits. \
                        Every month you get 4 to 5 credits included in your plan. This provides like 130 - 150 messages. You can purchase additional credits if you have more message usage'},
            {name: "View messaging credit usage statistics",      
                       type: "call_local_handler",  field: 'view_messaging_stats',
                        description: 'View how many credits were used and other statistics over last 4 weeks. \
                       '},
           
           {name: "Purchase additional credits?",  type: "link",   field: '/standalonepurchases', click_text: "Order here",
                    description: 'Every message sent or received on any channel consumes some credits. \
                        Every month you get 4 to 5 credits included in your plan. This provides like 130 - 150 messages. You can purchase additional credits if you have more message usage'},
            
            {name: "Messaging Credits Purchase History",  type: "link",   field: '/settings/business_messaging/credits_purchase_history', click_text: "View"},
            {name: "Estimated Available Texts",           type: "label",  field: 'internal_estimated_messages'},
            {name: "Texts sent this month",               type: "label",  field: 'internal_text_messages_sent_this_month'},
            {name: "Texts received this month",           type: "label",  field: 'internal_text_messages_received_this_month'},
            
                 ];
     this.list = this.original_list
     this.original_list.forEach(element => {
                if( element.type=='colorpicker')
                {
                    
                    if ( this.getSettingField(element.field) == "")
                    {
                        this.settings_obj[element.field] = '#ffffff'
                    }
    
                }
             });
             
    this.$schedsdk.get_business_messaging().then((bm_data)=>{
        //Got new business settings
        this.checksettingsobjs(bm_data)
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
    hasPage(tag) {
      return Object.keys(this.tag_to_route).includes(tag);
    },
    getSettingField(field_name)
    {
        //console.log("asdasdasd" + field_name)
        return Object.prototype.hasOwnProperty.call(this.settings_obj, field_name)? this.settings_obj[ field_name] : ""
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
    checksettingsobjs(data){
      // this.allow_online_booking = true
        //console.log("Settings data ..... ");
        //console.log(data);
        if(data && data.status == 1)
        {
            this.settings_obj = data.messaging_settings_data
            
            this.settings2_ro_data = data
            if(this.settings2_ro_data.text_messaging_phone_number)
            {
                let cc = "US"
                this.settings2_ro_data.text_messaging_phone_number = utils_lib.getPhoneFormatted(this.settings2_ro_data.text_messaging_phone_number, cc)
                 
            }
            if(this.settings2_ro_data.text_marketing_phone_number)
            {
                let cc = "US"
                this.settings2_ro_data.text_marketing_phone_number = utils_lib.getPhoneFormatted(this.settings2_ro_data.text_marketing_phone_number, cc)
                 
            }
            
            //copy from messaging_settings_data into settings obj with different name so that automatic display works seamlessly
            this.settings_obj.internal_total_available_credits =  data.total_available_credits
            this.settings_obj.internal_estimated_messages =  data.estimated_messages
            this.settings_obj.internal_text_messages_sent_this_month =  data.text_messages_sent_this_month
            this.settings_obj.internal_text_messages_received_this_month =  data.text_messages_received_this_month
            this.settings_obj.internal_text_messaging_phone_number =  this.settings2_ro_data.text_messaging_phone_number 
            this.settings_obj.internal_text_messaging_phone_number_status =  data.text_messaging_phone_number_status
            this.settings_obj.internal_text_marketing_phone_number =  this.settings2_ro_data.text_marketing_phone_number 
            this.settings_obj.internal_text_marketing_phone_number_status =  data.text_marketing_phone_number_status
          
        }
    },
    saveSettings(){
        console.log(this.settings_obj)
        
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
                            this.settings_obj[element.field] =v.hex
                        }   
                    }
    
                }
             });
        this.save_button_text ="Saving..."
        this.$schedsdk.update_business_messaging({business_messaging_settings: this.settings_obj}).then((result)=>{  
            
            if(result.status == 1)
            {
               this.alertData = {
                    message:result.message,
                    type:'success'
                }
                this.$schedsdk.get_business_messaging().then((bm_data)=>{
                        //Got new business settings
                        this.checksettingsobjs(bm_data)
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
        },
    closeStatsModal()
    {
        this.show_statistics = false;
        this.show_rates_table = false;
    },
    showRateTable()
    {
        console.log("Asdasd==")
        this.show_statistics = false;
        this.show_rates_table = true;
    },
    local_handler(tag)
    {
        switch(tag)
        {
            case 'view_messaging_stats':
                {
                    this.show_statistics =true
                }

        }
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

