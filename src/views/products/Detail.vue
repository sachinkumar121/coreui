<template>
<div>
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <form class="edit-product-form" @submit.prevent="UpdateProduct">
            <div class="form-body">
              <div class="row">
                  <div class="col-md-6 col-lg-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Product Name</b></label>
                          <input 
                          :class={invalid:v$.product_name.$error}
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="product_name"
                          @blur="v$.product_name.$touch()" 
                          />
                          <p class="error-msg" v-if="v$.product_name.$dirty && v$.product_name.required.$invalid">This field must not be empty.</p>
                      </div>
                  </div>
                  <div class="col-md-6 col-lg-4">
                      <div class="form-group">
                          <label class="control-label"><b>Product Code</b></label>
                          <input class="form-control placeholder-no-fix"
                           type="text" 
                           v-model="product_code"
                           :class={invalid:v$.product_code.$error}
                          @blur="v$.product_code.$touch()" 
                            />
                           <p class="error-msg" v-if="v$.product_code.$dirty && v$.product_code.required.$invalid">This field must not be empty.</p> 
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-6 col-lg-4">
                      <div class="form-group">
                          <label class="control-label w-100 d-flex justify-content-between flex-wrap"><b>Product Category</b><span @click="show_prod_cat_modal = true"  class="link-style">Add new category</span></label>
                            <v-select v-model="product_category" label="name" :options="categories_option">
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
                  <div class="col-md-6 col-lg-4">
                      <div class="form-group">
                          <label class="control-label"><b>Product Price {{currency_symbol}}</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          v-model="price" 
                          :class={invalid:v$.price.$error}
                          @blur="v$.price.$touch()" 
                          />
                          <p class="error-msg" v-if="v$.price.$dirty && v$.price.required.$invalid">This field must not be empty.</p> 
                          <p class="error-msg" v-if="v$.price.$dirty && v$.price.minVal.$invalid">price must be greater than 0.</p> 
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-6 col-lg-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Universal product Code</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="upc"
                          />
                      </div>
                  </div>
                  <div class="col-md-6 col-lg-4">
                      <div class="form-group">
                          <label class="control-label"><b>European Article Number</b></label>
                          <input class="form-control placeholder-no-fix"
                           type="text" 
                           v-model="ean"
                            />
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-6 col-lg-4">
                      <div class="md-checkbox has-success">
                      <input type="checkbox" 
                      v-model="is_active" 
                      :checked = is_active
                      class="md-check form-check-input">
                      <label class="ms-2"><b>Mark as active</b> </label>
                    </div>
                  </div>
              </div>
              <div class="row" v-if="isInventoryEnabled">
                  <div class="col-md-8">
                      <div class="text-muted" style="text-align: center;">
                        <label><b>Inventory</b></label> 
                      </div>
                  </div>
                 
              </div>
              <div class="row" v-if="isInventoryEnabled">
                  <div class="col-md-6 col-lg-4">
                      <div class="form-group d-flex" >
                          <label class="control-label"><b>Qty on hand: </b></label><br>
                          <br><p class="ms-1 mb-0">{{ inventory_data?.est_qoh || 0}} (Measure: {{ getUomDesc(inventory_data?.base_uom,inventory_data) }} ) {{ getIncreaseDecreaseTag() }}</p>
                          <!-- <input 
                            class="form-control placeholder-no-fix" 
                            type="text" 
                            readonly
                            :value="inventory_data?.est_qoh"
                          /> -->
                      </div>
                     
                  </div>
                  <div class="col-md-6 col-lg-4">
                      <div class="form-group" >
                          <label class="control-label"><b>{{ getPlaceHolderForNewQty() }}</b></label>
                          <input 
                            v-model.number="adjust_qty"
                            class="form-control placeholder-no-fix" 
                            type="text" 
                            :placeholder=getPlaceHolderForNewQty()
                            
                          />
                          
                      </div>
                  </div>
                 
              </div>
              <div class="row" v-if="isInventoryEnabled">
                  <div class="col-md-6 col-lg-4">
                      <div class="form-group d-flex" >
                          <label class="control-label"><b>Cost per unit: </b></label><br>
                          <br><p class="ms-1 mb-0">
                                {{currency_symbol}}{{ inventory_stock_data?.stock_sales_unit_cost || 0}} </p>
                      </div>
                     
                  </div>
                  <div class="col-md-6 col-lg-4">
                      <div class="form-group" >
                          <label class="control-label"><b>New Cost Per Unit</b></label>
                          <input 
                            v-model.number="adjust_new_sales_unit_cost"
                            class="form-control placeholder-no-fix" 
                            type="text" 
                            placeholder="New Cost Per Unit"
                            
                          />
                          
                      </div>
                  </div>
                 
              </div>
              <!--  Adjusting stock is not shown anymore becuase its automated in simple inventory
                
                <div class="row">
                  
                  <div class="col-md-4">
                      <div class="md-checkbox has-success">
                      <input type="checkbox"  v-model="adjusting_new_stock"
                      :checked="adjusting_new_stock"
                      class="md-check form-check-input">
                      <label class="ms-2"><b>Adjusting because of new stock received</b> </label>
                    </div>
                  </div>
              </div>
              -->

              <div class="row">
                  <div class="col-md-6 col-lg-4">
                      <button class="btn btn-success">Update</button>
                      <button v-if="isInventoryEnabled && !isUseSimplifiedInventory" type="button" @click="$router.push(`/products/${product_id}/inventory-data`)" style="margin-left: 5px" class="btn btn-success">Edit Inventory Data</button>
                  </div>
                  <div class="col-md-6 col-lg-4">
                  </div>
              </div>
            </div>
        </form>
      </CCol>
    </CRow>
    <add-product-cat-modal 
        :visible="show_prod_cat_modal"
        @close="show_prod_cat_modal = false"
        @error="onError"
        @success="onCategoryAdd"
    />
  </div>
