<template>
<div>
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <form class="edit-service-form" @submit.prevent="UpdateService">
            <div class="form-body">
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Campaign Name</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="name"
                          />
                      </div>
                  </div>
                    <div class="col-md-8">
                      <div class="form-group">
                          <label class="control-label"><b>Template to use</b></label>
                            <v-select v-model="template_id" label="name" :options="template_list">
                            <template v-slot:no-options>
                                Type to search Target name..
                            </template>
                            <template v-slot:option="option" >
                                <div class="d-center">
                                {{ option.name }}
                                </div>
                            </template>
                            <template v-slot:selected-option="option" >
                                <div class="selected d-center">
                                {{ option.name }}
                                </div>
                            </template>
                            </v-select>
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-12">
                      <div class="form-group">
                          <label class="control-label"><b>Predefined Target Segment</b></label>
                            <v-select v-model="pre_defined_segment_name_arr" label="name" 
                                    :options="pre_defined_segment_names">
                            <template v-slot:no-options>
                                Type to search Target name..
                            </template>
                            <template v-slot:option="option" >
                                <div class="d-center">
                                {{ option.name }}
                                </div>
                            </template>
                            <template v-slot:selected-option="option" >
                                <div class="selected d-center">
                                {{ option.name }}
                                </div>
                            </template>
                            </v-select>
                      </div>
                  </div>
               </div>
               
            
              <div class="row">
                    <div class="col-md-6">
                        <div class="form-group" >
                            <label class="control-label"><b>Date to run</b></label>
                            <flat-pickr v-model="startDate" :config="date_picker_config" placeholder="Start Date"></flat-pickr>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group" >
                            <label class="control-label"><b>Time to run</b></label>
                            <flat-pickr v-model="startTime" :config="time_picker_config" placeholder="Start Time"></flat-pickr>
                        </div>
                    </div>
              </div>
              <div class="row">
                  <div class="col-md-6">
                      <div class="md-checkbox has-success">
                      <input type="checkbox" 
                      v-model="is_active" 
                      :checked = is_active
                      class="md-check form-check-input">
                      <label class="ms-2"><b>Is active?</b> </label>
                    </div>
                  </div>
                  
                   <div class="col-md-6">
                   
                       <b>Repeat Frequency</b>
                       <select 
                                class="form-control" 
                                v-model="repeat_freq">
                                <option v-for="opt in repeat_freq_options" 
                                v-bind:key="opt.value"
                                :value="opt.value">
                                {{opt.name}}</option>
                        </select>
                     
                  </div>
                  
              </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group" >
                            <label class="control-label"><b>Campaign end date (applicable only on repeating)</b></label>
                            <flat-pickr v-model="endDate" :config="date_picker_config" placeholder="End Date"></flat-pickr>
                        </div>
                    </div>
                    
              </div>
            
              <div class="row">
                  <br>
                  <div class="col-md-12">
                      <button class="btn btn-success float-end">Save</button>
                  </div>
              </div>
            </div>
        </form>
      </CCol>
    </CRow>
  </div>
