<template>
    <div class="checkin-wrap pt-5">
        <!-- Header -->
        <div class="d-flex align-items-center justify-content-center pt-5">
            <!-- <router-link class="c-sidebar-brand d-md-down-none" to="/dashboard" target="_self">
                <CImage src="/img/logo-icon.png" :height="55" :viewBox="`0 0 ${minimize ? 110 : 556} 134`"/>
            </router-link> -->
            <span class="text text-hidden mt-1 brand-name">SkySalon</span>
        </div>
        <h4 class="text-center mt-3">Welcome, please Checkin</h4>

        <div>
            <div class="position-relative checkin-search-wrap mx-auto mt-5">
                <div class="position-absolute">
                    <Icon icon="tabler:search-icon" :width="34" :height="34" />
                </div>
                <input type="text" class="form-control" placeholder="Enter your Name or Email or Phone or Booking ID" v-model.trim="searchText" @input.trim="searchBookings">
                <p class="d-sm-none d-block fs-5 mt-3" >Enter your Name or Email or Phone or Booking ID</p>
            </div>
            <div class="result-wrap checkin-search-list mt-4 mx-auto rounded" v-if="searching">
                <!-- <div class="loader-container" >
                    <div class="loading-progress"></div>
                </div> -->
                <div class="loader-align" v-if="isLoading">
                <span class="loader"></span>
                </div>

                <template v-else-if="bookings.length > 1">
                    <div class="result-head border-bottom">
                        <p class="h3 p-3">Multiple bookings found, please enter more characters.</p>   
                    </div>
                    <div class="result-list">
                        <div class="result-list-item d-flex align-items-center justify-content-between px-3 py-3" v-for="booking in bookings" :key="booking._id">
                            <p class="h4 mb-0">{{ booking.first_name }} {{ booking.last_name }}</p>
                            <a href="#" @click.prevent="selectBooking(booking)" class="btn btn-success d-inline-flex gap-2">
                                <span class="h4 mb-0">Select</span>
                                <Icon icon="tabler:arrow-narrow-right" :width="34" :height="34"/>
                            </a>
                        </div>
                    </div>
                </template>
                
                <div class="result-found-container d-flex align-items-center justify-content-center flex-wrap py-5" v-else>
                    <template v-if="!customer_checkin_running">
                        <!-- v-if -->
                        <div class="text-center" v-if="booking">
                            <div class="d-block w-100 text-center mb-3">
                                <span class="opacity-50">Booking Found</span> <span class="fw-bolder">#{{booking.service_order_id}}</span>
                            </div>
                            <button class="btn btn-success px-4" @click="customerCheckin">
                                <span class="me-2">Checkin</span>
                                <Icon icon="tabler:arrow-narrow-right" :width="34" :height="34"/>
                            </button>
                        </div>
                        <!-- v-else-if -->
                        <div class="text-center" v-else>
                            <div class="d-block w-100 text-center mb-3">
                                <div class="mb-4 text-danger">
                                    <Icon icon="tabler:rosette-discount-check-off" :width="50" :height="50"/>
                                </div>
                                <span class="fw-bold">No Booking Found, please reach out to a staff member</span>
                            </div>
                            <button class="btn btn-success px-4" @click="resetTheOperation">
                                Ok
                            </button>
                        </div>
                    </template>
                    <template v-else>
                        <!-- v-else-if -->
                        <div class="text-center" v-if="customer_checkin_success">
                            <div class="d-block w-100 text-center mb-3">
                                <div class="mb-4 text-success">
                                    <Icon icon="tabler:rosette-discount-check" :width="50" :height="50"/>
                                </div>
                                <span class="fw-bold">Checkin Successful</span>
                            </div>
                            <button class="btn btn-success px-4" @click="resetTheOperation">
                                Ok
                            </button>
                        </div>
                        <!-- v-else -->
                        <div class="text-center" v-else>
                            <div class="d-block w-100 text-center mb-3">
                                <div class="mb-4 text-danger">
                                    <Icon icon="tabler:rosette-discount-check-off" :width="50" :height="50"/>
                                </div>
                                <span class="fw-bold">Checkin was usuccessful, please reach out to a staff member</span>
                            </div>
                            <button class="btn btn-success px-4" @click="resetTheOperation">
                                Ok
                            </button>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Icon } from '@/common/Icon'
import { debounce } from 'lodash'

