<template>
<div>
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <form class="add-service-form" @submit.prevent="AddNewService">
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
                            <v-select 
                                label="name"
                                v-model="service_category" 
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
                          <p class="error-msg" v-if="v$.price.$dirty && v$.price.minVal.$invalid">price must be greater than 0.</p> 
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
                          <label class="control-label"><b>Select Resource Group</b></label>
                            <v-select 
                                multiple
                                label="group_name"
                                v-model="resources" 
                                :options="resources_option"
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
                                    {{ option.group_name }}
                                    </div>
                                </template>
                                <template v-slot:selected-option="option">
                                    <div style="display: flex; align-items: baseline">
                                        <div class="selected d-center">{{ option.group_name}}</div>
                                    </div>
                                </template>
                            </v-select>   
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="md-checkbox has-success">
                      <input type="checkbox" 
                      v-model="status" 
                      :checked = status
                      class="md-check form-check-input">
                      <label class="ms-2"><b>Mark as active</b> </label>
                    </div>
                  </div>
                  <div class="col-md-4">
                      <div class="md-checkbox has-success">
                      <input type="checkbox" 
                      v-model="is_online_bookable" 
                      :checked = is_online_bookable
                      class="md-check">
                      <label><b>Online Bookable? </b> </label>
                    </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Gap Time (In Mins.)</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          v-model="gap_time" 
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Finish Time (In Mins.)</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          v-model="finish_time" 
                          />
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
  </div>
</template>
<script>
import { required, minValue } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {debounce as lodash_debounce} from 'lodash/core'
import Alerts from '../Alerts'
export default {
    name: 'AddService',
    setup: () => ({ v$: useVuelidate() }),
    components:{
        Alerts
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
            finish_time:0
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
        required,
        minVal:minValue(1)
      },
      time:{
          required,
          minVal:minValue(1)
      }
    },
    created(){
        this.getServiceCategories();
        this.getResourceGroups();
    },
    methods:{
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
        alertClosedFn() {
        this.show = 0;
        },
        AddNewService(e){
            e.preventDefault();
            this.v$.$touch()
            let data = {
                description:this.description,
                in_quick_select:this.in_quick_select,
                name:this.name,
                is_online_bookable:this.is_online_bookable,
                price : this.price,
                service_category : this.service_category._id,
                status : this.status,
                time : this.time,
                split_times:[
                    {index:1,time:this.gap_time,type:1},
                    {index:2,time:this.finish_time,type:0}
                ],
                resource_group_ids : this.resources.map((resource)=>{return resource._id}),
                gap_time : this.gap_time,
                finish_time :this.finish_time
            }
            if(!this.v$.$invalid){
                this.alert = false;
                // console.log(data)
                this.$schedsdk.add_service(data).then((result)=>{  
                if(result.status == 1){
                    this.$router.push('/services/list');
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
                    this.alertData = {
                        message:result.message,
                        type:'success'
                    }
                    this.alert = true;
                    this.show=4;
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