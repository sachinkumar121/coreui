<template>
  <div class="d-flex align-items-center min-vh-100 onBoarding-container onboard-toggle">
    <ThemeSwitcher />
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="10" lg="8" xl="6">
          <CCard class="mx-4 mb-4 mt-4">
            <CCardBody class="p-4 pb-1">
              <Alerts 
                :alertData="alertData" 
                :show="show"
                @alertClosed="alertClosedFn"
                v-if="alert" />
              <div v-if="errors.length>0" class="row">
                <li>
                  <ul v-for="(item, index) in errors" :key="index">{{item}}</ul>
                </li>
              </div>
              <form class="add-plan-form" @submit.prevent="register">
                <div class="form-body">
                  <div>
                    <div class="col-md-12 text-center pe-5">
                      <h1 v-if="reg_type != 'partner'">New Business Sign Up</h1>
                      <h1 v-if="reg_type === 'partner'">New Partner Sign Up</h1>
                      <!-- <hr> -->
                    </div>
                  </div>
                  <div>
                    <div class="col-md-12 text-left sub-title-section">
                      <ul>
                        <li>
                          This form is for business owner to signup their new business.
                        </li>
                      </ul>
                      <!-- <hr> -->
                    </div>
                  </div>
                  <div class="row" v-if="show_full_panel===false">
                    <div v-if="reg_type != 'partner'" class="col-md-12">
                      <div class="form-group">
                        <label class="control-label">
                        <b>Select a Subscription Type to Start</b>
                        </label>
                        <br>
                        <input type="radio" id="type1" name="subscription_type"
                          value="1" v-model="subscription_type" v-on:change="onSubscriptionChange">
                        &nbsp;<strong>${{subscription_type1_cost}}/mo</strong> for app when you sign up for our integrated payment processing.
                        <br>
                        <input type="radio" id="type2" name="subscription_type"
                          value="2" v-model="subscription_type" v-on:change="onSubscriptionChange">
                        &nbsp;<strong>${{subscription_type2_cost}}/mo</strong> for app when you keep your current payment processor
                        <br>
                      </div>
                    </div>
                  </div>
                  <div class="row" v-if="subscription_type_text!=''">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label class="control-label mb-0">
                        <b>Selected Subscription:</b> <span id="typeselected">{{subscription_type_text}}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div id="id_processing_volume_check" v-if="show_payment_processing_volume_check">
                    <div>
                      <div class="col-md-12 text-left mb-3">
                        Is your gross monthly revenue more than $12,000 <i>and</i> have been in business for atleast 1 year?
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6 text-start">
                        <button class="btn btn-success justify-content-center" @click.prevent="showProcessingOptionForvolume('ic')">Yes</button>
                      </div>
                      <div class="col-md-6 text-end">
                        <button class="btn btn-success justify-content-center" @click.prevent="showProcessingOptionForvolume('flat')">No</button>
                      </div>
                    </div>
                  </div>
                  <!-- end processing volume -->
                  <div id="id_processing_offer_ic" class="payment-processing-section p-4 mt-4" v-if="show_payment_processing_offer=='ic'">
                    <div>
                      <div class="col-md-12 text-left">
                        <h4 class="sub-title-section border-top-0 mt-0 pt-0">Payment Processing Offer </h4>
                      </div>
                    </div>
                    <div>
                      <div class="col-md-12 text-left">
                        <p class="h6">Effective rate as low as 1.90%</p>
                        <strong>Agreement rate: 0.50% + $0.20</strong> per transaction over Interchange rate 
                        <CIcon name="cil-CommentSquare"  
                          v-c-popover="{
                          header: 'Info',
                          trigger: 'click',  
                          content: 'Effective rate is your overall cost of processing. \
                          Lowest rates are seen when monthly processing volume is atleast $20,000 and atleast 50% of volume uses PIN debit.\
                          Average effective rate is usually between 2.2% to 2.7%',
                          }"/>
                        <br> 
                      </div>
                      <div class="col-md-12 text-left mt-2">
                        <p class="h6">No other monthly fees for appointment App</p>
                        <br>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12 text-center">
                        <button class="btn btn-success" @click.prevent="onProceedWithPaymentProcessing">Ok, continue to Merchant Account</button>
                      </div>
                    </div>
                  </div>
                  <!-- end processing offer -->
                  <div id="id_processing_offer"  class="payment-processing-section p-4 mt-4" v-if="show_payment_processing_offer=='flat'">
                    <div>
                      <div class="col-md-12 text-left">
                        <h4 class="sub-title-section border-top-0 mt-0 pt-0"> Payment Processing Offer </h4>
                      </div>
                    </div>
                    <div>
                      <div class="col-md-12 text-left">
                        <p class="h6">In-store: 2.95% + $0.30</p>
                        per transaction
                      </div>
                      <div class="col-md-12 text-left">
                        <p class="h6">Keyed: 3.95% + $0.30</p>
                        per transaction 
                      </div>
                      <div class="col-md-12 text-left">
                        <p class="h6">No other monthly fees for appointment App</p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12 text-center">
                        <button class="btn btn-success" 
                          @click.prevent="onProceedWithPaymentProcessing">Continue to Merchant Account Setup</button>
                      </div>
                    </div>
                  </div>
                  <!-- end processing offer -->
                  <div id="id_full_panel" v-if="show_full_panel">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                          <b>DBA Business Name</b>
                          </label>
                          <input
                            class="form-control placeholder-no-fix"
                            type="text"
                            v-model="business_name"
                            :class="{invalid:v$.business_name.$error}"
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
                          <b>Legal Business Name (as registered)</b>
                          </label>
                          <input
                            class="form-control placeholder-no-fix"
                            type="text"
                            v-model="legal_business_name"
                            :class="{invalid:v$.legal_business_name.$error}"
                            >
                          <p
                            class="error-msg"
                            v-if="v$.legal_business_name.$dirty && v$.legal_business_name.required.$invalid"
                            >This field must not be empty.</p>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Business Website</b>
                          </label>
                          <input
                            class="form-control placeholder-no-fix"
                            type="text"
                            v-model="business_website"
                            >
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
                    <!-- Ein, type, etc -->
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Ownership Type</b>
                          </label>
                          <v-select v-model="business_ownership_type" 
                            :options="business_ownership_options" label="name">
                            <template v-slot:no-options>Please select ownership type</template>
                            <template v-slot:option="option" >
                              <div class="d-center">{{ option.name }}</div>
                            </template>
                            <template v-slot:selected-option="option" >
                              <div class="selected d-center">{{ option.name }}</div>
                            </template>
                          </v-select>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Business Tax ID or EIN</b>
                          </label>
                          <input class="form-control placeholder-no-fix" type="text" v-model="ein">
                        </div>
                      </div>
                    </div>
                    <!-- end EIN -->
                    <!-- business start MCC code -->
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Business Start Date</b>
                          </label>
                          <flat-pickr v-model="business_start_date" :config="date_picker_config" 
                            placeholder="Business Start Date"></flat-pickr>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Business Classification</b>
                          </label>
                          <v-select v-model="business_mcc" 
                            :options="business_mcc_options" label="name">
                            <template v-slot:no-options>Please select business classification</template>
                            <template v-slot:option="option" >
                              <div class="d-center">{{ option.name }}</div>
                            </template>
                            <template v-slot:selected-option="option" >
                              <div class="selected d-center">{{ option.name }}</div>
                            </template>
                          </v-select>
                        </div>
                      </div>
                    </div>
                    <!-- end EIN -->
                    <!-- Business processing -->
                    <div class="row">
                      <div class="col-md-6 col-lg-4">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Monthly Volume ($)</b>
                          </label>
                          <input class="form-control placeholder-no-fix" type="text" 
                            v-model="processing_monthly_volume">
                        </div>
                      </div>
                      <div class="col-md-6 col-lg-4">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Average per sale ($)</b>
                          </label>
                          <input class="form-control placeholder-no-fix" type="text" 
                            v-model="processing_per_ticket">
                        </div>
                      </div>
                      <div class="col-md-6 col-lg-4">
                        <div class="form-group">
                          <label class="control-label">
                            <b>Highest per sale ($)</b> 
                            <CIcon name="cil-CommentSquare"  
                              v-c-popover="{
                              header: 'Info',
                              trigger: 'click',
                              content: 'What is the largest transaction amount expected in a single sale? This usually is 5 or 10 times average sale.',
                              }"/>
                          </label>
                          <input
                            class="form-control placeholder-no-fix"
                            type="text"
                            v-model="processing_highest_per_ticket"
                            >
                        </div>
                      </div>
                    </div>
                    <!-- business processing -->
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
                            :class="{invalid:v$.address_line1.$error}"
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
                            v-if="v$.country.$dirty && !v$.country.required"
                            >Country is required.</p>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                            <b>Business Location Timezone</b> 
                            <CIcon name="cil-CommentSquare"  
                              v-c-popover="{
                              header: 'Info',
                              trigger: 'click',
                              content: 'Business Timezone is required for accurate appointments. You can google for <i>your city</i> timezone to search for yours',
                              }"/>
                          </label>
                          <v-select v-model="timezone" :options="timezone_options" :class="{invalid:v$.timezone.$error}">
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
                      <div class="col-md-6 col-lg-4">
                        <div class="form-group">
                          <label class="control-label">
                          <b>City</b>
                          </label>
                          <input class="form-control placeholder-no-fix" type="text" v-model="city">
                        </div>
                      </div>
                      <div class="col-md-6 col-lg-4">
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
                      <div class="col-md-6 col-lg-4">
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
                    <!-- <div class="row">
                      <div class="col-md-12">
                        <hr class="mt-0">
                      </div>
                    </div> -->
                    <!-- Owner details -->
                    <div>
                      <div class="col-md-12 text-left">
                        <hr class="mt-0">
                        <h5 class="mb-3">Owner Information </h5>
                        <!-- <hr> -->
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Owner First Name</b>
                          </label>
                          <input
                            class="form-control placeholder-no-fix"
                            type="text"
                            v-model="owner_first_name"
                            :class="{invalid:v$.owner_first_name.$error}"
                            >
                          <p
                            class="error-msg"
                            v-if="v$.owner_first_name.$dirty && v$.owner_first_name.required.$invalid"
                            >This field must not be empty.</p>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Owner Last Name</b>
                          </label>
                          <input
                            class="form-control placeholder-no-fix"
                            type="text"
                            v-model="owner_last_name"
                            :class="{invalid:v$.owner_last_name.$error}"
                            >
                          <p
                            class="error-msg"
                            v-if="v$.owner_last_name.$dirty && v$.owner_last_name.required.$invalid"
                            >This field must not be empty.</p>
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
                            <b>Password for app</b> 
                            <CIcon name="cil-CommentSquare"  
                              v-c-popover="{
                              header: 'Info',
                              trigger: 'click',
                              content: 'This is the password you will use to login to the app and online portal. This password is not for your Merchant processing Account access.',
                              }"/>
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
                            :class="{invalid:v$.confirm_password.$error}"
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
                    <!-- owner address -->
                    <div class="row">
                      <div class="col-md-12">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Owner Home Address Line 1</b>
                          </label>
                          <input
                            class="form-control placeholder-no-fix"
                            type="text"
                            v-model="owner_address_line1"
                            :class="{invalid:v$.owner_address_line1.$error}"
                            >
                          <p
                            class="error-msg"
                            v-if="v$.owner_address_line1.$dirty && v$.owner_address_line1.required.$invalid"
                            >Address is required.</p>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Owner Address Line 2</b>
                          </label>
                          <input
                            class="form-control placeholder-no-fix"
                            type="text"
                            v-model="owner_address_line2"
                            >
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6 col-lg-4">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Owner's City</b>
                          </label>
                          <input class="form-control placeholder-no-fix" type="text" v-model="owner_city">
                        </div>
                      </div>
                      <div class="col-md-6 col-lg-4">
                        <div class="form-group">
                          <label class="control-label">
                          <b>State</b>
                          </label>
                          <v-select v-model="owner_state" :options="state_options" label="name">
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
                      <div class="col-md-6 col-lg-4">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Zip Code</b>
                          </label>
                          <input
                            class="form-control placeholder-no-fix"
                            type="text"
                            v-model="owner_zipcode"
                            >
                        </div>
                      </div>
                    </div>
                    <!-- end owner address -->
                    <!-- owner identity info -->
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                            <b>Owner's SSN</b> &nbsp; 
                            <CIcon name="cil-CommentSquare"  
                              v-c-popover="{
                              header: 'Info',
                              trigger: 'click',
                              content: 'Owner\'s social security number (SSN) is required to apply. Your SSN is removed from our systems after your application is processed.',
                              }"/>
                          </label>
                          <input class="form-control placeholder-no-fix" type="text" v-model="owner_ssn">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Owner's Driving License No.</b>
                          </label>
                          <input
                            class="form-control placeholder-no-fix"
                            type="text"
                            v-model="owner_dl_number">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                          <b>DL Issuing State</b>
                          </label>
                          <v-select v-model="owner_dl_state" :options="state_options" label="name">
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
                    </div>
                    <!-- end owner identity info-->
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                            <b>Owner's Date of Birth</b> &nbsp; 
                            <CIcon name="cil-CommentSquare"  
                              v-c-popover="{
                              header: 'Info',
                              trigger: 'click',
                              content: 'Owner\'s date of birth is required to apply. It is used for credit verification. Your DOB is removed from our systems after your application is processed.',
                              }"/>
                          </label>
                          <flat-pickr v-model="owner_dob" :config="date_picker_config" 
                            @input="onStartDatePickerInput"
                            placeholder="Owner's Date of Birth"></flat-pickr>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Owner's Mobile Phone No.</b>
                          </label>
                          <input
                            class="form-control placeholder-no-fix"
                            type="text"
                            v-model="owner_mobile_number">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Owner's Business Title</b>
                          </label>
                          <v-select v-model="owner_title" :options="owner_title_options" label="name">
                            <template v-slot:no-options>Please select one</template>
                            <template v-slot:option="option" >
                              <div class="d-center">{{ option.name }}</div>
                            </template>
                            <template v-slot:selected-option="option" >
                              <div class="selected d-center">{{ option.name }}</div>
                            </template>
                          </v-select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="col-md-12 text-left">
                        <hr class="mt-0">
                        <h5 class="mb-3"> Banking Information </h5>
                        <!-- <hr> -->
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Account Number for Deposits</b>
                          </label>
                          <input
                            class="form-control placeholder-no-fix"
                            type="text"
                            v-model="deposit_bank.acct_num"
                            >
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Bank Routing Number for deposits</b>
                          </label>
                          <input class="form-control placeholder-no-fix" type="text" v-model="deposit_bank.routing_num">
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Account Type</b>
                          </label>
                          <v-select
                            v-model="deposit_bank.acct_type"
                            label="name"
                            :options="bank_acct_type_options"
                            >
                            <template v-slot:no-options>Type to search...</template>
                            <template v-slot:option="option" >
                              <div class="d-center">{{ option.name }}</div>
                            </template>
                            <template v-slot:selected-option="option" >
                              <div class="selected d-center">{{ option.name }}</div>
                            </template>
                          </v-select>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Deposit Bank Name</b> 
                          </label>
                          <input
                            class="form-control placeholder-no-fix"
                            type="text"
                            v-model="deposit_bank.bank_name"
                            >
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <hr class="mt-0">
                      </div>
                    </div>
                    <!-- END DEPOSIT -->
                    <div class="row mb-2">
                      <div class="col-md-10">
                        <input type="checkbox" id="chk_withdrawal_same" 
                          :checked=true
                          @click="withdrawalCheckChange"
                          class="md-check form-check-input"><span class="ms-2">Bank account for withdrawals same as deposit account.</span>   
                      </div>
                    </div>
                    <div id="idwithdrawbank" v-if="show_withdrawal_bank" class="mb-2">
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label class="control-label">
                            <b>Account Number for Withdrawal</b>
                            </label>
                            <input
                              class="form-control placeholder-no-fix"
                              type="text"
                              v-model="withdraw_bank.acct_num">
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label class="control-label">
                            <b>Bank Routing Number for withdrawal</b>
                            </label>
                            <input class="form-control placeholder-no-fix" type="text" 
                              v-model="withdraw_bank.routing_num">
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label class="control-label">
                            <b>Account Type</b>
                            </label>
                            <v-select
                              v-model="withdraw_bank.acct_type"
                              label="name"
                              :options="bank_acct_type_options"
                              >
                              <template v-slot:no-options>Type to search...</template>
                              <template v-slot:option="option" >
                                <div class="d-center">{{ option.name }}</div>
                              </template>
                              <template v-slot:selected-option="option" >
                                <div class="selected d-center">{{ option.name }}</div>
                              </template>
                            </v-select>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label class="control-label">
                            <b>Withdrawal Bank Name</b> 
                            </label>
                            <input
                              class="form-control placeholder-no-fix"
                              type="text"
                              v-model="withdraw_bank.bank_name"
                              >
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-12">
                          <hr>
                        </div>
                      </div>
                    </div>
                    <!-- END wITHDRAWal (idwithdrawbank) -->
                    <!-- <div class="row">
                      <div class="col-md-4">
                        &nbsp;
                      </div>
                    </div> -->
                    <div class="row mb-2" >
                      <div class="col-md-10">
                        <input type="checkbox" id="terms" @change="v$.terms.$touch()" v-model="terms" 
                          class="md-check form-check-input"><span class="ms-2">I have read and agree to 
                        <a href="https://www.silverskysoft.com/wordpress/end-user-license-agreement/"
                          target="_blank">the terms &amp; license agreement</a></span>
                        <p
                          class="error-msg"
                          v-if="v$.terms.$dirty && v$.terms.sameAs.$invalid"
                          >Need to agree to terms &amp; license agreement</p>
                        <br>
                      </div>
                    </div>
                    <div class="row mt-4">
                      <div class="col-md-12 text-center">
                        <button class="btn btn-success"  :disabled = "create_account_disabled">Create Account</button>
                        <div class="mt-3">
                          <button type="button" class="btn-back" @click="backToRegister()"> 
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" data-name="4-Arrow Left"/></svg><span>Back to Register</span> 
                          </button>
                        </div>
                      </div>
                      <div v-if="errors.length>0" class="col-md-12 text-center" style="color:red">
                        Errors were found in submission. See top of page for details.
                      </div>
                    </div>
                  </div>
                  <!-- END id_full_panel" -->
                  <div  v-if="business_signup_id  !=''">
                    <div class="row">
                      <div class="col-md-12">
                        <div class="form-group">
                          <label class="control-label">
                          <b>Status:</b> <span id="typeselected">{{signup_progress_status_text}}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12 text-center">
                        <button v-if="signup_status=='business_account_ready'" 
                          class="btn btn-success" @click.prevent="doLogin">Login to my account</button>
                        <br>
                        <span v-if="signup_status=='business_account_ready'" >Auto login in 5 seconds</span>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="row">
                    <div class="col-md-12 text-center">
                      <br>
                    </div>
                  </div> -->
                  <div class="row">
                    <div class="col-md-12 text-center">
                      <router-link to="/login" target="_self">
                        Already have an account? Login here
                      </router-link>
                    </div>
                  </div>
                </div>
                <!-- done body -->
              </form>
            </CCardBody>
            <div class="logo pt-1 mb-3 d-flex align-items-center justify-content-center">
                <img class="logo-auth" src="/img/logo-icon-auth.png" />
                <span>SkySalon</span>    
            </div>
          </CCard>
        </CCol>
      </CRow>
      <CModal :visible="showVerificationCodeDialog">
        <CModalHeader>
          <CModalTitle>Verification Code</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div class="row">
            <div class="col-md-2">
            </div>
            <div class="col-md-8">
              A verification code was sent to your email and mobile phone. Please enter it here.
            </div>
          </div>
          <div class="row">
            <div class="col-md-2">
            </div>
            <div class="col-md-4">
              Verification Code
            </div>
            <div class="col-md-4">
              <input 
                v-model="in_verificationcode"
                class="form-control placeholder-no-fix" 
                type="text" 
                />
            </div>
          </div>
          <div class="row">
            <div class="col-md-2">
            </div>
            <div class="col-md-8">
              {{verify_error_message}}   &nbsp;
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton @click="resendVerifyCode" color="info" class="mr-auto">Resend Code</CButton>
          <CButton @click="verifyCode" color="info">Verify</CButton>
        </CModalFooter>
      </CModal>
      <ExternalAppFooter/>
    </CContainer>
  </div>
