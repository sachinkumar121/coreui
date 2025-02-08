<template>
    <div class="pt-2">
        <div class="row controls-div mb-3">
            <div class="settings-text">Filter Options</div>
            <div class="col-md-4 col-lg-3">
                <div class="form-group">
                    <label class="control-label"
                        ><b>Search: Package Name</b></label
                    >
                    <input
                        v-model="search"
                        class="form-control placeholder-no-fix"
                        @keyup="getItemList()"
                        type="text"
                    />
                </div>
            </div>
            <div class="col-md-4 col-lg-3">
                <div class="form-group">
                    <label class="control-label"
                        ><b>Search: Redeem Code</b></label
                    >
                    <input
                        v-model="search_package_redeem_code"
                        class="form-control placeholder-no-fix"
                        @keyup="getItemList()"
                        type="text"
                    />
                </div>
            </div>
            <div class="col-md-4 col-lg-3 mb-3">
                <div class="form-group mb-0">
                    <label class="control-label"
                        ><b>Purchase Date Range</b> &nbsp;
                        <span @click="clearDate()">clear</span></label
                    >
                    <flat-pickr
                        v-model="select_date_range"
                        :config="date_range_picker_config"
                        placeholder="Date Range"
                        @input="getItemList"
                    ></flat-pickr>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <input
                    type="checkbox"
                    class="form-check-input"
                    v-model="show_used_up_packages"
                    @change="getItemList()"
                />&nbsp;
                <label class="control-label">
                    <b>Include used up packages </b>
                </label>
                <br />
                <input
                    type="checkbox"
                    class="form-check-input"
                    v-model="show_incomplete_packages"
                    @change="getItemList()"
                />&nbsp;
                <label class="control-label">
                    <b>Include purchase incomplete </b>
                </label>
               
                
            </div>
        </div>
        <!-- <div class="row">
            <div class="col-md-2">
                <label class="control-label"><b>Searching...</b></label>
            </div>
        </div> -->
        <div>
            <h6>Purchased Packages</h6>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Items</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody v-if="list.length">
                        <tr v-for="item in list" :key="item._id">
                            <td>
                                <b>{{ item.package_name }}</b
                                ><br />
                                Redeem Code: <b>{{ item.redemption_code }}</b
                                ><br />
                                <span
                                    v-if="getCustomerValid(item)"
                                    @click="
                                        $router.push({
                                            name: 'CustomersEdit',
                                            params: {
                                                customer_id:
                                                    item.assigned_customer_data
                                                        ._id,
                                            },
                                        })
                                    "
                                >
                                    Assigned to
                                    {{ item.assigned_customer_data.first_name }}
                                    {{ item.assigned_customer_data.last_name }}
                                    <br />
                                    <small
                                        v-if="item.is_purchase_complete == true"
                                        >Purchased:
                                        {{
                                            getFormattedDateNoTime(
                                                item.active_date,
                                            )
                                        }}</small
                                    >
                                    <small v-else
                                        >Ordered:
                                        {{
                                            getFormattedDateNoTime(
                                                item.active_date,
                                            )
                                        }}</small
                                    >

                                    <br />
                                    <small
                                        v-if="item.is_purchase_complete == true"
                                        >Price: {{ currency_symbol
                                        }}{{ item.package_sold_price }},
                                        Balance: {{ currency_symbol
                                        }}{{
                                            roundto2digits(
                                                item.package_unredeemed_value,
                                            )
                                        }}</small
                                    >
                                    <small v-else>Not yet paid</small>
                                </span>
                            </td>

                            <td>
                                <table
                                    v-if="
                                        item.package_items != null &&
                                        item.package_items.length > 0
                                    "
                                    class="table table-bordered"
                                >
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Purchased Qty</th>
                                            <th>Balance Qty</th>
                                            <th>Pkg. Unit Price</th>
                                        </tr>
                                    </thead>

                                    <tr
                                        v-for="packitem in item.package_items"
                                        :key="packitem._id"
                                    >
                                        <td>{{ packitem.copied_item_name }}</td>
                                        <td>
                                            {{
                                                packitem.qty_allowed_in_package
                                            }}
                                        </td>
                                        <td>{{ packitem.qty_available }}</td>
                                        <td>
                                            {{ currency_symbol
                                            }}{{
                                                roundto2digits(
                                                    packitem.item_package_price,
                                                )
                                            }}
                                        </td>
                                    </tr>
                                </table>
                            </td>

                            <td>
                                <button
                                    v-if="for_business_customer == true"
                                    class="btn btn-primary btn-sm mb-1"
                                    @click="
                                        $router.push(
                                            '/invoices/detail/' +
                                                item.src_invoice_number,
                                        )
                                    "
                                >
                                    Invoice {{ item.src_invoice_number }}
                                </button>
                                &nbsp;
                                <button
                                    v-if="for_business_customer == true"
                                    class="btn btn-info btn-sm mb-1"
                                    @click="showRedeemCodeDialog(item)"
                                >
                                    Send Redeem code
                                </button>
                                &nbsp;
                                <button
                                    class="btn btn-warning btn-sm mb-1"
                                    @click="doShowPackageUsage(item)"
                                >
                                    Show Usage
                                </button>
                                &nbsp;
                                <!-- <button v-if="item.is_purchase_complete == false" class="btn btn-danger btn-sm" 
                    @click="doCancelPackage(item)">Cancel</button>     -->
                                &nbsp;
                                <button
                                    v-if="
                                        for_business_customer == false &&
                                        item.package_unredeemed_value > 0.001
                                    "
                                    class="btn btn-success btn-sm mb-1"
                                    @click="doConsumePackage(item)"
                                >
                                    Consume Credits
                                </button>
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
                                        No purchased packages Found
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
                :ariaLabel="'Purchase Packages results pages'"
                :activePage.sync="page"
                :pages="pageCount"
                @update:activePage="setPage"
            />

            <CModal :visible="show_send_redeem_code">
                <CModalHeader>
                    <CModalTitle>Send Package Redeem Codes</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div class="row">
                        <div class="col-md-12">
                            Send Package Redeem Code ({{ src_d_redeem_code }}).
                            Currently assigned to {{ src_assigned_to_name }}
                        </div>
                    </div>
                    <br />

                    <div class="row">
                        <div class="col-md-4">First Name</div>
                        <div class="col-md-8">
                            <input
                                v-model="src_first_name"
                                class="form-control placeholder-no-fix"
                                type="text"
                            />
                        </div>
                    </div>
                    <br />

                    <div class="row">
                        <div class="col-md-4">Last Name</div>
                        <div class="col-md-8">
                            <input
                                v-model="src_last_name"
                                class="form-control placeholder-no-fix"
                                type="text"
                            />
                        </div>
                    </div>
                    <br />
                    <div class="row">
                        <div class="col-md-4">E-Mail</div>
                        <div class="col-md-8">
                            <input
                                v-model="src_email"
                                class="form-control placeholder-no-fix"
                                type="text"
                            />
                        </div>
                    </div>
                    <br />
                    <div class="row">
                        <div class="col-md-4">Phone</div>
                        <div class="col-md-8">
                            <input
                                v-model="src_phone"
                                class="form-control placeholder-no-fix"
                                type="text"
                            />
                        </div>
                    </div>
                    <br />
                    <div class="row">
                        <div class="col-md-4">Personal Message</div>
                        <div class="col-md-8">
                            <input
                                v-model="src_personal_mesage"
                                class="form-control placeholder-no-fix"
                                type="text"
                            />
                        </div>
                    </div>
                    <br />

                    <div class="row">
                        <div class="col-md-12" color="danger">
                            <b> {{ error_message }}</b>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton
                        @click="show_send_redeem_code = false"
                        color="danger"
                        >Cancel</CButton
                    >
                    <CButton @click="sendRedeemCode()" color="success"
                        >Send</CButton
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

            <CModal :visible="show_cart">
                <CModalHeader>
                    <CModalTitle>Cart</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="table-responsive">
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Item Name</th>
                                            <th>Price</th>
                                            <th>Qty</th>
                                            <th>Extended Price</th>
                                        </tr>
                                    </thead>

                                    <tbody v-if="cart.items.length">
                                        <tr
                                            v-for="(item, index) in cart.items"
                                            :key="item._id"
                                        >
                                            <td>{{ item.item_name }}</td>
                                            <td>
                                                {{ currency_symbol
                                                }}{{
                                                    roundto2digits(
                                                        item.applied_unit_price,
                                                    )
                                                }}
                                            </td>
                                            <td>{{ item.item_qty }}</td>
                                            <td>
                                                {{ currency_symbol
                                                }}{{
                                                    roundto2digits(
                                                        item.applied_unit_price *
                                                            item.item_qty,
                                                    )
                                                }}
                                                <br />
                                                <a
                                                    href=""
                                                    @click.prevent="
                                                        removeItemFromCart(
                                                            index,
                                                        )
                                                    "
                                                    >Remove</a
                                                >
                                            </td>
                                        </tr>
                                        <tr
                                            v-for="item in cart.summary_lines"
                                            :key="item._id"
                                        >
                                            <td>{{ item.item_name }}</td>
                                            <td>
                                                {{ currency_symbol
                                                }}{{
                                                    roundto2digits(
                                                        item.applied_unit_price,
                                                    )
                                                }}
                                            </td>
                                            <td>{{ item.item_qty }}</td>
                                            <td>
                                                {{ currency_symbol
                                                }}{{
                                                    roundto2digits(
                                                        item.applied_unit_price *
                                                            item.item_qty,
                                                    )
                                                }}
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody v-else>
                                        <tr>
                                            <td
                                                colspan="10"
                                                class="text-center"
                                            >
                                                <div class="py-5">
                                                    <img
                                                        src="/img/no-result.svg"
                                                        alt=""
                                                        class="img-empty"
                                                    />
                                                    <p
                                                        class="h5 mt-4 d-block fw-normal"
                                                    >
                                                        No Packages Found
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div class="row">
                        <div class="col-md-12" color="danger">
                            <label class="control-label">
                                <b
                                    >Auto purchase when credits are less than 2? </b
                                >&nbsp;
                            </label>
                            <input
                                type="checkbox"
                                v-model="auto_recharge_agree"
                            />
                        </div>
                    </div>
                    <br />
                    <div class="row">
                        <div class="col-md-12" color="danger">
                            <b> {{ error_message }}</b>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton @click="continueToOneOffPurchase()" color="success"
                        >Continue to Payment</CButton
                    >
                    <CButton @click="show_cart = false" color="danger"
                        >Cancel</CButton
                    >
                </CModalFooter>
            </CModal>

            <CModal size="xl" :visible="show_package_usage">
                <CModalHeader>
                    <CModalTitle>Package Usage</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div class="table-responsive">
                        <h6>Package Used</h6>
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th>Value</th>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody
                                v-if="
                                    package_usage_data &&
                                    package_usage_data.items &&
                                    package_usage_data.items.length
                                "
                            >
                                <tr
                                    v-for="item in package_usage_data.items"
                                    :key="item._id"
                                >
                                    <td>{{ item.item_name }}</td>
                                    <td>{{ item.qty_used }}</td>
                                    <td>
                                        {{ currency_symbol
                                        }}{{ item.item_value_used }}
                                    </td>
                                    <td>
                                        <a
                                            href=""
                                            @click.prevent="
                                                $router.push(
                                                    getOrderLinkText(item).url,
                                                )
                                            "
                                            >{{
                                                getOrderLinkText(item).link_text
                                            }}</a
                                        >
                                    </td>
                                    <td>
                                        {{ getFormattedDate(item.use_date) }}
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="5">Summary</td>
                                </tr>
                                <tr>
                                    <td>
                                        Count:
                                        {{
                                            package_usage_data.summary
                                                .total_count
                                        }}
                                    </td>
                                    <td>
                                        {{
                                            package_usage_data.summary.total_qty
                                        }}
                                    </td>
                                    <td>
                                        {{ currency_symbol
                                        }}{{
                                            package_usage_data.summary
                                                .total_value
                                        }}
                                    </td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <tr>
                                    <td colspan="5">
                                        Package has not been used (no journal
                                        items found)
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <br />
                    <div class="row">
                        <div class="col-md-12" color="danger">
                            <b> </b>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton @click="closeShowPackageUsage()" color="success"
                        >OK</CButton
                    >
                </CModalFooter>
            </CModal>
        </div>
    </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import '../../assets/css/common.css'
