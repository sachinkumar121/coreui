<template>
	<div class="pt-2">
        <vue-title title="Signup for classes"></vue-title>
        <div class="d-flex align-center page-center">
            <div class="mx-auto col-md-11 col-lg-10 col-xl-9">
                <CCard class="my-4 shadow-lg border-rounded">
                    <CCardBody>
                        <div class="row">
                            <div class="col-md-12 my-2"></div>
                        </div>
                        <div class="row controls-div" style="border-color: #d8dbe0;">
                            <div class="settings-text">Filter Options</div>
                            <div class="col-md-4">
                                <label class="control-label">Search Name</label>
                                <input 
                                    v-model="search"
                                    class="form-control placeholder-no-fix" 
                                    type="text"
                                    @keyup="searchClass()"
                                />
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-2 mb-md-0" >
                                    <label class="control-label control-label w-100 d-flex justify-content-between">Select Date Range <span @click="date_range = null">clear</span></label>
                                    <flat-pickr 
                                        v-model="date_range" 
                                        :config="date_range_picker_config" 
                                        placeholder="Date Range"
                                        @input="searchClasses" />
                                </div>
                            </div>
                            <div class="col-md-3">
                                <input  class=""
                                    type="checkbox"
                                    v-model="available" 
                                    @change="searchClasses"  
                                    /> 
                                <label class="control-label">
                                    &nbsp;Available classes&nbsp; 
                                </label>
                            </div>
                        </div>
                        <div class="row" style="min-height: 51px;">
                            <div class="col-md-12 my-2 text-end">
                                <button v-if="cart.length > 0" class="btn btn-primary btn-primary-new btn-primary-small border-radius-14 px-2 px-sm-3 px-xxl-3"  @click="checkout"><span>Checkout</span></button>
                            </div>
                        </div>
                        <div class="">
                            <table class="table table-bordered table-class">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Cost</th>
                                        <th>Location</th>
                                        <th>Details</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody v-if="list.length" >
                                    <tr v-for="item in list" :key="item._id">
                                        <td data-label="Name">
                                            <div class="">
                                                <p class="mb-2 fw-500"><span class="fw-500 text-capitalize">{{item.name}}</span> <Icon icon="tabler:info-circle" :height="24" /></p>
                                                <span class="code text-uppercase fw-600">{{item.code}}</span>
                                            </div>
                                        </td>
                                        <td data-label="Cost">
                                            <p>{{item.business_currency_symbol}}{{item.class_cost}}</p>
                                        </td>
                                        <td data-label="Location">
                                            <div class="class-address">
                                                <ul>
                                                    <li class="mb-1" v-for="(location, index) in item.location" :key="index">
                                                        <p class="mb-0"><b>{{location.location_type}}</b> - {{location.room}}, {{location.building}}, {{location.address}}</p>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td>
                                        <td class="class-details" data-label="Details">
                                            <p class="class-date">{{getFormattedDateShort(item.start_date)}} - {{getFormattedDateShort(item.end_date)}}</p>
                                            <p class="class-time">{{convertTimeToAmPm(item.class_start_time)}} - {{convertTimeToAmPm(item.class_end_time)}}</p>
                                            <p class="class-schedules">Meet Every <span>{{item.meet_every}}</span></p>
                                            <ul class="class-days mb-0 mt-2">
                                                <li :class="{ 'available' : item.meeting_days_of_week.includes('Mon')}">M</li>
                                                <li :class="{ 'available' : item.meeting_days_of_week.includes('Tue')}">T</li>
                                                <li :class="{ 'available' : item.meeting_days_of_week.includes('Wed')}">W</li>
                                                <li :class="{ 'available' : item.meeting_days_of_week.includes('Thu')}">T</li>
                                                <li :class="{ 'available' : item.meeting_days_of_week.includes('Fri')}">F</li>
                                                <li :class="{ 'available' : item.meeting_days_of_week.includes('Sat')}">S</li>
                                                <li :class="{ 'available' : item.meeting_days_of_week.includes('Sun')}">S</li>
                                            </ul>
                                        </td>
                                        <td data-label="Action">
                                            <button class="btn btn-primary-small border-radius-14 px-2 px-sm-3 px-xxl-3"
                                            :class="[itemInCart(item) ? 'btn-danger' : 'btn-green btn-primary-new']" @click="itemInCart(item) ? removeFromCart(item) : addToCart(item)"><span>{{itemInCart(item) ? 'Remove from cart' : 'Add to cart' }}</span></button>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr>
                                        <td colspan="10" class="text-center">
                                            <div class="py-5">
                                                <img src="/img/no-result.svg" alt="" class="img-empty"> 
                                                <p class="h5 mt-4 d-block fw-normal">
                                                    No Item found
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                    </CCardBody>
                </CCard>
            </div>
        </div>
	</div>
</template>

<script>
import ListWithTooltip from '../ListWithTooltip.vue';
import { debounce } from 'lodash';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import utils_lib from '../../helpers/utils_lib';
import moment from 'moment';
import AppHelper from "../../helpers/app_helper";
import titleComponent from '@/common/TitleComponent.vue';
import { Icon } from '@/common/Icon';

