<template>
  <div class="pt-2">
        <message-center-credits />
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <div class="row controls-div">
            <div class="settings-text">Filter Options</div>
                <div class="col-md-2">
                    <label class="control-label"><b>Email/Phone/Name</b></label>
                    <input 
                    v-model="search"
                    class="form-control placeholder-no-fix" 
                    @keyup="searchBookingsList()"
                    type="text" 
                    />
                </div>
                <div class="col-md-2">
                    
                    <label class="control-label"><b>Booking/Order ID</b></label>
                    <input 
                    v-model="service_order_search"
                    class="form-control placeholder-no-fix" 
                    @keyup="searchBookingsList()"
                    type="text" 
                    />
            
                </div>

                <div class="col-md-3">
                    <label class="control-label">
                        <b>Show only today's booking:</b>
                    </label>
                    <input  
                        type="checkbox"
                        v-model="bp_preferences.bt_show_only_todays" 
                        @change="searchBookingsList"
                        />
                    <label class="control-label">
                        <b>Show payments in 'authed':</b>
                    </label>
                    <input  
                        type="checkbox"
                        v-model="completedButNoPayCapture" 
                        @change="searchBookingsList"
                        />
                   
                </div>
                <div class="col-md-3">
                    <label class="control-label">
                        <b>Status: &nbsp;</b>
                    </label>
                    <br>
                    <input  
                        type="checkbox"
                        v-model="bp_preferences.bt_cancelled" 
                        @change="searchBookingsList"  
                        /> 
                      <label class="control-label">
                         &nbsp;Cancelled&nbsp; 
                     </label>                                               
                     <input  
                        type="checkbox"
                        v-model="bp_preferences.bt_scheduled" 
                        @change="searchBookingsList"  
                        /> 
                      <label class="control-label">
                         &nbsp; Scheduled&nbsp; 
                     </label>   <br/>   
                     <input  
                        type="checkbox"
                        v-model="bp_preferences.bt_completed" 
                        @change="searchBookingsList"  
                        /> 
                      <label class="control-label">
                         &nbsp; Completed&nbsp; 
                     </label>                                               
                     
                </div>
                <div class="col-md-1">
                    <input  
                        class="btn btn-primary"
                        type="button"
                        value="Refresh"
                        @click="refreshCachedData"
                    />
                    <br />
                    &nbsp;
                    <input  
                        class="btn btn-primary"
                        type="button"
                        value="Create New Booking"
                        @click="$router.push('/bookings/create')"
                    />
                </div> 
                <br>
                 <br>
                 <div class="col-md-4">
                    <div class="form-group" >
                        <label class="control-label"><b>Service Date Range</b> <span @click="clearDate()">clear</span></label>
                        <flat-pickr 
                            v-model="bp_preferences.select_date_range" 
                            :config="date_range_picker_config" 
                            placeholder="Date Range"
                            @input="searchBookingsList"  ></flat-pickr>
                    </div>
                  </div>
                  <div class="col-md-4">
                       <label class="control-label">
                        <b>Show bookings created in past 24 Hrs:</b>
                    </label>
                    <input  
                        type="checkbox"
                        v-model="bp_preferences.bt_show_bookings_in_last_24hrs" 
                        @change="searchBookingsList"
                        />
                  </div>
                   <div class="col-md-4">
                    <div class="form-group" >
                        <label class="control-label"><b>Filter by Provider</b></label>
                        <v-select 
                            multiple
                            label="first_name"
                            v-model="filter_service_providers" 
                            @update:modelValue="changeProvidersFilter"
                            :options="provider_option"
                        >
                            <template v-slot:no-options="{ search, searching }">
                                <template v-if="searching">
                                No results found for <em>{{ search }}</em
                                >.
                                </template>
                                <em v-else style="opacity: 0.5">Start typing to search</em>
                            </template>
                            <template v-slot:option="option">
                            <div class="d-center">
                                {{ option.first_name }} {{option.last_name}}
                                </div>
                            </template>
                            <template v-slot:selected-option="option">
                                <div style="display: flex; align-items: baseline">
                                    <div class="selected d-center">{{ option.first_name }} {{option.last_name}}</div>
                                </div>
                            </template>
                        </v-select>                        
                    </div>
                  </div>
            <div class="col-md-4" v-if="show_bulk_options">
                <button class="btn btn-sm btn-danger" 
                        :disabled = "bulk_buttons_disabled"
                        @click="bulkCommonOperation('cancel')">Bulk Cancel</button>
                  &nbsp; 
                <button class="btn btn-sm btn-primary"
                :disabled =  "bulk_buttons_disabled"
                @click="bulkCommonOperation('complete')">Bulk Complete</button>
                    &nbsp;
                  <label class="control-label">
                        <b>{{bulkOperationInProgress}}</b>
                 </label>    
            </div>
        </div>
        <br/>
        <div class="row">
                     
        </div>
        <div class="table-responsive">
        <table bordered class="table table-bordered table-hover">
          <thead>
              <tr>
                  <!-- <th>S.no</th> -->
                  <th>Service ID</th>
                  <th>Appt. Date</th>
                  <th>Customer</th>
                  <th>Provider</th>
                  <th>Services</th>
                  <th>Invoice</th>
                  <th>Status</th>
                  <th>Action</th>
              </tr>
          </thead>
          <tbody v-if="list.length">
              <!-- {% set curr = response.current-1  %} -->
              <!-- {% set index = curr*response.options.perPage+1  %} -->
              <!-- {% if response.results != "" %} -->
              <tr v-for="(item,index) in list" :key="item._id">
                  <td> <input  
                        :key="item._id"
                        type="checkbox"
                        @change="serviceSelect(item,$event)"
                        /> {{item.service_order_id}}<br>
                      <small>{{getFormattedDateShort(item.booking_request_date)}}</small><br>

                    <small>{{getBookingSource(item.booking_source)}}</small><br>
                      
                  
                  </td> 
                  <td>{{getFormattedDate(item.service_start_date) }}
                       <span v-if="item.assigned_resource_ids && item.assigned_resource_ids.length>0">
                          <br>  <small>{{getResourcesList(item)}}</small>
                       </span>
                  </td>

                  <td><a href="" @click.prevent="viewUserInfo(item.customer,'customer')">
                        {{getCustomerOrParentName(item)}}</a>
                      <span v-if="item.client_notes!=''">
                          <br><button @click="viewNotes(item)" class="btn btn-sm btn-link">Notes</button>
                       </span>
                      <span v-if="item.linked_booking_hard_link==true">
                          <br><button @click="viewLinkedBookingInfo(item,index)" class="btn btn-sm btn-link">Linked</button>
                       </span>
                    </td>
                  <td>{{item.service_provider.first_name}} {{item.service_provider.last_name}}
                      </td> 
                  <td><span v-html="getServiceNames(item)"></span></td> 
                  <td><button v-if="item.invoice_info_summary && 
                    item.invoice_info_summary.length>0" class="btn btn-primary btn-sm" 
                    @click="$router.push('/invoices/detail/' + item.invoice_info_summary[0].invnumber )">
                    {{currency_symbol}}{{getInvoiceTotal(item)}}</button>
                    <br>
                    {{getIsPaidStatus(item)}}
                        
                  </td> 
                  <td>{{getPayStatus(item)}}
                       <span v-if="item.canceled_due_to_no_show !== null &&item.canceled_due_to_no_show == true ">
                          <br><small> No Show </small>
                      </span>
                      <span v-if="item.cancel_user_reason!=null &&item.cancel_user_reason.length>3 ">
                          <br><button @click="viewCancelNotes(item)" class="btn btn-sm btn-link">Note</button>
                      </span>
                  </td>

                  <td class="action_column">
                      <button class="btn btn-success btn-sm" @click="editHandler(item._id)">Edit</button>
                      <button class="btn btn-primary btn-sm" @click="$router.push('/bookings/detail/'+ item._id)">Detail</button>
                      <button v-if="item.type!=1 && item.type!=2 && item.type!=8"
                             class="btn btn-danger btn-sm" @click="cancelHandler(item._id,item.service_order_id)">Cancel</button>
                      <button class="btn btn-info btn-sm" @click="takePayment(item)">Pay</button>
                      <button v-if="item.type!=1 && item.type!=2 && item.type!=8"
                             class="btn btn-success btn-sm" @click="completeHandler(item._id,item.service_order_id)">Complete</button>
                      
                  </td>
              </tr>
              <!-- {% set index=index+1 %} -->
              <!-- {% else %} -->
              <!-- <tr xv-else><td colspan="10" class="text-center">No Booking Exists</td></tr> --> 
              <!-- {% endif %} -->
          </tbody>
          <tbody v-else>
              <tr>
                  <td colspan="8">
                    <div class="py-5">
                        <img src="/img/no-result.svg" alt="" class="img-empty"> 
                        <p class="h5 mt-4 d-block fw-normal">
                            No bookings found for search criteria
                        </p>
                    </div>
                    </td>
                </tr>
          </tbody>
        </table>
        </div>
        <Pagination
            v-if="list.length"
            :size="'sm'"
            :ariaLabel="'Bookings results pages'"
            :activePage.sync="page"
            :pages="pageCount"
            @update:activePage="setPage"
        />
   
    <EventEditor v-if="showEditor"
        ref="eventEditor"
        v-model="showEditor"
        :eventRecord="eventRecord"
        :eventStore="eventStore"
        :resourceId="resourceId"
        :key="edit_obj_id"
    ></EventEditor>
    
    <!-- Pay by card on file -->
      <CModal alignment="center" :backdrop="true" :keyboard="true" :visible="show_pay_modal" @close="closePayModal">
        <CModalHeader>
            <CModalTitle>Select Card On File or Pay</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <div class="row">
                <div class="col-md-6" color="danger">
                        <label class="control-label">
                            <b>Select card on file to pay with: </b>&nbsp; 
                        </label>
                        
                </div>
                <div class="col-md-6" color="danger" v-if="cards_on_file_list.length">
                        <select 
                                class="form-control" 
                                v-model="selected_card_id">
                                <option v-for="opt in cards_on_file_list" 
                                v-bind:key="opt._id"
                                :selected="opt._id == selected_card_id ? true : false" :value="opt._id">
                                {{opt.nick_name + " " + opt.last4 + " Exp. " + opt.exp_month + "/" +opt.exp_year}}</option>
                            </select>
                </div>
                <div class="col-md-6"   v-else>
                    No saved cards. You can save a card when paying next.
                </div>
            </div>
            

            <br>
            <div class="row">
                <div class="col-md-12" color="danger">
                <b> {{pm_error_message}}</b>
                </div>
            </div>
        </CModalBody>
        <CModalFooter>
            <CButton v-if="show_paycof==true" @click="payWithNewCard" color="info" class="mr-auto">Pay with new card</CButton>
            <CButton v-if="show_paycof==true" :disabled="checkout_btn_disabled" @click="continueToPayCof()" color="success" >{{checkout_text}}</CButton>
            <CButton v-if="show_paycof==true" @click="closePayModal()" color="danger">Cancel</CButton>
            <CButton v-if="show_paycof!=true" @click="closePayModal()" color="success">OK</CButton>
        </CModalFooter>
        </CModal>
  
      <CModal :visible="show_client_notes_modal" @close="closeNotesModal">
            <CModalHeader>
              <CModalTitle>{{client_notes_modal_title}}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    
                    <div class="col-md-12" >
                            {{client_note}}  
                    </div>
                    
                </div>
                

                <br>
                <div class="row">
                    <div class="col-md-12" color="danger">
                    <b> {{cn_error_message}}</b>
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="closeNotesModal()" color="success">OK</CButton>
            </CModalFooter>
    </CModal>
     <CModal :visible="show_linked_booking_info" @close="closeLinkedBookingModal">
         <CModalHeader>
            <CModalTitle>Linked Booking</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <div class="row">
             
            <div class="col-md-12" >
                    {{linked_booking_info_text}}  
            </div>
             
         </div>
          <div class="row">
            <div class="col-md-4" >
                    Order ID
            </div>
            <div class="col-md-4" >
                    Customer
            </div>
              <div class="col-md-4" >
                    Service Provider
            </div>
         </div>
        
        <div  v-for="item in linked_bookings_display_array" :key="item._id" class="row">
            <div class="col-md-4" >
                    {{item.service_order_id}} 
            </div>
           
            <div class="col-md-4" >
                    {{item.customer.first_name}}  {{item.customer.last_name}} 
            </div>
              <div class="col-md-4" >
                    {{item.service_provider.first_name}}  {{item.service_provider.last_name}}
            </div>
         </div>
         

        <br>
        <div class="row">
             <div class="col-md-12" color="danger">
               <b> </b>
            </div>
         </div>
         </CModalBody>
        <CModalFooter>
            <CButton @click="closeLinkedBookingModal()" color="success">OK</CButton>
        </CModalFooter>
        </CModal>
   
    <CModal :visible="show_user_details_modal" @close="closeUserInfoModal">
        <CModalHeader>
            <CModalTitle>User Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
           
        <div  class="row">
            <div class="col-md-4" >
                   Name
            </div>
            <div class="col-md-8" >
                    {{user_detail_obj.first_name}}  {{user_detail_obj.last_name}} 
                    <span>
                        <button @click="$router.push('/customers/detail/' + user_detail_obj._id)"  
                            class="btn btn-sm btn-link">View full detail</button>
                    </span>
            </div>
         </div>
        <div  class="row">
            <div class="col-md-4" >
                   Phone
            </div>
            <div class="col-md-8" >
                    {{getPhoneFormatted(user_detail_obj.phone)}} 
            </div>
         </div>
         <div  class="row">
            <div class="col-md-4" >
                   Email
            </div>
            <div class="col-md-8" >
                    {{user_detail_obj.email}} 
            </div>
         </div>
         <br>
         <div  class="row">
            <div class="col-md-4" >
                   Service Notes 1
            </div>
            <div class="col-md-8" >
                    {{user_detail_obj.service_notes_1  || "None"}} 
            </div>
         </div>
        <br>
         
        <div  class="row">
            <div class="col-md-4" >
                   Service Notes 2
            </div>
            <div class="col-md-8" >
                    {{user_detail_obj.service_notes_2  || "None"}} 
            </div>
         </div>
         <br>
         
          <div  class="row">
            <div class="col-md-4" >
                   Internal Notes
            </div>
            <div class="col-md-8" >
                    {{user_detail_obj.internal_notes || "None"}} 
            </div>
         </div>

        <br>
        <div class="row" v-if="user_detail_obj.booking_stats && user_detail_obj.booking_stats.appt_data_found==1">
            <div class="col-md-12" >
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th colspan="5">Booking Stats</th> 
                        </tr>
                    
                        <tr>
                            <th>Range (Days)</th>
                            <th>All appts.</th>
                            <th>Completed</th>
                            <th>All Cancels</th>
                            <th>No Show Cancel</th> 
                        </tr>
                </thead>
                
                <tbody> 
                <tr>
                    <td>{{user_detail_obj.booking_stats.data.report_days}} </td>
                    <td>{{user_detail_obj.booking_stats.data.appts_all_created_count}} </td>
                    <td>{{user_detail_obj.booking_stats.data.appts_completed_count}} ({{user_detail_obj.booking_stats.data.complete_percent}}%)</td>
                    <td>{{user_detail_obj.booking_stats.data.appts_cancelled_count}} ({{user_detail_obj.booking_stats.data.cancel_percent}}%)</td>
                    <td>{{user_detail_obj.booking_stats.data.appts_no_show_count}} ({{user_detail_obj.booking_stats.data.no_show_percent}}%)</td>
                </tr>
                </tbody>
                </table>
            </div> <!-- end col 12 -->
        </div>
        <div class="row">
             <div class="col-md-4" >
                   User blocked from online bookings?
            </div>
            <div class="col-md-8" >
                    {{user_detail_obj.online_booking_blocked == true? "Yes" : "No"}} 
            </div>
        </div>

        <br>
        <div class="row">
             <div class="col-md-12" color="danger">
               <b> </b>
            </div>
         </div>
         </CModalBody>
        <CModalFooter>
            <CButton @click="closeUserInfoModal" color="success">OK</CButton>
        </CModalFooter>
    </CModal>

    <CModal :visible="show_cancel_booking_modal" @close="cancelAsNoShow">
        <CModalHeader>
            <CModalTitle>Cancel Booking</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <div class="row">
             <div class="col-md-4" color="danger">
                      <label class="control-label">
                         <b>Cancel reason: </b>&nbsp; 
                     </label>
                     
            </div>
            <div class="col-md-8">
                   <input 
                    v-model="cancel_reason"
                    placeholder="Type in a cancellation note "
                    class="form-control placeholder-no-fix" 
                    type="text" 
                    />   
            </div>
            
         </div>
         

        <br>
        <div class="row">
             <div class="col-md-12" color="danger">
               <b> {{cancel_error_message}}</b>
            </div>
         </div>
         </CModalBody>
        <CModalFooter class="d-flex justify-content-between">
            <CButton @click="cancelAsNoShow()" color="danger" class="mr-auto">Cancel as No Show</CButton>
            <CButton @click="cancelAsRegular()" color="danger">Regular Cancel</CButton>

        </CModalFooter>
        </CModal>
  


  </div>
