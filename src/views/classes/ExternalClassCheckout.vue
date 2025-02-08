<template>
	<div>
        <vue-title title="Checkout | Signup classes"></vue-title>
        <div class="d-flex align-center page-center">
            <div class="mx-auto col-md-11 col-lg-10 col-xl-9">
                <CCard class="my-4 shadow-lg border-rounded">
                    <CCardBody>
                        <p v-for="(error, index) in errors" :key="index">{{error}}</p>
                        <template v-if="movedToWaitlist">
                            <div class="wrapper-created"> 
                                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> 
                                    <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/> 
                                    <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                                </svg>
                                <div class="text-center mb-4">
                                    <p class="h4 fw-500 mb-5">Thank you for sign up for classes. Your are moved to waitlist for {{moved_to_waitlist_classes}} classes</p>
                                    <button @click="backToClasses" class="btn btn-primary-new fs-16 px-4">Back</button>
                                </div>
                            </div>
                            
                        </template>
                        <template v-else-if="cart.length">
                            <h3 class="h4 mb-3">Classes</h3>
                            <div class="table-responsive">
                                <table class="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Code</th>
                                            <th>Class Cost</th>
                                            <th>Number of Classes</th>
                                            <th>Total Cost</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="cart.length" >
                                        <tr v-for="item in cart" :key="item._id">
                                            <td class="align-middle">{{item.name}}</td>
                                            <td class="align-middle">{{item.code}}</td>
                                            <td class="align-middle">{{item.business_currency_symbol}}{{item.class_cost}}</td>
                                            <td class="align-middle"><input type="number" min="1" step="1" v-model="item.classes_count" :readonly="!item.join_any_time"/></td>
                                            <td class="align-middle">{{item.business_currency_symbol}}{{item.class_cost * item.classes_count}}</td>
                                            <td class="align-middle" data-label="Action">
                                                <button class="btn btn-primary-small border-radius-14 px-2 px-sm-3 px-xxl-3 btn-danger" @click="removeFromCart(item)"><span>Remove</span></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <hr class="my-3" />
                            <h3 class="h4 mb-3">Customer Information</h3>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label fw-500">First Name</label>
                                        <input 
                                            class="form-control placeholder-no-fix" 
                                            type="text" 
                                            v-model="first_name"
                                            @blur="v$.first_name.$touch()"
                                        />
                                        <p class="error-msg" v-if="v$.first_name.$dirty && v$.first_name.required.$invalid"><small class="fw-500">This field must not be empty.</small><span class="text-danger">*</span></p>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label fw-500">Last Name</label>
                                        <input 
                                            class="form-control placeholder-no-fix" 
                                            type="text" 
                                            v-model="last_name"
                                            @blur="v$.last_name.$touch()"
                                        />
                                        <p class="error-msg" v-if="v$.last_name.$dirty && v$.last_name.required.$invalid"><small class="fw-500">This field must not be empty.</small><span class="text-danger">*</span></p>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label fw-500">Email</label>
                                        <input 
                                            class="form-control placeholder-no-fix" 
                                            type="text"
                                            :readonly="is_email_readonly"
                                            v-model="email"
                                            @blur="v$.email.$touch()"
                                        />
                                        <p class="error-msg" v-if="v$.email.$dirty && v$.email.required.$invalid"><small class="fw-500">This field must not be empty.<span class="text-danger">*</span></small></p>
                                        <p class="error-msg" v-if="v$.email.$dirty && !v$.email.required.$invalid && v$.email.email.$invalid"><small>Please Enter valid email.<span class="text-danger">*</span></small></p>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="control-label fw-500">Phone</label>
                                        <input 
                                            class="form-control placeholder-no-fix" 
                                            type="text" 
                                            :readonly="is_phone_readonly"
                                            v-model="phone"
                                            @blur="v$.phone.$touch()"
                                        />
                                        <p class="error-msg" v-if="v$.phone.$dirty && v$.phone.required.$invalid"><small class="fw-500">This field must not be empty.</small><span class="text-danger">*</span></p>
                                    </div>
                                </div>
                            </div>
    
                            <div class="row" style="min-height: 51px;">
                                <div class="col-md-12 my-2 text-end">
                                    <button class="btn btn-primary btn-primary-new btn-primary-small border-radius-14 px-2 px-sm-3 px-xxl-3"  @click="signUpForClasses"><span>Signup</span></button>
                                </div>
                            </div>
                        </template>
                    </CCardBody>
                </CCard>
            </div>
        </div>        
	</div>
</template>

<script>

import { required, email } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { groupBy, merge } from 'lodash'
import titleComponent from '@/common/TitleComponent.vue';

