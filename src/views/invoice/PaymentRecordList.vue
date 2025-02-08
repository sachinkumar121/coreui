<template>
    <div class="pt-2">
        <div class="row controls-div">
            <div class="settings-text">Filter Options</div>
            <div class="col-md-2">
                <label class="control-label"><b>TXN Reference</b></label>
                <input
                    v-model="txn_ref_num"
                    class="form-control placeholder-no-fix"
                    @keyup="fetchInvoicePayments()"
                    type="text"
                />
            </div>
            <div class="col-md-2">
                <label class="control-label"><b>Card last 4</b></label>
                <input
                    v-model="last4"
                    class="form-control placeholder-no-fix"
                    @keyup="fetchInvoicePayments()"
                    type="text"
                />
            </div>
            <div class="col-md-2">
                <label class="control-label"><b>Invoice Number</b></label>
                <input
                    v-model="invoice_number"
                    class="form-control placeholder-no-fix"
                    @keyup="fetchInvoicePayments()"
                    type="text"
                />
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Method</th>
                                <th>Card Source</th>
                                <th>Operation</th>
                                <th>Payment Date</th>
                                <th>Transaction Number</th>
                                <th>Invoice</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="payments.length">
                                <tr
                                    v-for="(pline, index) in payments"
                                    :key="index"
                                >
                                    <td v-if="pline.payment_txn_type == 0">
                                        Card
                                    </td>
                                    <td v-else-if="pline.payment_txn_type == 1">
                                        Cash
                                    </td>
                                    <td v-else-if="pline.payment_txn_type == 2">
                                        Cheque
                                    </td>
                                    <td v-else>Other</td>

                                    <td>
                                        {{
                                            pline.payment_funding_method_short.replace(
                                                'PT_CARDBRAND_',
                                                '',
                                            ) || ''
                                        }}
                                    </td>
                                    <td>
                                        {{
                                            pline.payment_txn_operation.replace(
                                                'PT_TT_',
                                                '',
                                            )
                                        }}
                                    </td>
                                    <td>
                                        {{
                                            getFormattedDateTime(
                                                pline.applied_payment_date,
                                            )
                                        }}
                                    </td>
                                    <td>
                                        <a
                                            href="javascript:void(0)"
                                            @click.prevent="
                                                paymentDetailsHandler(pline._id)
                                            "
                                        >
                                            {{
                                                getLimitedTxnNum(
                                                    pline,
                                                    pline.payment_txn_number,
                                                )
                                            }}</a
                                        >
                                    </td>
                                    <td>
                                        <a
                                            href="javascript:void(0)"
                                            @click.prevent="
                                                $router.push(
                                                    '/invoices/detail/' +
                                                        pline.invoice_number,
                                                )
                                            "
                                            >{{ pline.invoice_number }}</a
                                        >
                                    </td>
                                    <td>
                                        {{ business_currency_symbol }}
                                        {{ pline.applied_payment_value }}
                                    </td>
                                    <td>
                                        <button
                                            class="btn btn-primary btn-sm"
                                            @click.prevent="
                                                $router.push(
                                                    '/invoices/detail/' +
                                                        pline.invoice_number,
                                                )
                                            "
                                        >
                                            View Invoice
                                        </button>
                                    </td>
                                </tr>
                            </template>
                            <tr v-else>
                                <td colspan="10" class="text-center">
                                    No Invoice Exists
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <Pagination class="mt-2"
            v-if="payments.length"
            :size="'sm'"
            :ariaLabel="'Payments results pages'"
            :activePage.sync="page"
            :pages="pageCount"
            @update:activePage="setPage"
        />

        <CModal :visible="showPaymentDetails">
            <CModalHeader>
                <CModalTitle>Payment Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    <div class="col-md-4">Payment ID</div>
                    <div class="col-md-4">
                        {{ payment_data.id }}
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">Processor Captured?</div>
                    <div class="col-md-4">
                        {{ payment_data.captured }}
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">Transaction State</div>
                    <div class="col-md-4">
                        {{ payment_data.state }}
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">Processor result</div>
                    <div class="col-md-4">
                        {{ payment_data.result }}
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="DoneDetails" color="success">Done</CButton>
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
            csv_data: [],
            page: 1,
            pageCount: 1,
            payments: [],
            txn_ref_num: '',
            last4: '',
            invoice_number: '',
            business_currency_symbol:
                this.$store.state.business_settings.business_currency_symbol,
            showPaymentDetails: false,
            payment_data: {},
        }
    },
    created() {
        this.fetchInvoicePayments()
        this.getInvoiceCSV()
    },
    methods: {
        doGetInvoicePaymentList(context) {
            let data = {
                page_no: context.page,
                txn_ref_num: context.txn_ref_num,
                last4: context.last4,
                invoice_number: context.invoice_number,
            }
            context.$schedsdk
                .get_invoices_payments_list(data)
                .then((result) => {
                    context.payments = result.data
                    context.pageCount = result.total_pages
                })
        },
        fetchInvoicePayments() {
            this.getInvoicePaymentList(this)
        },

        getInvoicePaymentList: lodash_debounce((context) => {
            context.doGetInvoicePaymentList(context)
        }, 400),

        getInvoiceCSV() {
            this.$schedsdk.get_invoice_csv_data().then((result) => {
                for (let i = 0; i < result.data.length; i++) {
                    this.csv_data.push({
                        invoice_no: result.data[i].invoice_number,
                        paid_amount: result.data[i].final_paid_amount,
                        due_amount: result.data[i].estimated_amount_due,
                        due_date: this.getFormattedDate(
                            result.data[i].due_date,
                        ),
                        customer_name:
                            result.data[i].customer_data.first_name +
                            ' ' +
                            result.data[i].customer_data.last_name,
                    })
                }
            })
        },
        setPage(pageNo) {
            // console.log('pageNo')
            // console.log(pageNo)
            this.page = pageNo
            this.fetchInvoicePayments()
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
        getLimitedTxnNum: function (pline, n) {
            if (n == undefined) {
                return 'NOTXNID'
            }
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
                        this.payment_data = result.data
                    } else {
                        this.payment_data = {id: 'Not found'}
                    }
                    this.showPaymentDetails = true
                })
        },
    },
}
</script>
