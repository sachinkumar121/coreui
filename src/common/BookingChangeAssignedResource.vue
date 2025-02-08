<template>
<div>
     <!-- Pay by card on file -->
    <CModal :visible="show_pay_modal">
        <CModalHeader>
            <CModalTitle>Change Room/Equipment Assigned to Booking</CModalTitle>
        </CModalHeader>
        <CModalBody>

        <div class="row">
            <div class="col-md-6" color="danger">
                <label class="control-label">
                    <b>Currently Assigned: </b>&nbsp; 
                </label>
                        
            </div>
            
            <div class="col-md-6" v-if="assigned_resource_ids && assigned_resource_ids.length==1">
               {{assigned_resource_ids&&
                    assigned_resource_ids.length?assigned_resource_ids[0].first_name: "None"}}
              
            </div>
            <div class="col-md-6" v-else-if="current_resource!=null && assigned_resource_ids && assigned_resource_ids.length>1">
                  <select 
                                class="form-control" 
                                
                                v-model="current_resource">
                                <option v-for="opt in assigned_resource_ids" 
                                v-bind:key="opt._id"
                                :selected="opt._id.toString() == current_resource._id ? true : false" 
                                :value="opt._id">
                                {{opt.first_name }}</option>
                  </select>
            </div>
        </div>   
        <br>
         <div class="row">
            <div class="col-md-6" color="danger">
                <label class="control-label">
                    <b>Booking Service ID: </b>&nbsp; 
                </label>
                        
            </div>
            
            <div class="col-md-6">
               {{booking_service_order_id}}
              
            </div>
        </div> 
        <br>  
        <div class="row">
                <div class="col-md-6" color="danger">
                        <label class="control-label">
                            <b>Change to: </b>&nbsp; 
                        </label>
                        
            </div>
            <div class="col-md-6" color="danger" v-if="resources_list.length">
                        <select 
                                class="form-control" 
                                v-model="selected_resource">
                                <option v-for="opt in resources_list" 
                                v-bind:key="opt._id" :value="opt._id">
                                {{getResName(opt)  }}</option>
                        </select>
                        <br>
                        <small>AR = Accessible Resource</small>
            </div>
            <div class="col-md-6"   v-else>
               No Available Resources for booking.
            </div>
        </div>
        <br>
         <div class="row">
                <div class="col-md-6" color="danger">
                        <label class="control-label">
                            <b>Force the change?: </b>&nbsp; 
                        </label>
                        
            </div>
            <div class="col-md-6">
                          <input  
                        type="checkbox"
                        v-model="force_change" class="form-check-input"
                        /> &nbsp; Yes, force.
            </div>
        </div>
       
        <br>
        <div class="row">
                <div class="col-md-12" color="danger">
                <b> {{pm_error_message}}</b>
            </div>
            </div>
        </CModalBody>
        <CModalFooter>
            <CButton v-if="show_paycof==true" @click="closePayModal()" 
                    color="danger" class="mr-auto">Cancel</CButton>
            
            <CButton v-if="show_paycof==true" 
                @click="changeResource()" 
                color="success"  >Change</CButton>

            <CButton v-if="show_paycof==false" @click="closePayModal()" 
                    color="warning" >Close</CButton>
        </CModalFooter>
    </CModal>

</div>   
</template>

<script>
  //  import Datetime from './DateTime.vue';