</template>
<script>
import Alerts from "../Alerts";
import ThemeSwitcher from '@/ui_components/ThemeSwitcher.vue';
import ExternalAppFooter from '@/ui_components/ExternalAppFooter';
import { required, email, sameAs } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

import country_json from "../../../countries";
import register_preset_arrays from '../../helpers/register_preset_arrays';
import register_helper from '../../helpers/register_helper';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
const dtf =Intl.DateTimeFormat(); 
const resolvedOptions  = dtf? dtf.resolvedOptions() : null;
import login_helper from '../../helpers/login_helper';
const tz = resolvedOptions? resolvedOptions.timeZone : null;
export default {
  name: "Register",
  components: {
    Alerts,
    ExternalAppFooter,
    flatPickr,
    ThemeSwitcher
  },
  setup: () => ({ v$: useVuelidate() }),
  props:['reg_type'],
  data() {
    return {
      date_picker_config: {
            altFormat: "F j, Y",
            altInput: true,
            // noCalendar: true,
            // enableTime: true,
            // time_24hr: true
        },
    
      business_signup_id: '',
      signup_progress_status_text: 'Waiting....',
      signup_status: '',
      errors : [],
      create_account_disabled: false,
      showVerificationCodeDialog: false,
      in_verificationcode: '',
      in_verfication_request_id: '',
      verify_code_status: -1, //starting
      verify_error_message: '',
      show_payment_processing_offer: "",
      show_payment_processing_volume_check: false,
      show_full_panel: false,
      show_withdrawal_bank: false,
      options: country_json,
      timezone_options: [],
      state_options:[],
      business_ownership_options: [],
      business_mcc_options: [],
      owner_title_options: [],
      bank_acct_type_options: [
      {code: "BIZ", name: "Business Checking"},
      {code: "GL", name: "General Ledger"},
      {code: "SAVINGS", name: "Savings"},
      ],
     
     
      selected_payment_processing_offer: '',
      business_ownership_type: "",
      business_mcc: "",
      processing_monthly_volume: "",
      processing_per_ticket: "",
      processing_highest_per_ticket: "",
     
      ein: "",
      email: "",
      password: "",
      timezone: "",
      confirm_password: "",
      business_name: "",
      legal_business_name: "",
      business_website: "",
      business_phone: "",
      owner_first_name: "",
      owner_last_name: "",
      owner_ssn: "",
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
      business_start_date: "",

      owner_address_line1: "",
      owner_address_line2: "",
      owner_city: "",
      owner_state: "",
      owner_country: "", //treat same as business country
      owner_zipcode: "",
      owner_dl_number: "",
      owner_dl_state: "",
      owner_mobile_number: "",
      owner_title: "",
      owner_dob: "", 

      deposit_bank: {
           acct_num: "",
           routing_num: "",
           acct_type: "",
           bank_name: ""
      },
       withdraw_bank: {
           acct_num: "",
           routing_num: "",
           acct_type: "",
           bank_name: ""
      },
      terms: null,
      subscription_type: null,
      subscription_type_text: "None",
      subscription_type1_cost: 0,
      subscription_type2_cost: 75,


    seq_http_calls: 0,
    scheduled_objects    : [],

      alert: false,
      show: 0,
      alertData: {
        message: "qwertyui",
        type: "success"
      }
    };
  },
  mounted(){
        
                this.business_ownership_options = register_preset_arrays.get_business_ownership_types();

                this.owner_title_options  = register_preset_arrays.get_business_titles();

                this.business_mcc_options = register_preset_arrays.get_mcc_array();

                this.setTimezone()
                //register_helper.fill_with_test_mech_data(this);

      }, //end function
  validations () {
    return {
      email: { required, email },
      password: { required },
      business_name: { required },
      legal_business_name: { required },
      address_line1: { required },
      owner_address_line1: { required },

      country: { required },

      timezone: { required },
      owner_first_name: { required },
      owner_last_name: { required },
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

   doScheduleLogin: function(){
                let v = setTimeout(function () 
                {
                    this.doLogin();
                }.bind(this), 
                4000); 
   },
   doLogin: function(){
        let prefer_admin =false;
        this.$schedsdk.login({ email: this.email, 
                               password: this.password,
                               source_login:'web' , 
                               prefer_admin: prefer_admin})
            .then(async (result)=>
        {   
            if(result)
            {
                
                    await login_helper.complete_new_login(this.$schedsdk, 
                                                          this.$schedsdk.getLoggedInUserData(),
                                                          this.$store);
                    this.$router.push({ name: 'Dashboard' }) ;
            } 
            else
            {
                this.alertData = {
                    message: "Login failed. Please check and try again",
                    type: "danger"
                };
                this.alert = true;
                this.show = 8;
            }
        })
        .catch(ex => {
           console.log("ex")
           console.log(ex)
          this.alertData = {
            message: ex.response.data.message,
            type: "danger"
          };
          this.alert = true;
                this.show = 8;
        });
   },
   do_signup_check: function(){
       //this.
        this.$schedsdk.check_signup_status({business_signup_id: this.business_signup_id}).then(
                result => {
                     
                    if (result.record_status)
                    {
                         this.signup_progress_status_text = "Waiting (checked " +this.seq_http_calls+")..." +result.record_status
                    }
                    if (result.record_status != 'business_account_ready')
                    {
                        this.schedule_signup_status_check();
                    }
                    else
                    {
                        this.signup_status =  'business_account_ready';
                        this.doScheduleLogin();
                    }
                    console.log(result);
            });
      
   },
   schedule_signup_status_check: function(){
            
            if (this.seq_http_calls>10)
            {
                   console.log("schedule signup timeout... ");
                   return;
            }
            this.seq_http_calls++;
            let v = setTimeout(function () 
                {
                    this.do_signup_check(this.business_signup_id);
                }.bind(this), 
                4000); 
            this.scheduled_objects.push(v);

    },
   onStartDatePickerInput(c)
   {
       console.log(c);
   },
   hide_initial_panels()
   {
       //this.create_account_disabled =false;
       //return;
        this.show_full_panel = null
        this.subscription_type_text = "";
        this.show_payment_processing_volume_check = false;
        this.show_payment_processing_offer = '';
     
   },
    onSubscriptionChange(event)
    {
        let value = event.target.value;
        this.subscription_type_text = "";
        this.show_full_panel = false;
        this.selected_payment_processing_offer = '';
        if (value == 1) 
        {
            this.subscription_type_text = "$" + this.subscription_type1_cost + "/mo With Merchant Account Signup";
            this.show_payment_processing_volume_check = true;
        }
        if (value == 2) 
        {
            this.subscription_type_text = "$" + this.subscription_type2_cost + "/mo";
            this.show_payment_processing_volume_check = false;
           
        }
        
    },
    backToRegister() {
      this.show_full_panel = false;
      this.subscription_type_text = "$" + this.subscription_type1_cost + "/mo With Merchant Account Signup";
      this.show_payment_processing_volume_check = true;
    },
    showProcessingOptionForvolume(val)
    {
        //let value = event.target.value;
        this.show_payment_processing_offer = val;
    
    },
    onProceedWithPaymentProcessing()
    {
        this.selected_payment_processing_offer = this.show_payment_processing_offer;
        this.show_payment_processing_offer = '';
        this.show_full_panel = true;
        this.show_payment_processing_volume_check = false;
    },
    withdrawalCheckChange(event)
    {
      let value = event.target.checked;
      
      if (value  == true) 
        {
            this.show_withdrawal_bank = false;
        }
      else
        { this.show_withdrawal_bank = true; }
     
    },
    fetch_code(obj)
    {
     let code = obj? (obj.code || "") : "";
     return code;
   
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
     
    resendVerifyCode()
    {
        if(this.verification_request_id)
        {
            this.$schedsdk.resend_verification_code({verify_request_id: this.verification_request_id}).then(
                result => {
                    this.verify_code_status = result.status;
                    if (result.message)
                    {
                        this.verify_error_message = result.message;
                    }
                    console.log(result);
            });
            //
        }
         
    },
    verifyCode()
    {
        this.$schedsdk.verify_code({verify_request_id: this.verification_request_id, 
                                     verification_code: this.in_verificationcode}).then(
                result => {
                    
                    this.verify_code_status = result.status;
                    if (result.message)
                    {
                        this.verify_error_message = result.message;
                    }
                    if (result.status == 1)
                    {
                        this.showVerificationCodeDialog = false;
                        this.hide_initial_panels();
                        //this.sho
                        this.schedule_signup_status_check();
                    }
                    console.log(result);
            }).catch(Ex=>{
                 this.verify_error_message = "Error verifing. Please contact support team.";
            });
         

    },
    register(e) {
      e.preventDefault();
      this.v$.$touch();
      if (!this.v$.$invalid) {
        //Check country to time zone match...
        let country = this.country? (this.country.name || "") : "";
        let country_code = this.country? (this.country.code || "") : "";
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
        if (this.country.timezones && 
            this.country.timezones.includes(timezone) === false)
        {
             this.alertData = {
                message: "Error country " + country + " and timezone " + timezone + " mismatched" ,
                type: "danger"
              };
              this.alert = true;
              this.show = 10;
            return;
        }
        let signup_type = 1;
        if (this.reg_type == "partner")
        {
            signup_type = 3;
        }
        let dep_bank = Object.assign({},this.deposit_bank);
        let withd_bank = Object.assign({}, this.withdraw_bank);
        if (dep_bank &&dep_bank.acct_type)
        {
             dep_bank.acct_type = this.fetch_code(dep_bank.acct_type)
        }
        if (this.show_withdrawal_bank == false)
        {
           withd_bank = dep_bank;
        }
        else if (withd_bank)
        {
            withd_bank.acct_type = this.fetch_code( withd_bank.acct_type)
        }
        
        let data = {
            email               : this.email,
            password            : this.password,
            confirm_password    : this.confirm_password,
            business_name       : this.business_name,
            business_phone      : this.business_phone,
            phone               : this.phone,
            no_of_employees     : this.no_of_employees,
            plan_level_on_signup: this.plan_level_on_signup,
            plan_id_on_signup   : this.plan_id_on_signup,
            address_line1       : this.address_line1,
            address_line2       : this.address_line2,
            city                : this.city,
            state               : this.state? this.state.code: null,
            country             : country,
            country_code        : country_code,
            zipcode             : this.zipcode,
            signup_type         : signup_type,
            timezone            : timezone,
            signup_channel      : 'website',

            selected_payment_processing_offer: this.selected_payment_processing_offer,
            business_ownership_type          : this.fetch_code(this.business_ownership_type),
            business_mcc                     : this.fetch_code(this.business_mcc),
            processing_monthly_volume        : this.processing_monthly_volume,
            processing_per_ticket            : this.processing_per_ticket,
            processing_highest_per_ticket    : this.processing_highest_per_ticket,
            ein                              : this.ein,
            legal_business_name              : this.legal_business_name,
            business_website                 : this.business_website,
            owner_first_name                 : this.owner_first_name,
            owner_last_name                  : this.owner_last_name,
            owner_ssn                        : this.owner_ssn,
            business_start_date              : this.business_start_date,
            owner_address_line1              : this.owner_address_line1,
            owner_address_line2              : this.owner_address_line2,
            owner_city                       : this.owner_city,
            owner_state                      : this.fetch_code(this.owner_state),
            owner_country                    : country, //treat same as business country
            owner_zipcode                    : this.owner_zipcode,
            owner_dl_number                  : this.owner_dl_number,
            owner_dl_state                   : this.fetch_code(this.owner_dl_state),
            owner_mobile_number              : this.owner_mobile_number,
            owner_title                      : this.fetch_code(this.owner_title),
            owner_dob                        : this.owner_dob,
            deposit_bank                     : dep_bank,
            withdraw_bank                    : withd_bank,
            terms                            : this.terms,

            subscription_type      : this.subscription_type,
            subscription_type_text : this.subscription_type_text,
            subscription_type1_cost: this.subscription_type1_cost,
            subscription_type2_cost: this.subscription_type2_cost
                        
        };

      


        //console.log(this.subscription_type);
        //console.log("ASdasd")
        //return;
        this.in_verificationcode ='';
         
        this.showVerificationCodeDialog = false;
        this.verify_code_status = -1
        this.create_account_disabled = true;
        if (this.subscription_type == 1)
        {
                let merchant_data = Object.assign({}, data)
               
                this.$schedsdk.business_signup_with_merchant_account(merchant_data).then(result => {
                    console.log(result);
                    if (result.status == 1)
                    {
                        this.alertData = {
                                message: result.message,
                                type: "success"
                        };
                         this.alert = true;
                         this.show = 4;
                        if (result.sent_verification == true)
                        {
                             this.showVerificationCodeDialog = true;
                             this.verification_request_id =     result.verification_request_id;
                             this.business_signup_id      = result.business_signup_id;
                             this.hide_initial_panels();
                        }
                        me.$skyEventListener.generateEvent('AEV_REGISTER_COMPLETED')
                    }
                    else
                    {
                        this.create_account_disabled = false;
                        this.alertData = {
                                message: result.message,
                                type: "danger"
                        };
                        this.errors = result.errors;
                        this.alert = true;
                        this.show = 30;
                    }
                    
                    

                }).catch(ex => {
                        console.log(ex);
                        this.alertData = {
                        message: (ex.response &&  ex.response.message)? ex.response.message: "error" ,
                        type: "danger"
                    };
                    this.create_account_disabled = false;
                    this.alert = true;
                    this.show = 4;
                });

        }
        else
        {
            this.$schedsdk.business_signup(data).then(result => {
                if (result.status == 1) 
                {
                    this.$router.push("/login");
                } 
                else 
                {    
                    this.create_account_disabled = false;
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
                    this.create_account_disabled = false;
                    this.alert = true;
                    this.show = 4;
                });

        }

      }
    },
    alertClosedFn() {
      this.show = 0;
      this.errors = [];
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
.btn-back {
  border: 0;
  background-color: transparent;
  color: var(--link-color);
  display: inline-flex;
  align-items: center;
  font-weight: 500;
}
.btn-back svg {
  width: 18px;
  fill: var(--link-color);
  margin-right: 9px;
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
.form-control {
    font-size: 16px;
    font-weight: 500;
}
.logo-auth {
    width: 44px;
    height: 44px;
    margin: 5px;
}
.logo span {
    font-size: 18px;
}
</style>
