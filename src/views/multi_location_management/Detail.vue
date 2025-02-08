<template>
<div>
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
       <form  class="business-profile-form" @submit.prevent="submitBusinessProfileDetail">
            <div class="form-body">
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="control-label"><b>Business Name</b></label>
                            <span class="star"></span>
                            <input class="form-control placeholder-no-fix" type="text" v-model="business_name"/>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="control-label"><b>Business Phone</b></label>
                            <span class="star"></span>
                            <input class="form-control placeholder-no-fix" type="text" v-model="business_phone"/>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="control-label"><b>Max. Employees</b></label>
                            <span class="star"></span>
                            <input class="form-control placeholder-no-fix" type="text" v-model="no_of_employees"/>
                        </div>
                        </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="control-label"><b>Business Address Line 1</b></label>
                            <span class="star"></span>
                            <input class="form-control placeholder-no-fix" type="text" maxlength="30" v-model="address_line1"/>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="control-label"><b>Business Address Line 2</b></label>
                            <span class="star"></span>
                            <input class="form-control placeholder-no-fix" type="text" maxlength="30" v-model="address_line2"/>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="control-label"><b>Business Website URL</b></label>
                            <span class="star"></span>
                            <input class="form-control placeholder-no-fix" type="text" v-model="business_website"/>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="control-label"><b>Small Business Logo Url</b></label>
                            <span class="star"></span>
                            <input class="form-control placeholder-no-fix" type="text" v-model="small_logo_url"/>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="control-label"><b>Large Business Logo Url</b></label>
                            <span class="star"></span>
                            <input class="form-control placeholder-no-fix" type="text" v-model="large_logo_url"/>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="control-label"><b>Privacy Policy Url</b></label>
                            <span class="star"></span>
                            <input class="form-control placeholder-no-fix" type="text" v-model="privacy_policy"/>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="control-label"><b>Terms & Conditions Url</b></label>
                            <span class="star"></span>
                            <input class="form-control placeholder-no-fix" type="text" v-model="terms_and_conditions"/>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2">
                        <div class="form-group">
                            <label class="control-label"><b>City</b></label>
                            <span class="star"></span>
                            <input class="form-control placeholder-no-fix" type="text" v-model="city"/>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="form-group">
                            <label class="control-label"><b>State</b></label>
                            <span class="star"></span>
                            <input class="form-control placeholder-no-fix" type="text" v-model="state"/>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="form-group">
                            <label class="control-label"><b>Country</b></label>
                            <span class="star"></span>
                            <input class="form-control placeholder-no-fix" type="text" v-model="country"/>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="form-group">
                            <label class="control-label"><b>Zip Code</b></label>
                            <span class="star"></span>
                            <input class="form-control placeholder-no-fix" type="text" v-model="zipcode"/>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8">
                        <div class="form-actions">
                            <button class="btn btn-success float-end">Submit</button>
                            <!-- <a id="register-back-btn" :href="dashboard" class="btn btn-default">Cancel</a> -->
                        </div>
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
import PhoneNumber from 'awesome-phonenumber'
import Alerts from '../Alerts'
export default {
    name: 'BusinessDetail',
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
            _id:null,
            address_line1: '',
            address_line2: '',
            // business_email: '',
            business_name: '',
            business_phone: '',
            business_website: '',
            city: '',
            country: '',
            // current_plan_level: '',
            large_logo_url: '',
            // location_id: '',
            no_of_employees: '',
            privacy_policy: '',
            small_logo_url: '',
            state: '',
            // terminal_id: '',
            terms_and_conditions: '',
            // unique_scope_id: '',
            zipcode: ''
      })
    },
    validations:{
      name:{
        required
      },
      description:{
        required
      }
    },
    created(){
        this.getBusinessProfileDetail();
    },
    methods:{
        getBusinessProfileDetail(){
            this.$schedsdk.get_business_detail(this.$route.params.business_id).then((result)=>{
                if(result.status == 1){
                    console.log(result.data)
                   Object.assign(this,result.data)
                }
            })
        },
        submitBusinessProfileDetail(e){
            e.preventDefault();
            let data = {
                _id:this._id,
                address_line1:this.address_line1,
                address_line2:this.address_line2,
                business_name:this.business_name,
                business_phone:this.business_phone,
                business_website:this.business_website,
                state:this.state,
                city:this.city,
                country:this.country,
                large_logo_url:this.large_logo_url,
                small_logo_url:this.small_logo_url,
                no_of_employees:this.no_of_employees,
                privacy_policy:this.privacy_policy,
                terms_and_conditions:this.terms_and_conditions
            }
            // console.log(data)
            this.$schedsdk.update_business_detail(data).then((result)=>{
                if(result.status == 1){
                //    Object.assign(this,result.data)
                   this.$router.push('/business/list');
                }
            })
        },
        alertClosedFn() {
            this.show = 0;
        },
        getPhoneFormatted(phone, country_code ="US")
        {
            var pn = new PhoneNumber(phone, {regionCode: country_code});
            if (pn.isValid())
            {
                return pn.getNumber('national');
            }
            return null;
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