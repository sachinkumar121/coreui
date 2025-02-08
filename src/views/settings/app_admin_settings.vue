<template>
  <div class="pt-2"> 
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
          <!-- <br> -->
          <div class="row controls-div">
            <div class="settings-text" data-v-06c6e52f="">Filter Options</div>
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

            <div class="col-md-8 text-right justify-content-end d-flex flex-wrap align-items-center">
                <div class="mt-3 mt-md-0" >
                  <button @click='saveSettings'  class="btn btn-success float-end mt-sm-0 mt-3" >
                      {{ save_button_text }}</button>
                      <button class="btn btn-primary float-end mt-sm-0 mt-3 me-lg-2 me-2" @click="$router.push('/oauth_settings')">
                    Oauth As Service Settings
                  </button>
                </div>
            </div>
          </div>
          
         
            
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
                  </td>
                  <td v-else>{{item.name}} <CIcon v-if="item.description && item.description.length>2" 
                                name="cil-CommentSquare"  
                                v-c-popover="getDescriptionObj(item)"/> </td>
                   <td v-if="item.type == 'number'"> 
                     <span class="col-md-2 d-inline-block" >{{getPreSymbol(  item)}} &nbsp;<input 
                          class=" placeholder-no-fix form-control" 
                        
                          type="text" 
                          v-model="settings_obj[item.field]"
                          />&nbsp;{{getPostSymbol( item)}}</span>
                  </td>
                   <td v-if="item.type == 'text'"> 
                     <textarea 
                          class="form-control placeholder-no-fix form-control" 
                           v-model="settings_obj[item.field]"
                          ></textarea>
                  </td>
                  <td v-else-if="item.type == 'toggle'"> 
                    <CFormSwitch  v-model="settings_obj[item.field]"
                         :value="getSettingField(item.field)"
                        @change="changeAction($event.target.value)"/>
                    </td>
                   <td v-else-if="item.type == 'colorpicker'"> 
                       <chrome-picker  
                        v-if="settings_obj[item.field]"
                        v-model="settings_obj[item.field]"></chrome-picker>
                  </td>   
                   <td v-else-if="item.type == 'label'"> 
                       <label>{{ getSettingField(item.field)}}</label>
                  </td>  
                  <td v-else-if="item.type == 'link'"> 
                       <a href="javascript:void(0)"  @click.prevent="$router.push( item.field)" >{{ item.click_text || "click here" }}</a>
                  </td>                    
                  <td v-else-if="item.type == 2"> 
                    Icon 
                  </td>
                   <td v-else-if="item.type == 'input'"> 
                     <span class="col-md-8 d-block" ><input 
                          class=" placeholder-no-fix form-control" 
                          :v-text="settings_obj[item.field]"
                          type="text" 
                          v-model="settings_obj[item.field]"
                          /></span>
                  </td>
               
              </tr>

              <tr>
                  <td colspan="2" class="text-center"> <button @click='saveSettings' 
                        class="btn btn-success">{{ save_button_text }} </button></td>
              </tr>
               
          </tbody>
      </table>
    </CCol>
    </CRow>
    </div>
</template>

<script>
import { required, minValue } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import Alerts from '../Alerts'
  
import settings_json from "../../../settings";
import tag_to_route from "../../../tag_to_route";
//import login_helper from '../../helpers/login_helper';
import utils_lib from '../../helpers/utils_lib';

//16,23:             <td> {{getPhoneFormatted(booking_detail.customer.phone, 'US')  }}</td>16,23:             <td> {{getPhoneFormatted(booking_detail.customer.phone, 'US')  }}</td>
import { Chrome as Chromepicker } from '@ckpack/vue-color';

