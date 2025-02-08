<template>
    <div>
        <CRow>
            <CCol sm="12">
                <form id="filter_form">
                    <div class="form-body">
                        <div class="form-body">
                            <div class="section_1">
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label">
                                                <b>Select Report</b>
                                            </label>
                                            <v-select
                                                v-model="reportObj"
                                                label="report_name"
                                                :options="options"
                                                @search="onSearch"
                                                @input="setReportData"
                                            >
                                                <template v-slot:no-options
                                                    >Type to search Report
                                                    name..</template
                                                >
                                                <template
                                                    v-slot:option="option"
                                                >
                                                    <div class="d-center">
                                                        {{ option.report_name }}
                                                    </div>
                                                </template>
                                                <template
                                                    v-slot:selected-option="option"
                                                >
                                                    <div
                                                        class="selected d-center"
                                                    >
                                                        {{ option.report_name }}
                                                    </div>
                                                </template>
                                            </v-select>
                                        </div>
                                    </div>
                                    <div class="col-md-4"></div>
                                    <div class="col-md-4">
                                        <download-csv
                                            v-if="list.length"
                                            :data="list"
                                        >
                                            Download Data
                                            <img
                                                style="height=50px; width:50px;"
                                                src="/img/csv.png"
                                            />
                                        </download-csv>
                                    </div>
                                </div>
                            </div>
                            <br />

                            <div class="row">
                                <div class="col-md-6" v-if="report_name != ''">
                                    <div class="section_1">
                                        <label
                                            style="margin-right: 3px"
                                            class="control-label"
                                        >
                                            <b>Name:</b>
                                        </label>
                                        {{ report_name }}
                                    </div>
                                </div>
                                <div class="col-md-6" v-if="report_cat != ''">
                                    <div class="section_1">
                                        <label
                                            style="margin-right: 3px"
                                            class="control-label"
                                        >
                                            <b>Category:</b>
                                        </label>
                                        {{ report_cat }}
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div class="row">
                                <div class="col-md-12" v-if="report_desc != ''">
                                    <div class="section_1">
                                        <label
                                            style="margin-right: 3px"
                                            class="control-label"
                                        >
                                            <b>Description:</b>
                                        </label>
                                        {{ report_desc }}
                                    </div>
                                    <br />
                                </div>
                            </div>
                            <div
                                class="section_1"
                                v-if="
                                    available_params.start_time_report ||
                                    available_params.end_time_report ||
                                    available_params.customer_id ||
                                    available_params.stylist_id ||
                                    available_params.item_id_type
                                "
                            >
                                <div class="row">
                                    <div
                                        class="col-md-3"
                                        v-if="
                                            available_params.start_time_report
                                        "
                                    >
                                        <div class="form-group">
                                            <label class="control-label">
                                                <b>Begin Date</b>
                                            </label>
                                            <input
                                                class="form-control placeholder-no-fix"
                                                @input="setStartDate"
                                                type="date"
                                                v-model="start_time_report"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div
                                        class="col-md-3"
                                        v-if="available_params.end_time_report"
                                    >
                                        <div class="form-group">
                                            <label class="control-label">
                                                <b>End Date</b>
                                            </label>
                                            <input
                                                class="form-control placeholder-no-fix"
                                                @input="setEndDate"
                                                type="date"
                                                v-model="end_time_report"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        class="col-md-3"
                                        v-if="available_params.customer_id"
                                    >
                                        <div class="form-group">
                                            <label class="control-label">
                                                <b>Customer</b>
                                            </label>
                                            <v-select
                                                v-model="selected_customer"
                                                label="first_name"
                                                :options="customer_option"
                                                @input="setCustomer"
                                                @search="CustomerSearch"
                                            >
                                                <template v-slot:no-options
                                                    >Type Customer
                                                    name..</template
                                                >
                                                <template
                                                    v-slot:option="option"
                                                >
                                                    <div class="d-center">
                                                        {{ option.first_name }}
                                                        {{ option.last_name }}
                                                    </div>
                                                </template>
                                                <template
                                                    v-slot:selected-option="option"
                                                >
                                                    <div
                                                        class="selected d-center"
                                                    >
                                                        {{ option.first_name }}
                                                        {{ option.last_name }}
                                                    </div>
                                                </template>
                                            </v-select>
                                        </div>
                                    </div>
                                    <div
                                        class="col-md-3"
                                        v-if="available_params.stylist_id"
                                    >
                                        <div class="form-group">
                                            <label class="control-label">
                                                <b>Stylist</b>
                                            </label>
                                            <v-select
                                                v-model="selected_stylist"
                                                label="first_name"
                                                @input="setStylist"
                                                :options="stylist_option"
                                                @search="StylistSearch"
                                            >
                                                <template v-slot:no-options
                                                    >Type Stylist
                                                    name..</template
                                                >
                                                <template
                                                    v-slot:option="option"
                                                >
                                                    <div class="d-center">
                                                        {{ option.first_name }}
                                                        {{ option.last_name }}
                                                    </div>
                                                </template>
                                                <template
                                                    v-slot:selected-option="option"
                                                >
                                                    <div
                                                        class="selected d-center"
                                                    >
                                                        {{ option.first_name }}
                                                        {{ option.last_name }}
                                                    </div>
                                                </template>
                                            </v-select>
                                        </div>
                                    </div>
                                    <div
                                        class="col-md-3"
                                        v-if="available_params.item_id_type"
                                    >
                                        <div class="form-group">
                                            <label class="control-label">
                                                <b>Item Type</b>
                                            </label>
                                            <v-select
                                                v-model="item_id_type"
                                                @input="setItemType"
                                                label="name"
                                                :options="type_option"
                                            >
                                                <template v-slot:no-options
                                                    >Select item type
                                                    ..</template
                                                >
                                                <template
                                                    v-slot:option="option"
                                                >
                                                    <div class="d-center">
                                                        {{ option.name }}
                                                    </div>
                                                </template>
                                                <template
                                                    v-slot:selected-option="option"
                                                >
                                                    <div
                                                        class="selected d-center"
                                                    >
                                                        {{ option.name }}
                                                    </div>
                                                </template>
                                            </v-select>
                                        </div>
                                    </div>
                                    <div
                                        class="col-md-3"
                                        v-if="available_params.item_id"
                                    >
                                        <div class="form-group">
                                            <label class="control-label">
                                                <b>Item</b>
                                            </label>
                                            <v-select
                                                v-model="item_id"
                                                label="name"
                                                @input="setItem"
                                                :options="item_option"
                                                @search="ItemSearch"
                                            >
                                                <template v-slot:no-options
                                                    >Type Item name</template
                                                >
                                                <template
                                                    v-slot:option="option"
                                                >
                                                    <div class="d-center">
                                                        {{ option.name }}
                                                    </div>
                                                </template>
                                                <template
                                                    v-slot:selected-option="option"
                                                >
                                                    <div
                                                        class="selected d-center"
                                                    >
                                                        {{ option.name }}
                                                    </div>
                                                </template>
                                            </v-select>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div class="row">
                                    <div class="col-md-5"></div>
                                    <div class="col-md-1">
                                        <button
                                            id="filter"
                                            @click="getReportList"
                                            class="btn btn-primary btn-danger btn-sm"
                                            type="button"
                                            title="Filter"
                                        >
                                            Filter
                                        </button>
                                    </div>
                                    <div class="col-md-1">
                                        <button
                                            id="clear"
                                            @click="resetSelection"
                                            class="btn btn-primary btn-primary btn-sm clear_form"
                                            type="button"
                                            title="Reset"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                    <div class="col-md-5"></div>
                                </div>
                            </div>
                            <br />

                            <div class="row" v-if="list.length">
                                <table
                                    class="table table-bordered table-hover"
                                    v-if="list.length"
                                >
                                    <thead>
                                        <tr>
                                            <th v-for="h in headers" :key="h">
                                                {{ h }}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in list" :key="item">
                                            <td v-for="th in headers" :key="th">
                                                {{ item[th] }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
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
                    <br />
                </form>
                <br />
            </CCol>
        </CRow>
    </div>
</template>

<script>
import moment from 'moment-timezone'
import Pagination from '@/common/Pagination'
import {debounce as lodash_debounce} from 'lodash'
import JsonCSV from 'vue-json-csv'

export default {
    name: 'TopSelling',
    components: {Pagination, 'download-csv': JsonCSV},
    data() {
        return {
            options: [],
            type_option: [
                {name: 'Service', value: 'service'},
                {name: 'Product', value: 'product'},
                {name: 'Package', value: 'package'},
                {name: 'Service Category', value: 'service_category'},
                {name: 'Product Category', value: 'product_category'},
            ],
            stylist_option: [],
            customer_option: [],
            item_option: [],
            list: [],
            headers: [],
            page: 1,
            pageCount: 1,
            reportObj: {},
            report_id: '',
            report_name: '',
            report_desc: '',
            report_cat: '',
            item_id: '',
            item_id_type: '',
            start_time_report: moment().format('YYYY-MM-DD'),
            end_time_report: '',
            selected_stylist: '',
            selected_customer: '',
            available_params: {
                start_time_report: false,
                end_time_report: false,
                report_id: false,
                stylist_id: false,
                customer_id: false,
                item_id_type: false,
                item_id: false,
            },
            params: {},
        }
    },
    computed: {
        bindings() {
            return {
                //  actionMode: "multiple",
                showSearchFilter: false,
                showPerPage: false,
                showEntriesInfo: false,
                columns: this.columns,
                data: this.list,
                defaultPerPage: 50,
                showPagination: false,
            }
        },
    },
    created() {
        this.$schedsdk.getReportsList({}).then((res) => {
            if (res.status == 1) {
                this.options = res.data
            }
        })
    },
    methods: {
        setStartDate() {
            this.params.start_time_report = moment
                .tz(
                    this.start_time_report + ' ' + '00:01',
                    this.$store.state.business_settings.business_time_zone,
                )
                .valueOf()
        },
        setEndDate() {
            this.params.end_time_report = moment
                .tz(
                    this.end_time_report + ' ' + '23:59',
                    this.$store.state.business_settings.business_time_zone,
                )
                .valueOf()
        },
        setCustomer(value) {
            this.params.customer_id = value._id
        },
        setStylist(value) {
            this.params.stylist_id = value._id
        },
        setItemType(value) {
            this.params.item_id_type = value.value
            this.getItemOptions(value.value)
        },
        setItem(value) {
            this.params.item_id = value._id
        },
        getItemOptions(value) {
            let ref
            if (value == 'service') {
                ref = this.$schedsdk.list_services({})
            } else if (value == 'product') {
                ref = this.$schedsdk.get_products_list({})
            } else if (value == 'package') {
                ref = this.$schedsdk.get_packages_list({})
            } else if (value == 'service_category') {
                ref = this.$schedsdk.get_service_categories({page_no:1})
            } else if (value == 'product_category') {
                ref = this.$schedsdk.get_product_category({})
            }
            ref.then((res) => {
                if (res.status == 1) {
                    if (value == 'package') {
                        if (res.data.length) {
                            res.data.map((obj) => {
                                obj.name = obj.package_name
                                return obj
                            })
                        }
                    }
                    this.item_option = res.data
                } else this.item_option = []
            })
        },
        onSearch(search, loading) {
            loading(true)
            this.search(loading, search, this)
        },
        search: lodash_debounce((loading, search, vm) => {
            vm.$schedsdk.getReportsList(search).then((res) => {
                if (res.status == 1) vm.options = res.data
                else vm.options = []
                loading(false)
            })
        }, 300),
        StylistSearch(search, loading) {
            loading(true)
            this.search_stylist(loading, search, this)
        },
        search_stylist: lodash_debounce((loading, search, vm) => {
            vm.$schedsdk.get_users_list({}).then((res) => {
                // console.log(res.data)
                if (res.status == 1) vm.stylist_option = res.data
                else vm.stylist_option = []
                loading(false)
            })
        }, 300),
        CustomerSearch(search, loading) {
            loading(true)
            this.search_customer(loading, search, this)
        },
        search_customer: lodash_debounce((loading, search, vm) => {
            vm.$schedsdk.getCustomerList({}).then((res) => {
                // console.log(res.data)
                if (res.status == 1) vm.customer_option = res.data
                else vm.customer_option = []
                loading(false)
            })
        }, 300),
        ItemSearch(search, loading) {
            loading(true)
            this.search_item(loading, search, this)
        },
        search_item: lodash_debounce((loading, search, vm) => {
            if (vm.item_id_type.value && vm.item_id_type.value != '') {
                let ref
                if (vm.item_id_type.value == 'service') {
                    ref = vm.$schedsdk.list_services({})
                } else if (vm.item_id_type.value == 'product') {
                    ref = vm.$schedsdk.get_products_list({})
                } else if (vm.item_id_type.value == 'package') {
                    ref = vm.$schedsdk.get_packages_list({})
                } else if (vm.item_id_type.value == 'service_category') {
                    ref = vm.$schedsdk.get_service_categories({page_no:1})
                } else if (vm.item_id_type.value == 'product_category') {
                    ref = vm.$schedsdk.get_product_category({})
                }
                ref.then((res) => {
                    if (res.status == 1) {
                        if (vm.item_id_type.value == 'package') {
                            if (res.data.length) {
                                res.data.map((obj) => {
                                    obj.name = obj.package_name
                                    return obj
                                })
                            }
                        }
                        vm.item_option = res.data
                    } else vm.item_option = []
                    loading(false)
                })
            }
        }, 300),
        setReportData() {
            try {
                this.report_id = this.reportObj.report_id
                this.report_name = this.reportObj.report_name
                this.report_desc = this.reportObj.report_description
                this.report_cat = this.reportObj.report_category_name
                this.available_params = {
                    start_time_report: false,
                    end_time_report: false,
                    report_id: false,
                    stylist_id: false,
                    customer_id: false,
                    item_id_type: false,
                    item_id: false,
                }
                for (
                    let a = 0;
                    a < this.reportObj.available_params.length;
                    a++
                ) {
                    this.available_params[
                        this.reportObj.available_params[a]
                    ] = true
                }
            } catch (err) {
                console.log(err)
            }
        },
        getReportList() {
            ;(this.params.user_id = this.$store.state.user_data._id),
                (this.params.user_id = this.$store.state.user_data.business_id)
            let valid = true
            let message = ''
            for (let r = 0; r < this.reportObj.required_params.length; r++) {
                let r_param = this.reportObj.required_params[r]
                if (this.params[r_param] == undefined) {
                    message = 'Please select ' + r_param
                    valid = false
                    break
                }
            }
            // console.log("valid : ", valid)
            if (valid) {
                if (this.report_id != '') {
                    let api_ref = ''
                    if (this.report_id == 'performance_bonus_report') {
                        api_ref = this.$schedsdk.performance_bonus_report(
                            this.params,
                        )
                    }
                    if (this.report_id == 'performance_bonus_employee_report') {
                        api_ref = this.$schedsdk.performance_bonus_report(
                            this.params,
                        )
                    }
                    if (this.report_id == 'incoming_revenue_owner_by_stylist') {
                        api_ref = this.$schedsdk.revenue_report(this.params)
                    }
                    if (
                        this.report_id == 'incoming_revenue_stylist_by_stylist'
                    ) {
                        api_ref = this.$schedsdk.revenue_report(this.params)
                    }
                    if (this.report_id == 'top_selling_owner_services') {
                        api_ref = this.$schedsdk.top_item_report(this.params)
                    }
                    if (this.report_id == 'top_selling_stylist_services') {
                        api_ref = this.$schedsdk.top_item_report(this.params)
                    }
                    if (this.report_id == 'valuation_report') {
                        api_ref = this.$schedsdk.valuation_report(this.params)
                    }
                    if (this.report_id == 'inventory_sold_report') {
                        api_ref = this.$schedsdk.inventory_report(this.params)
                    }
                    if (api_ref != '') {
                        api_ref.then((result) => {
                            this.list = result.data.report
                            if (result.data.total_pages)
                                this.pageCount = result.data.total_pages
                            if (this.list.length) {
                                this.headers = Object.keys(this.list[0])
                            } else {
                                alert('No Report found.')
                            }
                        })
                    } else {
                        alert('Feature is under development')
                    }
                }
            } else {
                alert(message)
            }
        },
        setPage(pageNo) {
            this.page = pageNo
            this.getReportList()
        },
        resetSelection() {
            this.stylist_option = []
            this.customer_option = []
            this.item_option = []
            this.list = []
            this.headers = []
            this.page = 1
            this.pageCount = 1
            this.reportObj = {}
            this.report_id = ''
            this.report_name = ''
            this.report_desc = ''
            this.report_cat = ''
            this.item_id = ''
            this.item_id_type = ''
            this.start_time_report = moment().format('YYYY-MM-DD')
            this.end_time_report = ''
            this.selected_stylist = ''
            this.selected_customer = ''
            ;(this.available_params = {
                start_time_report: false,
                end_time_report: false,
                report_id: false,
                stylist_id: false,
                customer_id: false,
                item_id_type: false,
                item_id: false,
            }),
                (this.params = {})
        },
    },
}
</script>
<style scoped>
.section_1 {
    /*background: white;*/
    padding: 10px;
}
</style>
