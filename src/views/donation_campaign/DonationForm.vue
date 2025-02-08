<template>
    <div class="checkin-wrap row" v-if="donation_product">
        <div class="col-lg-6 col-content order-2" :style="{ backgroundImage: image ? 'url(' + image + ')' : null }" v-if="visibility_info_graphic === 1"  >
            <div class="content text-center w-100">
                <h2>{{ donation_campaign.title }}</h2>
                <p>{{ donation_campaign.description }}</p>
                <!-- <div>
                    <div>
                        <h4>Think you have what it takes?</h4>
                    </div>
                </div> -->
            </div>
        </div>
        <div class="col-lg-6 form-outer">
            <div class="form-wrap">
                <div class="form-header step-1-outer">
                    <p>{{ stepTitle }}</p>
                    <div class="d-flex">
                        <div class="d-flex justify-space-between arrow-wrap">
                            <span id="prev-arrw" @click="prevStep()" :class="{'disabled-arrow': currentStep == 1}">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </span>
                            <span class="next-step" @click="nextStep()" :class="{'disabled-arrow': currentStep == 3}">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
                <form id="multiStepForm" onsubmit="return false" class="form-body">
                    <div id="loading-section" v-if="loading">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                                <radialGradient id="a12" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)">
                                    <stop offset="0" stop-color="#6A6CFF"></stop>
                                    <stop offset=".3" stop-color="#6A6CFF" stop-opacity=".9"></stop>
                                    <stop offset=".6" stop-color="#6A6CFF" stop-opacity=".6"></stop>
                                    <stop offset=".8" stop-color="#6A6CFF" stop-opacity=".3"></stop>
                                    <stop offset="1" stop-color="#6A6CFF" stop-opacity="0"></stop>
                                </radialGradient>
                                <circle transform-origin="center" fill="none" stroke="url(#a12)" stroke-width="15" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70">
                                    <animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform>
                                </circle>
                                <circle transform-origin="center" fill="none" opacity=".2" stroke="#6A6CFF" stroke-width="15" stroke-linecap="round" cx="100" cy="100" r="70"></circle>
                            </svg>
                            <p class="text-center mt-3">Submitting. Please wait...</p>
                        </div>
                    </div>

                    <!-- Step 1: Donation Information -->
                    <div id="step-1" v-if="currentStep == 1">
                        
                        <div class="switches-container">
                            <input type="radio" id="one-time" name="switchPlan" value="one-time" checked="checked" />
                            <input type="radio" id="monthly" name="switchPlan" value="monthly" />
                            <label for="one-time" @click="setDonationType('one-time')">One-time</label>
                            <label for="monthly" @click="setDonationType('monthly')">Monthly</label>
                            <div class="switch-wrapper">
                                <div class="switch">
                                    <div @click="setDonationType('one-time')">One-time</div>
                                    <div @click="setDonationType('monthly')">Monthly</div>
                                </div>
                            </div>
                        </div>
                        <div class="donation-note" id="donation-note" v-if="donation_type == 'monthly'">
                            <span>You can log in to edit your recurring donation any time </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 info-icon">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                            </svg>
                            <div class="info-popover">
                                A donor account is created automatically for recurring donations. Account setup info  will be emailed to you.
                            </div>
                        </div>

                        <div class="select-outer">
                            <div class="custom-select" :class="{'selected' : amount == amountSelected}" v-for="amount in fixed_amount_options" style="cursor: pointer;">
                                <label :for="amount">{{business_currency_symbol}}{{amount}}</label>
                                <input :id="amount" :value="amount" type="radio" v-model="amountSelected" name="amount" class="radio-style"/>
                            </div>
                        </div>
                        <div class="input-custom form-floating pre-icon">
                            <span class="icon">{{business_currency_symbol}}</span>
                            <input type="text" class="form-control" id="customAmount" name="custom_amount" 
                            v-model.number="customAmount" placeholder="" @input="filterCustomAmountInput"/>
                            <label for="customAmount">Custom Amount</label>
                        </div>
                        <!-- <div>
                            <div class="comment-outer">
                                <input type="checkbox" id="toggleWrite" @click="toggleCommentSection(this)"/>
                                <label for="toggleWrite">Write us a comment</label>
                            </div>
                            <div id="comment-section" style="display: none;">
                                <textarea id="comment" name="comment"></textarea>
                            </div>
                        </div> -->
                    </div>
                
                    <!-- Step 2: Personal Information -->
                    <div id="step-2" v-else-if="currentStep == 2" class="step-2">
                        <div class="d-lg-flex">
                            <div class="col form-group form-floating pe-lg-2">
                                <input type="text" name="first_name" v-model.trim="first_name"  id="firstName" class="form-control" placeholder=" "/>
                                <label for="firstName">First name</label>
                            </div>
                            <div class="col form-group form-floating">
                                <input type="text" name="last_name" v-model.trim="last_name"  id="lastName" class="form-control" placeholder=" " />
                                <label for="lastName">Last name</label>
                            </div>
                        </div>
                        <div class="d-flex">
                            <div class="col-full form-group form-floating">
                                <input type="email" name="email" v-model.trim="email"  id="email" class="form-control" placeholder=" " />
                                <label for="email">Email</label>
                            </div>
                        </div>
                        <div class="d-flex">
                            <div class="col-full form-group form-floating">
                                <input type="tel" id="phone" name="phone" v-model.trim="phone"  class="form-control" placeholder=" " pattern="\d{10,15}" />
                                <label for="phone">Phone</label>
                            </div>
                        </div>
                    </div>
                
                    <!-- Step 3: Confirmation -->
                    <div id="step-3" v-else>
                        <h3 class="mb-3 fw-bold h4">Step 3: Review & Confirm</h3>
                        <!-- Add review content here -->
                        <div>
                            <table class="table table-bordered">
                                <tbody>
                                  <tr>
                                    <th width="40%">Donation Amount</th>
                                    <td>{{ business_currency_symbol }}<span id="donation_amount">{{ amountSelected || customAmount }}</span></td>
                                  </tr>
                                  <tr>
                                    <th width="40%">Full Name</th>
                                    <td><span id="full_name">{{ first_name }} {{ last_name }}</span></td>
                                  </tr>
                                  <tr>
                                    <th width="40%">Email</th>
                                    <td><span id="email_info">{{ email }}</span></td>
                                  </tr>
                                  <tr>
                                    <th width="40%">Phone</th>
                                    <td><span id="phone_info">{{ phone }}</span></td>
                                  </tr>
                                  <!-- <tr>
                                    <th width="40%">Comment</th>
                                    <td>Hi here are some sample comments we can remove complete row according to the user input</td>
                                  </tr> -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div id="error-section" class="error-section" v-if="error">{{ error }}</div>
                    <!-- Navigation Buttons -->
                    <div class="btn-wrap d-flex justify-content-between">
                        <button id="btn-prev-bottom" type="button" class="btn-custom btn-prev" :class="{'disabled': currentStep == 1}" @click="prevStep()">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                            </svg>
                            <span>Prev</span>
                        </button>
                        <button id="btn-next-button" type="button" class="btn-custom btn-next" @click="nextStep()">
                            <span>{{ currentStep == 3 ? 'Submit & Pay' : 'Next' }}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                            </svg>
                        </button>
                    </div>
                    <!-- <div class="btn-wrap d-flex justify-content-between">
                        <button type="button" class="btn-custom" @click="nextStep()">
                            <span>Next</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                            </svg>
                        </button>
                    </div> -->
                
                    <!-- Pagination (Step Indicators) -->
                    <div class="form-footer">
                        <div class="pagination">
                            <span id="btn-step-1" @click="navigateStep(1)" :class="{'active': currentStep == 1}"></span>
                            <span id="btn-step-2" @click="navigateStep(2)"
                            :class="{'active': currentStep == 2}"></span>
                            <span id="btn-step-3" @click="navigateStep(3)" :class="{'active': currentStep == 3}"></span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div v-else-if="invalid">{{ error }}</div>
