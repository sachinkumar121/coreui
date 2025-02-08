<template>
<div class="mt-2">
    <h4 style="text-align:center;">Quick Purchase</h4>
    <form class="add-product-form" v-if="operation_completed==false" @submit.prevent="addToCart">
        <div class="row">
            <div class="col-md-12 mb-3">
                <input  
                        type="checkbox" class="form-check-input"
                        v-model="book_without_email_phone" 
                        @change="bookWithOutEmailPhone"
                /> &nbsp;
                <label class="control-label">
                        <b>Purchase without email/phone </b> 
                </label>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="control-label"><b>First Name</b></label>
                        <v-select taggable  
                                v-model="customer" 
                                @search = "onSearch" 
                                label="first_name"
                                :options="customer_option" 
                                :create-option="opt => ({ is_new: true, first_name: opt, last_name: '' })"
                                @update:modelValue="fillCustomerDetail">
                        <template v-slot:no-options>
                            Type to search ...
                        </template>
                        <template v-slot:option="option" >
                            <div class="d-center">
                            {{ getDisplayName(option) }}  
                            </div>
                        </template>
                        <template v-slot:selected-option="option" >
                            <div class="selected d-center">
                            {{ option.first_name }}  
                            </div>
                        </template>
                        </v-select>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="control-label"><b>Last Name</b></label>
                        <input 
                    class="form-control placeholder-no-fix" 
                    type="text" 
                    v-model="last_name"
                    />
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="control-label"><b>Email</b></label>
                        <input 
                    class="form-control placeholder-no-fix" 
                    type="text"
                    :readonly="is_email_readonly" 
                    v-model="email"
                    />
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="control-label"><b>Phone</b></label>
                        <input 
                    class="form-control placeholder-no-fix" 
                    type="text" 
                    :readonly="is_phone_readonly" 
                    v-model="phone"
                    />
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="control-label"><b>Select Products</b></label>
                        <v-select multiple v-model="services" 
                        label="item_name" :options="combined_products_packages"
                        @update:modelValue="checkForAdditionalServiceProviders"
                        @option:selecting="handleSelecting"
                        >
                        <template v-slot:no-options>
                            Type to search ..
                        </template>
                        <template v-slot:option="option" >
                            <div class="d-center">
                            {{ option.item_name + " (" + option.item_type + ") " + currency_symbol + "" +   option.item_price }}
                            </div>
                        </template>
                        <template v-slot:selected-option="option" >
                            <div class="selected d-center">
                            {{ getSelectedItemDisplay(option) }}
                            </div>
                        </template>
                        </v-select>
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group">
                    <label class="control-label"><b>Qty</b></label>
                        <input 
                    class="form-control placeholder-no-fix" 
                    type="text" 
                    v-model="qty_1"
                    />
                </div>
            </div>
            <div class="col-md-4 mt-md-1 pt-md-4">
                <div class="form-group">
                    <CButton type="submit" color="success"  
                            >Add to cart</CButton>
                </div>
            </div>
        </div>
      <div class="row">
          <div class="col-md-12">
            <table class="table table-bordered">
              <thead>
              <tr>
                  <th>Item Name</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Extended Price</th> 
              </tr>
              </thead>
               
              <tbody  v-if='cart.items.length'> 
              <tr v-for="(item,index) in cart.items" :key='item._id'>
                  <td>{{item.item_name}} </td>
                  <td>{{currency_symbol}}{{roundto2digits(item.applied_unit_price)}} </td>
                  <td>{{item.item_qty}} </td>
                  <td>{{currency_symbol}}{{roundto2digits(item.applied_unit_price*item.item_qty)}} <br>
                    <a href="" @click.prevent="removeItemFromCart(index)">Remove</a></td>
              </tr>
              <tr v-for="item in cart.summary_lines" :key='item._id'>
                  <td>{{item.item_name}} </td>
                  <td>{{currency_symbol}}{{roundto2digits(item.applied_unit_price)}} </td>
                  <td>{{item.item_qty}} </td>
                  <td>{{currency_symbol}}{{roundto2digits(item.applied_unit_price*item.item_qty)}} </td>
                 </tr>
              </tbody>
              <tbody v-else> 
                <tr><td colspan="10" class="text-center">
                    <div class="py-5">
                        <img src="/img/no-result.svg" alt="" class="img-empty"> 
                        <p class="h5 mt-4 d-block fw-normal">
                            No Items in cart
                        </p>
                      </div> 
                    </td>
                </tr>
              </tbody>
            </table>
            </div>
      </div>
        <div class="row">
            <div class="col-md-12">
                <div class="form-group" >
                    <label class="control-label"><b>Coupon Code</b></label>
                    <v-select v-model="selected_coupon_code" 
                    :options="coupon_list"
                    label="coupon_name">
                    <template v-slot:no-options>
                        Type to search ..
                    </template>
                    <template v-slot:option="option" >
                        <div class="d-center">
                        {{ option.coupon_name }}  ({{option.discount_type!=1?currency_symbol:""}}{{option.amount}}{{option.discount_type==1?"%":""}} off)
                        </div>
                    </template>
                    <template v-slot:selected-option="option" >
                        <div class="selected d-center">
                        {{ option.coupon_name }}  ({{option.discount_type!=1?currency_symbol:""}}{{option.amount}}{{option.discount_type==1?"%":""}} off)
                        </div>
                    </template>
                    </v-select>
                </div>
            </div>
        </div>
        
        <div class="row">
             <div class="col-md-6 col-xl-3" color="danger">
                <label class="control-label">
                    <b>Select a card to pay with: </b>&nbsp; 
                </label>
                     
            </div>
            <div class="col-md-6" color="danger" v-if="cards_on_file_list.length">
                      
                       <select 
                              class="form-control" 
                              v-model="selected_card_id">
                              <option v-for="opt in cards_on_file_list" 
                              v-bind:key="opt._id"
                              :selected="opt._id == selected_card_id ? true : false" :value="opt._id">
                               {{opt.nick_name + " " + opt.last4 + " Exp. " + opt.exp_month + "/"+opt.exp_year}}</option>
                        </select>
            </div>
            <div class="col-md-6"   v-else>
                No saved cards. You can save a card at checkout
            </div>
        </div>

    <br />
    </form>
   <!--  <template #footer > -->
      <div class="row mb-4">
          <div class="col-md-12 text-end">
        <a :target="'_blank'" :href="'/bookings/detail/'+eventRecord.data.id" class="btn btn-info"  
            v-if="eventRecord != null && eventRecord.data.service_order_id">View Detail</a>
        <CButton @click="cancelHandler" color="danger"  v-if="eventRecord != null && eventRecord.data.service_order_id && show_cancel">Cancel Booking</CButton>
        <!-- <CButton @click="okDoneHandler" color="warning"  v-if="operation_completed==false">Close</CButton> -->     
        <CButton @click="saveHandler" color="success" v-if="operation_completed==false" :disabled = "save_edit_disabled==true">Create Order</CButton>
        <CButton @click="okDoneHandler" color="success"  v-if="operation_completed==true" class="text-center">OK</CButton>
        </div>
      </div>
   <!-- </template> -->


    <div class="row" v-if="operation_completed==true || show_error_result==true">
        <div class="col-md-8">
            {{this.operation_result_message}}
        </div>
    </div>
   
    <CModal :visible="show_post_submit_modal">
        <CModalHeader>
        <CModalTitle>Purchase Create Status</CModalTitle>
    </CModalHeader>
    <CModalBody>
        <div class="row">
             <div class="col-md-6" >
                      <label class="control-label">
                         <b>Order Status </b>&nbsp; 
                     </label>
            </div>
            <div class="col-md-6"  color="danger">
                        <b> {{order_status}}</b>
            </div>
        </div>
        <div class="row">
             <div class="col-md-6" >
                      <label class="control-label">
                         <b>Payment Status </b>&nbsp; 
                     </label>
            </div>
             <div class="col-md-6"  color="danger">
                        <b> {{payment_status}}</b>
            </div>
         </div>
        <br>
        <div class="row">
             
         </div>
         </CModalBody>
        <CModalFooter>
            <CButton v-if="invoice_number!=''" 
            :disabled = "is_view_invoice_disabled"  @click="redirectToInvoice()" color="primary">View Invoice</CButton>
            <CButton v-else color="warning" @click="checkClose">{{payment_modal_button_text}}</CButton>
        </CModalFooter>
      </CModal>
  
    <!-- </CModal> -->
    <CModal
        :visible="showSelectTime"
        @close="saveSelectTimeHandler"
    >
    <CModalHeader>
        <CModalTitle>Select Flex Options/Time for PKG</CModalTitle>
    </CModalHeader>
    <CModalBody>
            <div  v-for="(item) in objsForSelectables" :key='item._id' class="row">
                    <div class="col-md-12">

                         <label class="control-label"><b>Select option for {{item.copied_item_name}} </b></label>
                             <!--   <v-select :value="item.user_selected_flex_time" 
                                @update:modelValue="(userselection) => onChangeselectFlex(userselection, item)"
                                @option:selected="handleUserSelection2($event,item)"           
                                :options="item.selectable_times" 
                                >
                                
                                    <template slot="option" slot-scope="option">
                                        <div class="d-center">
                                        {{option.time + " mins X" + currency_symbol + "" +   
                                            option.package_price + " " + option.note }}
                                        </div>
                                    </template>
                                    <template slot="selected-option" slot-scope="option">
                                        <div class="selected d-center">
                                             {{ getSelectedPackageDisplay(option) }}
                                       
                                        </div>
                                    </template>
                                </v-select> -->
                <select 
                        class="form-control col-sm-8" 
                        v-model="item.user_selected_flex_time" >
                        <option v-bind:key="opt._id" v-for="opt in item.selectable_times" 
                                :value="opt._id"> {{getSelectedPackageDisplay(item,opt)}}</option>
                </select>
                            
                    </div>
            </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="saveSelectTimeHandler" color="success"  class="text-center">Save</CButton>
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
import utils_lib from '../../helpers/utils_lib';
//import booking_helper from '../../../helpers/booking_helper';
 
    export default {
        name  : 'Po event Editor',

        props : {
            value : [ Boolean, Object ],
            eventRecord : Object,
            eventStore : Object,
            schedInst : Object,
            in_customer_id: String,
            resourceId : [ String, Number ]
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
                save_edit_disabled: false,
                show_cancel: true,
                combined_products_packages: [],
                services_option:[],
                products_option: [],
                packages_option: [],
                provider_option:[],
                cart: {items: []},
                cards_on_file_list :[],
                selected_card_id: '',
      
                customer_option:[{first_name: '', last_name: ''}],
                eventName : '',
                endDate : null,
                startDate : null,
                startTime : '',
                services : [],
                service_provider:null,
                service_provider2: null,
                need_2nd_service_provider: false,
                customer:'',
                first_name:'',
                last_name:'',
                email:'',
                phone:'',
                existing_customer_id: '',
                force_appointment: false,
                book_without_email_phone: false,
                is_email_readonly: false,
                is_phone_readonly: false,
                cpn_pkg_code: "",
                date_picker_config: {
                    altFormat: "F j, Y",
                    altInput: true,
                    // minDate:Date.now()
                },
                time_picker_config: {
                    altInput: true,
                    noCalendar: true,
                    enableTime: true,
                    time_24hr: true,
                    monthSelectorType: "static"
                    // minDate:Date.now()
                },
                debounce_time_ms: 350,
                coupon_list: [],
                selected_coupon_code: null,
                showSelectTime : false,
                select_flex_time_options: [],
                selected_flex_time_obj: null,
                service_id_for_flex_dialog: -1,
                hint_flex_service_change : false,
                qty_1: 1,
                payment_status: "NA",
                order_status: "Started...",
                show_post_submit_modal: false,
                payment_modal_closable: true,
                payment_modal_button_text: "Waiting...",
                invoice_number: "",
                is_view_invoice_disabled: false,
                objsForSelectables: []
            }
        }, // eo data
        created(){
             console.log("CR.... eventRecord")
             console.log(this.eventRecord)
             //console.log(this.eventRecord.data.id)
             
                  },
        mounted(){
            //this.getServicesList();
            //this.getProvidersList();
            this.getCouponsList();
            //this.getPackagesList();
            //this.getProductsList();
            this.getPackagesProductsList();
            if (this.in_customer_id)
            {
                console.log("asdkjaslkdjasd ---- " + this.in_customer_id)
                    this.getCustomerDetail(this.in_customer_id)
            }
       
            //console.log("CR..... mounted")
            //console.log(this.eventRecord)
            //console.log(this.resourceId)
            this.book_without_email_phone = false;
            this.operation_completed =false;
        },

        methods: {
            getCustomerDetail(cid){
            this.$schedsdk.get_customer_detail(cid).then((result)=>{
                if(result.status == 1)
                {
                    this.customer =  result.data;
                    this.fillCustomerDetail();
                }
            })
        },
         
        calc_extended_price(unit_price, item)
        {
            return unit_price * (item.qty_allowed_in_package - item.item_qty_free)
        },

        calculate_package_price_for_flex(package_items, item)
        {
            let tpp = 0;
            let that = this
            let soi = item
            console.log(package_items)
            package_items.map((obj)=>{
                //Do not modify original
                let litem = JSON.parse(JSON.stringify(obj))
            
                if (obj.selectable_times && obj.selectable_times.length)
                {
                    if (soi.ref_item_id == obj._id)
                    {
                        //
                        for(let i=0; i<obj.selectable_times.length; i++)
                        {
                            if(obj.selectable_times[i]._id ==  soi._id)
                            {
                                
                                let purch_price  =obj.selectable_times[i].package_price;
                                litem.item_package_price = purch_price
                
                                tpp+= that.calc_extended_price(purch_price , litem)
                                break;
                            }
                            
                        }
                    }
                }


            }) //end map package
            return utils_lib.roundto3digits( tpp);
        },
         getSelectedPackageDisplay(item, option)
         {
            //console.log("asd;lasZXXkasdasdd;lsYYYYakd----- ");
           
            //console.log(item); 
            return option.note + " " + option.time + " mins at PKG price " + this.currency_symbol +  
                this.calculate_package_price_for_flex(this.objsForSelectables, option)
        },
            setupData()
            {
                let eventRecord = this.eventRecord;
                let me = this
                me.hint_flex_service_change = false;
                me.show_error_result = false;
                let provider_data = null

            
                 
                if(eventRecord && eventRecord.data && eventRecord.data._id) 
                {
                    //console.log("Here in edit service condition");
                    if(eventRecord.resourceId && eventRecord.resourceId.length>1)
                    {

                        provider_data = me.provider_option.find((provider)=>{
                                if(provider._id.toString() == eventRecord.resourceId.toString()){
                                    return provider
                            }
                        })
                    }
            
                    let services = [];
                    eventRecord.data.services.map((obj)=>
                    {
                        me.services_option.map((service)=>
                        {
                            if(service._id.toString() == obj._id.toString())
                            {
                                services.push(obj);
                            }
                        })
                    })
                    
                   console.log("====== == = = = ==== = = = ===")
                   console.log(eventRecord.data)
                    Object.assign(me, 
                            {
                                eventName       :"Edit Booking " + eventRecord.data.service_order_id ,
                                first_name      :eventRecord.data.first_name,
                                last_name       :eventRecord.data.last_name,
                                email           :eventRecord.data.email,
                                phone           :eventRecord.data.phone,
                                customer        :eventRecord.data.customer,
                                startDate       :moment(eventRecord.data.service_start_date).format("YYYY-MM-DD"),
                                startTime       :moment(eventRecord.data.service_start_date).format("HH:mm"),
                                services        :services,
                                service_provider:provider_data,
                                show_cancel     :true,
                                
                            })
                        if (eventRecord.data.coupon && eventRecord.data.coupon.coupon_name!="")
                        {
                            me.selected_coupon_code = eventRecord.data.coupon
                        }
                        if(eventRecord.edit_booking_flag == 1)
                        {

                            me.startDate = moment(eventRecord.data.service_start_date).format("YYYY-MM-DD"),
                            me.startTime = moment(eventRecord.data.service_start_date).format("HH:mm"),
                            me.customer = eventRecord.data.customer
                            me.email = eventRecord.data.customer.email
                            me.phone = eventRecord.data.customer.phone
                            me.show_cancel = false
                        }
                        //console.log("Asda;sldka--a-sd-asd");
                        //console.log(eventRecord.data.walkin_customer_first_name);
                        if(eventRecord.data.is_walkin_order == true ||
                         (eventRecord.data.walkin_customer_first_name != null &&
                         eventRecord.data.walkin_customer_first_name.length>1))
                        {
                            me.book_without_email_phone = true;
                            me.is_email_readonly = true;
                            me.is_phone_readonly = true;
                            
                        }
                }
                else
                {
                   
                   me.eventName = "Quick Sale"
                   if(me.eventRecord)
                   {
                      
                        me.startDate = me.eventRecord._startDateMS
                        me.startTime = me.eventRecord._startDateMS
                   
                   }
                    //console.log(me.resourceId);
                    //console.log("asdasdasdasdas");
                    if(me.resourceId && me.resourceId.length>1)
                    {

                        provider_data = me.provider_option.find((provider)=>{
                                if(provider._id.toString() == me.resourceId.toString()){
                                    return provider
                            }
                        })
                    }
                    me.service_provider = provider_data
                }

            }, //end setupdata
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
            onSearch(search, loading) 
            {
                if(this.book_without_email_phone)
                {
                    return;
                }
                if (search == null || search == "")
                {
                     loading(false);
                    return;
                }
                this.setDebounceTime(search);
                loading(true);
                this.search(loading, search, null, this);
            },
            onSearchPhone(search, loading) 
            {
                if (search == null || search == "")
                {
                    return;
                }
                this.setDebounceTime(search);
                loading(true);
                this.search(loading, null, search, this);
            },
            search: lodash_debounce((loading, search_fn, search_ph, vm) => 
            {
                // vm.$http.get('business?search='+search).then(res => {
                //vm.customer_option = [{first_name: '', last_name:''}];
                //loading(false);
                let qry  = {};

                if (search_ph != null)
                {
                    qry.phone = search_ph;
                }

                if (search_fn != null)
                {
                    qry.fl_name = search_fn;
                }

                vm.$schedsdk.getCustomerList(qry).then(res => 
                {
                    console.log("===== > res");
                    console.log(res);
                    if(res.status == 1)
                    {
                        vm.customer_option = res.data;
                    }
                    else
                    {
                        vm.customer_option = [{first_name: '', last_name:''}];
                    }
                    
                    loading(false);
                }).catch((err) => {
                                //print_http_exception_details(err);
                                    loading(false);
                                    console.log("get Customer err");
                                    console.log(err);
                            });
            }, 400),
            getDisplayName(option)
            {
                let display_name = "";
                
                display_name = option.is_new?option.first_name + " (NEW) " 
                                       : option.first_name + " " + option.last_name 
                if (option.phone)
                {
                  display_name +=     " Ph: " + option.phone
                }
                return display_name;                  
            },
            bookWithOutEmailPhone()
            {
                if (this.book_without_email_phone == true)
                {
                    this.is_email_readonly = true;
                    this.is_phone_readonly = true;
                    this.email =this.$store.state.business_settings.business_info.business_email;
                    this.phone =this.$store.state.business_settings.business_info.business_phone;
                   
                }
                else
                {
                    this.is_email_readonly = false;
                    this.is_phone_readonly = false;
                    this.email = ""
                    this.phone = "";
       
                }
            },

            fillCustomerDetail()
            {
                if (this.book_without_email_phone)
                {
                    return;
                }
                console.log("==== this.customer  === ")
                console.log(this.customer)
                console.log(typeof this.customer)
                console.log("==== this.customer  end")
                if(this.customer && typeof this.customer != "string")
                {
                    this.first_name = this.customer.first_name
                    this.last_name = this.customer.last_name
                    this.email = this.customer.email
                    this.phone = this.customer.phone;
                    this.existing_customer_id = this.customer._id;
                    this.getCardsOnFile(this.existing_customer_id);
                }
                if (this.customer == null)
                {
                    this.customer_option = []
                    this.customer = ""
                }
                
            },
            getCardsOnFile(customer_id)
            {
                if(!customer_id)
                {
                    return
                }
                this.$schedsdk.list_user_cards_on_file({user_id: customer_id}).then((result)=>
                {
                    if(result.status ==1)
                    {
                        this.cards_on_file_list = result.data
                    }
                    else
                    {
                        this.pm_error_message = "Error getting Cards on File: " + result.message
                    }
                     
                    //this.show_pay_modal = true
                }).catch((Ex) => {
                        this.pm_error_message = "Error contacting server"
                    
                    //this.show_pay_modal = true
                })                
            },
            isSvcMultiProvider(svci)
            {
                if(svci.requires_multi_providers !== undefined && 
                    svci.requires_multi_providers == true && 
                    svci.multi_providers_count > 1)
                    {
                        return true;
                    }
                    return false
            },
            checkForAdditionalServiceProviders()
            {
                for(let i=0;i<this.services.length;i++)
                {
                    let svci  = this.services[i]
                    if (this.isSvcMultiProvider(svci))
                    {
                            this.need_2nd_service_provider = true;
                            return;
                    }
                }  
                this.need_2nd_service_provider = false; 
            },
            getProductsList()
            {
                 this.$schedsdk.get_products_list({page_no:1, max_per_page:120}).then((result)=>{
                    if(result.status == 1){
                        this.products_option = result.data
                    }
                })
            },
            combineProductPackages()
            {   
                let me = this
                this.products_option.forEach(element => {
                    me.combined_products_packages.push({ 
                    item_type: 'PROD', //'SVC' , 'PROD'
                    item_id: element._id,
                    item_name: element.name,
                    item_price: element.price
                })
                });
                this.packages_option.forEach(element => {
                    let has_flex_items =element.confirm_discount_flex_items;

                    if(has_flex_items == false)
                    {
                        element.package_items.forEach((pkitem)=>{
                                if(pkitem.enable_flexible_time && 
                                    pkitem.selectable_times && 
                                    pkitem.selectable_times.length>0)
                                {
                                    has_flex_items = true;
                                    return false;
                                }
                                return true;
                            });
                                            
                    }
                     
                    me.combined_products_packages.push({ 
                    item_type: 'PKG', //'SVC' , 'PROD'
                    item_id: element._id,
                    item_name: element.package_name,
                    item_price: element.package_purchase_price,
                    item_has_flex_items: has_flex_items,
                    item_pkg_internal_items: element.package_items,
                    
                })
                });
            },
            getPackagesProductsList()
            {
                let me = this;
                 this.$schedsdk.get_packages_list({page_no:1,max_per_page:120}).then((result)=>{
                    if(result.status == 1){
                        this.packages_option = result.data
                    }
                }).finally( () =>{
                    this.$schedsdk.get_products_list({page_no:1,max_per_page:120}).then((result)=>{
                    if(result.status == 1){
                        this.products_option = result.data
                    }
                  }).finally(()=>{ me.combineProductPackages() })
                })
            },
           
            getServicesList() {
                this.$schedsdk.list_services({page_no:1}).then((result)=>{
                    if(result.status == 1){
                        this.services_option = result.data
                    }
                })
            },
            handleSelecting(e){
                if (e.item_has_flex_items)
                {
                    //console.log(e)
                    //this.service_id_for_flex_dialog = e._id.toString()
                    //this.select_flex_time_options = e.selectable_times
                    this.objsForSelectables = e.item_pkg_internal_items
                    this.objsForSelectables.forEach((ele)=>{
                        ele.selectable_times.forEach((sele) => {
                            sele.label =  
                                 sele.time + " -----"
                             sele.ref_item_id = ele._id
                        })
                        
                        //console.log(ele.selectable_times);
                        ele.user_selected_flex_time = ele.selectable_times[0]._id;
                    });
                    //this.temp_user_selected_flex_time = [];
                    this.showSelectTime = true;  
                    return false;
                }
                return true;

            },
            getSelectedServiceDisplay(item)
            {
                if(item.flex_service_name)
                {
                    return item.flex_service_name
                }
                return item.name
            },
            getSelectedItemDisplay(item)
            {
                if(item.flex_service_name)
                {
                    return item.flex_service_name
                }
                return item.item_name
            },
            saveSelectTimeHandler()
            {
                console.log("Saved clivked")
                this.objsForSelectables.forEach(ele=>{
                    console.log("SAVIII asdasdak---- ");
                    console.log(ele.user_selected_flex_time);

                })
                this.showSelectTime = false
                return;
                for(let i =0; i< this.services.length ; i++)
                {
                    let svci =this.services[i];
                    if(svci._id.toString() ==  this.service_id_for_flex_dialog)
                    {
                        this.services[i].user_selected_flex_time = JSON.parse(JSON.stringify(this.selected_flex_time_obj))
                        this.services[i].flex_service_name = svci.name + " " + this.services[i].user_selected_flex_time.time + " mins"
                        this.hint_flex_service_change = true;
                        break;
                    }
                }
                //console.log("Asdasd---a-sd-sad");
                //console.log(this.services);
                this.service_id_for_flex_dialog = ""
                this.showSelectTime = false
            },
            getProvidersList() {
                this.$schedsdk.get_users_list({}).then((result)=>{
                    if(result.status == 1){
                        this.provider_option = result.data
                    }
                     this.setupData()
                })
            },
            getCouponsList() {
                this.$schedsdk.getCouponsList({}).then((result)=>{
                    if(result.status == 1){
                        this.coupon_list = result.data
                    }
                })
            },
            cancelHandler(){
               
                
                let confirmed = confirm("Are you sure to cancel this booking");
                if(confirmed){
                let data = {
                    booking_id:this.eventRecord.data.id,
                    service_order_id:this.eventRecord.data.service_order_id
                }
                let updated_booking = null;
                let is_new = false;
                this.$schedsdk.cancelBooking(data).then((result)=>{
                    if(result.status == 1)
                    {
                        this.operation_result_message = result.message;
                        if (this.schedInst && this.eventRecord.data.id)
                        {
                            this.schedInst.removeEvent([this.eventRecord.data.id])
                        }
                        this.okDoneHandler()
                    }
                }).catch(ex=>{
                        if(ex.data && ex.data.message)
                        {
                            this.operation_result_message = ex.data.message
                        }
                        else
                        {
                            this.operation_result_message  = ex.message;
                        }
                    }).finally(() =>{
                        this.show_cancel = false
                        this.operationCompletion(is_new,updated_booking);
                    })
                }
                
            },
            DoCheckAndOUpdateForPackageCoupon()
            {
                let updPackPromise = null;
                let package_coupon_change = false;
                    let me = this
                    //console.log(me.eventRecord.data.coupon)
                    //console.log(this.selected_coupon_code)
                    if (me.eventRecord.data.coupon == null && this.selected_coupon_code !=null ||
                        this.selected_coupon_code == null && (me.eventRecord.data.coupon != null && me.eventRecord.data.coupon.coupon_name !="") ||
                        (me.eventRecord.data.coupon && this.selected_coupon_code && 
                        me.eventRecord.data.coupon.coupon_id != this.selected_coupon_code._id))
                    {
                        
                        package_coupon_change = true;
                        //console.log(this.selected_coupon_code);
                        //console.log(me.eventRecord.data.coupon);
                        //console.log(" package_coupon_change " + package_coupon_change)
                         //Adding a coupon.
                        
                        me.eventRecord.data.coupon = this.selected_coupon_code;
                        if ( this.selected_coupon_code != null)
                        {
                            me.eventRecord.data.coupon.coupon_id = this.selected_coupon_code._id;
                            
                        }
                        
                        //updPackPromise =  me.$schedsdk.updateBooking(me.eventRecord.data)
                    }
                   return updPackPromise
                   
            },
            redirectToInvoice()
            {
                //Redirect after 1 sec to allow any payments to apply.
                this.is_view_invoice_disabled = true;
                this.show_post_submit_modal = false;
                setTimeout(function () 
                        {
                            this.$router.push({name: 'Detail Invoice', params: { invoice_no: this.invoice_number } });  
                        }.bind(this), 
                        1000); 
                
            },
            checkClose()
            {
                if (this.payment_modal_closable)
                {
                    this.show_post_submit_modal =false;
                }
            },
            async saveHandler(){
                var me = this;
                
                let updated_booking = null;
                let is_new = false;
                me.show_error_result = false;
                me.operation_result_message = "";
                this.is_view_invoice_disabled = false;
                let order_id = (me.eventRecord && me.eventRecord.data && me.eventRecord.data._id)?me.eventRecord.data._id:null
                console.log("asdasdsad", me.customer, me.first_name, me.last_name)

                if(!order_id)
                {
                    let customer = {
                        email: me.email,
                        phone:me.phone,
                        first_name: me.first_name,
                        last_name: me.last_name,
                        user_id: me.existing_customer_id,
                        is_anonyomus_customer: me.book_without_email_phone
                    }
                    this.cart.card_on_file_id_to_use = this.selected_card_id
                    if ( me.customer &&  me.customer.first_name !='')
                    {
                        customer.first_name = me.customer.first_name
                    }

                    let data = {
                        customer: customer,
                        cart: me.cart,
                        cpn_pkg_codes: [],
                        selected_coupon_code: this.selected_coupon_code
                    }
                   
                    is_new = true;
                   
                    this.save_edit_disabled =true;
                    let keep_dialog_open = false;

                    this.order_status = "Waiting....";
                    this.payment_status = "Not Started";
                    
                    this.show_post_submit_modal = true;
                    this.payment_modal_button_text = "Waiting...";
                    me.$schedsdk.create_purchase_order(data).then((res)=>{
                        console.log("Event res create ");
                        console.log(res);
                    
                        if (res.status == 1)
                        {
                            me.order_status = res.message + " Invoice number: " + res.data.invoice_number;
                            me.invoice_number = res.data.invoice_number;
                            if (me.cart.card_on_file_id_to_use != null && 
                                me.cart.card_on_file_id_to_use != "")
                            {
                                if (res.take_payment_data)
                                {
                                    me.payment_status = res.take_payment_data.message
                                }
                                else
                                {
                                    me.payment_status = "No status provided. View invoice for more payment options"
                                }
                            } 
                            else
                            {
                                me.payment_status = "View invoice for payment options"
                            }
                            this.payment_modal_button_text = "View Invoice";
                            //
                            //
                            //
                            me.emptyCart();
                        }
                        else
                        {
                            this.order_status = "Failed: " + res.message;
                            keep_dialog_open = true;
                             this.save_edit_disabled =false;
                             this.payment_modal_closable = true;
                             this.payment_modal_button_text = "Close";
                   
                        }
                        this.operation_result_message = res.message;
                        // this.discardHandler()
                    }).catch(ex=>{
                        console.log("Error...")
                        console.log(ex);
                        if(ex.data && ex.data.message)
                        {
                            this.operation_result_message = ex.data.message
                        }
                        else
                        {
                            this.operation_result_message  = ex.message;
                        }
                        me.show_error_result = true;
                            
                        keep_dialog_open = true;
                    }).finally(() =>{
                        this.operationCompletion(is_new,updated_booking,keep_dialog_open);
                    })
                    
                }
                else
                {
                 
                    let packupprom = this.DoCheckAndOUpdateForPackageCoupon()
                    
                }
                
            }, // eo function saveHandler
            operationCompletion(is_new,updated_booking_obj, keep_open = false)
            {
                // calling this method updates also duration (resizes the event)
              //  let timezone = this.$store.state.business_settings.business_time_zone;
                this.hint_flex_service_change  =false;
                 
                
            },
            finishOperation(){
                this.service_provider = null;
                this.services = [];
                this.services2 = [];
                this.first_name = "";
                this.last_name = "";
                this.email = "";
                this.phone = "";
                this.service_provider2 = null;
                this.need_2nd_service_provider = false;
            },
            okDoneHandler()
            {
                this.finishOperation();
                this.operation_completed =false; //TO allow further operatiosn later
                this.editorShown = false;
                
            },
            emptyCart: function()
            {
                this.cart = {items: []};
                this.calculateCartSummary()
            },
            calculateCartSummary: function ()
                {
                    this.cart.summary_lines = [];

                    let total = 0.0;
                    let total_qty = 0.0;
                    this.cart.items.forEach(item => {
                            //console.log(pay)
                            
                            total += (item.applied_unit_price * item.item_qty)

                            total_qty +=  item.item_qty;
                        });
                    let invoice_line= {};
                    invoice_line.applied_unit_price = total;
                    invoice_line.applied_per_unit_store_discount = 0.0;
                    invoice_line.applied_per_unit_store_surcharge = 0.0;
                    invoice_line.item_code = "TOTAL";
                    invoice_line.item_name = "Estimated Total";
                    invoice_line.item_qty = 1;
                    invoice_line.item_type = 'A'; //'SVC' , 'PROD'
                    invoice_line.purchased_package_id =  null;
                    
                    this.cart.summary_lines.push(invoice_line)

                },
                removeItemFromCart: function (index)
                {
                    
                    if (index>-1)
                    {
                        this.cart.items.splice(index, 1)
                    }
                    this.calculateCartSummary();
                },

                addToCart: function ()
                {
                    //HACK
                    let item = this.services[0];
                    //
                    console.log("asdasdsadlllsl", item)
                    let invoice_line= {};
                    invoice_line.applied_unit_price = item.item_price;
                    invoice_line.applied_per_unit_store_discount = 0.0;
                    invoice_line.applied_per_unit_store_surcharge = 0.0;
                    //invoice_line.item_code = item.package_code;
                    invoice_line.item_name = item.item_name;
                    invoice_line.item_qty = parseFloat(this.qty_1);
                    invoice_line.item_type = item.item_type;//'; //'SVC' , 'PROD'
                    invoice_line.item_id = item.item_id || null;
                    invoice_line.item_price = item.item_price;
                    invoice_line.user_selected_flex_time = [];
                    let user_selected_flex_time = [];
                    if(item.item_pkg_internal_items)
                    {
                        console.log("INT PACK")
                        let tpp =0;
                        for (let i=0; i<item.item_pkg_internal_items.length; i++)
                        {
                            let pkg_item = JSON.parse(JSON.stringify(item.item_pkg_internal_items[i]));
                            
                            if(pkg_item.selectable_times && pkg_item.selectable_times.length >0)
                            {
                                console.log("asdlkkkk ====== PSKJPAHAPAHA");
                                for (let m = 0; m<pkg_item.selectable_times.length; m++)
                                {
                                    console.log("asdlkkkk ====== ");
                                    if (pkg_item.user_selected_flex_time == pkg_item.selectable_times[m]._id)
                                    {
                                          let purch_price  = pkg_item.selectable_times[m].package_price;
                                          pkg_item.item_package_price = purch_price
                                          console.log("asdlksll-----",purch_price, pkg_item )
                                          tpp+= this.calc_extended_price(purch_price , pkg_item)
                                          let v = pkg_item.selectable_times[m];
                                          //v.ref_item_id = pkg_item._id;
                                          v.selected_time_obj = JSON.parse(JSON.stringify(v));
                                          v.selectable_time_index = m;
                                          
                                          user_selected_flex_time.push(v)
                                    }
                                }
                            }
                            else
                            {
                               tpp+= this.calc_extended_price(pkg_item.item_package_price , pkg_item) 
                            }
                        }
                        console.log("FINAL: asdasdasdasd =="+ tpp)
                        invoice_line.applied_unit_price = tpp;
                        invoice_line.item_price = tpp;
                        if(user_selected_flex_time.length)
                        {
                            invoice_line.user_selected_flex_time = user_selected_flex_time;
                        }
                    }
                    this.cart.items.push(invoice_line)
                    this.calculateCartSummary();
                    this.services = [];
                },
                roundto2digits:function(n)
                {
                    return utils_lib.roundto2digits(n);
                }

        }, // eo methods

        computed : {
            editorShown : {
                get() {
                    const
                        me = this,
                        eventRecord = me.eventRecord
                    ;
                    // we're opening so initialize data
                    if(true === me.value) 
                    {
                     
                    }
                    // we're closing so fire close event
                    else if(false === me.value) {
                     
                        this.$emit('close');
                    }

                    // return always Boolean
                    return !!this.value;
                },
                // only runs on close
                set(value) {
                    
                    this.$emit('input', value);
                }
            } // eo editorShown
        } // eo computed
    } // eo export default

</script>

<!-- eof -->
