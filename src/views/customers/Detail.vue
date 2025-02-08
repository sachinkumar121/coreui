<template>
<div>
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <form class="edit-package-form" @submit.prevent="UpdatePackage">
            <div class="form-body">
               <div class="row">
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Package Name</b></label>
                          <input 
                          :class={invalid:v$.package_name.$error}
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="package_name"
                          @blur="v$.package_name.$touch()" 
                          />
                          <p class="error-msg" v-if="v$.package_name.$dirty && v$.package_name.required.$invalid">This field must not be empty.</p>
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Package ID</b></label>
                          <input class="form-control placeholder-no-fix"
                           type="text" 
                           v-model="package_code"
                           :class={invalid:v$.package_code.$error}
                          @blur="v$.package_code.$touch()" 
                            />
                           <p class="error-msg" v-if="v$.package_code.$dirty && v$.package_code.required.$invalid">This field must not be empty.</p> 
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Package Description</b></label>
                          <input class="form-control placeholder-no-fix"
                           type="text" 
                           v-model="package_description"
                            />
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Package Type</b></label>
                            <v-select v-model="package_type" label="name" :options="type_options">
                            <template v-slot:no-options>
                                Type to search..
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
                    <div class="form-group" >
                        <label class="control-label"><b>Valid From</b></label>
                        <flat-pickr v-model="package_valid_from_date" :config="date_picker_config" placeholder="Start Date"></flat-pickr>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group" >
                        <label class="control-label"><b>Valid To</b></label>
                        <flat-pickr v-model="package_valid_to_date" :config="date_picker_config" placeholder="End Date"></flat-pickr>
                    </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Select Services</b></label>
                            <v-select multiple v-model="selected_services" @update:modelValue="changeServiceProduct" label="name" :options="services_option">
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
                          <label class="control-label"><b>Select Products</b></label>
                            <v-select multiple v-model="selected_products" @update:modelValue="changeServiceProduct" label="name" :options="products_option">
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
              <div class="row  table-responsive" v-if='package_items.length'>
                  <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Qty</th>
                            <th>Free Qty</th>
                            <th>Price</th>
                            <th>Discounted Unit Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in package_items" :key="index">
                            <td>{{item.copied_item_name}}</td>
                            <td><input type="text"  size="4" 
                            v-model="item.qty_allowed_in_package"
                             @keyup="changeQuantity(item,$event)"/></td>
                            <td><input type="text" size="3" 
                            v-model="item.item_qty_free"
                            @keyup="changeFreeQuantity(item,$event)"/></td>
                            <td>{{currency_symbol}}{{item.item_price}}</td>
                            <td>{{currency_symbol}}<input type="text"  size="5" 
                            v-model="item.item_package_price"
                            @keyup="changePackagePrice(item,$event)"/></td>
                        </tr>
                        <!-- Totals -->
                        <tr>
                            <td> </td>
                            <td> </td>
                            <td>Totals:</td>
                            <td>{{currency_symbol}}{{total_price}}</td>
                            <td>{{currency_symbol}}{{total_discouted_price}} </td>
                        </tr>      
                        <tr>
                            <td> </td>
                            <td> </td>
                            <td> Discount:</td>
                            <td>-{{currency_symbol}}{{discount_amount}}</td>
                            <td>( {{discount_percent}}% off)</td>
                        </tr>       
                         <tr>
                            <td> </td>
                            <td> </td>
                            <td><strong>Package Price:</strong></td>
                            <td></td>
                            <td><strong>{{currency_symbol}}{{total_discouted_price}}</strong></td>
                        </tr>                        
                    </tbody>
                  </table>
              </div>
              <div class="row" v-if='package_items.length'>
                <div class="col-md-4">
                    <div class="form-group" >
                        <label class="control-label"><b>Package Price: </b></label>
                       {{currency_symbol}}{{total_discouted_price}} ( 
                           {{discount_percent}}% discount on {{currency_symbol}}{{total_price}} )
                    </div>
                </div>
           
            </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Recurring Months</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="recur_max_periods"
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Recurring Cancel Fees</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="recur_cancel_fee"
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Recurring Setup Fees</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="recur_setup_fee"
                          />
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Recurring Late Fee</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="recur_late_fee"
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Recurring Pause Fees</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="recur_client_requested_pause_fee"
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Expiry After Days</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="expiry_days_after_purchase"
                          />
                      </div>
                  </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                    <div class="md-checkbox has-success">
                        <input type="checkbox" 
                        v-model="recurr_allow_services_rollover" 
                        :checked = recurr_allow_services_rollover
                        class="md-check form-check-input">
                        <label class="ms-2"><b>Recurring Allow Service Rollover</b> </label>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="md-checkbox has-success">
                        <input type="checkbox" 
                        v-model="allow_online_sales" 
                        :checked = allow_online_sales
                        class="md-check form-check-input">
                        <label class="ms-2"><b>Allow Online Sales</b> </label>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="md-checkbox has-success">
                        <input type="checkbox" 
                        v-model="is_package_recurr_allowed" 
                        :checked = is_package_recurr_allowed
                        class="md-check form-check-input">
                        <label class="ms-2"><b>Allow Recurring Subscription</b> </label>
                    </div>
                </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <button class="btn btn-success">Update</button>
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
export default {
    name: 'Edit_Package',
    components:{
        Alerts,flatPickr
    },
    setup: () => ({ v$: useVuelidate() }),
    data(){
      return({
        currency_symbol:this.$store.state.business_settings.business_currency_symbol,
        type_options:[
            {type:1,name:"Series"},
            {type:2,name:"Single Use"}//,
            //{type:3,name:"Gift Card"}
        ],
        services_option:[],
        products_option:[],
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
        _id:'',
        package_items:[],
        package_name:'',
        package_code:'',
        package_description:'',
        package_type:{type:1,name:"Series"},
        package_valid_from_date:'',
        package_valid_to_date:'',
        package_value: 0,
        package_override_total_service_time: 0,
        allow_online_sales :false,
        expiry_days_after_purchase: 0,
        recur_period                    : 1,   //1 = every month, 2 = every year
        recur_max_periods               : 9998,   //Number of months/years before it stops recurring
        recur_cancel_fee                : 0,
        recur_setup_fee                 : 0,
        recur_late_fee                  : 0,
        recur_client_requested_pause_fee: 0,      //Fee applied when client requests a pause of recurring (temporary stop in membership)
        is_package_recurr_allowed  : false,
        recurr_allow_services_rollover  : false
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
        this.setData()
    },
    computed: {
        
        discount_amount: function(){
            let tpp = (this.total_price - this.total_discouted_price) 
            tpp = Math.round((tpp*100)/100);
            
            return tpp;
        },
        discount_percent: function(){
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
                tp+= item.item_price * (item.qty_allowed_in_package - item.item_qty_free)
            })
            return tp;
        },
        total_discouted_price:function(){
            let tpp = 0;
            this.package_items.map((item)=>{
                tpp+= item.item_package_price * (item.qty_allowed_in_package - item.item_qty_free)
            })
        return tpp;
        }
    },
    methods:{
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
        setData(){
            this.$schedsdk.list_services({page_no:1}).then((resultS)=>{
                if(resultS.status == 1){
                    this.services_option = resultS.data
                    this.$schedsdk.get_products_list({}).then((resultP)=>{
                        if(resultP.status == 1){
                        this.products_option = resultP.data
                        this.getPackageDetail()
                        }
                    })
                }
            })
        },
        getPackageDetail(){
            this.$schedsdk.get_package_detail({package_id:this.$route.params.package_id}).then((result)=>{
                if(result.status == 1){
                    this._id = result.data._id
                    this.package_name = result.data.package_name,
                    this.package_code = result.data.package_code,
                    this.package_description = result.data.package_description,
                    this.package_type = this.type_options.find((obj)=>{if (obj.type == result.data.package_type) return obj})
                    this.package_valid_from_date = result.data.package_valid_from_date,
                    this.package_valid_to_date = result.data.package_valid_to_date,
                    this.recur_max_periods = result.data.recur_max_periods ,
                    this.package_value = result.data.package_value,
                    this.package_purchase_price = result.data.package_purchase_price,
                    this.package_override_total_service_time = result.data.package_override_total_service_time,
                    this.allow_online_sales  = result.data.allow_online_sales,
                    this.expiry_days_after_purchase = result.data.expiry_days_after_purchase,
                    this.recur_period                     = result.data.recur_period,   //1 = every month, 2 = every year
                    this.recur_max_periods                = result.data.recur_max_periods,   //Number of months/years before it stops recurring
                    this.recur_cancel_fee                = result.data.recur_cancel_fee,
                    this.recur_setup_fee                  = result.data.recur_setup_fee,
                    this.recur_late_fee                  = result.data.recur_late_fee,
                    this.is_package_recurr_allowed = result.data.is_package_recurr_allowed,
                    this.recur_client_requested_pause_fee  = result.data.recur_client_requested_pause_fee,      //Fee applied when client requests a pause of recurring (temporary stop in membership)
                    this.recurr_allow_services_rollover = result.data.recurr_allow_services_rollover
                    this.package_items = result.data.package_items
                    result.data.package_items.map((obj)=>{
                        if(obj.item_type == "S"){
                            this.services_option.map((service)=>{
                                if(service._id.toString() == obj.item_id.toString()){
                                    this.selected_services.push(service);
                                }
                            })
                        }
                        else if(obj.item_type == "P"){
                            this.products_option.map((product)=>{
                                if(product._id.toString() == obj.item_id.toString()){
                                    this.selected_products.push(product);
                                }
                            })
                        }
                    })
                    // this.changeServiceProduct()
                }
            })
        },
        alertClosedFn() {
            this.show = 0;
        },
        getServicesList() {
            this.$schedsdk.list_services({page_no:1}).then((result)=>{
                if(result.status == 1){
                    this.services_option = result.data
                }
            })
        },
        getProductsList(){
            this.$schedsdk.get_products_list({}).then((result)=>{
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
        changeServiceProduct(){
            let services = this.selected_services.map((obj)=>{
                let item = {
                    item_id :obj._id ,
                    item_type :"S",
                    copied_item_name :obj.name,             //copied from original item_tables
                    qty_allowed_in_package :1,
                    item_price: obj.price,                  // Original copied from item tables
                    item_package_price: 0,                  //This is user (owner/receptionist) provided for this package
                    item_discount_application_method: 1,                  // 1 = percent. 2 = limited to item_price upon package purchase.
                    item_qty_free : 0,      //How many items are free (100% discount)
                        service_time :obj.time
                    }
                    return item;
                })
            let s_prod = this.selected_products.map((obj)=>{
                let item = {
                    item_id :obj._id ,
                    item_type :"P",
                    copied_item_name :obj.name,             //copied from original item_tables
                    qty_allowed_in_package :1,
                    item_price: obj.price,                  // Original copied from item tables
                    item_package_price: 0,                  //This is user (owner/receptionist) provided for this package
                    item_discount_application_method: 1,                  // 1 = percent. 2 = limited to item_price upon package purchase.
                    item_qty_free : 0,      //How many items are free (100% discount)
                    service_time :obj.time
                    }
                    return item;
                })   
                
                for(let i=0;i<services.length;i++){
                    let s_find = this.package_items.find((pkg_item)=>{
                        if(pkg_item.item_id == services[i].item_id){
                            return pkg_item
                        }
                    });
                    if(!s_find){
                        this.package_items.push(services[i])
                    }
                }
                for(let i=0;i<s_prod.length;i++){
                    let p_find = this.package_items.find((pkg_item)=>{
                        if(pkg_item.item_id == s_prod[i].item_id){
                            return pkg_item
                        }
                    });
                    if(!p_find){
                        this.package_items.push(s_prod[i])
                    }
                }
                // this.package_items = [] 
                // this.package_items = this.package_items.concat(services);
                // this.package_items = this.package_items.concat(s_prod);
        },
        UpdatePackage(e){
            e.preventDefault();
            this.v$.$touch()
            let timezone = this.$store.state.business_settings.business_time_zone;
            let req_data =  {
                _id:this._id,
                "package_name":this.package_name,
                "package_description":this.package_description,
                "package_code":this.package_code,
                "package_type":this.package_type.type,
                "expiry_days_after_purchase":this.expiry_days_after_purchase,
                "package_items":this.package_items,
                "package_purchase_price":this.package_purchase_price,
                "package_override_total_service_time":25,
                "package_valid_from_date":moment.tz(moment(this.package_valid_from_date).format('YYYY-MM-DD'), timezone).valueOf(),
                "package_valid_to_date":moment.tz(moment(this.package_valid_to_date).format('YYYY-MM-DD'), timezone).valueOf(),
                "allow_online_sales":this.allow_online_sales,
                "recur_period"                    : this.recur_period,   //1 = every month, 2 = every year
                "recur_max_periods"               : this.recur_max_periods,   //Number of months/years before it stops recurring
                "recur_cancel_fee"                : this.recur_cancel_fee,
                "recur_setup_fee"                 : this.recur_setup_fee,
                "recur_late_fee"                  : this.recur_late_fee,
                "recur_client_requested_pause_fee": this.recur_client_requested_pause_fee,      //Fee applied when client requests a pause of recurring (temporary stop in membership)
                "recurr_allow_services_rollover"  : this.recurr_allow_services_rollover,
                "is_package_recurr_allowed"  : this.is_package_recurr_allowed
            } 
            // console.log(req_data)
            if(!this.v$.$invalid){
                this.alert = false;
                this.$schedsdk.edit_package(req_data).then((result)=>{
                if(result.status == 1){
                    this.$router.push('/packages/list')
                    // this.alertData = {
                    //     message:result.message,
                    //     type:'success'
                    // }
                    // this.alert = true;
                    // this.show=4;
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
            }
        }
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