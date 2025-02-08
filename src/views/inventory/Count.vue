<template>
    <div class="pt-2">
        <div class="row controls-div">
            <div class="settings-text">Filter Options</div>
            <div class="col-md-4">
                <div class="form-group">
                    <label class="control-label"
                        ><b>Date Range</b>
                        <span @click="clearDate()">clear</span></label
                    >
                    <flat-pickr
                        v-model="select_date_range"
                        :config="date_range_picker_config"
                        placeholder="Date Range"
                        @input="filterInventoryCount"
                    />
                </div>
            </div>
            <div class="col-md-4">
                <label class="control-label">
                    <b>Status:</b>
                </label>
                <br />
                <input
                    type="checkbox"
                    class="form-check-input"
                    v-model="show_incomplete"
                    @change="filterInventoryCount"
                />
                <label class="control-label">&nbsp; Incomplete</label>
            </div>
            <div class="col-md-4 text-right d-flex align-items-center justify-content-end">
                <CButton
                    class="btn btn-success float-end"
                    @click="showInventoryCountModal"
                    >Start New Inventory Count</CButton
                >
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Count Name</th>
                        <th>Start Date</th>
                        <th>Completed Date</th>
                        <th>Is canceled</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody v-if="list.length">
                    <tr v-for="item in list" :key="item._id">
                        <td>{{ item.count_name }}</td>
                        <td>{{ getFormattedDate(item.start_date) }}</td>
                        <td>{{ getFormattedDate(item.completed_date) }}</td>
                        <td>{{ item.is_cancelled }}</td>
                        <td class="action_column">
                            <button
                                v-if="!item.completed_date"
                                class="btn btn-primary btn-sm"
                                @click="
                                    $router.push(
                                        `/inventory/count/${item._id}/take-count`,
                                    )
                                "
                            >
                                Take count
                            </button>

                            <button
                                v-if="!item.is_cancelled"
                                class="btn btn-danger btn-sm"
                                @click="cancelHandler(item._id)"
                            >
                                Cancel
                            </button>

                            <button
                                class="btn btn-info btn-sm"
                                @click="deleteHandler(item._id)"
                            >
                                Delete
                            </button>

                            <button
                                v-if="!item.completed_date"
                                class="btn btn-success btn-sm"
                                @click="completeHandler(item._id)"
                            >
                                Complete
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
                                    No Item found
                                </p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <CModal
            :visible="show_inventory_count_modal"
            @close="hideInventoryCountModal"
        >
            <CModalHeader>
                <CModalTitle>Create Inventory Count</CModalTitle>
            </CModalHeader>
            <form class="add-inventory-count-form">
                <CModalBody>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label"
                                    ><b>Select Date</b></label
                                >
                                <flat-pickr
                                    v-model="startDate"
                                    :config="date_picker_config"
                                    placeholder="Start Date"
                                />
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label"
                                    ><b>Select Time</b></label
                                >
                                <flat-pickr
                                    v-model="startTime"
                                    :config="time_picker_config"
                                    placeholder="Start Time"
                                />
                            </div>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton
                        type="button"
                        color="secondary"
                        @click="hideInventoryCountModal"
                        >Close</CButton
                    >
                    <CButton color="primary" @click="createInventoryCount"
                        >Save changes</CButton
                    >
                </CModalFooter>
            </form>
        </CModal>
    </div>
</template>

<script>
import moment from 'moment'
import {debounce} from 'lodash'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import utils_lib from '../../helpers/utils_lib'

export default {
    name: 'InventoryCount',
    components: {flatPickr},
    data() {
        return {
            select_date_range: null,
            date_range_picker_config: {
                altFormat: 'F j, Y',
                altInput: true,
                mode: 'range',
            },
            show_incomplete: false,

            show_inventory_count_modal: false,
            startDate: null,
            startTime: null,
            date_picker_config: {
                altFormat: 'F j, Y',
                altInput: true,
                static: true,
            },
            time_picker_config: {
                altInput: true,
                static: true,
                noCalendar: true,
                enableTime: true,
                time_24hr: false,
                monthSelectorType: 'static',
            },

            page: 1,
            pageCount: 1,
            currency_symbol:
                this.$store.state.business_settings.business_currency_symbol,
        }
    },
    computed: {
        businessSettingsUrl() {
            return window.location.origin
        },
        isInventoryEnabled() {
            return this.$store.state.business_settings.inventory_enabled
        },
        list() {
            return this.$store.state.inventory_count_list
        },
    },
    created() {
        if (!this.list.length) {
            this.getInventoryCountList()
        }
    },
    methods: {
        showInventoryCountModal() {
            this.show_inventory_count_modal = true
        },
        hideInventoryCountModal() {
            this.startDate = null
            this.startTime = null
            this.show_inventory_count_modal = false
        },
        createInventoryCount() {
            let start_date = moment(
                this.startDate + ' ' + this.startTime,
            ).valueOf()
            this.$schedsdk
                .create_inventory_count({
                    start_date,
                })
                .then((result) => {
                    this.getInventoryCountList()
                })
                .catch(console.error)
                .finally(() => {
                    this.hideInventoryCountModal()
                })
        },
        filterInventoryCount: debounce(function () {
            this.getInventoryCountList()
        }, 750),
        getInventoryCountList() {
            let dt_range = this.getDateRangeTimeStamps(
                this.select_date_range + '',
            )
            this.$schedsdk
                .list_inventory_count({
                    show_incomplete: this.show_incomplete,
                    start_date: dt_range.start_ts ? dt_range.start_ts : null,
                    end_date: dt_range.end_ts ? dt_range.end_ts : null,
                })
                .then((result) => {
                    this.$store.commit('SET_INVENTORY_COUNT_LIST', result.data)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        getDateRangeTimeStamps(dt_range_string) {
            return utils_lib.getFPickDateRangeTimeStamps(
                dt_range_string,
                this.$store.state.business_settings.business_time_zone,
            )
        },
        clearDate() {
            this.select_date_range = null
        },
        completeHandler(item_id) {
            let confirmed = confirm('Are you sure want to complete?')
            if (confirmed) {
                let data = {
                    _id: item_id,
                }
                this.$schedsdk
                    .complete_inventory_count(data)
                    .then((result) => {
                        this.getInventoryCountList()
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        },
        deleteHandler(item_id) {
            let confirmed = confirm('Are you sure want to delete?')
            if (confirmed) {
                let data = {
                    _id: item_id,
                }
                this.$schedsdk
                    .delete_inventory_count(data)
                    .then((result) => {
                        this.getInventoryCountList()
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        },
        cancelHandler(item_id) {
            let confirmed = confirm('Are you sure want to cancel?')
            if (confirmed) {
                let data = {
                    _id: item_id,
                }
                this.$schedsdk
                    .cancel_inventory_count(data)
                    .then((result) => {
                        this.getInventoryCountList()
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        },
        getFormattedDate(dt_unix) {
            if (dt_unix == null || dt_unix == 0) {
                return dt_unix
            }
            return moment(dt_unix).format('DD MMM YYYY')
        },
    },
}
</script>

<style scoped>
.action_column button {
    margin: 3px;
}
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
