<template>
<div>
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <form class="add-plan-form" @submit.prevent="updateRegister">
            <div class="form-body">
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>User Name</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="end_user_name"
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>User Email</b></label>
                          <input class="form-control placeholder-no-fix"
                           type="text" 
                           v-model="end_user_email"
                           :class={invalid:v$.end_user_email.$error}
                           @blur="v$.end_user_email.$touch()"
                            />
                           <p class="error-msg" v-if="v$.end_user_email.$dirty && v$.end_user_email.required.$invalid">This field must not be empty.</p> 
                           <p class="error-msg" v-if="v$.end_user_email.$dirty && !v$.end_user_email.required.$invalid && v$.end_user_email.email.$invalid">Please Enter valid email.</p> 
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>User Phone</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="end_user_phone" 
                          />
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>User Address</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="end_user_address"
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Platforn</b></label>
                          <select class="form-control placeholder-no-fix" 
                          v-model="end_user_platform" >
                          <Option value="poynt" >POYNT</Option>
                          <Option value="clover">CLOVER</Option>
                          <Option value="pax">PAX</Option>
                          <Option value="android">ANDROID</Option>
                          <Option value="direct">DIRECT</Option>
                          </select>
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Platform Id</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="end_user_id_on_platform" 
                          />
                      </div>
                  </div>
              </div>
              <hr>
              <div v-if="user_type == 1">
                <div class="row">
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Business Name</b></label>
                                <v-select 
	v-model="select_business_name" label="business_name" :options="options" @search = "onSearch" @update:modelValue="setBusinessId"
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
			{{ option.business_name }}
			</div>
		</template>
		<template v-slot:selected-option="option">
			<div style="display: flex; align-items: baseline">
				<div class="selected d-center">{{ option.business_name}}</div>
			</div>
		</template>
	</v-select> 

                          <!-- <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="discovered_business_name"
                          /> -->
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Business Id</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="discovered_business_id"
                          readonly
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Referral Business Id</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="refpartner_business_id"
                          
                          />
                          <!-- :class={invalid:v$.refpartner_business_id.$error}
                           @blur="v$.refpartner_business_id.$touch()"
                          <p class="error-msg" v-if="v$.refpartner_business_id.$dirty && !v$.refpartner_business_id.required">This field must not be empty.</p>  -->
                      </div>
                  </div>
                </div>
                <div class="row">
                  
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Referral User Id</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="refpartner_user_id"
                          
                          />
                          <!-- :class={invalid:v$.refpartner_user_id.$error}
                           @blur="v$.refpartner_user_id.$touch()"
                          <p class="error-msg" v-if="v$.refpartner_user_id.$dirty && !v$.refpartner_user_id.required">This field must not be empty.</p>  -->
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Approved On</b></label>
                          <input 
                          
                          class="form-control placeholder-no-fix" 
                          type="date" 
                          v-model="approved_date"
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Subscription Start</b></label>
                          <input 
                          
                          class="form-control placeholder-no-fix" 
                          type="date" 
                          v-model="actual_subcription_begin_date"
                          />
                      </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Subscription End</b></label>
                          <input 
                          
                          class="form-control placeholder-no-fix" 
                          type="date" 
                          v-model="actual_subcription_end_date"
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Orignal plan level</b></label>
                          <input 
                          
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="original_plan_level"
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Current plan level</b></label>
                          <input 
                          
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="current_plan_level"
                          />
                      </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Referral Plan Id</b></label>
                          <input 
                          
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="applied_referral_plan_id"
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Target Payout</b></label>
                          <input 
                          
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="target_payout"
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Vested payout</b></label>
                          <input 
                          
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="vested_payout"
                          />
                      </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Disbursed Payout</b></label>
                          <input 
                          
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="disbursed_payout"
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Available payout</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="available_payout"
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Est days for payout</b></label>
                          <input
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="estimated_days_for_full_payout"
                          />
                      </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Last Disbursed Date</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="date" 
                          v-model="last_disburse_date"
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Last Disbursed Amount</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="last_disburse_amount"
                          />
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Last Disbursed Reference</b></label>
                          <input 
                          class="form-control placeholder-no-fix" 
                          type="text" 
                          v-model="last_disburse_reference"
                          />
                      </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <div class="md-checkbox has-success">
                        <input type="checkbox" 
                        v-model="is_closed" 
                        :checked = is_closed
                        class="md-check">
                        <label><b>Is Close</b> </label>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <div class="md-checkbox has-success">
                        <input type="checkbox" 
                        v-model="is_exact_match" 
                        :checked = is_exact_match
                        class="md-check">
                        <label><b>Exact match</b> </label>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <div class="md-checkbox has-success">
                        <input type="checkbox" 
                        v-model="is_approved" 
                        :checked = is_approved
                        class="md-check">
                        <label><b>Is Approved</b> </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                  <div class="col-md-12">
                      <button  class="btn btn-success float-end">Update Referral</button>
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
import Alerts from '../../Alerts'
import {debounce as lodash_debounce} from 'lodash'
import moment from 'moment'
export default {
    name: 'AllPlan',
    components:{
        Alerts
    },
    setup: () => ({ v$: useVuelidate() }),
    data(){
      return({
      options: [],
        user_type:this.$store.state.user_data.type,
        alert:false,
            show:0,
            alertData:{
                message:'',
                type:''
            },
            select_business_name:'',
        end_user_name: '',
        end_user_email: '',
        end_user_address: '',
        end_user_phone: '',
        end_user_platform: 'poynt',
        end_user_id_on_platform: '',
        // submission_date:  0,
        discovered_business_id: '',
        discovered_business_name: '',
        is_auto_discovered: false,
        is_approved: false,
        approved_date: 0,
        is_exact_match: false,
        refpartner_user_id:'',
        refpartner_business_id:'',
        actual_subcription_begin_date: 0,
        actual_subcription_end_date: 0,
        original_plan_level: 0,
        current_plan_level: 0,
        applied_referral_plan_id:  '', 
        target_payout:  0,
        vested_payout:  0,
        disbursed_payout:  0,
        available_payout:  0,
        estimated_days_for_full_payout:  0,
        last_disburse_date:  0,
        last_disburse_amount:  0,
        last_disburse_reference:  '', 
        is_closed: false,
      })
    },
    validations:{
      end_user_email:{
        required,
        email
      }
    },
    created(){
        this.getRegisterDetail();
        // this.$schedsdk.getBusinessList("").then(res => {
        //         if(res.status == 1)
        //             this.options = res.data;
		//   });
    },
    methods:{
        // onSearch(search, loading) {
        //   loading(true);
        // //   this.search(loading,search,this)
        //   this.$schedsdk.getBusinessList(search).then(res => {
        //         if(res.status == 1)
        //             this.options = res.data;
        //         else
        //         this.options = [];
		// 	    loading(false);
		//   });
		// },
    onSearch(search, loading) {
		  loading(true);
		  this.search(loading, search, this);
		},
		search: lodash_debounce((loading, search, vm) => {
            // vm.$http.get('business?search='+search).then(res => {
            vm.$schedsdk.getBusinessList(search).then(res => {
                if(res.status == 1)
                    vm.options = res.data;
                else
                vm.options = [];
			    loading(false);
		  });
		}, 300),
        setBusinessId(){
             this.discovered_business_name = this.select_business_name.business_name;
             this.discovered_business_id = this.select_business_name._id;
        },
      getRegisterDetail(){
        this.$schedsdk.get_referral_register_detail(this.$route.params.register_id).then((result)=>{
          if(result.status == 1){
            if(this.user_type == 1){
                this._id = result.data._id
                this.end_user_name = result.data.end_user_name;
                this.end_user_email = result.data.end_user_email;
                this.end_user_address = result.data.end_user_address;
                this.end_user_phone = result.data.end_user_phone;
                this.end_user_platform = result.data.end_user_platform;
                this.end_user_id_on_platform = result.data.end_user_id_on_platform;
                this.is_auto_discovered = result.data.is_auto_discovered;
                this.discovered_business_id = result.data.discovered_business_id;
                this.discovered_business_name = result.data.discovered_business_name;
                this.is_approved = result.data.is_approved;
                this.approved_date = (result.data.approved_date != 0 ) ? moment.unix(result.data.approved_date).format('YYYY-MM-DD') : 0;
                this.is_exact_match = result.data.is_exact_match;
                this.actual_subcription_begin_date = (result.data.actual_subcription_begin_date != 0 ) ? moment.unix(result.data.actual_subcription_begin_date).format('YYYY-MM-DD') : 0;
                this.actual_subcription_end_date = (result.data.actual_subcription_end_date != 0 ) ? moment.unix(result.data.actual_subcription_end_date).format('YYYY-MM-DD') : 0;
                this.original_plan_level = result.data.original_plan_level;
                this.current_plan_level = result.data.current_plan_level;
                this.applied_referral_plan_id = result.data.applied_referral_plan_id;
                this.target_payout = result.data.target_payout;
                this.vested_payout = result.data.vested_payout;
                this.disbursed_payout = result.data.disbursed_payout;
                this.available_payout =  result.data.available_payout;
                this.estimated_days_for_full_payout = result.data.estimated_days_for_full_payout,
                this.last_disburse_date = (result.data.last_disburse_date != 0 ) ? moment.unix(result.data.last_disburse_date).format('YYYY-MM-DD') : 0,
                this.last_disburse_amount = result.data.last_disburse_amount,
                this.last_disburse_reference = result.data.last_disburse_reference, 
                this.is_closed = result.data.is_closed,
                this.refpartner_business_id = result.data.refpartner_business_id,
                this.refpartner_user_id = result.data.refpartner_user_id,
                this.select_business_name = result.data.discovered_business_name;
            }
            else{
                this.end_user_name = result.data.end_user_name,
                this.end_user_email = result.data.end_user_email,
                this.end_user_address = result.data.end_user_address,
                this.end_user_phone = result.data.end_user_phone,
                this.end_user_platform = result.data.end_user_platform,
                this.end_user_id_on_platform = result.data.end_user_id_on_platform
                this.is_auto_discovered = result.data.is_auto_discovered
            }
          }
        })
      },
      alertClosedFn() {
          this.show = 0;
      },
      updateRegister(e){
        e.preventDefault();
        this.v$.$touch();
        let data = {};
        if(this.user_type == 1){
          data = {
            end_user_name: this.end_user_name,
            end_user_email: this.end_user_email,
            end_user_address: this.end_user_address,
            end_user_phone: this.end_user_phone,
            end_user_platform: this.end_user_platform,
            end_user_id_on_platform: this.end_user_id_on_platform,
            is_auto_discovered: this.is_auto_discovered,
            discovered_business_id: this.discovered_business_id,
            discovered_business_name: this.discovered_business_name,
            is_approved: this.is_approved,
            approved_date:  moment(this.approved_date).unix(),
            is_exact_match: this.is_exact_match,
            actual_subcription_begin_date: moment(this.actual_subcription_begin_date).unix(),
            actual_subcription_end_date: moment(this.actual_subcription_end_date).unix(),
            original_plan_level: this.original_plan_level,
            current_plan_level: this.current_plan_level,
            applied_referral_plan_id:  this.applied_referral_plan_id, 
            target_payout:  this.target_payout,
            vested_payout:  this.vested_payout,
            disbursed_payout:  this.disbursed_payout,
            available_payout: this.available_payout,
            estimated_days_for_full_payout:  this.estimated_days_for_full_payout,
            last_disburse_date:  moment(this.last_disburse_date).unix(),
            last_disburse_amount:  this.last_disburse_amount,
            last_disburse_reference:  this.last_disburse_reference, 
            is_closed: this.is_closed,
            refpartner_business_id:this.refpartner_business_id,
            refpartner_user_id:this.refpartner_user_id
          }
        }
        else{
          data = {
            end_user_name: this.end_user_name,
            end_user_email: this.end_user_email,
            end_user_address: this.end_user_address,
            end_user_phone: this.end_user_phone,
            end_user_platform: this.end_user_platform,
            end_user_id_on_platform: this.end_user_id_on_platform,
            // submission_date:  0,
          }
        }
        // console.log(data)
        if(!this.v$.$invalid){
          this.alert = false;
          if(this.user_type == 1 && data.refpartner_user_id == '' || data.refpartner_business_id == '')
            {
                this.alertData = {
                    message:"Please enter reference partner fields",
                    type:'danger'
                }
                this.alert = true;
                this.show=4;
            }
            else{
                this.$schedsdk.update_referral_register_detail(this.$route.params.register_id,data).then((result)=>{
                    if(result.status == 1){
                    this.$router.push('/referrals/register/list');
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
