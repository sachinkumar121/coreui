<template>
  <div>
    <CRow>
      <CCol sm="12">
        <!-- <form id="filter_form"> -->
        <div class="form-body">
          <div class="form-body">
            <div class="section_1">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="control-label">
                      <b>Select Report</b>
                    </label>
                    <div class="selectreport">
                    <v-select
                      v-model="reportObj"
                      label="report_name"
                      :options="options"
                      @search="onSearch"
                      @update:modelValue="setReportData"
                    >
                      <template v-slot:no-options>Type to search Report name..</template>
                      <template v-slot:option="option" >
                        <div class="d-center">{{ option.report_name }}</div>
                      </template>
                      <template v-slot:selected-option="option" >
                        <div class="selected d-center">{{ option.report_name }}</div>
                      </template>
                    </v-select>
                      <a class="info btn" title="Report Info" @click="reportDetailModal = true" v-if="report_name != ''" >
                        <CIcon name="cil-info" />
                      </a>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                     <label class="control-label">
                      <b>Quick Date Range</b>
                    </label>
                    <br>
                    <v-select
                      v-model="QdSelectOption"
                      label="label"
                      :options="qdSelectOptions"
                      @update:modelValue="QdCheckChange"
                    >
                    </v-select>
                </div>
              </div>
            </div>
            <br/>
            <div
              class="section_1"
              v-if="available_params.start_time_report || available_params.end_time_report || available_params.customer_id || available_params.stylist_id || available_params.item_id_type"
            >
              <div class="row">
                <div class="col-md-3" v-if="available_params.start_time_report || available_params.end_time_report">
                  <div class="form-group">
                    <label class="control-label"><b>Date Range</b></label>
                        <flat-pickr 
                            v-model="select_date_range" 
                            :config="date_range_picker_config" 
                            placeholder="Date Range"
                            @input="setStartDate"  ></flat-pickr>
                  </div>
                </div>
                <div class="col-md-3" v-if="available_params.customer_id">
                  <div class="form-group">
                    <label class="control-label">
                      <b>Customer</b>
                    </label>
                    <v-select
                      v-model="selected_customer"
                      label="first_name"
                      :options="customer_option"
                      @update:modelValue="setCustomer"
                      @search="CustomerSearch"
                    >
                      <template v-slot:no-options>Type Customer name..</template>
                      <template v-slot:option="option" >
                        <div class="d-center">{{ option.first_name }} {{ option.last_name }}</div>
                      </template>
                      <template v-slot:selected-option="option" >
                        <div
                          class="selected d-center"
                        >{{ option.first_name }} {{ option.last_name }}</div>
                      </template>
                    </v-select>
                  </div>
                </div>
                <div class="col-md-3" v-if="available_params.stylist_id">
                  <div class="form-group">
                    <label class="control-label">
                      <b>Provider</b>
                    </label>
                    <v-select
                      v-model="selected_stylist"
                      label="first_name"
                      @update:modelValue="setStylist"
                      :options="stylist_option"
                      @search="StylistSearch"
                    >
                      <template v-slot:no-options>Type Provider's name..</template>
                      <template v-slot:option="option" >
                        <div class="d-center">{{ option.first_name }} {{ option.last_name }}</div>
                      </template>
                      <template v-slot:selected-option="option" >
                        <div
                          class="selected d-center"
                        >{{ option.first_name }} {{ option.last_name }}</div>
                      </template>
                    </v-select>
                  </div>
                </div>
                <div class="col-md-3" v-if="available_params.item_id_type">
                  <div class="form-group">
                    <label class="control-label">
                      <b>Item Type</b>
                    </label>
                    <v-select
                      v-model="item_id_type"
                      @update:modelValue="setItemType"
                      label="name"
                      :options="type_option"
                    >
                      <template v-slot:no-options>Select item type ..</template>
                      <template v-slot:option="option" >
                        <div class="d-center">{{ option.name }}</div>
                      </template>
                      <template v-slot:selected-option="option" >
                        <div class="selected d-center">{{ option.name }}</div>
                      </template>
                    </v-select>
                  </div>
                </div>
                <div class="col-md-3" v-if="available_params.item_id">
                  <div class="form-group">
                    <label class="control-label">
                      <b>Item</b>
                    </label>
                    <v-select
                      v-model="item_id"
                      label="name"
                      @update:modelValue="setItem"
                      :options="item_option"
                      @search="ItemSearch"
                    >
                      <template v-slot:no-options>Type Item name</template>
                      <template v-slot:option="option" >
                        <div class="d-center">{{ option.name }}</div>
                      </template>
                      <template v-slot:selected-option="option" >
                        <div class="selected d-center">{{ option.name }}</div>
                      </template>
                    </v-select>
                  </div>
                </div>
                <div class="col-md-3" v-if="available_params.sales_summary_grouping">
                  <div class="form-group">
                    <label class="control-label">
                      <b>Grouping</b>
                    </label>
                    <v-select
                      v-model="sales_summary_grouping"
                      label="name"
                      @update:modelValue="setSalesSummaryGrouping"
                      :options="sales_summary_grouping_option" 
                    >
                      <template v-slot:no-options>Select a Grouping</template>
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
              <br>
            </div>
            <div
              class="section_1">
              <div class="row">
                <div class="col-md-12 d-flex justify-content-end gap-2">
                    <input
                      id="filter"
                      @click="getReportList"
                      class="btn btn-primary btn-danger"
                      type="button"
                      title="Get Report"
                      value="Get Report"
                    />
                    <button
                    id="clear"
                    @click="resetSelection"
                    class="btn btn-primary btn-primary clear_form"
                    type="button"
                    title="Reset"
                  >Reset</button>
                  </div>
              </div>
            </div>
            <br>
            <div class="row" v-if="list.length">
              <div class="col-md-12">
              <div class="table table-bordered table-hover">
                  <ReportDataTable 
                    v-bind="bindings"
                  />
                <!-- <data-table v-bind="bindings"/> -->
              </div>
              <!-- <input type="button"  class="btn btn-primary" @click="getReportCsv()"   value="Download Data"> -->
              <download-csv class="csv-btn btn btn-primary csv-custom-position"
                  :data   = csv_data 
                  ref="csv_ref"
                :labels="getLabels()">Download Data</download-csv>
                <Pagination class="mt-2"
                    v-if="list.length"
                    :size="'sm'"
                    :ariaLabel="'Reports results pages'"
                    :activePage.sync="page"
                    :pages="pageCount"
                    @update:activePage="setPage"
                />
            </div>
            </div>
          </div>
        </div>
        <br>
        <!-- </form> -->
        <br>
      </CCol>
    </CRow>
    <CModal size="xl" :visible="reportDetailModal">
      <CModalHeader>
        <CModalTitle>Report Info</CModalTitle>
    </CModalHeader>
    <CModalBody>
        <div class="row">
        <div class="col-md-12" v-if="report_name != ''">
          <div class="section_1">
            <label style="margin-right:3px" class="control-label">
              <b>Name:</b>
            </label>
            {{report_name}}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6" v-if="report_cat != ''">
          <div class="section_1">
            <label style="margin-right:3px" class="control-label">
              <b>Category:</b>
            </label>
            {{report_cat}}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12" v-if="report_desc != ''">
          <div class="section_1">
            <label style="margin-right:3px" class="control-label">
              <b>Description:</b>
            </label>
            {{report_desc}}
          </div>
          <br>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12" v-if="report_field_desc !== undefined && report_field_desc != null">
          <div class="section_1">
            <label style="margin-right:3px" class="control-label">
              <b>Report Fields:</b>
               <table>
                <tr v-for="(value, name) in report_field_desc" :key="name">
                  <td>{{  name  }}</td>
                  <td>{{ value.description }}</td>
                </tr>
                </table>
            </label>
          </div>
          <br>
        </div>
      </div>
      </CModalBody>
      <CModalFooter>
        <CButton @click="reportDetailModal = false" color="success">OK</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import moment from "moment-timezone";
