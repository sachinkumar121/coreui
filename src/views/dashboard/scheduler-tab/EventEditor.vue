<template>
    <CModal
        size="lg"
        :visible="show"
        backdrop="static"
        @close="closeModal"
        class="modal-dark"
    >
        <CModalHeader :close-button="true">
            <CModalTitle
                >{{ eventName }}
                <CSpinner
                    aria-hidden="true"
                    v-if="show_spinner"
                    component="span"
                    size="sm"
                ></CSpinner
            ></CModalTitle>
        </CModalHeader>
        <CModalBody>
            <form class="add-product-form" v-if="operation_completed == false">
                <div class="row">
                    <div class="col-md-12">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            v-model="book_without_email_phone"
                            @change="bookWithOutEmailPhone"
                        />&nbsp;
                        <label class="control-label">
                            <b>Book without email/phone </b> &nbsp;&nbsp;
                        </label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="control-label"
                                ><b>First Name</b>
                            </label>
                            <v-select
                                taggable
                                label="first_name"
                                v-model="customer"
                                @update:modelValue="fillCustomerDetail"
                                @search="onSearch"
                                :options="customer_option"
                                :create-option="
                                    (opt) => ({
                                        is_new: true,
                                        first_name: opt,
                                        last_name: '',
                                    })
                                "
                            >
                                <template
                                    v-slot:no-options="{search, searching}"
                                >
                                    <template v-if="searching">
                                        No results found for
                                        <em>{{ search }}</em
                                        >.
                                    </template>
                                    <em v-else style="opacity: 0.5"
                                        >Type to search ..</em
                                    >
                                </template>
                                <template v-slot:option="option">
                                    <div class="d-center">
                                        {{ getDisplayName(option) }}
                                    </div>
                                </template>
                                <template v-slot:selected-option="option">
                                    <div class="selected d-center">
                                        {{ option.first_name }}
                                    </div>
                                </template>
                            </v-select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="control-label"
                                ><b>Last Name</b></label
                            >
                            <input
                                class="form-control placeholder-no-fix"
                                type="text"
                                v-model="last_name"
                            />
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="control-label"><b>Email</b></label>
                            <input
                                class="form-control placeholder-no-fix"
                                type="text"
                                v-if="is_email_readonly != true"
                                v-model="email"
                            />
                            <label
                                class="form-control placeholder-no-fix"
                                :readonly="is_email_readonly"
                                v-else
                                >Walkin - no email{{}}</label
                            >
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="control-label"><b>Phone</b></label>
                            <input
                                class="form-control placeholder-no-fix"
                                type="text"
                                v-if="is_phone_readonly != true"
                                v-model="phone"
                            />
                            <label
                                class="form-control placeholder-no-fix"
                                :readonly="is_phone_readonly"
                                v-else
                                >Walkin - no phone{{}}</label
                            >
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <services-selector
                                :initialValues="services"
                                @modelValueUpdate="
                                    checkForAdditionalServiceProviders
                                "
                                @serviceListChange="onServiceListChange"
                            />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="control-label"
                                ><b>Select Products</b></label
                            >

                            <v-select
                                multiple
                                v-model="products"
                                label="name"
                                :options="products_option"
                                :getOptionKey="(o) => o._id"
                            >
                                <template v-slot:no-options>
                                    Type to search ..
                                </template>
                                <template v-slot:option="option">
                                    <div class="d-center">
                                        {{
                                            option.name +
                                            ' ' +
                                            currency_symbol +
                                            '' +
                                            option.price
                                        }}
                                    </div>
                                </template>
                            </v-select>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="control-label"
                                ><b>Select Provider</b></label
                            >
                            <v-select
                                v-model="service_provider"
                                :options="provider_option"
                                label="first_name"
                            >
                                <template v-slot:no-options>
                                    Type to search ..
                                </template>
                                <template v-slot:option="option">
                                    <div class="d-center">
                                        {{ option.first_name }}
                                        {{ option.last_name }}
                                    </div>
                                </template>
                                <template v-slot:selected-option="option">
                                    <div class="selected d-center">
                                        {{ option.first_name }}
                                        {{ option.last_name }}
                                    </div>
                                </template>
                            </v-select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div
                            class="form-group"
                            v-if="need_2nd_service_provider"
                        >
                            <label class="control-label"
                                ><b>Select Provider 2</b></label
                            >
                            <v-select
                                v-model="service_provider2"
                                :options="provider_option"
                                label="first_name"
                            >
                                <template v-slot:no-options>
                                    Type to search ..
                                </template>
                                <template v-slot:option="option">
                                    <div class="d-center">
                                        {{ option.first_name }}
                                        {{ option.last_name }}
                                    </div>
                                </template>
                                <template v-slot:selected-option="option">
                                    <div class="selected d-center">
                                        {{ option.first_name }}
                                        {{ option.last_name }}
                                    </div>
                                </template>
                            </v-select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group select-w">
                            <label class="control-label"
                                ><b>Select Date</b></label
                            >
                            <flat-pickr
                                v-model="startDate"
                                :config="date_picker_config"
                                placeholder="Start Date"
                            ></flat-pickr>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group select-w">
                            <label class="control-label"
                                ><b>Select Time</b></label
                            >
                            <flat-pickr
                                v-model="startTime"
                                :config="time_picker_config"
                                placeholder="Start Time"
                            ></flat-pickr>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="control-label"
                                ><b>Apply New Coupon Code</b></label
                            >
                            <v-select
                                v-model="selected_new_coupon_code"
                                :options="coupon_list"
                                label="coupon_name"
                            >
                                <template v-slot:no-options>
                                    Type to search ..
                                </template>
                                <template v-slot:option="option">
                                    <div class="d-center">
                                        {{ option.coupon_name }} ({{
                                            option.discount_type != 1
                                                ? currency_symbol
                                                : ''
                                        }}{{ option.amount
                                        }}{{
                                            option.discount_type == 1 ? '%' : ''
                                        }}
                                        off)
                                    </div>
                                </template>
                                <template v-slot:selected-option="option">
                                    <div class="selected d-center">
                                        {{ option.coupon_name }} ({{
                                            option.discount_type != 1
                                                ? currency_symbol
                                                : ''
                                        }}{{ option.amount
                                        }}{{
                                            option.discount_type == 1 ? '%' : ''
                                        }}
                                        off)
                                    </div>
                                </template>
                            </v-select>
                        </div>
                    </div>
                    <div
                        class="col-md-6"
                        v-if="
                            selected_coupon_array &&
                            selected_coupon_array.length
                        "
                    >
                        <span><b>Coupons Applied:</b> </span><br />

                        <template
                            v-for="(
                                applied_coupon, index
                            ) in selected_coupon_array"
                            :key="index"
                        >
                            <div
                                class="tag-style"
                                v-if="
                                    applied_coupon.coupon_name &&
                                    applied_coupon.coupon_name.length
                                "
                            >
                                <span
                                    >{{ applied_coupon.coupon_name }} ({{
                                        applied_coupon.discount_type != 1
                                            ? currency_symbol
                                            : ''
                                    }}{{ applied_coupon.amount
                                    }}{{
                                        applied_coupon.discount_type == 1
                                            ? '%'
                                            : ''
                                    }}
                                    off)
                                </span>
                                <button
                                    class="btn btn-close"
                                    aria-label="Remove item"
                                    @click.prevent="
                                        (e) =>
                                            removeAppliedCoupon(
                                                index,
                                                applied_coupon.coupon_name,
                                            )
                                    "
                                ></button>
                            </div>
                        </template>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="control-label"
                                ><b>Package Redemption Code</b></label
                            >
                            <input
                                class="form-control placeholder-no-fix"
                                type="text"
                                v-model="cpn_pkg_code"
                            />
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            v-model="force_appointment"
                        />&nbsp;
                        <label class="control-label mb-0">
                            <b>Force Appointment / allow double book </b>
                            &nbsp;&nbsp;
                        </label>
                        
                    </div>
                </div>
            </form>

            <div
                class="row"
                v-if="operation_completed == true || show_error_result == true"
            >
                <div
                    v-if="show_error_result"
                    class="col-md-8"
                    style="background-color: #ff8787"
                >
                    Error: {{ this.operation_result_message }}
                </div>
                <div v-else class="col-md-8">
                    {{ this.operation_result_message }}
                </div>
            </div>
        </CModalBody>
        <CModalFooter>
            <CButton @click="changeAssignedResources" color="danger"
                >Change Facilities</CButton
            >

            <a
                v-if="
                    eventRecord != null &&
                    eventRecord.data &&
                    eventRecord.data.service_order_id
                "
                :target="'_blank'"
                :href="'/bookings/detail/' + eventRecord.data.id"
                class="btn btn-info"
                >View Detail</a
            >
            <CButton
                @click="cancelHandler"
                color="danger"
                v-if="
                    eventRecord != null &&
                    eventRecord.data &&
                    eventRecord.data.service_order_id &&
                    show_cancel
                "
                >Cancel Booking</CButton
            >
            <CButton
                @click="okDoneHandler"
                color="warning"
                v-if="operation_completed == false"
                >Close</CButton
            >
            <ButtonLoader
                class="btn-primary-success"
                :class="{'active-svg': isShowWorking}"
                @click="saveHandler"
                color="success"
                v-if="operation_completed == false"
                :disabled="save_edit_disabled == true"
                >Save</ButtonLoader
            >

            <CButton
                @click="okDoneHandler"
                color="success"
                v-if="operation_completed == true"
                class="text-center"
                >OK</CButton
            >
        </CModalFooter>

        <bookingChangeAssignedResource
            :key="chass_key"
            @modelValueUpdate="bookingResourceChangeDone"
            v-if="show_change_assigned_resource"
            :assigned_resource_ids="res_assigned_resource_ids"
            :booking_id="eventRecord.data._id"
            :booking_service_order_id="eventRecord.data.service_order_id"
        ></bookingChangeAssignedResource>
    </CModal>