export default {
  name: 'AppAdminSettings',
  components: { Alerts, 
        'chrome-picker': Chromepicker },
  setup: () => ({ v$: useVuelidate() }),
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
            {name: "UX Monitoring",   type: "input", field: 'ux_monitoring_selection' , 
                            description: "UX Monitoring for general, logrocket, browsee, clarity, fullstory"},
            {name: "UX monitoring web app",           type: "input", 
                        field: 'ux_monitoring_selection_webui',
                        description: "UX Monitoring for web app"},
            {name: "Enable crisp chat for support",   type: "toggle", field: 'enable_crisp_chat_for_support'},
            {name: "Enable app wide animations feature",   type: "toggle", field: 'enable_app_animations'},
            {name: "Enable quote system feature",   type: "toggle", field: 'enable_app_quote_system'},
            {name: "Enable AI Chatbot Support feature",   type: "toggle", field: 'enable_ai_chatbot_for_support'},
            {name: "App Info",   type: "group", field: ''},
            {name: "App Environment",   type: 'label', field: 'app_info.app_environment'},
            {name: "App Version",   type: 'label', field: 'app_info.app_version'},
            {name: "NodeJS ver.",   type: 'label', field: 'app_info.nodejs_core_ver'},
            {name: "NodeJS V8 ver. ",   type: 'label', field: 'app_info.nodejs_v8_ver'},
            {name: "Hosted IP",   type: 'label', field: 'app_info.host_ip'},
            {name: "DB Server",   type: 'label', field: 'app_info.db_server_address'},
            {name: "DB Name",   type: 'label', field: 'app_info.db_name'},
            {name: "DB User",   type: 'label', field: 'app_info.db_username'},
            {name: "DB Version",   type: 'label', field: 'app_info.db_version'},
            {name: "App Source Code",   type: "group", field: ''},
            {name: "Code Hash",   type: 'label', field: 'src_deployment.app_source_code_vc_hash'},
            {name: "Code Branch",   type: 'label', field: 'src_deployment.app_source_code_vc_branch'},
            {name: "Code Updated",   type: 'label', field: 'src_deployment.app_source_code_last_update_ts'},
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
             
    this.$schedsdk.get_app_admin_settings().then( (bm_data)=>{
        //Got new business settings
        //console.log("in datat dmd ")
        //console.log(bm_data.booking - settings);
         this.checksettingsobjs(bm_data)
        //console.log("asdsad ", this.settings_obj)
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
       
        let splti = field_name.split(".");
        let sobj = this.settings_obj
        if (splti.length > 1)
        {
          sobj = sobj[splti[0]]  //step in one
          field_name = splti[1]
        }
        //console.log("asdasdasd0a0sd0 ",field_name)
        let v = ""
        
        try
        {
          v = Object.prototype.hasOwnProperty.call(sobj, field_name)? 
          sobj[ field_name] : ""
        }
        catch(ex)
        {
          //console.log("Failed ", field_name)
        }
        return v;
        
            
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
        if(data && data.status == 1)
        {
            this.settings_obj = {} //JSON.parse(JSON.stringify( data.data));
            
            //this.settings2_ro_data = data.data
             
            //copy from messaging_settings_data into settings obj with different name so that automatic display works seamlessly
            this.settings_obj.ux_monitoring_selection =  
                                data.data.ux_monitoring_selection
            this.settings_obj.ux_monitoring_selection_webui =  
                                data.data.ux_monitoring_selection_webui
            this.settings_obj.enable_crisp_chat_for_support =  
                                data.data.enable_crisp_chat_for_support
            this.settings_obj.enable_app_animations =
                                data.data.enable_app_animations
            this.settings_obj.enable_app_quote_system = data.data.enable_app_quote_system
            this.settings_obj.enable_ai_chatbot_for_support = data.data.enable_ai_chatbot_for_support
            this.settings_obj._id =  
                                data.data._id
            this.settings_obj.app_info = {}
              if (data.app_info && data.app_info.app_version)
              {
                this.settings_obj.app_info = data.app_info
              }
            this.settings_obj.src_deployment = {}
              if (data.src_deployment )
              {
                this.settings_obj.src_deployment = data.src_deployment
              }
        }
        //console.log("asdasdasd-----s-s-s", this.settings_obj)
    },
    saveSettings(){
        
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
        
        this.$schedsdk.update_app_admin_settings({
                    data: JSON.parse(JSON.stringify(this.settings_obj))}).then((result)=>{  
            
            if(result.status == 1)
            {
               this.alertData = {
                    message:result.message,
                    type:'success'
                }
                this.$schedsdk.get_app_admin_settings().then((bm_data)=>{
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
.settings-text {
    position: absolute;
    background: #fff;
    padding: 3px 6px;
    top: -15px;
    left: 15px;
    font-size: 16px;
    font-weight: bold;
}
.controls-div {
    float: left;
    width: 100%;
    border: 1px solid #d8dbe0;
    padding: 15px 4px;
    margin: 0 0 1rem 0!important;
    padding-top: 20px;
    position: relative;
}
</style>