import Pagination from "@/common/Pagination";
import ReportDataTable from "../ReportDataTable";
import {
  debounce as lodash_debounce
}
from "lodash";

import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import utils_lib from '../../helpers/utils_lib';
import JsonCSV from 'vue-json-csv';

export default {
  name: "AllReports",
  components: {
    Pagination,
    flatPickr,
    ReportDataTable,
    "download-csv": JsonCSV
  },
  data() {
    return {
         
          date_range_picker_config: {
            altFormat: "F j, Y",
            altInput: true,
             mode: "range"
            // noCalendar: true,
            // enableTime: true,
            // time_24hr: true
        },
          select_date_range: null,
      reportDetailModal:false,
      QdSelectOption:null,
       
      qdSelectOptions: [{
          label: 'Last full week',
          code: 'last_full_week'
        },
        {
          label: 'Last month',
          code: 'last_full_month'
        },
        {
          label: 'Last 3 months',
          code: 'last_3_month'
        },
        {
          label: 'Last 6 months',
          code: 'last_6_month'
        },
        {
          label: 'Last 12 months',
          code: 'last_12_month'
        },
        {
          label: 'Last calendar year',
          code: 'last_calendar_year'
        }
                ],
      options: [],
      csv_data: [],
      type_option: [{
          name: "Service",
          value: "service"
        },
        {
          name: "Product",
          value: "product"
        },
        {
          name: "Package",
          value: "package"
        },
        {
          name: "Service Category",
          value: "service_category"
        },
        {
          name: "Product Category",
          value: "product_category"
        }
      ],
      stylist_option: [],
      customer_option: [],
      item_option: [],
      sales_summary_grouping_option: [{
          name: 'Summarize all records',
          code: 'all'
        },
        {
          name: 'Daily',
          code: 'daily'
        },
        {
          name: 'Weekly',
          code: 'weekly'
        },
        {
          name: 'Monthly',
          code: 'monthly'
        },
        {
          name: 'Yearly',
          code: 'Yearly'
        },

      ],
      list: [],
      headers: [],
      columns: [],
      page: 1,
      pageCount: 1,
      reportObj: {},
      report_id: "",
      report_name: "",
      report_desc: "",
      report_cat: "",
      report_field_desc: null,
      item_id: "",
      item_id_type: "",
      sales_summary_grouping: "",
      start_time_report: moment().format("YYYY-MM-DD"),
      end_time_report: moment().format("YYYY-MM-DD"),
      selected_stylist: "",
      selected_customer: "",
      available_params: {
        start_time_report: false,
        end_time_report: false,
        report_id: false,
        stylist_id: false,
        customer_id: false,
        item_id_type: false,
        item_id: false
      },
      params: {},
      tablekey: 1
    };
  },
  computed: {
    bindings() {
      return {
        showSearchFilter: false,
        showPerPage: false,
        showEntriesInfo: false,
        columns: this.columns,
        data: this.list,
        defaultPerPage: 50,
        showPagination: false,
        showDownloadButton: false
      };
    }
  },
  created() {
    this.$schedsdk.getReportsList({}).then(res => {
      if (res.status == 1) {
            let that = this
            this.options = res.data;
            this.options.forEach(element => {
          if (element.report_id == 'sales_summary_report') {
                    that.reportObj = element;
                    that.setReportData()
                    return
                }
            });
        }
    });
    
    this.setStartDate();
    this.setEndDate();
  },
  methods: {
    getLabels() {
      return this.columns.reduce((acc, cur) => ({ ...acc, [cur.data]: cur.title }), {})
    },
    getDateRangeTimeStamps(dt_range_string) {
        return utils_lib.getFPickDateRangeTimeStamps(dt_range_string, this.$store.state.business_settings.business_time_zone)
    },
    QdCheckChange() {
        //
        let curr = moment(Date.now())
      if (this.QdSelectOption) {
            let operation = "";
            let op_val = 1;
        switch (this.QdSelectOption.code) {
                case "last_full_week":
                        operation = "week";
                        break;
                case "last_full_month":
                        operation = "month";
                        break;
                case "last_3_month":
                        operation = "month";
                        op_val = 3;
                        break;
                case "last_6_month":
                        operation = "month";
                        op_val = 6;                        
                        break;
                case "last_12_month":
                        operation = "month";
                        op_val = 12;                        
                        break;
                case "last_calendar_year":
                        operation = "year";
                        op_val = 1;                        
                        break;
                default:
                    console.log( "unkowns qdselect code " + this.QdSelectOption.code);
            }
        if (operation) {
                let newcurr = moment(Date.now()).subtract(op_val, operation).startOf(operation);
                this.select_date_range = newcurr.format("YYYY-MM-DD") +
                                         " to " + 
                                         moment(Date.now()).subtract(1, operation).endOf(operation).format("YYYY-MM-DD");
            }
            
            //

        }
 
    },
    setStartDate() {
        let dt_range = this.getDateRangeTimeStamps(this.select_date_range + "");
        
        this.params.start_time_report = dt_range.start_ts;
        this.params.end_time_report = dt_range.end_ts;
     
    },
    setEndDate() {
      this.params.end_time_report = moment
        .tz(
          this.end_time_report + " " + "23:59",
          this.$store.state.business_settings.business_time_zone
        )
        .valueOf();
    },
    setCustomer(value) {
      this.params.customer_id = value._id;
    },
    setStylist(value) {
      this.params.stylist_id = value._id;
    },
    setItemType(value) {
      this.params.item_id_type = value.value;
      this.getItemOptions(value.value);
    },
    setItem(value) {
      this.params.item_id = value._id;
    },
    setSalesSummaryGrouping(value) {
      if (value) {
            this.params.sales_summary_grouping = value.code;
        }
      else {
            this.params.sales_summary_grouping = "all"
        }
      
    },
    
    getItemOptions(value) {
      let ref;
      if (value == "service") {
        ref = this.$schedsdk.list_services({});
      }
      else if (value == "product") {
        ref = this.$schedsdk.get_products_list({});
      }
      else if (value == "package") {
        ref = this.$schedsdk.get_packages_list({});
      }
      else if (value == "service_category") {
        ref = this.$schedsdk.get_service_categories({page_no:1});
      }
      else if (value == "product_category") {
        ref = this.$schedsdk.get_product_category({});
      }
      ref.then(res => {
        if (res.status == 1) {
          if (value == "package") {
            if (res.data.length) {
              res.data.map(obj => {
                obj.name = obj.package_name;
                return obj;
              });
            }
          }
          this.item_option = res.data;
        }
        else this.item_option = [];
      });
    },
    onSearch(search, loading) {
      loading(true);
      this.search(loading, search, this);
    },
    search: lodash_debounce((loading, search, vm) => {
      vm.$schedsdk.getReportsList(search).then(res => {
        if (res.status == 1) vm.options = res.data;
        else vm.options = [];
        loading(false);
      });
    }, 300),
    StylistSearch(search, loading) {
      loading(true);
      this.search_stylist(loading, search, this);
    },
    search_stylist: lodash_debounce((loading, search, vm) => {
      vm.$schedsdk.get_users_list({}).then(res => {
        // console.log(res.data)
        if (res.status == 1) vm.stylist_option = res.data;
        else vm.stylist_option = [];
        loading(false);
      });
    }, 300),
    CustomerSearch(search, loading) {
      loading(true);
      this.search_customer(loading, search, this);
    },
    search_customer: lodash_debounce((loading, search, vm) => {
      vm.$schedsdk.getCustomerList({}).then(res => {
        // console.log(res.data)
        if (res.status == 1) vm.customer_option = res.data;
        else vm.customer_option = [];
        loading(false);
      });
    }, 300),
    ItemSearch(search, loading) {
      loading(true);
      this.search_item(loading, search, this);
    },
    search_item: lodash_debounce((loading, search, vm) => {
      if (vm.item_id_type.value && vm.item_id_type.value != "") {
        let ref;
        if (vm.item_id_type.value == "service") {
          ref = vm.$schedsdk.list_services({});
        }
        else if (vm.item_id_type.value == "product") {
          ref = vm.$schedsdk.get_products_list({});
        }
        else if (vm.item_id_type.value == "package") {
          ref = vm.$schedsdk.get_packages_list({});
        }
        else if (vm.item_id_type.value == "service_category") {
          ref = vm.$schedsdk.get_service_categories({page_no:1});
        }
        else if (vm.item_id_type.value == "product_category") {
          ref = vm.$schedsdk.get_product_category({});
        }
        ref.then(res => {
          if (res.status == 1) {
            if (vm.item_id_type.value == "package") {
              if (res.data.length) {
                res.data.map(obj => {
                  obj.name = obj.package_name;
                  return obj;
                });
              }
            }
            vm.item_option = res.data;
          }
          else vm.item_option = [];
          loading(false);
        });
      }
    }, 300),
    setReportData() {
      try {
        this.report_id = this.reportObj.report_id;
        this.report_name = this.reportObj.report_name;
        this.report_desc = this.reportObj.report_description;
        this.report_cat = this.reportObj.report_category_name;
        this.report_field_desc = this.reportObj.field_definitions || null;
        this.available_params = {
          start_time_report: false,
          end_time_report: false,
          report_id: false,
          stylist_id: false,
          customer_id: false,
          item_id_type: false,
          item_id: false
        };
        for (let a = 0; a < this.reportObj.available_params.length; a++) {
          this.available_params[this.reportObj.available_params[a]] = true;
        }
      }
      catch (err) {
        console.log(err);
      }
    },
    getReportList() {
      (this.params.user_id = this.$store.state.user_data._id),
        (this.params.business_id = this.$store.state.user_data.business_id);
        (this.params.page_number = this.page);
      let valid = true;
      let message = "";
      for (let r = 0; r < this.reportObj.required_params.length; r++) {
        let r_param = this.reportObj.required_params[r];
        if (this.params[r_param] == undefined) {
          message = "Please select " + r_param;
          valid = false;
          break;
        }
      }
      // console.log("valid : ", valid)
      if (valid) {
        this.list = [];
        if (this.report_id != "") {
          this.params.report_id = this.report_id;
          let api_ref = "";
          if (this.report_id == "new_bookings") {
            api_ref = this.$schedsdk.booking_report(this.params);
          }
          if (this.report_id == "completed_bookings") {
            api_ref = this.$schedsdk.booking_report(this.params);
          }
          if (this.report_id == "new_customers") {
            api_ref = this.$schedsdk.customer_report(this.params);
          }
          if (this.report_id == "new_customers_owner") {
            api_ref = this.$schedsdk.customer_report(this.params);
          }
          if (this.report_id == "returning_customers") {
            api_ref = this.$schedsdk.customer_report(this.params);
          }
          if (this.report_id == "returning_customers_owner") {
            api_ref = this.$schedsdk.customer_report(this.params);
          }
          if (this.report_id == "all_bookings_all_users") {
            api_ref = this.$schedsdk.all_booking_report(this.params);
          }
          if (this.report_id == "completed_bookings_owner") {
            api_ref = this.$schedsdk.all_booking_report(this.params);
          }
          if (this.report_id == "all_bookings_stylist_name_here_id") {
            api_ref = this.$schedsdk.all_booking_report(this.params);
          }
          if (this.report_id == "performance_bonus_report") {
            api_ref = this.$schedsdk.performance_bonus_report(this.params);
          }
          if (this.report_id == "performance_bonus_employee_report") {
            api_ref = this.$schedsdk.performance_bonus_report(this.params);
          }
          if (this.report_id == "incoming_revenue_owner_by_stylist") {
            api_ref = this.$schedsdk.revenue_report(this.params);
          }
          if (this.report_id == "incoming_revenue_stylist_by_stylist") {
            api_ref = this.$schedsdk.revenue_report(this.params);
          }
          if (this.report_id == "top_selling_owner_services") {
            api_ref = this.$schedsdk.top_item_report(this.params);
          }
          if (this.report_id == "top_selling_stylist_services") {
            api_ref = this.$schedsdk.top_item_report(this.params);
          }
          if (this.report_id == "valuation_report") {
            api_ref = this.$schedsdk.valuation_report(this.params);
          }
          if (this.report_id == "inventory_sold_report") {
            api_ref = this.$schedsdk.inventory_report(this.params);
          }
           if (this.report_id == "sales_summary_report") {
            api_ref = this.$schedsdk.sales_summary_report(this.params);
          }
           if (this.report_id == "clover_register_sched_app_tax_reconcilination_report") {
            api_ref = this.$schedsdk.clover_and_app_reconcilination_report(this.params);
          }
          if (this.report_id == "invoice_customer_payment_transactions_raw") {
            api_ref = this.$schedsdk.invoice_customer_payment_transactions_raw(this.params);
          }
          if(this.report_id == "messaging_all_credits_usage_raw")
          {
            api_ref = this.$schedsdk.messaging_all_credits_usage_raw(this.params);
          }
          //console.log(this.report_id)
          if (api_ref != null) 
          {
            api_ref.then(result => 
            {
              this.list = result.data.report;
              if (result.data.total_pages)
                this.pageCount = result.data.total_pages;
              if (this.list.length) {
                this.headers = Object.keys(this.list[0]);
                this.columns = this.headers.map(h => {
                  return {
                    title: h.replaceAll('_', ' '),
                    data: h,
                  };
                });
                this.getReportCsv();
              }
              else {
                alert("No Report found.");
              }
              this.tablekey++;
            });
          }
          else {
            alert("Feature is under development: " + this.report_id);
          }
        }
      }
      else {
        alert(message);
      }
    },
    getReportCsv() {
      (this.params.user_id = this.$store.state.user_data._id),
        (this.params.business_id = this.$store.state.user_data.business_id);
        (this.params.page_number = this.page);
      let valid = true;
      let message = "";
      for (let r = 0; r < this.reportObj.required_params.length; r++) {
        let r_param = this.reportObj.required_params[r];
        if (this.params[r_param] == undefined) {
          message = "Please select " + r_param;
          valid = false;
          break;
        }
      }
      if (valid) {
        if (this.report_id != "") {
            this.params.report_id = this.report_id;
            this.params.display_target = 'web';
            this.$schedsdk.report_csv(this.params).then(result => {
              this.csv_data = result.data.report;
            });
        }
      }
      else {
        alert(message);
      }
    },
    setPage(pageNo) {
      this.page = pageNo;
      this.getReportList();
    },
    resetSelection() {
      this.stylist_option = [];
      this.customer_option = [];
      this.item_option = [];
      this.list = [];
      this.headers = [];
      this.page = 1;
      this.pageCount = 1;
      this.reportObj = {};
      this.report_id = "";
      this.report_name = "";
      this.report_desc = "";
      this.report_cat = "";
      this.report_field_desc = null;
      this.item_id = "";
      this.item_id_type = "";
      this.start_time_report = moment().format("YYYY-MM-DD");
      this.end_time_report = moment().format("YYYY-MM-DD");
      this.selected_stylist = "";
      this.selected_customer = "";
      (this.available_params = {
        start_time_report: false,
        end_time_report: false,
        report_id: false,
        stylist_id: false,
        customer_id: false,
        item_id_type: false,
        item_id: false
      }),
        (this.params = {});
    }
  }
};
</script>
<style scoped>
.section_1 {
  /*background: white;*/
  padding: 10px;
}
.selectreport {
 float: left;
    width: 100%;
    position: relative;
    padding-right: 30px;
}
a.info.btn {
    position: absolute !important;
    top: 0;
    right: 0;
    width: auto;
    left: auto;
    margin: 0;
    padding: 0;
}
span.vs__selected {
    margin: 4px 0px 0;
}
.csv-btn {
  float: right;
}
</style>

