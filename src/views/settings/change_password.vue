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
                  <div class="col-md-4">
                      <div class="form-group">
                        <label class="control-label">
                          <b>Password</b>
                        </label>
                        <input
                          class="form-control placeholder-no-fix"
                          type="password"
                          v-model="password"
                          @blur="v$.password.$touch()"
                        >
                        <p
                          class="error-msg"
                          v-if="v$.password.$dirty && v$.password.required.$invalid"
                        >Password is required.</p>
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-4">
                      <div class="form-group">
                        <label class="control-label">
                          <b>Confirm Password</b>
                        </label>
                        <input
                          class="form-control placeholder-no-fix"
                          type="password"
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
              <div class="row">
                  <div class="col-md-4">
                      <button class="btn btn-success">Add Product</button>
                  </div>
              </div>
            </div>
        </form>
      </CCol>
    </CRow>
  </div>
</template>
<script>
import { required, sameAs } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

import {debounce as lodash_debounce} from 'lodash/core'
import Alerts from '../Alerts'
export default {
    name: 'Change Password',
    components:{
        Alerts
    },
    setup: () => ({ v$: useVuelidate() }),
    data(){
        return {
        password: "",
        confirm_password: ""
      }
    },
    // mounted(){
    //     $(this.$refs.modal).on('hidden.bs.modal', () => {
    //         this.product_name = ''
    //     })
    // },
    validations:{
     password: { required },
     confirm_password: { required, sameAsPassword: sameAs("password") }
    }
}
</script>