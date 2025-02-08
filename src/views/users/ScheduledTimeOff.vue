<template>
    <div class="pt-2">
        <div class="row">
            <div class="col-md-8">
                <label class="control-label"
                    >Manage time off periods like personal appointments,
                    vacation days. User:
                    <strong>{{ user_full_name }}</strong></label
                >
            </div>
        </div>
        <div class="row controls-div">
            <!-- 
                <div class="settings-text">Filter Options</div>
                <div class="col-md-2">
                    <label class="control-label"><b>Search Name/Phone</b></label>
                    <input 
                    v-model="search_email_phone"
                    class="form-control placeholder-no-fix" 
                    @keyup="getCustomersList()"
                    type="text" 
                    />
                </div> -->
            <div class="col-md-6 mr-auto">
                <button class="btn btn-success" @click="showEditTimeOff()">
                    Add New Timeoff
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col-md-2">
                <label class="control-label"><b>Searching...</b></label>
            </div>
        </div>
        <div v-if="show_add_edit == false">
        <div  class="table-responsive">
            <br />
            <table class="table table-bordered table-hover table-responsive">
                <thead>
                    <tr>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody v-if="list.length">
                    <tr v-for="item in list" :key="item._id">
                        <td>{{ getFormattedDate(item.service_start_date) }}</td>
                        <td>{{ getFormattedDate(item.service_end_date) }}</td>
                        <td>{{ getTOType(item.type) }}</td>
                        <td>{{ item.time_description }}</td>
                        <td class="action_column">
                            <button
                                type="button"
                                @click="editTimeOff(item)"
                                class="btn btn-success btn-sm"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                @click="deleteTimeOff(item)"
                                class="btn btn-secondary btn-sm"
                            >
                                Delete
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
        <Pagination class="mt-2"
            v-if="list.length"
            :size="'sm'"
            :ariaLabel="'Scheduled time off results pages'"
            :activePage.sync="page"
            :pages="pageCount"
            @update:activePage="setPage"
        />
        </div>

        <div v-else>
            <div class="col-md-6 mr-auto">
                {{ add_edit_title }}
            </div>
            <div class="row">
                <div class="col-md-4">Start Date and Time</div>
                <div class="col-md-8">
                    <flat-pickr
                        v-model="sto_from_date"
                        :config="date_picker_config"
                        placeholder="Start Date &amp; Time"
                    ></flat-pickr>
                </div>
            </div>
            <br />
            <div class="row">
                <div class="col-md-4">End Date and Time</div>
                <div class="col-md-8">
                    <flat-pickr
                        v-model="sto_to_date"
                        :config="date_picker_config"
                        placeholder="End Date &amp; Time"
                    ></flat-pickr>
                </div>
            </div>
            <br />
            <div class="row">
                <div class="col-md-4">Time off Type</div>
                <div class="col-md-4">
                    <select
                        class="form-control col-sm-4"
                        v-model="time_off_type"
                    >
                        <option
                            v-bind:key="opt.name"
                            v-for="opt in type_options"
                            :selected="opt.val == time_off_type ? true : false"
                            :value="opt.val"
                        >
                            {{ opt.name }}
                        </option>
                    </select>
                </div>
            </div>
            <br />
            <div class="row">
                <div class="col-md-4">Time off Description</div>
                <div class="col-md-4">
                    <input
                        v-model="time_description"
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
            <div class="row">
                <div class="col-md-12">
                    <br />
                    &nbsp;
                </div>
            </div>
            <div class="row">
                <br />
                <div class="col-md-12">
                    <CButton @click="addEditTimeOff()" color="success"
                        >Confirm</CButton
                    >
                    &nbsp;
                    <CButton @click="show_add_edit = false" color="danger"
                        >Cancel</CButton
                    >
                </div>
            </div>

            <div class="row">
                <div class="col-md-12">
                    <br />
                    &nbsp;
                </div>
            </div>

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
import {debounce as lodash_debounce} from 'lodash'
import '../../assets/css/common.css'
import AppHelper from '../../helpers/app_helper'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import moment from 'moment-timezone'
import utils_lib from '../../helpers/utils_lib'
import StartWizardVue from '../wizards/StartWizard.vue'
export default {
    name: 'List',
    components: {Pagination, flatPickr},
    data() {
        return {
            date_picker_config: {
                altFormat: 'F j, Y h:i K',
                altInput: true,
                static: true,

                // noCalendar: true,
                enableTime: true,
                time_24hr: false,
            },
            add_edit_title: 'Add/edit Time off ',
            type_options: [
                {name: 'Personal', val: 7701},
                {name: 'Business', val: 7702},
            ],
            time_off_type: '7701',
            sto_from_date: '',
            sto_to_date: '',
            time_description: '',
            user_id: '',
            user_full_name: '',
            business_id: '',
            edit_time_off_rec_id: '',
            search_email_phone: '',
            list: [],
            page: 1,
            pageCount: 1,
            country_code: 'US',
            show_add_edit: false,
            random_string: '',

            done_response: '',
            showDone: false,
            timezone: '',
            error_message: '',
        }
    },
    created() {
        this.getTimeOffList()

        this.showDone = false
        this.user_id = this.$route.params.user_id
        this.$schedsdk
            .get_user_detail({service_provider_id: this.user_id})
            .then((result) => {
                if (result.status == 1) {
                    this.user_full_name =
                        result.data.first_name + ' ' + result.data.last_name
                    this.add_edit_title =
                        'Add/edit Time off for ' + this.user_full_name
                }
            })
    },
    methods: {
        getTimeOffList() {
            this.debGetList(this)
        },
        getFormattedDate: function (dt_unix) {
            return utils_lib.getFormattedDate(dt_unix)
        },
        getTOType: function (type) {
            if (type == 7701) return 'Personal'
            if (type == 7702) return 'Business'
            return type
        },
        debGetList: lodash_debounce((context) => {
            context.$schedsdk
                .get_scheduled_timeoff_list({
                    user_id: context.user_id,
                    count_per_page: 25,
                    page_no: context.page,
                })
                .then((result) => {
                    context.list = result.data
                    context.pageCount = result.total_pages || 1
                    context.timezone =
                        context.$store.state.business_settings.business_time_zone
                })
        }, 400),

        setPage(pageNo) {
            this.page = pageNo
            this.getCustomersList()
        },

        rndStr(len) {
            let text = ' '
            let chars = 'abcdefghijklmnopqrstuvwxyz'

            for (let i = 0; i < len; i++) {
                text += chars.charAt(Math.floor(Math.random() * chars.length))
            }

            return text
        },
        resetPassword(user_id) {
            this.user_id = user_id
            this.random_string = this.rndStr(8)
            this.show_add_edit = true
        },
        showEditTimeOff() {
            this.error_message = ''
            this.time_off_type = '7701' //defailt
            this.sto_from_date = ''
            this.sto_to_date = ''
            this.time_description = ''
            //this.user_id=,
            //this.business_id=item.business_id,
            this.edit_time_off_rec_id = ''
            this.show_add_edit = true
        },
        editTimeOff(item) {
            this.error_message = ''
            this.time_off_type = item.type
            this.sto_from_date = moment
                .tz(item.service_start_date, this.timezone)
                .format('YYYY-MM-DD HH:mm a')

            // moment.tz(moment(item.service_start_date).format('YYYY-MM-DD HH:mm'), this.timezone).valueOf(),
            this.sto_to_date = moment
                .tz(item.service_end_date, this.timezone)
                .format('YYYY-MM-DD HH:mm a')
            this.time_description = item.time_description
            this.user_id = item.service_provider_id
            this.business_id = item.business_id
            this.edit_time_off_rec_id = item._id
            this.show_add_edit = true
        },
        deleteTimeOff(item) {
            let confirmed = confirm(
                'Are you sure to delete this time off for ' +
                    item.time_description +
                    ' at ' +
                    this.getFormattedDate(item.service_start_date),
            )
            if (confirmed) {
                console.log('asdasd delete')
                console.log(item)
                let data = {
                    _id: item._id,
                    business_id: item.business_id,
                }

                this.$schedsdk
                    .delete_scheduled_timeoff(data)
                    .then((result) => {
                        this.showDone = true
                        if (result.status == 1) {
                            this.done_response = result.message
                        } else {
                            this.done_response = result.message || 'Error'
                        }
                        this.getTimeOffList()
                    })
                    .catch((err) => {
                        this.showDone = true
                        console.log(err)
                        this.done_response =
                            err.data && err.data.message
                                ? err.data.message
                                : 'Error'
                    })
                    .finally(() => {
                        this.edit_time_off_rec_id = ''
                    })
            } //end if confirmed
        },
        addEditTimeOff() {
            // console.log(user_id)
            // console.log(random_string.trim());
            let format = 'YYYY-MM-DD HH:mm'
            let timezone =
                this.$store.state.business_settings.business_time_zone
            this.business_id = this.$store.state.business_settings.business_id
            let startDay = moment
                .tz(this.sto_from_date, format, timezone)
                .valueOf()
            let endDay = moment.tz(this.sto_to_date, format, timezone).valueOf()

            if (endDay <= startDay) {
                this.error_message =
                    'End date and time must be greater than start date'
                return
            }
            let data = {
                user_id: this.user_id,
                business_id: this.business_id,
                type: this.time_off_type,
                service_start_date: startDay,
                service_end_date: endDay,
                time_description:
                    this.time_description != ''
                        ? this.time_description
                        : 'Scheduled Time off',
            }
            if (this.edit_time_off_rec_id != '') {
                data._id = this.edit_time_off_rec_id
            }
            console.log(data)
            this.show_add_edit = false

            // this.$schedsd return;
            this.$schedsdk
                .create_edit_scheduled_timeoff(data)
                .then((result) => {
                    this.showDone = true
                    if (result.status == 1) {
                        this.done_response = result.message
                    } else {
                        this.done_response = result.message || 'Error'
                    }
                    this.getTimeOffList()
                })
                .catch((err) => {
                    this.showDone = true
                    console.log(err)
                    this.done_response =
                        err.data && err.data.message
                            ? err.data.message
                            : 'Error'
                })
                .finally(() => {
                    this.edit_time_off_rec_id = ''
                })
        },
        closeShowdone() {
            this.showDone = false
        },
    },
}
</script>
<style scoped>
.action_column button {
    margin: 3px;
}
</style>