</template>
<script>
import { required, minValue, numeric } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {debounce as lodash_debounce} from 'lodash/core'
import Alerts from '../Alerts';
import AddProductCatModal from '@/views/product_category/AddProductCatModal';

export default {
    name: 'EditProduct',
    components:{
        Alerts, AddProductCatModal
    },
    setup: () => ({ v$: useVuelidate() }),
    data(){
      return({
        currency_symbol:this.$store.state.business_settings.business_currency_symbol,
        inventory_data: null,
        inventory_stock_data: null,
        categories_option:[],
        alert:false,
            show:0,
            alertData:{
                message:'',
                type:''
            },
        product_id:'',
        product_name:'',
        product_code:'',
        product_category:'',
        price: 1 ,
        ean:'',
        upc:'',
        is_active: true,
        uomData: this.$store.state.uom_data,
        adjust_qty: null,
        adjusting_new_stock: false,
        adjust_new_sales_unit_cost: null,
        show_prod_cat_modal: false
      })
    },
    computed: {
        isInventoryEnabled() {
            return this.$store.state.business_settings.inventory_enabled;
        },
        isUseSimplifiedInventory(){
          return this.$store.state.business_settings.use_simplified_inventory === undefined? true: this.$store.state.business_settings.use_simplified_inventory
      }
    },
    validations:{
      product_name:{
        required
      },
      product_code:{
        required
      },
      price:{
        required,
        minVal:minValue(1)
      },
      product_category:{
          required
      }
    },
    created(){
        this.getProductCategories();
        this.getProductDetail();
    },
    methods:{
        onCategoryAdd(category) {
            this.categories_option.push(category);
            this.product_category = category;
        },
        onError(message) {
            this.show_prod_cat_modal = false;
            this.alertData = {
                message,
                type: 'danger'
            }
            this.alert = true;
            this.show = 4;
        },
        getIncreaseDecreaseTag()
        {
            let str = ""
            if (this.adjust_qty !== null && this.adjust_qty != "") 
            {
                if(this.adjusting_new_stock)
                {
                    str += " increases by " + Math.abs(this.adjust_qty) + " items"
                }
                else
                {
                    let curr_qoh = this.inventory_data?.est_qoh || 0
                    let diff = this.adjust_qty - curr_qoh;
                    if (diff < -0.0000001)
                    {
                        str += " reduces by " + Math.abs(diff) + " items"
                    }
                    else
                    {
                        str += " increases by " + Math.abs(diff) + " items"
                    }
                }
                
            }
            return str
        },
        getPlaceHolderForNewQty()
        {
            let str = this.adjusting_new_stock?"Quantity received in stock delivery":"New Quantity on Hand"
           
            return str;
        },
        getUomDesc(in_uom_code, id)
        {
            //console.log(in_uom_code, id, "Asdasd")
            if (!in_uom_code)
            {
                return in_uom_code;
            }
            let uom_code = in_uom_code.toUpperCase();
            let uom_codeobj  = this.uomData.filter( e=> {
                       if( e.code == uom_code)
                       {
                        //console.log(e.description)
                           // return e.description;
                           return true;
                       }
                       return false;
                })
               // console.log(uom_codeobj[0],"asdsadsa")
            if (uom_codeobj)
            {
                return uom_codeobj[0].description;
            }
            return in_uom_code
        },
    getProductDetail(){
        this.$schedsdk.get_product_detail({product_id:this.$route.params.product_id,get_stock_data: this.isInventoryEnabled}).then((result)=>{
            if(result.data.status == 1){
                this.product_id = result.data._id
                this.product_name = result.data.name
                this.product_code = result.data.product_code
                this.product_category = result.data.product_category
                this.price = result.data.price
                this.ean = result.data.ean
                this.upc = result.data.upc
                this.is_active = result.data.status ==1? true: false;
                this.inventory_data = result.data.inventory_data
                this.inventory_stock_data = result.data.inventory_stock
                
            }
        })
    },
    isValidNumber(v)
    {
        if(v !== null && 
            v !== '' && 
            Number.isFinite(+v))
        {
            return true;
        }
        return false;
    },
    UpdateProduct(e){
        e.preventDefault();
        this.v$.$touch()
        let data = {
            _id:this.product_id,
            name: this.product_name,  
            price: this.price,
            product_category: this.product_category._id,
            product_code: this.product_code ,
            upc:this.upc,
            ean:this.ean,
            status:this.is_active == true? 1 : 0
        }
        
        //adjust_new_sales_unit_cost
        if (this.adjusting_new_stock) 
        {
            data.receive_new_stock_data = {
                "item_id": this.product_id,
                "received_qty_uom": this.inventory_data.base_uom,
                "stock_received_unit_cost": 0,
                "stock_received_notes": "Product edit",
                "stock_received_po": "",
                "stock_received_qty": this.adjust_qty,
                "stock_received_total_paid_cost": 0,
                "stock_type": 0,
                "received_sales_qty": +this.adjust_qty,
                "stock_inventory_qty": +this.adjust_qty,
                "is_valid": true,
            }
        } 
        else 
        {
            let vaq = this.isValidNumber(this.adjust_qty);
            let vsales =  this.isValidNumber(this.adjust_new_sales_unit_cost)
            if (vsales && +this.adjust_new_sales_unit_cost < -0.000001)
            {
                this.alertData = {
                    message:"Unit price cannot be negative",
                    type:'danger'
                }
                this.alert = true;
                this.show=4;
                return;
            }
            data.adjust_stock_qty_count_data = {
                "adjust_type": 1,
                "item_id": this.product_id,
                "new_qoh": vaq?+this.adjust_qty:null,
                "new_stock_sales_unit_cost": vsales?+this.adjust_new_sales_unit_cost:null,
                "is_valid": (vaq||vsales)?true:false,
            }
        }
        
        if(!this.v$.$invalid){
            this.alert = false;
            this.$schedsdk.edit_product(data).then((result)=>{  
            if(result.status == 1){
                this.$router.push('/products/list');
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
    },
    getProductCategories(){
            this.$schedsdk.get_product_category({}).then((result)=>{
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
    alertClosedFn() {
        this.show = 0;
    },
    updatePlan(e){
        e.preventDefault();
        this.v$.$touch()
        let data = {
            plan_name:this.plan_name,
            plan_id: this.plan_id, 
            plan_description: this.plan_description,  
            plan_level: this.plan_level,  
            min_vol: this.min_vol,
            max_vol: this.max_vol,
            payout: this.payout ,
            currency: this.currency,  //USD vs CAD
            is_active: this.is_active,
        }
        if(!this.v$.$invalid){
            this.alert = false;
            this.$schedsdk.update_referral_plan_detail(this.$route.params.plan_id,data).then((result)=>{
            if(result.data.status == 1){
                this.alertData = {
                    message:result.data.message,
                    type:'success'
                }
                this.alert = true;
                this.show=4;
            }
            else{
                this.alertData = {
                    message:result.data.message,
                    type:'danger'
                }
                this.alert = true;
                this.show=4;
            }
            }).catch(ex=>{
            this.alertData = {
                message:ex.response.data.message,
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