</template>
<script>
import preset_array_helpers from '../../helpers/preset_arrays';
import { required, minValue } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {debounce as lodash_debounce} from 'lodash/core'
import Alerts from '../Alerts'
import moment from 'moment'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
export default {
    name: 'AddOrEditServices',
    components:{
        Alerts,
        flatPickr
    },
    setup: () => ({ v$: useVuelidate() }),
    data(){
      return({
        alert:false,
            show:0,
            alertData:{
                message:'',
                type:''
            },
            last_run_date: '',
            campaign_id: '',
            name:'',
            pre_defined_segment_names: [],
            pre_defined_segment_name_arr : [],
            is_active: true,
            template_id: "",
            template_list: [],
            date_picker_config: {
                    altFormat: "F j, Y",
                    altInput: true,
                    // minDate:Date.now()
                },
            time_picker_config: {
                    altInput: true,
                    noCalendar: true,
                    enableTime: true,
                    time_24hr: false,
                    monthSelectorType: "static"
                    // minDate:Date.now()
                },
             startDate : null,
             endDate: null,
             startTime : '',
             begin_date: '',
             end_date: '',
             repeat_freq_options :[
                 {name: "One time only. No repeat", value:0},
                 {name: "Weekly", value:2},
                 {name: "Monthly", value:3},
                 {name: "Yearly", value:4},
                 {name: "Manual only", value:99},
                 ],
            repeat_freq:0,
            currency_symbol: this.$store.state.business_settings.business_currency_symbol
      })
    },
    validations:{
      name:{
        required
      },
      description:{
        required
      },
      price:{
        required 
      },
      time:{
          required,
          minVal:minValue(0)
      }
    },
    created(){
      
        this.pre_defined_segment_names = preset_array_helpers.get_pre_defined_segment_names()
        //console.log(this.target_pre_defined_segment_name_arr)
        this.get_template_list();
        
    },
    methods:{
        get_template_list()
        {
              this.$schedsdk.list_marketing_templates({}).then((result)=>{
                if(result.status == 1){
                    this.template_list = result.data;
                }
                this.getServiceDetail()
            }).catch(ex=>{
                this.alertData = {
                    message:ex.message,
                    type:'danger'
                }
                this.alert = true;
                this.show=4;
            });

        },
        
        getServiceDetail(){
            if (!this.$route.params.campaign_id || 
                this.$route.params.campaign_id.length<1)
            {
                return;
            }
            this.$schedsdk.get_marketing_campaign_detail({_id:this.$route.params.campaign_id}).then((result)=>{
                
                if(result.status == 1){
                    this.campaign_id = result.data._id;
                    this.name = result.data.name;
                    this.template_id = result.data.template_id;
                    for(let i=0;i < this.template_list.length; i++)
                    {
                        if (this.template_list[i]._id == this.template_id)
                        {
                             this.template_id = this.template_list[i];
                        }
                    }
                    if (result.data.target_pre_defined_segment_name_arr && 
                        result.data.target_pre_defined_segment_name_arr.length)
                    {
                         this.pre_defined_segment_name_arr = result.data.target_pre_defined_segment_name_arr;
                    } 
                    else
                    {
                        this.pre_defined_segment_name_arr = [];
                    }
                    this.begin_date = result.data.begin_date ,
                    this.end_date = result.data.end_date 
                    if(this.end_date == null || this.end_date ==0 )
                    {
                        this.end_date = 0
                    }
                    this.repeat_freq = result.data.repeat_freq || 0,
                    this.is_active = result.data.is_active || true,
                    this.last_run_date = result.data.last_run_date;
                    this.startDate = moment(this.begin_date).format("YYYY-MM-DD"),
                    this.startTime = moment(this.begin_date).format("HH:mm");
                    if(this.end_date)
                    {
                            this.endDate = moment(this.end_date).format("YYYY-MM-DD")
                    }
                           
                }
            })
        },
        UpdateService(e){
            e.preventDefault();
            this.alert = false;
            this.show=0;
            let seg_name = [];
            //console.log("Asdasd** " + this.startDate +' '+ this.startTime )
          
            if( this.name == null || this.name.length <3 )
            {
                 this.alertData = {
                    message:'Please type in a name',
                    type:'danger'
                }
                this.alert = true;
                this.show=10;
                return;
            }
              
            seg_name.push(this.pre_defined_segment_name_arr.segment_name)
          
            if(this.pre_defined_segment_name_arr.length <1 || seg_name.length <1)
            {
                 this.alertData = {
                    message:'Please select a target segment',
                    type:'danger'
                }
                this.alert = true;
                this.show=10;
                return;
            }
            if( this.template_id == null || this.template_id.length <1)
            {
                 this.alertData = {
                    message:'Please select a template',
                    type:'danger'
                }
                this.alert = true;
                this.show=10;
                return;
            }
            if( this.startDate == null ||
                this.startTime == null )
            {
                 this.alertData = {
                    message:'Please select the date and time to run this campaign',
                    type:'danger'
                }
                this.alert = true;
                this.show=10;
                return;
            }
            let begindt = moment( this.startDate +' '+ this.startTime ).valueOf() 
            if(isNaN(begindt))
            {
                  this.alertData = {
                    message:'Please select a valid date and time to run this campaign',
                    type:'danger'
                }
                this.alert = true;
                this.show=10;
                return;
            }
            let enddt = 0
            enddt = moment( this.endDate +' 00:00').valueOf() 
            if(isNaN(enddt))
            {
                  enddt = 0
            }
            if(enddt > 1 && enddt <= begindt)
            {
                  this.alertData = {
                    message:'Campaign end date should be greater than start date',
                    type:'danger'
                }
                this.alert = true;
                this.show=10;
                return;
            }
            let data = {
                rec_id:this.campaign_id,
                description:    this.description,
                name:   this.name,
                is_active : this.is_active,
                target_pre_defined_segment_name_arr: this.pre_defined_segment_name_arr,
                template_id: this.template_id,
                begin_date       : begindt,
                end_date: enddt,
                repeat_freq: this.repeat_freq, 
                              
            }
            
            this.alert = false;
            if (this.campaign_id && this.campaign_id.length>2)
            {
                data._id = this.campaign_id
                
            }
            else
            {
                delete data._id;
            }
            this.$schedsdk.add_edit_marketing_campaign(data).then((result)=>{  
            if(result.status == 1){
                this.$router.push({name: 'List Marketing Campaigns'});
            }
            else{
                this.alertData = {
                    message:result.message,
                    type:'danger'
                }
                this.alert = true;
                this.show=10;
            }
            }).catch(ex=>{
                let msg = ex.message || ex.data? ex.data.message : ex.toString() || ex.toString()
            this.alertData = {
                message: msg,
                type:'danger'
            }
            this.alert = true;
            this.show=4;
            });

          },
        alertClosedFn() {
            this.show = 0;
        },
        getPopUpHelpObj(help_item)
        {
 
            let v = {
                        header: 'Description',
                        trigger: 'click',  
                        content: '',
                    }
            switch (help_item)
            {
                case 'help_gap_time':v.header = "Gap/Finish time in service"; 
                        v.content = "Setting Gap and Finish time to 1 or more minutes enables split service time. " +
                        "Service time becomes the 'initial service' time. " + 
                        "Gap time is a time slot where customer is not worked upon and this gap time is a bookable for another customer. " +
                        "Finish time is after gap time and the time where customer is worked upon again by same service provider. "
                        " Finish time is where provider is not bookable by another customer.<br/>"+
                        "Total Service time = Initial Service Time + Gap Time + Finish Time, with Gap time as bookable"
                        break;

                default:
                        break;    
            }
            return v;
        },
    }
}
</script>
<style scoped>
.invalid{
  border: 1Px solid red;
  /* background-color: lightcoral; */
  color: red;
}
.error-msg{
  color: red;
}
</style>