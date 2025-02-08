<template>
<div>
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <form class="add-package-form" @submit.prevent="addCustomerDetail">
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
              <div class="row" v-if="id">
                <div class="col-md-4">
                    <div class="form-group mb-0">
                        <label class="control-label"><b>Change Picture</b></label>
                    </div>
                    <DragDropFile 
                        name="customer_profile_pic"
                        title="Customer Profile Pic"
                        :initialFile="customer_profile_pic"
                        @initial-file-remove="customer_profile_pic = null"
                        @file-change="(file) => onFileChange(file, 'customer_profile_pic')"
                        @file-remove="(file) => onFileRemove('customer_profile_pic')"
                    />
                </div>
              </div>
              <div class="row" v-if="id">
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>View Picture Book</b></label>
                          <button type="button" @click="$router.push('/customer/pictures/' + id)" class="btn btn-success btn-sm"
                            >
                            Picture Book
                          </button>
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>SMS/Text Preference (Reminders)</b></label>
                          <select
                              @blur="v$.prefers_text_messages.$touch()" 
                              class="form-control" 
                              v-model="prefers_text_messages">
                              <option v-for="opt in prefers_text_messages_list" 
                              v-bind:key="opt.value"
                              :selected="opt.value == prefers_text_messages ? true : false" :value="opt.value">
                               {{opt.name}}</option>
                        </select>
                          <p class="error-msg" v-if="v$.prefers_text_messages.$dirty && v$.prefers_text_messages.required.$invalid">This field must not be empty.</p> 
    
                      </div>
                  </div>
                  <div class="col-md-4">
                       <div class="form-group" >
                          <label class="control-label"><b>Text Marketing Preference</b></label>
                          <select
                             class="form-control" 
                              v-model="allow_marketing_messages">
                              <option v-for="opt in marketing_text_messages_list" 
                              v-bind:key="opt.value"
                              :selected="opt.value == prefers_text_messages ? true : false" :value="opt.value">
                               {{opt.name}}</option>
                        </select>
                       
    
                      </div>
                  </div>
                  
              </div>
                 <div class="row">
               
                  <div class="col-md-4">
                      <div class="form-group" >
                          <label class="control-label"><b>Online Booking Blocked?</b></label>
                          <select
                              @blur="v$.online_booking_blocked.$touch()" 
                              class="form-control" 
                              v-model="online_booking_blocked">
                              <option v-for="opt in online_booking_blocked_option" 
                              v-bind:key="opt.value"
                              :selected="opt.value == online_booking_blocked ? true : false" :value="opt.value">
                               {{opt.name}}</option>
                        </select>
                          <p class="error-msg" v-if="v$.online_booking_blocked.$dirty && v$.online_booking_blocked.required.$invalid">This field must not be empty.</p> 
    
                      </div>
                  </div>   
              </div>
              <div class="row">
                   <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Service Notes 1</b></label>
                         <textarea 
                          class="form-control placeholder-no-fix" 
                           v-model="service_notes_1"
                          ></textarea>
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Service Notes 2</b></label>
                         <textarea 
                          class="form-control placeholder-no-fix" 
                           v-model="service_notes_2"
                          ></textarea>
                      </div>
                  </div>
              </div>


            <div class="row">
                   <div class="col-md-4">
                      <div class="form-group">
                          <label class="control-label"><b>Internal Notes</b></label>
                         <textarea 
                          class="form-control placeholder-no-fix" 
                           v-model="internal_notes"
                          ></textarea>
                      </div>
                  </div>
                   
              </div>
              


              <div class="row">
                  <div class="col-md-8 text-end">
                      <button :disabled="uploading || formSubmit" class="btn btn-success">{{ uploading ? 'Updating' : customer_button_text}}</button>
                  </div>
              </div>
            </div>
        </form>
      </CCol>
    </CRow>
  </div>
</template>
<script>
import { required, email, requiredUnless } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

import {debounce as lodash_debounce} from 'lodash/core'
import moment from 'moment-timezone'
import Alerts from '../Alerts'
import utils_lib from '../../helpers/utils_lib';
import DragDropFile from "@/ui_components/DragDropFile.vue";