import Pagination from '@/common/Pagination'
import moment from 'moment'
import utils_lib from '../../helpers/utils_lib'
export default {
    name: 'PastOrders',
    props: ['for_business_customer'],
    components: {Pagination, flatPickr},
    computed: {},
    data() {
        return {
            date_range_picker_config: {
                altFormat: 'F j, Y',
                altInput: true,
                mode: 'range',
                // noCalendar: true,
                // enableTime: true,
                // time_24hr: true
            },
            search: '',
            list: [],
            packages: [],
            csv_data: [],
            cart: {items: [], summary_lines: []},
            page: 1,
            pageCount: 1,
            show_cart: false,
            auto_recharge_agree: false,
            error_message: '',
            showDone: false,
            done_response: '',
            show_used_up_packages: false,
            show_incomplete_packages: false,
            currency_symbol:
                this.$store.state.business_settings.business_currency_symbol,
            show_send_redeem_code: false,
            src_d_redeem_code: '',
            src_d_purchased_package_id: '',
            src_first_name: '',
            src_last_name: '',
            src_email: '',
            src_phone: '',
            src_assigned_to_name: '',
            src_personal_mesage: '',
            src_invoice_number: '',
            src_order_id: '',
            show_package_usage: false,
            package_usage_data: null,
            search_package_redeem_code: '',
            select_date_range: null,
        }
    },
    created() {
        this.getItemList()
    },

    methods: {
        getDateRangeTimeStamps(dt_range_string) {
            return utils_lib.getFPickDateRangeTimeStamps(
                dt_range_string,
                this.$store.state.business_settings.business_time_zone,
            )
        },

        getItemList() {
            let customer_id = ''
            if (this.$route.params.customer_id) {
                customer_id = this.$route.params.customer_id
            }

            let dt_range = this.getDateRangeTimeStamps(
                this.select_date_range + '',
            )
            console.log(dt_range)
            console.log('asdsada: ' + this.for_business_customer)
            if (this.for_business_customer == true) {
                //get_purchased_packages
                this.$schedsdk
                    .get_purchased_packages({
                        package_name: this.search,
                        page_no: this.page,
                        customer_id: customer_id,
                        show_used_up_packages: this.show_used_up_packages,
                        show_incomplete_packages: this.show_incomplete_packages,
                        package_redeem_code: this.search_package_redeem_code,
                        purchase_start_date: dt_range.start_ts,
                        purchase_end_date: dt_range.end_ts,
                    })
                    .then((result) => {
                        this.list = result.data

                        this.pageCount = 1
                    })
            } else {
                //For packages purchased by a business from super org
                this.$schedsdk
                    .standalone_list_purchased_packages({})
                    .then((result) => {
                        this.list = result.data

                        this.pageCount = 1
                    })
            } //end else
        },
        clearDate() {
            this.select_date_range = null
        },
        setPage(pageNo) {
            // console.log('pageNo')
            // console.log(pageNo)
            this.page = pageNo
            this.getItemList()
        },
        doConsumePackage(item) {
            this.$schedsdk
                .standalone_consume_purchased_package({
                    purchased_packages: [item._id],
                })
                .then((result) => {
                    console.log(result)
                })
        },
        doCancelPackage(item) {
            this.$schedsdk
                .cancel_purchased_packages({
                    purchased_package_id: item._id,
                })
                .then((result) => {
                    if (result.status == 1) {
                        this.getItemList()
                    }
                })
        },
        doShowPackageUsage(item) {
            this.$schedsdk
                .get_package_usage_data({
                    package_assigned_id: item._id,
                })
                .then((result) => {
                    //console.log(result.data)
                    this.package_usage_data = result.data
                    this.show_package_usage = true
                })
        },
        getOrderLinkText(item) {
            let ret = {url: '#', link_text: 'NA'}
            if (item.order_id) {
                if (item.order_type == 'p') {
                    ret.url = '/purchase_order/detail/'
                    ret.link_text =
                        'Purchase Order ref: ' + item.order_id.slice(-5)
                } else {
                    ret.url = '/bookings/detail/'
                    ret.link_text = 'Booking ref:' + item.order_id.slice(-5)
                }

                ret.url += item.order_id
            }
            return ret
        },
        closeShowPackageUsage() {
            this.show_package_usage = false
            this.package_usage_data = null
        },
        calculateCartSummary: function () {
            this.cart.summary_lines = []

            let total = 0.0
            this.cart.items.forEach((item) => {
                //console.log(pay)

                total += item.applied_unit_price * item.item_qty
            })
            let invoice_line = {}
            invoice_line.applied_unit_price = total
            invoice_line.applied_per_unit_store_discount = 0.0
            invoice_line.applied_per_unit_store_surcharge = 0.0
            invoice_line.item_code = 'TOTAL'
            invoice_line.item_name = 'Total'
            invoice_line.item_qty = 1
            invoice_line.item_type = 'A' //'SVC' , 'PROD'
            invoice_line.purchased_package_id = null

            this.cart.summary_lines.push(invoice_line)
        },
        removeItemFromCart: function (index) {
            if (index > -1) {
                this.cart.items.splice(index, 1)
            }
            this.calculateCartSummary()
        },
        addPackageItemToCart: function (item) {
            let invoice_line = {}
            invoice_line.applied_unit_price = item.package_purchase_price
            invoice_line.applied_per_unit_store_discount = 0.0
            invoice_line.applied_per_unit_store_surcharge = 0.0
            invoice_line.item_code = item.package_code
            invoice_line.item_name = item.package_name
            invoice_line.item_qty = 1
            invoice_line.item_type = 'PKG' //'SVC' , 'PROD'
            invoice_line.package_id = item._id || null

            this.cart.items.push(invoice_line)
            this.calculateCartSummary()
        },
        continueToOneOffPurchase() {
            this.$schedsdk
                .make_standalonepurchase_cart({
                    cart: this.cart,
                })
                .then((result) => {
                    if (result.status == 0) {
                        this.error_message = 'Error: ' + result.message
                    } else {
                        console.log(result)
                        this.show_cart = false
                    }
                })
        },
        getCustomerValid(item) {
            if (
                item.assigned_customer_data !== undefined &&
                item.assigned_customer_data != null
            ) {
                //return "Assigned to: " + item.assigned_customer_data.first_name + " " + item.assigned_customer_data.last_name
                return true
            }

            return false
        },
        purchaseItem: function (item) {
            this.addPackageItemToCart(item)
            this.show_cart = true
        },
        getFormattedDate: function (dt_unix) {
            if (dt_unix == null || dt_unix == 0) {
                return dt_unix
            }
            return moment(dt_unix).format('MMM DD, YYYY hh:mm a') //"MMM DD, YYYY hh:mm a"
        },
        getFormattedDateNoTime: function (dt_unix) {
            if (dt_unix == null || dt_unix == 0) {
                return dt_unix
            }
            return moment(dt_unix).format('MMM DD, YYYY') //"MMM DD, YYYY hh:mm a"
        },
        roundto2digits: function (n) {
            //Round half away from zero
            var e = Number.EPSILON * n * 100
            return Math.round(n * 100 + e) / 100
        },
        cancelPO: function (item) {
            let c = confirm('Cancel PO: ' + item._id + ' ? ')
            if (!c) {
                return
            }
            this.$schedsdk
                .cancel_purchase_orders({
                    purchase_order_id: item._id,
                })
                .then((result) => {
                    this.getItemList()
                })
        },
        payPo: function (item) {
            console.log(item.manage_booking_key)
            let url =
                this.$store.state.skysched_global_api_base_url +
                'extpages/online_booking_payment/' +
                item.manage_booking_key +
                '?show_page_header=0&show_page_footer=0'
            this.$router.push({
                name: 'Pay Purchase Order',
                params: {po_access_url: encodeURI(url)},
            })
        },
        showRedeemCodeDialog(item) {
            this.show_send_redeem_code = true
            this.src_d_redeem_code = item.redemption_code
            this.src_first_name = ''
            this.src_last_name = ''
            this.src_email = ''
            this.src_phone = ''
            this.src_assigned_to_name =
                item.assigned_customer_data.first_name +
                ' ' +
                item.assigned_customer_data.last_name
            this.src_purchased_package_id = item._id
            this.src_personal_mesage = ''
            this.src_invoice_number = item.src_invoice_number
            this.src_order_id = item.src_booking_id
            console.log(item)
        },
        closeShowdone() {
            this.showDone = false
        },
        sendRedeemCode() {
            let that = this
            let data = {
                order_id: this.src_order_id,
                is_booking_order: true,
                invoice_number: this.src_invoice_number,
                item_share_data: [
                    {
                        first_name: this.src_first_name,
                        last_name: this.src_last_name,
                        email: this.src_email,
                        phone: this.src_phone,
                        message: this.src_personal_mesage,
                        item_id: this.src_purchased_package_id,
                        purchased_package_id: this.src_purchased_package_id,
                    },
                ],
            }
            this.done_response = 'In progress...'
            this.showDone = true
            this.$schedsdk
                .send_package_codes_to_ff(data)
                .then((result) => {
                    that.done_response = result.message
                    if (result.status == 1) {
                        that.show_send_redeem_code = false
                    }
                })
                .catch((ex) => {
                    console.log('Error')
                    console.log(ex)
                    that.done_response = ex.message || 'Error'
                })
                .finally(() => {
                    //   that.showDone = false;
                })
        },
    },
}
</script>
