<template>
<div>
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <form class="edit-plan-form" @submit.prevent="updatePlan">
            <div class="form-body">
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Plan Name</b></label>
                          <input 
                          :class={invalid:v$.plan_name.$error}
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="plan_name"
                          @change="generatePlanId"
                          @blur="v$.plan_name.$touch()" 
                          />
                          <!-- {{v$.plan_name.$invalid()}} -->
                          <p class="error-msg" v-if="v$.plan_name.$dirty && v$.plan_name.required.$invalid">This field must not be empty.</p>
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Plan level</b></label>
                          <input class="form-control placeholder-no-fix"
                           type="text" 
                           v-model="plan_level"
                           @change="generatePlanId"
                           :class={invalid:v$.plan_level.$error}
                          @blur="v$.plan_level.$touch()" 
                            />
                           <p class="error-msg" v-if="v$.plan_level.$dirty && v$.plan_level.required.$invalid">This field must not be empty.</p> 
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Plan Descritpion</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="plan_description" 
                          :class={invalid:v$.plan_description.$error}
                          @blur="v$.plan_description.$touch()" 
                          />
                          <p class="error-msg" v-if="v$.plan_description.$dirty && v$.plan_description.required.$invalid">This field must not be empty.</p> 
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Plan Id</b></label>
                          <input class="form-control placeholder-no-fix" 
                          :class={invalid:v$.plan_id.$error}
                          type="text" 
                          v-model="plan_id" 
                          @blur="v$.plan_id.$touch()" 
                          name="plan_id"/>
                          <!-- {{v$.plan_id.$dirty}} -->
                          <p class="error-msg" v-if="v$.plan_id.$dirty && v$.plan_id.required.$invalid">This field must not be empty.</p>
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Minimum Volume</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="number" 
                          min=1
                          v-model="min_vol" 
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Maximum Volume</b></label>
                          <input class="form-control placeholder-no-fix" 
                          type="number"
                          min=1 
                          v-model="max_vol" 
                          />
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Payout</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          v-model="payout" 
                          :class={invalid:v$.payout.$error}
                          @blur="v$.payout.$touch()" 
                          />
                          <p class="error-msg" v-if="v$.payout.$dirty && v$.payout.required.$invalid">This field must not be empty.</p> 
                          <p class="error-msg" v-if="v$.payout.$dirty && v$.payout.minVal.$invalid">Payout must be greater than 0.</p> 
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Currency</b></label>
                          <select class="form-control placeholder-no-fix" 
                          v-model="currency" >
                          <Option value="USD" >USD</Option>
                          <Option value="CAD">CAD</Option>
                          </select>
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
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
                  <div class="col-md-4">
                      <button class="btn btn-success">Update Plan</button>
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

import Alerts from '../../Alerts'
export default {
    name: 'AllPlan',
    components:{
        Alerts
    },
    setup: () => ({ v$: useVuelidate() }),
    data(){
      return({
        alert:false,
            show:0,
            alertData:{
                message:'',
                type:''
            },
        _id:'',
        plan_name:'',
        plan_id: '', 
        plan_description: '',  
        plan_level: '',  
        min_vol: 1 ,
        max_vol: 1 ,
        payout: 1 ,
        currency: 'USD' ,  //USD vs CAD
        is_active: true,
      })
    },
    validations:{
      plan_name:{
        required
      },
      plan_id:{
        required
      },
      plan_description:{
        required
      },
      plan_level:{
        required
      },
      payout:{
        required,
        minVal:minValue(1)
      },
    },
    created(){
        this.getPlanDetail();
    },
    methods:{
      getPlanDetail(){
        this.$schedsdk.get_referral_plan_detail(this.$route.params.plan_id).then((result)=>{
          if(result.status == 1){
              this._id = result.data._id
              this.plan_name = result.data.plan_name
              this.plan_id= result.data.plan_id
              this.plan_description= result.data.plan_description 
              this.plan_level= result.data.plan_level
              this.min_vol= result.data.min_vol
              this.max_vol= result.data.max_vol
              this.payout= result.data.payout
              this.currency= result.data.currency
              this.is_active= result.data.is_active
          }
        })
      },
      generatePlanId(){
        this.plan_id = (this.plan_name + this.plan_level).toUpperCase()
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
            if(result.status == 1){
              this.$router.push('/referrals/plans/list')
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