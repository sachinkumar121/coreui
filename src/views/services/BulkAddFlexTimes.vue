<template>
<div>
          <div class="row controls-div">
                 <!-- <div class="col-md-6">
                    <label class="control-label">
                        Show <b>'buffer time after service'</b> field:
                    </label>
                    <input  
                        type="checkbox"
                        v-model="show_buffer_time_field" 
                        />
                </div> -->
                <div class="col-md-6">
                    <label class="control-label">
                        Apply the flex time to only category:
                    </label>
                    <v-select 
                        label="name"
                        v-model="selected_categories" 
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
                                <div class="selected d-center">{{ option.name}}</div>
                            </div>
                        </template>
                    </v-select>  
                </div>
                 
                <br>
                 <br>
                    <div class="col-md-6">
                    <label class="control-label">
                        <b>Instructions</b>
                    </label><br> 
                    <ul>
                        <li>This tool replaces all services' flex time (service variations) to settings below</li>
                        <li>You can restrict this to apply to a specific category by selecting the category</li>
                        <li>If both time and price are zero, then that row is not used</li>
                    </ul>
                </div>
            
        </div>
        <br/>

        <div class="row">
            <div class="col-md-12">
                <div class="table-responsive">
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
                            <input type="text" class="form-control"  size="10" 
                            v-model="item.note"
                            @keyup="changeSelectablenote(index, $event)"/>
                        </td>
                        <td> 
                            <div class="d-flex gap-1 align-items-center">
                                <input type="text" class="form-control"  size="4" 
                            v-model="item.time"
                            @keyup="changeSelectableTime(index, $event)"/> <span>Mins</span> 
                            </div>
                        </td>
                        <td>
                            <div class="d-flex gap-1 align-items-center">
                                <span>{{currency_symbol}}</span><input type="text" class="form-control"  size="4" v-model="item.price" @keyup="changeSelectableprice(index,$event)"/>
                            </div>
                        </td>
                        <td align="right"> <button  @click.prevent="removeRowForSelectableTimes(index)" class="btn btn-danger">Remove</button></td>
                    </tr>
                    <tr align="right"><td colspan="4">
                            <button  @click.prevent="addRowForSelectableTimes" class="btn btn-primary">Add Row</button>
                    </td>
                    </tr>
                </tbody>
                </table>
                </div>
            </div>
        </div> <!-- end table of rows and prices -->
       
         <div class="row mb-4">
             
             
             <div class="col-md-12">
                <input  
                        type="checkbox"
                        v-model="remove_flex_times_from_all" 
                        />&nbsp;
                    <label class="control-label mb-0">
                       Remove flex times from all matching
                    </label>
                    
                </div>
                <br>
                <div class="col-md-12">
                    <input  
                        type="checkbox"
                        v-model="is_bulk_updated_checked" 
                        />&nbsp;
                    <label class="control-label mb-0">
                       I confirm this bulk update operation
                    </label>
                    
                </div>
             </div>        
      
        <div class="row">
             <div class="col-md-12 d-flex justify-content-between">
                <button class="btn btn-info" @click="$router.go(-1);">Back</button>
                <button class="btn btn-success" @click="AddBulkServices">Submit</button>
            </div>
            <br>
        </div>
        <div class="row">
             <div class="col-md-6">
                 <Alerts 
                :alertData="submitErrorData" 
                :show="submit_error_sec"
                v-if="submit_error" />
             </div>
             <br>
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
        selected_categories: [],
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
            currency_symbol: this.$store.state.business_settings.business_currency_symbol,
            is_bulk_updated_checked: false,
            remove_flex_times_from_all: false
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
        let in_selectable_times =[
            {time: 0, price: 0, note: ""},
            {time: 0, price: 0, note: ""},
            {time: 0, price: 0, note: ""},
        ]
        this.selectable_times = in_selectable_times;
        this.getServiceCategories();
        //this.getServiceDetail();
        //this.getResourceGroups();
        //this.addRowForSelectableTimes();
    },
    methods:{
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
   
        AddBulkServices(e){
         //   e.preventDefault();
           this.submitErrorData.message = "";
           this.submit_error = false;
           let error_count = 0;
           let needs_double_confirm = false;
           let selected_array = [];
           let thisref = this;    
           let confirmed = false
           if(this.is_bulk_updated_checked != true)
           {
                confirm ("Please ensure the confirm bulk operation checkbox is checked")
                 return;
           }
           
           let data = {
               selectable_times: this.selectable_times,
           }
           if( this.selected_categories && this.selected_categories._id)
           {
                 data.limit_to_categories =[this.selected_categories._id]
           }     
             
          if(this.remove_flex_times_from_all !== undefined)
          {
              data.remove_flex_times_from_all = this.remove_flex_times_from_all
          }

           console.log(data)
            reprom =  this.$schedsdk.bulk_set_flex_times(data);
            reprom.then((result)=>{  
                if(result.status == 1){
                    thisref.submitErrorData.message = "Success: " + result.message;
                    thisref.submitErrorData.type ='success'
                    thisref.submit_error = true;
                }
                else
                {
                    thisref.submitErrorData.message = "Error: " + result.message;
                    thisref.submitErrorData.type ='error'
                    thisref.submit_error = true;
                }
                this.is_bulk_updated_checked =false
                this.remove_flex_times_from_all = false
            });
           return;
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
</style>