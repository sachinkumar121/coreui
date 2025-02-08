<template>
    <div>
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />

        <form  class="change_password-form" @submit.prevent="changePassword">
            <div class="row">
                <div class="col-md-4">
                    <div class="form-body">
                        <div class="form-group">
                            <label class="control-label"><b>Current Password</b></label>
                            <span class="star">*</span>
                            <input 
                                :class={invalid:v$.password.$error}
                                class="form-control placeholder-no-fix" 
                                type="password" 
                                v-model="password"
                                @blur="v$.password.$touch()" 
                            />
                            <p class="error-msg" v-if="v$.password.$dirty && v$.password.required.$invalid">This field must not be empty.</p>
                        </div>
                        <div class="form-group">
                            <label class="control-label"><b>New Password</b></label>
                            <span class="star">*</span>
                            <input
                            :class={invalid:v$.new_password.$error}
                            class="form-control placeholder-no-fix"
                            type="password"
                            v-model="new_password"
                            @blur="v$.new_password.$touch()"
                            >
                            <p
                            class="error-msg"
                            v-if="v$.new_password.$dirty && v$.new_password.required.$invalid"
                            >Password is required.</p>
                        </div>
                        <div class="form-group">
                            <label class="control-label"><b>Confirm Password</b></label>
                            <span class="star">*</span>
                            <input
                            class="form-control placeholder-no-fix"
                            type="password"
                            :class={invalid:v$.confirm_password.$error}
                            v-model="confirm_password"
                            @blur="v$.confirm_password.$touch()"
                            >
                            <p
                            class="error-msg"
                            v-if="v$.confirm_password.$dirty && v$.confirm_password.required.$invalid"
                            >Confirm Password is required</p>
                            <p
                            class="error-msg"
                            v-if="!v$.confirm_password.required.$invalid && !v$.confirm_password.required.$invalid && v$.confirm_password.sameAsPassword.$invalid"
                            >Passwords must match</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                  <div class="col-md-4">
                      <button class="btn btn-success float-end">Change Password</button>
                  </div>
              </div>
        </form>
        <CModal alignment="center" :backdrop="true" :keyboard="true" :visible="APIResult">
        <CModalHeader>
            <CModalTitle>Result</CModalTitle>
        </CModalHeader>
        <CModalBody>{{message}}</CModalBody>
        <CModalFooter>
            <CButton @click="APIResult = false" v-if="APIResultSuccess == false" color="danger">OK</CButton>
            <CButton @click="closeModal" v-if="APIResultSuccess == true" color="success">OK</CButton>
        </CModalFooter>
        </CModal>
    </div>
</template>
<script>
import Alerts from '../Alerts'
import useVuelidate from '@vuelidate/core';
import { required, sameAs } from '@vuelidate/validators';
export default {
    name:'Profile',
    setup: () => ({ v$: useVuelidate() }),
    components:{
        Alerts
    },
    data(){
        return{
            password:'',
            new_password:'',
            confirm_password:'',
            APIResult:false,
            APIResultSuccess:false,
            message:"",
            alert:false,
            show:0,
            alertData:{
                message:'',
                type:''
            },
        }
    },
    validations() {
        return {
            password: { required },
            new_password: { required },
            confirm_password: { required, sameAsPassword: sameAs(this.new_password) }
        }
    },
    created(){
    },
    methods:{
        closeModal() {
            this.APIResult = false;
            this.$router.push('/dashboard');
        },
        changePassword(e){
            e.preventDefault();
            this.v$.$touch();
            let data = {
                password:this.password,
                new_password:this.new_password
            }
           if(!this.v$.$invalid){
                this.alert = false;
                // console.log(data)
                this.$schedsdk.change_password(data).then((result)=>{  
                if(result.status == 1){
                    this.message = result.message
                    this.APIResult = true
                    this.APIResultSuccess = true
                }
                else{
                    this.message = result.message
                    this.APIResult = true
                    // this.alertData = {
                    //     message:result.message,
                    //     type:'danger'
                    // }
                    // this.alert = true;
                    // this.show=4;
                }
                }).catch(ex=>{
                    this.message = ex.data.message
                    this.APIResult = true
                // this.alertData = {
                //     message:ex.data.message,
                //     type:'danger'
                // }
                // this.alert = true;
                // this.show=4;
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
.invalid {
  border: 1px solid red;
  /* background-color: lightcoral; */
  color: red;
}
.error-msg {
  color: red;
}
</style>