</template>
<script>
import { Icon } from '@/common/Icon'
//import { debounce } from 'lodash'
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
    name: 'Donation Form',
    components: {
        Icon
    },
    data() {
        return ({
            access_key: null,
            campaign_id: null,
            currentStep: 1,
            donation_campaign: {},
            background_color: "var(--donation-primary-color)",
            text_color: "#fff",
            image: null,
            donation_type: "one-time",
            business_currency_symbol: null,
            fixed_amount_options: [],
            allow_anonymous_donations: false,
            amountSelected: null,
            customAmount: null,
            donation_product: null,
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            business_email: "",
            business_phone: "",
            loading: false,
            error: null,
            invalid: false
        })
    },
    setup() {
        const route = useRoute();
        // Check if the info_graphic query parameter is present and equals 1
        const visibility_info_graphic = computed(() => 
            route.query.info_graphic === undefined || route.query.info_graphic === '1' ? 1 : 0
        );

        return {
            visibility_info_graphic,
        };
    },
    computed: {
        stepTitle() {
            return this.currentStep == 1 ? 'Choose Amount' : (this.currentStep == 2 ? `Information${this.allow_anonymous_donations ? `(Optional)` : null }` : 'Payment')
        }
    },
    async mounted() {
        this.access_key = this.$route.params.accesskey;
        this.campaign_id = this.$route.params.campaign_id || null;
        await this.get_donation_campaign();
        this.setCSSVariables();
    },
    methods: {
        setCSSVariables() {
            document.documentElement.style.setProperty('--bg-image', this.image);
            document.documentElement.style.setProperty('--donation-primary-color', this.background_color);
            document.documentElement.style.setProperty('--donation-text-color', this.text_color);
        },
        async get_donation_campaign() {
            try {
                const donation_form_response = await this.$schedsdk.get_donation_campaign(this.access_key, this.campaign_id);
                if (!donation_form_response.status) {
                    this.invalid = true;
                    this.error = donation_form_response.message;
                    return false;
                }

                const donation_form_result = donation_form_response.data;
                const { business_currency_symbol, business_email, business_phone, donation_campaign, donation_product, allow_anonymous_donations } = donation_form_result;

                this.business_currency_symbol = business_currency_symbol;
                this.business_email = business_email;
                this.business_phone = business_phone;
                this.donation_campaign = donation_campaign;
                this.fixed_amount_options = donation_campaign.fixed_amount_options;
                this.donation_product = donation_product;
                this.allow_anonymous_donations = donation_campaign.allow_anonymous_donations;
                this.background_color = donation_campaign.background_color || "#5B00B7";
                this.text_color = donation_campaign.text_color || "#fff";
                this.image = donation_campaign.image || null;

            } catch (error) {
                this.invalid = true;
                this.error = error?.data?.message || error?.message;
            }
        },
        async submitDonationForm() {
            this.loading = true;
            try {
                let email = this.email || this.business_email;
                let phone = this.phone || this.business_phone;
                let amount = this.amountSelected || this.customAmount;

                if (!amount || !email || !phone) {
                    this.setStep(1);
                    return false;
                }

                let payload = {
                    "customer": {
                        email: email,
                        phone: phone,
                        "first_name": this.first_name,
                        "last_name": this.last_name,
                        "user_id": "",
                        "is_anonyomus_customer": true
                    },
                    "cart": {
                        "items": [
                            {
                                "applied_unit_price": amount,
                                "item_name": this.donation_product.name,
                                "item_qty": 1,
                                "item_type": "PROD",
                                "item_id": this.donation_product.id,
                                "item_price": amount,
                                "user_selected_flex_time": []
                            }
                        ],
                        "card_on_file_id_to_use": ""
                    },
                    "cpn_pkg_codes": [],
                    "selected_coupon_code": null
                }
                
                const po_result = await this.$schedsdk.create_purchase_order(payload);
                if (po_result.status) {
                    let po_access_link = po_result.data.po_access_link;
                    window.open(po_access_link, '_blank');
                } else {
                    this.error = po_result.message;
                }
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },
        
        setDonationType(type) {
            this.donation_type = type;
        },

        setStep(step) {
            this.currentStep = step;
        },
        nextStep() {
            if (this.validateStep(this.currentStep)) {
                this.error = null;
                if (this.currentStep < 3) {
                    this.currentStep += 1;
                    this.setStep(this.currentStep);
                } else if (this.currentStep == 3) {
                    this.submitDonationForm();
                }
            }
        },
        prevStep() {
            if (this.currentStep > 1) {
                this.currentStep -= 1;
                this.setStep(this.currentStep);
            }
        },
        navigateStep(step) {
            if (step > this.currentStep) {
                if (this.validateStep(this.currentStep)) {
                    this.setStep(step);
                }
            } else {
                this.setStep(step);
            }
        },
        validateStep(step) {
            let isValid = true;

            if (step === 1) {
                let amountSelected = +this.amountSelected;
                let customAmount = +this.customAmount;

                if (!amountSelected && !customAmount) {
                    isValid = false;
                    this.error = "Please select a donation amount or enter a custom amount.";
                } else if (customAmount && !this.isValidNumber(customAmount)) {
                    isValid = false;
                    this.error = "Custom amount must be a valid number.";
                }
            } else if (step === 2) {

                if (!this.allow_anonymous_donations && !this.first_name) {
                    isValid = false;
                    this.error = "First name is required.";
                } else if (!this.allow_anonymous_donations && !this.last_name) {
                    isValid = false;
                    this.error = "Last name is required.";
                } else if ((!this.allow_anonymous_donations && !this.email) || (this.email && !this.validateEmail(this.email))) {
                    isValid = false;
                    this.error = "A valid email is required.";
                } else if ((!this.allow_anonymous_donations && !this.phone) || (this.phone && !this.validatePhone(this.phone))) {
                    isValid = false;
                    this.error = "A valid phone number is required.";
                }
            }

            return isValid;
        },

        isValidNumber(value) {
            return !isNaN(value) && Number(value) > 0;
        },
        filterCustomAmountInput(event) {
            this.customAmount = event.target.value.replace(/\D/g, '');
        },
        validateEmail(email) {
            var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        },
        validatePhone(phone) {
            var phoneRe = /^\d{10,15}$/;
            return phoneRe.test(phone);
        }
    }
}
</script>
<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
:root { 
    --primary-color: #B73A00;
    --text-color: black;
}

