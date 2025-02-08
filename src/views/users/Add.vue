<template>
<div>
    <CRow>
      <CCol sm="12">
        <Alerts
        :alertData="alertData"
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <form class="add-user-form" @submit.prevent="AddNewUser">
            <div class="form-body">
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>First Name</b></label>
                          <input
                          :class={invalid:v$.first_name.$error}
                          class="form-control placeholder-no-fix"
                          type="text"
                          v-model="first_name"
                          @blur="v$.first_name.$touch()"
                          />
                          <p class="error-msg" v-if="v$.first_name.$dirty && v$.first_name.required.$invalid">This field must not be empty.</p>
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Last Name</b></label>
                          <input class="form-control placeholder-no-fix"
                           type="text"
                           v-model="last_name"
                           :class={invalid:v$.last_name.$error}
                          @blur="v$.last_name.$touch()"
                            />
                           <p class="error-msg" v-if="v$.last_name.$dirty && v$.last_name.required.$invalid">This field must not be empty.</p>
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Email</b></label>
                          <input
                          :class={invalid:v$.email.$error}
                          class="form-control placeholder-no-fix"
                          type="text"
                          v-model="email"
                          @blur="v$.email.$touch()"
                          />
                        <p
                          class="error-msg"
                          v-if="v$.email.$dirty && v$.email.required.$invalid"
                        >This field must not be empty.</p>
                        <p class="error-msg" v-if="v$.email.$dirty && !v$.email.required.$invalid && v$.email.email.$invalid">Please Enter valid email.</p>
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Phone</b></label>
                          <input class="form-control placeholder-no-fix"
                           type="text"
                           v-model="phone"
                           :class={invalid:v$.phone.$error}
                          @blur="v$.phone.$touch()"
                            />
                           <p class="error-msg" v-if="v$.phone.$dirty && v$.phone.required.$invalid">This field must not be empty.</p>
                      </div>
                  </div>
              </div>

             <div class="row">
                <div class="col-md-8">
                    <small>Note: E-Mail OR Phone is required. When provided, they should be unique within the business.</small>
                     &nbsp;<CIcon name="cil-CommentSquare"
                        v-c-popover="{
                        header: 'Unique E-mail and Phone',
                        trigger: 'click',
                        content: 'Email or Phone is required. You can leave one field empty if its not available. \
                            But if they are provided, they must be unique within the business. \
                            In otherwords, multiple providers sharing the same email/phone is not supported. \
                            However, every booking created/updated can be copied to a single email or the business owner.\
                            That allows a receptionist/owner to see all bookings created via email. \
                            This can be set in Settings->Booking Settings->Copy bookings to custom email',
                      }"/><br/>
                      <br/>
                </div>
              </div>

              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>User role</b></label>
                            <v-select v-model="type" label="name" :options="user_type_options">
                            <template v-slot:no-options>
                                Type to search Role..
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
                          <label class="control-label"><b>Employment Type</b></label>
                            <v-select v-model="employment_type" label="name" :options="employment_type_options">
                            <template v-slot:no-options>
                                Type to search Role..
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
                <div class="col-md-8">
                    <div class="form-group">
                        <label class="control-label"><b>User Introduction</b></label>
                        <textarea class="form-control placeholder-no-fix"
                           v-model="user_bio"
                           style="min-height: 60px;"
                        ></textarea>
                    </div>
                </div>
              </div>
              <div class="row">
                    <div class="col d-flex">
                        <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="keep_my_hours_same_as_business_hours"
                     />&nbsp;&nbsp;
                    <div class="col-12">
                        <label class="control-label">
                        <b>Keep work schedule hours same as business' hours</b>
                    </label>
                    
                    </div>
                    </div>
              </div>
              <div class="row">
                  <div class="col-md-8">
                      <button class="btn btn-success float-end">Add Employee</button>
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
    name: 'Add Product',
    components:{
        Alerts
    },
    setup: () => ({ v$: useVuelidate() }),
    data(){
      return({
        user_type_options:[
            {type:2,name:"Business Owner"},
            {type:3,name:"Receptionist"},
            {type:4,name:"Provider"}
            ],
        employment_type_options:[
            {type:1,name:"Employed"},
            {type:2,name:"Independent"}
        ],
        alert:false,
            show:0,
            alertData:{
                message:'',
                type:''
            },
        first_name:'',
        last_name:'',
        email:'',
        phone: '' ,
        user_bio: '',
        type:{type:2,name:"Business Owner"},
        employment_type:{type:1,name:"Employed"},
        keep_my_hours_same_as_business_hours: false
      })
    },
    validations:{
      first_name:{
        required
      },
      last_name:{
        required
      },
      email:{
        required,
        email
      },
      phone:{
          required
      }
    },
    created(){
    },
    methods:{
        alertClosedFn() {
        this.show = 0;
        },
        AddNewUser(e){
            e.preventDefault();
            this.v$.$touch()
            let data = {
                first_name:this.first_name,
                last_name:this.last_name,
                email:this.email,
                phone: this.phone,
                user_bio: this.user_bio,
                type:this.type.type,
                employment_type:this.employment_type.type,
                set_user_schedule_same_as_businesss_sbs_hours:this.keep_my_hours_same_as_business_hours
            }
            if(!this.v$.$invalid){
                this.alert = false;
                // console.log(data)
                this.$schedsdk.add_user(data).then((result)=>{
                if(result.status == 1){
                    this.$router.push('/users');
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
