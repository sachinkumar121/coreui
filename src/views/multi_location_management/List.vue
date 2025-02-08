<template>
    <div class="pt-2">
        <Alerts
            :alertData="alertData"
            :show="showalerttime"
            @alertClosed="alertClosedFn"
            v-if="alert"
        />
        <div class="row controls-div">
            <div class="settings-text">Filter Options</div>
            <!-- <div class="col-md-2">
                    <label class="control-label"><b>Email/Phone</b></label>
                    <input 
                    v-model="search_email_phone"
                    class="form-control placeholder-no-fix" 
                    @keyup="getList()"
                    type="text" 
                    />
                </div> -->

            <div class="col-md-3">
                <label class="control-label"><b>Business Name</b></label>
                <input
                    v-model="search_business_name"
                    class="form-control placeholder-no-fix"
                    @keyup="getList()"
                    type="text"
                />
            </div>
            <!-- <div class="col-md-2">
                    <label class="control-label"><b>Owner Name (First Last)</b></label>
                    <input 
                    v-model="search_owner_name"
                    class="form-control placeholder-no-fix" 
                    @keyup="getList()"
                    type="text" 
                    />
                </div> -->
            <div class="col-md-4">
                <div class="mb-2">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="sort_by_signup_date_first"
                        @change="getList()"
                    />&nbsp;
                    <label class="control-label mb-0">
                        <b>Sort by signup date first</b>
                    </label>
                </div>
                <div>
                     <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="include_last_business_activity"
                        @change="getList()"
                    />&nbsp;
                    <label class="control-label mb-0">
                        <b>Include last activity</b>
                    </label>
                   <br />
                </div>
                <!-- <label class="control-label">
                        <b>Only with >30 day old last msg:</b>
                    </label>
                    <input  
                        type="checkbox"
                        v-model="last_text_message_30_days" 
                        @change="getList()"
                        />  -->
            </div>

            <div class="text-right col-md-5 justify-content-end d-flex align-items-center">
                <button
                    class="btn btn-success"
                    @click="$router.push('/multi_location/add')"
                >
                    Add New Location
                </button>
            </div>
        </div>
        <!-- <div class="row">
            <div class="col-md-2">
                <label class="control-label"><b>Searching...</b></label>
            </div>
        </div> -->
        <div >
            <br />
            <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <!-- <th>S.no</th> -->
                        <th>Location</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody v-if="list.length">
                    <tr v-for="item in list" :key="item._id">
                        <td>
                            <div>
                                <strong>{{ item.business_name }}</strong
                                ><br />
                                {{
                                    item.ml_owning_business_id == null
                                        ? 'MASTER LOCATION'
                                        : ''
                                }}<br />
                                Location:
                                {{
                                    item.ml_location_short_name == null
                                        ? item.business_name.substring(0, 20)
                                        : item.ml_location_short_name
                                }}

                                {{ getPhoneFormatted(item.business_phone, 'US')
                                }}<br />
                                {{ item.business_email }}<br />
                                {{ item.address_line1 }}<br />
                                {{ item.city }}, {{ item.state }} -
                                {{ item.zipcode }}<br />

                                Status:
                                {{ getBusinessStatusString(item.status) }} /
                                UID: {{ item.base_unique_string }}<br />
                                Web Booking:
                                <span v-html="getWebbookingStatus(item)"></span
                                ><br />
                                SMS/Texting: {{ getMessagingStatus(item) }}
                                <br />
                            </div>
                        </td>

                        <td>
                            <a :href="'#'" @click="openDetail(item._id)">
                                View
                            </a>
                            &nbsp;
                            <!-- <button type="button" 
                         @click="$router.push('/business/users/' + item._id)" 
                         class="btn btn-info btn-sm" >Users</button> &nbsp;
                    <button type="button" 
                         @click="openConfirmDelete(item._id)"  
                         class="btn btn-danger btn-sm" >Delete Location</button>  &nbsp; -->
                            <button
                                type="button"
                                @click="openConfirmSwitchInto(item)"
                                class="btn btn-danger btn-sm"
                            >
                                Switch into Location
                            </button>
                            &nbsp;
                            <button
                                type="button"
                                v-if="item.ml_owning_business_id != null"
                                @click="openConfirmCopyServices(item)"
                                class="btn btn-danger btn-sm"
                            >
                                Copy Services from Master Location
                            </button>
                            &nbsp;

                            <!-- <button type="button" 
                         @click="openConfirmProdSvcsDelete(item._id)"  
                         class="btn btn-danger btn-sm" >Delete all Prod.&amp;Svcs</button>  &nbsp; -->
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="10" class="text-center">
                            <div class="py-5">
                                <img
                                    src="/img/no-result.svg"
                                    alt=""
                                    class="img-empty"
                                />
                                <p class="h5 mt-4 d-block fw-normal">
                                    No Multi Locations Setup
                                </p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
            <Pagination class="mt-2"
                v-if="list.length"
                :size="'sm'"
                :ariaLabel="'Multi locations results pages'"
                :activePage.sync="page"
                :pages="pageCount"
                @update:activePage="setPage"
            />

            <CModal :visible="viewBusinessDetail">
                <CModalHeader>
                    <CModalTitle>Business Detail</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div class="row">
                        <div class="col-md-5">Name</div>
                        <div class="col-md-7">
                            {{ business_name }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-5">Email</div>
                        <div class="col-md-7">
                            <span class="text-break">{{ business_email }}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-5">Phone</div>
                        <div class="col-md-7">
                            {{ business_phone }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-5">Max. Employees</div>
                        <div class="col-md-7">
                            {{ no_of_employees }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-5">New Business Wizard Offered?</div>
                        <div class="col-md-7">
                            {{ nb_wizard_was_offered }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-5">
                            New Business Wizard Completed?
                        </div>
                        <div class="col-md-7">
                            {{ nb_wizard_was_completed }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-5">New Business Wizard Skipped?</div>
                        <div class="col-md-7">
                            {{ nb_wizard_was_skipped }}
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-5">User updated</div>
                        <div class="col-md-7">
                            {{ last_activity.user_updated }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-5">User login</div>
                        <div class="col-md-7">
                            {{ last_activity.user_login }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-5">Last booking</div>
                        <div class="col-md-7">
                            {{ last_activity.booking_created }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-5">Last message sent</div>
                        <div class="col-md-7">
                            {{ last_activity.last_msg_sent_received }}
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton @click="viewBusinessDetail = false"> OK </CButton>
                </CModalFooter>
            </CModal>
            <CModal :visible="confirmBusinessDelete">
                <CModalHeader>
                    <CModalTitle>Confirm Business Delete</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div class="row">
                        <div class="col-md-2"></div>
                        <div class="col-md-4">UID</div>
                        <div class="col-md-4">
                            <input
                                v-model="confirm_delete_uid"
                                class="form-control placeholder-no-fix"
                                type="text"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-2"></div>
                        <div class="col-md-4">Confirm</div>
                        <div class="col-md-6">
                            <input type="checkbox" v-model="confirm_delete" />
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton @click="confirmBusinessDelete = false" color="info"
                        >Cancel</CButton
                    >
                    <CButton
                        @click="performbusinessdelete"
                        color="danger"
                        :disabled="confirm_delete == false"
                        >Delete</CButton
                    >
                </CModalFooter>
            </CModal>

            <CModal :visible="showProdAndServicesDelete">
                <CModalHeader>
                    <CModalTitle
                        >Confirm Delete all Products and Services</CModalTitle
                    >
                </CModalHeader>
                <CModalBody>
                    <div class="row">
                        <div class="col-md-12">
                            This deletes all products, services, and categories.
                            It is not recoverable.
                        </div>
                        <div class="col-md-12">&nbsp;</div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">Type 'yes'</div>
                        <div class="col-md-4">
                            <input
                                v-model="confirm_delete_uid"
                                class="form-control placeholder-no-fix"
                                type="text"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">Reason for delete</div>
                        <div class="col-md-8">
                            <input
                                v-model="prod_service_delete_reason"
                                class="form-control placeholder-no-fix"
                                type="text"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">Confirm</div>
                        <div class="col-md-6">
                            <input type="checkbox" v-model="confirm_delete" />
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton
                        @click="showProdAndServicesDelete = false"
                        color="info"
                        >Cancel</CButton
                    >
                    <CButton
                        @click="performProductsServicesdelete"
                        color="danger"
                        :disabled="confirm_delete == false"
                        >Delete</CButton
                    >
                </CModalFooter>
            </CModal>

            <CModal :visible="showConfirmOperation">
                <CModalHeader>
                    <CModalTitle>Confirm Operation</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div class="row">
                        <div class="col-md-2"></div>
                        <div class="col-md-8">
                            {{ confirm_operation_title }}<br />
                            {{ confirm_operation_description }}
                        </div>
                    </div>
                    <br />
                    <div class="row">
                        <div class="col-md-2"></div>
                        <div class="col-md-4">Confirm Operation</div>
                        <div class="col-md-6">
                            <input
                                type="checkbox"
                                v-model="confirm_operation_chkbx"
                            />
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton @click="showConfirmOperation = false" color="info"
                        >Cancel</CButton
                    >
                    <CButton
                        @click="performConfirmedOperation"
                        color="danger"
                        :disabled="confirm_operation_chkbx == false"
                        >Confirm</CButton
                    >
                </CModalFooter>
            </CModal>

            <CModal :visible="show_change_plan">
                <CModalHeader>
                    <CModalTitle>Change Subscription Plan</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div class="row">
                        <div class="col-md-4">Current Plan</div>
                        <div class="col-md-8">
                            <label> {{ subscribe.current_plan_string }}</label>
                        </div>
                    </div>
                    <br />

                    <div class="row">
                        <div class="col-md-4">Select new plan</div>
                        <div class="col-md-8">
                            <select
                                class="form-control col-sm-8"
                                v-model="subscribe.new_plan_obj"
                            >
                                <option
                                    v-bind:key="opt.plan_name"
                                    v-for="opt in subscribe.available_plans"
                                    :selected="
                                        opt.display_index ==
                                        subscribe.current_plan
                                            ? true
                                            : false
                                    "
                                    :value="opt.display_index"
                                >
                                    {{ opt.plan_name }} ({{
                                        opt.display_index
                                    }})
                                </option>
                            </select>
                        </div>
                    </div>
                    <br />
                    <div class="row">
                        <div class="col-md-4">Reason for change</div>
                        <div class="col-md-8">
                            <input
                                v-model="subscribe.plan_change_reason"
                                class="form-control placeholder-no-fix"
                                type="text"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12" color="danger">
                            <b> {{ error_message }}</b>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton @click="changePlan()" color="success"
                        >Confirm</CButton
                    >
                    <CButton @click="show_change_plan = false" color="danger"
                        >Cancel</CButton
                    >
                </CModalFooter>
            </CModal>

            <CModal :visible="grace_credits_obj.show_add_grace_credits">
                <CModalHeader>
                    <CModalTitle>Add grace message credits</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div class="row">
                        <div class="col-md-6">How many credits? (upto 10)</div>
                        <div class="col-md-6">
                            <input
                                v-model="grace_credits_obj.grace_credits"
                                class="form-control placeholder-no-fix"
                                type="text"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">Reason for grace credits</div>
                        <div class="col-md-6">
                            <input
                                v-model="grace_credits_obj.update_reason"
                                class="form-control placeholder-no-fix"
                                type="text"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12" color="danger">
                            <b> {{ error_message }}</b>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton @click="addGraceMessageCredits()" color="success"
                        >Confirm</CButton
                    >
                    <CButton
                        @click="
                            grace_credits_obj.show_add_grace_credits = false
                        "
                        color="danger"
                        >Cancel</CButton
                    >
                </CModalFooter>
            </CModal>

            <CModal :visible="showDone">
                <CModalHeader>
                    <CModalTitle>Done</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div class="row">
                        <div class="col-md-8">
                            {{ done_response }}
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton @click="closeShowdone" color="info">Ok</CButton>
                </CModalFooter>
            </CModal>
        </div>
    </div>
</template>

<script>
import Pagination from '@/common/Pagination'
import PhoneNumber from 'awesome-phonenumber'
import login_helper from '../../helpers/login_helper'
import moment from 'moment'

import AppHelper from '../../helpers/app_helper'
import {debounce as lodash_debounce} from 'lodash'
import Alerts from '../Alerts'
import '../../assets/css/common.css'
export default {
    name: 'Business List',
    components: {Pagination, Alerts},
    data() {
        return {
            alert: false,
            showalerttime: 0,
            alertData: {
                message: '',
                type: '',
            },
            sort_by_signup_date_first: true,
            include_last_business_activity: false,
            last_text_message_30_days: false,
            business_id_for_deletion: '',
            confirm_delete_uid: '',
            confirm_delete: 0,
            confirmBusinessDelete: false,
            showProdAndServicesDelete: false,
            prod_service_delete_reason: '',
            showConfirmOperation: false,
            confirm_operation_user_proceeded: false,
            confirm_operation_chkbx: false,
            confirm_operation_id: '',
            confirm_operation_title: '',
            confirm_operation_description: '',
            confirm_operation_data: null,
            list: [],
            search: '',
            search_business_name: '',
            search_email_phone: '',
            search_owner_name: '',
            page: 1,
            pageCount: 1,
            viewBusinessDetail: false,
            business_name: '',
            business_email: '',
            business_phone: '',
            no_of_employees: 0,
            nb_wizard_was_offered: false,
            nb_wizard_was_completed: false,
            nb_wizard_was_skipped: false,
            last_activity: {
                user_updated: null,
                user_login: null,
                booking_created: null,
                last_msg_channel: null,
                last_msg_sent_received: null,
            },

            show_change_plan: false,
            subscribe: {
                business_id: '',
                plan_change_reason: '',
                new_plan_obj: '',
                current_plan: '',
                current_plan_string: '',
                available_plans: [],
            },
            showDone: false,
            done_response: '',
            error_message: '',
            grace_credits_obj: {
                show_add_grace_credits: false,
                business_id: '',
                update_reason: '',
                grace_credits: '',
            },
        }
    },
    created() {
        this.getList()
    },
    methods: {
        changeView(user_id, business_id) {
            // console.log(user_id)
            // console.log(business_id)
            let thisRef = this
            thisRef.$schedsdk
                .adminImpersonate({
                    new_business_id: business_id,
                    new_user_id: user_id,
                })
                .then((result) => {
                    if (result.status == 1) {
                        thisRef.$schedsdk
                            .apply_identity_token(result, {
                                email: '',
                                password: '',
                            })
                            .then((response) => {
                                login_helper.complete_new_login(
                                    thisRef.$schedsdk,
                                    result.data,
                                    thisRef.$store,
                                    thisRef.$appchatobj,
                                )
                                thisRef.$router.push('/dashboard')
                            })
                    }
                })
        },
        redirectToOwnerAsSuperOrgCustomer(business_user_id) {
            this.$schedsdk
                .getSuperOrgCustomerId(business_user_id)
                .then((result) => {
                    if (result.status != 1) {
                        this.alertFailure('Failed: ' + (result.message || ''))
                    } else {
                        this.$router.push('/customers/messages/' + result.data)
                    }
                })

            //$router.push()
        },
        getBusinessStatusString(st) {
            switch (st) {
                case 1:
                    return 'OK (' + st + ')'
                case 10:
                    return 'Restricted. (' + st + ')'
                case 20:
                    return 'Blocked. (' + st + ')'
                case 30:
                    return 'Deactivated. (' + st + ')'
                default:
                    return 'Unknown.  (' + st + ')'
            }
        },
        getWebbookingStatus(item) {
            let settings = item.settings_data
            if (settings && settings.length > 0) {
                let sd = settings[0]
                if (sd.allow_website_bookings == true) {
                    //enabled
                    return (
                        "<a href='" +
                        AppHelper.get_online_booking_url(this.$store.state.skysched_global_api_base_url, sd) +
                        "' target=_blank>Enabled</a>"
                    )
                } else {
                    return 'Disabled'
                }
            }
            return 'NA'
        },
        getMessagingStatus(item) {
            let settings = item.settings_data
            let last_activity = item.last_business_activity || null
            let last_msg = ''
            if (last_activity) {
                if (last_activity.last_msg_sent_received) {
                    let d1 = new Date(last_activity.last_msg_sent_received)
                    let d2 = new Date()
                    let t2 = d2.getTime()
                    let t1 = d1.getTime()
                    let diff = parseInt((t2 - t1) / (24 * 3600 * 1000))
                    last_msg = '' + diff + ' days'
                    if (diff >= 30) {
                        last_msg += '+'
                    }
                }
            }
            if (settings && settings.length > 0) {
                let sd = settings[0]
                let resstr = ''

                if (
                    sd.business_messaging_settings &&
                    sd.business_messaging_settings
                        .enable_business_customer_text_sms == true
                ) {
                    resstr = 'Enabled'
                } else {
                    resstr = 'Disabled'
                }
                if (last_msg != '') {
                    resstr += ' (' + last_msg + ')'
                }
                return resstr
            }
            return 'NA'
        },
        getPhoneFormatted(phone, country_code = 'US') {
            if (phone == null) {
                return null
            }
            var pn = new PhoneNumber(phone, {regionCode: country_code})
            if (pn.isValid()) {
                return pn.getNumber('national')
            }
            return null
        },
        findBusinessInList(business_id) {
            let bd = null
            this.list.forEach((business) => {
                //console.log(pay)
                if (business._id == business_id) {
                    bd = business
                    return
                }
            })
            return bd
        },
        setAndOpen(binfo) {
            this.business_name = binfo.business_name
            this.business_email = binfo.business_email
            this.business_phone = binfo.business_phone
            this.no_of_employees = binfo.no_of_employees

            if (binfo.settings_data && binfo.settings_data.length) {
                let sd = binfo.settings_data[0]
                this.nb_wizard_was_offered =
                    sd.business_setup_wizard_date_offered > 0
                this.nb_wizard_was_completed =
                    sd.has_completed_business_setup_wizard
                this.nb_wizard_was_skipped = sd.business_setup_wizard_skipped
            }
            //this.viewBusinessDetail = true
            this.viewBusinessDetail = true
            this.$schedsdk
                .get_business_last_activity(binfo._id)
                .then((result) => {
                    if (result.status == 1) {
                        this.last_activity = result.data
                    }
                })
                .finally(() => {})
        },
        openDetail(business_id) {
            let bd = this.findBusinessInList(business_id)
            if (bd != null) {
                this.setAndOpen(bd)
            } else {
                this.business_name = 'Business Info Not Found ++'
                this.viewBusinessDetail = true
            }
        },
        changePlan() {
            let mythis = this
            mythis.show_change_plan = false
            console.log(this.subscribe.new_plan_obj)
            this.done_response = 'Waiting for response'
            this.showDone = true

            this.$schedsdk
                .changeAppPlanLevel({
                    business_id: this.subscribe.business_id,
                    new_plan_level: this.subscribe.new_plan_obj,
                    update_reason: this.subscribe.plan_change_reason,
                })
                .then((result) => {
                    mythis.done_response = result.message
                    if (result.status == 1) {
                        mythis.getList()
                    }
                })
                .finally(() => {})
        },
        openChangePlan(item) {
            this.subscribe.available_plans = []
            this.subscribe.business_id = item._id
            this.show_change_plan = false
            this.error_message = ''
            let mythis = this
            mythis.subscribe.current_plan_string = ''
            this.$schedsdk
                .get_available_subscription_plans({
                    business_id: item._id,
                    country: item.country,
                })
                .then((result) => {
                    if (result.status == 1) {
                        for (let i = 0; i < result.data.plan_arr.length; i++) {
                            if (
                                result.data.plan_arr[i].display_index ==
                                item.current_plan_level
                            ) {
                                mythis.subscribe.current_plan =
                                    +item.current_plan_level
                                mythis.subscribe.current_plan_string =
                                    result.data.plan_arr[i].plan_name +
                                    '(' +
                                    result.data.plan_arr[i].display_index +
                                    ')'
                            }
                            if (result.data.plan_arr[i].display_index < 30) {
                                mythis.subscribe.available_plans.push(
                                    result.data.plan_arr[i],
                                )
                            }
                        }
                        mythis.show_change_plan = true
                    } else {
                        mythis.show_change_plan = false
                        this.done_response = result.message
                        this.showDone = true
                    }
                })
                .finally(() => {})
        },
        closeShowdone() {
            this.showDone = false
        },
        openAddGraceMessageCredits(item) {
            this.error_message = ''
            console.log(item._id)
            this.grace_credits_obj.business_id = item._id
            this.grace_credits_obj.show_add_grace_credits = false
            let mythis = this
            mythis.grace_credits_obj.grace_credits = ''
            mythis.grace_credits_obj.update_reason = ''
            this.grace_credits_obj.show_add_grace_credits = true
        },
        addGraceMessageCredits() {
            let mythis = this
            this.done_response = 'Waiting for response'
            this.grace_credits_obj.show_add_grace_credits = false
            this.showDone = true

            this.$schedsdk
                .addGraceMessageCredits({
                    business_id: this.grace_credits_obj.business_id,
                    grace_credits: this.grace_credits_obj.grace_credits,
                    update_reason: this.grace_credits_obj.update_reason,
                })
                .then((result) => {
                    mythis.done_response = result.message
                    if (result.status == 1) {
                        mythis.getList()
                    }
                })
                .finally(() => {})
        },
        openConfirmCopyServices(item) {
            //
            let co = confirm('Confirm copy services from master location?.')
            if (co) {
                let data = {
                    target_business_id: item._id,
                    src_business_id: item.ml_owning_business_id,
                    item_type: 'services',
                }
                this.$schedsdk
                    .multi_location_copy_items_from_business(data)
                    .then((result) => {
                        if (result.status == 1) {
                            this.alertSuccess('Copy successfully complete')
                        } else {
                            this.alertFailure(
                                'Failed ' + (result.message || ''),
                            )

                            console.log('Errorr deleteing...')
                            console.log(result)
                        }
                    })
            }
        },
        openConfirmSwitchInto(item) {
            let thisRef = this
            let co = confirm(
                'Confirm switch into location ' +
                    item.business_name +
                    '?.' +
                    '\nTo exit and return back, click on the profile on top right and click Exit Location',
            )
            if (co) {
                //
                let data = {new_business_id: item._id}
                this.$schedsdk
                    .multi_location_switch_location(data)
                    .then((result) => {
                        if (result.status == 1) {
                            this.alertSuccess('Switch complete')
                            console.log(result)
                            // this.$router.push({name: 'Job Process Status', params: { rec_id: result.job_process_id } });
                            thisRef.$schedsdk
                                .apply_identity_token(result, {
                                    email: '',
                                    password: '',
                                })
                                .then((response) => {
                                    login_helper.complete_new_login(
                                        thisRef.$schedsdk,
                                        result.data,
                                        thisRef.$store,
                                    )
                                    thisRef.$router.push('/dashboard')
                                })
                        } else {
                            this.alertFailure(
                                'Failed ' + (result.message || ''),
                            )

                            console.log('Errorr deleteing...')
                            console.log(result)
                        }
                    })
            }
        },
        openConfirmDelete(business_id) {
            ;(this.business_id_for_deletion = business_id),
                (this.confirm_delete_uid = ''),
                (this.confirm_delete = 0),
                (this.confirmBusinessDelete = true)
        },
        openConfirmProdSvcsDelete(business_id) {
            ;(this.business_id_for_deletion = business_id),
                (this.confirm_delete_uid = ''),
                (this.confirm_delete = 0),
                (this.showProdAndServicesDelete = true)
        },

        openConfirmOperation(business_id, operation_id) {
            this.confirm_operation_id = operation_id
            switch (this.confirm_operation_id) {
                case 'release_phone':
                    this.confirm_operation_title =
                        'Disable text and Release Phone'
                    this.confirm_operation_description = '<br>'
                    this.confirm_operation_data = {business_id: business_id}
                    break

                default:
                    this.confirm_operation_title = 'unknown operation'
                    break
            }

            this.showConfirmOperation = true
        },
        alertClosedFn() {
            this.alert = false
            this.showalerttime = 0
        },
        alertSuccess(msg) {
            this.alertData = {
                message: msg,
                type: 'success', // success, danger
            }
            this.alert = true
            this.showalerttime = 4
        },
        alertFailure(msg) {
            this.alertData = {
                message: msg,
                type: 'danger', // success, danger
            }
            this.alert = true
            this.showalerttime = 8
        },
        performConfirmedOperation() {
            //console.log("performConfirmedOperation in ...")
            //console.log(this.confirm_operation_id)
            //console.log(this.confirm_operation_chkbx)
            let data = this.confirm_operation_data

            switch (this.confirm_operation_id) {
                case 'release_phone':
                    if (data) {
                        this.disabletextReleasephone(data.business_id)
                    }
                    break
                default:
                    this.confirm_operation_title = 'unknown operation'
                    break
            }

            this.confirm_operation_data = null

            this.showConfirmOperation = false
        },
        disabletextReleasephone(business_id) {
            let data = {business_id: business_id, release_confirmation: 'yes'}
            this.$schedsdk
                .disableAndReleaseTextMessaging(data)
                .then((result) => {
                    if (result.status == 1) {
                        this.alertSuccess('Released phone ')
                        console.log(result)
                        // this.$router.push({name: 'Job Process Status', params: { rec_id: result.job_process_id } });
                    } else {
                        this.alertFailure('failed ' + (result.message || ''))

                        console.log('Errorr deleteing...')
                        console.log(result)
                    }
                })
        },
        performProductsServicesdelete() {
            let data = {
                business_id: this.business_id_for_deletion,
                confirm_text: this.confirm_delete_uid,
                delete_reason: this.prod_service_delete_reason,
            }
            this.$schedsdk
                .delete_all_products_and_services(data)
                .then((result) => {
                    if (result.status == 1) {
                        this.alertSuccess('Delete successful')
                    } else {
                        this.alertFailure('Failed: ' + (result.message || ''))
                    }
                })
            this.showProdAndServicesDelete = false
        },

        performbusinessdelete() {
            console.log(this.business_id_for_deletion)
            console.log(this.confirm_delete_uid)
            console.log(this.confirm_delete)

            let data = {
                target_business_id: this.business_id_for_deletion,
                target_business_unique_id: this.confirm_delete_uid,
            }
            this.$schedsdk.delete_all_business_recs(data).then((result) => {
                if (result.status == 1) {
                    console.log(result)
                    this.$router.push({
                        name: 'Job Process Status',
                        params: {rec_id: result.job_process_id},
                    })
                } else {
                    console.log('Errorr deleteing...')
                    console.log(result)
                }
            })
            this.confirmBusinessDelete = false
        },
        performcopyowners(business_id) {
            let data = {business_id: business_id}
            //data.business_id = null; //all oners one time operations
            this.$schedsdk.copyOrgEmpUsersToSuperOrg(data).then((result) => {
                if (result.status != 1) {
                    console.log('Errorr copying...')
                    console.log(result)
                }
            })
        },
        debGetList: lodash_debounce((context) => {
            context.$schedsdk
                .getMultiLocationList(
                    context.search_owner_name,
                    context.search_business_name,
                    context.search_email_phone,
                    context.page,
                    context.sort_by_signup_date_first,
                    context.include_last_business_activity,
                    context.last_text_message_30_days ? 30 : 0,
                )
                .then((result) => {
                    console.log('Asdasdasd----get...')
                    console.log(result.data)
                    context.list = result.data
                    context.pageCount = result.total_pages
                })
                .catch((Ex) => {
                    login_helper.checkSessionExpiryAndRedirectToLogin(
                        Ex,
                        context.$schedsdk,
                        context.$router,
                    )
                })
        }, 400),

        getList() {
            this.debGetList(this)
        },
        setPage(pageNo) {
            // console.log('pageNo')
            // console.log(pageNo)
            this.page = pageNo
            this.getList()
        },
    },
}
</script>
