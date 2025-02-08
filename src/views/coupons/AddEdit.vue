<template>
<div>
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <form class="add-package-form" @submit.prevent="AddNewCoupon">
            <div class="form-body">
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Coupon Name</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="coupon.coupon_name" 
                          />
                         
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Coupon Code</b></label>
                          <input class="form-control placeholder-no-fix"
                           type="text" 
                           v-model="coupon.coupon_code"
                            />
                           
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Coupon Description</b></label>
                          <input class="form-control placeholder-no-fix"
                           type="text" 
                           v-model="coupon.description"
                            />
                      </div>
                  </div>
              </div>
              <div class="row">
             
                  <div class="col-md-4">
                    <div class="form-group" >
                        <label class="control-label"><b>Valid From</b></label>
                        <flat-pickr v-model="coupon.valid_from" :config="date_picker_config" placeholder="Start Date"></flat-pickr>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group" >
                        <label class="control-label"><b>Valid To</b></label>
                        <flat-pickr v-model="coupon.valid_till" :config="date_picker_config" placeholder="End Date"></flat-pickr>
                    </div>
                  </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                      <div class="form-group" >
                          <label class="control-label"><b>Coupon applicable to</b></label><CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover="getPopUpHelpObj('help_coupon_applicability')"/>
                            <select 
                              class="form-control" 
                              v-model="coupon.coupon_applicability_type">
                              <option v-for="opt in [{_id:1, name: 'Any Service'}, 
                                        {_id:2, name: 'Any Product' }, 
                                        {_id:3, name: 'Any Service or Any Product' }]" 
                              v-bind:key="opt._id"
                              :selected="opt._id == coupon.coupon_applicability_type ? true : false" :value="opt._id">
                               {{opt.name}}</option>
                            </select>
                          
                         
                      </div>
                  </div>
                 
              </div>
              <div class="row">
                   <div class="col-md-12">
                        -OR- Select specific items below <CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover="getPopUpHelpObj('help_specific_services')"/>
                        <br>
                    </div>
              </div>
              <!-- Services and Products -->
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Select Services</b></label>
                            <v-select multiple v-model="selected_services" 
                                @update:modelValue="changeItemsInPackage" 
                                label="name" :options="services_option">
                            <template v-slot:no-options>
                                Type to search ..
                            </template>
                            <template v-slot:option="option" >
                                <div class="d-center">
                                {{ option.name }} ({{  option.time + " mins" }}) {{ currency_symbol + "" + option.price }}
                                </div>
                            </template>
                            <template v-slot:selected-option="option" >
                                <div class="selected d-center">
                                  {{ option.name }} ({{  option.time + " mins" }}) {{ currency_symbol + "" + option.price }}
                                </div>
                            </template>
                            </v-select>
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Select Products</b></label>
                            <v-select multiple v-model="selected_products" @update:modelValue="changeItemsInPackage" label="name" :options="products_option">
                            <template v-slot:no-options>
                                Type to search ..
                            </template>
                            <template v-slot:option="option" >
                                <div class="d-center">
                                {{ option.name }} {{ currency_symbol + "" + option.price }}
                                </div>
                            </template>
                            <template v-slot:selected-option="option" >
                                <div class="selected d-center">
                                {{ option.name }} {{ currency_symbol + "" + option.price }}
                                </div>
                            </template>
                            </v-select>
                      </div>
                  </div>
              </div>
            <!-- End Services and products -->
              <!-- Categories -->  
                 <div class="row">
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Select Service Category</b></label>
                            <v-select multiple v-model="selected_service_categories" 
                                        @update:modelValue="changeItemsInPackage" 
                                        label="name" :options="service_category_option">
                            <template v-slot:no-options>
                                Type to search ..
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
                          <label class="control-label"><b>Select Product Category</b></label>
                            <v-select multiple v-model="selected_product_categories" 
                                @update:modelValue="changeItemsInPackage" 
                                label="name" :options="product_category_option">
                            <template v-slot:no-options>
                                Type to search ..
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
              <!-- End categories -->
                
              
                 <div class="row">
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Select Packages</b></label>
                            <v-select multiple v-model="selected_packages" 
                                        @update:modelValue="changeItemsInPackage" 
                                        label="package_name" :options="packages_option">
                            <template v-slot:no-options>
                                Type to search ..
                            </template>
                            <template v-slot:option="option" >
                                <div class="d-center">
                                {{ option.package_name }} {{ currency_symbol + "" + option.package_purchase_price }}
                                </div>
                            </template>
                            <template v-slot:selected-option="option" >
                                <div class="selected d-center">
                                  {{ option.package_name }} {{ currency_symbol + "" + option.package_purchase_price }}
                                </div>
                            </template>
                            </v-select>
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Select Providers</b> <CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover="getPopUpHelpObj('help_specific_providers')"/></label>
                         
                            <v-select multiple v-model="selected_providers" 
                                :options="providers_option"
                                 @update:modelValue="changeItemsInProviders" 
                                label="first_name">
                                <template v-slot:no-options>
                                    Type to search ..
                                </template>
                                <template v-slot:option="option" >
                                    <div class="d-center">
                                    {{ option.first_name }} {{option.last_name}}
                                    </div>
                                </template>
                                <template v-slot:selected-option="option" >
                                    <div class="selected d-center">
                                    {{ option.first_name }} {{option.last_name}}
                                    </div>
                                </template>
                            </v-select>           
                      </div>
                  </div>
              </div>
              <!-- End packages -->
                <div class="row">
                   <div class="col-md-12">
                        -- End Specific coupon restrictions -- 
                    </div>
              </div>
              <div class="row">
                  <div class="col-md-6">
                      <div class="form-group" >
                          <label class="control-label"><b>Discount value</b></label> <CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover="getPopUpHelpObj('help_discount_value')"/>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="coupon.amount"
                          />
                      </div>
                  </div>
                  <div class="col-md-6">
                      <div class="form-group" >
                          <label class="control-label"><b>Discount Value type (% or {{currency_symbol}})</b></label>
                            <select 
                              class="form-control" 
                              v-model="coupon.discount_type">
                              <option v-for="opt in [{_id:1, name: 'Percentage off (%)'}, {_id:2, name: 'Flat cash amount off (' +   currency_symbol + ')' }]" 
                              v-bind:key="opt._id"
                              :selected="opt._id == coupon.discount_type ? true : false" :value="opt._id">
                               {{opt.name}}</option>
                            </select>
                          
                         
                      </div>
                  </div>
              </div>
              

             <div class="row">
                  <div class="col-md-6">
                      <div class="form-group" >
                          <label class="control-label"><b>MultiBuy: Buy this quantity</b></label> <CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover="getPopUpHelpObj('help_multibuy')"/>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="coupon.coupon_applicability_buy_x_qty" 
                          />
                         
                      </div>
                  </div>
                  <div class="col-md-6">
                      <div class="form-group">
                          <label class="control-label"><b>MultiBuy: Get this quantity for coupon discount</b></label>
                          <input class="form-control placeholder-no-fix"
                           type="text" 
                           v-model="coupon.coupon_applicability_get_y_qty"
                            />
                      </div>
                  </div>
               
              </div>


               <div class="row">
                <!-- <div class="col-md-4">
                    <div class="md-checkbox has-success">
                        <input type="checkbox" 
                        v-model="consume_on_purchase" 
                        :checked = consume_on_purchase
                        class="md-check">
                        <label><b>Consume package on purchase</b> </label>
                    </div>
                </div> -->
                <div class="col-md-12">
                    <div class="md-checkbox has-success">
                        <input type="checkbox" 
                        v-model="coupon.allow_automatic_apply_on_cart" 
                        :checked = "coupon.allow_automatic_apply_on_cart"
                        class="md-check form-check-input">
                        <label class="ms-2"> Automatically apply coupon to carts that match Multi Buy combo</label> <CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover="getPopUpHelpObj('help_auto_apply_to_carts')"/>
                    </div>
                    <div class="md-checkbox has-success">
                        <input type="checkbox" 
                        v-model="coupon.valid_only_for_new_customers" 
                        :checked = "coupon.valid_only_for_new_customers"
                        class="md-check form-check-input">
                        <label class="ms-2">&nbsp;Valid only for new customers</label> <CIcon
                                    name="cil-CommentSquare"  
                                     v-c-popover="getPopUpHelpObj('help_valid_only_for_new_customers')"/>
                    </div>

                </div>
            </div>
                <div class="row">
                    <div class="col-md-12">
                        <button  class="btn btn-success float-end">{{add_edit_string}} Coupon</button>
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
import moment from 'moment-timezone'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Alerts from '../Alerts'
import utils_lib from '../../helpers/utils_lib';

