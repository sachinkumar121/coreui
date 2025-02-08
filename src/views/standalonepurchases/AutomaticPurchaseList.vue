<template>
    <div class="pt-2">
        <div class="row controls-div">
            <div class="settings-text">Filter Options</div>

            <div class="col-md-4 col-6">
                <label class="control-label"><b>Search</b></label>
                <input
                    v-model="last4"
                    class="form-control placeholder-no-fix"
                    @keyup="fetchItemList()"
                    type="text"
                />
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>When</th>

                        <th>Items purchased</th>
                        <th>Last Billed</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody v-if="list.length">
                    <tr v-for="(pline, index) in list" :key="index">
                        <td>{{ pline.event_description }}</td>
                        <td>{{ getTriggerString(pline) }}</td>

                        <td v-html="getItemsPurchased(pline)"></td>
                        <td>
                            {{ getFormattedDateTime(pline.last_purchase_date) }}
                        </td>
                        <td>{{ getStatusString(pline) }}</td>
                        <td>
                            <button
                                class="btn btn-danger btn-sm"
                                @click="cancelHandler(pline)"
                            >
                                Cancel
                            </button>
                            &nbsp;
                            <button
                                class="btn btn-success btn-sm"
                                @click="purchaseOnce(pline)"
                            >
                                Purchase once
                            </button>
                            &nbsp;
                            <!-- Implement Later -->
                            <!-- <button class="btn btn-info btn-sm" 
                                @click="pauseUnPauseHandler(pline)">{{getPauseUnPauseString(pline)}}</button> &nbsp;
                            <button class="btn btn-success btn-sm" 
                                @click="billingHistoryHandler(pline)">History</button> &nbsp; -->
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
                                    No automatic purchase/subscriptions exist.
                                    One can be added at purchase time
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
            :ariaLabel="'Automatic purchases results pages'"
            :activePage.sync="page"
            :pages="pageCount"
            @update:activePage="setPage"
        />

        <CModal :visible="showPaymentDetails">
            <CModalHeader>
                <CModalTitle>Payment Profile Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    <div class="col-md-4">Nick name</div>
                    <div class="col-md-4">
                        {{ payment_profile_data.id }}
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="DoneDetails" color="success">Done</CButton>
            </CModalFooter>
        </CModal>

        <CModal :visible="showDone">
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
</template>

