<template>
<div>
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <form class="edit-user-form" @submit.prevent="UpdateTaxData">
            <div class="form-body">
              <div class="row">
                  <div class="col-md-6">
                      <div class="form-group" >
                          <label class="control-label"><b>Federal Sales Tax Id (for Receipts)</b></label>
                          <input 
                          :class={invalid:v$.federal_tax_id.$error}
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="federal_tax_id"
                          @blur="v$.federal_tax_id.$touch()" 
                          />
                          <p class="error-msg" v-if="v$.federal_tax_id.$dirty && v$.federal_tax_id.required.$invalid">This field must not be empty.</p>
                      </div>
                  </div>
                  <div class="col-md-6">
                      <div class="form-group" >
                          <label class="control-label"><b>State Sales Tax Id (for Receipts)</b></label>
                          <input 
                          :class={invalid:v$.sales_tax_id.$error}
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="sales_tax_id"
                          @blur="v$.sales_tax_id.$touch()" 
                          />
                          <p class="error-msg" v-if="v$.sales_tax_id.$dirty && v$.sales_tax_id.required.$invalid">This field must not be empty.</p>
                      </div>
                  </div>
              </div>
              <div class="row mt-2">
                  <div class="col-md-12 h6">
                        Tax Data 1
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Tax Name</b></label>
                          <input 
                          :class={invalid:v$.tax1_name.$error}
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="tax1_name"
                          @blur="v$.tax1_name.$touch()" 
                          />
                          <p class="error-msg" v-if="v$.tax1_name.$dirty && v$.tax1_name.required.$invalid">This field must not be empty.</p>
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Tax Rate (ex. 9.99)</b></label>
                          <input 
                          :class={invalid:v$.tax1_rate.$error}
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="tax1_rate"
                          @blur="v$.tax1_rate.$touch()" 
                          />
                          <p class="error-msg" v-if="v$.tax1_rate.$dirty && v$.tax1_rate.required.$invalid">This field must not be empty.</p>
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Tax is applicable on</b></label>
                            <v-select v-model="tax1_applicable_on" label="name" :options="options">
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
              </div>
              <div class="row mt-2">
                  <div class="col-md-12 h6">
                      Tax Data 2
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Tax Name</b></label>
                          <input 
                          :class={invalid:v$.tax2_name.$error}
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="tax2_name"
                          @blur="v$.tax2_name.$touch()" 
                          />
                          <p class="error-msg" v-if="v$.tax2_name.$dirty && v$.tax2_name.required.$invalid">This field must not be empty.</p>
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Tax Rate (ex. 9.99)</b></label>
                          <input 
                          :class={invalid:v$.tax2_rate.$error}
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="tax2_rate"
                          @blur="v$.tax2_rate.$touch()" 
                          />
                          <p class="error-msg" v-if="v$.tax2_rate.$dirty && v$.tax2_rate.required.$invalid">This field must not be empty.</p>
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Tax is applicable on</b></label>
                            <v-select v-model="tax2_applicable_on" label="name" :options="options">
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
              </div>
              <div class="row">
                  <div class="col-md-12">
                      <button class="btn btn-success float-end">Update</button>
                  </div>
              </div>
            </div>
        </form>
      </CCol>
    </CRow>
  </div>
</template>
<script>
import { required, email } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {debounce as lodash_debounce} from 'lodash/core'
import Alerts from '../Alerts'
export default {
    name: 'TaxSetup',
    setup: () => ({ v$: useVuelidate() }),
    components:{
        Alerts
    },
    data(){
      return({
        options:[
            {type:1,name:"Services"},
            {type:2,name:"Product"},
            {type:3,name:"Both"}
        ],
        alert:false,
            show:0,
            alertData:{
                message:'',
                type:''
            },
        _id:'',
        federal_tax_id:'',
        sales_tax_id:'',
        tax2_name:'',
        tax2_rate:0,
        tax2_applicable_on:{type:1,name:"Services"},
        tax1_name:'',
        tax1_rate:0,
        tax1_applicable_on:{type:1,name:"Services"}
      })
    },
    validations:{
      federal_tax_id:{
        required
      },
      sales_tax_id:{
        required
      },
      tax1_name:{
        required
      },
      tax1_rate:{
        required
      },
      tax1_applicable_on:{
        required
      },
      tax2_name:{
        required
      },
      tax2_rate:{
        required
      },
      tax2_applicable_on:{
        required
      }

    },
    created(){
        this.getUserDetail();
    },
    methods:{
    getUserDetail(){
        this.$schedsdk.get_tax_data().then((result)=>{
            if(result.status == 1){
                this.federal_tax_id = result.data.federal_tax_id
                this.sales_tax_id = result.data.sales_tax_id
                if(result.data.tax_data_array.length){
                    this.tax1_name = result.data.tax_data_array[0].tax_name
                    this.tax1_rate = result.data.tax_data_array[0].tax_rate
                    this.tax1_applicable_on = this.options.find((obj)=>{if (obj.type == result.data.tax_data_array[0].tax_applicable_on) return obj})
                    this.tax2_name = result.data.tax_data_array[1].tax_name
                    this.tax2_rate = result.data.tax_data_array[1].tax_rate
                    // this.tax2_applicable_on.type = result.data.tax_data_array[1].tax_applicable_on
                    this.tax2_applicable_on = this.options.find((obj)=>{if (obj.type == result.data.tax_data_array[1].tax_applicable_on) return obj})
                }
            }
        })
    },
    UpdateTaxData(e){
        e.preventDefault();
        this.v$.$touch()
        let data = {
            federal_tax_id:this.federal_tax_id,
            sales_tax_id:this.sales_tax_id,
            tax_data_array:[{
                tax_name:this.tax1_name,
                tax_rate:this.tax1_rate,
                tax_applicable_on:this.tax1_applicable_on.type
            },{
                tax_name:this.tax2_name,
                tax_rate:this.tax2_rate,
                tax_applicable_on:this.tax2_applicable_on.type
            }]
        }
        if(!this.v$.$invalid){
            this.alert = false;
            this.$schedsdk.update_tax_data(data).then((result)=>{  
            if(result.status == 1){
                this.$router.push('/settings');
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
    alertClosedFn() {
        this.show = 0;
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