export default {
    name: 'CustomersAdd',
    components:{
        Alerts,
        DragDropFile
    },
    setup: () => ({ v$: useVuelidate() }),
    data(){
      return({
        prefers_text_messages_list: [{value: 0, name: "No Preference"},
                                     {value: 1, name: "Yes - OK to text"},
                                     {value: 2, name: "No - Do not text"}
                                     ],
        marketing_text_messages_list: [{value: false, name: "No"},
                                     {value: true, name: "Yes - OK to market"},
                                     ],                                    
        online_booking_blocked_option: [{value: false, name: "No (User can make online booking)"},
                                     {value: true, name: "Yes (User cannot make any booking online)"} 
                                     ],
        alert:false,
            show:0,
            alertData:{
                message:'',
                type:''
            },
        id: this.$route.params.customer_id || null,
        first_name:'',
        last_name:'',
        email:'',
        phone: '' ,
        prefers_text_messages: 0,
        allow_marketing_messages : false,
        online_booking_blocked: false,
        customer_button_text: this.$route.params.customer_id ? 'Update' : 'Add Customer',
        country_code: "US", //this.$store.state.business_settings.country_code,
        service_notes_1: "",
        service_notes_2: "",
        internal_notes: "",
        customer_profile_pic: null,
        customer_existing_profile_pic: null,
        uploading: false,
        formSubmit: false,
        image_form_data: new FormData(),
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
        required: requiredUnless('hasPhone'),
        email
      },
      phone:{
        required: requiredUnless('hasEmail')
      },
      prefers_text_messages:{
          required
      },
      online_booking_blocked: {
          required
      },
    },
    created(){
        if(this.$route.params.customer_id != undefined){
            this.getCustomerDetail()
        }
    },
    computed: {
        hasEmail(){
            return (this.email != "")
        },
        hasPhone(){
            return (this.phone != "")
        }
    },
    methods:{
        async uploadImage(file, key) {
            if (file) {
                let imageUploadData = new FormData;
                imageUploadData.append('file', file);
    
                try {
                    const fileUploadRes = await this.$schedsdk.upload_media('customer_photo', imageUploadData, this.id);
                    if (fileUploadRes.status) {
                        this[key] = fileUploadRes.location;
                    }
                } catch(error) {
                    console.log(error)
                }
            }
        },
        async removeImage() {
            let url = this.customer_existing_profile_pic;
            if (url) {
                try {
                    const fileRemoveRes = await this.$schedsdk.remove_media({
                        url
                    });
                    if (fileRemoveRes.status) {
                        this[key] = null;
                    }
                } catch(error) {
                    console.log(error)
                }
            }
        },
        async uploadCustomerImage(formData) {
            if (formData.has('customer_profile_pic')) {
                this.uploading = true;
                if (this.customer_existing_profile_pic) {
                    await this.removeImage()
                }
                await this.uploadImage(formData.get('customer_profile_pic'), 'customer_profile_pic');
            } else if (!this.customer_profile_pic && this.customer_existing_profile_pic) {
                await this.removeImage()
            }

        },
        onFileRemove(key) {
            this.customer_profile_pic = null;
            this.image_form_data.delete(key);
        },
        onFileChange(file, key) {
            this.image_form_data.set(key, file);
        },
        getCustomerDetail(){
            this.$schedsdk.get_customer_detail(this.$route.params.customer_id).then((result)=>{
                if(result.status == 1){
                    this.id = result.data._id
                    this.first_name = result.data.first_name
                    this.last_name = result.data.last_name
                    this.email = result.data.email
                    this.phone = result.data.phone
                    this.prefers_text_messages = result.data.prefers_text_messages
                    this.allow_marketing_messages = result.data.allow_marketing_messages
                    this.online_booking_blocked = result.data.online_booking_is_blocked;
                    this.service_notes_1 =result.data.service_notes_1;
                    this.service_notes_2 =result.data.service_notes_2;
                    this.internal_notes =result.data.internal_notes;
                    this.customer_profile_pic = result.data.profile_pic;
                    this.customer_existing_profile_pic = result.data.profile_pic;
                }
            })
        },
        validatePhoneEmail()
        {
            if(this.phone == '' && this.email == '')
            {
                return "Either phone or email must be provided."
            }
            if(this.phone != '')
            {
               // console.log(this.$store.state.business_settings)
                if (utils_lib.getPhoneFormatted(this.phone, this.country_code) == null)
                {
                    return "Phone format is incorrect. Ensure it has valid area code and relevant digits"
                }
            }
            if(this.email != '')
            {
                if (utils_lib.get_checked_email(this.email) == null)
                {
                    return "Email format is incorrect."
                }
            }
            return "";
        },
        async addCustomerDetail(e){
            e.preventDefault();
            this.v$.$touch();
            let data = {
                first_name:this.first_name,
                last_name:this.last_name,
                email:this.email,
                phone:this.phone,
                type:5,
                allow_marketing_messages: this.allow_marketing_messages == true?true:false,
                prefers_text_messages: this.prefers_text_messages,
                online_booking_is_blocked: this.online_booking_blocked,
                service_notes_1: this.service_notes_1,
                service_notes_2: this.service_notes_2,
                internal_notes: this.internal_notes,
            }
            let errep =this.validatePhoneEmail() ;
            if (errep != "")
            {
                this.alertData = {
                        message: errep,
                        type:'danger'
                    }
                    this.alert = true;
                    this.show=4;
                return;
            }
            if(!this.v$.$invalid){
                this.alert = false;
                let fncustomer;
                if (this.$route.params.customer_id != undefined)
                {
                    data._id  = this.id;
                    await this.uploadCustomerImage(this.image_form_data);
                    data.profile_pic = this.customer_profile_pic;
                    fncustomer     = this.$schedsdk.update_customer(data)
                }
                else{
                    fncustomer     = this.$schedsdk.add_customer(data)
                }

                fncustomer.then((result)=>{  
                if(result.status == 1){
                    this.$router.push('/customers');
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
                    console.log(ex)
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