.bg-color {
    background-color: var(--donation-primary-color);
}
.text-color {
    color: var(--donation-primary-color);
}
* {
    box-sizing: border-box;
    font-family: "Montserrat", system-ui;
}
body {
    background-color: #f9f9f9;
    margin: 0;
    padding: 0;
    /* height: calc(100vh - 70px); */
    font-family: "Montserrat", system-ui;
    font-optical-sizing: auto;
    font-style: normal;
}
.bg-white {
    background-color: #fff;
}
header {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}
header img {
    height: 50px;
}
main {
    padding: 0 10px;
    display: flex;
    height: 100%;
}
main .col {
    flex-basis: 50%;
    box-sizing: border-box;
}
.col-content {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    padding: 3rem;
    display: flex;
    align-items: center;
}
.content {
    position: relative;
    z-index: 9;
    color: var(--donation-text-color);
}
.content h4 {
    text-transform: uppercase;
    font-weight: 500;
    font-size: 20px;
}
.text-center {
    text-align: center;
}
.content h2 {
    font-size: 34px;
    text-align: center;
    text-transform: uppercase;
}
.col-content:after {
    position: absolute;
    display: inline-block;
    content: '';
    width: 100%;
    height: 100%;
    background-color: var(--donation-primary-color);
    opacity: .7;
    top: 0;
    left: 0;
}
/*  */
.form-outer {
    padding: 3rem;
}
.form-header {
    display: flex;
    justify-content: space-between;
    background-color: var(--donation-primary-color);
    padding: 15px;
    color: var(--donation-text-color);
    align-items: center;
}
.form-header p {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
}
.pagination {
    display: flex;
    align-items: center;
    margin-right: 10px;
}
.pagination span {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-left: 10px;
    border-radius: 6px;
    border: 2px solid var(--donation-primary-color);
    cursor: pointer;
    opacity: .3;
}
.pagination span.active {
    background-color: var(--donation-primary-color);
    opacity: 1;
}
.form-body {
    padding: 1.5rem 3rem;
    background-color: #fff;
    position: relative;
}
.donation-note {
    position: relative;
}
.info-icon + .info-popover {
    transition: all .2s ease-in;
    transform: scale(0);
}
.info-icon:hover + .info-popover {
    display: inline-block;
    transform: scale(1);
    transition: all .2s ease-in;
}
.info-popover {
    position: absolute;
    padding: 15px;
    background-color: var(--donation-primary-color);
    color: var(--donation-text-color);
    font-size: 14px;
    width: 200px;
    right: 0;
    top: 40px;
    border-radius: 6px;
    z-index: 99;
}
.form-footer {
    padding: 15px;
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
}
.d-flex {
    display: flex;
}
.justify-content-between {
    justify-content: space-between;
}
.arrow-wrap span.disabled-arrow, .btn.disabled {
    cursor: not-allowed;
}
.arrow-wrap span {
    display: inline-block;
    width: 28px;
    margin-left: 10px;
    cursor: pointer;
}
.select-outer {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}
.custom-select {
    width: calc(93% / 3);
    display: inline-block;
    position: relative;
    cursor: pointer;
}
.custom-select label {
    border: 1px solid #ddd;
    font-size: 18px;
    font-weight: 500;
    height: 60px;
    border-radius: 6px;
    width: 100%;
    display: inline-flex;
    align-items: center;
    padding: 15px;
    box-sizing: border-box;
    justify-content: center;
    cursor: pointer;
}
.custom-select input {
    visibility: hidden;
    position: absolute;
    left: 0;
}
.selected label {
    border: 2px solid  var(--donation-primary-color); /* Example of selected style */
    background-color: #fff;
    color: var(--donation-primary-color);
    border-radius: 6px;
}
.input-custom {
    position: relative;
    margin-top: 20px;
}
.input-custom input {
    font-size: 16px;
    font-weight: 500;
    height: 60px;
    border: 1px solid #ddd;
    border-radius: 6px;
    width: 100%;
    padding: 15px 15px 15px 45px;
}
.input-custom .icon {
    position: absolute;
    left: 0;
    font-weight: 500;
    top: 23px;
    font-size: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    color: var(--donation-primary-color);
}
div.form-floating.pre-icon > label {
    top: 9px;
}
.comment-outer {
    display: flex;
    margin-top: 15px;
    align-items: center;
}
.comment-outer input[type="checkbox"] {
    width: 20px;
    height: 20px;
    display: inline-block;
}
.comment-outer label {
    font-size: 16px;
    margin-left: 8px;
}
textarea {
    border: 1px solid #ddd;
    border-radius: 6px;
    min-height: 90px;    
    margin-top: 15px;
    padding: 15px;
    width: 100%;  
    font-size: 16px;         
    font-weight: 500; 
}
.form-wrap {
    display: inline-block;
    width: 100%;
    border: 1px solid #efefef;
    box-shadow: 0 0px 13px 3px rgba(0, 0, 0, .1);
    background: #fff;;
    margin-bottom: 3rem;
}
.input-custom .icon:not(.icon-c-s):not(.icon-custom-size) {
    width: 45px;
    height: 16px;
    font-size: 20px;
}
.btn-wrap {
    /* padding: 0 3rem; */
    margin-top: 25px;
}
button.btn-custom.btn-prev {
    padding-left: 0;
}
button.btn-custom.btn-prev svg {
    margin-right: 15px;
}
button.btn-custom.btn-next svg {
    margin-left: 15px;
}
.btn-custom.disabled {
    cursor: not-allowed;
}
.btn-custom, div.step-1-outer + .form-body #btn-prev-bottom:not(.disabled) {
    color: var(--donation-text-color);
    background-color: var(--donation-primary-color);
    border-radius: 6px;
    height: 54px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    text-align: center;
    /* width: 100%;
    gap: 15px; */
    border: 0;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, .1);
    cursor: pointer;
    position: relative;
    transition: all .2s ease;
    margin-bottom: 15px;
    min-width: 160px;
    opacity: 1;
    padding:  0 15px;
}
.btn-custom:hover:after {
    content: '';
    width: 100%;
    height: 100%;
    display: inline-block;
    background-color: rgba(0, 0, 0, .1);
    transition: all .2s ease;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
}
.btn-custom svg {
    width: 28px;
}
.switches-container {
    width: 16rem;
    position: relative;
    display: flex;
    padding: 0;
    position: relative;
    background: var(--donation-primary-color);
    line-height: 3rem;
    border-radius: 3rem;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
}