export default {
    name: 'Customer Checkin',
    components: {
        Icon
    },
    data() {
        return ({
            searchText: '',
            bookings: [],
            booking: null,
            customer_checkin_running: false,
            customer_checkin_success: false,
            searching: false,
            isLoading: false,
            access_key: null
        })
    },
    created() {
        this.access_key = this.$route.params.accesskey;
    },
    methods: {
        async customerCheckin() {
            try {
                this.isLoading = true;
                this.customer_checkin_running = true;
                if (this.booking) {
                    const customer_checkin_result = await this.$schedsdk.customerCheckin(this.access_key, {
                        booking_id: this.booking._id,
                        customer_id: this.booking.customer_id,
                        business_id: this.booking.business_id
                    });
                    this.customer_checkin_success = true;
                }
            } catch (error) {
                this.customer_checkin_success = false;
            } finally {
                this.isLoading = false;
            }
        },
        resetData() {
            this.bookings = [];
            this.booking = null;
            this.customer_checkin_running = false;
            this.customer_checkin_success = false;
        },
        resetTheOperation() {
            this.resetData();
            this.searchText = '';
            this.searching = false;
        },
        selectBooking(booking) {
            this.booking = booking;
            this.bookings = [];
        },
        searchBookings: debounce(async function() {
            this.isLoading = true;
            this.searching = true;
            if (this.searchText.length >= 3) {
                const result = await this.$schedsdk.searchCheckins(this.access_key, {
                    search: this.searchText,
                });
                if (result.status == 1) {
                    this.bookings = result.data;
                    if (this.bookings.length == 1) {
                        this.booking = this.bookings[0];
                    }
                } else {
                    this.resetData();
                }
            }
            if (!this.searchText) {
                this.resetData();
                this.searching = false;
            }
            this.isLoading = false;
        }, 500),

    }
}
</script>
<style lang="scss" scoped>
.checkin-search-wrap {
    max-width: 888px;
    width: 100%;
    font-family: "Overpass", sans-serif;
    @media (max-width: 575.98px) {
        ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
            color: transparent;
        }
        ::-moz-placeholder { /* Firefox 19+ */
            color: transparent;
        }
        :-ms-input-placeholder { /* IE 10+ */
            color: transparent;
        }
        :-moz-placeholder { /* Firefox 18- */
            color: transparent;
        }
    }
    input {
        width: 100%;
        height: 74px;
        padding-left: 60px;
        font-size: 24px;
        font-weight: 500;
        background-color: var(--menu-background);
        color: var(--text-primary-color)/50%; 
        border: 0;
        box-shadow: 0 0 0 6px rgba(0,0,0,.05);
        @media (max-width: 575.98px) {
            font-size: 20px;
            padding-left: 50px;
            
        }
    }
    .position-absolute {
        top: 20px;
        left: 12px;
        @media (max-width: 575.98px) {
            svg {
                width: 28px !important;
            }        
        }
    }
}
.result-wrap {
    box-shadow: 0 0 0 6px rgba(0,0,0,.05);
    background-color: var(--menu-background);
    max-width: 888px;
    width: 100%;
    min-height: 200px;
    font-family: "Overpass", sans-serif;
    max-height: 430px;
    overflow-y: auto;
    p.h3 {
        padding-top: 26px !important;
    }
    .btn {
        line-height: 10px !important;
        padding-top: 11px;
    }
    .result-list-item {
        &:hover {
            background-color: var(--background-color-primary);
        }
    }
    .result-found-container {
        min-height: 200px;
        font-size: 20px;
        .btn {
            font-size: 20px;
            min-width: 100px;
            min-height: 53px;
            justify-content: center;
        }
    }
    .opacity-50 {
        opacity: .5;
    }
    .text-success {
        .icon {
            fill: #33ab55;
        }
    }
    .text-danger {
        .icon {
            fill: #d32323;
        }
    }
}
.checkin-wrap {
    background-image: url('../../assets/images/bg-checkin.png');
    background-position: left;
    background-repeat: repeat;
    height: 100vh;
    width: 100%;
    padding: 0 20px;
    .brand-name {
        font-size: 2rem;
        padding: 0 8px;
        color: var(--text-primary-color);
        font-weight: 600;
        font-family: "Overpass", sans-serif;
    }
}
.loader-align {
    min-height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    .loader {
        width: 48px;
        height: 48px;
        border: 5px solid #ACCAFF36;
        border-bottom-color: #ACCAFF;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
        }

        @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    } 
}

</style>