</template>

<script>
import CTableWrapper from './Table.vue';
import Pagination from "@/common/Pagination";
import EventEditor from '../dashboard/scheduler-tab/EventEditor'
import Alerts from '../Alerts'
import moment from 'moment'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import '../../assets/css/common.css';
import {
    debounce as lodash_debounce
} from 'lodash'
import login_helper from '../../helpers/login_helper';
import utils_lib from '../../helpers/utils_lib';
import MessageCenterCredits  from '@/common/MessageCreditsCheck';
import { findSpecificDoc, insertDataToCollection, getDataOfCollection, removeDataOfCollection, updateDataOfCollection } from '../../helpers/in-memory-db';

export default {
    name: 'List',
    components: {
        CTableWrapper,
        Pagination,
        Alerts,
        EventEditor,
        flatPickr,
        MessageCenterCredits
    },
    watch: {
        showEditor: function () {
            if (this.showEditor == false) {
                this.getBookingsList();
            }
        },
        bp_preferences: {
            handler(newobj) {
                //console.log("asdasdasdas===== " + this.bp_first_inited)
                //console.log(newobj)
                if (this.bp_first_inited) {
                    this.$store.commit('SET_BOOKINGS_VIEW_PREFS', newobj);
                }

            },
            deep: true
        }
    },
    data() {
        return ({
            visibleLiveDemo: false,
            hash_list_threshold: 5,
            date_range_picker_config: {
                altFormat: "F j, Y",
                altInput: true,
                mode: "range"
                // noCalendar: true,
                // enableTime: true,
                // time_24hr: true
            },
            //select_date_range: null,
            last_query_hash: null,
            search: '',
            service_order_search: '',
            //todayCheck:false,
            completedButNoPayCapture: false,
            bp_first_inited: false,
            bp_preferences: {
                bt_cancelled: false,
                bt_scheduled: true,
                bt_completed: true,
                bt_show_only_todays: false,
                select_date_range: null,
                bt_show_bookings_in_last_24hrs: false
            },
            show_bulk_options: false,
            bulk_buttons_disabled: false,
            bulkOperationInProgress: "",
            remaining_bulk_operations: 0,
            service_selection_map: new Map(),
            showEditor: false,
            eventRecord: {},
            eventStore: {},
            resourceId: null,
            alert: false,
            show: 0,
            alertData: {
                message: '',
                type: ''
            },
            booking_list: [],
            page: 1,
            pageCount: 1,
            timezone: this.$store.state.business_settings.business_time_zone,
            currency_symbol: this.$store.state.business_settings.business_currency_symbol,
            cards_on_file_list: [],
            show_pay_modal: false,
            pm_error_message: "",
            checkout_btn_disabled: false,
            checkout_text: 'Pay with card on file',
            selected_card_id: '',
            selected_booking_manage_key: '',
            selected_booking_service_id: '',
            selected_customer_id: '',
            show_paycof: true,
            show_client_notes_modal: false,
            client_note: "",
            client_notes_modal_title: "Client Notes",
            cn_error_message: "",
            show_linked_booking_info: false,
            linked_booking_info_text: "",
            linked_bookings_display_array: [],
            filter_service_providers: [],
            show_user_details_modal: false,
            user_detail_obj: {
                _id: null
            }, //for display
            country_code: this.$store.state.business_settings.business_info.country_code,
            edit_obj_id: null,

            show_cancel_booking_modal: false,
            cancel_reason: "",
            cancel_error_message: '',
            cancel_booking_id: "",
            cancel_service_order_id: ""
        })
    },
    created() {

        let bvp = this.$store.state.booking_view_preferences
        if (bvp != null && bvp.bt_scheduled !== undefined) {
            this.bp_preferences = bvp;
        }
        this.bp_first_inited = true;
        let currentTimestamp = +new Date();
        let { slice_last_fetched_timestamp, slice_ttl } = this.$store.state;
        let employeeListFetchedTimestampExpired = slice_last_fetched_timestamp.employee_list + slice_ttl.employee_list;
        let isCachedDataExpired = currentTimestamp > employeeListFetchedTimestampExpired;

        if (isCachedDataExpired) {
            this.getProvidersList();
		} else if (!this.provider_option.length) {
            this.getProvidersList();
        }

        // this.getBookingsList();
        this.searchBookingsList();
    },
    computed: {
        provider_option() {
            return this.$store.state.employee_list;
        },
        list: function () {
            return this.booking_list.filter(obj => {

                let paystat = this.getPayStatus(obj);


                if (!this.completedButNoPayCapture || (this.completedButNoPayCapture == true && paystat == "Authed")) {
                    return obj
                }

            })

        },
    },
    methods: {
        async refreshCachedData() {
            let hashList = await getDataOfCollection('skysalon.booking_hashed_list', {}, null, 0, {created_at: 1});
            for (let hashRecord of hashList) {
                this.removeHashedRecordAndData(hashRecord);
            }
        },
        debGetList: lodash_debounce((context) => {

            let dt_range = context.getDateRangeTimeStamps(context.bp_preferences.select_date_range + "");
            let startDay = dt_range.start_ts;
            let endDay = dt_range.end_ts;
            let filter_provider_ids = [];
            context.filter_service_providers.map((obj) => {
                filter_provider_ids.push(obj._id)
            });
            let qry = {
                page_no: context.page,
                search: context.search,
                service_order_kw: context.service_order_search,
                todayCheck: context.bp_preferences.bt_show_only_todays,
                booking_type_list: context.get_booking_type_arr(),
                show_created_in_last24: context.bp_preferences.bt_show_bookings_in_last_24hrs,
                filter_provider_ids: filter_provider_ids
            };
            if (startDay != null && endDay != null) {
                qry.begin_booking_date = startDay;
                qry.end_booking_date = endDay;
            }
            //Need to clear since we don't want any unwanted services due to
            context.service_selection_map.clear();

            context.$schedsdk.getBookingList(qry).then(async (result) => {
                if (result.data.length) {
                    context.booking_list = result.data;
                    context.pageCount = result.total_pages;

                    // update the created_at of hashed record.
                    await updateDataOfCollection('skysalon.booking_hashed_list', {"_id": context.last_query_hash}, {"created_at": new Date()});

                    // insert into db collection.
                    await insertDataToCollection(`skysalon.${context.last_query_hash}_booking_list`, result.data);


                    // FLush all before inserting...
                    // context.$store.dispatch('schedsdkstore/flushAllBookingData', {
                    //         data: result.data
                    //     })
                    //     .then(() => {
                    //         context.$store.dispatch('schedsdkstore/saveBookingsToDb', {
                    //             data: result.data
                    //         }); // dispatch an action
                    //     })
                } else {
                    context.booking_list = result.data
                }
            }).catch((Ex) => {
                login_helper.checkSessionExpiryAndRedirectToLogin(Ex, context.$schedsdk, context.$router)
            })

        }, 430),
        serviceSelect(item, $event) {
            if ($event.srcElement &&
                $event.srcElement.checked) {

                this.service_selection_map.set(item._id, {
                    booking_id: item._id,
                    service_order_id: item.service_order_id
                });
            } else {
                this.service_selection_map.delete(item._id);
            }
            if (this.service_selection_map.size == 0) {
                //Deactivate bulk options
                this.show_bulk_options = false
                this.bulk_buttons_disabled = true;
                this.bulkOperationInProgress = "";
            } else {
                //Activate
                this.show_bulk_options = true
                this.bulk_buttons_disabled = false;
            }
        },
        doDecrementBulkOperationCount() {
            this.remaining_bulk_operations--;
            if (this.remaining_bulk_operations <= 0) {
                //Done.
                this.bulk_buttons_disabled = false;
                this.bulkOperationInProgress = "Bulk operation done.";
                this.service_selection_map.clear();
                this.getBookingsList();
            }
        },
        bulkCommonOperation(op) {
            let operation = op;
            let confirmed = confirm("Confirm bulk operation: " + operation + " " + this.service_selection_map.size + " items?");
            if (!confirmed) {
                return;
            }
            this.remaining_bulk_operations = this.service_selection_map.size;
            this.bulk_buttons_disabled = true;
            this.bulkOperationInProgress = op + " in progress" + " (" + this.service_selection_map.size + " items)..."

            switch (op) {
                case "cancel":
                    this.bulkCancel();
                    break;
                case "complete":
                    this.bulkComplete();
                    break;
                default:
                    break;

            }
            return;

        },
        bulkCancel() {
            let me = this;
            this.service_selection_map.forEach(ele => {
                console.log("Cancel: " + ele)
                me.doCancel(ele, true);
            })

        },
        bulkComplete() {
            let me = this;

            this.service_selection_map.forEach(ele => {
                console.log("Complete: " + ele)
                me.doComplete({
                    _id: ele.booking_id
                }, true);
            })

        },
        changeProvidersFilter() {
            this.debGetList(this)
        },
        getCustomerOrParentName(item) {
            if (!item && !item.walkin_customer_first_name)
            {
              return "NA"
            }
            let customer_name = item.customer.first_name + " " + item.customer.last_name

            if (item.child_name && item.child_name.length > 2 && item.child_cust_id) {
                customer_name = item.child_name + " /parent: " + customer_name;
            }
            return customer_name;
        },
        getServiceNames(item) {
            let svcname = "";
            let total_time = 0;
            for (let i = 0; i < item.services.length; i++) {

                svcname += item.services[i].name;
                total_time += item.services[i].time;
                if (i < item.services.length - 1) {
                    svcname += ", "
                }
            }
            if (svcname != "") {
                svcname += "<br><small>" + total_time + " mins</small>"
            }
            return svcname;
        },
        getPhoneFormatted(phone) {
            if (phone && phone.length > 0) {
                return utils_lib.getPhoneFormatted(phone, this.country_code)
            }
            return "";

        },
        get_booking_type_arr() {
            let type_list = []
            if (this.bp_preferences.bt_cancelled) {
                //1, 2, 8
                type_list.push(1)
                type_list.push(2)
                type_list.push(8)
            }
            if (this.bp_preferences.bt_scheduled) {
                type_list.push(3)
                type_list.push(5)
                type_list.push(6)
                type_list.push(7)
            }
            if (this.bp_preferences.bt_completed) {
                type_list.push(4)
            }
            return type_list;

        },
        async getBookingsList() {

            this.debGetList(this)
        },
        getProvidersList() {
            this.$schedsdk.get_users_list({}).then((result) => {
                if (result.status == 1) {
                    this.$store.commit('SET_EMPLOYEE_LIST', result.data);
                    this.$store.commit('setLastFetchedTimestamp', 'employee_list');
                }
            });
        },
        strhash(str) {
            let hash = 5381,
                i = str.length;

            while (i) {
                hash = (hash * 33) ^ str.charCodeAt(--i);
            }

            /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
             * integers. Since we want the results to be always positive, convert the
             * signed int to an unsigned by doing an unsigned bitshift. */
            return hash >>> 0;
        },
        getDateRangeTimeStamps(dt_range_string) {
            return utils_lib.getFPickDateRangeTimeStamps(dt_range_string, this.$store.state.business_settings.business_time_zone)
        },
        async searchBookingsList() {
            RegExp.prototype.toJSON = RegExp.prototype.toString;

            let keywordSearch = new RegExp('.*' + this.search.trim() + '.*', 'i');
            let keywordServiceOrderSearch = new RegExp('.*' + this.service_order_search.trim() + '.*', 'i');
            let query = {}
            let or_qry_ary = [];
            let dt_range = this.getDateRangeTimeStamps(this.bp_preferences.select_date_range + "");

            let startDay = dt_range.start_ts;
            let endDay = dt_range.end_ts;

            if (this.search.trim() != '') {
                or_qry_ary = [{
                        'first_name': keywordSearch
                    },
                    {
                        'last_name': keywordSearch
                    },
                    {
                        email: keywordSearch
                    },
                    {
                        phone: keywordSearch
                    },
                    // {service_order_id: keywordServiceOrderSearch}
                ];
            }

            if (this.service_order_search.trim() != "") {
                or_qry_ary.push({
                    service_order_id: keywordServiceOrderSearch
                })
            }
            if (or_qry_ary.length > 0) {
                query.$or = or_qry_ary
            }

            if (this.bp_preferences.bt_show_only_todays) {
                let current_time = moment.utc().valueOf();
                let start_date = moment.utc(current_time).startOf('day').valueOf();
                let end_date = moment.utc(current_time).endOf('day').valueOf();
                query.service_start_date = {
                    $gte: start_date,
                    $lte: end_date
                }
            } else if (endDay != null && startDay != null) {
                query.service_start_date = {
                    $gte: startDay,
                    $lte: endDay
                }
            }
            let type_list = this.get_booking_type_arr()
            query.type = {
                $in: type_list
            };
            
            let { ttl, should_cache_data } = this.$store.state.in_memory_db_state;
            
            if (!should_cache_data.bookings) {
                this.getBookingsList();
            } else {
                let hash = this.strhash(JSON.stringify(query));
                let hashRecord = await this.insertOrGetHashedRecord(hash);
                let localDbBookingData = await getDataOfCollection(`skysalon.${hashRecord._id}_booking_list`);
                let currentTimestamp = +new Date();
    
                let bookingCachedDataWillExpired = (+hashRecord.created_at) + ttl.bookings;
                let isCachedDataExpired = currentTimestamp > bookingCachedDataWillExpired;
    
                if (isCachedDataExpired || !localDbBookingData.length) {
                    this.last_query_hash = hash;
                    this.getBookingsList();
                } else {
                    this.booking_list = localDbBookingData;
                    this.pageCount = localDbBookingData.total_pages
                }
            }
        },
        async removeHashedRecordAndData(hashRecord) {
            await removeDataOfCollection('skysalon.booking_hashed_list', {"_id": hashRecord._id});
            await removeDataOfCollection(`skysalon.${hashRecord._id}_booking_list`);
        },
        async insertOrGetHashedRecord(hash) {
            let hashRecord = await findSpecificDoc('skysalon.booking_hashed_list', {"_id": hash});
            let hashedList = await getDataOfCollection('skysalon.booking_hashed_list', {}, null, 0, {created_at: 1});

            if (!hashRecord) {
                if (hashedList.length == this.hash_list_threshold) {
                    await this.removeHashedRecordAndData(hashedList[0]);
                }
                hashRecord = {"_id": hash, "created_at": new Date()};
                insertDataToCollection('skysalon.booking_hashed_list', hashRecord);
            }
            return hashRecord;
        },
        clearDate() {
            this.bp_preferences.select_date_range = null
        },
        setPage(pageNo) {
            this.page = pageNo;
            this.getBookingsList();
        },
        editHandler(booking_id) {
            console.log("Booking Id ", booking_id)
            let thisRef = this;
            this.edit_obj_id = booking_id;
            this.$schedsdk.getBookingDetail({
                _id: booking_id
            }).then((result) => {

                // console.log(result.data.customer.email)
                thisRef.eventRecord.data = result.data;
                thisRef.eventRecord.data.id = result.data._id;
                thisRef.eventRecord.data.email = result.data.customer.email;
                thisRef.eventRecord.data.phone = result.data.customer.phone;
                thisRef.eventRecord.data.last_name = result.data.customer.last_name;
                thisRef.eventRecord.data.first_name = result.data.customer.first_name;

                thisRef.eventRecord.edit_booking_flag = 1;
                thisRef.eventRecord.resourceId = result.data.service_provider._id;
                // thisRef.resourceId = result.data;
                thisRef.showEditor = true;
            })

        },

        doCancel(data, decrement_bulk_op_count = false) {
            this.$schedsdk.cancelBooking(data).then((result) => {
                if (result.status == 1) {
                    if (decrement_bulk_op_count == false) {
                        this.alertData = {
                            message: result.message,
                            type: 'success'
                        }
                        this.alert = true;
                        this.show = 4;
                        this.getBookingsList();
                    }


                }
                this.show_cancel_booking_modal = false
            }).catch(ex => {
                this.alertData = {
                    message: ex.data.message,
                    type: 'danger'
                }
                this.alert = true;
                this.show = 4;
            }).finally(() => {
                if (decrement_bulk_op_count) {
                    this.doDecrementBulkOperationCount();
                }
            })
        },
        cancelAsNoShow() {
            let data = {
                booking_id: this.cancel_booking_id,
                service_order_id: this.cancel_service_order_id,
                is_for_no_show: true,
                cancel_user_reason: this.cancel_reason
            }
            this.doCancel(data);
        },
        cancelAsRegular() {
            let data = {
                booking_id: this.cancel_booking_id,
                service_order_id: this.cancel_service_order_id,
                is_for_no_show: false,
                cancel_user_reason: this.cancel_reason
            }
            this.doCancel(data);
        },

        cancelHandler(booking_id, service_order_id) {
            // console.log("Cancel booking process")
            this.cancel_reason = "";
            this.cancel_error_message = '';
            this.cancel_booking_id = booking_id;
            this.cancel_service_order_id = service_order_id;

            this.show_cancel_booking_modal = true


        },
        doComplete(data, decrement_bulk_op_count = false) {
            let me = this;
            me.$schedsdk.getBookingDetail(data).then((result) => {
                if (result.status == 1) {
                    if (result.data.type != 1 &&
                        result.data.type != 2 &&
                        result.data.type != 4 &&
                        result.data.type != 8) {
                        //
                        result.data.type = 4 //complete;
                        me.$schedsdk.updateBooking(result.data).then((cres) => {
                            if (cres.status == 1) {
                                if (decrement_bulk_op_count == false) {
                                    me.alertData = {
                                        message: cres.message,
                                        type: 'success'
                                    }
                                    me.alert = true;
                                    me.show = 4;
                                    me.getBookingsList();
                                } else {

                                }

                            } else {
                                this.alertData = {
                                    message: cres.message,
                                    type: 'danger'
                                }
                                this.alert = true;
                                this.show = 4;
                            }

                        }).catch(ex => {
                            this.alertData = {
                                message: ex.data.message,
                                type: 'danger'
                            }
                            this.alert = true;
                            this.show = 4;
                        }).finally(() => {
                            me.doDecrementBulkOperationCount()

                        });
                    } //end if

                }
            }).catch(ex => {
                this.alertData = {
                    message: ex.data.message,
                    type: 'danger'
                }
                this.alert = true;
                this.show = 4;
            })

        },
        completeHandler(booking_id, service_order_id) {
            // console.log("Cancel booking process")
            let confirmed = confirm("Are you sure to complete this booking?");
            if (confirmed) {
                let data = {
                    _id: booking_id
                }
                this.doComplete(data)

            } //confirmed

        },
        getFormattedDate: function (dt_unix) {
            if (dt_unix == null || dt_unix == 0) {
                return dt_unix;
            }
            return moment(dt_unix).format("MMM DD, YYYY hh:mm a"); //"MMM DD, YYYY hh:mm a"
        },
        getFormattedDateShort: function (dt_unix) {
            if (dt_unix == null || dt_unix == 0) {
                return dt_unix;
            }
            return moment(dt_unix).format("MMM/DD/YY hh:mma"); //"MMM DD, YYYY hh:mm a"
        },
        movetoinvoice: function (invn) {
            this.$router.push('/invoice/detail/' + invn)
        },
        getIsPaidStatus(item) {
            if (item.invoice_info === undefined || item.invoice_info[0] === undefined) {
                //console.log(item)
                return "NA";
            }
            return (item.invoice_info[0].invoice.estimated_amount_due < 0.001) ? "Paid" : "Not Paid"

        },
        getInvoiceTotal: function (item) {
            //console.log(item.service_order_id)
            //console.log(item.invoice_info[0])
            //console.log(item.invoice_info_summary[0])
            //console.log(this.completedButNoPayCapture)
            return item.invoice_info[0].invoice.estimated_amount_total
            let invoice_amount = 0

            let details = item.invoice_info[0].compact_invoice_detail;

            details.forEach(pay => {
                //console.log(pay)
                invoice_amount += pay.ep;
            });


            return invoice_amount;
        },
        viewUserInfo(userobj, user_type) {
            let id = userobj._id;
            let that = this;
            that.user_detail_obj = {
                _id: null
            };
            this.$schedsdk.get_customer_detail(id).then((result) => {
                if (result.status == 1) {
                    //
                    that.user_detail_obj = result.data;
                    that.show_user_details_modal = true;
                }
            })

        },
        viewNotes(item) {
            this.client_note = item.client_notes;
            this.client_notes_modal_title = "Client Notes"
            this.show_client_notes_modal = true;
        },
        //Reuse show_client_notes_modal
        viewCancelNotes(item) {
            this.client_note = item.cancel_user_reason;
            this.client_notes_modal_title = "Cancellation Notes"
            if (item.canceled_due_to_no_show == true) {
                this.cn_error_message = "No show";
            } else {
                this.cn_error_message = "";
            }
            this.show_client_notes_modal = true;
        },
        viewLinkedBookingInfo(item, index) {
            this.linked_booking_info_text += ""
            let grouped_bookings = [];
            for (let k = 0; k < this.booking_list.length; k++) {
                if (this.booking_list[k].linked_booking_hard_link == true &&
                    this.booking_list[k].linked_booking_hard_tag == item.linked_booking_hard_tag) {
                    grouped_bookings.push({
                        _id: this.booking_list[k]._id,
                        service_order_id: this.booking_list[k].service_order_id,
                        customer: this.booking_list[k].customer,
                        service_provider: this.booking_list[k].service_provider
                    })
                }
            }
            this.linked_bookings_display_array = grouped_bookings;
            this.show_linked_booking_info = true;
            this.linked_booking_info_text = "Grouped & Linked under " + item.linked_booking_hard_tag;

        },
        getResourcesList(item) {
            let rsclist = "";
            for (let k = 0; k < item.assigned_resource_ids.length; k++) {
                rsclist += item.assigned_resource_ids[k].first_name + " ";
            }
            return rsclist;
        },
        getBookingSource(booking_source) {
            switch (booking_source) {
                case 1: return "App";
                case 2: return "Alexa";
                case 3: return "Web";
                case 4: return "Webchat";
                case 5: return "AdminWeb";
                case 6: return "GoogleHome";
                case 7: return "Facebook";
                case 8: return "Waitlist";
                case 99: return "Unloggedin";
                
                default:
                    return 'Unknown ' + booking_source;


            }
        },
        getPayStatus: function (item) {
            //console.log(item.service_order_id)
            //console.log(item.invoice_info[0])
            //console.log(item.invoice_info_summary[0])
            //console.log(this.completedButNoPayCapture)
            let captured = false;
            let has_auth = false
            let status = "NotComplete";
            if (item.type == 2 || item.type == 8) {
                status = "Canceled"
                if (item.canceled_due_payment_hold === true) {
                    status += "\n Auto"
                } else {
                    //  status += "\n Manual"
                }

            }
            if (item.type == 3 || item.type == 5 || item.type == 6 || item.type == 7) {
                status = "Scheduled"
            }
            if (item.type == 4) {
                let payments = [];
                if (item.invoice_info && item.invoice_info.length > 0) {
                    payments = item.invoice_info[0].compact_invoice_payments;
                }
                status = "Completed"
                if (this.getIsPaidStatus(item) != "Paid") {
                    status += " - Not Paid"
                }
                payments.forEach(pay => {
                    //console.log(pay)
                    if (pay.pv > 0 && pay.tp == "EP_CLOVER") {
                        if (pay.top == 'PT_TT_SALE' ||
                            pay.top == 'PT_TT_AUTH_CAPTURE') {
                            captured = true;
                        }
                        if (pay.top == 'PT_TT_AUTH') {
                            has_auth = true;
                        }
                    }
                });

                if (has_auth == true) {
                    //   status += " Authed";
                }
                if (captured == true) {
                    // status += " Captured";
                }

            }

            return status;
        },
        alertClosedFn() {
            this.show = 0;
        },
        takePayment(item) {

            this.pm_error_message = "";
            this.cards_on_file_list = [];
            this.checkout_btn_disabled = false;
            this.selected_booking_manage_key = item.manage_booking_key,
                this.selected_booking_service_id = item.service_order_id;
            this.selected_customer_id = item.customer_id;
            this.show_paycof = true;
            this.$schedsdk.list_user_cards_on_file({
                user_id: item.customer_id
            }).then((result) => {
                if (result.status == 1) {
                    this.cards_on_file_list = result.data
                } else {
                    this.pm_error_message = "Error getting Cards on File: " + result.message
                }
                if (this.cards_on_file_list.length == 0) {
                    this.checkout_btn_disabled = true;
                }
                this.show_pay_modal = true
            }).catch((Ex) => {
                this.pm_error_message = "Error contacting server"

                this.show_pay_modal = true
            })
        },
        payWithNewCard() {
            //  this.selected_booking_manage_key= this.manage_booking_key,
            //this.selected_booking_service_id = this.services_order_id;

            let url = this.$store.state.skysched_global_api_base_url +
                "extpages/online_booking_payment/" +
                this.selected_booking_manage_key +
                "?show_page_header=0&show_page_footer=0"
            this.$router.push({
                name: 'Pay Purchase Order',
                params: {
                    po_access_url: encodeURI(url)
                }
            });
            this.closePayModal();

        },
        closePayModal() {
            this.show_pay_modal = false;
            this.cards_on_file_list = [];
            this.pm_error_message = "";
            this.selected_booking_manage_key = ""
            this.selected_booking_service_id = ""

        },
        closeNotesModal() {
            this.show_client_notes_modal = false;
            this.client_note = "";
        },
        closeLinkedBookingModal() {
            this.show_linked_booking_info = false;
            this.linked_booking_info_text = "";
            this.linked_bookings_display_array = [];

        },
        closeUserInfoModal() {
            this.show_user_details_modal = false;
            this.user_detail_obj = {
                _id: null
            };
        },
        continueToPayCof() {
            // console.log(this.selected_card_id);

            if (!this.selected_card_id || this.selected_card_id.length < 3) {
                this.pm_error_message = "Please select a card";
                return;
            }
            this.pm_error_message = "Starting payment request..."
            this.$schedsdk.takePaymentForBookingWithCardOnFile({
                order_number: this.selected_booking_service_id,
                customer_id: this.selected_customer_id,
                card_on_file_id: this.selected_card_id
            }).then((result) => {
                if (result.status == 1) {
                    //Done.
                    this.pm_error_message = "Payment successful."
                } else {
                    this.pm_error_message = "Error taking payment " + result.message
                }
            }).catch((Ex) => {
                this.pm_error_message = "Error contacting server"
                //this.closePayModal();

            })
            this.show_paycof = false;


        } //end continueToPayCof

    }

}
</script>
<style scoped>
    .action_column button {
        margin: 3px
    }
    .section_1 {
        /*background: white;*/
        margin-top: 30px;
        padding: 6px;
    }
</style>