.table-bordered {
    border: 1px solid #dee2e6;
}
.table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 1rem;
    background-color: transparent;
}
input:-internal-autofill-selected {
    background-color: #fff;
}
table {
    border-collapse: collapse;
}
.table th {
    vertical-align: bottom;
    border-bottom: 2px solid #dee2e6;
    text-align: left;
}
.table-bordered thead td, .table-bordered thead th {
    border-bottom-width: 2px;
}
.table td, .table th {
    padding: .75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
}
.table-bordered td, .table-bordered th {
    border: 1px solid #dee2e6;
}

/* input (radio) for toggling. hidden - use labels for clicking on */
.switches-container input {
    visibility: hidden;
    position: absolute;
    top: 0;
}

/* labels for the input (radio) boxes - something to click on */
.switches-container label {
    width: 50%;
    padding: 0;
    margin: 0;
    text-align: center;
    cursor: pointer;
    color: #fff;
    font-weight: 500;
}

/* switch highlighters wrapper (sliding left / right) 
    - need wrapper to enable the even margins around the highlight box
*/
.switch-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 50%;
    padding: 0.15rem;
    z-index: 3;
    transition: transform .5s cubic-bezier(.77, 0, .175, 1);
    /* transition: transform 1s; */
}

/* switch box highlighter */
.switch {
    border-radius: 3rem;
    background: #fff;
    height: 100%;
}

