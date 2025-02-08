<template>
<div>
     <!-- Pay by card on file -->
    <CModal :visible="show_pay_modal">
        <CModalHeader>
            <CModalTitle>Select Card On File or Pay</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <div class="row">
                <div class="col-md-6" color="danger">
                        <label class="control-label">
                            <b>Select card on file to pay with: </b>&nbsp; 
                        </label>
                        
            </div>
            <div class="col-md-6" color="danger" v-if="cards_on_file_list.length">
                        <select 
                                class="form-control" 
                                v-model="selected_card_id">
                                <option v-for="opt in cards_on_file_list" 
                                v-bind:key="opt._id"
                                :selected="opt._id == selected_card_id ? true : false" :value="opt._id">
                                {{opt.nick_name + " " + opt.last4 + " Exp. " + opt.exp_month + "/" +opt.exp_year}}</option>
                        </select>
            </div>
            <div class="col-md-6"   v-else>
                No saved cards. You can save a card when paying next.
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
            <CButton v-if="show_paycof==true" @click="payWithNewCard" color="info" class="mr-auto">Pay with new card</CButton>
            <CButton v-if="show_paycof==true" @click="deleteCof" color="danger" class="mr-auto">Delete Selected Card</CButton>
           
            <CButton v-if="show_paycof==true" :disabled="checkout_btn_disabled" @click="continueToPayCof()" color="success" >{{checkout_text}}</CButton>

            <CButton v-if="show_paycof==true" @click="closePayModal()" color="danger">Cancel</CButton>
            <CButton v-if="show_paycof!=true" @click="closePayModal()" color="success">OK</CButton>
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
            customer_id :  String,
            order_number: String,
            order_type: String,
            invoice_number: String,
            order_manage_access_key: String
        }, // eo props

        components : {
            flatPickr
           // Datetime
        }, // eo components

        data() {
            return {
                timezone:this.$store.state.business_settings.business_time_zone,
                currency_symbol:this.$store.state.business_settings.business_currency_symbol,
                operation_completed: false,
                show_error_result: false,
                operation_result_message: "No Message",
                cards_on_file_list :[],
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


            }
        }, // eo data
        created(){
             
                  },
        mounted(){
             this.show_pay_modal = false;
             this.takePayment({customer_id:this.customer_id, 
                               order_number: this.order_number,
                               order_type: this.order_type,
                               invoice_number: this.invoice_number,
                               order_manage_access_key: this.order_manage_access_key})
        
        },

        methods: {
            takePayment(params)
            {
                console.log("--- input params  -- ");
                console.log(params)
                if(params.customer_id ===undefined ||params.customer_id == null)
                {
                    return;
                }
                this.pm_error_message = "";
                this.cards_on_file_list =[];
                this.checkout_btn_disabled = false;
                this.selected_order_number = params.order_number;
                this.selected_order_type = params.order_type;
                this.selected_invoice_number = params.invoice_number;
                this.selected_customer_id = params.customer_id;
              
                this.selected_order_manage_access_key= params.order_manage_access_key,
              
                this.show_paycof = true;
                this.$schedsdk.list_user_cards_on_file({user_id: params.customer_id}).then((result)=>
                {
                    if(result.status ==1)
                    {
                        this.cards_on_file_list = result.data
                    }
                    else
                    {
                        this.pm_error_message = "Error getting Cards on File: " + result.message
                    }
                    if (this.cards_on_file_list.length == 0)
                    {
                        this.checkout_btn_disabled = true;
                    }
                    this.show_pay_modal = true
                }).catch((Ex) => {
                        this.pm_error_message = "Error contacting server"
                    
                    this.show_pay_modal = true
                })
            },
            continueToPayCof()
            {
                // console.log(this.selected_card_id);
                
                if(!this.selected_card_id || this.selected_card_id.length< 3)
                {
                    this.pm_error_message = "Please select a card";
                    return;
                }
                this.pm_error_message  = "Starting payment request..."
                let prom = null;
                if(this.selected_order_type == 'p' )
                {
                    prom =this.$schedsdk.takePaymentForPOWithCardOnFile({
                            order_number: this.selected_order_number, 
                            customer_id: this.selected_customer_id, 
                            card_on_file_id: this.selected_card_id})
                }
                else
                {
                    prom = this.$schedsdk.takePaymentForBookingWithCardOnFile({
                            order_number: this.selected_order_number, 
                            customer_id: this.selected_customer_id, 
                            card_on_file_id: this.selected_card_id})
                }
                prom.then((result)=>
                {
                    if(result.status ==1)
                    {
                    //Done.
                    this.pm_error_message = "Payment successful."
                    }
                    else
                    {
                        this.pm_error_message = "Error taking payment " + result.message
                    }
                }).catch((Ex) => {
                        this.pm_error_message = "Error contacting server"
                    //this.closePayModal();
                    
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
             
            payWithNewCard()
            {
                //  this.selected_booking_manage_key= this.manage_booking_key,
                
                let url =  this.$store.state.skysched_global_api_base_url +
                            "extpages/online_booking_payment/" +
                            this.selected_order_manage_access_key +
                            "?show_page_header=0&show_page_footer=0"
                this.$router.push({ name: 'Pay Purchase Order' ,
                                    params: {po_access_url: encodeURI(url)} 
                                        }) ;
                this.closePayModal();
                
            },
            deleteCof()
            {
                let selected_id = this.selected_card_id;
                let cardobj =null;
                this.cards_on_file_list.find((obj)=>{
                if(obj._id.toString() == selected_id)
                {
                    cardobj = obj;
                }
                })
                if (cardobj)
                {
                    let c = confirm("Are you sure to remove Card on File " + 
                    cardobj.nick_name + " " + cardobj.last4 + " Exp. " + cardobj.exp_month + "/" +cardobj.exp_year +
                    " ?" );
                    if (c)
                    {
                        //
                        this.$schedsdk.delete_user_cards_on_file(
                                    {user_id: this.selected_customer_id,
                                     card_on_file: {_id: cardobj._id}
                                    }).then((result)=>
                        {
                            if(result.status ==1)
                            {
                                this.cards_on_file_list = result.data
                            }
                            else
                            {
                                this.pm_error_message = "Error deleting Cards on File: " + result.message
                            }
                            if (this.cards_on_file_list.length == 0)
                            {
                                this.checkout_btn_disabled = true;
                            }
                            this.show_pay_modal = true
                        }).catch((Ex) => {
                                this.pm_error_message = "Error contacting server"
                            
                            this.show_pay_modal = true
                        })

                    }
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

            },
        }, // eo methods

        computed : {
         
        } // eo computed
    } // eo export default

</script>

<!-- eof -->
