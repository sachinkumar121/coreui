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
                          <label class="control-label"><b>Service Name</b></label>
                          <input 
                          :class={invalid:v$.name.$error}
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="name"
                          @blur="v$.name.$touch()" 
                          />
                          <p class="error-msg" v-if="v$.name.$dirty && v$.name.required.$invalid">This field must not be empty.</p>
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Description</b></label>
                          <input class="form-control placeholder-no-fix"
                           type="text" 
                           v-model="description"
                           :class={invalid:v$.description.$error}
                           @blur="v$.description.$touch()" 
                            />
                           <p class="error-msg" v-if="v$.description.$dirty && v$.description.required.$invalid">This field must not be empty.</p> 
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Service Category</b></label>
                            <v-select v-model="service_category" label="name" :options="categories_option">
                            <template v-slot:no-options>
                                Type to search Business name..
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
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Service Price</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          v-model="price" 
                          :class={invalid:v$.price.$error}
                          @blur="v$.price.$touch()" 
                          />
                          <p class="error-msg" v-if="v$.price.$dirty && v$.price.required.$invalid">This field must not be empty.</p> 
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Service Time (In Mins)</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="time"
                          />
                          <p class="error-msg" v-if="v$.time.$dirty && v$.time.required.$invalid">This field must not be empty.</p> 
                          <p class="error-msg" v-if="v$.time.$dirty && v$.time.minVal.$invalid">time must be greater than 0.</p> 
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Buffer before next booking (In Mins.)</b> <CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover="getPopUpHelpObj('help_buffer_time')"/></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          v-model="buffer_time_before_next" 
                          />
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="md-checkbox has-success">
                      <input type="checkbox" 
                      v-model="status" 
                      :checked=status
                      class="md-check form-check-input">
                      <label class="ms-2"><b>Mark as active</b> </label>
                    </div>
                  </div>
                  <div class="col-md-4">
                      <div class="md-checkbox has-success">
                      <input type="checkbox" 
                      v-model="is_online_bookable" 
                      :checked = is_online_bookable
                      class="md-check form-check-input">
                      <label class="ms-2"><b>Online Bookable? </b> </label>
                    </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Gap Time (In Mins.) </b><CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover="getPopUpHelpObj('help_gap_time')"/></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          v-model="gap_time" 
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Finish Time (In Mins.)</b><CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover="getPopUpHelpObj('help_finish_time')"/></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          v-model="finish_time" 
                          />
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="md-checkbox has-success">
                      <input type="checkbox" 
                      v-model="requires_multi_providers" 
                      :checked = requires_multi_providers
                      class="md-check form-check-input">
                      <label class="ms-2"><b>Require multi provider selection</b> </label>
                    </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Required No. of providers (max. 2)</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          v-model="multi_providers_count" 
                          />
                      </div>
                  </div>
              </div>              
              <div class="row">
                  <div class="col-md-4">
                      <div class="md-checkbox has-success d-flex">
                      <input type="checkbox" 
                      v-model="require_package_discount_code_for_online" 
                      :checked = require_package_discount_code_for_online
                      class="md-check form-check-input">
                      <label class="ms-2"><b>Require package/coupon code when booking online</b> </label>
                    </div>
                  </div>
                  <div class="col-md-4" v-if="enable_standard_resources">
                      <div class="form-group">
                          <label class="control-label"><b>Require a Room/Equipment?</b><CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover="getPopUpHelpObj('help_required_standard_resource_groups')"/></label>
                            <v-select v-model="resources" multiple label="group_name" :options="resources_option">
                            <template v-slot:no-options>
                                Type to search Resources..
                            </template>
                            <template v-slot:option="option" >
                                <div class="d-center">
                                {{ option.group_name }}
                                </div>
                            </template>
                            <template v-slot:selected-option="option" >
                                <div class="selected d-center">
                                {{ option.group_name }}
                                </div>
                            </template>
                            </v-select>
                            <br>
                            <small>Note Multi provider services (couples appt.) will use one resource/room for all providers.<CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover="getPopUpHelpObj('help_multi_provider_resources')"/></small>
                      </div>
                  </div>
                  <div class="col-md-4" v-if="!enable_standard_resources">
                      <div class="form-group">
                          <label class="control-label"><b>Require a Resource type(Like Room/Equipment)?</b><CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover="getPopUpHelpObj('help_required_resource_groups')"/></label>
                            <v-select v-model="resources" multiple label="group_name" :options="resources_option">
                            <template v-slot:no-options>
                                Type to search Resources..
                            </template>
                            <template v-slot:option="option" >
                                <div class="d-center">
                                {{ option.group_name }}
                                </div>
                            </template>
                            <template v-slot:selected-option="option" >
                                <div class="selected d-center">
                                {{ option.group_name }}
                                </div>
                            </template>
                            </v-select>
                            <br>
                            <small>Note Multi provider services (couples appt.) will use one resource/room for all providers.<CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover="getPopUpHelpObj('help_multi_provider_resources')"/></small>
                      </div>
                  </div>
              </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="md-checkbox has-success">
                    <input type="checkbox" 
                      v-model="create_online_meeting_for_booking" 
                      :checked = create_online_meeting_for_booking
                      class="md-check form-check-input">
                      <label class="ms-2">
                        <b>Create online meeting for booking</b>
                      </label>
                    </div>
                  </div>
                  <div class="col-md-4"> &nbsp;</div>
              </div> 

                <div class="row">
                  <div class="col-md-6">
                      <div class="md-checkbox has-success">
                      <input type="checkbox" 
                      v-model="enable_flexible_time" 
                      :checked = enable_flexible_time
                      class="md-check form-check-input">
                      <label class="ms-2"><b>Enable Service variation (variable time/price)</b> <CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover="getPopUpHelpObj('help_variable_time_selection')"/>
                                     </label>
                    </div>
                  </div>
                  <div class="col-md-4"> &nbsp;</div>
              </div>  
            
               <div class="row table-responsive" v-if='enable_flexible_time'>
                  <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Note <CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover="getPopUpHelpObj('help_note_on_variable_item')"/></th>
                            <th>Time (mins)<CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover="getPopUpHelpObj('help_variable_item_time')"/></th>
                            <th>Total Price<CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover="getPopUpHelpObj('help_variable_item_price')"/></th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in selectable_times" :key="index">
                            <td> 
                                <input type="text" class="form-control" size="10" 
                                v-model="item.note"
                                @keyup="changeSelectablenote(index, $event)"/>
                            </td>
                            <td> 
                                <div class="d-flex align-items-center gap-2">
                                    <div class="col-md-5 col-lg-4">
                                        <input type="text" class="form-control" size="4" 
                                v-model="item.time"
                                @keyup="changeSelectableTime(index, $event)"/>
                                    </div> <span>Mins</span> 
                                </div>
                            </td>
                            <td>
                                <div class="d-flex align-items-center gap-2">
                                <span>{{currency_symbol}}</span>
                                <div class="col-md-10 col-lg-8">
                                <input type="text" class="form-control"  size="4" 
                            v-model="item.price"
                            @keyup="changeSelectableprice(index,$event)"/>
                                </div>
                                </div>
                            </td>
                            <td align="right"> <button  @click.prevent="removeRowForSelectableTimes(index)" class="btn btn-danger">Remove</button></td>
                        </tr>
                        <tr align="right"><td colspan="4">
                             <button  @click.prevent="addRowForSelectableTimes" class="btn btn-success">Add Row</button>
                        </td>
                        </tr>
                    </tbody>
                  </table>
              </div> <!-- end table of rows and prices -->
              
              <div class="row">
                  <div class="col-md-8">
                      <div class="form-group">
                          <label class="control-label"><b>Instructions to Customer</b></label>
                          <textarea rows="5"
                           style="min-height:80px"
                          class="form-control placeholder-no-fix" 
                          v-model="instructions_to_customer" 
                          placeholder="Instructions to customer about this service. This will be shown during booking"
                          ></textarea>
                      </div>
                  </div>
              </div>

              <div class="row">
                  <br>
                  <div class="col-md-8">
                      <button class="btn btn-success float-end">Update</button>
                  </div>
              </div>
            </div>
        </form>
      </CCol>
    </CRow>
  </div>
