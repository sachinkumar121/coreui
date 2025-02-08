<template>
  <div class="d-flex align-items-center min-vh-100 onBoarding-container onboard-toggle">
    <br />
    <br />
    <ThemeSwitcher />
    <CContainer fluid>
      <partner-info v-if="show_partner_info" @proceed="show_partner_info = false" />
      <CRow class="justify-content-center" v-else>
        <CCol md="6">
          <CCard class="mx-4 mb-0 mt-5 mb-5">
            <CCardBody class="p-4">
              <Alerts 
              :alertData="alertData" 
              :show="showalerttime"
              @alertClosed="alertClosedFn"
              v-if="alert" />
              <form class="add-plan-form" @submit.prevent="register">
                <div class="form-body">
                  <div>
                      <div class="col-md-12 text-center">
                         <h1>New Partner Sign Up</h1>
                         <hr>
                      </div>
                  </div>  
                  <div>
                      <div class="col-md-12 text-left">
                          <ul>
                              <li>
                                  This form is for business owner to signup their new business.
                              </li>
                              <li>
                                  Employees should be added inside app.
                              </li>
                         </ul>
                         <hr>
                      </div>
                  </div>         

                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="control-label">
                          <b>Business Name</b>
                        </label>
                        <input
                          class="form-control placeholder-no-fix"
                          type="text"
                          v-model="business_name"
                        >
                        <p
                          class="error-msg"
                          v-if="v$.business_name.$dirty && v$.business_name.required.$invalid"
                        >This field must not be empty.</p>
                        
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="control-label">
                          <b>Business Phone</b>
                        </label>
                        <input
                          class="form-control placeholder-no-fix"
                          type="text"
                          v-model="business_phone"
                        >
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label class="control-label">
                          <b>Business Address Line 1</b>
                        </label>
                        <input
                          class="form-control placeholder-no-fix"
                          type="text"
                          v-model="address_line1"
                        >
                        <p
                          class="error-msg"
                          v-if="v$.address_line1.$dirty && v$.address_line1.required.$invalid"
                        >Address is required.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label class="control-label">
                          <b>Business Address Line 2</b>
                        </label>
                        <input
                          class="form-control placeholder-no-fix"
                          type="text"
                          v-model="address_line2"
                        >
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="control-label">
                          <b>Country</b>
                        </label>
                        <v-select
                          v-model="country"
                          label="name"
                          :options="options"
                          @update:modelValue="setTimezone"
                        >
                          <template v-slot:no-options>Type to search country name..</template>
                          <template v-slot:option="option" >
                            <div class="d-center">{{ option.name }}</div>
                          </template>
                          <template v-slot:selected-option="option" >
                            <div class="selected d-center">{{ option.name }}</div>
                          </template>
                        </v-select>
                        <p
                          class="error-msg"
                          v-if="v$.country.$dirty && v$.country.required.$invalid"
                        >Country is required.</p>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="control-label">
                          <b>Business Location Timezone</b> <CIcon name="cil-CommentSquare"  
                        v-c-popover="{
                        header: 'Info',
                        trigger: 'click',
                        content: 'Business Timezone is required for accurate appointments. You can google for <i>your city</i> timezone to search for yours',
                      }"/>
                        </label>
                        <v-select v-model="timezone" :options="timezone_options">
                          <!-- @search="onSearch" @update:modelValue="setBusinessId" -->
                          <template v-slot:no-options>Please select country for timezone</template>
                          <template v-slot:option="option" >
                            <div class="d-center">{{ option.label }}</div>
                          </template>
                          <template v-slot:selected-option="option" >
                            <div class="selected d-center">{{ option.label }}</div>
                          </template>
                        </v-select>
                         <p
                          class="error-msg"
                          v-if="v$.timezone.$dirty && v$.timezone.required.$invalid"
                        >Time Zone is required.</p>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="control-label">
                          <b>City</b>
                        </label>
                        <input class="form-control placeholder-no-fix" type="text" v-model="city">
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="control-label">
                          <b>State</b>
                        </label>
                        <v-select v-model="state" :options="state_options" label="name">
                          <template v-slot:no-options>Please select country for State</template>
                          <template v-slot:option="option" >
                            <div class="d-center">{{ option.name }}</div>
                          </template>
                          <template v-slot:selected-option="option" >
                            <div class="selected d-center">{{ option.name }}</div>
                          </template>
                        </v-select>
                      </div>
                    </div>
                   
                    <div class="col-md-4">
                      <div class="form-group">
                        <label class="control-label">
                          <b>Zip Code</b>
                        </label>
                        <input
                          class="form-control placeholder-no-fix"
                          type="text"
                          v-model="zipcode"
                        >
                      </div>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                          <div class="form-group">
                        <label class="control-label">
                          <b>Owner Account Email</b>
                        </label>
                        <input
                          class="form-control placeholder-no-fix"
                          type="email"
                          :class="{invalid:v$.email.$error}"
                          @blur="v$.email.$touch()"
                          v-model="email"
                        >
                        <p
                          class="error-msg"
                          v-if="v$.email.$dirty && v$.email.required.$invalid"
                        >This field must not be empty.</p>
                        <p class="error-msg" v-if="v$.email.$dirty && !v$.email.required.$invalid && v$.email.email.$invalid">Please Enter valid email.</p>
                      </div>
                    </div>
                    <div class="col-md-6">
                    
                      <div class="form-group">
                        <label class="control-label">
                          <b>Owner's Phone</b>
                        </label>
                        <input class="form-control placeholder-no-fix" type="text" v-model="phone">
                        
                      </div>

                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label class="control-label">
                          <b>Password</b>
                        </label>
                        <input
                          class="form-control placeholder-no-fix"
                          name="password"
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
                    <div class="col-md-6">
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
                            &nbsp;
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-10">
                        <input type="checkbox" id="terms" @change="v$.terms.$touch()" v-model="terms" 
                            class="md-check"> &nbsp; I have read and agree to 
                            <a href="https://www.silverskysoft.com/wordpress/end-user-license-agreement/"
                        target="_blank">the terms &amp; license agreement</a>
                            <br>
                          <p
                          class="error-msg"
                          v-if="v$.terms.$dirty && v$.terms.sameAs.$invalid"
                          
                        >Need to agree to terms &amp; license agreement</p>
                         <br>
                    </div>
                   
                  </div>
                  
                  <div class="row">
                    <div class="col-md-12 text-center">
                      <button class="btn btn-success">Create Account</button>
                    </div>
                  </div>
                     <div class="row">
                        <div class="col-md-12 text-center">
                          <br>
                        </div>
                    </div>

                    <div class="row">
                    <div class="col-md-12 text-center">
                      <router-link to="/login" target="_self">
                        Already have an account? Login here
                      </router-link>
                    </div>
                  </div>
                </div>
              </form>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    <ExternalAppFooter/>   
    </CContainer>
    
  </div>
