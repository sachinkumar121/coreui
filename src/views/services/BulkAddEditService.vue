<template>
    <div>
        <div class="row controls-div mb-3">
            <div class="settings-text">Field Options</div>
            
                <div class="col-md-12">
                    <input  
                        type="checkbox" class="form-check-input"
                        v-model="show_buffer_time_field" 
                        /> &nbsp;
                    <label class="control-label">
                        Show <b>'buffer time after service'</b> field
                    </label>
                    
                </div>
                <br>
                <br>
                <div class="col-md-12">
                    <label class="control-label">
                        <b>Instructions</b>
                    </label><br> 
                    <ul>
                        <li>If you don't need to fill all rows, leave the service name empty in that row</li>
                        <li>Ensure you have <a href="javascript:void(0)" @click="$router.push('/service_category')">created one</a> or more categories</li>
                        <li>All services added here will be enabled for online booking.</li>
                        <li>If you have advanced settings like variable times or resources, you can edit them later from listing</li>
                    </ul>
                </div>
        
        </div>
        <br/>
        <div class="row">
            <div class="col-md-12">
                <div class="table-resposnive">
                    <table class="table table-bordered"> 
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
    
                    <thead>
                        <tr>
                            <th>Service Name <CIcon
                                    name="cil-CommentSquare"  
                                        v-c-popover="getPopUpHelpObj('help_note_on_service_name')"/></th>
                            <th>Description <CIcon
                                    name="cil-CommentSquare"  
                                        v-c-popover="getPopUpHelpObj('help_note_on_service_description')"/></th>
                
                            <th>Time (mins)<CIcon
                                    name="cil-CommentSquare"  
                                        v-c-popover="getPopUpHelpObj('help_service_time')"/></th>
                            <th  v-if="show_buffer_time_field">Buffer time before next (mins)<CIcon
                                    name="cil-CommentSquare"  
                                        v-c-popover="getPopUpHelpObj('help_service_buffer_time')"/></th>
                        
                            <th>Price<CIcon
                                    name="cil-CommentSquare"  
                                        v-c-popover="getPopUpHelpObj('help_item_price')"/></th>
                            <th>Category<CIcon
                                    name="cil-CommentSquare"  
                                        v-c-popover="getPopUpHelpObj('help_item_category')"/></th>
                            <th> </th>
                        </tr>
                    
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in services_array" :key="index">
                            <td> 
                                <div class="service-col">
                                <input type="text"  size="15" class="form-group form-control"
                                v-model="item.name" />
                                <span> {{ index + 1 }}.</span>
                                </div>
                                <div v-if="item.val_error_string != ''"><span class="error-msg">{{ item.val_error_string }}</span></div>
                                <div v-if="item.val_success_string != ''"><span class="success-msg">{{ item.val_success_string }}</span></div>
                            </td>
                                <td> 
                                <input type="text"  size="15" class="form-control"
                                v-model="item.description" />
                            </td>
                            <td> 
                                <div class="time-parent-div position-relative">
                                <input type="text"  size="3" 
                                v-model="item.time" class="form-control" /> <span>Mins</span>
                                </div>
                            </td>
                            <td v-if="show_buffer_time_field"> 
                                <div class="time-parent-div position-relative">
                                <input type="text"  size="3" class="form-control"
                                v-model="item.buffer_time_before_next" /> <span>Mins</span>
                                </div>
                            </td>
                            <td>
                                <div class="service-col">
                                <input type="text"  size="4" 
                                    v-model="item.price" class="form-control"/>
                                    <span>{{ currency_symbol }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="form-group">
                                    <v-select 
    label="name"
    v-model="item.service_category" 
    :options="categories_option"
>
    <template v-slot:no-options="{ search, searching }">
        <template v-if="searching">
        No results found for <em>{{ search }}</em
        >.
        </template>
        <em v-else style="opacity: 0.5">Start typing to search</em>
    </template>
    <template v-slot:option="option">
    <div class="d-center">
        {{ option.name }}
        </div>
    </template>
    <template v-slot:selected-option="option">
        <div style="display: flex; align-items: baseline">
            <div class="selected d-center">{{ option.name }}</div>
        </div>
    </template>
</v-select> 
                                </div>
                            </td>

                            <td align="right"> <button
                                @click.prevent="removeRowForSelectableTimes(index)" 
                                class="btn btn-danger">Remove</button></td>
                        </tr>
                        <tr align="right">
                        <td  v-if="show_buffer_time_field" colspan="7">
                                <button  @click.prevent="addRowForSelectableTimes" class="btn btn-primary">Add 5 Rows</button>
                        </td>
                        <td  v-else colspan="6">
                                <button  @click.prevent="addRowForSelectableTimes" class="btn btn-primary">Add 5 Rows</button>
                        </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </div> <!-- end table of rows and prices -->
        <div class="row">
            <div class="col-md-12 d-flex justify-content-between">
                <button class="btn btn-info" @click="$router.go(-1);">Back</button>
                <button class="btn btn-success" @click="AddBulkServices">Submit</button>
            </div>
        </div>
        <div class="row">
                <div class="col-md-6">
                    <Alerts 
                :alertData="submitErrorData" 
                :show="submit_error_sec"
                v-if="submit_error" />
                </div>
        </div>
    </div>
</template>
<script>
import { required, minValue } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {debounce as lodash_debounce} from 'lodash/core'
import Alerts from '../Alerts'
import utils_lib from '../../helpers/utils_lib';

export default {
    name: 'AddOrEditServices',
    components:{
        Alerts
    },
    setup: () => ({ v$: useVuelidate() }),
    data(){
      return({
          services_array: [],
        categories_option:[],
        resources_option:[],
        show_buffer_time_field: false,
        alert:false,
            show:0,
            alertData:{
                message:'',
                type:''
            },
          submit_error: false,
             submitErrorData:{
                message:'',
                type:''
            },
            submit_error_sec: 6,
            service_id:'',
            description:'',
            in_quick_select:false,
            name:'',
            is_online_bookable:true,
            price: 1 ,
            service_category:'',
            status:1,
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
        this.getServiceCategories();
        this.getServiceDetail();
        this.getResourceGroups();
        this.addRowForSelectableTimes();
    },
    methods:{
        addRowForSelectableTimes()
        {
            let min_rows = 5;
            for(let i=0; i<min_rows; i++)
            {
                let data = {
                    //    _id:this.service_id,
                        description: "",
                        in_quick_select: false,
                        name: "",
                        is_online_bookable: true,
                        price : 0,
                        service_category : "",
                        status : 1,
                        time : -1,
                        enable_split_times: false,
                        split_times:[],
                        resource_group_ids : this.resources.map((resource)=>{return resource._id}),
                        gap_time : 0,
                        finish_time :0,
                        requires_multi_providers: false,
                        multi_providers_count: 0,
                        require_package_discount_code_for_online: false,
                        buffer_time_before_next: 0,
                        selectable_times : [],
                        enable_flexible_time: 0,
                        val_error_string: '',
                        val_success_string: '',
                }
                this.services_array.push(data)
            }
           
        },
        removeRowForSelectableTimes(index)
        {
             //console.log("===");
             ///console.log(index);
             if (index<this.services_array.length)
             {
                 if (this.services_array[index].name != null && 
                     this.services_array[index].name.length>0)
                 {
                     let conf = confirm("Confirm row removal for " + this.services_array[index].name + "?" )
                     if (conf == false)
                     {
                         return;
                     }
                 }
             }
             let ds = this.services_array.splice(index,1)
             //console.log(ds);
             //this.selectable_times = ds
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
                    this.resources_option = result.data;
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
                    this.status = result.data.status,
                    this.time = result.data.time,
                    this.resources = result.data.resource_group_ids;
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
                  
                }
            })
        },
        AddBulkServices(e){
         //   e.preventDefault();
           this.submitErrorData.message = "";
           this.submit_error = false;
           let error_count = 0;
           let needs_double_confirm = false;
           let selected_array = [];
           let thisref = this;    
         
           for(let i=0; i<this.services_array.length; i++)
           {
               let servd = this.services_array[i]
               this.services_array[i].val_error_string = ""
               this.services_array[i].val_success_string = "";
               if (servd.name !=  "")
               {    
                  
                    try
                    {
                        servd.name = servd.name.trim()
                        if(servd.service_category ==  null ||
                                servd.service_category ==  '' ||
                                    servd.service_category._id == ''||
                                    servd.service_category._id == null
                                    )
                        {
                            servd.val_error_string += "Please select a category. "   
                        }
                        
                        servd.time = parseInt((servd.time + "").trim());
                        servd.buffer_time_before_next = parseInt((servd.buffer_time_before_next+"").trim());
                        servd.price =utils_lib.roundto6digits( parseFloat((servd.price+"").trim()));
                         
                         if(isNaN(servd.time) || servd.time < 0)
                         {
                             //error
                            servd.val_error_string += "Time duration in error (minimum 0 minutes). "   
                         }
                         

                         if(isNaN(servd.price) || servd.price < -0.00001)
                         {
                             //error
                            servd.val_error_string += "Price is in error. "   
                         }
                         if(isNaN(servd.buffer_time_before_next) || servd.buffer_time_before_next < 0)
                         {
                             //error
                            servd.val_error_string += "Buffer time before next is in error. "   
                         }

                        if(servd.description == "")
                         {
                             //error
                            servd.val_error_string += "Description is not provided. "   
                         }
                         if (servd.time < 5 ||
                             servd.price < 5)
                        {
                            needs_double_confirm = true;
                        }


                    }   
                    catch(ex)
                    {
                        servd.val_error_string +=  ex.message;
                        
                    }
                    
                   console.log("sads====")
                   console.log(servd)
                   if(servd.val_error_string != '')
                   {
                       error_count++;
                       continue;
                   }
                   else
                   {
                       servd.reference_index = i;
                       selected_array.push(servd);
                   }
               }
           }
           if (error_count > 0)
           {
                this.submitErrorData.message = "Error: Please see errors at each row";
                this.submitErrorData.type ='danger'
                this.submit_error = true;
                return;
           }
           let confirmed = true
           if (needs_double_confirm)
           {
               confirmed = confirm ("One or more of services has low time duration and/or price. Proceed anyway?")
           }
           if (confirmed == false)
           {
               return;
           }
           if(selected_array.length ==0)
           {
               thisref.submitErrorData.message = "No records sent";
               thisref.submitErrorData.type ='success'
               thisref.submit_error = true;
               return;
           }
           // selected_array.push(servd);
           //Else free to submit.
           console.log("Asdasd-sssss res");
           let reprom = this.$schedsdk.bulk_add_services({data: selected_array}).then((result) =>{
               console.log("Asdasd- res");
               
               console.log(result);
               if (result.status != 1)
               {
                   
                    thisref.submitErrorData.message = "Error from server: " + result.message;
                    thisref.submitErrorData.type ='danger'
                    thisref.submit_error = true;
                    if (result.status == 0)
                    {
                        return;
                    }
               }
               else
               {
                    thisref.submitErrorData.message = "Success: " + result.message;
                    thisref.submitErrorData.type ='success'
                    thisref.submit_error = true;
               }
               for(let i =0 ;i <result.data.length; i++)
               {
                   let resd = result.data[i];
                   if (resd.status == 1)
                   {
                       console.log("iasidiasid success");

                       thisref.services_array[resd.reference_index].val_success_string = 
                            resd.message.length==0?"Success":resd.message
                       thisref.services_array[resd.reference_index]._id = resd.data._id;
                       thisref.services_array[resd.reference_index].val_success_string += "temp: ID: " +  resd.data._id
                       console.log(thisref.services_array[resd.reference_index].val_success_string );
                       
                   }
                   else
                   {
                        thisref.services_array[resd.reference_index].val_error_string = 
                            resd.message.length==0?"Error":resd.message
                   }
               }

           }).catch(ex =>{
                    thisref.submitErrorData.message = "Error -  " + ex.message;
                    thisref.submitErrorData.type ='danger'
                    thisref.submit_error = true;
                    
           });
           return;
         /*       if(result.status == 1){
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
                */
            
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

                case 'help_note_on_service_name': v.header = "Service Name"; 
                        v.content = "Name of the service being offered."
                        break;
                case 'help_note_on_service_description': v.header = "Service Description"; 
                        v.content = "Longer details of the service"
                                
                        break;
                case 'help_item_price': v.header = "Price for item"; 
                        v.content = "This is the price for the service/item"
                        break;
                case 'help_service_time': v.header = "Service time/duration"; 
                        v.content = "Duration of the service in minutes"
                        break;
                case 'help_service_buffer_time': v.header = "Buffer Timer Before Next booking"; 
                        v.content = "This is the duration that the provider is not available after performing this service. Buffer time is not included as part of total service duration calculation. It is used to block the calendar of the provider."
                        break;
                       
                case 'help_item_category':v.header = "Item category"; 
                        v.content = "Which category does this item belong to"
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
.success-msg{
    color: green;
}
.service-col {
    position: relative;
}
.service-col span {
    position: absolute;
    left: 10px;
    top: 12px;
}
.service-col .form-control {
    padding-left: 25px;
}
.time-parent-div .form-control {
    padding-right: 45px;
}
.time-parent-div span {
    position: absolute;
    right: 10px;
    top: 12px;
}
.form-control:focus + span {
    color: #000;
}
.controls-div {
  float: left;
  width: 100%;
  border: 1px solid #d8dbe0;
  padding: 15px 4px;
  margin: 0;
  padding-top: 20px;
  position: relative;
}
.settings-text {
  position: absolute;
  padding: 3px 6px;
  top: -15px;
  left: 15px;
  font-size: 16px;
  font-weight: bold;
}
</style>