</template>
<script>
import { required, minValue } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {debounce as lodash_debounce} from 'lodash/core'
import Alerts from '../Alerts'
export default {
    name: 'AddOrEditServices',
    components:{
        Alerts
    },
    setup: () => ({ v$: useVuelidate() }),
    computed: {
      
        enable_standard_resources() {
            return this.$store.state?.business_settings?.enable_standard_resources === null?false:this.$store.state?.business_settings?.enable_standard_resources;
        } 
    },
    data(){
      return({
        categories_option:[],
        resources_option:[],
        alert:false,
            show:0,
            alertData:{
                message:'',
                type:''
            },
            service_id:'',
            description:'',
            in_quick_select:false,
            name:'',
            is_online_bookable:true,
            price: 1 ,
            service_category:'',
            status:true,
            time:0,
            resources:[],
            split_times:[],
            gap_time:0,
            finish_time:0,
            requires_multi_providers: false,
            multi_providers_count: 1,
            require_package_discount_code_for_online: false,
            buffer_time_before_next: 0 ,
            enable_flexible_time: false,
            selectable_times: [],
            instructions_to_customer: null,
            currency_symbol: this.$store.state.business_settings.business_currency_symbol,
            create_online_meeting_for_booking: false
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
        this.getServiceCategories();
        this.getServiceDetail();
        this.getResourceGroups();
    },
    methods:{
        getStatus(s)
        {
            return s == 1 || s == "1"
        },
        addRowForSelectableTimes()
        {
            this.selectable_times.push({time:0, price: 0 })
        },
        removeRowForSelectableTimes(index)
        {
             //console.log("===");
             ///console.log(index);
             let ds = this.selectable_times.splice(index,1)
             //console.log(ds);
             //this.selectable_times = ds
        },
         changeSelectablenote(index,event){
            this.selectable_times[index].note = event.target.value
        },
       
        changeSelectableprice(index,event){
            this.selectable_times[index].price = event.target.value
        },
        changeSelectableTime(index,event){
            this.selectable_times[index].time = event.target.value
        },
        getServiceCategories(){
            this.$schedsdk.get_service_categories({page_no:1}).then((result)=>{
                if(result.status == 1){
                    this.categories_option = result.data;
                }
            }).catch(ex=>{
                this.alertData = {
                    message:ex.message,
                    type:'danger'
                }
                this.alert = true;
                this.show=4;
            });
        },
        getResourceGroups(){
            this.$schedsdk.get_resource_groups({}).then((result)=>{
                if(result.status == 1){
                    if (this.enable_standard_resources)
                    {
                        this.resources_option =   result.data.filter(v => v.is_standard_group ==true)
                    }
                    else
                    {
                        this.resources_option = result.data;
                    }
                    
                }
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
            if (!this.$route.params.service_id || 
                this.$route.params.service_id.length<1)
            {
                return;
            }
            this.$schedsdk.get_service_detail({service_id:this.$route.params.service_id}).then((result)=>{
                
                if(result.status == 1){
                    this.service_id = result.data._id
                    this.description = result.data.description
                    this.in_quick_select = result.data.in_quick_select,
                    this.name = result.data.name,
                    this.is_online_bookable = result.data.is_online_bookable,
                    this.price= result.data.price ,
                    this.service_category = result.data.service_category,
                    this.status = result.data.status == 1,
                    this.time = result.data.time,
                    this.resources = result.data.resource_group_ids;
                    this.create_online_meeting_for_booking = result.data.create_online_meeting_for_booking
                    
                    let gap = result.data.split_times.find((obj)=>{
                    if(obj.type == 1)
                        return obj;
                    });
                    let finish = result.data.split_times.find((obj)=>{
                    if(obj.type == 0)
                        return obj;
                    });
                    this.gap_time = gap ? gap.time : 0;
                    this.finish_time =  finish ? finish.time : 0;
                    this.requires_multi_providers =  result.data.requires_multi_providers !== undefined ? 
                                                        result.data.requires_multi_providers : 
                                                        false;
                    this.multi_providers_count =  result.data.multi_providers_count !== undefined ?  
                                                    result.data.multi_providers_count : 
                                                    false;
                    this.require_package_discount_code_for_online = result.data.require_package_discount_code_for_online !== undefined? 
                                                    result.data.require_package_discount_code_for_online : 
                                                    false;
                    this.buffer_time_before_next = result.data.buffer_time_before_next
                    if (result.data.selectable_times )
                    {
                        this.selectable_times = result.data.selectable_times
                    }
                    if(result.data.enable_flexible_time !== undefined)
                    {
                        this.enable_flexible_time =result.data.enable_flexible_time
                    }
                    if (result.data.instructions_to_customer != null)
                    {
                        this.instructions_to_customer = result.data.instructions_to_customer
                    }
                  
                }
            })
        },
        UpdateService(e){
            e.preventDefault();
            this.v$.$touch()
            let data = {
            //    _id:this.service_id,
                description:this.description,
                in_quick_select:this.in_quick_select,
                name:this.name,
                is_online_bookable:this.is_online_bookable,
                price : this.price,
                service_category : this.service_category._id,
                status : (this.status === true || this.status === null)?1:0,
                time : this.time,
                split_times:[
                    {index:1,time:this.gap_time,type:1},
                    {index:2,time:this.finish_time,type:0}
                ],
                resource_group_ids : this.resources.map((resource)=>{return resource._id}),
                gap_time : this.gap_time,
                finish_time :this.finish_time,
                requires_multi_providers: this.requires_multi_providers,
                multi_providers_count: this.multi_providers_count,
                require_package_discount_code_for_online: this.require_package_discount_code_for_online,
                buffer_time_before_next: this.buffer_time_before_next,
                selectable_times : this.selectable_times,
                enable_flexible_time: this.enable_flexible_time,
                instructions_to_customer: this.instructions_to_customer,
                create_online_meeting_for_booking: this.create_online_meeting_for_booking
                
            }
            
            if(!this.v$.$invalid)
            {
                this.alert = false;
                let reprom = null;
                if (this.service_id && this.service_id.length>2)
                {
                    data._id = this.service_id
                    reprom =  this.$schedsdk.edit_service(data);
                }
                else
                {
                    reprom =  this.$schedsdk.add_service(data);
                }                
                reprom.then((result)=>{  
                if(result.status == 1){
                    this.$router.push('/services/list');
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
            }
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
                case 'help_variable_time_selection': v.header = "Variable time/service selection"; 
                        v.content = "This option is useful if this service varies slightly like duration of service or change in materials used, " +
                                    "like a massage with 45 min, 60 mins, 90 min options or grooming for a large/small pet. " +
                                    "Enabling this option will allow you to set different duration and respective prices. " +
                                    "For example, 60 minute massage and 90 minute massage can be set here. " +
                                    "Note that this feature is not an addon but rather provides a variation that your customer can select."
                        break;
                case 'help_note_on_variable_item': v.header = "Note field for Variable time item"; 
                        v.content = "You can optionally provide a note. In some cases, its better to leave the note empty.<br>" +
                                " For example, if its a massage varying simply by time better not add any note. " +
                                " If you are indicating a small pet, you could add a note 'Under 10lbs'" +
                                " If massage with expensive oils, you could add a note 'Premium Oils'. Remember, the price you set is the price shown (i.e. its not an addon price)"
                                
                        break;
                case 'help_variable_item_price': v.header = "Price for Variable item"; 
                        v.content = "This is the price that will replace (not add to) the item's default price. "
                        break;
                case 'help_variable_item_time': v.header = "Price for Variable item"; 
                        v.content = "This is the duration that will replace (not add to) the item's default duration. "
                        break;
                case 'help_buffer_time': v.header = "Buffer Timer Before Next booking"; 
                        v.content = "This is the duration that the provider is not available after performing this service. Buffer time is not included as part of total service duration calculation. It is used to block the calendar of the provider."
                        break;
                case 'help_finish_time':        
                case 'help_gap_time':v.header = "Gap/Finish time in service"; 
                        v.content = "Setting Gap and Finish time to 1 or more minutes enables split service time. " +
                        "Service time becomes the 'initial service' time. " + 
                        "Gap time is a time slot where customer is not worked upon and this gap time is a bookable for another customer. " +
                        "Finish time is after gap time and the time where customer is worked upon again by same service provider. "
                        " Finish time is where provider is not bookable by another customer.<br/>"+
                        "Total Service time = Initial Service Time + Gap Time + Finish Time, with Gap time as bookable"
                        break;
                case 'help_required_resource_groups':
                        v.header = "Resources (Rooms/Tables) Required for Service"; 
                        v.content = "Set the resource group (Rooms etc) required for this service. <br>If resource group is set," +
                        " booking will always require a resource to be available for that duration of booking. " + 
                        "If no resource is available from this group for a requested booking, the booking will be rejected. Frontdesk employees can force a booking to bypass this." +
                        " Online bookings will get a message if a resource is not available."
                        break;
                case 'help_required_standard_resource_groups':
                        v.header = "Facilites (Rooms/Equipment) Required for Service"; 
                        v.content = "If this is set," +
                        " booking will always require a room/equipment to be available for that duration of booking. " + 
                        "If no room/equipment is available, the booking will be rejected. Frontdesk employees can force a booking to bypass this." +
                        " Online bookings will get a message if a resource is not available."
                        break;
                        
                case 'help_multi_provider_resources':
                    v.header = "Resources (Rooms/Tables) when booking for multi providers"; 
                    v.content = "When a service requires multiple providers (for ex. couples massage), <br>\
                            it will use the same resource(room) for all. That is, the couple is placed the one same room. <br>" +
                        " If for any reason you need to split them into different rooms, on the booking list, you need to change resource and checkbox the force the change." +
                        " At that point you will be manually managing the room for that booking's duration" 
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