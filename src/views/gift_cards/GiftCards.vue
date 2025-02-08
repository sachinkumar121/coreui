<template>
    <div class="card-wrapper" :class="{'card-wrapper-select': !giftCardLogoSelected}" v-if="!checkoutComplete">
        <transition name="fade" mode="out-in">
            <div style="margin-top: 4rem;margin-bottom: 4rem;" v-if="!giftCardLogoSelected">
                <h2>Select a Gift Card</h2>
                <div class="card-inner">
                    <div class="card-outer" v-for="(giftCardLogo, index) in giftCardLogos" :key="index">
                        <img :src="`/img/gift-card/${giftCardLogo.value}.png`" :alt="giftCardLogo.alt" @click="selectGiftCardLogo(giftCardLogo)">
                    </div>
                </div>
            </div>
            <div class="create-card-wrapper" v-else>
                <div class="l-sections">
                    <h2 class="link-card-list" @click="giftCardLogoSelected = false"><img src="/img/gift-card/tabler_chevron-left.png"/> <span>Gift Card</span></h2>
                    <h2>Create Gift Card</h2>
                </div>
                <div class="r-section">
                    <div class="r-section-wrap">
                        <div style="text-align: center;">
                            <img :src="`/img/gift-card/${giftCardLogo.value}.png`" :alt="giftCardLogo.alt" />
                        </div>
                        <div class="form-section">
                            <div>
                                <p>Gift Amount</p>
                                <div class="c-row">
                                    <div class="c-col-6 c-col c-form-group">
                                        <div class="c-row">
                                            <div class="c-col-4 radio-outer c-col">
                                                <input type="radio" id="amount_100" name="amount" value="100" v-model="form.amount"/>
                                                <label for="amount_100">$100</label>
                                            </div>
                                            <div class="c-col-4 radio-outer c-col">
                                                <input type="radio" id="amount_200" name="amount" value="200" v-model="form.amount"/>
                                                <label for="amount_200">$200</label>
                                            </div>
                                            <div class="c-col-4 radio-outer c-col">
                                                <input type="radio" id="amount_300" name="amount" value="300" v-model="form.amount"/>
                                                <label for="amount_300">$300</label>
                                            </div>
                                        </div>
                                        <p class="error-msg" v-if="processing && (!form.amount && !form.custom_amount)">Please select or enter the amount</p>
                                    </div>
                                    <div class="c-col-6 c-col">
                                        <div class="c-form-group c-form-floating">
                                            <input type="text" class="c-form-control" placeholder="Enter Custom Account" v-model.number="form.custom_amount" />
                                        </div>
                                        <p class="error-msg" v-if="v$.form.custom_amount.$dirty && v$.form.custom_amount.numeric.$invalid">The amount can only have numeric values.</p>
                                    </div>
                                    
                                </div>
                            </div>
                            <div>
                                <p>To</p>
                                <div class="c-row">
                                    <div class="c-col-6 c-col">
                                        <div class="c-form-group c-form-floating">
                                            <input type="text" class="c-form-control" v-model="form.first_name" placeholder="Recipient First Name" :class={invalid:v$.form.first_name.$error} @blur="v$.form.first_name.$touch()" />
                                            <p class="error-msg" v-if="v$.form.first_name.$dirty && v$.form.first_name.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>
                                    <div class="c-col-6 c-col">
                                        <div class="c-form-group c-form-floating">
                                            <input type="text" class="c-form-control"  v-model="form.last_name" placeholder="Recipient Last Name" :class={invalid:v$.form.last_name.$error} @blur="v$.form.last_name.$touch()" />
                                            <p class="error-msg" v-if="v$.form.last_name.$dirty && v$.form.last_name.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="c-row">
                                    <div class="c-col-6 c-col">
                                        <div class="c-form-group c-form-floating">
                                            <input type="email" class="c-form-control"  v-model="form.email" placeholder="Recipient Email" :class={invalid:v$.form.first_name.$error} @blur="v$.form.first_name.$touch()"/>
                                            <p class="error-msg" v-if="v$.form.email.$dirty && v$.form.email.required.$invalid">This field must not be empty.</p>
                                            <p class="error-msg" v-if="v$.form.email.$dirty && !v$.form.email.required.$invalid && v$.form.email.email.$invalid">Please Enter valid email.</p>
                                        </div>
                                    </div>
                                    <div class="c-col-6 c-col">
                                        <div class="c-form-group c-form-floating">
                                            <input type="text" class="c-form-control"  v-model="form.phone" placeholder="Recipient Phone" />
                                            <p class="error-msg" v-if="v$.form.phone.$dirty && v$.form.phone.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p>Message</p>
                                <div class="c-row">
                                    <div class="c-col">
                                        <div class="c-form-group c-form-floating">
                                            <textarea type="text" class="c-form-control" row="3" placeholder="Message" v-model="form.message"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p v-if="errorMessage">{{errorMessage}}</p>
                            <div>
                                <button class="c-button" @click="checkout">Checkout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
    <div v-else>
        <p>
            {{successMessage}}
        </p><p>
            You will be redirect to payment page soon. 
        </p>
    </div>