/* switch box labels
    - default setup
    - toggle afterwards based on radio:checked status 
*/
.switch div {
    width: 100%;
    text-align: center;
    opacity: 0;
    display: block;
    color: var(--donation-primary-color) ;
    transition: opacity .2s cubic-bezier(.77, 0, .175, 1) .125s;
    will-change: opacity;
    position: absolute;
    top: 0;
    left: 0;
    font-weight: 500;
}

/* slide the switch box from right to left */
.switches-container input:nth-of-type(1):checked~.switch-wrapper {
    transform: translateX(0%);
}

/* slide the switch box from left to right */
.switches-container input:nth-of-type(2):checked~.switch-wrapper {
    transform: translateX(100%);
}

/* toggle the switch box labels - first checkbox:checked - show first switch div */
.switches-container input:nth-of-type(1):checked~.switch-wrapper .switch div:nth-of-type(1) {
    opacity: 1;
}

/* toggle the switch box labels - second checkbox:checked - show second switch div */
.switches-container input:nth-of-type(2):checked~.switch-wrapper .switch div:nth-of-type(2) {
    opacity: 1;
}
/*  */
.donation-note {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    justify-content: center;
}
.donation-note svg {
    width: 24px;
}
.col-full {
    width: 100%;
}
.step-2 input[type="text"],
input[type="email"],
input[type="tel"] {
    height: 54px;
    border: 1px solid #ddd;
    width: 100%;
    padding: 1rem .75rem;
    border-radius: 6px;
}
.gap-15 {
    gap: 15px;
}
.form-group {
    margin-bottom: 15px;
}
.form-body input {
    font-size: 16px;
}
.form-body input:focus-visible {
    outline-color: var(--donation-primary-color);
}
.form-group label {
    margin-bottom: 5px;
    display: block;
}
#error-message {
    margin-top: 15px;
    background: red;
    color: #fff;
    padding: 1rem;
    border-radius: 6px;
}
.step-1-outer #prev-arrw {
    opacity: 1;
}
.step-1-outer #prev-arrw.disabled-arrow,
span.next-step.disabled-arrow {
    opacity: .3;
}
.step-3-outer .next-step {
    opacity: .3;
}

