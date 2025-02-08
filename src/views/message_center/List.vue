<template>
    <div class="pt-2">
        <div class="row controls-div">
            <div class="settings-text">Filter Options</div>
            <div class="col-md-4">
                <label class="control-label"><b>Search Name/Phone</b></label>
                <input
                    v-model="search_email_phone"
                    class="form-control placeholder-no-fix"
                    @keyup="getItemList()"
                    type="text"
                />
            </div>
            <div class="col-md-3">
                <input
                    type="checkbox"
                    class="form-check-input"
                    v-model="showOnlyText"
                    @change="getItemList"
                /> &nbsp;
                <label class="control-label">
                    <b>Show Only SMS Channel</b>
                </label>
                
                <br />
                <input
                    type="checkbox"
                    class="form-check-input"
                    v-model="showOnlyEmail"
                    @change="getItemList"
                />&nbsp;
                <label class="control-label">
                    <b>Show Only Email Channel</b>
                </label>
                
                <br />
                <input
                    type="checkbox"
                    class="form-check-input"
                    v-model="select_large_credit_consumer"
                    @change="getItemList"
                />&nbsp;
                <label class="control-label">
                    <b>Select large credit consumers</b>
                </label>
                

                <br />
                <input
                    type="checkbox"
                    class="form-check-input"
                    v-model="showallmessages"
                    @change="getItemList"
                />&nbsp;
                <label class="control-label">
                    <b>Show all messages in range</b>
                </label>
                
            </div>

            <br />
            <br />
            <br />
            <div class="col-md-4">
                <div class="form-group">
                    <label class="control-label"
                        ><b>Message Date Range</b> &nbsp; &nbsp;
                        <span @click="clearDate()">clear</span></label
                    >
                    <flat-pickr
                        v-model="select_date_range"
                        :config="date_range_picker_config"
                        placeholder="Date Range"
                        @input="getItemListDRChange"
                    ></flat-pickr>
                </div>
            </div>

            <div class="row">
                <div class="col-md-4">
                    <button
                        class="btn btn-success float-start mt-3"
                        @click.prevent="viewMessagingStatistics()"
                    >
                        View Messaging Statistics
                    </button>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                Statistics Date Range: {{ getDateRangeString() }}
                <br />
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Channel</th>
                                <th>Total Messages</th>
                                <th>Avg. Crds/message</th>
                                <th>Crds for Channel renewal</th>
                                <th>Total Crds consumed</th>
                                <th>Total Units</th>

                                <th>Avg. units/message</th>
                            </tr>
                        </thead>

                        <tbody
                            v-if="
                                statistics.per_channel &&
                                statistics.per_channel.length
                            "
                        >
                            <tr
                                v-for="(
                                    chdata, index
                                ) in statistics.per_channel"
                                :key="index"
                            >
                                <td>{{ chdata.field_name }}</td>
                                <td>{{ chdata.item_total }}</td>
                                <td>{{ chdata.avg_credits }}</td>
                                <td>
                                    {{ chdata.total_channel_renewal_credits }}
                                </td>

                                <td>{{ chdata.total_credits }}</td>
                                <td>{{ chdata.total_message_units }}</td>

                                <td>{{ chdata.avg_message_units }}</td>
                            </tr>
                            <tr>
                                <td>Credits Added/Purchased in Date Range:</td>
                                <td colspan="5">
                                    {{ statistics.total_credits_added }}
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td>No data found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- end col 12 -->
        </div>
        <br />

        <div>
            <div class="table-responsive">
                <table
                    class="table table-bordered table-hover"
                >
                    <thead>
                        <tr>
                            <th>From</th>
                            <th>To</th>
                            <th>Message</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody v-if="list.length">
                        <tr v-for="item in list" :key="item._id" class="small">
                            <td>
                                {{ item.from_id || '-' }} <br />
                                <small>{{
                                    getFormattedDate(item.created_at)
                                }}</small
                                ><br />
                                <small
                                    >Status:
                                    {{ getDeliveryStatus(item) }}</small
                                ><br />
                                <small
                                    >Cost:
                                    {{ item.credits_consumed }} credits</small
                                ><br />
                                <small
                                    >Total Credits:
                                    {{ get_running_total_credits(item) }}
                                    credits</small
                                >
                            </td>
                            <td>
                                {{ item.to_id }} <br />
                                <small>Via {{ getChannelName(item) }}</small>
                            </td>
                            <td>{{ getMessage(item) }}</td>

                            <td class="action_column">
                                <button
                                    type="button"
                                    @click="
                                        $router.push(
                                            '/customers/detail/' + item._id,
                                        )
                                    "
                                    class="btn btn-primary btn-sm"
                                >
                                    Filter 'to'
                                </button>
                                <button
                                    type="button"
                                    @click="
                                        $router.push(
                                            '/customers/messages/' +
                                                item.to_user_id,
                                        )
                                    "
                                    class="btn btn-info btn-sm"
                                >
                                    Conversation
                                </button>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="10" class="text-center">
                                No Records found
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Pagination
                class="mt-2"
                v-if="list.length"
                :size="'sm'"
                :ariaLabel="'message center results pages'"
                :activePage.sync="page"
                :pages="pageCount"
                @update:activePage="setPage"
            />
        </div>

        <message-usage-summary-comp
            :show_statistics="show_statistics"
            @close="closeMessageUsage"
        />
    </div>
