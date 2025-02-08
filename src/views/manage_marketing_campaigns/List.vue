<template>
    <div class="pt-2">
        <Alerts
            :alertData="alertData"
            :show="show"
            @alertClosed="alertClosedFn"
            v-if="alert"
        />
        <FilterSection>
            <template v-slot:search-input>
                <label class="control-label"><b>Search Name</b></label>
                <input
                    v-model="search"
                    class="form-control placeholder-no-fix"
                    @keyup="getServicesList()"
                    type="text"
                />
            </template>
            <template v-slot:actions>
                <button
                    class="btn btn-success btn-style float-end"
                    @click="$router.push('/manage_marketing/add_edit_campaign')"
                >
                    Add New Campaign
                </button>
            </template>
        </FilterSection>
        <div class="row">
            <div class="col-12">
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <!-- <th>S.no</th> -->
                                <th>Name</th>
                                <th>Target Segment</th>
                                <th>Template</th>
                                <th>Scheduled</th>
                                <th>Status</th>
                                <th width="25%">Action</th>
                            </tr>
                        </thead>
                        <tbody v-if="list.length">
                            <tr v-for="item in list" v-bind:key="item._id">
                                <td>{{ item.name }}</td>
                                <td>
                                    {{ getSegmentNames(item) }} <br /><small
                                        >Est. Contacts:
                                        {{
                                            item.last_contact_count || 0
                                        }}</small
                                    >
                                    <br /><small
                                        >Est. Credits:
                                        {{ item.estimated_credits }}</small
                                    >
                                </td>
                                <td>
                                    {{ getTemplateName(item) }} <br /><small
                                        >Sent via:
                                        {{
                                            channel_use_to_channel_enum(
                                                item.template_data.channel_use,
                                                '',
                                            )
                                        }}</small
                                    >
                                </td>
                                <td>
                                    {{ getFormattedDate(item.begin_date) }}
                                    <br /><small>{{
                                        getScheduleRepeat(item)
                                    }}</small>
                                </td>
                                <td>
                                    {{ getRunStatus(item) }}
                                    <br /><small
                                        >Date:
                                        {{
                                            getFormattedDate(item.last_run_date)
                                        }}</small
                                    >
                                    <span
                                        v-if="
                                            item.run_status ==
                                            'STOPPED_NOT_ENOUGH_CREDITS'
                                        "
                                    >
                                        <button
                                            class="btn-sm btn-primary"
                                            @click="
                                                $router.push(
                                                    '/standalonepurchases',
                                                )
                                            "
                                        >
                                            Purchase More Credits
                                        </button>
                                    </span>
                                </td>
                                <td>
                                    <button
                                        class="btn btn-success btn-sm mb-1"
                                        @click="
                                            $router.push(
                                                '/manage_marketing/add_edit_campaign/' +
                                                    item._id,
                                            )
                                        "
                                    >
                                        Edit
                                    </button>
                                    &nbsp;&nbsp;
                                    <button
                                        class="btn btn-danger btn-sm mb-1"
                                        @click="confirmDelete(item)"
                                    >
                                        Delete
                                    </button>
                                    &nbsp;&nbsp;
                                    <button
                                        class="btn btn-info btn-sm mb-1"
                                        @click="confirmRunOnce(item)"
                                    >
                                        Run Once
                                    </button>
                                    &nbsp;&nbsp;
                                    <button
                                        class="btn btn-warning btn-sm mb-1"
                                        @click="confirmTestMessage(item)"
                                    >
                                        Test
                                    </button>
                                    &nbsp;&nbsp;
                                    <button
                                        class="btn btn-primary btn-sm mb-1"
                                        @click="confirmCancelRun(item)"
                                    >
                                        Cancel run
                                    </button>
                                    &nbsp;&nbsp;
                                    <button
                                        v-if="item.is_active == true"
                                        class="btn btn-secondary btn-sm mb-1"
                                        @click="confirmDeactivate(item)"
                                    >
                                        Deactivate
                                    </button>
                                    <button
                                        v-else
                                        class="btn btn-secondary btn-sm mb-1"
                                        @click="confirmActivate(item)"
                                    >
                                        Activate
                                    </button>
                                    <button
                                        class="btn btn-warning btn-sm mb-1"
                                        @click="getPerformance(item)"
                                    >
                                        Performance
                                    </button>
                                    &nbsp;&nbsp;
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="6" class="text-center">
                                    <div class="py-5">
                                        <img
                                            src="/img/no-result.svg"
                                            alt=""
                                            class="img-empty"
                                        />
                                        <p class="h5 mt-4 d-block fw-normal">
                                            No Campaigns Found
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
                    :ariaLabel="'marketing campaigns results pages'"
                    :activePage.sync="page"
                    :pages="pageCount"
                    @update:activePage="setPage"
                />
            </div>
        </div>

        <CModal
            :visible="showPerfModal"
            size="xl"
            @close="showPerfModal = false"
        >
            <CModalHeader>
                <CModalTitle>Performance Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    <div class="col-md-6">Number of contacts</div>
                    <div class="col-md-6">
                        {{ perfData.num_contacts }}
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <!-- <th>S.no</th> -->
                                <th>Link</th>
                                <th>Clicks</th>
                                <th>CTR</th>
                            </tr>
                        </thead>
                        <tbody
                            v-if="
                                perfData &&
                                perfData.links_clicked &&
                                perfData.links_clicked.length
                            "
                        >
                            <tr
                                v-for="item in perfData.links_clicked"
                                v-bind:key="item._id"
                            >
                                <td>{{ item.url }}</td>
                                <td>{{ item.count }}</td>
                                <td>{{ getClickThruRate(item, perfData) }}</td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="3" class="text-center">
                                    No Links Found
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="showPerfModal = false" color="success"
                    >OK</CButton
                >
            </CModalFooter>
        </CModal>

        <CModal :visible="showTestModal">
            <CModalHeader>
                <CModalTitle>Send a message to test</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    <div class="col-md-6">
                        Enter Phone number to send test message using template
                    </div>
                    <div class="col-md-6">
                        <input
                            class="form-control placeholder-no-fix"
                            type="text"
                            v-model="test_phone_number"
                        />
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="sendTestMessage()" color="success"
                    >Confirm</CButton
                >
                <CButton @click="showTestModal = false" color="danger"
                    >Cancel</CButton
                >
            </CModalFooter>
        </CModal>

        <CModal :visible="showDone">
            <CModalHeader>
                <CModalTitle>Done sending test</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    <div class="col-md-8">
                        {{ done_response }}
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="showDone = false" color="info">Ok</CButton>
            </CModalFooter>
        </CModal>
    </div>
