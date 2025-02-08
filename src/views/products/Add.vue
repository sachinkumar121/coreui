<template>
<div>
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <form class="add-product-form" @submit.prevent="AddNewProduct">
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
                          <label class="control-label w-100 d-flex justify-content-between flex-wrap"><b>Product Category</b><span @click="show_prod_cat_modal = true" class="link-style">Add new category</span></label>
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
                          <label class="control-label"><b>Product Price</b></label>
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
              <div class="row">
                  <div class="col-md-8">
                      <button class="btn btn-success float-end">Add Product</button>
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
import { required, minValue } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {debounce as lodash_debounce} from 'lodash/core'
import Alerts from '../Alerts'
import AddProductCatModal from '@/views/product_category/AddProductCatModal';

export default {
    name: 'Add Product',
    components:{
        Alerts, AddProductCatModal
    },
    setup: () => ({ v$: useVuelidate() }),
    data(){
      return({
        categories_option:[],
        alert:false,
            show:0,
            alertData:{
                message:'',
                type:''
            },
        product_name:'',
        product_code:'',
        product_category:'',
        price: 1 ,
        ean:'',
        upc:'',
        is_active:true,
        show_prod_cat_modal: false
      })
    },
    // mounted(){
    //     $(this.$refs.modal).on('hidden.bs.modal', () => {
    //         this.product_name = ''
    //     })
    // },
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
        AddNewProduct(e){
            e.preventDefault();
            this.v$.$touch()
            let data = {
                name: this.product_name,  
                price: this.price,
                product_category: this.product_category._id,
                product_code: this.product_code ,
                upc:this.upc,
                ean:this.ean,
                status:this.is_active
            }
            if(!this.v$.$invalid){
                this.alert = false;
                // console.log(data)
                this.$schedsdk.add_product(data).then((result)=>{  
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