<template>
  <div class="pt-2">
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
          <br>
          <FilterSection>
            <template v-slot:search-input>
              <div class="form-group" >
                <label class="control-label"><b>Search</b></label>
                <input 
                v-model="search"
                class="form-control placeholder-no-fix" 
                @keyup="getSettingsList()"
                type="text" 
                />
              </div>
            </template>
            <template v-slot:actions>
              <div class="form-group mb-0" >
                <button @click='saveSettings'  class="btn btn-success float-end" >
                  {{ save_button_text }}</button>
              </div>
            </template>
          </FilterSection>
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
                     <span >{{getPreSymbol(  item)}} &nbsp;<input 
                          class="col-md-2  placeholder-no-fix" 
                        
                          type="text" 
                          v-model="settings_obj[item.field]"
                          />&nbsp;{{getPostSymbol( item)}}</span>
                  </td>
                   <td v-if="item.type == 'text'"> 
                     <textarea 
                          class="form-control placeholder-no-fix" 
                           v-model="settings_obj[item.field]"
                          ></textarea>
                  </td>
                  <td v-else-if="item.type == 'toggle'"> 
                    <CFormSwitch v-model="settings_obj[item.field]"
                         :value="getSettingField(item.field)"
                        @change="changeAction($event.target.value)"/>
                    </td>
                   <td v-else-if="item.type == 'colorpicker'"> 
                       <chrome-picker  
                        v-if="settings_obj[item.field]"
                        v-model="settings_obj[item.field]"></chrome-picker>
                  </td>   
                   <td v-else-if="item.type == 'label'"> 
                       <label>{{ settings_obj[item.field]}}</label>
                  </td>  
                  <td v-else-if="item.type == 'link'"> 
                       <a href="javascript:void(0)"  @click.prevent="$router.push( item.field)" >{{ item.click_text || "click here" }}</a>
                  </td>                    
                  <td v-else-if="item.type == 2"> 
                    Icon 
                  </td>
                   <td v-else-if="item.type == 'input'"> 
                     <span ><input 
                          class="col-md-8  placeholder-no-fix form-control" 
                          :v-text="settings_obj[item.field]"
                          type="text" 
                          v-model="settings_obj[item.field]"
                          /></span>
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
import { required, minValue } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import Alerts from '../Alerts'
import FilterSection from '@/ui_components/FilterSection'  
import settings_json from "../../../settings";
import tag_to_route from "../../../tag_to_route";
//import login_helper from '../../helpers/login_helper';
import utils_lib from '../../helpers/utils_lib';

//16,23:             <td> {{getPhoneFormatted(booking_detail.customer.phone, 'US')  }}</td>16,23:             <td> {{getPhoneFormatted(booking_detail.customer.phone, 'US')  }}</td>
import { Chrome as Chromepicker } from '@ckpack/vue-color';

export default {
  name: 'ReceiptPrinterSettings',
  components: { Alerts, FilterSection,
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
            {name: "Override Receipt Print Width Value",   type: "input", field: 'rp_override_print_width_val' , 
                            description: "If receipt width is not correct, you can set the value here in px. If you don't want to override leave it at 0 or empty",
                            unit: "px"
                            },

            {name: "Print Customer Name on receipt",   type: "toggle", field: 'print_customer_name_on_receipt'},
            {name: "Print Customer Phone on receipt",                    type: "toggle",  field: 'print_customer_phone_on_receipt'},
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
             
    this.$schedsdk.get_receipt_print_settings().then((bm_data)=>{
        //Got new business settings
        //console.log("in datat dmd ")
        //console.log(bm_data.booking_settings);
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
        console.log("Settings data ..... ");
        console.log(data);
        if(data && data.status == 1 &&  data.data)
        {
            this.settings_obj = data.data
            
            this.settings2_ro_data = data
             
            //copy from messaging_settings_data into settings obj with different name so that automatic display works seamlessly
            this.settings_obj.rp_override_print_width_val =  data.data.receipt_printer_settings.rp_override_print_width_val
            this.settings_obj.print_customer_name_on_receipt =  data.data.receipt_printer_settings.print_customer_name_on_receipt
            this.settings_obj.print_customer_phone_on_receipt =  data.data.receipt_printer_settings.print_customer_phone_on_receipt
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
        this.$schedsdk.update_receipt_print_settings({receipt_printer_settings: this.settings_obj}).then((result)=>{  
            
            if(result.status == 1)
            {
               this.alertData = {
                    message:result.message,
                    type:'success'
                }
                this.$schedsdk.get_receipt_print_settings().then((bm_data)=>{
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