</template>
<script>
    import { useVuelidate } from '@vuelidate/core';
    import { required, email, numeric } from '@vuelidate/validators';
    export default {
        name: "GiftCards",
        data() {
            return ({
                processing: false,
                checkoutComplete: false,
                errorMessage: null,
                successMessage: null,
                giftCardLogoSelected: false,
                giftCardLogo: null,
                giftCardLogos: [
                    { value: 'card_1', alt: 'card_1' },
                    { value: 'card_2', alt: 'card_2' },
                    { value: 'card_3', alt: 'card_3' },
                    { value: 'card_4', alt: 'card_4' },
                    { value: 'card_5', alt: 'card_5' },
                    { value: 'card_6', alt: 'card_6' },
                    { value: 'card_7', alt: 'card_7' },
                    { value: 'card_8', alt: 'card_8' },
                    { value: 'card_9', alt: 'card_9' },
                    { value: 'card_10', alt: 'card_10' }
                ],
                form: {
                    logo: null,
                    amount: null,
                    custom_amount: null,
                    first_name: null,
                    last_name: null,
                    email: null,
                    phone: null,
                    message: null
                }
            });
        },
        setup: () => ({ v$: useVuelidate() }),
        methods: {
            selectGiftCardLogo(giftCardLogo) {
                this.giftCardLogo = giftCardLogo;
                this.form = {
                    amount: null,
                    custom_amount: null,
                    first_name: null,
                    last_name: null,
                    email: null,
                    phone: null,
                    message: null
                }
                this.form.logo = giftCardLogo.value;
                this.giftCardLogoSelected = true;
            },
            checkout() {
                this.processing = true;
                this.v$.form.$touch();
                if (!this.v$.form.$invalid && (this.form.amount || this.form.custom_amount)) {
                    let payload = this.form;
                    let that = this;
                    payload.amount = +payload.amount || payload.custom_amount;
                    this.$schedsdk.create_gift_card(payload).then((result) => {
                        if (result.status) {
                            that.checkoutComplete = true;
                            that.successMessage = result.message;
                            // window.location.href = result.data.purchase_order_info.po_access_link+"?show_page_header=0&show_page_footer=0";
                        } else {
                            that.errorMessage = result.message;
                        }
                    }).catch((error) => {
                        that.errorMessage = error;
                    });
                    this.processing = false;
                }
            }
        },
        watch: { 
            "form.amount"(val) {
                if (val) {
                    this.form.custom_amount = null;
                }
            },
            "form.custom_amount"(val) {
                if (val) {
                    this.form.amount = null;
                }
            }
        },
        validations() {
            return {
                form: {
                    first_name: {
                        required
                    },
                    last_name: {
                        required
                    },
                    custom_amount: {
                        numeric
                    },
                    email: {
                        required,
                        email
                    },
                    phone: {
                        required
                    },
                }
            }
        }
    }
</script>
<style lang="scss">
.card-wrapper {
    max-width: 1457px;
    width: calc(100% - 10%);
    margin: 0 auto;
    &.card-wrapper-select {}
    h2 {
        text-align: center;
        margin-bottom: 3rem;
    }
}
.card-inner {
    div.card-outer {
        width: calc(100% / 4);
        position: relative;
        display: inline-block;
        transition: transform .3s ease;
        cursor: pointer;
        &:hover {
            transform: translateY(-8px);
        }
        img {
            width:100%;
        }
    }
}
@media (max-width: 1140px) {
    .card-inner {
        div.card-outer {
            width: calc(100% / 3);
        }
    }
}
@media (max-width: 768px) {
    .card-inner {
        div.card-outer {
            width: calc(100% / 2);
        }
    }
}
.card-wrapper {
    max-width: 1457px;
    width: calc(100% - 10%);
    margin: 0 auto;
    h2 {
        text-align: center;
        margin-bottom: 3rem;
    }
}
.form-section {
    p {
        color: #9A9AB0;
        font-weight: 600;
        margin-bottom: 5px;
        &.error-msg {
            font-weight: 400;
            color: red;
        }
    }
    .radio-outer {
        position: relative;
        width: 100px;
        // height: 40px;
        label {
            margin-bottom: 0;
        }
    }
    input[type="radio"] {
        opacity: 0.01;
        z-index: 100;
        display: none;
    }
    label, input {
        display: block;
        // position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    input[type="radio"]:checked+label,.Checked+label {
        border-color: #6D57E4;
        color: #6D57E4;
        font-weight: 600;
        border-width: 2px;
    }
    label {
        height: calc(2.7rem + 2px);
        padding: .5rem 0.75rem;
        border-width: 1px;
        border-style: solid;
        cursor: pointer;
        z-index: 90;
        min-height: 44px;
        border-color: #C9C9C9;
        border-radius: 6px;
        font-size: 16px;
        text-align: center;
    }
}
.c-form-group {
    margin-bottom: 15px;
}
::-webkit-input-placeholder { /* Edge */
  color: rgba(60, 60, 60, 0.8) !important;
}

:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: rgba(60, 60, 60, 0.8) !important;
}

::placeholder {
  color: rgba(60, 60, 60, 0.8) !important;
}
.c-row {display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    margin-right: -8px;
    margin-left: -8px;
}
.c-col-6 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 50%;
}
.c-col-4 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 33.333333%;
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
}
.c-col {
    position: relative;
    width: 100%;
    min-height: 1px;
    padding-right: 8px;
    padding-left: 8px;
}
.c-form-floating {
    position: relative;
    label {
        text-align: left;
        left: 0;
       
        padding-top: 0.7rem;
        padding-bottom: 0.7rem;
        color: rgba(60, 60, 60, 0.8) !important;
        position: absolute;
        top: -7px;
        height: 100%;
        padding: 1rem 0.75rem;
        pointer-events: none;
        border: 1px solid transparent;
        transform-origin: 0 0;
        transition: opacity 0.1s ease-in-out, transform 0.1s ease-in-out;
    }
    
   .c-form-control {
        display: block;
        width: 100%;
        height: -webkit-calc(1.5em + 0.75rem + 2px);
        height: -moz-calc(1.5em + 0.75rem + 2px);
        height: calc(1.5em + 0.75rem + 2px);
        font-size: 16px;
        font-weight: 400;
        padding: 1rem 0.75rem;
        line-height: 1.25;
        background-clip: padding-box;
        border: 1px solid;
        color: #000;
        background-color: #fff;
        border-color: #c9c9c9;
        border-radius: 0.25rem;
        -webkit-transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        -o-transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        -moz-transition: border-color 0.14s ease-in-out, box-shadow 0.15s ease-in-out;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        &:focus {
            box-shadow: 0 0 0 0.25rem hsl(246deg 75% 49% / 25%);
            border-color: #998fed;
            outline: 0;
        }
    }
}
.c-form-control {
    min-height: 44px;
    border-color: #C9C9C9;
    border-radius: 6px;
}
textarea.c-form-control {
    min-height: 80px;
}
.c-button:disabled {
    background: rgba(60, 60, 60, 0.4);
}
.c-button {
    background: #33ab55;
    padding: .6rem 2rem;
    color: #fff;
    font-weight: 500;
    font-size: 16px;
    border-radius: 15px;
    border: 0;
}
.create-card-wrapper {
    display: flex;
    width: 100%;
    .l-sections {
        padding: 2rem;
    }
    .r-section {
        padding-top:0;
    }
    .l-sections {
        padding-top:10rem;
        max-width: 420px;
        width: 100%;
        a {
            text-decoration: none;
        }
        .link-card-list {
            color: #9A9AB0;
            margin-bottom: 1rem;
            position: relative;
            left: -16px;
            cursor: pointer;
            img {
                position: relative;
                top: -3px;
            }
        }
        h2 {
            text-align: left !important;
        }
    }
    .r-section {
        border-left: 1px solid #D9D9D9;
        width: 100%;
        display: block;
        // height: 100vh;
        .r-section-wrap {
            max-width: 570px;
            margin: 1.5rem auto;
        }
    }
}
@media (max-width: 1180px) {
    .create-card-wrapper {
        .r-section {
            padding-left:2rem;
        }
    }
}
@media (max-width: 991px) {
    .create-card-wrapper {
        display: block;
        width: 100%;
        .l-sections {
            max-width: 620px;
            display: flex;
            width: 100%;
            padding-top:2rem;
            position: relative;
            justify-content: center;
            margin: 0 auto;
            h2 {
                padding-left: 0;
                text-align: center !important;
                margin-bottom: 15px;
                &.link-card-list {
                    position: absolute;
                    padding-left:0;
                    left: 0;
                }
                span {
                    display: none;
                }
            }
        }
        .r-section {
            border-left: 0;
        }
    }
}
@media (max-width: 600px) {
    .c-col-6 {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 100%;
        flex: 0 0 100%;
        max-width: 100%;
    }
    
    .r-section-wrap {
        img {
            width: 100%;
            max-width: 300px;
        }
    }
    .create-card-wrapper {
        .r-section {
            padding: 0;
            height: auto;
            margin-bottom: 2rem;
        }
        .l-sections {
            .link-card-list {
                img {
                    width: 39px;
                }
            }
            h2 {
                font-size: 24px;
            }
        }
    }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>