</template>

<script>
import {messageChannelsNames} from '../../constants.js'
import messageUsageSummaryComp from '@/common/MessageUsageSummaryComp'
import Pagination from '@/common/Pagination'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import PhoneNumber from 'awesome-phonenumber'
import utils_lib from '../../helpers/utils_lib'
import {debounce as lodash_debounce} from 'lodash'
import moment from 'moment'
import '../../assets/css/common.css'
export default {
    name: 'List',
    components: {
        messageUsageSummaryComp,
        Pagination,
        flatPickr,
        messageChannelsNames,
    },
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
            showOnlyText: true,
            showOnlyEmail: false,
            search_email_phone: '',
            list: [],
            statistics: {
                total_emails: 0,
                total_sms: 0,
                total_voice: 0,
                total_credits_consumed: 0,
                total_message_count: 0,
                total_credits_added: 0,
                total_credits_consumed: 0,
                channel_renewal_credits: 0,
                per_channel: [],
            },

            page_running_total_credits: 0,
            show_statistics: false,
            count_per_page: 120,
            select_large_credit_consumer: false,
            page: 1,
            pageCount: 1,
            showallmessages: false,
            country_code: 'US',
            select_date_range: null,
            hint_has_required_paperworks:
                this.$store.state.business_settings
                    .hint_has_required_paperworks,
        }
    },
    created() {
        ;(this.country_code = 'US'), //this.$store.state.business_settings.business_time_zone
            this.getItemList()
    },
    methods: {
        getDateRangeString() {
            if (this.select_date_range) {
                return this.select_date_range + ''
            }
            return 'Last ' + this.count_per_page + ' messages '
        },

        get_running_total_credits(item) {
            return utils_lib.roundto3digits(item.running_total_credits)
        },
        viewMessagingStatistics() {
            this.show_statistics = true
        },
        closeMessageUsage() {
            this.show_statistics = false
        },
        getItemList() {
            this.debGetList(this)
        },
        getDateRangeTimeStamps(dt_range_string) {
            return utils_lib.getFPickDateRangeTimeStamps(
                dt_range_string,
                this.$store.state.business_settings.business_time_zone,
            )
        },
        getItemListDRChange() {
            let dt_range = this.getDateRangeTimeStamps(
                this.select_date_range + '',
            )
            if (dt_range.start_ts > 0 && dt_range.end_ts > 0) {
                this.getItemList()
            }
        },
        clearDate() {
            this.select_date_range = null
            this.getItemList()
        },
        getChannelName(item) {
            if (item.channel == 1) {
                return 'EMail'
            }
            if (item.channel == 2) {
                return 'SMS'
            }
            if (item.channel == 3) {
                return 'Voice'
            }
        },
        getMessage(item) {
            if (item.channel == 3) {
                try {
                    let v = JSON.parse(item.message)
                    if (v.message_text) {
                        return v.message_text
                    }
                } catch (ex) {
                    return item.message
                }
            }
            return item.message
        },
        getDeliveryStatus(item) {
            if (item.channel == 3) {
                if (item.delivery_status == 2 || item.delivery_status == 3) {
                    return 'Completed'
                }
                if (item.delivery_status >= 4) {
                    return 'Error'
                }
                return 'Not Delivered'
            } else {
                if (item.delivery_status == 2 || item.delivery_status == 3) {
                    return 'Completed'
                }
                if (item.delivery_status >= 4) {
                    return 'Error'
                }
                if (item.channel == 1) {
                    return 'Sent'
                }
                return 'Not Delivered'
            }
        },
        debGetList: lodash_debounce((context) => {
            let dt_range = context.getDateRangeTimeStamps(
                context.select_date_range + '',
            )

            let running_total_credits = 0
            context.count_per_page = 120
            console.log(context.showallmessages, 'Asdasd')
            if (
                context.showallmessages &&
                dt_range.start_ts > 0 &&
                dt_range.end_ts > 0
            ) {
                context.count_per_page = 1000
            }
            let data = {
                count_per_page: context.count_per_page,
                name: context.search_email_phone,
                page_no: context.page,
                start_date: dt_range.start_ts,
                end_date: dt_range.end_ts,
                show_only_text: context.showOnlyText,
                show_only_email: context.showOnlyEmail,
                skip_user_statistics: true,
            }

            if (context.select_large_credit_consumer == true) {
                data.min_credits_consumed = 0.4
            }
            context.$schedsdk
                .getBusinessMessageCenterMessages(data)
                .then((result) => {
                    if (result.status == 1) {
                        let running_total_credits = 0
                        context.statistics = {
                            total_message_count: 0,
                            total_credits_added: 0,
                            total_credits_consumed: 0,
                            per_channel: [],
                        }
                        let max_channel_index = 6
                        for (let i = 0; i < max_channel_index; i++) {
                            let field_name = messageChannelsNames[i]

                            context.statistics.per_channel.push({
                                field_name: field_name,
                                item_total: 0,
                                total_credits: 0,
                                total_message_units: 0,
                                total_channel_renewal_credits: 0,
                                avg_credits: 0,
                                avg_items: 0,
                                avg_message_units: 0,
                            })
                        }
                        let all_channel = {
                            field_name: 'All Channels',
                            item_total: 0,
                            total_credits: 0,
                            total_message_units: 0,
                            total_channel_renewal_credits: 0,
                            avg_credits: 0,
                            avg_items: 0,
                            avg_message_units: 0,
                        }
                        result.data.forEach((e) => {
                            context.statistics.total_message_count++

                            if (e.channel < max_channel_index) {
                                context.statistics.per_channel[e.channel]
                                    .item_total++
                                all_channel.item_total++
                                if (e.credits_consumed < -0.000001) {
                                    context.statistics.total_credits_added +=
                                        utils_lib.roundto3digits(
                                            Math.abs(e.credits_consumed),
                                        )
                                } else {
                                    context.statistics.per_channel[
                                        e.channel
                                    ].total_credits += e.credits_consumed
                                    all_channel.total_credits +=
                                        e.credits_consumed
                                }
                                if (e.to_id == 'DEFAULT_RENEWAL_B') {
                                    context.statistics.per_channel[
                                        e.channel
                                    ].total_channel_renewal_credits +=
                                        e.credits_consumed
                                    all_channel.total_channel_renewal_credits +=
                                        e.credits_consumed
                                    //console.log("Channel renewal credits === ", e.total_channel_renewal_credits, e)
                                    e.to_id = 'ID Renewal'
                                    e.from_id = 'ID Renewal'
                                    e.message =
                                        'Renewal of ' +
                                        context.getChannelName(e) +
                                        ' Channel ID. Cost: ' +
                                        e.credits_consumed +
                                        (e.credits_consumed > 1
                                            ? ' credits'
                                            : ' credit') +
                                        ''
                                }
                                if (e.from_id == 'DEFAULT_ADDCREDIT_S') {
                                    e.to_id = 'Added Credits'
                                    e.from_id = 'Added Credits'
                                    let cmessage = e.message
                                    let cc = Math.abs(e.credits_consumed)
                                    e.message =
                                        'Added ' +
                                        cc +
                                        (cc > 1 ? ' credits' : ' credit') +
                                        ''
                                    let PaymentSrc = null
                                    try {
                                        let srcit = cmessage.split(':')
                                        if (srcit.length >= 5) {
                                            let payment_ref = srcit[4]
                                            if (
                                                payment_ref.startsWith('GRACE_')
                                            ) {
                                                PaymentSrc = 'Grace Credits'
                                            } else if (
                                                payment_ref.startsWith(
                                                    'SBSCRPN_',
                                                )
                                            ) {
                                                PaymentSrc =
                                                    'Plan Subscription included credits'
                                            } else if (
                                                payment_ref.startsWith(
                                                    'PURCH_I',
                                                )
                                            ) {
                                                PaymentSrc = 'Purchased'
                                            }
                                        }
                                    } catch (ex) {
                                        console.log(
                                            'Error in cmsgeaage source ',
                                            ex,
                                        )
                                    }

                                    if (PaymentSrc) {
                                        e.message += '. Source: ' + PaymentSrc
                                    }
                                } //end DEFAULT_ADDCREDIT_S
                                context.statistics.per_channel[
                                    e.channel
                                ].total_message_units += e.message_units
                                all_channel.total_message_units +=
                                    e.message_units
                            }

                            e.running_total_credits =
                                running_total_credits + e.credits_consumed
                            running_total_credits += e.credits_consumed
                            //console.log("asdasd - - credits_consumed ,", e.credits_consumed)
                            context.statistics.total_credits_consumed +=
                                e.credits_consumed
                        })

                        let newdata = []

                        for (
                            let i = 0;
                            i < context.statistics.per_channel.length;
                            i++
                        ) {
                            let chdata = context.statistics.per_channel[i]
                            if (chdata.item_total > 0.00001) {
                                chdata.avg_credits = utils_lib.roundto3digits(
                                    chdata.total_credits / chdata.item_total,
                                )
                                chdata.avg_message_units =
                                    utils_lib.roundto3digits(
                                        chdata.total_message_units /
                                            chdata.item_total,
                                    )
                                chdata.avg_items = utils_lib.roundto3digits(
                                    chdata.item_total / chdata.item_total,
                                )
                                chdata.total_credits = utils_lib.roundto3digits(
                                    chdata.total_credits,
                                )
                                chdata.total_channel_renewal_credits =
                                    utils_lib.roundto3digits(
                                        chdata.total_channel_renewal_credits,
                                    )
                            }
                            if (chdata.item_total > 0) {
                                newdata.push(chdata)
                            }
                        }
                        if (newdata.length) {
                            all_channel.avg_credits = utils_lib.roundto3digits(
                                all_channel.total_credits /
                                    all_channel.item_total,
                            )
                            all_channel.avg_message_units =
                                utils_lib.roundto3digits(
                                    all_channel.total_message_units /
                                        all_channel.item_total,
                                )
                            all_channel.avg_items = utils_lib.roundto3digits(
                                all_channel.item_total / all_channel.item_total,
                            )
                            all_channel.total_credits =
                                utils_lib.roundto3digits(
                                    all_channel.total_credits,
                                )
                            all_channel.total_channel_renewal_credits =
                                utils_lib.roundto3digits(
                                    all_channel.total_channel_renewal_credits,
                                )

                            newdata.push(all_channel)
                            context.statistics.per_channel = newdata
                        }

                        context.statistics.total_credits_consumed =
                            utils_lib.roundto3digits(
                                context.statistics.total_credits_consumed,
                            )

                        context.list = result.data

                        context.pageCount = result.total_pages
                    }
                })
        }, 400),

        setPage(pageNo) {
            this.page = pageNo
            this.getItemList()
        },
        getPhoneFormatted(phone, country_code = 'US') {
            if (phone == null) {
                return null
            }
            var pn = new PhoneNumber(phone, {regionCode: country_code})
            if (pn.isValid()) {
                return pn.getNumber('national')
            }
            return phone
        },
        getUsertype(type) {
            switch (type) {
                case 5:
                    return 'Customer'
                case 2:
                    return 'Owner'
                case 3:
                    return 'Front desk'
                case 4:
                    return 'Employee'
            }
            return type
        },
        getFormattedDate: function (dt_unix) {
            if (dt_unix == null || dt_unix == 0) {
                return dt_unix
            }
            return moment(dt_unix).format('MMM DD, hh:mm a') //"MMM DD, YYYY hh:mm a"
        },
    },
}
</script>
<style scoped>
.action_column button {
    margin: 3px;
}
</style>
