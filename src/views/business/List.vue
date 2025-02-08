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
            <div class="col-md-3">
                <label class="control-label"><b>Email/Phone</b></label>
                <input
                    v-model="search_email_phone"
                    class="form-control placeholder-no-fix"
                    @keyup="getList()"
                    type="text"
                />
            </div>
            <div class="col-md-3">
                <label class="control-label"><b>Business Name</b></label>
                <input
                    v-model="search_business_name"
                    class="form-control placeholder-no-fix"
                    @keyup="getList()"
                    type="text"
                />
            </div>
            <div class="col-md-3">
                <label class="control-label"
                    ><b>Owner Name (First Last)</b></label
                >
                <input
                    v-model="search_owner_name"
                    class="form-control placeholder-no-fix"
                    @keyup="getList()"
                    type="text"
                />
            </div>
            <div class="col-md-3">
                <input
                    type="checkbox"
                    v-model="sort_by_signup_date_first"
                    @change="getList()"
                />&nbsp;
                <label class="control-label">
                    <b>Sort by signup date first</b>
                </label>
                <br/>
                <input
                    type="checkbox"
                    v-model="include_last_business_activity"
                    @change="getList()"
                />
                <label class="control-label">
                    <b>Include last activity</b>
                </label>
                
                <br />
                <button
                    type="button"
                    @click="$router.push('/business/geo')"
                    class="btn btn-primary btn-sm"
                >
                    Map View
                </button>
                <!-- <label class="control-label">
                        <b>Only with >30 day old last msg:</b>
                    </label>
                    <input
                        type="checkbox"
                        v-model="last_text_message_30_days"
                        @change="getList()"
                        />  -->
            </div>
        </div>
        <div class="row">
            <div class="col-md-2">
                <label class="control-label"><b>Searching...</b></label>
            </div>
        </div>
        <div class="table-responsive">
            <br />
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <!-- <th>S.no</th> -->
                        <th>Business</th>
                        <th>Owner Detail</th>
                        <th>Platform</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody v-if="list.length">
                    <tr v-for="item in list" :key="item._id">
                        <td>
                            <div>
                                <strong>{{ item.business_name }}</strong
                                ><br />
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
                                Multi Location:
                                {{
                                    item.ml_business_group_code
                                        ? item.ml_business_group_code
                                        : 'No'
                                }}<br />
                                Partner Org:
                                {{ item.business_type != 3 ? 'No' : 'Yes' }}
                            </div>
                        </td>

                        <td v-if="item.owner_data.length">
                            <div
                                v-for="owner in item.owner_data"
                                :key="owner._id"
                            >
                                <strong
                                    >{{ owner.first_name }}
                                    {{ owner.last_name }}</strong
                                >
                                <br />
                                {{ getPhoneFormatted(owner.phone, 'US') }}
                                <a
                                    href="javascript:void(0)"
                                    v-if="owner.allow_text_sms_contact == true"
                                    @click.prevent="
                                        redirectToOwnerAsSuperOrgCustomer(
                                            owner._id,
                                        )
                                    "
                                    >TXT</a
                                ><br />
                                {{ owner.email }}<br />
                                <button
                                    type="button"
                                    @click="changeView(owner._id, item._id)"
                                    class="btn btn-primary btn-sm"
                                >
                                    Change View
                                </button>
                            </div>
                        </td>
                        <td v-else>No Owners (Problem)</td>
                        <td>{{ item.other_info[0] }}</td>
                        <td>
                            <a :href="'#'" @click="openDetail(item._id)">
                                View
                            </a>
                            &nbsp;
                            <button
                                type="button"
                                v-if="item.business_type != 3"
                                @click="makeBusinessAsPartner(item._id)"
                                class="btn btn-primary btn-sm"
                            >
                                Convert to Partner Business
                            </button>
                            <button
                                type="button"
                                v-else
                                @click="makeAsRegularBusiness(item._id)"
                                class="btn btn-primary btn-sm"
                            >
                                Convert to Regular Business
                            </button>

                            &nbsp;
                            <button
                                type="button"
                                @click="
                                    $router.push('/business/detail/' + item._id)
                                "
                                class="btn btn-primary btn-sm"
                            >
                                Detail
                            </button>
                            &nbsp;
                            <button
                                type="button"
                                @click="
                                    $router.push('/business/users/' + item._id)
                                "
                                class="btn btn-info btn-sm"
                            >
                                Users
                            </button>
                            &nbsp;
                            <button
                                type="button"
                                @click="openConfirmDelete(item._id)"
                                class="btn btn-danger btn-sm"
                            >
                                Delete Business
                            </button>
                            &nbsp;

                            <button
                                type="button"
                                @click="performcopyowners(item._id)"
                                class="btn btn-primary btn-sm"
                            >
                                Copy Owners
                            </button>
                            &nbsp;

                            <button
                                type="button"
                                @click="
                                    openLinkMLBusinessLocations(
                                        item.base_unique_string,
                                    )
                                "
                                class="btn btn-primary btn-sm"
                            >
                                Link Locations
                            </button>
                            &nbsp;

                            <button
                                type="button"
                                @click.prevent="
                                    $router.push(
                                        '/app_logs/business/' + item._id,
                                    )
                                "
                                class="btn btn-info btn-sm bg-darken-2"
                            >
                                Logs
                            </button>
                            &nbsp;
                            <button
                                type="button"
                                v-if="business_type != 3"
                                @click="
                                    openConfirmOperation(
                                        item._id,
                                        'release_phone',
                                    )
                                "
                                class="btn btn-danger btn-sm"
                            >
                                Release Phone
                            </button>
                            &nbsp;
                            <button
                                type="button"
                                v-if="business_type != 3"
                                @click="openChangePlan(item)"
                                class="btn btn-info btn-sm"
                            >
                                Change Plan
                            </button>
                            &nbsp;
                            <button
                                type="button"
                                @click="openConfirmProdSvcsDelete(item._id)"
                                class="btn btn-danger btn-sm"
                            >
                                Delete all Prod.&amp;Svcs
                            </button>
                            &nbsp;
                            <button
                                type="button"
                                v-if="business_type != 3"
                                @click="openAddGraceMessageCredits(item)"
                                class="btn btn-warning btn-sm"
                            >
                                Add Grace Credits
                            </button>
                            &nbsp;

                            <button
                                type="button"
                                @click="openExecuteVerifyBusiness(item)"
                                class="btn btn-danger btn-sm"
                            >
                                Reverify Business
                            </button>
                            &nbsp;
                            <button
                                type="button"
                                v-if="business_type != 3"
                                @click="getAppSystemLogs(item)"
                                class="btn btn-danger btn-sm"
                            >
                                TEST: systemLogs
                            </button>
                            &nbsp;
                            <button
                                type="button"
                                @click="toggleBookingLogs(item)"
                                class="btn btn-warning btn-sm"
                            >
                                Toggle booking logs
                            </button>
                            &nbsp;
                            <button
                                type="button"
                                @click="openDisableSetupWizard(item)"
                                class="btn btn-info btn-sm"
                            >
                                Disable Setup Wizard
                            </button>
                            &nbsp;
                            <button
                                type="button"
                                @click="openConfirmAllCustomerDelete(item._id)"
                                class="btn btn-danger btn-sm"
                            >
                                Delete all Customers
                            </button>
                            &nbsp;
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
                                    No Business Exists
                                </p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination
                v-if="list.length"
                :size="'sm'"
                :ariaLabel="'Business results pages'"
                :activePage.sync="page"
                :pages="pageCount"
                @update:activePage="setPage"
            />
        </div>
        <CModal :visible="viewBusinessDetail">
            <CModalHeader>
                <CModalTitle
                    >Business Detail</CModalTitle
                ></CModalHeader
            >
            <CModalBody>
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-4">Name</div>
                    <div class="col-md-4">
                        {{ business_name }}
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-4">Email</div>
                    <div class="col-md-6">
                        <p class="mb-0 break-all">
                            {{ business_email }}
                        </p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-4">Phone</div>
                    <div class="col-md-6">
                        {{ business_phone }}
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-4">No of Employees</div>
                    <div class="col-md-6">
                        {{ no_of_employees }}
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-6">
                        New Business Wizard Offered?
                    </div>
                    <div class="col-md-2">
                        {{ nb_wizard_was_offered }}
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-6">
                        New Business Wizard Completed?
                    </div>
                    <div class="col-md-2">
                        {{ nb_wizard_was_completed }}
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-6">
                        New Business Wizard Skipped?
                    </div>
                    <div class="col-md-2">
                        {{ nb_wizard_was_skipped }}
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-4">User updated</div>
                    <div class="col-md-6">
                        {{ last_activity.user_updated }}
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-4">User login</div>
                    <div class="col-md-6">
                        {{ last_activity.user_login }}
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-4">Last booking</div>
                    <div class="col-md-6">
                        {{ last_activity.booking_created }}
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-4">
                        Last message sent
                    </div>
                    <div class="col-md-6">
                        {{
                            last_activity.last_msg_sent_received
                        }}
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="viewBusinessDetail = false">
                    OK
                </CButton>
            </CModalFooter>
        </CModal>
        <CModal :visible="confirmBusinessDelete">
            <CModalHeader>
                <CModalTitle
                    >Confirm Business Delete</CModalTitle
                >
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
                        <input
                            type="checkbox"
                            v-model="confirm_delete"
                        />
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton
                    @click="confirmBusinessDelete = false"
                    color="info"
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
                    >Confirm Delete all Products and
                    Services</CModalTitle
                >
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    <div class="col-md-12">
                        This deletes all products, services, and
                        categories. It is not recoverable.
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
                    <div class="col-md-4">
                        Reason for delete
                    </div>
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
                        <input
                            type="checkbox"
                            v-model="confirm_delete"
                        />
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
                    <div class="col-md-4">
                        Confirm Operation
                    </div>
                    <div class="col-md-6">
                        <input
                            type="checkbox"
                            v-model="confirm_operation_chkbx"
                        />
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton
                    @click="showConfirmOperation = false"
                    color="info"
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
                <CModalTitle
                    >Change Subscription Plan</CModalTitle
                >
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    <div class="col-md-4">Current Plan</div>
                    <div class="col-md-8">
                        <label>
                            {{
                                subscribe.current_plan_string
                            }}</label
                        >
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
                    <div class="col-md-4">
                        Reason for change
                    </div>
                    <div class="col-md-8">
                        <input
                            v-model="
                                subscribe.plan_change_reason
                            "
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
                <CButton
                    @click="show_change_plan = false"
                    color="danger"
                    >Cancel</CButton
                >
            </CModalFooter>
        </CModal>

        <CModal
            :visible="grace_credits_obj.show_add_grace_credits"
        >
            <CModalHeader>
                <CModalTitle
                    >Add grace message credits</CModalTitle
                >
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    <div class="col-md-6">
                        How many credits? (upto 10)
                    </div>
                    <div class="col-md-6">
                        <input
                            v-model="
                                grace_credits_obj.grace_credits
                            "
                            class="form-control placeholder-no-fix"
                            type="text"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        Reason for grace credits
                    </div>
                    <div class="col-md-6">
                        <input
                            v-model="
                                grace_credits_obj.update_reason
                            "
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
                <CButton
                    @click="addGraceMessageCredits()"
                    color="success"
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
                <CModalTitle>Done</CModalTitle></CModalHeader
            >
            <CModalBody>
                <div class="row">
                    <div class="col-md-8">
                        {{ done_response }}
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="closeShowdone" color="info"
                    >Ok</CButton
                >
            </CModalFooter>
        </CModal>

        <CModal :visible="confirmMultiLocationLink">
            <CModalHeader>
                <CModalTitle
                    >Confirm Business Convert to
                    Location</CModalTitle
                >
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-4">
                        Target Business UID
                    </div>
                    <div class="col-md-4">
                        <input
                            v-model="target_ml_linking_uid"
                            class="form-control placeholder-no-fix"
                            type="text"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-4">Confirm</div>
                    <div class="col-md-6">
                        <input
                            type="checkbox"
                            v-model="confirm_target_ml_linking"
                        />
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton
                    @click="confirmMultiLocationLink = false"
                    color="info"
                    >Cancel</CButton
                >
                <CButton
                    @click="performMultiLocationLink"
                    color="danger"
                    :disabled="
                        confirm_target_ml_linking == false
                    "
                    >Link</CButton
                >
            </CModalFooter>
        </CModal>

        <CModal :visible="showDeleteAllCustomers">
            <CModalHeader>
                <CModalTitle
                    >Confirm Delete all customers</CModalTitle
                >
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    <div class="col-md-12">
                        This deletes all customers (not staff/owner user). It is not recoverable.
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
                    <div class="col-md-4">
                        Reason for delete
                    </div>
                    <div class="col-md-8">
                        <input
                            v-model="customer_delete_reason"
                            class="form-control placeholder-no-fix"
                            type="text"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">Confirm</div>
                    <div class="col-md-6">
                        <input
                            type="checkbox"
                            v-model="confirm_delete"
                        />
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton
                    @click="showDeleteAllCustomers = false"
                    color="info"
                    >Cancel</CButton
                >
                <CButton
                    @click="performAllCustomerdelete"
                    color="danger"
                    :disabled="confirm_delete == false"
                    >Delete</CButton
                >
            </CModalFooter>
        </CModal>
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
    name: 'BusinessList',
    components: {Pagination, Alerts},
    data() {
        return {
            confirm_target_ml_linking: false,
            source_ml_linking_uid: '',
            target_ml_linking_uid: '',

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
            //confirm_customer_delete_uid: '',
            confirm_delete: 0,
            //confirm_delete_allcustomer: false,
            confirmBusinessDelete: false,
            confirmMultiLocationLink: false,
            showProdAndServicesDelete: false,
            prod_service_delete_reason: '',
            showDeleteAllCustomers: false,
            customer_delete_reason: '',
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
    computed: {
        business_type: function () {
            return (
                this.$store.state?.business_settings?.business_info
                    ?.business_type || 0
            )
        },
    },
    methods: {
        makeBusinessAsPartner(business_id) {
            let data = {
                business_id,
            }
            let c = confirm('Make this business as a Partner org?')
            if (!c) {
                return
            }

            this.$schedsdk
                .makeBusinessAsPartner({data})
                .then((result) => {
                    if (result.status == 1) {
                        this.alertSuccess(
                            'Business marked as partner successfully.',
                        )
                        this.getList()
                    } else {
                        this.alertFailure('Failed: ' + (result.message || ''))
                    }
                })
                .catch((error) => {
                    let message =
                        error?.data?.message || 'Something went wrong.'
                    let status = error?.status || 500
                    this.alertFailure(`Failed: ${message}`)
                })
        },
        makeAsRegularBusiness(business_id) {
            let data = {
                business_id,
            }
            let c = confirm('Make this partner org as a regular org?')
            if (!c) {
                return
            }

            this.$schedsdk
                .makeRegularBusiness({data})
                .then((result) => {
                    if (result.status == 1) {
                        this.alertSuccess(
                            'Business marked as regular successfully.',
                        )
                        this.getList()
                    } else {
                        this.alertFailure('Failed: ' + (result.message || ''))
                    }
                })
                .catch((error) => {
                    let message =
                        error?.data?.message || 'Something went wrong.'
                    let status = error?.status || 500
                    this.alertFailure(`Failed: ${message}`)
                })
        },
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
        openExecuteVerifyBusiness(item) {
            let c = confirm('Reverify Business?')

            if (c) {
                let mythis = this
                this.$schedsdk
                    .reExecuteBusinessVerify({business_id: item._id})
                    .then((result) => {
                        if (result.status == 1) {
                            mythis.getList()
                        }
                    })
                    .finally(() => {})
            }
        },
        openDisableSetupWizard(item)
        {
            let c = confirm("Disable Setupwizard?");
            
            if(c)
            {
                let mythis = this
                this.$schedsdk.disableBusinessSetupWizard({business_id: item._id})
                    .then((result)=>{
                        if(result.status == 1)
                        {
                            mythis.getList();
                        }

                    }).finally ( () => {
                        
                }); 
            }
        },
        openAddGraceMessageCredits(item) {
            this.error_message = ''

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
        openConfirmDelete(business_id) {
            this.business_id_for_deletion = business_id;
            this.confirm_delete_uid = '';
            this.confirm_delete = 0;
            this.confirmBusinessDelete = true;        
        },
        openLinkMLBusinessLocations(uid) {
            this.target_ml_linking_uid = ''
            this.source_ml_linking_uid = uid
            this.confirm_target_ml_linking = false
            this.confirmMultiLocationLink = true
        },
        openConfirmProdSvcsDelete(business_id) {
            ;(this.business_id_for_deletion = business_id),
                (this.confirm_delete_uid = ''),
                (this.confirm_delete = 0),
                (this.showProdAndServicesDelete = true)
        },
        openConfirmAllCustomerDelete(business_id) {
            ;(this.business_id_for_deletion = business_id),
                (this.confirm_delete_uid = ''),
                (this.confirm_delete = 0),
                (this.customer_delete_reason=''),
                (this.showDeleteAllCustomers = true)
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
        getAppSystemLogs() {
            let mythis = this

            this.$schedsdk
                .get_app_system_logs({nlines: 200, grep_string: 'hellos'})
                .then((result) => {
                    console.log(result)
                })
                .finally(() => {})
        },
        toggleBookingLogs(item) {
            let c = confirm('Toggle booking logs for this business?')

            if (c) {
                this.$schedsdk
                    .toggleBookingLogs({business_id: item._id})
                    .then((result) => {
                        if (result.status == 1) {
                            this.alertSuccess(
                                'Toggle successful. Previous value was: ' +
                                    result.data.previous_value,
                            )
                        } else {
                            this.alertFailure(result.message)
                        }
                    })
                    .finally(() => {})
            }
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
        performAllCustomerdelete(){
            let data = {
                business_id: this.business_id_for_deletion,
                confirm_text: this.confirm_delete_uid,
                delete_reason: this.customer_delete_reason,
            }
            this.$schedsdk
                .delete_all_customers(data)
                .then((result) => {
                    if (result.status == 1) {
                        this.alertSuccess('Delete successful')
                    } else {
                        this.alertFailure('Failed: ' + (result.message || ''))
                    }
                })
            this.showDeleteAllCustomers = false
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
        performMultiLocationLink() {
            let data = {
                linking_business_uid: this.target_ml_linking_uid,
                main_business_uid: this.source_ml_linking_uid,
                confirm_target_ml_linking: this.confirm_target_ml_linking,
            }

            this.$schedsdk.perform_multi_location_link(data).then((result) => {
                if (result.status == 1) {
                    this.alertSuccess('Linking successful')
                } else {
                    this.alertFailure('Failed: ' + (result.message || ''))
                }
            })
            this.confirmMultiLocationLink = false
            this.target_ml_linking_uid = ''
            this.source_ml_linking_uid = ''
            this.confirm_target_ml_linking = ''
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
                .getBusinessListAdvanced(
                    context.search_owner_name,
                    context.search_business_name,
                    context.search_email_phone,
                    context.page,
                    context.sort_by_signup_date_first,
                    context.include_last_business_activity,
                    context.last_text_message_30_days ? 30 : 0,
                )
                .then((result) => {
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