export default {
    setup: () => ({ v$: useVuelidate() }),
    name: "ExternalClassCheckout",
    components: {
        "vue-title": titleComponent
    },
    data() {
        return ({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            movedToWaitlist: false,
            moved_to_waitlist_classes: '',
            errors: []
        })
    },
    async created() {
        let access_key = this.$route.params.accesskey;
        if (!this.cart.length) {
            this.$router.push({
                name: 'External Class List',
                params: {
                    accesskey: access_key
                }
            });
        }
        this.cart = this.cart.map(c => {
            c.classes_count = 1
            return c;
        });
        
    },
    validations: {
        first_name: {
            required
        },
        last_name: {
            required
        },
        email: {
            required,
            email
        },
        phone: {
            required
        }
    },
    computed: {
        cart() {
            return this.$store.state.cart;
        }
    },
    methods: {
        errorGroups(result) {
            return result.data.classes_response_info ? merge({'moved_to_waitlist': [], 'maximum_waitlist': [], 'maximum_capacity': []}, groupBy(result.data.classes_response_info.filter(e => e.class_response_type), e => e.class_response_type)) : {'moved_to_waitlist': [], 'maximum_waitlist': [], 'maximum_capacity': []};
        },
        getErrorClassName(result, type) {
            return this.errorGroups(result)[type] ? this.errorGroups(result)[type].map(s => {
                return `${s.class_name}(${s.class_code})`
            }).join(', ') : null;
        },
        removeFromCart(item) {
            this.$store.commit('removeFromCart', item);
            let access_key = this.$route.params.accesskey;
            if (!this.cart.length) {
                this.errors = [];
                this.$router.push({
                    name: 'External Class List',
                    params: {
                        accesskey: access_key
                    }
                });
            }
        },
        backToClasses() {
            let access_key = this.$route.params.accesskey;
            this.$router.push({
                name: 'External Class List',
                params: {
                    accesskey: access_key
                }
            });
        },
        signUpForClasses(e) {
            this.errors = [];
            e.preventDefault();
            this.v$.$touch();
            if (!this.v$.$invalid) {
                let payload;
                let customer = {
                    first_name: this.first_name,
                    last_name: this.last_name,
                    email: this.email,
                    phone: this.phone
                }
                let classes = this.cart.map(function(c) {
                    return {
                        class_id: c._id,
                        class_name: c.name,
                        classes_count: c.classes_count,
                        total_cost: c.class_cost
                    }
                });
                let total_cost = classes.reduce(function(c, i) {
                    return c + (i.total_cost * i.classes_count)
                }, 0)
                payload = {
                    card_on_file_id_to_use: "" || null,
                    agree_waitlist_signup: true,
                    customer,
                    classes,
                    total_cost
                }
                let access_key = this.$route.params.accesskey;
                let that = this;

                this.$schedsdk.add_class_signups(access_key, payload).then((result) => {
                    this.movedToWaitlist = false;
                    if (result.status) {
                        // user will redirect to payment page.
                        if (result.data?.purchase_order_info?.po_access_link) {
                            setTimeout(() => {
                                window.location.href = result.data.purchase_order_info.po_access_link+"?show_page_header=0&show_page_footer=0";
                            }, 500);
                        } else {
                            this.moved_to_waitlist_classes = this.getErrorClassName(result, 'moved_to_waitlist');
                            this.movedToWaitlist = true;
                        }
                        that.$store.commit('resetCart');
                    } else {
                        let maximum_waitlist_classes = this.getErrorClassName(result, 'maximum_waitlist');
                        let maximum_capacity_classes = this.getErrorClassName(result, 'maximum_capacity');
                        
                        let maximum_waitlist_error = maximum_waitlist_classes ? `The waitlist for classes ${maximum_waitlist_classes} is reached. Please remove these classes before proceeding.` : undefined;
                        let maximum_capacity_error = maximum_capacity_classes ? `The waitlist for classes ${maximum_capacity_classes} is reached. Please remove these classes before proceeding.` : undefined;
                        let genericError = (!maximum_waitlist_classes && !maximum_capacity_classes) ? result.message : undefined;
                        that.errors = [
                            maximum_waitlist_error,
                            maximum_capacity_error,
                            genericError
                        ];
                    }
                }).catch((error) => {
                    that.error = error;
                });
            }
        }
    }
}
</script>

<style scoped>
.action_column button {
    margin: 3px
}
.btn.btn-green {
    background-color: #33ab55;
    border-color: #33ab55;   
}
.controls-div {
    float: left;
    width: 100%;
    border: 1px solid #d8dbe0;
    padding: 15px 4px;
    margin: 0 0 1rem 0!important;
    padding-top: 20px;
    position: relative;
}
.settings-text {
    position: absolute;
    background: #fff;
    padding: 3px 6px;
    top: -15px;
    left: 15px;
    font-size: 16px;
    font-weight: bold;
}
.btn.btn-primary-small {
    min-height: 34px;
}
.form-control:disabled, .form-control[readonly] {
    background-color: #fff;
}
.page-center {
    min-height: calc(100vh - 56px);
}
.wrapper-created {
    min-height: 200px;
}
.checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #7ac142;
    fill: none;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards
}

.checkmark {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #fff;
    stroke-miterlimit: 10;
    margin: 5% auto;
    box-shadow: inset 0px 0px 0px #7ac142;
    animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both
}

.checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards
}

@keyframes stroke {
    100% {
        stroke-dashoffset: 0
    }
}

@keyframes scale {

    0%,
    100% {
        transform: none
    }

    50% {
        transform: scale3d(1.1, 1.1, 1)
    }
}

@keyframes fill {
    100% {
        box-shadow: inset 0px 0px 0px 30px #7ac142
    }
}
</style>