</template>

<script>
import moment from 'moment'
import Pagination from '@/common/Pagination'
import preset_array_helpers from '../../helpers/preset_arrays'
import Alerts from '../Alerts'
import FilterSection from '@/ui_components/FilterSection'

export default {
    name: 'List',
    components: {Pagination, Alerts, FilterSection},
    data() {
        return {
            alert: false,
            show: 0,
            alertData: {
                message: '',
                type: '',
            },
            search: '',
            test_campaign_id: '',
            test_phone_number: '',
            showTestModal: false,
            showDone: false,
            done_response: '',
            showPerfModal: false,
            perfData: null,
            list: [],
            page: 1,
            pageCount: 1,
            pre_defined_segment_names: [],
            currency_symbol:
                this.$store.state.business_settings.business_currency_symbol,
        }
    },
    created() {
        this.getServicesList()
        this.pre_defined_segment_names =
            preset_array_helpers.get_pre_defined_segment_names()
    },
    methods: {
        getServicesList() {
            this.$schedsdk
                .list_marketing_campaigns({
                    search: this.search,
                    page_no: this.page,
                })
                .then((result) => {
                    this.list = result.data
                    this.pageCount = result.total_pages
                })
        },
        getSegmentNames(item) {
            let v = ''
            if (
                item.target_pre_defined_segment_name_arr &&
                item.target_pre_defined_segment_name_arr.length
            ) {
                for (
                    let index = 0;
                    index < item.target_pre_defined_segment_name_arr.length;
                    index++
                ) {
                    const element =
                        item.target_pre_defined_segment_name_arr[index]
                    return element.name
                }
            }
            return v
        },
        channel_use_to_channel_enum(channel_use, default_ch = null) {
            let channel = 'SMS/Text'
            switch (channel_use) {
                case 1:
                    channel = 'Email'
                    break
                case 2:
                    channel = 'SMS/Text'
                    break
                default:
                    return default_ch
            }
            return channel
        },
        getTemplateName(item) {
            if (item.template_data) {
                return item.template_data.name
            }
            return item.template_id
        },
        getRunStatus(item) {
            return item.run_status
        },
        getScheduleRepeat(item) {
            let repeat = 'Repeats: '
            switch (item.repeat_freq) {
                case 0:
                    return repeat + 'Once on scheduled date and time'
                case 1:
                    return repeat + 'Daily'
                case 2:
                    return repeat + 'Weekly'
                case 3:
                    return repeat + 'Monthly'
                case 4:
                    return repeat + 'Yearly'
                case 99:
                    return repeat + 'Does not repeat. Only manual run.'
                default:
                    return repeat + ' Unknown ' + item.repeat_freq
            }
        },
        getTime(item) {
            //{{item.time}} Min.
            let timetext = '' + item.time + ' mins.'
            if (
                item.enable_split_times == true ||
                (item.split_times &&
                    item.split_times.length > 0 &&
                    item.split_times[0].time > 0)
            ) {
                timetext += '<br><small>Split time enabled</small>'
            }
            if (item.buffer_time_before_next) {
                timetext +=
                    '<br><small>' +
                    '+' +
                    item.buffer_time_before_next +
                    ' mins buffer</small>'
            }

            return timetext
        },
        getPrice(item) {
            let price_text = this.currency_symbol + '' + item.price
            if (
                item.enable_flexible_time &&
                item.enable_flexible_time == true &&
                item.selectable_times.length > 0
            ) {
                price_text +=
                    '<br><small>' +
                    'Plus ' +
                    item.selectable_times.length +
                    ' more.</small>'
            }
            return price_text
        },
        getFormattedDate: function (dt_unix) {
            if (dt_unix == null || dt_unix == 0) {
                return dt_unix
            }
            return moment(dt_unix).format('MMM DD, YYYY hh:mm a') //"MMM DD, YYYY hh:mm a"
        },
        setPage(pageNo) {
            // console.log('pageNo')
            // console.log(pageNo)
            this.page = pageNo
            this.getServicesList()
        },
        confirmDelete(item) {
            let confirmed = confirm(
                'Are you sure to delete this item: ' + item.name,
            )
            if (confirmed) {
                this.$schedsdk
                    .delete_marketing_campaign({_id: item._id})
                    .then((result) => {
                        this.getServicesList()
                    })
            }
        },
        confirmRunOnce(item) {
            let confirmed = confirm('Are you sure to run now?: ' + item.name)
            if (confirmed) {
                this.alertData = {
                    message: 'Started, check back in few mins',
                    type: 'success',
                }
                this.alert = true
                this.show = 8
                this.$schedsdk
                    .run_once_manual_marketing_campaign({_id: item._id})
                    .then((result) => {
                        this.getServicesList()
                    })
            }
        },
        confirmTestMessage(item) {
            this.test_campaign_id = item._id
            this.showTestModal = true
        },

        confirmCancelRun(item) {
            let confirmed = confirm(
                'Are you sure to cancel any currently running now?: ' +
                    item.name,
            )
            if (confirmed) {
                this.alertData = {
                    message: 'Started, requested to cancel.',
                    type: 'success',
                }
                this.alert = true
                this.show = 8
                this.$schedsdk
                    .marketing_request_cancel_campaign_run({_id: item._id})
                    .then((result) => {
                        this.getServicesList()
                    })
            }
        },

        confirmActivate(item) {
            let confirmed = confirm(
                'Are you sure to Activate campaign?: ' + item.name,
            )
            if (confirmed) {
                this.alertData = {
                    message: 'Activated',
                    type: 'success',
                }
                this.alert = true
                this.show = 8
                this.$schedsdk
                    .marketing_activate_campaign({_id: item._id})
                    .then((result) => {
                        this.getServicesList()
                    })
            }
        },

        confirmDeactivate(item) {
            let confirmed = confirm(
                'Are you sure to deactivate campaign?: ' + item.name,
            )
            if (confirmed) {
                this.alertData = {
                    message: 'Deactivated',
                    type: 'success',
                }
                this.alert = true
                this.show = 8
                this.$schedsdk
                    .marketing_deactivate_campaign({_id: item._id})
                    .then((result) => {
                        this.getServicesList()
                    })
            }
        },
        sendTestMessage() {
            this.showTestModal = false
            this.$schedsdk
                .send_single_test_message_marketing_campaign({
                    _id: this.test_campaign_id,
                    test_phone_number: this.test_phone_number,
                })
                .then((result) => {
                    this.showDone = true
                    this.done_response = result.message
                })
        },
        getClickThruRate(item, perfData) {
            if (perfData.num_contacts < 1) {
                return 'NA'
            }

            let v = Math.round(item.count / perfData.num_contacts)
            return v
        },
        getPerformance(item) {
            this.$schedsdk
                .marketing_get_performance_data({_id: item._id})
                .then((result) => {
                    console.log(result)
                    //this.getServicesList();
                    if (result.status == 1) {
                        this.perfData = result.data
                        this.showPerfModal = true
                    }
                })
        },
    },
}
</script>
<style scoped>
.controls-div {
    float: left;
    width: 100%;
    border: 1px solid #d8dbe0;
    padding: 15px 4px;
    margin: 0 0 1rem 0 !important;
    padding-top: 20px;
    position: relative;
}
.settings-text {
    position: absolute;
    background: #fff;
    padding: 3px 6px;
    top: -15px;
    left: 15px;
    font-size: 16px;
    font-weight: bold;
}
</style>