export default {
    name: 'Add_Edit_Coupon',
    components:{
        Alerts,flatPickr
    },
    setup: () => ({ v$: useVuelidate() }),
    data(){
      return({
        in_coupon_id: this.$route.params.coupon_id || null,
        currency_symbol:this.$store.state.business_settings.business_currency_symbol,
        type_options:[
            {type:1,name:"Series (all items over multiple uses)"},
            {type:2,name:"Single (any items in one use)"} //,
          //  {type:3,name:"Gift Card"}
        ],
        services_option:[],
        products_option:[],
        packages_option: [],
        providers_option: [],
        service_category_option: [],
        product_category_option: [],
        date_picker_config: {
            altFormat: "F j, Y",
            altInput: true,
            // noCalendar: true,
            // enableTime: true,
            // time_24hr: true
        },
        alert:false,
            show:0,
            alertData:{
                message:'',
                type:''
            },
        selected_services:[],
        selected_products:[],
        selected_service_categories:[],
        selected_product_categories:[],
        selected_packages: [],
        selected_providers: [],
        package_items:[],
        package_name:'',
        package_code:'',
        package_description:'',
        package_type:{type:1,name: "Series (all items over multiple uses)"},
        package_valid_from_date:'',
        package_valid_to_date:'',
        
        package_value: 0,
        package_override_total_service_time: 0,
        allow_online_sales :false,
        expiry_days_after_purchase: 0,
        discount_percent_for_services   : 0,  
        discount_percent_for_products   : 0,  
        recur_period                    : 1,   //1 = every month, 2 = every year
        recur_max_periods               : 9998,   //Number of months/years before it stops recurring
        recur_cancel_fee                : 0,
        recur_setup_fee                 : 0,
        recur_late_fee                  : 0,
        recur_client_requested_pause_fee: 0,      //Fee applied when client requests a pause of recurring (temporary stop in membership)
        is_package_recurr_allowed  : false,
        recurr_allow_services_rollover  : false,
        consume_on_purchase: false,
        collect_tax_at_purchase: false,
        add_edit_string: "Add",
        coupon: {}
      })
    },
    validations:{
      package_name:{
        required
      },
      package_code:{
        required
      }
    },
    created(){
        //console.log("asdasd",this.in_coupon_id)
        let sprom = this.getServicesList()
        let pprom = this.getProductsList()
        let scprom = this.getServiceCategoryList()
        let pcprom = this.getProductCategoryList()
        let pkprom = this.getPackagesList()
        let providersprom = this.getProvidersList()
        this.setData(sprom, pprom, scprom, pcprom, pkprom, providersprom)
    },

    computed: {
        
        discount_amount: function(){
            let tpp = (this.total_price - this.total_discouted_price) 
            tpp = this.roundto2(tpp);
            
            return tpp;
        },
        discount_percent: function(){
            if (this.total_price <0.001)
            {
                return 0;
            }
            let tpp = (this.total_price - this.total_discouted_price) / this.total_price;
            tpp = Math.round(Math.abs(tpp) *100);
            
            return tpp;
        },

        total_time: function () {
            let tt = 0;
            this.package_items.map((item)=>{
                if(item.item_type == "S"){
                    tt+= item.service_time * item.qty_allowed_in_package
                }
            })
        return tt;
        },
        total_price: function () {
            let tp = 0;
            this.package_items.map((item)=>{
                tp+= this.calc_extended_price(item.item_price , item)
            })
            return parseFloat(tp).toFixed(2);
        },
        total_discouted_price:function(){
            let tpp = 0;
            this.package_items.map((item)=>{
                
                tpp+= this.calc_extended_price(item.item_package_price , item)
            })
        return parseFloat(tpp).toFixed(2);
        },

        estimated_tax_and_rate_raw_html:function(){
         
            let str = '<td colspan="4" class="text-right"><strong>Est. tax on package sale</strong></td>';
                         
            let bsettings = this.$store.state.business_settings;
            if (this.collect_tax_at_purchase == false)
            {
                return str + '<td class="text-right"><strong> \
                              0% </strong> \
                            </td> \
                            <td> $0 </td>';
            }

            let tax_data = this.calculate_blended_tax(bsettings.tax_data_array, this.package_items);
            let str_total_tax = this.currency_symbol + '' + tax_data.total_tax
            let str_tax_percent = tax_data.blended_tax_rate + '%'
            return  str + '<td class="text-right"> \
                              ' + str_tax_percent + ' \
                            </td> \
                            <td> ' +  str_total_tax +  '</td>';
          
        }
    },
    methods:{
 
    calculate_blended_tax(tax_data_array, item_list)
    {
        let ptotal = 0
        let stotal = 0
        let that = this;
        item_list.map((item)=>{
            if(item.item_type == "S" || item.item_type == "SVCAT"){
                stotal+= that.calc_extended_price(item.item_package_price , item)
            }
            if(item.item_type == "P" || item.item_type == "PRCAT"){
                ptotal+= that.calc_extended_price(item.item_package_price , item)
            }
        })

        if (stotal+ptotal < 0.001)
        {
            return 0;
        }
        
        let svcp_tax = utils_lib.calculate_tax('S', 
                                                stotal,
                                                '99999',
                                                tax_data_array);
                                                            
        let prodp_tax = utils_lib.calculate_tax('P', 
                                                ptotal,
                                                '99999',
                                                tax_data_array);
        console.log("asdasd -- - - svcp_tax");
        console.log(svcp_tax);
        console.log("asdasd -- - - prodp_tax");
        console.log(prodp_tax);
        
        //Blended rate for package
        let total_package_item_tax = svcp_tax.total_tax + prodp_tax.total_tax;
        let blended_pkg_tax_rate =  parseFloat((total_package_item_tax /(stotal+ptotal))*100).toFixed(3);
        console.log("asdasd -- - - bleded tax rate");
        console.log(blended_pkg_tax_rate);
                    
        return {blended_tax_rate: blended_pkg_tax_rate, 
                total_tax: total_package_item_tax,
                total_taxable_amount: (stotal+ptotal)
             }
    },
        changeQuantity(item,event){
            this.package_items.find((obj)=>{
                if(obj.item_id.toString() == item.item_id.toString()){
                    obj.qty_allowed_in_package = event.target.value;
                }
            })
        },
        changeFreeQuantity(item,event){
            this.package_items.find((obj)=>{
                if(obj.item_id.toString() == item.item_id.toString()){
                    obj.item_qty_free = event.target.value;
                }
            })
        },
        changePackagePrice(item,event){
            this.package_items.find((obj)=>{
                if(obj.item_id.toString() == item.item_id.toString()){
                    obj.item_package_price = event.target.value;
                }
            })
        },
        async setData(sprom, pprom,scprom, pcprom, pkprom, providersprom)
        {
              if (this.in_coupon_id === null)
              {
                  return;
              }
              this.add_edit_string = "Update"
              await sprom;
              await pprom;
              await scprom;
              await pcprom; 
              await pkprom;
              await providersprom;
              //console.log(res);
              
            
        },
        getMatchItemCode(option_arr, item_code, selected_arr)
        {
            let found = false;
            option_arr.map((item)=>{
                    if(item._id.toString() == item_code.toString()){
                        selected_arr.push(item);
                        found = true;
                        return found;
                    }
                })
            return found
        },
        getCouponDetail(){
           
            if(!this.in_coupon_id || this.in_coupon_id == null)
            {
                return
            }
            this.$schedsdk.getCouponDetail({_id:this.in_coupon_id}).then((result)=>{
                if(result.status == 1){
                    this._id = result.data._id;
                    this.coupon = result.data[0];

                    this.coupon.coupon_applicability_specific_item_codes.map((obj) => {
                       
                        let found = false;
                        found = this.getMatchItemCode(this.services_option, obj,  this.selected_services)
                        if (found)
                        {
                            return;
                            
                        }

                        found = this.getMatchItemCode(this.products_option, obj,  this.selected_products)
                        if (found)
                        {
                            return;
                            
                        }
                        
                        found = this.getMatchItemCode(this.packages_option, obj,  this.selected_packages)
                        if (found)
                        {
                            return;
                            
                        }
                      
                    })

                    this.coupon.coupon_applicability_specific_item_categories.map((obj) => {
                       
                        let found = false;
                        found = this.getMatchItemCode(this.service_category_option, obj,  this.selected_service_categories)
                        if (found)
                        {
                            return;
                            
                        }
                        found = this.getMatchItemCode(this.product_category_option, obj,  this.selected_product_categories)
                        if (found)
                        {
                            return;
                            
                        }
                          
                    })
                    this.coupon.coupon_applicability_specific_providers.map((obj) => {
                       
                     
                        let found = false;
                        found =this.getMatchItemCode(this.providers_option, obj, this.selected_providers)
                       
                        if(found)
                        {
                            return;
                        }  
                    })

                    // this.changeServiceProduct()
                }
            })
        },
        async getServicesList() {
            return this.$schedsdk.list_services({page_no:1})
                        .then((result)=>{
                                if(result.status == 1){
                                this.services_option = result.data
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
        async getProductsList(){
            return this.$schedsdk.get_products_list({})
                .then((result)=>{
                if(result.status == 1){
                    this.products_option = result.data;
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
         async getServiceCategoryList() {
            return this.$schedsdk.get_service_categories({page_no:1})
                        .then((result)=>{
                                if(result.status == 1){
                                this.service_category_option = result.data
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
        
        async getProductCategoryList(){
            return this.$schedsdk.get_product_category({})
                .then((result)=>{
                if(result.status == 1){
                    this.product_category_option = result.data;
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
        async getProvidersList() {
            //console.log("Asdsadlkasdk-==STATT")
                this.$schedsdk.get_users_list({}).then((result)=>{
                    if(result.status == 1){
                    
                        this.providers_option = result.data
                        this.getCouponDetail()
            
                    }
                      
                })
            },    
        async  getPackagesList() {
            this.$schedsdk.get_packages_list({page_no:this.page}).then((result)=>{
            if(result.status == 1){
             this.packages_option = result.data
           
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
        getHighestPriceInCategory(cat_id, cat_tag, item_list)
        {
              let curr_price = -999999;
              let item = null;
              for(let i=0;i<item_list.length;i++)
              {
                if (item_list[i][cat_tag]._id == cat_id && 
                    item_list[i].price >= curr_price
                 )
                 {
                     item = item_list[i];
                     curr_price =  item_list[i].price ;
                 }
              }
              return item;
        },
        changeItemsInPackage(){
            //this.package_items = [] 
            //this.changeServiceProductCategory();
           // this.changeServiceProduct()
        },
        changeItemsInProviders(){

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
                case 'help_category_package_item': v.header = "Category type package item"; 
                        v.content = "Any item from this category is given a fixed price as set in Discounted Unit Price. The Unit Price shown is the highest value of an item in the category"
                        break;
               case 'help_coupon_applicability': v.header = "Coupon Applicability"; 
                        v.content = "If coupon is not specific to an item/category, this field sets if coupon valid on services or products or valid for both"
                        break;
                case 'help_specific_services': v.header = "Coupon Specific Services"; 
                        v.content = "Set if coupon is valid on a specific list of items/categories"
                        break;       
                case 'help_specific_providers': v.header = "Coupon Applicable to specific providers"; 
                        v.content = "Coupon is applicable only on Bookings and if service provider in that booking matches one in this list."
                        break;                         
                case 'help_discount_value': v.header = "Discount value"; 
                        v.content = "Set the discount this coupon provides. Be sure to select % or flat cash amount discount in next field Discount Value Type"
                        break;       
                case 'help_multibuy': v.header = "Multi Buy"; 
                        v.content = "This is used to implement Buy 2 Get One (free/discounted). Buy quantity establishes how many to buy. This quantity for discount is how many items are provided at discount. Set discount value to 100 and Discount value type as % for 'free'. Otherwise, the discount will be applied on the lowest priced items in the group."
                        break;       
                case 'help_auto_apply_to_carts': 
                        v.header = "Auto apply to carts"; 
                        v.content = "If the option is selected, this coupon is automatically applied to the carts that match this coupon's multi buy setup. Your customer does not need to enter any code during purchase. Use the setting when you have a marketing plan that match this behavior."
                        break;       
                case 'help_valid_only_for_new_customers':
                        v.header = "Valid only for new customers"; 
                        v.content = "When enabled, this coupon is applicable if its a new customer. Note customers can use different email/phone to claim this code and such use cannot be prevented"
                        break;
                default:
                        break;    
            }
            return v;
        },
        alertClosedFn() {
        this.show = 0;
        },
        gatherSpecificItemOrCategories(selected_obj_arr, target_arr, type_arr, type)
        {

            selected_obj_arr.forEach(ele =>{
                target_arr.push(ele._id.toString())
                type_arr.push(type)
            })
        },
        AddNewCoupon(e){
            e.preventDefault();
            let timezone = this.$store.state.business_settings.business_time_zone;
            
            this.coupon.coupon_applicability_specific_item_codes = [];
            this.coupon.coupon_applicability_specific_item_type = [];
            
            this.gatherSpecificItemOrCategories(this.selected_services, 
                                                this.coupon.coupon_applicability_specific_item_codes, 
                                                this.coupon.coupon_applicability_specific_item_type,
                                                'S' );
            this.gatherSpecificItemOrCategories(this.selected_products, 
                                                this.coupon.coupon_applicability_specific_item_codes, 
                                                this.coupon.coupon_applicability_specific_item_type,
                                                'P' );
            this.gatherSpecificItemOrCategories(this.selected_packages, 
                                                this.coupon.coupon_applicability_specific_item_codes, 
                                                this.coupon.coupon_applicability_specific_item_type,
                                                'PKG' );
            
            this.coupon.coupon_applicability_specific_item_categories = [];
            this.coupon.coupon_applicability_specific_category_type = [];
            
            this.gatherSpecificItemOrCategories(this.selected_product_categories, 
                                                this.coupon.coupon_applicability_specific_item_categories, 
                                                this.coupon.coupon_applicability_specific_category_type,
                                                'S' );
            this.gatherSpecificItemOrCategories(this.selected_service_categories, 
                                                this.coupon.coupon_applicability_specific_item_categories, 
                                                this.coupon.coupon_applicability_specific_category_type,
                                                'P' );
            this.coupon.coupon_applicability_specific_providers = [];
            this.selected_providers.forEach(ele =>{
                this.coupon.coupon_applicability_specific_providers.push(ele._id.toString())
            })
           let coupon_obj = JSON.parse(JSON.stringify( this.coupon));
            
           coupon_obj.valid_from =  moment.tz(moment(this.coupon.valid_from).format('YYYY-MM-DD'), timezone).valueOf(),
           coupon_obj.valid_till = moment.tz(moment(this.coupon.valid_till ).format('YYYY-MM-DD'), timezone).valueOf(),
           
           //console.log("asdsad---")
           //console.log(coupon_obj)
           this.alert = false;
                //Default to add_package
                
                let callprom = null;
                if (this.in_coupon_id != null)
                {
                    //If Package ID was provided, then we are editing package
                    
                    coupon_obj._id  = this.in_coupon_id;
                    callprom = this.$schedsdk.editCoupon(coupon_obj);
                }
                else
                {
                    coupon_obj.status = 1;
                    //console.log("asdsad---")
                    //console.log(coupon_obj)
                    callprom = this.$schedsdk.addCoupon(coupon_obj);
                }
                callprom.then((result)=>{  
                if(result.status == 1){
                    this.$router.push('/coupons/list');
                }
                else{
                    this.alertData = {
                        message:result.message,
                        type:'danger'
                    }
                    this.alert = true;
                    this.show=4;
                }
                }).catch(ex=>{
                this.alertData = {
                    message:ex.data.message,
                    type:'danger'
                }
                this.alert = true;
                this.show=4;
                });
        },
        roundto2(v)
        {
                return Math.round((v*100)/100);
        },
        calc_extended_price(unit_price, item)
        {
            return unit_price * (item.qty_allowed_in_package - item.item_qty_free)
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