<template>
    <CCard class="card-custom mx-n-15 mt-3 border-0">
        <!-- <message-center-credits /> -->
        <Alerts
            :alertData="alertData"
            :show="show"
            @alertClosed="alertClosedFn"
            v-if="alert"
        />
        <CCardBody class="p-2 p-sm-3">
            <CRow class="align-items-start gx-1 filter-wrap">
                <CCol class="col-12 col-xl-9 mb-2 order-2 order-xl-1">
                    <CRow class="gx-3" v-if="isCustomerUserType">
                        <CCol class="col-xxl-8 col-md-10 col-sm-12 mb-lg-2 mb-xl-0">
                            <CRow class="gx-3">
                                <CCol
                                    sm="6"
                                    class="col-12 filter-date-modal custom-float-date-picker picker-select date-range-pad mb-0 mb-xl-0 position-relative"
                                    :class="[
                                        isFlatPickrOpen ||
                                        bp_preferences.select_date_range
                                            ? 'picker-focused'
                                            : null,
                                    ]"
                                >
                                    <div class="d-flex justify-content-between">
                                        <!-- <CFormLabel for="range">Service Date Rage</CFormLabel> -->
                                        <span
                                            @click="clearDate()"
                                            class="cursor-pointer position-absolute calendar-icon icon-close-fix"
                                        >
                                            <Icon
                                                icon="tabler:x"
                                                :height="20"
                                                :width="15"
                                                class="text-black"
                                            />
                                        </span>
                                    </div>
                                    <flat-pickr
                                        @input="searchBookingsList"
                                        @on-open="isFlatPickrOpen = true"
                                        @on-close="isFlatPickrOpen = false"
                                        v-model="
                                            bp_preferences.select_date_range
                                        "
                                        :config="date_range_picker_config"
                                        placeholder=""
                                        class="w-100 form-control"
                                    />
                                    <label class="float-label"
                                        >Select Date</label
                                    >
                                </CCol>
                                <CCol sm="6">
                                    <div class="form-floating filter-status">
                                        <v-select
                                            id="select-status"
                                            placeholder=""
                                            multiple
                                            v-model="bp_preferences.booking_status_type"
                                            label="label"
                                            :options="bookingStatusType"
                                            :reduce="(st) => st.value"
                                            @update:modelValue="searchBookingsList()"
                                            :class="{
                                                'options-selected':
                                                    bp_preferences.booking_status_type
                                                        .length > 0,
                                            }"
                                        >
                                            <template v-slot:no-options>
                                                Type to search..
                                            </template>
                                            <template v-slot:option="option">
                                                <div class="d-center">
                                                    {{ option.label }}
                                                </div>
                                            </template>
                                            <template v-slot:selected-option="option">
                                                <div class="selected d-center">
                                                    {{ option.label }}
                                                </div>
                                            </template>
                                        </v-select>
                                        <label for="select-status">Status</label>
                                    </div>
                                </CCol>
                            </CRow>
                        </CCol>
                    </CRow>
                    <CRow class="gx-1 justify-content-evenly" v-else>
                        <CCol sm="12" md="7" xxl="8" class="mb-lg-2 mb-xl-0">
                            <!-- <CFormLabel for="email">Email/Phone/Name</CFormLabel> -->
                            <CRow class="gx-1">
                                <CCol sm="6" class="mb-2 mb-xl-0">
                                    <div class="form-floating">
                                        <input
                                            type="email"
                                            class="form-control"
                                            id="floatingEmail"
                                            placeholder="Email/Phone/Name"
                                            v-model="search"
                                            @keyup="searchBookingsList()"
                                        />
                                        <label for="floatingEmail"
                                            >Email/Phone/Name</label
                                        >
                                    </div>
                                    <!-- <CFormInput type="text" id="search" placeholder="Email/Phone/Name" v-model="search" @keyup="searchBookingsList()"/> -->
                                </CCol>

                                <CCol
                                    sm="6"
                                    class="col-12 filter-date-modal custom-float-date-picker picker-select date-range-pad mb-0 mb-xl-0 position-relative"
                                    :class="[
                                        isFlatPickrOpen ||
                                        bp_preferences.select_date_range
                                            ? 'picker-focused'
                                            : null,
                                    ]"
                                >
                                    <div class="d-flex justify-content-between">
                                        <!-- <CFormLabel for="range">Service Date Rage</CFormLabel> -->
                                        <span
                                            @click="clearDate()"
                                            class="cursor-pointer position-absolute calendar-icon icon-close-fix"
                                        >
                                            <Icon
                                                icon="tabler:x"
                                                :height="20"
                                                :width="15"
                                                class="text-black"
                                            />
                                        </span>
                                    </div>
                                    <flat-pickr
                                        @input="searchBookingsList"
                                        @on-open="isFlatPickrOpen = true"
                                        @on-close="isFlatPickrOpen = false"
                                        v-model="
                                            bp_preferences.select_date_range
                                        "
                                        :config="date_range_picker_config"
                                        placeholder=""
                                        class="w-100 form-control"
                                    />
                                    <label class="float-label"
                                        >Select Date</label
                                    >
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol sm="12" md="5" xxl="4" class="mt-2 mt-md-0">
                            <!-- <CFormLabel for="status">Status</CFormLabel> -->
                            <div class="form-floating filter-status">
                                <v-select
                                    id="select-status"
                                    placeholder=""
                                    multiple
                                    v-model="bp_preferences.booking_status_type"
                                    label="label"
                                    :options="bookingStatusType"
                                    :reduce="(st) => st.value"
                                    @update:modelValue="searchBookingsList()"
                                    :class="{
                                        'options-selected':
                                            bp_preferences.booking_status_type
                                                .length > 0,
                                    }"
                                >
                                    <template v-slot:no-options>
                                        Type to search..
                                    </template>
                                    <template v-slot:option="option">
                                        <div class="d-center">
                                            {{ option.label }}
                                        </div>
                                    </template>
                                    <template v-slot:selected-option="option">
                                        <div class="selected d-center">
                                            {{ option.label }}
                                        </div>
                                    </template>
                                </v-select>
                                <label for="select-status">Status</label>
                            </div>

                            <!-- <CFormSelect id="status" placeholder="Status" aria-label="Default select example" @change="searchBookingsList()" :html-size="1" multiple>
                                <option value="cancelled">Cancelled</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                                </CFormSelect> -->
                            <!-- <CFormInput type="text text-hidden" id="status" placeholder="Status" /> -->
                        </CCol>
                    </CRow>
                    <CRow class="row gx-1 mt-2 mt-sm-0 mt-xl-2">
                        <div class="col-md-12" v-if="show_bulk_options">
                            <button
                                class="btn btn-danger me-2"
                                :disabled="bulk_buttons_disabled"
                                @click="bulkCommonOperation('cancel')"
                            >
                                Bulk Cancel
                            </button>

                            <button
                                class="btn btn-primary-new"
                                :disabled="bulk_buttons_disabled"
                                @click="bulkCommonOperation('complete')"
                            >
                                Bulk Complete
                            </button>
                            <label class="control-label">
                                <b>{{ bulkOperationInProgress }}</b>
                            </label>
                        </div>
                    </CRow>
                </CCol>
                <CCol
                    class="col-12 col-xl-3 d-flex justify-content-between mb-3 mb-xl-0 justify-content-xl-end order-1 order-xl-2"
                >
                    <div class="d-inline-flex align-items-center">
                        <button
                            v-if="!isCustomerUserType"
                            class="btn btn-outline-dark position-relative border-radius-14 btn-outline-new px-3 px-sm-3 px-xxl-3"
                            color="primary"
                            @click="
                                () => {
                                    filterModal = true
                                }
                            "
                        >
                            <Icon
                                icon="tabler:adjustments-horizontal"
                                :height="19"
                                class="icon-align"
                            />
                            <span class="ms-1 fs-16 fw-500">Filter</span>
                            <span
                                class="filter-applied position-absolute"
                                v-if="filter_applied"
                            ></span>
                        </button>
                        <button
                            class="header-toggler round-btn refresh-btn ms-1 transition"
                            @click="refreshCachedData"
                            v-bind:style="{transform: `rotate(${deg}deg)`}"
                            type="button"
                            alt="refresh-icon-btn"
                            color="primary"
                            v-c-tooltip="'Refresh'"
                        >
                            <Icon icon="ion:refresh" :height="24" />
                        </button>
                    </div>
                    <div class="d-inline-flex align-items-center">
                        <button
                            class="btn btn-primary btn-primary-new border-radius-14 min-height-44 ms-1 px-2 px-sm-3 px-xxl-3"
                            @click="newBookingClick()"
                        >
                            <Icon
                                icon="tabler:plus"
                                :height="22"
                                class="icon-align"
                            />
                            <span class="fs-16 ms-1 fw-500">New </span>
                        </button>
                    </div>
                </CCol>
            </CRow>
            <CRow class="gx-0">
                <CCol>
                    <table
                        bordered
                        class="table-booking table-custom table table-bordered"
                    >
                        <thead>
                            <tr>
                                <!-- <th>S.no</th> -->
                                <th v-if="isSimpleListing == false">
                                    Service ID
                                </th>
                                <th>Appt. Date</th>
                                <th>Customer</th>
                                <th>Provider</th>
                                <th class="width-service">Services</th>
                                <th v-if="isSimpleListing == false">Invoice</th>
                                <th v-if="isSimpleListing == false">Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody class="no-result-tbody loading"  v-if="loading">
                            <tr>
                                <td colspan="8" class="text-center">
                                    <div class="py-5 mx-auto">
                                        <!-- 1 -->
                                        <div class="loader-outer">
                                            <div class="loader-inner">
                                                <div
                                                    class="loader loader--style1"
                                                    title="0"
                                                >
                                                    <svg
                                                        version="1.1"
                                                        id="loader-1"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        x="0px"
                                                        y="0px"
                                                        width="80px"
                                                        height="80px"
                                                        viewBox="0 0 40 40"
                                                        enable-background="new 0 0 40 40"
                                                        xml:space="preserve"
                                                    >
                                                        <path
                                                            opacity="0.2"
                                                            fill="#000"
                                                            d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                                                    s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                                                    c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
                                                        />
                                                        <path
                                                            fill="#000"
                                                            d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                                                    C22.32,8.481,24.301,9.057,26.013,10.047z"
                                                        >
                                                            <animateTransform
                                                                attributeType="xml"
                                                                attributeName="transform"
                                                                type="rotate"
                                                                from="0 20 20"
                                                                to="360 20 20"
                                                                dur="0.9s"
                                                                repeatCount="indefinite"
                                                            />
                                                        </path>
                                                    </svg>
                                                </div>
                                                <p class="h5 d-block">
                                                    Loading...
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else-if="list.length">
                            <tr v-for="(item, index) in list" :key="item._id">
                                <td
                                    v-if="isSimpleListing == false"
                                    data-label="Service ID"
                                >
                                    <div
                                        class="d-flex align-items-center justify-content-lg-between"
                                    >
                                        <div>
                                            <CFormCheck
                                                :key="item._id"
                                                inline
                                                @change="
                                                    serviceSelect(item, $event)
                                                "
                                            />
                                            <span
                                                class="ms-1 me-1 ms-xl-2 me-xl-2 cursor-pointer btn-link c-sub-text"
                                                @click="
                                                    $router.push(
                                                        '/bookings/detail/' +
                                                            item._id,
                                                    )
                                                "
                                                >{{
                                                    item.service_order_id
                                                }}</span
                                            >
                                        </div>
                                        <Icon
                                            :icon="
                                                getBookingSourceIcon(
                                                    item.booking_source,
                                                )
                                            "
                                            :width="20"
                                            :height="20"
                                            class="icon-text opacity-7 ml-mobile"
                                            v-c-tooltip="
                                                getBookingSource(
                                                    item.booking_source,
                                                )
                                            "
                                        />
                                    </div>
                                    <div class="c-sub-text">
                                        {{
                                            getFormattedDateShort(
                                                item.booking_request_date,
                                            )
                                        }}
                                    </div>
                                </td>
                                <td data-label="Appt. Date">
                                    <div>
                                        <Icon
                                            v-if="
                                                getPayStatus(item) == 'Canceled'
                                            "
                                            v-c-tooltip="'Cancelled'"
                                            icon="ion:close-circle-sharp"
                                            :height="19"
                                            class="appointment-created"
                                        ></Icon>
                                        <template v-else>
                                            <Icon
                                                v-if="
                                                    !item.customer_confirmed_appt &&
                                                    !item.customer_checkin_time
                                                "
                                                v-c-tooltip="'Created'"
                                                icon="ion:checkmark-circle-sharp"
                                                :height="19"
                                                class="appointment-created"
                                            ></Icon>
                                            <Icon
                                                v-else-if="
                                                    item.customer_confirmed_appt
                                                "
                                                v-c-tooltip="
                                                    'Customer Confirmed on ' +
                                                    getFormattedDateShort(
                                                        item.customer_confirmed_appt,
                                                    )
                                                "
                                                icon="ion:checkmark-circle-sharp"
                                                :height="19"
                                                class="appointment-confirmed"
                                            ></Icon>
                                            <Icon
                                                v-else
                                                v-c-tooltip="
                                                    'Customer Checked in on ' +
                                                    getFormattedDateShort(
                                                        item.customer_checkin_time,
                                                    )
                                                "
                                                icon="ion:checkmark-done-circle-sharp"
                                                :height="19"
                                                class="appointment-checked"
                                            ></Icon>
                                        </template>
                                        <span
                                            v-if="
                                                item.service_start_date !=
                                                    null &&
                                                item.service_start_date != 0
                                            "
                                            class="me-1 fw-600"
                                            >{{
                                                getFormattedDate(
                                                    item.service_start_date,
                                                )[0]
                                            }}</span
                                        >
                                        <span class="opacity-85">{{
                                            getFormattedDate(
                                                item.service_start_date,
                                            )[1]
                                        }}</span>
                                    </div>

                                    <div
                                        v-if="
                                            item.assigned_resource_ids &&
                                            item.assigned_resource_ids.length >
                                                0
                                        "
                                    >
                                        <span
                                            v-for="opt in item.assigned_resource_ids"
                                            v-bind:key="opt._id"
                                        >
                                            <span
                                                class="c-sub-text position-relative appoint-room btn-link cursor-pointer"
                                                @click.prevent="
                                                    changeAssignedResources(
                                                        item,
                                                    )
                                                "
                                                >{{ getResourcesList(opt) }}
                                            </span>
                                            &nbsp;
                                        </span>
                                    </div>
                                </td>

                                <td data-label="Customer">
                                    <div
                                        class="d-flex align-items-center flex-wrap"
                                    >
                                        <a
                                            v-if="
                                                getWalkinCustomerDetails(
                                                    item,
                                                ) != null
                                            "
                                            @click.prevent="
                                                convertWalkinToCustomer(item)
                                            "
                                            class="me-1 text-decoration-underline text-capitalize"
                                            >{{
                                                getCustomerOrParentName(item)
                                            }}</a
                                        >

                                        <a
                                            v-else
                                            @click.prevent="
                                                viewUserInfo(
                                                    item.customer,
                                                    'customer',
                                                )
                                            "
                                            class="me-1 text-decoration-underline text-capitalize"
                                            >{{
                                                getCustomerOrParentName(item)
                                            }}</a
                                        >
                                        <Icon
                                            v-if="item.client_notes != ''"
                                            icon="tabler:clipboard"
                                            :height="18"
                                            class="color-a"
                                            v-c-popover="{
                                                content: item.client_notes,
                                            }"
                                        />
                                        <span
                                            v-if="
                                                getWalkinCustomerDetails(
                                                    item,
                                                ) != null
                                            "
                                            >Walkin</span
                                        >
                                        <span
                                            v-if="
                                                item.linked_booking_hard_link ==
                                                true
                                            "
                                            class="w-100"
                                        >
                                            <button
                                                @click="
                                                    viewLinkedBookingInfo(
                                                        item,
                                                        index,
                                                    )
                                                "
                                                class="p-0 btn btn-sm btn-link c-sub-text"
                                            >
                                                Linked
                                            </button>
                                        </span>
                                    </div>
                                </td>
                                <td data-label="Provider">
                                    <span class="text-capitalize"
                                        >{{ item.service_provider.first_name }}
                                        {{
                                            item.service_provider.last_name.charAt(
                                                0,
                                            )
                                        }}</span
                                    >
                                </td>
                                <td data-label="Services" class="service-td">
                                    <booking-services-list
                                        :item="item"
                                        :simplelist="isSimpleListing"
                                        :key="isSimpleListing"
                                    />
                                    <!-- <span v-html="getServiceNames(item)"></span> -->
                                    <!-- <div class="table-subtext text-hidden">
                                        <a class="me-2 text-underline" v-c-popover="{content: 'Lorem ipsum dolor'}"><Icon icon="tabler:plus" :height="15"  /><u>2 more</u></a>
                                        <span class="opacity-7">30 mins</span>
                                        </div> -->
                                </td>
                                <td
                                    v-if="isSimpleListing == false"
                                    data-label="Invoice"
                                >
                                    <div
                                        :class="getInvoiceAmountClasses(item)"
                                        class="invoice-btn"
                                        v-if="
                                            item.invoice_info_summary &&
                                            item.invoice_info_summary.length > 0
                                        "
                                        @click="
                                            $router.push(
                                                '/invoices/detail/' +
                                                    item.invoice_info_summary[0]
                                                        .invnumber,
                                            )
                                        "
                                    >
                                        {{ currency_symbol
                                        }}{{ getInvoiceTotal(item) }}
                                        <!-- <br>
                                        {{getIsPaidStatus(item)}}
                                        <span v-if="getIsPaidStatus(item) != 'Paid'"
                                            class="ms-1" v-c-tooltip="'Not Paid'">
                                            <Icon icon="tabler:receipt-off" :height="18" class="color-a"/>
                                         </span>
                                        -->
                                    </div>
                                    <br />
                                    <span
                                        class="c-sub-text text-hidden opacity-7"
                                        >{{ getIsPaidStatus(item) }}</span
                                    >
                                </td>
                                <td
                                    v-if="isSimpleListing == false"
                                    data-label="Status"
                                >
                                    <span v-html="getPayStatus(item)"></span>
                                    <span
                                        v-if="
                                            item.canceled_due_to_no_show !==
                                                null &&
                                            item.canceled_due_to_no_show == true
                                        "
                                    >
                                        <Icon
                                            icon="bx:calendar-x"
                                            :height="18"
                                            class="color-a ms-2"
                                            v-c-tooltip="'No Show'"
                                        />
                                    </span>
                                    <span
                                        v-if="
                                            item.cancel_user_reason != null &&
                                            item.cancel_user_reason.length > 3
                                        "
                                    >
                                        <button
                                            @click="viewCancelNotes(item)"
                                            class="ps-1 btn btn-sm btn-link position-middle"
                                            v-c-tooltip="'Note'"
                                        >
                                            <Icon
                                                icon="tabler:clipboard"
                                                :height="18"
                                                class="color-a"
                                            />
                                        </button>
                                    </span>
                                </td>
                                <td data-label="Action" class="action_column">
                                    <Icon
                                        v-if="!isCustomerUserType"
                                        icon="tabler:edit"
                                        class="btn-link cursor-pointer"
                                        :height="20"
                                        @click="editHandler(item._id)"
                                    />
                                    <CDropdown class="dropstart">
                                        <CDropdownToggle color="primary">
                                            <Icon
                                                icon="tabler:dots-vertical"
                                                :height="20"
                                            />
                                        </CDropdownToggle>
                                        <CDropdownMenu>
                                            <CDropdownItem
                                                v-if="!isCustomerUserType"
                                                href="javascript:void(0)"
                                                @click="editHandler(item._id)"
                                            >
                                                <div>
                                                    <Icon
                                                        icon="tabler:edit"
                                                        :height="20"
                                                    />
                                                    <span>Edit</span>
                                                </div>
                                            </CDropdownItem>
                                            <CDropdownItem
                                                href="javascript:void(0)"
                                                @click="
                                                    $router.push(
                                                        '/bookings/detail/' +
                                                            item._id,
                                                    )
                                                "
                                            >
                                                <div>
                                                    <Icon
                                                        icon="tabler:list-details"
                                                        :height="20"
                                                    />
                                                    <span>Detail</span>
                                                </div>
                                            </CDropdownItem>
                                            <CDropdownItem
                                                href="javascript:void(0)"
                                                v-if="
                                                    item.type != 1 &&
                                                    item.type != 2 &&
                                                    item.type != 8
                                                "
                                                @click="
                                                    cancelHandler(
                                                        item._id,
                                                        item.service_order_id,
                                                    )
                                                "
                                            >
                                                <div>
                                                    <Icon
                                                        icon="tabler:backspace"
                                                        :height="20"
                                                    />
                                                    <span>Cancel</span>
                                                </div>
                                            </CDropdownItem>
                                            <CDropdownItem
                                                href="javascript:void(0)"
                                                @click="takePayment(item)"
                                            >
                                                <div>
                                                    <Icon
                                                        icon="bi:currency-dollar"
                                                        :height="20"
                                                    />
                                                    <span>Pay</span>
                                                </div>
                                            </CDropdownItem>
                                            <CDropdownItem
                                                v-if="!isCustomerUserType"
                                                href="javascript:void(0)"
                                                @click="
                                                    completeHandler(
                                                        item._id,
                                                        item.service_order_id,
                                                    )
                                                "
                                            >
                                                <div>
                                                    <Icon
                                                        icon="bi:check-all"
                                                        :height="20"
                                                    />
                                                    <span>Complete</span>
                                                </div>
                                            </CDropdownItem>
                                            <CDropdownItem
                                                v-if="!isCustomerUserType"
                                                href="javascript:void(0)"
                                                @click="
                                                    rebookHandler(
                                                        item._id,
                                                        item.service_order_id,
                                                    )
                                                "
                                            >
                                                <div>
                                                    <Icon
                                                        icon="ion:refresh"
                                                        :height="20"
                                                    />
                                                    <span>Re-Book</span>
                                                </div>
                                            </CDropdownItem>

                                            <CDropdownItem
                                                href="javascript:void(0)"
                                                @click="
                                                    toggleBookingConfirmation(
                                                        item,
                                                    )
                                                "
                                            >
                                                <div>
                                                    <Icon
                                                        v-if="
                                                            item.customer_confirmed_appt
                                                        "
                                                        icon="tabler:shield-off"
                                                        :height="20"
                                                    />
                                                    <Icon
                                                        v-else
                                                        icon="tabler:shield-check"
                                                        :height="20"
                                                    />
                                                    <span
                                                        v-if="
                                                            item.customer_confirmed_appt
                                                        "
                                                        >Mark as cust.
                                                        unconfirmed</span
                                                    >
                                                    <span v-else
                                                        >Customer confirm</span
                                                    >
                                                </div>
                                            </CDropdownItem>
                                        </CDropdownMenu>
                                    </CDropdown>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else class="no-result-tbody">
                            <tr>
                                <td colspan="8" class="text-center empty_resul">
                                    <div class="py-5 t mx-auto  ">
                                        <img
                                            src="/img/no-result.svg"
                                            alt=""
                                            class="img-empty"
                                        />
                                        <p class="h5 mt-4 d-block fw-normal">
                                            No bookings found!
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </CCol>
            </CRow>
        </CCardBody>
        <CModal
            size="lg"
            alignment="center"
            :visible="filterModal"
            @close="
                () => {
                    filterModal = false
                }
            "
        >
            <CModalHeader
                class="text-center justify-content-center modal-filter-header"
            >
                <CModalTitle>Filters</CModalTitle>
            </CModalHeader>
            <CModalBody class="pb-5 modal-filter-body">
                <CRow class="mb-3">
                    <CCol class="col-12 col-sm-6 mb-3 mb-sm-0">
                        <div class="">
                            <CFormLabel for="booking_id"
                                >Booking/Order ID</CFormLabel
                            >
                            <input
                                type="text"
                                class="form-control"
                                id="booking_id"
                                v-model="filter.service_order_search"
                                placeholder="Booking/Order ID"
                            />
                        </div>
                    </CCol>
                    <CCol class="col-12 col-sm-6">
                        <CFormLabel for="select">Filter by Provider</CFormLabel>
                        <v-select
                            placeholder="Select providers"
                            multiple
                            label="first_name"
                            v-model="filter.filter_service_providers"
                            :options="provider_option"
                        >
                            <template v-slot:no-options="{search, searching}">
                                <template v-if="searching">
                                    No results found for <em>{{ search }}</em
                                    >.
                                </template>
                                <em v-else style="opacity: 0.5"
                                    >Start typing to search</em
                                >
                            </template>
                            <template v-slot:option="option">
                                <div class="d-center">
                                    {{ option.first_name }}
                                    {{ option.last_name }}
                                </div>
                            </template>
                            <template v-slot:selected-option="option">
                                <div
                                    style="display: flex; align-items: baseline"
                                >
                                    <div class="selected d-center">
                                        {{ option.first_name }}
                                        {{ option.last_name }}
                                    </div>
                                </div>
                            </template>
                        </v-select>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol>
                        <CFormCheck
                            id="bt_show_only_todays"
                            label="Show today's booking"
                            v-model="filter.bt_show_only_todays"
                        />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol>
                        <CFormCheck
                            id="bt_show_bookings_in_last_24hrs"
                            label="Show bookings created in past 24 Hrs"
                            v-model="filter.bt_show_bookings_in_last_24hrs"
                        />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol>
                        <CFormCheck
                            id="completedButNoPayCapture"
                            label="Show payments in 'authed'"
                            v-model="filter.completedButNoPayCapture"
                        />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol>
                        <CFormCheck
                            id="bt_simplified_listing_id"
                            label="Simplified listing"
                            v-model="filter.bt_simplified_listing"
                        />
                    </CCol>
                </CRow>
                <CRow v-if="show_team_members_filter">
                    <CCol>
                        <CFormCheck
                            id="view_team_members_only"
                            label="Show team member appointments"
                            v-model="filter.view_team_members_only"
                        />
                    </CCol>
                </CRow>
            </CModalBody>
            <CModalFooter class="d-flex justify-content-between">
                <CButton
                    type="button"
                    class="dark-link cursor-pointer fs-14"
                    @click="resetFilterData"
                >
                    Clear All
                </CButton>
                <CButton class="btn btn-dark-new justify-content-center" @click="applyFilter"
                    >Apply</CButton
                >
            </CModalFooter>
        </CModal>
        <EventEditorModal 
            :visible="showEditor"
            @close="showEditor = false"
            @refresh-data="refreshCachedData"
            :event-record="eventRecord"
            :resourceId="resourceId"
            :key="edit_obj_id"
        />
        <!-- <EventEditor
            :visible="showEditor"
            @modal:close="showEditor = false"
            ref="eventEditor"
            :eventRecord="eventRecord"
            :eventStore="eventStore"
            :resourceId="resourceId"
            :key="edit_obj_id"
        ></EventEditor> -->
        <!-- Pay by card on file -->
        <CModal
            alignment="center"
            :backdrop="true"
            :keyboard="true"
            :visible="show_pay_modal"
            @close="closePayModal"
        >
            <CModalHeader>
                <CModalTitle>Select Card On File or Pay</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    <div class="col-md-6" color="danger">
                        <label class="control-label">
                            <b>Select card on file to pay with: </b>&nbsp;
                        </label>
                    </div>
                    <div
                        class="col-md-6"
                        color="danger"
                        v-if="cards_on_file_list.length"
                    >
                        <select class="form-control" v-model="selected_card_id">
                            <option
                                v-for="opt in cards_on_file_list"
                                v-bind:key="opt._id"
                                :selected="
                                    opt._id == selected_card_id ? true : false
                                "
                                :value="opt._id"
                            >
                                {{
                                    opt.nick_name +
                                    ' ' +
                                    opt.last4 +
                                    ' Exp. ' +
                                    opt.exp_month +
                                    '/' +
                                    opt.exp_year
                                }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-6" v-else>
                        No saved cards. You can save a card when paying next.
                    </div>
                </div>
                <br />
                <div class="row">
                    <div class="col-md-12" color="danger">
                        <b> {{ pm_error_message }}</b>
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton
                    v-if="show_paycof == true"
                    @click="payWithNewCard"
                    color="info"
                    class="mr-auto"
                    >Pay with new card</CButton
                >
                <CButton
                    v-if="show_paycof == true"
                    :disabled="checkout_btn_disabled"
                    @click="continueToPayCof()"
                    color="success"
                    >{{ checkout_text }}</CButton
                >
                <CButton
                    v-if="show_paycof == true"
                    @click="closePayModal()"
                    color="danger"
                    >Cancel</CButton
                >
                <CButton
                    v-if="show_paycof != true"
                    @click="closePayModal()"
                    color="success"
                    >OK</CButton
                >
            </CModalFooter>
        </CModal>
        <CModal :visible="show_client_notes_modal" @close="closeNotesModal">
            <CModalHeader>
                <CModalTitle>{{ client_notes_modal_title }}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    <div class="col-md-12">
                        {{ client_note }}
                    </div>
                </div>
                <br />
                <div class="row">
                    <div class="col-md-12" color="danger">
                        <b> {{ cn_error_message }}</b>
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="closeNotesModal()" color="success">OK</CButton>
            </CModalFooter>
        </CModal>
        <CModal
            :visible="show_linked_booking_info"
            @close="closeLinkedBookingModal"
        >
            <CModalHeader>
                <CModalTitle>Linked Booking</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    <div class="col-md-12">
                        {{ linked_booking_info_text }}
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">Order ID</div>
                    <div class="col-md-4">Customer</div>
                    <div class="col-md-4">Service Provider</div>
                </div>
                <div
                    v-for="item in linked_bookings_display_array"
                    :key="item._id"
                    class="row"
                >
                    <div class="col-md-4">
                        {{ item.service_order_id }}
                    </div>
                    <div class="col-md-4">
                        {{ item.customer.first_name }}
                        {{ item.customer.last_name }}
                    </div>
                    <div class="col-md-4">
                        {{ item.service_provider.first_name }}
                        {{ item.service_provider.last_name }}
                    </div>
                </div>
                <br />
                <div class="row">
                    <div class="col-md-12" color="danger">
                        <b> </b>
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="closeLinkedBookingModal()" color="success"
                    >OK</CButton
                >
            </CModalFooter>
        </CModal>
        <CModal :visible="show_user_details_modal" @close="closeUserInfoModal">
            <CModalHeader>
                <CModalTitle>User Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    <div class="col-md-4">Name</div>
                    <div class="col-md-8">
                        {{ user_detail_obj.first_name }}
                        {{ user_detail_obj.last_name }}
                        <span>
                            <button
                                @click="
                                    openFullCustomerDetail(user_detail_obj._id)
                                "
                                class="btn btn-sm btn-link"
                            >
                                View full detail
                            </button>
                        </span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">Phone</div>
                    <div class="col-md-8">
                        {{ getPhoneFormatted(user_detail_obj.phone) }}
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">Email</div>
                    <div class="col-md-8">
                        {{ user_detail_obj.email }}
                    </div>
                </div>
                <br />
                <div class="row">
                    <div class="col-md-4">Service Notes 1</div>
                    <div class="col-md-8">
                        {{ user_detail_obj.service_notes_1 || 'None' }}
                    </div>
                </div>
                <br />
                <div class="row">
                    <div class="col-md-4">Service Notes 2</div>
                    <div class="col-md-8">
                        {{ user_detail_obj.service_notes_2 || 'None' }}
                    </div>
                </div>
                <br />
                <div class="row">
                    <div class="col-md-4">Internal Notes</div>
                    <div class="col-md-8">
                        {{ user_detail_obj.internal_notes || 'None' }}
                    </div>
                </div>
                <br />
                <div
                    class="row"
                    v-if="
                        user_detail_obj.booking_stats &&
                        user_detail_obj.booking_stats.appt_data_found == 1
                    "
                >
                    <div class="col-md-12">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th colspan="5">Booking Stats</th>
                                </tr>
                                <tr>
                                    <th>Range (Days)</th>
                                    <th>All appts.</th>
                                    <th>Completed</th>
                                    <th>All Cancels</th>
                                    <th>No Show Cancel</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        {{
                                            user_detail_obj.booking_stats.data
                                                .report_days
                                        }}
                                    </td>
                                    <td>
                                        {{
                                            user_detail_obj.booking_stats.data
                                                .appts_all_created_count
                                        }}
                                    </td>
                                    <td>
                                        {{
                                            user_detail_obj.booking_stats.data
                                                .appts_completed_count
                                        }}
                                        ({{
                                            user_detail_obj.booking_stats.data
                                                .complete_percent
                                        }}%)
                                    </td>
                                    <td>
                                        {{
                                            user_detail_obj.booking_stats.data
                                                .appts_cancelled_count
                                        }}
                                        ({{
                                            user_detail_obj.booking_stats.data
                                                .cancel_percent
                                        }}%)
                                    </td>
                                    <td>
                                        {{
                                            user_detail_obj.booking_stats.data
                                                .appts_no_show_count
                                        }}
                                        ({{
                                            user_detail_obj.booking_stats.data
                                                .no_show_percent
                                        }}%)
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- end col 12 -->
                </div>
                <div class="row">
                    <div class="col-md-4">
                        User blocked from online bookings?
                    </div>
                    <div class="col-md-8">
                        {{
                            user_detail_obj.online_booking_blocked == true
                                ? 'Yes'
                                : 'No'
                        }}
                    </div>
                </div>
                <br />
                <div class="row">
                    <div class="col-md-12" color="danger">
                        <b> </b>
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="closeUserInfoModal" color="success"
                    >OK</CButton
                >
            </CModalFooter>
        </CModal>

        <CModal
            :visible="show_convert_walkin_to_customer_modal"
            @close="closewalkinConvertModal"
        >
            <CModalHeader>
                <CModalTitle>Walkin Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    <div class="col-md-6">Walkin Customer Name</div>
                    <div class="col-md-6">
                        {{ show_walkin_modal_data.first_name }}
                        {{ show_walkin_modal_data.last_name }}
                    </div>
                </div>
                <!-- <div  class="row">
                    <div class="col-md-4" >
                        Phone
                    </div>
                    <div class="col-md-8" >
                        {{getPhoneFormatted(user_detail_obj.phone)}}
                    </div>
                </div>
                <div  class="row">
                    <div class="col-md-4" >
                        Email
                    </div>
                    <div class="col-md-8" >
                        {{user_detail_obj.email}}
                    </div>
                </div>
                <br>
                <div  class="row">
                    <div class="col-md-4" >
                        Service Notes 1
                    </div>
                    <div class="col-md-8" >
                        {{user_detail_obj.service_notes_1  || "None"}}
                    </div>
                </div>
                <br>
                <div  class="row">
                    <div class="col-md-4" >
                        Service Notes 2
                    </div>
                    <div class="col-md-8" >
                        {{user_detail_obj.service_notes_2  || "None"}}
                    </div>
                </div>
                <br>
                <div  class="row">
                    <div class="col-md-4" >
                        Internal Notes
                    </div>
                    <div class="col-md-8" >
                        {{user_detail_obj.internal_notes || "None"}}
                    </div>
                </div>
                <br>
                <div class="row" v-if="user_detail_obj.booking_stats && user_detail_obj.booking_stats.appt_data_found==1">
                    <div class="col-md-12" >
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th colspan="5">Booking Stats</th>
                                </tr>
                                <tr>
                                    <th>Range (Days)</th>
                                    <th>All appts.</th>
                                    <th>Completed</th>
                                    <th>All Cancels</th>
                                    <th>No Show Cancel</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{{user_detail_obj.booking_stats.data.report_days}} </td>
                                    <td>{{user_detail_obj.booking_stats.data.appts_all_created_count}} </td>
                                    <td>{{user_detail_obj.booking_stats.data.appts_completed_count}} ({{user_detail_obj.booking_stats.data.complete_percent}}%)</td>
                                    <td>{{user_detail_obj.booking_stats.data.appts_cancelled_count}} ({{user_detail_obj.booking_stats.data.cancel_percent}}%)</td>
                                    <td>{{user_detail_obj.booking_stats.data.appts_no_show_count}} ({{user_detail_obj.booking_stats.data.no_show_percent}}%)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="row">
                    <div class="col-md-4" >
                        User blocked from online bookings?
                    </div>
                    <div class="col-md-8" >
                        {{user_detail_obj.online_booking_blocked == true? "Yes" : "No"}}
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col-md-12" color="danger">
                        <b> </b>
                    </div>
                </div>

                -->
            </CModalBody>
            <CModalFooter>
                <CButton @click="closewalkinConvertModal" color="success"
                    >OK</CButton
                >
            </CModalFooter>
        </CModal>

        <CModal :visible="show_cancel_booking_modal" @close="closeCancelModal">
            <CModalHeader>
                <CModalTitle>Cancel Booking</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    <div class="col-md-4" color="danger">
                        <label class="control-label">
                            <b>Cancel reason: </b>&nbsp;
                        </label>
                    </div>
                    <div class="col-md-8">
                        <input
                            v-model="cancel_reason"
                            placeholder="Type in a cancellation note "
                            class="form-control placeholder-no-fix"
                            type="text"
                        />
                    </div>
                </div>
                <br />
                <div class="row">
                    <div class="col-md-12" color="danger">
                        <b> {{ cancel_error_message }}</b>
                    </div>
                </div>
            </CModalBody>
            <CModalFooter class="d-flex justify-content-between" >
                <CButton
                    @click="cancelAsNoShow()"
                    color="danger"
                    class="mr-auto"
                    v-if="!isCustomerUserType"
                    >Cancel as No Show</CButton
                >
                <CButton @click="cancelAsRegular()" color="danger"
                    >Regular Cancel</CButton
                >
            </CModalFooter>
        </CModal>
        <bookingChangeAssignedResource
            :key="chass_key"
            @modelValueUpdate="bookingResourceChangeDone"
            v-if="show_change_assigned_resource"
            :assigned_resource_ids="res_assigned_resource_ids"
            :booking_id="select_data_id"
            :booking_service_order_id="select_data_service_order_id"
        ></bookingChangeAssignedResource>
    </CCard>
</template>

<script>
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import PerfectScrollbar from 'perfect-scrollbar'
import {Icon} from '@/common/Icon'
import CTableWrapper from '@/views/bookings/Table.vue'
import BookingServicesList from '@/views/bookings/BookingServicesList.vue'
import Pagination from '@/common/Pagination'
import Alerts from '@/views/Alerts'
import moment from 'moment'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import '@/assets/css/common.css'
import {debounce as lodash_debounce} from 'lodash'
import login_helper from '@/helpers/login_helper'
import utils_lib from '@/helpers/utils_lib'
import MessageCenterCredits from '@/common/MessageCreditsCheck'
import {
    findSpecificDoc,
    insertDataToCollection,
    getDataOfCollection,
    removeDataOfCollection,
    updateDataOfCollection,
    removeCollection
} from '@/helpers/in-memory-db'
import staticListMixin from '@/mixins/static-list'
import bookingChangeAssignedResource from '@/common/BookingChangeAssignedResource.vue'
import { USR_TYPE, PaymentMethod } from '@silverskysoft/skysched-schemas'
import EventEditorModal from '@/ui_components/booking/EventEditorModal.vue'

export default {
    name: 'Bookings Table',
    mixins: [staticListMixin],
    components: {
        CTableWrapper,
        Pagination,
        Alerts,
        flatPickr,
        MessageCenterCredits,
        Icon,
        BookingServicesList,
        bookingChangeAssignedResource,
        EventEditorModal
    },
    watch: {
        view_team_members_only: function() {
            this.filter.filter_service_providers = [];
            this.getProvidersList();
        },
        // 'bp_preferences.booking_status_type': function (newVal, oldVal) {
        //     this.searchBookingsList()
        // },
        // showEditor: function () {
        //     if (this.showEditor == false) {
        //         this.getBookingsList();
        //     }
        // },
        bp_preferences: {
            handler(newobj) {
                if (this.bp_first_inited) {
                    this.$store.commit('SET_BOOKINGS_VIEW_PREFS', newobj)
                }
            },
            deep: true,
        },
    },
    data() {
        return {
            
            isFlatPickrOpen: false,
            option: [],
            filter_applied: false,
            deg: 0,
            loading: false,
            filterModal: false,
            filter: {
                service_order_search: '',
                filter_service_providers: [],
                // select_date_range: null,
                bt_show_only_todays: false,
                bt_show_bookings_in_last_24hrs: false,
                completedButNoPayCapture: false,
                bt_simplified_listing: false,
                view_team_members_only: false,
            },
            visibleLiveDemo: false,
            hash_list_threshold: 5,
            date_range_picker_config: {
                altFormat: 'F j',
                altInput: true,
                mode: 'range',
                static: true,
                // noCalendar: true,
                // enableTime: true,
                // time_24hr: true
            },
            //select_date_range: null,
            last_query_hash: null,
            search: '',
            service_order_search: '',
            //todayCheck:false,
            completedButNoPayCapture: false,
            bp_first_inited: false,
            bp_preferences: {
                booking_status_type: [],
                select_date_range: null,
                bt_show_only_todays: false,
                bt_show_bookings_in_last_24hrs: false,
                bt_simplified_listing: false,
            },
            show_bulk_options: false,
            bulk_buttons_disabled: false,
            bulkOperationInProgress: '',
            remaining_bulk_operations: 0,
            service_selection_map: new Map(),
            showEditor: false,
            eventRecord: {},
            eventStore: {},
            resourceId: null,
            alert: false,
            show: 0,
            alertData: {
                message: '',
                type: '',
            },
            booking_list: [],
            page: 1,
            pageCount: 1,
            timezone: this.$store.state.business_settings.business_time_zone,
            currency_symbol:
                this.$store.state.business_settings.business_currency_symbol,
            cards_on_file_list: [],
            show_pay_modal: false,
            pm_error_message: '',
            checkout_btn_disabled: false,
            checkout_text: 'Pay with card on file',
            selected_card_id: '',
            selected_booking_manage_key: '',
            selected_booking_service_id: '',
            selected_customer_id: '',
            show_paycof: true,
            show_client_notes_modal: false,
            client_note: '',
            client_notes_modal_title: 'Client Notes',
            cn_error_message: '',
            show_linked_booking_info: false,
            linked_booking_info_text: '',
            linked_bookings_display_array: [],
            filter_service_providers: [],
            show_user_details_modal: false,
            show_convert_walkin_to_customer_modal: false,
            user_detail_obj: {
                _id: null,
            }, //for display
            show_walkin_modal_data: {
                first_name: '',
                last_name: '',
            },

            country_code:
                this.$store.state.business_settings.business_info.country_code,
            edit_obj_id: null,

            show_cancel_booking_modal: false,
            cancel_reason: '',
            cancel_error_message: '',
            cancel_booking_id: '',
            cancel_service_order_id: '',
            show_change_assigned_resource: false,
            chass_key: '',
            res_assigned_resource_ids: [],
            res_booking_id: null,
            select_data_id: null,
            select_data_service_order_id: null,
            user_type: this.$store.state.user_data.type,
            user_id: this.$store.state.user_data._id,
            show_team_members_filter: this.$store.state.user_data.type != USR_TYPE.UT_ADMIN && this.$store.state.user_data.type != USR_TYPE.UT_RECEPTION
        }
    },
    mounted() {
        let sidebarContainer = document.getElementById('booking-list-table')
        if (sidebarContainer) {
            const ps = new PerfectScrollbar(sidebarContainer)
        }
    },
    created() {
        let bvp = this.$store.state.booking_view_preferences;
        if (bvp != null) {
            this.bp_preferences = bvp
        } else {
            this.$store.commit('SET_BOOKINGS_VIEW_PREFS', this.bp_preferences);
        }
        this.bp_first_inited = true
        let currentTimestamp = +new Date()
        let {slice_last_fetched_timestamp, slice_ttl} = this.$store.state
        let employeeListFetchedTimestampExpired =
            slice_last_fetched_timestamp.employee_list + slice_ttl.employee_list
        let isCachedDataExpired =
            currentTimestamp > employeeListFetchedTimestampExpired

        if (isCachedDataExpired) {
            this.getProvidersList()
        } else if (!this.option.length) {
            this.getProvidersList()
        }

        this.mapBookingPrefToFilter()
        // this.getBookingsList();
        this.searchBookingsList()
    },
    computed: {
        isCustomerUserType(){
            return this.user_type == USR_TYPE.UT_CUSTOMER
        },
        provider_option() {
            return this.$store.state.employee_list
        },
        isSimpleListing() {
            return this.bp_preferences.bt_simplified_listing
        },
        list: function () {
            return this.booking_list.filter((obj) => {
                let paystat = this.getPayStatus(obj)

                if (
                    !this.completedButNoPayCapture ||
                    (this.completedButNoPayCapture == true &&
                        paystat == 'Authed')
                ) {
                    return obj
                }
            })
        },
    },
    methods: {
        openFullCustomerDetail(id) {
            let v = id
            this.closeUserInfoModal()
            this.$router.push('/customers/detail/' + v)
        },
        newBookingClick() {
            try {
                let allow_online_booking =
                    this.$store.state.business_settings
                        .allow_website_bookings == true
                console.log(allow_online_booking)

                if (allow_online_booking === false) {
                    this.AddBookingButtonAction()
                } else {
                    this.$router.push('/bookings/create')
                }
            } catch (ex) {
                this.$router.push('/bookings/create')
            }
        },
        changeAssignedResources(item) {
            this.chass_key = moment().utc().valueOf()
            this.res_assigned_resource_ids = item.assigned_resource_ids
            this.res_booking_id = item._id
            this.show_change_assigned_resource = true
            ;(this.select_data_id = item._id),
                (this.select_data_service_order_id = item.service_order_id)
        },
        bookingResourceChangeDone(data) {
            this.show_change_assigned_resource = false
            //console.log("as--s-s-s-s-s ",data)
            if (data && data.done == 1) {
                this.getBookingsList()
            }
        },
        getInvoiceAmountClasses(item) {
            let total = this.getInvoiceTotal(item)
            let paidStatus = this.getIsPaidStatus(item)

            if (total == 0) {
                return ['invoice-zero-amount']
            } else if (total < 0) {
                return ['invoice-negative-amount']
            } else if (paidStatus == 'Paid') {
                return ['paid-invoice']
            } else {
                return ['invoice-not-paid']
            }
        },
        resetFilterData() {
            this.filter_applied = false
            this.filterModal = false
            this.filter = {
                filter_service_providers: [],
                // select_date_range: null,
                service_order_search: '',
                bt_show_only_todays: false,
                bt_show_bookings_in_last_24hrs: false,
                completedButNoPayCapture: false,
                bt_simplified_listing: false,
                view_team_members_only: false,
            }
            this.mapFilterDataToBookingPref()
            this.searchBookingsList()
        },
        mapBookingPrefToFilter() {
            let prevFilter = this.filter
            this.filter = {
                service_order_search: '',
                filter_service_providers: [],
                completedButNoPayCapture: false,

                bt_show_only_todays: this.bp_preferences.bt_show_only_todays,
                bt_show_bookings_in_last_24hrs:
                    this.bp_preferences.bt_show_bookings_in_last_24hrs,
                bt_simplified_listing:
                    this.bp_preferences.bt_simplified_listing,
                view_team_members_only: false,
            }
            if (
                this.bp_preferences.bt_show_only_todays ||
                this.bp_preferences.bt_show_bookings_in_last_24hrs ||
                this.bt_simplified_listing 
            ) {
                this.filter_applied = true
            }
        },
        mapFilterDataToBookingPref() {
            this.filter_service_providers = this.filter.filter_service_providers
            this.completedButNoPayCapture = this.filter.completedButNoPayCapture

            // this.bp_preferences.select_date_range = this.filter.select_date_range;
            this.bp_preferences.bt_show_only_todays =
                this.filter.bt_show_only_todays
            this.bp_preferences.bt_show_bookings_in_last_24hrs =
                this.filter.bt_show_bookings_in_last_24hrs
            this.bp_preferences.bt_simplified_listing =
                this.filter.bt_simplified_listing
        },
        applyFilter() {
            this.mapFilterDataToBookingPref()
            this.searchBookingsList()
            this.filter_applied = true
            this.filterModal = false
        },
        async refreshCachedData() {
            this.deg += 360
            let hashList = await getDataOfCollection(
                'skysalon.booking_hashed_list',
                {},
                null,
                0,
                {created_at: 1},
            )
            for await (let hashRecord of hashList) {
                await this.removeHashedRecordAndData(hashRecord)
            }
            await this.$store.commit('schedsdkstore/clearNedbStoreData');
            await this.searchBookingsList();
        },
        debGetList: lodash_debounce((context) => {
            let dt_range = context.getDateRangeTimeStamps(
                context.bp_preferences.select_date_range + '',
            )
            let startDay = dt_range.start_ts
            let endDay = dt_range.end_ts
            let filter_provider_ids = []
            context.filter_service_providers.map((obj) => {
                filter_provider_ids.push(obj._id)
            })
            let qry = {
                page_no: context.page,
                search: context.search,
                service_order_kw: context.filter.service_order_search,
                todayCheck: context.bp_preferences.bt_show_only_todays,
                booking_type_list: context.get_booking_type_arr(),
                show_created_in_last24:
                    context.bp_preferences.bt_show_bookings_in_last_24hrs,
                filter_provider_ids: filter_provider_ids,
            }
            if (startDay != null && endDay != null) {
                qry.begin_booking_date = startDay
                qry.end_booking_date = endDay
            }
            //Need to clear since we don't want any unwanted services due to
            context.service_selection_map.clear()

            context.$schedsdk
                .getBookingList(qry)
                .then(async (result) => {
                    if (result.data.length) {
                        context.booking_list = result.data
                        context.pageCount = result.total_pages

                        let { should_cache_data } = context.$store.state.in_memory_db_state;

                        if (should_cache_data.bookings) {

                            // update the created_at of hashed record.
                            await updateDataOfCollection(
                                'skysalon.booking_hashed_list',
                                {_id: context.last_query_hash},
                                {created_at: new Date()},
                            )
    
                            // insert into db collection.
                            await insertDataToCollection(
                                `skysalon.${context.last_query_hash}_booking_list`,
                                result.data,
                            )
    
                            // FLush all before inserting...
                            // context.$store.dispatch('schedsdkstore/flushAllBookingData', {
                            //         data: result.data
                            //     })
                            //     .then(() => {
                            //         context.$store.dispatch('schedsdkstore/saveBookingsToDb', {
                            //             data: result.data
                            //         }); // dispatch an action
                            //     })
                        }

                    } else {
                        context.booking_list = result.data
                    }
                })
                .catch((Ex) => {
                    login_helper.checkSessionExpiryAndRedirectToLogin(
                        Ex,
                        context.$schedsdk,
                        context.$router,
                    )
                })
                .finally(function () {
                    context.loading = false
                })
        }, 430),
        serviceSelect(item, $event) {
            if ($event.srcElement && $event.srcElement.checked) {
                this.service_selection_map.set(item._id, {
                    booking_id: item._id,
                    service_order_id: item.service_order_id,
                })
            } else {
                this.service_selection_map.delete(item._id)
            }
            if (this.service_selection_map.size == 0) {
                //Deactivate bulk options
                this.show_bulk_options = false
                this.bulk_buttons_disabled = true
                this.bulkOperationInProgress = ''
            } else {
                //Activate
                this.show_bulk_options = true
                this.bulk_buttons_disabled = false
            }
        },
        doDecrementBulkOperationCount() {
            this.remaining_bulk_operations--
            if (this.remaining_bulk_operations <= 0) {
                //Done.
                this.bulk_buttons_disabled = false
                this.bulkOperationInProgress = 'Bulk operation done.'
                this.service_selection_map.clear()
                this.getBookingsList()
            }
        },
        bulkCommonOperation(op) {
            let operation = op
            let confirmed = confirm(
                'Confirm bulk operation: ' +
                    operation +
                    ' ' +
                    this.service_selection_map.size +
                    ' items?',
            )
            if (!confirmed) {
                return
            }
            this.remaining_bulk_operations = this.service_selection_map.size
            this.bulk_buttons_disabled = true
            this.bulkOperationInProgress =
                op +
                ' in progress' +
                ' (' +
                this.service_selection_map.size +
                ' items)...'

            switch (op) {
                case 'cancel':
                    this.bulkCancel()
                    break
                case 'complete':
                    this.bulkComplete()
                    break
                default:
                    break
            }
            return
        },
        bulkCancel() {
            let me = this
            this.service_selection_map.forEach((ele) => {
                console.log('Cancel: ' + ele)
                me.doCancel(ele, true)
            })
        },
        bulkComplete() {
            let me = this

            this.service_selection_map.forEach((ele) => {
                console.log('Complete: ' + ele)
                me.doComplete(
                    {
                        _id: ele.booking_id,
                    },
                    true,
                )
            })
        },
        changeProvidersFilter() {
            this.debGetList(this)
        },
        getWalkinCustomerDetails(item) {
            let customer_name = null
            if (item.is_walkin_booking == true) {
                if (
                    item.walkin_customer_first_name &&
                    item.walkin_customer_first_name.length >= 1
                ) {
                    customer_name =
                        item.walkin_customer_first_name +
                        ' ' +
                        (item.walkin_customer_last_name || '')
                } else {
                    customer_name = 'Walkin Customer'
                }
            } else if (
                item.walkin_customer_first_name &&
                item.walkin_customer_first_name.length >= 1
            ) {
                customer_name =
                    item.walkin_customer_first_name +
                    ' ' +
                    (item.walkin_customer_last_name || '')
            }
            //console.log("asdsadasd0000as0d ", customer_name)
            return customer_name
        },
        getCustomerOrParentName(item) {
            if (!item && !item.walkin_customer_first_name) {
                return 'NA'
            }
            let customer_name =
                item.customer.first_name + ' ' + item.customer.last_name
            let walkin_customer = this.getWalkinCustomerDetails(item)
            if (walkin_customer != null) {
                customer_name = walkin_customer
                return customer_name
            }
            if (
                item.child_name &&
                item.child_name.length > 2 &&
                item.child_cust_id
            ) {
                customer_name = item.child_name + ' /parent: ' + customer_name
            }
            return customer_name
        },
        getServiceNames(item) {
            let svcname = ''
            let total_time = 0
            for (let i = 0; i < item.services.length; i++) {
                svcname += item.services[i].name
                total_time += item.services[i].time
                if (i < item.services.length - 1) {
                    svcname += ', '
                }
            }
            if (svcname != '') {
                svcname += '<br><small>' + total_time + ' mins</small>'
            }
            return svcname
        },
        getPhoneFormatted(phone) {
            if (phone && phone.length > 0) {
                return utils_lib.getPhoneFormatted(phone, this.country_code)
            }
            return ''
        },
        get_booking_type_arr() {
            let type_list = []
            if (this.bp_preferences.booking_status_type.includes('cancelled')) {
                //1, 2, 8
                type_list.push(1)
                type_list.push(2)
                type_list.push(8)
            }
            if (this.bp_preferences.booking_status_type.includes('scheduled')) {
                type_list.push(3)
                type_list.push(5)
                type_list.push(6)
                type_list.push(7)
            }
            if (this.bp_preferences.booking_status_type.includes('completed')) {
                type_list.push(4)
            }
            return type_list
        },
        async getBookingsList() {
            this.debGetList(this)
        },
        getProvidersList() {
            let userListPromise = null;

            if (this.filter.view_team_members_only && this.user_type != USR_TYPE.UT_ADMIN && this.user_type != USR_TYPE.UT_RECEPTION) {
                userListPromise = this.$schedsdk.get_colleagues({ user_id: this.user_id });
            } else {
                userListPromise = this.$schedsdk.get_users_list({});
            }

            userListPromise.then((result) => {
                if (result.status == 1) {
                    this.$store.commit('SET_EMPLOYEE_LIST', result.data)
                    this.$store.commit(
                        'setLastFetchedTimestamp',
                        'employee_list',
                    )
                }
            })
        },
        strhash(str) {
            let hash = 5381,
                i = str.length

            while (i) {
                hash = (hash * 33) ^ str.charCodeAt(--i)
            }

            /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
             * integers. Since we want the results to be always positive, convert the
             * signed int to an unsigned by doing an unsigned bitshift. */
            return hash >>> 0
        },
        getDateRangeTimeStamps(dt_range_string) {
            return utils_lib.getFPickDateRangeTimeStamps(
                dt_range_string,
                this.$store.state.business_settings.business_time_zone,
            )
        },
        async searchBookingsList() {
            this.loading = true
            RegExp.prototype.toJSON = RegExp.prototype.toString

            let keywordSearch = new RegExp(
                '.*' + this.search.trim() + '.*',
                'i',
            )
            let keywordServiceOrderSearch = new RegExp(
                '.*' + this.filter.service_order_search.trim() + '.*',
                'i',
            )
            let query = {}
            let or_qry_ary = []
            let dt_range = this.getDateRangeTimeStamps(
                this.bp_preferences.select_date_range + '',
            )

            let startDay = dt_range.start_ts
            let endDay = dt_range.end_ts

            if (this.search.trim() != '') {
                or_qry_ary = [
                    {
                        first_name: keywordSearch,
                    },
                    {
                        last_name: keywordSearch,
                    },
                    {
                        email: keywordSearch,
                    },
                    {
                        phone: keywordSearch,
                    },
                    // {service_order_id: keywordServiceOrderSearch}
                ]
            }

            if (this.filter.service_order_search.trim() != '') {
                or_qry_ary.push({
                    service_order_id: keywordServiceOrderSearch,
                })
            }
            if (or_qry_ary.length > 0) {
                query.$or = or_qry_ary
            }

            if (this.bp_preferences.bt_show_only_todays) {
                let current_time = moment.utc().valueOf()
                let start_date = moment
                    .utc(current_time)
                    .startOf('day')
                    .valueOf()
                let end_date = moment.utc(current_time).endOf('day').valueOf()
                query.service_start_date = {
                    $gte: start_date,
                    $lte: end_date,
                }
            } else if (endDay != null && startDay != null) {
                query.service_start_date = {
                    $gte: startDay,
                    $lte: endDay,
                }
            }
            let type_list = this.get_booking_type_arr()
            query.type = {
                $in: type_list,
            }

            let {ttl, should_cache_data} = this.$store.state.in_memory_db_state
            
            if (!should_cache_data.bookings) {
                this.getBookingsList()
            } else {
                let hash = this.strhash(JSON.stringify(query))
                let hashRecord = await this.insertOrGetHashedRecord(hash);
                let localDbBookingData = await getDataOfCollection(
                    `skysalon.${hashRecord._id}_booking_list`,
                    {},
                    null,
                    0
                )
                let currentTimestamp = +new Date()

                let bookingCachedDataWillExpired =
                    +hashRecord.created_at + ttl.bookings
                let isCachedDataExpired =
                    currentTimestamp > bookingCachedDataWillExpired
                
                if (isCachedDataExpired || !localDbBookingData.length) {
                    this.last_query_hash = hash
                    await this.getBookingsList()
                } else {
                    this.loading = false
                    this.booking_list = localDbBookingData
                    this.pageCount = localDbBookingData.total_pages
                }
            }
        },
        async removeHashedRecordAndData(hashRecord) {
            await removeDataOfCollection('skysalon.booking_hashed_list', {
                _id: hashRecord._id,
            })
            // await updateDataOfCollection(
            //     `skysalon.${hashRecord._id}_booking_list`,
            //     {}, []
            // )
            await removeDataOfCollection(
                `skysalon.${hashRecord._id}_booking_list`,
            )
            await removeCollection(`skysalon.${hashRecord._id}_booking_list`)
        },
        async insertOrGetHashedRecord(hash) {
            let hashRecord = await findSpecificDoc(
                'skysalon.booking_hashed_list',
                {_id: hash},
            )
            
            if (!hashRecord) {
                let hashedList = await getDataOfCollection(
                    'skysalon.booking_hashed_list',
                    {},
                    null,
                    0,
                    {created_at: 1},
                )
                if (hashedList.length == this.hash_list_threshold) {
                    await this.removeHashedRecordAndData(hashedList[0])
                }
                hashRecord = {_id: hash, created_at: new Date()}
                insertDataToCollection(
                    'skysalon.booking_hashed_list',
                    hashRecord,
                )
            }
            return hashRecord
        },
        clearDate() {
            this.bp_preferences.select_date_range = null
            this.isFlatPickrOpen = false
            // this.filter.select_date_range = null
        },
        setPage(pageNo) {
            this.page = pageNo
            this.getBookingsList()
        },
        AddBookingButtonAction() {
            Object.assign(this, {
                eventStore: {},
                resourceId: '',
                eventRecord: {
                    data: {
                        startDate: moment()
                            .add(10, 'minutes')
                            .format('YYYY-MM-DD'),
                    },
                },
                showEditor: true,
            })
        },
        editHandler(booking_id) {
            // console.log("121");
            // console.log("Booking Id ", booking_id)
            let thisRef = this
            this.edit_obj_id = booking_id
            // thisRef.showEditor = true;
            this.$schedsdk
                .getBookingDetail({
                    _id: booking_id,
                })
                .then((result) => {
                    // console.log(result.data.customer.email)
                    thisRef.eventRecord.data = result.data
                    thisRef.eventRecord.data.id = result.data._id
                    thisRef.eventRecord.data.email = result.data.customer.email
                    thisRef.eventRecord.data.phone = result.data.customer.phone
                    thisRef.eventRecord.data.last_name =
                        result.data.customer.last_name
                    thisRef.eventRecord.data.first_name =
                        result.data.customer.first_name

                    thisRef.eventRecord.edit_booking_flag = 1
                    thisRef.eventRecord.resourceId =
                        result.data.service_provider._id
                    // thisRef.resourceId = result.data;
                    thisRef.showEditor = true
                })
                .catch((ex) => {
                    thisRef.showEditor = false
                })
        },

        doCancel(data, decrement_bulk_op_count = false) {
            this.$schedsdk
                .cancelBooking(data)
                .then((result) => {
                    if (result.status == 1) {
                        if (decrement_bulk_op_count == false) {
                            this.alertData = {
                                message: result.message,
                                type: 'success',
                            }
                            this.alert = true
                            this.show = 4
                            this.getBookingsList()
                        }
                    }
                    this.show_cancel_booking_modal = false
                })
                .catch((ex) => {
                    this.alertData = {
                        message: ex.data.message,
                        type: 'danger',
                    }
                    this.alert = true
                    this.show = 4
                })
                .finally(() => {
                    if (decrement_bulk_op_count) {
                        this.doDecrementBulkOperationCount()
                    }
                })
        },
        closeCancelModal() {
            this.show_cancel_booking_modal = false;
        },
        cancelAsNoShow() {
            let data = {
                booking_id: this.cancel_booking_id,
                service_order_id: this.cancel_service_order_id,
                is_for_no_show: true,
                cancel_user_reason: this.cancel_reason,
            }
            this.doCancel(data)
        },
        cancelAsRegular() {
            let data = {
                booking_id: this.cancel_booking_id,
                service_order_id: this.cancel_service_order_id,
                is_for_no_show: false,
                cancel_user_reason: this.cancel_reason,
            }
            this.doCancel(data)
        },

        cancelHandler(booking_id, service_order_id) {
            // console.log("Cancel booking process")
            this.cancel_reason = ''
            this.cancel_error_message = ''
            this.cancel_booking_id = booking_id
            this.cancel_service_order_id = service_order_id

            this.show_cancel_booking_modal = true
        },
        rebookHandler(booking_id, service_order_id) {
            let thisRef = this
            this.edit_obj_id = booking_id
            this.$schedsdk
                .getBookingDetail({
                    _id: booking_id,
                })
                .then((result) => {
                    // console.log(result.data.customer.email)
                    thisRef.eventRecord.data = result.data
                    thisRef.eventRecord.data.id = result.data._id
                    thisRef.eventRecord.data.email = result.data.customer.email
                    thisRef.eventRecord.data.phone = result.data.customer.phone
                    thisRef.eventRecord.data.last_name =
                        result.data.customer.last_name
                    thisRef.eventRecord.data.first_name =
                        result.data.customer.first_name

                    thisRef.eventRecord.is_for_rebooking_flag = 1
                    thisRef.eventRecord.resourceId =
                        result.data.service_provider._id
                    // thisRef.resourceId = result.data;
                    thisRef.showEditor = true
                })
                .catch((ex) => {
                    thisRef.showEditor = false
                })
        },
        doComplete(data, decrement_bulk_op_count = false) {
            let me = this
            me.$schedsdk
                .getBookingDetail(data)
                .then((result) => {
                    if (result.status == 1) {
                        if (
                            result.data.type != 1 &&
                            result.data.type != 2 &&
                            result.data.type != 4 &&
                            result.data.type != 8
                        ) {
                            //
                            result.data.type = 4 //complete;
                            me.$schedsdk
                                .updateBooking(result.data)
                                .then((cres) => {
                                    if (cres.status == 1) {
                                        if (decrement_bulk_op_count == false) {
                                            me.alertData = {
                                                message: cres.message,
                                                type: 'success',
                                            }
                                            me.alert = true
                                            me.show = 4
                                            me.$skyEventListener.generateEvent('AEV_BOOKING_COMPLETED')
                                            me.getBookingsList()
                                        } else {
                                        }
                                    } else {
                                        this.alertData = {
                                            message: cres.message,
                                            type: 'danger',
                                        }
                                        this.alert = true
                                        this.show = 4
                                    }
                                })
                                .catch((ex) => {
                                    this.alertData = {
                                        message: ex.data.message,
                                        type: 'danger',
                                    }
                                    this.alert = true
                                    this.show = 4
                                })
                                .finally(() => {
                                    me.doDecrementBulkOperationCount()
                                })
                        } //end if
                    }
                })
                .catch((ex) => {
                    this.alertData = {
                        message: ex.data.message,
                        type: 'danger',
                    }
                    this.alert = true
                    this.show = 4
                })
        },
        completeHandler(booking_id, service_order_id) {
            // console.log("Cancel booking process")
            let confirmed = confirm('Are you sure to complete this booking?')
            if (confirmed) {
                let data = {
                    _id: booking_id,
                }
                this.doComplete(data)
            } //confirmed
        },
        toggleBookingConfirmation(booking) {
            let opStr = booking.customer_confirmed_appt
                ? 'Are you sure want to mark as unconfirm?'
                : 'Are you sure want to mark as confirm?'
            let booking_confirm_operation = booking.customer_confirmed_appt
                ? 2
                : 1

            let confirmed = confirm(opStr)
            let that = this
            if (confirmed) {
                this.$schedsdk
                    .toggle_booking_confirmation({
                        booking_confirm_operation,
                        booking_id: booking._id,
                    })
                    .then((result) => {
                        if (result.status == 1) {
                            console.log(result)
                        }
                    })
                    .catch(console.error)
                    .finally(function () {
                        that.searchBookingsList()
                    })
            }
        },
        getFormattedDate: function (dt_unix) {
            if (dt_unix == null || dt_unix == 0) {
                return dt_unix
            }
            return [
                moment(dt_unix).format('hh:mma'),
                moment(dt_unix).format('DD MMM YY'),
            ]
            // return moment(dt_unix).format("DD MMMM YY hh:mma");
            // return moment(dt_unix).format("MMM DD, YYYY hh:mm a"); //"MMM DD, YYYY hh:mm a"
        },
        getFormattedDateShort: function (dt_unix) {
            if (dt_unix == null || dt_unix == 0) {
                return dt_unix
            }
            return moment(dt_unix).format('DD MMMM YY hh:mma') //"MMM DD, YYYY hh:mm a"
            // return moment(dt_unix).format("DD MM YY hh:mma"); //"MMM DD, YYYY hh:mm a"
        },
        movetoinvoice: function (invn) {
            this.$router.push('/invoice/detail/' + invn)
        },
        getIsPaidStatus(item) {
            if (
                item.invoice_info === undefined ||
                item.invoice_info[0] === undefined
            ) {
                //console.log(item)
                return 'NA'
            }
            if (item.invoice_info[0].invoice.estimated_amount_total < 0.0001) {
                return 'Zero Amt. Inv.'
            }
            return item.invoice_info[0].invoice.estimated_amount_due < 0.001
                ? 'Paid'
                : 'Not Paid'
        },
        getInvoiceTotal: function (item) {
            //console.log(item.service_order_id)
            //console.log(item.invoice_info[0])
            //console.log(item.invoice_info_summary[0])
            //console.log(this.completedButNoPayCapture)
            return item.invoice_info[0].invoice.estimated_amount_total
            let invoice_amount = 0

            let details = item.invoice_info[0].compact_invoice_detail

            details.forEach((pay) => {
                //console.log(pay)
                invoice_amount += pay.ep
            })

            return invoice_amount
        },
        convertWalkinToCustomer(item) {
            let that = this
            that.show_walkin_modal_data = {
                first_name: item.walkin_customer_first_name,
                last_name: item.walkin_customer_last_name || '',
            }
            console.log(that.show_walkin_modal_data)
            that.show_convert_walkin_to_customer_modal = true
        },
        viewUserInfo(userobj, user_type) {
            let id = userobj._id
            let that = this
            that.user_detail_obj = {
                _id: null,
            }
            this.$schedsdk.get_customer_detail(id).then((result) => {
                if (result.status == 1) {
                    //
                    that.user_detail_obj = result.data
                    that.show_user_details_modal = true
                }
            })
        },
        viewNotes(item) {
            this.client_note = item.client_notes
            this.client_notes_modal_title = 'Client Notes'
            this.show_client_notes_modal = true
        },
        //Reuse show_client_notes_modal
        viewCancelNotes(item) {
            this.client_note = item.cancel_user_reason
            this.client_notes_modal_title = 'Cancellation Notes'
            if (item.canceled_due_to_no_show == true) {
                this.cn_error_message = ''
            } else {
                this.cn_error_message = ''
            }
            this.show_client_notes_modal = true
        },
        viewLinkedBookingInfo(item, index) {
            this.linked_booking_info_text += ''
            let grouped_bookings = []
            for (let k = 0; k < this.booking_list.length; k++) {
                if (
                    this.booking_list[k].linked_booking_hard_link == true &&
                    this.booking_list[k].linked_booking_hard_tag ==
                        item.linked_booking_hard_tag
                ) {
                    grouped_bookings.push({
                        _id: this.booking_list[k]._id,
                        service_order_id: this.booking_list[k].service_order_id,
                        customer: this.booking_list[k].customer,
                        service_provider: this.booking_list[k].service_provider,
                    })
                }
            }
            this.linked_bookings_display_array = grouped_bookings
            this.show_linked_booking_info = true
            this.linked_booking_info_text =
                'Grouped & Linked under ' + item.linked_booking_hard_tag
        },
        getResourcesList(item) {
            return item.first_name
        },
        getBookingSource(booking_source) {
            switch (booking_source) {
                case 1:
                    return 'App'
                case 2:
                    return 'Alexa'
                case 3:
                    return 'Web'
                case 4:
                    return 'Webchat'
                case 5:
                    return 'AdminWeb'
                case 6:
                    return 'GoogleHome'
                case 7:
                    return 'Facebook'
                case 8:
                    return 'Waitlist'
                case 90:
                    return 'Bulk Loaded'
                case 99:
                    return 'Unloggedin'

                default:
                    return 'Unknown ' + booking_source
            }
        },
        getBookingSourceIcon(booking_source) {
            // if (booking_source == 1) {
            //     return "tabler:device-mobile";
            // } else {
            //     return "bi:globe";
            // }
            // return "cil:line-style";
            switch (booking_source) {
                case 1:
                    return 'tabler:device-mobile'
                case 2:
                    return 'simple-icons:amazonalexa'
                case 3:
                    return 'tabler:network'
                case 4:
                    return 'tabler:message'
                case 5:
                    return 'tabler:file-settings'
                case 6:
                    return 'iconoir:google-home'
                case 7:
                    return 'la:facebook-f'
                case 8:
                    return 'tabler:clipboard-list'
                case 90:
                    return 'tabler:file-settings'              
                case 99:
                    return 'tabler:playlist-x'

                default:
                    return 'tabler:browser-x'
            }
        },
        getPayStatus: function (item) {
            //console.log(item.service_order_id)
            //console.log(item.invoice_info[0])
            //console.log(item.invoice_info_summary[0])
            //console.log(this.completedButNoPayCapture)
            let captured = false
            let has_auth = false
            let status = 'NotComplete'
            if (item.type == 2 || item.type == 8) {
                status = 'Canceled'
                if (item.canceled_due_payment_hold === true) {
                    status += '\n Auto'
                } else {
                    //  status += "\n Manual"
                }
            }
            if (
                item.type == 3 ||
                item.type == 5 ||
                item.type == 6 ||
                item.type == 7
            ) {
                status = 'Scheduled'
            }
            if (item.type == 4) {
                let payments = []
                if (item.invoice_info && item.invoice_info.length > 0) {
                    payments = item.invoice_info[0].compact_invoice_payments
                }
                status = 'Completed'
                // if (this.getIsPaidStatus(item) != "Paid") {
                //     status += "<small>N</small>"
                // }
                payments.forEach((pay) => {
                    //console.log(pay)
                    if (pay.pv > 0 && pay.tp == 'EP_CLOVER') {
                        if (
                            pay.top == 'PT_TT_SALE' ||
                            pay.top == 'PT_TT_AUTH_CAPTURE'
                        ) {
                            captured = true
                        }
                        if (pay.top == 'PT_TT_AUTH') {
                            has_auth = true
                        }
                    }
                })

                if (has_auth == true) {
                    //   status += " Authed";
                }
                if (captured == true) {
                    // status += " Captured";
                }
            }

            return status
        },
        alertClosedFn() {
            this.show = 0
        },
        takePayment(item) {
            this.pm_error_message = ''
            this.cards_on_file_list = []
            this.checkout_btn_disabled = false
            ;(this.selected_booking_manage_key = item.manage_booking_key),
                (this.selected_booking_service_id = item.service_order_id)
            this.selected_customer_id = item.customer_id
            this.show_paycof = true
            this.$schedsdk
                .list_user_cards_on_file({
                    user_id: item.customer_id,
                })
                .then((result) => {
                    if (result.status == 1) {
                        this.cards_on_file_list = result.data
                    } else {
                        this.pm_error_message =
                            'Error getting Cards on File: ' + result.message
                    }
                    if (this.cards_on_file_list.length == 0) {
                        this.checkout_btn_disabled = true
                    }
                    this.show_pay_modal = true
                })
                .catch((Ex) => {
                    this.pm_error_message = 'Error contacting server'

                    this.show_pay_modal = true
                })
        },
        payWithNewCard() {
            //  this.selected_booking_manage_key= this.manage_booking_key,
            //this.selected_booking_service_id = this.services_order_id;

            let url =
                this.$store.state.skysched_global_api_base_url +
                'extpages/online_booking_payment/' +
                this.selected_booking_manage_key +
                '?show_page_header=0&show_page_footer=0'
            this.$router.push({
                name: 'Pay Purchase Order',
                params: {
                    po_access_url: encodeURI(url),
                },
            })
            this.closePayModal()
        },
        closePayModal() {
            this.show_pay_modal = false
            this.cards_on_file_list = []
            this.pm_error_message = ''
            this.selected_booking_manage_key = ''
            this.selected_booking_service_id = ''
        },
        closeNotesModal() {
            this.show_client_notes_modal = false
            this.client_note = ''
        },
        closeLinkedBookingModal() {
            this.show_linked_booking_info = false
            this.linked_booking_info_text = ''
            this.linked_bookings_display_array = []
        },
        closeUserInfoModal() {
            this.show_user_details_modal = false
            this.user_detail_obj = {
                _id: null,
            }
        },
        closewalkinConvertModal() {
            this.show_convert_walkin_to_customer_modal = false
            this.show_walkin_modal_data = {
                first_name: null,
                last_name: null,
            }
        },
        continueToPayCof() {
            // console.log(this.selected_card_id);

            if (!this.selected_card_id || this.selected_card_id.length < 3) {
                this.pm_error_message = 'Please select a card'
                return
            }
            this.pm_error_message = 'Starting payment request...'
            this.$schedsdk
                .takePaymentForBookingWithCardOnFile({
                    order_number: this.selected_booking_service_id,
                    customer_id: this.selected_customer_id,
                    card_on_file_id: this.selected_card_id,
                })
                .then((result) => {
                    if (result.status == 1) {
                        //Done.
                        this.pm_error_message = 'Payment successful.'
                    } else {
                        this.pm_error_message =
                            'Error taking payment ' + result.message
                    }
                })
                .catch((Ex) => {
                    this.pm_error_message = 'Error contacting server'
                    //this.closePayModal();
                })
            this.show_paycof = false
        }, //end continueToPayCof
    },
}
</script>
<style scoped lang="scss">
@mixin transition($time) {
    transition: all $time ease;
}
.mx-n-15 {
    margin-right: -12px;
    margin-left: -15px;
}
a,
.color-a {
    color: #6d57e4;
}
.transition {
    transition: transform 0.5s ease-in-out;
}
.loader-outer {
    min-height: 40vh;
    display: flex;
    align-items: center;
    justify-content: center;
    .loader {
        min-height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        svg {
            path {
                fill: #6d57e4;
            }
        }
    }
}

.dropdown-menu a {
    font-size: 14px;
    color: #000;
}
.dropdown-menu {
    a {
        &:hover {
            color: #6d57e4;
            text-decoration: none;
            background: #f9f8ff;
        }
        svg {
            margin-right: 5px;
        }
    }
}
.card-custom {
    border-radius: 0;
    background: var(--background-color-primary);
    .form-label {
        font-weight: 500;
        /* font-size:1rem; */
    }
    th {
        font-weight: 500;
        font-size: 14px;
    }
}
.icon-text {
    color: var(--text-primary-color);
}
.action_column {
    .btn-group {
        position: static;
    }
    .btn.btn-primary {
        color: var(--text-primary-color);
        background: transparent;
        border: 0;
    }
    .btn:focus {
        box-shadow: none;
    }
    .dropdown-toggle::after {
        display: none;
    }
    .dropdown-menu {
        border: 1px solid #f0f0f0;
        box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        z-index: 9999;
        .dropdown-item {
            padding: 0.4rem 1rem;
        }
    }
}

.invoice-btn {
    border-radius: 3px;
    padding: 2px 0 0;
    display: inline-flex;
    width: 75px;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: #33ab55;
    cursor: pointer;
    &.invoice-not-paid {
        background: #d13e3a;
    }
    &.invoice-zero-amount {
        background: #686868;
    }
    &.invoice-amount {
        background: #6089ad;
    }
}

.table-hover {
    tbody.no-result-tbody > tr:hover > * {
        background-color: var(--background-color-primary);
        --cui-table-accent-bg: var(--background-color-primary);
    }
}
div table .no-result-tbody {
    &.loading {
        td {
            padding-left: 0;
        }
    }
    tr {
        &:hover {
            --cui-table-accent-bg: rgb(255 255 255 / 8%);
        }
    }
    td {
        padding-left: 0;
        .img-empty {
            max-width: 333px;
            width: 100%;
        }
    }
}

.dark-link,
.dark-link:hover {
    font-weight: 600;
    font-size: 16px;
    color: #000;
}

.position-middle {
    position: relative;
    top: -1px;
}
.btn-custom {
    border-radius: 14px;
    min-height: 44px;
}
.filter-applied {
    width: 12px;
    height: 12px;
    background: #6d57e4;
    top: -1px;
    right: -3px;
    border-radius: 10px;
}

.custom-scroll-div {
    height: 75vh;
    position: relative;
    // overflow-y: hidden;
    // overflow-x: hidden;
    // min-height: 500px;
}
.dropstart .dropdown-toggle::before {
    display: none;
}
.calendar-icon[data-v-51f82bb7] {
    right: 6px;
    top: 12px;
    z-index: 99;
}
.icon-align {
    position: relative;
    top: -2px;
}
.appointment-confirmed,
.appointment-checked {
    color: #33ab55;
    margin-right: 2px;
    position: relative;
    top: -2px;
}
.appointment-created {
    color: #c3c3c3;
    margin-right: 2px;
    position: relative;
    top: -2px;
}
// .appoint-room {
//     top: -3px;
// }
/* media start */
@media (min-width: 1024px) and (max-width: 1199.98px) {
    .table-booking {
        &.loading {
            td {
                padding-left: 0;
            }
        }
        tbody:not(.loading) {
            td {
                &.service-td {
                    width: 148px;
                }
                &:nth-child(1) {
                    svg {
                        width: 16px;
                    }
                }
            }
        }
    }
}
@media screen and (min-width: 1200px) {
    .wrap-body {
        padding: 0 !important;
    }
    .table-booking {
        td {
            &.service-td {
                width: 20%;
            }
        }
    }
}
@media screen and (max-width: 991.98px) {
    table.table-booking {
        border-color: #c9c9c9;
        caption {
            font-size: 1.3em;
        }
        thead {
            border: none;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }
        tr {
            border-bottom: 3px solid #ddd;
            display: block;
            margin-bottom: 0.625em;
        }
        td {
            border-bottom: 1px solid #ddd;
            flex-wrap: wrap;
            width: 100%;
            font-size: 15px;
            text-align: left;
            padding-left: 120px;
            position: relative;
            display: flex;
            gap: 10px;
            .ml-mobile {
                margin-left: 2px;
            }
        }
        .c-sub-text {
            display: inline-flex;
            align-items: center;
            font-size: 14px;
            u, span {
                font-size: 14px;
            }
        }
    }

    table tbody:not(.no-result-tbody) td::before {
        content: attr(data-label);
        float: left;
        font-weight: bold;
        position: absolute;
        left: 0;
        //background: #F9F8FF;
        min-width: 107px;
        top: 0;
        padding: 9px 15px;
        height: 100%;
        border-color: #e7e7e7;
        border-collapse: collapse;
        border-style: solid;
        border-width: 0 1px;
    }

    table td:last-child {
        border-bottom: 0;
    }
}
@media(max-width:500px) {
    div table tbody.no-result-tbody td.empty_resul {
        padding-left:0px;
    }
}



</style>