import moment from 'moment'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {debounce as lodash_debounce} from 'lodash'

    export default {
        name  : 'eventEditor',

        props : {
            assigned_resource_ids :  Array,
            booking_id: String,
            booking_service_order_id: String
        }, // eo props
        emits: ['modelValueUpdate'],
        components : {
            flatPickr
           // Datetime
        }, // eo components

        data() {
            return {
                res_curr_key: 0,
                show_unavailable_resources: false,
                timezone:this.$store.state.business_settings.business_time_zone,
                currency_symbol:this.$store.state.business_settings.business_currency_symbol,
                operation_completed: false,
                selected_resource: {},
                current_resource: null,
                show_error_result: false,
                operation_result_message: "No Message",
                resources_list :[],
                show_pay_modal: false,
                pm_error_message: "",
                checkout_btn_disabled: false,
                checkout_text: 'Pay with card on file',
                selected_card_id : '',
                selected_order_manage_access_key: '',
                selected_order_number: '',
                selected_order_type: '',
                selected_invoice_number: '',
               
                selected_customer_id: '',
                show_paycof: true,
                customer_id: '',
                force_change: false,

                success_count: 0

            }
        }, // eo data
        created(){
             
                  },
        mounted(){
             this.show_pay_modal = false;
             this.success_count = 0;
             if (this.assigned_resource_ids && this.assigned_resource_ids.length)
             {
                this.current_resource = this.assigned_resource_ids[0]
                this.res_curr_key = moment.utc().valueOf()
                //console.log("sad-s--s-ssssss", this.current_resource)
             }
            this.getResourceList()
        },

        methods: {
            getResName(opt)
            {
                let v= opt.first_name + " " ;
                if (opt.resource_is_preferred_for_disabled_person == true)
                {
                
                    v +=  " AR "
               
                }
                v += opt.is_available?"":"notAvail"
                return v;
            },
            changedUnavailable()
            {
                console.log("s-d-d-d-d UNAVILABLE? ", this.show_unavailable_resources)
            },
            getResourceList()
            {
                
                this.$schedsdk.getAvailableResourcesForBooking({booking_id: this.booking_id,
                 get_unavailable_resources:this.show_unavailable_resources})
                    .then((result)=>
                {
                    if (result.status == 1)
                    {
                        this.resources_list = result.all_resources.filter(ar=>{
                            if(this.current_resource!=null && this.current_resource._id)
                            {
                                return ar._id != this.current_resource._id;
                            } 
                            else
                            {
                                return true;
                            }
                        })
                        this.resources_list.push({_id:null, first_name: "Remove Resource", is_available:true})
                    }
                    this.show_pay_modal = true;
                });
            },
            changeResource()
            {
                //console.log(this.selected_resource, "asdasdasdasd");
                
                if(!this.selected_resource )
                {
                    this.pm_error_message = "Please select a resource";
                   // return;
                }
                let original_resource_id =  null;
                if( this.current_resource && typeof this.current_resource == "object")
                {
                    original_resource_id = this.current_resource._id;
                }
                else
                {
                        if (this.current_resource && this.current_resource.length)
                        {
                            original_resource_id = this.current_resource
                        }
                       
                }
                if(!original_resource_id)
                {
                    //this.pm_error_message = "Original resource was not selected " + original_resource_id;
                    //return;
                
                }
                let new_resource_id = this.selected_resource;
                let confirm_force_change = this.force_change;
                let booking_id = this.booking_id;
                this.pm_error_message  = "Starting change request..."
                
                this.$schedsdk.changeResourceForBooking({
                    original_resource_id,
                    new_resource_id,
                    confirm_force_change,
                    booking_id
                }).then(resd=>{ 
                        this.pm_error_message  = resd.message;
                        if(resd.status==0)
                        {
                            this.show_paycof = true;
                        }
                        else
                        {
                            this.success_count++;
                        }
                }).catch(err=>{
                        this.pm_error_message  = "Error updating";
                        this.show_paycof = true;
                })
                
                 
                this.show_paycof = false;
                
            }, //end continueToPayCof
            
            setDebounceTime(search)
            {
                if (search.length < 5)
                {
                    this.debounce_time_ms = 600; //wait longer
                }
                else
                {
                    this.debounce_time_ms = 350; //Shorter wait for longer
                }
            },
              
            closePayModal()
            {
                this.show_pay_modal  = false;
                this.cards_on_file_list = [];
                this.pm_error_message = "";
                this.selected_order_manage_access_key =""
                this.selected_order_number =""
                this.selected_customer_id =""
                let sc =this.success_count;
                this.success_count = 0
                this.$emit('modelValueUpdate', {done:sc>0?1:0});

            },
        }, // eo methods

        computed : {
         
        } // eo computed
    } // eo export default

</script>

<!-- eof -->