<script>
import Pagination from '@/common/Pagination'
import moment from 'moment'
import {debounce as lodash_debounce} from 'lodash'
import '../../assets/css/common.css'
export default {
    name: 'PaymentRecordList',
    components: {Pagination},
    data() {
        return {
            search: '',
            list: [],

            page: 1,
            pageCount: 1,
            payments: [],
            txn_ref_num: '',
            last4: '',
            invoice_number: '',
            business_currency_symbol:
                this.$store.state.business_settings.business_currency_symbol,
            showPaymentDetails: false,
            payment_profile_data: {id: ''},
            done_response: '',
            showDone: false,
        }
    },
    created() {
        this.fetchItemList()
    },
    methods: {
        doGetItemList(context) {
            this.$schedsdk
                .get_automatic_purchase_setup_list({})
                .then((result) => {
                    if (result.status == 1) {
                        this.list = result.data
                    } else {
                        this.list = []
                    }
                })
        },

        fetchItemList() {
            this.getItemListSvr(this)
        },

        getItemListSvr: lodash_debounce((context) => {
            context.doGetItemList(context)
        }, 400),

        setPage(pageNo) {
            // console.log('pageNo')
            // console.log(pageNo)
            this.page = pageNo
            this.fetchItemList()
        },
        getCompOpString: function (op) {
            let str = ''
            switch (op) {
                case 'lt':
                    str += ' less than'
                    break

                case 'lte':
                    str += ' less than equal to'
                    break
                case 'eq':
                    str += ' equal to'
                    break
                default:
                    str += ' ' + op
            }
            return str
        },
        getTriggerString: function (item) {
            //
            let str = ''
            if (item.aptype == 'msg_credits') {
                str += 'Message Credits'
                str += this.getCompOpString(item.compop)
                str += ' ' + item.compvalue
            }
            if (item.aptype == 'first_dom' || item.aptype == 'last_dom') {
                str += 'Monthly'
            }
            if (item.aptype == 'onetime') {
                str += 'One Time'
            }
            if (str == '') {
                str = item.aptype
            }
            return str
        },
        getItemsPurchased(item) {
            let str = ''
            for (let i = 0; i < item.on_occur_items_to_purchase.length; i++) {
                let itempurch = item.on_occur_items_to_purchase[i]
                str += itempurch.item_qty + 'x ' + itempurch.item_name + '<br>'
            }
            return str
        },

        getIsSubscriptionPaused(item) {
            let current_time = moment.utc().valueOf()
            if (item.is_paused_until_date < current_time) {
                return false
            }
            return true
        },
        getStatusString: function (item) {
            //

            if (item.is_active == true) {
                let current_time = moment.utc().valueOf()
                if (item.is_paused_until_date < current_time) {
                    return 'Active'
                }
                return 'Paused'
            }
            return 'Canceled'
        },
        getFormattedDate: function (dt_unix) {
            if (dt_unix == null || dt_unix == 0) {
                return dt_unix
            }
            return moment(dt_unix).format('MMM DD, YYYY hh:mm a') //"MMM DD, YYYY hh:mm a"
        },
        getFormattedDateTime: function (dt_unix) {
            if (dt_unix == null || dt_unix == 0) {
                return dt_unix
            }
            return moment(dt_unix).format('MMM DD, YYYY hh:mm a') //"MMM DD, YYYY hh:mm a"
        },
        getLimitedTxnNum: function (n) {
            if (n.length < 14) {
                return n
            }
            return '...' + n.slice(-14)
        },
        DoneDetails: function (e) {
            this.showPaymentDetails = false
        },
        paymentDetailsHandler: function (id) {
            this.$schedsdk
                .get_invoice_payment_provider_rec_details(id)
                .then((result) => {
                    //console.log("get_invoice_payment_rec_details -- --- ")
                    //console.log(result)
                    if (result.status == 1) {
                        this.payment_profile_data = result.data
                    } else {
                        this.payment_profile_data = {id: 'Not found'}
                    }
                    this.showPaymentDetails = true
                })
        },
        cancelHandler(item) {
            let confirm_string =
                'Confirm cancel ' + item.event_description + '?'

            let confirmed = confirm(confirm_string)
            if (confirmed) {
                this.$schedsdk
                    .cancel_automatic_purchase_setup({
                        rec_id: item._id,
                    })
                    .then((result) => {
                        if (result.status == 1) {
                            this.fetchItemList()
                        } else {
                            console.log('Error cancelling autopurchase... ')
                        }
                    })
            }
        },
        billingHistoryHandler(item) {},
        getPauseUnPauseString(item) {
            if (this.getIsSubscriptionPaused(item)) {
                return 'Unpause'
            }
            return 'Pause'
        },
        pauseUnPauseHandler(item) {
            let confirm_string = 'Confirm pause ' + item.event_description + '?'

            let confirmed = confirm(confirm_string)
            if (confirmed) {
                this.$schedsdk
                    .pause_unpause_automatic_purchase_setup({
                        pause_until_utc: 0,
                        rec_id: item._id,
                    })
                    .then((result) => {
                        if (result.status == 1) {
                            this.fetchItemList()
                        } else {
                            console.log('Error unpausing autopurchase... ')
                        }
                    })
            }
        },
        purchaseOnce(item) {
            let confirm_string =
                'Confirm one time purchase ' + item.event_description + '?'
            this.showDone = false
            let confirmed = confirm(confirm_string)
            if (confirmed) {
                this.$schedsdk
                    .one_time_purchase_automatic_setup({
                        rec_id: item._id,
                    })
                    .then((result) => {
                        this.done_response = result.message
                        this.showDone = true
                    })
            }
        },
        closeShowdone() {
            this.showDone = false
            this.fetchItemList()
        },
    },
}
</script>
