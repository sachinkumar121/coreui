<template>
    <div>
        <div class="position-relative checkin-search-wrap mx-auto mt-5">
            <div class="position-absolute">
                <Icon icon="tabler:search-icon" :width="34" :height="34" />
            </div>
            <input type="text" class="form-control" placeholder="Enter your Name or Email or Phone or Booking ID">
            <p class="d-sm-none d-block fs-5 mt-3" >Enter your Name or Email or Phone or Booking ID</p>
        </div>
        <div class="result-wrap checkin-search-list mt-4 mx-auto rounded">
            <div class="result-head border-bottom">
                <p class="h3 p-3">Multiple bookings found, please enter more characters.</p>   
            </div>
            <div class="result-list">
                <div class="result-list-item d-flex align-items-center justify-content-between px-3 py-3">
                    <p class="h4 mb-0">Johnathan</p>
                    <a href="#" class="btn btn-success d-inline-flex gap-2">
                        <span class="h4 mb-0">Select</span>
                        <Icon icon="tabler:arrow-narrow-right" :width="34" :height="34"/>
                    </a>
                </div>
                <div class="result-list-item d-flex align-items-center justify-content-between px-3 py-3">
                    <p class="h4 mb-0">John</p>
                    <a href="#" class="btn btn-success d-inline-flex gap-2">
                        <span class="h4 mb-0">Select</span>
                        <Icon icon="tabler:arrow-narrow-right" :width="34" :height="34"/>
                    </a>
                </div>
                <div class="result-list-item d-flex align-items-center justify-content-between px-3 py-3">
                    <p class="h4 mb-0">Johnson</p>
                    <a href="#" class="btn btn-success d-inline-flex gap-2">
                        <span class="h4 mb-0">Select</span>
                        <Icon icon="tabler:arrow-narrow-right" :width="34" :height="34"/>
                    </a>
                </div>
                <div class="result-list-item d-flex align-items-center justify-content-between px-3 py-3">
                    <p class="h4 mb-0">Johnson Doe</p>
                    <a href="#" class="btn btn-success d-inline-flex gap-2">
                        <span class="h4 mb-0">Select</span>
                        <Icon icon="tabler:arrow-narrow-right" :width="34" :height="34"/>
                    </a>
                </div>
                <div class="result-list-item d-flex align-items-center justify-content-between px-3 py-3">
                    <p class="h4 mb-0">John Doe</p>
                    <a href="#" class="btn btn-success d-inline-flex gap-2">
                        <span class="h4 mb-0">Select</span>
                        <Icon icon="tabler:arrow-narrow-right" :width="34" :height="34"/>
                    </a>
                </div>
                <div class="result-list-item d-flex align-items-center justify-content-between px-3 py-3">
                    <p class="h4 mb-0">Johnathan</p>
                    <a href="#" class="btn btn-success d-inline-flex gap-2">
                        <span class="h4 mb-0">Select</span>
                        <Icon icon="tabler:arrow-narrow-right" :width="34" :height="34"/>
                    </a>
                </div>
            </div>
            <div class="result-found d-flex align-items-center justify-content-center flex-wrap py-5">
                <!-- v-if -->
                <div class="text-center">
                    <div class="d-block w-100 text-center mb-3">
                        <span class="opacity-50">Booking Found</span> <span class="fw-bolder">#WKNFV3357</span>
                    </div>
                    <button class="btn btn-success px-4">
                        <span class="me-2">Checkin</span>
                        <Icon icon="tabler:arrow-narrow-right" :width="34" :height="34"/>
                    </button>
                </div>
                <!-- v-else-if -->
                <div class="text-center">
                    <div class="d-block w-100 text-center mb-3">
                        <div class="mb-4 text-danger">
                            <Icon icon="tabler:rosette-discount-check-off" :width="50" :height="50"/>
                        </div>
                        <span class="fw-bold">No Booking Found, please reach out to a staff member</span>
                    </div>
                    <button class="btn btn-success px-4">
                        Ok
                    </button>
                </div>
                <!-- v-else-if -->
                <div class="text-center">
                    <div class="d-block w-100 text-center mb-3">
                        <div class="mb-4 text-success">
                            <Icon icon="tabler:rosette-discount-check" :width="50" :height="50"/>
                        </div>
                        <span class="fw-bold">Checkin Successful</span>
                    </div>
                    <button class="btn btn-success px-4">
                        Ok
                    </button>
                </div>
                <!-- v-else -->
                <div class="text-center">
                    <div class="d-block w-100 text-center mb-3">
                        <div class="mb-4 text-danger">
                            <Icon icon="tabler:rosette-discount-check-off" :width="50" :height="50"/>
                        </div>
                        <span class="fw-bold">Checkin was usuccessful, please reach out to a staff member</span>
                    </div>
                    <button class="btn btn-success px-4">
                        Ok
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {Icon} from '@/common/Icon'
export default {
    name: 'BookingSearch',
    components: {
        Icon
    },
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
    .result-found {
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
</style>