export default {
    name: "ExternalClassList",
    components: {
        "vue-title": titleComponent,
        flatPickr,
        ListWithTooltip,
        Icon
    },
    async created() {
        this.getClassesList();
    },
    data() {
        return ({
            search: '',
            date_range_picker_config: {
                altFormat: "F j, Y",
                altInput: true,
                mode: "range"
            },
            date_range: null,
            available: false,
            list: [],
        });
    },
    computed: {
        cart() {
            return this.$store.state.cart;
        }
    },
    methods: {
        convertTimeToAmPm(time) {
            return AppHelper.convertTimeToAmPm(time);
        },
        getFormattedDateShort: function (dt_unix) {
            if (dt_unix == null || dt_unix == 0) {
                return dt_unix;
            }
            return moment(dt_unix).format("DD MMM YYYY"); //"MMM DD, YYYY hh:mm a"
            // return moment(dt_unix).format("DD MM YY hh:mma"); //"MMM DD, YYYY hh:mm a"
        },
        checkout() {
            let access_key = this.$route.params.accesskey;
            this.$router.push({
                name: 'External Class Checkout',
                params: {
                    accesskey: access_key
                }
            });
        },
        addToCart(item) {
            this.$store.commit('addToCart', item);
        },
        removeFromCart(item) {
            this.$store.commit('removeFromCart', item);
        },
        itemInCart(item) {
            return this.$store.state.cart.find(c => c._id == item._id);
        },
        searchClass: debounce(function() {
            this.searchClasses();
        }, 750),
        searchClasses() {
            let dt_range = this.getDateRangeTimeStamps(this.date_range + "");
            let access_key = this.$route.params.accesskey;

            let start_date = dt_range.start_ts || null;
            let end_date = dt_range.end_ts || null;

            this.$schedsdk.get_public_classes(access_key, {
                search: this.search,
                start_date,
                end_date,
                available: this.available
            }).then((result) => {
                this.list = result.data.filter(s => !s.is_deleted);
            }).catch((error) => {
                console.log(error);
            });
        },
        getDateRangeTimeStamps(dt_range_string) {
            return utils_lib.getFPickDateRangeTimeStamps(dt_range_string, this.$store.state.business_settings.business_time_zone)
        },
        getClassesList() {
            let access_key = this.$route.params.accesskey;
            this.$schedsdk.get_public_classes(access_key, {
                search: this.search,
            }).then((result) => {
                this.list = result.data.filter(s => (!s.is_deleted && s.class_status == "active"));
            }).catch((error) => {
                console.log(error);
            });
        }
    }
}
</script>

<style lang="scss">
.action_column button {
    margin: 3px
}
.btn.btn-green {
    background-color: #33ab55;
    border-color: #33ab55;   
}
.controls-div {
    float: left;
    width: 100%;
    border: 1px solid #d8dbe0;
    padding: 15px 4px;
    margin: 0 0 1rem 0!important;
    padding-top: 20px;
    position: relative;
}
.page-center {
    min-height: calc(100vh - 56px);
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
.btn.btn-primary-small {
    min-height: 34px;
}
.form-control:disabled, .form-control[readonly] {
    background-color: #fff;
}
/*  */
.code {
    background-color: rgba(233, 229, 255, .75);
    color: #6D57E4;
    padding: 5px 10px;
    border-radius: 4px;
}
.class-address {
    ul, li {
        list-style: none;
    }
    ul {
        padding-left: 0;
    }
    li {
        position: relative;
        padding: 10px 10px 10px 22px;
        background-color: rgba(233, 229, 255, .75);
        display: block;
        border-radius: 4px;
        max-width: 200px;
        &:before {
            content:'';
            position: absolute;
            height: 6px;
            width: 6px;
            border-radius: 6px;
            background-color: #6D57E4;
            left: 12px;
            top: 18px;
        }
        p {
            color: #6D57E4;
        }
    }
}
.form-control[readonly] {
    border: 1px solid #d8dbe0;
    background-color: #fff;
}
.class-details {
    min-width: 25%;
    p {
        margin-bottom: 5px;
    }
    .class-times, .class-schedules, .class-date {
        font-weight: 500;
    }
    .class-schedules {
        span {
            background: #6D57E4;
            color: #fff;
            padding: 2px 4px;
            border-radius: 4px;
        }
    }
}
ul.class-days {
    padding-left: 0;
    list-style: none;
    display: inline-flex;
    li {
        width: 24px;
        height: 24px;
        border-radius: 24px;
        display: inline-flex;
        margin-right: 5px;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        color: #9A9AB0;
        // padding-top: 6px;
    }
}
td[data-label="Cost"] {
    min-width: 70px;
}
td[data-label="Action"] {
    min-width: 16%;
}
.table-class {
    
    td {
        p {
            margin-bottom: 0;
        }
    }
}
@media (max-width: 767.98px) {
    .table-class {
        thead {
            display: none;
        }        
        tr {
            margin-bottom: 15px;
            display: block;
        }
        tbody {
            td {
                border-bottom: 1px solid #ddd;
                display: block;
                font-size: 0.9em;
                text-align: left;
                padding-left: 110px;
                position: relative;
                &::before {
                    content: attr(data-label);
                    float: left;
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                    background: #F9F8FF;
                    min-width: 99px;
                    top: 0;
                    padding: 9px 15px;
                    height: 100%;
                    border-color: #E7E7E7;
                    border-collapse: collapse;
                    border-style: solid;
                    border-width: 0 1px;
                }
            }
        }
    }
}
</style>