</template>
<script>
import Alerts from "../Alerts";
import ExternalAppFooter from '@/ui_components/ExternalAppFooter';
import ThemeSwitcher from '@/ui_components/ThemeSwitcher'
import { required, email, sameAs  } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import PartnerInfo from '@/views/onBoarding/PartnerInfo.vue';
import country_json from "../../../countries";
const dtf =Intl.DateTimeFormat(); 
const resolvedOptions  = dtf? dtf.resolvedOptions() : null;

const tz = resolvedOptions? resolvedOptions.timeZone : null;
export default {
  name: "Register",
  components: {
    Alerts,
    ExternalAppFooter,
    PartnerInfo,
    ThemeSwitcher
  },
  setup: () => ({ v$: useVuelidate() }),
  props:['reg_type'],
  data() {
    return {
      options: country_json,
      timezone_options: [],
      state_options:[],
      email: "",
      password: "",
      timezone: "",
      confirm_password: "",
      business_name: "",
      business_phone: "",
      phone: "",
      // no_of_employees:1,
      plan_level_on_signup: 1,
      plan_id_on_signup: "SOLO",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
      alert: false,
      show: 0,
      terms: null,
      subscription_type: null,
      alertData: {
        message: "qwertyui",
        type: "success"
      },
      show_partner_info: true
    };
  },
  validations () {
    return {
      email: {
        required: required,
        email: email
      },
      password: { required },
      business_name: { required },
      address_line1: { required },
      country: { required },
      timezone: { required },
      terms: {
        sameAs: sameAs(true)
      },
      confirm_password: {
        required,
        sameAsPassword: sameAs(this.password)
      }
    }
  },
  methods: {
      back_to_login() {
        this.$router.push({ name: 'Login' });
   },
    setValue(event) {
      let value = event.target.value;
      this.plan_level_on_signup = value;
      if (value == 1) this.plan_id_on_signup = "SOLO";
      if (value == 2) this.plan_id_on_signup = "TEAM";
      if (value == 3) this.plan_id_on_signup = "ENTERPRISE";
    },
    setTimezone() {
        //Set default timezone based on preselect from browser 
        let tzpptions = this.country ? this.country.timezones : [];
        this.timezone ="";
      if (tz && tzpptions.includes(tz))
      {
          this.timezone = tz;
      }
      if (tzpptions.length === 1)
      {
            //Only one TZ is there, so select that
            this.timezone = tzpptions[0];
      }
      
      this.timezone_options = tzpptions
      
      this.state_options = this.country ? this.country.states : [];
      
    },
    register(e) {
      e.preventDefault();
      this.v$.$touch();
      if (!this.v$.$invalid) {
        //Check country to time zone match...
        let country = this.country? (this.country.name || "") : "";
        let timezone = this.timezone? (this.timezone || "") : "";

        if (country == "" || timezone == "") 
        {
            this.alertData = {
                message: "Country and timezone is empty",
                type: "danger"
              };
              this.alert = true;
              this.show = 10;
            return;
        }
        if (this.country.timezones.includes(timezone) === false)
        {
             this.alertData = {
                message: "Error country " + country + " and timezone " + timezone + " mismatched" ,
                type: "danger"
              };
              this.alert = true;
              this.show = 10;
            return;
        }
        let signup_type = 3;
        
        let data = {
          email: this.email,
          password: this.password,
          confirm_password: this.confirm_password,
          business_name: this.business_name,
          business_phone: this.business_phone,
          phone: this.phone,
          no_of_employees: this.no_of_employees,
          plan_level_on_signup: this.plan_level_on_signup,
          plan_id_on_signup: this.plan_id_on_signup,
          address_line1: this.address_line1,
          address_line2: this.address_line2,
          city: this.city,
          state: this.state? this.state.code : null,
          country: country,
          zipcode: this.zipcode,
          signup_type: signup_type,
          timezone: timezone,
          signup_channel: 'website'
        };
        
        this.$schedsdk.business_signup(data).then(result => {

            if (result.status == 200) {
              let { verify_url } = result.data;
              window.location = verify_url;
            } else {
              this.alertData = {
                message: result.message,
                type: "danger"
              };
              this.alert = true;
              this.show = 4;
            }
          })
          .catch(ex => {
            this.alertData = {
              message: ex.response.data.message,
              type: "danger"
            };
            this.alert = true;
            this.show = 4;
          });
      }
    },
    alertClosedFn() {
      this.show = 0;
    }
  }
};
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
.theme-div {
    display: inline-block;
    position: absolute;
    right: 7px;
    top: 10px;
}
.theme-div .switch-label {
    padding-top: 0;
}
</style>