.step-1-outer + .form-body #btn-prev-bottom {
    opacity: .3;
    background-color: #939393;
}
/*  */
.form-floating {
    position: relative;
}
.form-floating label {
    position: absolute;
    left: 12px;
    top: 7px;
    /* font-size: 14px; */
    color: #777;
    transition: top 0.3s ease, font-size 0.3s ease, color 0.3s ease;
  }
.form-floating input:focus {
    border-color: var(--donation-primary-color);
    outline: none;
    border-width: 2px;
}
.form-floating input:focus + label,
.form-floating input:not(:placeholder-shown) + label {
    top: -3px;
    font-size: 14px;
    color: var(--donation-primary-color) !important;
    background-color: #ffffff;
    padding: 0 4px;
    border-radius: 4px;
    left: 8px;
}
.form-floating input:focus,
.form-floating > .form-control:not(:placeholder-shown) {
    padding-top: 12px;
}
.form-floating input:focus + label,
.form-floating input + label {
    height: auto;
}
.form-floating.pre-icon>label {
    top: 20px;
    left: 37px;
}

/* ------------ */
@media (max-width: 991px) {
    main {
        flex-wrap: wrap;
    }
    .form-outer, .col-content, .form-body {
        padding: 1rem;
    }
    .btn-wrap {
        padding: 0;
    }
    .custom-select {
        width: 30.3333%;
    }
}
@media (max-width: 768px) {
    main .col {
        flex-basis: 100%;
    }
    .form-outer {
        padding: 0;
    }
    .col-content {
        display: none;
    }
}

/*  */
.form-body {
    min-height: 500px;
}
#loading-section {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: rgba(255, 255, 255, .9);
    z-index: 99;
    height: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
#loading-section div {
    text-align: center;
}
#loading-section div svg {
    width: 80px;
    margin: 0 auto;
    display: inline-block;
}
.error-section {
    padding: 1rem;
    border-radius: 6px;
    background: red;
    color: #fff;
    margin-top: 10px;
    text-align: center;
}
@media (min-width: 767px) {
    .col-content {
        min-height: 813px;
    }
}
.form-outer {
    max-width: 680px;
    margin: 0 auto;
}
</style>