</template>

<script>
import servicesSelector from '@/common/ServicesSelector'
import bookingChangeAssignedResource from '@/common/BookingChangeAssignedResource.vue'
//  import Datetime from './DateTime.vue';
import moment from 'moment'
import moment_tz from 'moment-timezone'
import ButtonLoader from '@/common/ButtonLoader.vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import {debounce as lodash_debounce} from 'lodash'
import booking_helper from '../../../helpers/booking_helper'

export default {
    name: 'eventEditor',

    props: {
        modelValue: [Boolean, Object],
        visible: {
            default: false,
            type: Boolean,
        },
        eventRecord: Object,
        eventStore: Object,
        schedInst: Object,
        resourceId: [String, Number],
    }, // eo props
    emits: ['update:modelValue'],

    components: {
        servicesSelector,
        flatPickr,
        bookingChangeAssignedResource,
        ButtonLoader,
        // Datetime
    }, // eo components
    watch: {
        visible: function (newVal) {
            this.show = newVal
            this.setupData()
        },
    },
    data() {
        return {
            isShowWorking: false,
            setup_done: false,
            show: this.visible,
            services: [],
            products: [],
            //editorShown: false,
            timezone: this.$store.state.business_settings.business_time_zone,
            currency_symbol:
                this.$store.state.business_settings.business_currency_symbol,
            operation_completed: false,
            show_error_result: false,
            operation_result_message: 'No Message',
            save_edit_disabled: false,
            show_cancel: true,
            services_option: [],
            provider_option: [],
            customer_option: [],
            products_option: [],
            eventName: 'Loading...',
            endDate: null,
            startDate: null,
            startTime: '',
            service_provider: null,
            service_provider2: null,
            need_2nd_service_provider: false,
            customer: '',
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            existing_customer_id: '',
            force_appointment: false,
            book_without_email_phone: false,
            is_email_readonly: false,
            is_phone_readonly: false,
            cpn_pkg_code: '',
            date_picker_config: {
                altFormat: 'F j, Y',
                altInput: true,
                static: true,
                // minDate:Date.now()
            },
            time_picker_config: {
                altInput: true,
                noCalendar: true,
                enableTime: true,
                time_24hr: false,
                monthSelectorType: 'static',
                static: true,
                // minDate:Date.now()
            },
            debounce_time_ms: 350,
            coupon_list: [],
            selected_new_coupon_code: null,
            selected_coupon_array: [],
            selected_flex_time_obj: null,
            hint_flex_service_change: false,
            show_spinner: true,
            show_change_assigned_resource: false,
            chass_key: '',
            res_assigned_resource_ids: [],
            res_booking_id: null,
        }
    }, // eo data
    created() {
        //console.log("CR.... eventRecord")
        //console.log(this.eventRecord)
        //console.log(this.eventRecord.data.id)
    },
    mounted() {
        //this.editorShown = this.modelValue;
        this.getServicesList()
        this.getProductsList()
        this.getProvidersList()
        this.getCouponsList()
        console.log('CR..... mounted show, visible ', this.show, this.visible)
        //console.log(this.eventRecord)
        //console.log(this.resourceId)
        this.book_without_email_phone = false
        this.operation_completed = false
    },

    methods: {
        changeAssignedResources() {
            this.chass_key = moment().utc().valueOf()
            this.res_assigned_resource_ids =
                this.eventRecord.data.assigned_resource_ids
            this.res_booking_id = this.eventRecord.data._id
            this.show_change_assigned_resource = true
        },
        bookingResourceChangeDone(data) {
            this.show_change_assigned_resource = false
        },
        closeModal() {
            this.setup_done = false
            //this.editorShown = false;
            this.$emit('update:modelValue', false)
            this.show = false
            this.$emit('modal:close')
        },
        setupData() {
            if (this.setup_done == true) {
                // return;
            }
            let eventRecord = this.eventRecord
            let me = this
            me.hint_flex_service_change = false
            me.show_error_result = false
            let provider_data = null
            //me.products = eventRecord.data?.products || [];

            console.log('SETUP DATSTASD... ', this.setup_done, eventRecord)
            console.log('Event Record data ', eventRecord?.data)
            this.setup_done = true

            if (
                eventRecord &&
                eventRecord.data &&
                eventRecord.data.service_order_id
            ) {
                this.show_spinner = false
                //console.log("Here in edit service condition");
                if (
                    eventRecord.resourceId &&
                    eventRecord.resourceId.length > 1
                ) {
                    provider_data = me.provider_option.find((provider) => {
                        if (
                            provider._id.toString() ==
                            eventRecord.resourceId.toString()
                        ) {
                            return provider
                        }
                    })
                }

                let services = []
                console.log(
                    'asdasd--as-d----- EVENT Services/producs ',
                    eventRecord.data.services,
                    eventRecord.data?.products,
                )
                eventRecord.data.services.map((obj) => {
                    me.services_option.map((service) => {
                        if (service._id.toString() == obj._id.toString()) {
                            services.push(obj)
                        }
                    })
                })
                let products = []
                if (eventRecord.data?.products) {
                    eventRecord.data.products.map((obj) => {
                        me.products_option.map((prod) => {
                            if (prod._id.toString() == obj._id.toString()) {
                                products.push(obj)
                            }
                        })
                    })
                }

                //console.log("====== == = = = ==== = = = ===")
                //console.log(eventRecord.data)
                Object.assign(me, {
                    eventName:
                        'EditCX Booking ' + eventRecord.data.service_order_id,
                    first_name: eventRecord.data.first_name,
                    last_name: eventRecord.data.last_name,
                    email: eventRecord.data.email,
                    phone: eventRecord.data.phone,
                    customer: eventRecord.data.customer,
                    startDate: moment(
                        eventRecord.data.service_start_date,
                    ).format('YYYY-MM-DD'),
                    startTime: moment(
                        eventRecord.data.service_start_date,
                    ).format('HH:mm'),
                    services: services,
                    products: products,
                    service_provider: provider_data,
                    show_cancel: true,
                    selected_coupon_array: eventRecord.data.coupon_array || [],
                })

                if (
                    eventRecord.data.coupon &&
                    eventRecord.data.coupon.coupon_name
                ) {
                    me.selected_coupon_array.push(eventRecord.data.coupon)
                }
                if (eventRecord.edit_booking_flag == 1) {
                    ;(me.startDate = moment(
                        eventRecord.data.service_start_date,
                    ).format('YYYY-MM-DD')),
                        (me.startTime = moment(
                            eventRecord.data.service_start_date,
                        ).format('HH:mm')),
                        (me.customer = eventRecord.data.customer)
                    me.email = eventRecord.data.customer.email
                    me.phone = eventRecord.data.customer.phone
                    me.show_cancel = false
                }
                //console.log("Asda;sldka--a-sd-asd");
                //console.log(eventRecord.data.walkin_customer_first_name);
                if (
                    eventRecord.data.is_walkin_booking == true ||
                    (eventRecord.data.walkin_customer_first_name != null &&
                        eventRecord.data.walkin_customer_first_name.length > 1)
                ) {
                    me.book_without_email_phone = true
                    me.is_email_readonly = true
                    me.is_phone_readonly = true
                }
                if (eventRecord.is_for_rebooking_flag == 1) {
                    me.eventName = 'Book again for customer'
                    me.selected_coupon_array = []
                    let nextStart = moment().add(7, 'days')
                    ;(me.startDate = nextStart.format('YYYY-MM-DD')),
                        (me.startTime = nextStart.format('HH:mm')),
                        (eventRecord.is_rebooked_from = eventRecord.data.id)
                    me.existing_customer_id = eventRecord.data.customer?._id
                    me.show_cancel = false

                    //me.eventRecord.data.service_order_id = null;
                    //me.eventRecord.data.id = null;
                    //delete me.eventRecord.data.id;
                    //delete me.eventRecord.data.service_order_id;
                }
            } else {
                me.eventName = 'Add Booking (Event Editor)'
                let data = null

                if (me.eventRecord) {
                    if (me.eventRecord._startDateMS) {
                        data = me.eventRecord._startDateMS
                    } else if (
                        me.eventRecord.data &&
                        me.eventRecord.data.startDate
                    ) {
                        let value = me.eventRecord.data.startDate
                        data = moment(value).valueOf()
                        /*new Date(
                                        value.getFullYear(),
                                        value.getMonth(),
                                        value.getDate(),
                                        // apply start/end time from previous date value
                                        value.getHours(),
                                        value.getMinutes(),
                                        0
                                    ).;*/
                        //console.log(value,"-s-s--s-s-s-fdoasd " ,data)
                    }
                    me.startDate = data
                    me.startTime = data
                }
                //console.log("asd-s---d-s",data, me.resourceId, me.eventRecord, me.startDate);
                //console.log("asdasdasdasdas");
                if (me.resourceId && me.resourceId.length > 1) {
                    provider_data = me.provider_option.find((provider) => {
                        if (
                            provider._id.toString() == me.resourceId.toString()
                        ) {
                            return provider
                        }
                    })
                }
                me.service_provider = provider_data
                this.show_spinner = false
            }
            console.log('SETUP DATSTASD...TRULY DONE ', this.setup_done)
        }, //end setupdata
        setDebounceTime(search) {
            if (search.length < 5) {
                this.debounce_time_ms = 600 //wait longer
            } else {
                this.debounce_time_ms = 350 //Shorter wait for longer
            }
        },
        onSearch(search, loading) {
            if (this.book_without_email_phone) {
                return
            }
            if (search == null || search == '') {
                loading(false)
                return
            }
            this.setDebounceTime(search)
            loading(true)
            this.search(loading, search, null, this)
        },
        onSearchPhone(search, loading) {
            if (search == null || search == '') {
                return
            }
            this.setDebounceTime(search)
            loading(true)
            this.search(loading, null, search, this)
        },
        search: lodash_debounce((loading, search_fn, search_ph, vm) => {
            // vm.$http.get('business?search='+search).then(res => {
            //vm.customer_option = [{first_name: '', last_name:''}];
            //loading(false);
            let qry = {}

            if (search_ph != null) {
                qry.phone = search_ph
            }

            if (search_fn != null) {
                qry.fl_name = search_fn
            }

            vm.$schedsdk
                .getCustomerList(qry)
                .then((res) => {
                    //console.log("===== > res");
                    //console.log(res);
                    if (res.status == 1) {
                        vm.customer_option = res.data
                    } else {
                        vm.customer_option = [{first_name: '', last_name: ''}]
                    }

                    loading(false)
                })
                .catch((err) => {
                    //print_http_exception_details(err);
                    loading(false)
                    console.log('get Customer err')
                    console.log(err)
                })
        }, 400),
        getDisplayName(option) {
            let display_name = ''

            display_name = option.is_new
                ? option.first_name + ' (NEW) '
                : option.first_name + ' ' + option.last_name
            if (option.phone) {
                display_name += ' Ph: ' + option.phone
            }
            return display_name
        },
        bookWithOutEmailPhone() {
            if (this.book_without_email_phone == true) {
                this.is_email_readonly = true
                this.is_phone_readonly = true
                this.email =
                    this.$store.state.business_settings.business_info.business_email
                this.phone =
                    this.$store.state.business_settings.business_info.business_phone
            } else {
                this.is_email_readonly = false
                this.is_phone_readonly = false
                this.email = ''
                this.phone = ''
            }
        },

        fillCustomerDetail() {
            if (this.book_without_email_phone) {
                return
            }
            //console.log("==== this.customer  === ")
            //console.log(this.customer)
            //console.log(typeof this.customer)
            //console.log("==== this.customer  end")
            if (this.customer && typeof this.customer != 'string') {
                if (this.is_walkin_customer) {
                    this.first_name = this.walkin_customer_first_name
                    this.last_name = this.walkin_customer_last_name
                } else {
                    this.first_name = this.customer.first_name
                    this.last_name = this.customer.last_name
                }
                this.email = this.customer.email
                this.phone = this.customer.phone
                this.existing_customer_id = this._id
            }
            if (this.customer == null) {
                this.customer_option = []
                this.customer = ''
            }
        },
        onServiceListChange(services) {
            this.services = services
            this.checkForAdditionalServiceProviders(null)
        },
        isSvcMultiProvider(svci) {
            return (
                svci.requires_multi_providers !== undefined &&
                svci.requires_multi_providers == true &&
                svci.multi_providers_count > 1
            )
        },
        checkForAdditionalServiceProviders(d) {
            this.need_2nd_service_provider = false
            for (let i = 0; i < this.services.length; i++) {
                let svci = this.services[i]
                if (this.isSvcMultiProvider(svci)) {
                    this.need_2nd_service_provider = true
                    return
                }
            }
            this.need_2nd_service_provider = false
        },
        getProductsList() {
            return this.$schedsdk
                .get_products_list({product_name: '', page_no: 1})
                .then((result) => {
                    if (result.status == 1) {
                        this.products_option = result.data
                    }
                })
                .catch(console.error)
        },
        getServicesList() {
            this.$schedsdk.list_services({page_no: 1}).then((result) => {
                if (result.status == 1) {
                    this.services_option = result.data
                }
            })
        },
        onServiceHasFlexibleTime(e) {
            this.service_id_for_flex_dialog = e._id.toString()
            this.select_flex_time_options = e.selectable_times
            this.showSelectTime = true
        },
        getSelectedServiceDisplay(item) {
            if (item.flex_service_name) {
                return item.flex_service_name
            }
            return item.name
        },
        saveSelectTimeHandler() {
            //console.log("Saved clivked")
            //this.services[index]
            for (let i = 0; i < this.services.length; i++) {
                let svci = this.services[i]
                if (svci._id.toString() == this.service_id_for_flex_dialog) {
                    this.services[i].user_selected_flex_time = JSON.parse(
                        JSON.stringify(this.selected_flex_time_obj),
                    )
                    this.services[i].flex_service_name =
                        svci.name +
                        ' ' +
                        this.services[i].user_selected_flex_time.time +
                        ' mins'
                    this.hint_flex_service_change = true
                    break
                }
            }
            //console.log("Asdasd---a-sd-sad");
            //console.log(this.services);
            this.service_id_for_flex_dialog = ''
            this.showSelectTime = false
        },
        getProvidersList() {
            let user_type = this.$store.state.user_data.type;
            let user_id = this.$store.state.user_data._id;
            let userListPromise = null;

            if (user_type != 1 && user_type != 3) {
                userListPromise = this.$schedsdk.get_colleagues({ user_id });
            } else {
                userListPromise = this.$schedsdk.get_users_list({});
            }

            userListPromise.then((result) => {
                if (result.status == 1) {
                    this.provider_option = result.data
                }
                this.setupData()
            })
        },
        getCouponsList() {
            this.$schedsdk.getCouponsList({}).then((result) => {
                if (result.status == 1) {
                    this.coupon_list = result.data
                }
            })
        },
        cancelHandler() {
            let confirmed = confirm('Are you sure to cancel this booking')
            if (confirmed) {
                let data = {
                    booking_id: this.eventRecord.data.id,
                    service_order_id: this.eventRecord.data.service_order_id,
                }
                let updated_booking = null
                let is_new = false
                this.$schedsdk
                    .cancelBooking(data)
                    .then((result) => {
                        if (result.status == 1) {
                            this.operation_result_message = result.message
                            if (this.schedInst && this.eventRecord.data.id) {
                                this.schedInst.removeEvent([
                                    this.eventRecord.data.id,
                                ])
                            }
                            this.okDoneHandler()
                        }
                    })
                    .catch((ex) => {
                        if (ex.data && ex.data.message) {
                            this.operation_result_message = ex.data.message
                        } else {
                            this.operation_result_message = ex.message
                        }
                    })
                    .finally(() => {
                        this.show_cancel = false
                        this.operationCompletion(is_new, updated_booking)
                    })
            }
        },
        DoCheckAndOUpdateForPackageCoupon() {
            let updPackPromise = null
            let package_coupon_change = false
            let me = this

            //console.log(me.eventRecord.data.coupon)
            //console.log(this.selected_new_coupon_code)
            if (
                (me.eventRecord.data.coupon == null &&
                    this.selected_new_coupon_code != null) ||
                (this.selected_new_coupon_code == null &&
                    me.eventRecord.data.coupon != null &&
                    me.eventRecord.data.coupon.coupon_name != '') ||
                (me.eventRecord.data.coupon &&
                    this.selected_new_coupon_code &&
                    me.eventRecord.data.coupon.coupon_id !=
                        this.selected_new_coupon_code._id)
            ) {
                package_coupon_change = true
                //console.log(this.selected_new_coupon_code);
                //console.log(me.eventRecord.data.coupon);
                //console.log(" package_coupon_change " + package_coupon_change)
                //Adding a coupon.

                me.eventRecord.data.coupon = this.selected_new_coupon_code
                if (this.selected_new_coupon_code != null) {
                    me.eventRecord.data.coupon.coupon_id =
                        this.selected_new_coupon_code._id
                }
            }
            if (
                me.eventRecord.data.coupon_array &&
                this.selected_coupon_array
            ) {
                if (
                    me.eventRecord.data.coupon_array.length !=
                    this.selected_coupon_array.length
                ) {
                    package_coupon_change = true
                } else {
                    //Same length see if coupon was removed.
                    this.selected_coupon_array.forEach((sc) => {
                        if (sc.coupon_name == '') {
                            package_coupon_change = true
                            return false
                        }
                    })
                }
            }
            if (package_coupon_change) {
                let chd = {
                    order_number: me.eventRecord.data._id,
                    order_type: 'b',
                    coupon_array: me.selected_coupon_array,
                    operation: 1, //replace
                }

                if (this.selected_new_coupon_code) {
                    chd.coupon_array.push(this.selected_new_coupon_code)
                }
                updPackPromise = this.$schedsdk.POEditCoupons(chd)
            }
            return updPackPromise
        },
        DoRescheduleOrSaveProvider(prev_step_updated) {
            var me = this
            let updated_booking = null
            let is_new = false

            //console.log("Save Handler")
            //console.log(me.startDate)
            //console.log(me.startTime)
            //console.log("asdsad===> ", moment(me.startDate +' '+ me.startTime).valueOf())
            this.checkForAdditionalServiceProviders()
            let data = {
                first_name: me.first_name,
                last_name: me.last_name,
                email: me.email,
                phone: me.phone,
                services: me.services,
                is_walkin_customer: me.book_without_email_phone,
                is_walkin_booking: me.book_without_email_phone,
                service_start_date: moment(
                    me.startDate + ' ' + me.startTime,
                ).valueOf(),
                service_provider_id: me.service_provider._id,
                time_zone: me.$store.state.business_settings.business_time_zone,
                //cpn_pkg_code: me.cpn_pkg_code
            }
            if (data.is_walkin_customer) {
                data.walkin_customer_first_name = data.first_name
                data.walkin_customer_last_name = data.last_name
            }
            data.service_order_id = me.eventRecord.data.service_order_id
            delete data.id
            data._id = me.eventRecord.data.id
            //console.log(data)
            //console.log("Edit existing Event")
            // console.log(moment(me.eventRecord.data.startDate).valueOf())
            // console.log(data.service_start_date)
            let provider_change =
                data.service_provider_id == me.eventRecord.resourceId
                    ? false
                    : true
            let service_date_time_change = false
            if (me.eventRecord.edit_booking_flag == 1) {
                service_date_time_change =
                    data.service_start_date ==
                    me.eventRecord.data.service_start_date
                        ? false
                        : true
            } else {
                service_date_time_change =
                    data.service_start_date ==
                    moment(me.eventRecord.data.startDate).valueOf()
                        ? false
                        : true
            }
            // console.log(me.eventRecord.data.services)
            // console.log(data.services)
            let service_change = false
            if (me.hint_flex_service_change) {
                service_change = true
            } else if (
                me.eventRecord.data.services.length != data.services.length
            ) {
                service_change = true
            } else {
                let newly_added_multi_service = false
                let new_services = data.services.map((obj) => {
                    return obj._id
                })
                let existing_services = me.eventRecord.data.services.map(
                    (obj) => {
                        return obj._id
                    },
                )
                for (let i = 0; i < new_services.length; i++) {
                    if (existing_services.indexOf(new_services[i]) != -1) {
                        continue
                    } else {
                        service_change = true
                        if (this.isSvcMultiProvider(new_services[i])) {
                            newly_added_multi_service = true
                        }
                    }
                }
                if (newly_added_multi_service) {
                    //Don't allow
                    confirm(
                        'Adding multi provider service as a booking update is not supported.',
                    )
                    return
                }
            }

            let customer_update = false
            let customer_email_change = false
            let customer_phone_change = false
            if (me.eventRecord.data.first_name != data.first_name) {
                customer_update = true
            }
            if (me.eventRecord.data.last_name != data.last_name) {
                customer_update = true
            }
            //console.log(me.eventRecord.data.email)
            //console.log(data.email)
            if (me.eventRecord.data.email != data.email) {
                customer_email_change = true
            }
            if (me.eventRecord.data.phone != data.phone) {
                customer_phone_change = true
            }
            data.customer_update = customer_update
            data.customer_email_change = customer_email_change
            data.customer_phone_change = customer_phone_change
            //console.log(data)
            // console.log("Provider edited ",provider_change)
            // console.log("Time edited     ",service_date_time_change)
            // console.log("Service edited  ",service_change)
            if (
                customer_phone_change ||
                customer_email_change ||
                customer_update ||
                provider_change ||
                service_date_time_change ||
                service_change
            ) {
                //console.log("Asdasdasd")
                if (provider_change) {
                    data.new_service_provider_id = data.service_provider_id
                }
                // if(service_date_time_change){
                data.new_service_start_timestamp = data.service_start_date
                // }
                if (service_change) {
                    data.new_service_list = data.services
                    data.new_service_start_timestamp = data.service_start_date
                }
                //console.log(data)
                //console.log("Call reschedule booking")
                this.save_edit_disabled = true
                let keep_dialog_open = false
                me.$schedsdk
                    .rescheduleBooking(data)
                    .then((res) => {
                        //console.log("Event res edit ");
                        //console.log(res);
                        if (res.status == 1) {
                            updated_booking = res.booking_data
                        } else {
                            keep_dialog_open = true
                            me.show_error_result = true
                        }
                        this.operation_result_message = res.message
                        // this.discardHandler()
                    })
                    .catch((ex) => {
                        keep_dialog_open = true
                        me.show_error_result = true
                        if (ex.data && ex.data.message) {
                            this.operation_result_message = ex.data.message
                        } else {
                            this.operation_result_message = ex.message
                        }
                    })
                    .finally(() => {
                        this.operationCompletion(is_new, updated_booking)
                    })
            } else if (prev_step_updated) {
                this.operationCompletion(is_new, null)
            }
        },
        show_error_msg(error_msg) {
            this.operation_result_message = error_msg
            this.show_error_result = true
        },
        async saveHandler() {
            var me = this

            let updated_booking = null
            let is_new = false
            me.show_error_result = false
            me.operation_result_message = ''
            if (
                !me.eventRecord.data.service_order_id ||
                me.eventRecord.is_for_rebooking_flag
            ) {
                //console.log(" START TIME::   ", me.startDate , me.startTime)
                //console.log(" START TIMEM::  ",moment(me.startDate +' '+ me.startTime).valueOf())
                if (
                    me.startDate === me.startTime && // If both are same, it likely its the original value.
                    typeof me.startDate &&
                    !Number.isNaN(me.startDate)
                ) {
                    let localstartDate = moment_tz(me.startDate).format(
                        'YYYY-MM-DD',
                    )
                    let localstartTime = moment_tz(me.startDate).format('HH:mm') //Since date and time are same, use same
                    me.startDate = localstartDate
                    me.startTime = localstartTime
                    //console.log(" UPD START TIME::   ", me.startDate , me.startTime)
                    //console.log(" UPD START TIMEM::  ",moment(me.startDate +' '+ me.startTime).valueOf())
                }
                if (
                    !me.force_appointment &&
                    (me.service_provider == null || !me.service_provider._id)
                ) {
                    this.show_error_msg('Please select a provider')
                    return
                }
                let data = {
                    first_name: me.customer.first_name,
                    last_name: me.last_name,
                    email: me.email,
                    phone: me.phone,
                    is_walkin_customer: me.book_without_email_phone,
                    is_walkin_booking: me.book_without_email_phone,
                    services: me.services,
                    products: me.products,
                    service_start_date: moment(
                        me.startDate + ' ' + me.startTime,
                    ).valueOf(),
                    service_provider_id: me.service_provider?._id,
                    time_zone:
                        me.$store.state.business_settings.business_time_zone,
                    force_appointment: me.force_appointment,
                    is_rebooked_from: me.is_rebooked_from || null,
                    existing_customer_id: me.existing_customer_id || null,
                    //cpn_pkg_code: me.cpn_pkg_code
                }

                let additional_service_providers = []
                if (me.need_2nd_service_provider == true) {
                    if (
                        me.service_provider2 == null ||
                        me.service_provider2._id == null
                    ) {
                        confirm(
                            'The services selected need a 2nd provider. Please select 2nd provider.',
                        )
                        return
                    }
                    if (me.service_provider2._id == me.service_provider._id) {
                        confirm("Both service providers can't be the same.")
                        return
                    }
                    data.linked_booking_hard_link = true
                    additional_service_providers.push({
                        service_provider_id: me.service_provider2._id,
                        services: me.services,
                    })
                    data.additional_service_providers =
                        additional_service_providers
                } //end if 2nd providers
                //console.log("Add New Event")
                is_new = true
                if (data.is_walkin_customer) {
                    data.walkin_customer_first_name = data.first_name
                    data.walkin_customer_last_name = data.last_name
                    data.first_name = 'Walkin'
                    data.last_name = 'Customer'
                }
                data.requested_booking_type = 1
                this.save_edit_disabled = true
                let keep_dialog_open = false
                me.isShowWorking = true
                me.$schedsdk
                    .createBooking(data)
                    .then((res) => {
                        //console.log("Event res create ");
                        //console.log(res);
                        if (res.status == 1) {
                            updated_booking = res.data
                        } else {
                            keep_dialog_open = true
                        }
                        this.operation_result_message = res.message
                        // this.discardHandler()
                    })
                    .catch((ex) => {
                        console.log('Error...')
                        console.log(ex)
                        if (ex.data && ex.data.message) {
                            this.operation_result_message = ex.data.message
                        } else {
                            this.operation_result_message = ex.message
                        }
                        me.show_error_result = true

                        keep_dialog_open = true
                    })
                    .finally(() => {
                        this.operationCompletion(
                            is_new,
                            updated_booking,
                            keep_dialog_open,
                        )
                    })
            } else {
                let packupprom = this.DoCheckAndOUpdateForPackageCoupon()

                if (packupprom != null) {
                    packupprom.then((v) => {
                        //console.log("--s-s--s    " , v)
                        if (v && v.status == 1) {
                            this.operation_result_message = v.message
                        } else {
                            this.operation_result_message =
                                v.message || 'Failed operation'
                        }

                        me.DoRescheduleOrSaveProvider(true)
                    })
                } else {
                    me.DoRescheduleOrSaveProvider(false)
                }
            }
            // this.closeModal();
        }, // eo function saveHandler
        operationCompletion(is_new, updated_booking_obj, keep_open = false) {
            // calling this method updates also duration (resizes the event)
            //  let timezone = this.$store.state.business_settings.business_time_zone;
            this.hint_flex_service_change = false
            if (this.eventRecord.edit_booking_flag != 1) {
                let business_context = {
                    business_settings: this.$store.state.business_settings,
                }
                if (updated_booking_obj) {
                    let record = booking_helper.booking_to_bryn_event_record(
                        business_context,
                        updated_booking_obj,
                    )

                    try {
                        this.eventRecord = record
                        if (is_new) {
                            this.eventStore.add(this.eventRecord)
                        }
                    } catch (Ex) {
                        console.log('Error records')
                        console.log(Ex)
                        console.log(record)
                    }

                    this.show_spinner = false
                }
            }
            this.isShowWorking = false
            this.save_edit_disabled = false

            if (keep_open == false) {
                this.operation_completed = true
            }
        },
        finishOperation() {
            this.service_provider = null
            this.services = []
            this.services2 = []
            this.first_name = ''
            this.last_name = ''
            this.email = ''
            this.phone = ''
            this.service_provider2 = null
            this.need_2nd_service_provider = false
        },
        okDoneHandler() {
            this.finishOperation()
            if (this.operation_completed) {
                // generate an event.
                let eventName = 'AEV_BOOKING_CREATED';
                this.$skyEventListener.generateEvent(eventName);
            }
            this.operation_completed = false //TO allow further operatiosn later
            //this.editorShown = false;
            this.closeModal();
        },
        removeAppliedCoupon(index, coupon_name) {
            this.selected_coupon_array[index].coupon_name = ''
            this.selected_coupon_array[index].coupon_id = ''
        },
    }, // eo methods

    // computed : {
    //     editorShown : {
    //         get() {
    //             const
    //                 me = this,
    //                 eventRecord = me.eventRecord
    //             ;
    //             // we're opening so initialize data
    //             if(true === me.value)
    //             {

    //             }
    //             // we're closing so fire close event
    //             else if(false === me.value) {

    //                 this.$emit('close');
    //             }

    //             // return always Boolean
    //             return !!this.value;
    //         },
    //         // only runs on close
    //         set(value) {

    //             this.$emit('input', value);
    //         }
    //     } // eo editorShown
    // } // eo computed
} // eo export default
</script>

<!-- eof -->
