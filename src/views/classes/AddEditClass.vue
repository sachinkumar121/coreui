<template>
    <div>
        <CRow>
            <CCol sm="12">
                <Alerts 
                    :alertData="alertData" 
                    :show="show"
                    @alertClosed="show = 0"
                    v-if="alert"
                />
                <CNav variant="tabs" role="tablist" class="nav-style-custom">
                    <CNavItem>
                        <CNavLink
                            href="javascript:void(0);" 
                            :class="{ 'error-tab': v$.form.details.$invalid && formSubmitted }"
                            :active="tabPaneActiveKey === 1"
                            @click="() => {tabPaneActiveKey = 1}"
                        >
                            Details
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            href="javascript:void(0);"
                            :class="{ 'error-tab': v$.form.billing.$invalid && formSubmitted }"
                            :active="tabPaneActiveKey === 2"
                            @click="() => {tabPaneActiveKey = 2}"
                        >
                            Billing
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            href="javascript:void(0);"
                            :class="{ 'error-tab': v$.form.schedule.$invalid && formSubmitted }"
                            :active="tabPaneActiveKey === 3"
                            @click="() => {tabPaneActiveKey = 3}"
                        >
                            Schedule
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            href="javascript:void(0);"
                            :class="{ 'error-tab': v$.form.other.$invalid && formSubmitted }"
                            :active="tabPaneActiveKey === 4"
                            @click="() => {tabPaneActiveKey = 4}"
                        >
                            Other
                        </CNavLink>
                    </CNavItem>
                </CNav>
                <form class="add-edit-class-form" @submit.prevent="addEditClass">
                    <div class="form-body">

                        <CTabContent class="mb-3">
                            <CTabPane role="tabpanel" aria-labelledby="details-tab" :visible="tabPaneActiveKey === 1">
                                <div class="card">
                                    <div class="card-body rounded">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="control-label"><b>Name</b></label>
                                            <input 
                                                type="text"
                                                class="form-control placeholder-no-fix" 
                                                v-model="form.details.name" 
                                                :class={invalid:v$.form.details.name.$error}
                                                @blur="v$.form.details.name.$touch()" 
                                            />
                                            <p class="error-msg" v-if="v$.form.details.name.$dirty && v$.form.details.name.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="control-label"><b>Code</b></label>
                                            <input 
                                                type="text"
                                                class="form-control placeholder-no-fix" 
                                                v-model="form.details.code" 
                                                :class={invalid:v$.form.details.code.$error}
                                                @blur="v$.form.details.code.$touch()" 
                                            />
                                            <p class="error-msg" v-if="v$.form.details.code.$dirty && v$.form.details.code.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>

                                    <!-- <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>Status</b></label>
                                            <v-select 
                                                v-model="form.details.class_status" label="name" :options="classStatusType"
                                                :reduce="st => st.value"
                                                @search:blur="v$.form.details.class_status.$touch()"
                                            >
                                                <template v-slot:no-options>
                                                    Type to search..
                                                </template>
                                                <template v-slot:option="option" >
                                                    <div class="d-center">
                                                        {{ option.label }}
                                                    </div>
                                                </template>
                                                <template v-slot:selected-option="option" >
                                                    <div class="selected d-center">
                                                        {{ option.label }}
                                                    </div>
                                                </template>
                                            </v-select>
                                            <p class="error-msg" v-if="v$.form.details.class_status.$dirty && v$.form.details.class_status.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div> -->
                                </div>

                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>Subject</b></label>
                                            <v-select 
                                                v-model="form.details.subject_id"
                                                label="name" :options="subject_options"
                                                :reduce="s => s._id"
                                                :class={invalid:v$.form.details.subject_id.$error}
                                                @search:blur="v$.form.details.subject_id.$touch()" 
                                            >
                                                <template v-slot:no-options>
                                                    Type to search ...
                                                </template>
                                                <template v-slot:option="option" >
                                                    <div class="d-center">
                                                    {{ option.name }}
                                                    </div>
                                                </template>
                                                <template v-slot:selected-option="option" >
                                                    <div class="selected d-center">
                                                    {{ option.name }}
                                                    </div>
                                                </template>
                                            </v-select>
                                            <p class="error-msg" v-if="v$.form.details.subject_id.$dirty && v$.form.details.subject_id.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>Course</b></label>
                                            <v-select 
                                                v-model="form.details.course_id"
                                                label="name" 
                                                :options="course_options"
                                                :reduce="s => s._id"
                                                :class={invalid:v$.form.details.course_id.$error}
                                                @search:blur="v$.form.details.course_id.$touch()"
                                            >
                                                <template v-slot:no-options>
                                                    Type to search ...
                                                </template>
                                                <template v-slot:option="option" >
                                                    <div class="d-center">
                                                    {{ option.name }}
                                                    </div>
                                                </template>
                                                <template v-slot:selected-option="option" >
                                                    <div class="selected d-center">
                                                    {{ option.name }}
                                                    </div>
                                                </template>
                                            </v-select>
                                            <p class="error-msg" v-if="v$.form.details.course_id.$dirty && v$.form.details.course_id.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>Instructors</b></label>
                                            <v-select 
                                                multiple
                                                v-model="form.details.instructors"
                                                label="first_name" :options="instructor_options"
                                                @search:blur="v$.form.details.instructors.$touch()"
                                            >
                                            <template v-slot:no-options>
                                                Type to search ...
                                            </template>
                                            <template v-slot:option="option" >
                                                <div class="d-center">
                                                {{ option.first_name }}
                                                </div>
                                            </template>
                                            <template v-slot:selected-option="option" >
                                                <div class="selected d-center">
                                                {{ option.first_name }}
                                                </div>
                                            </template>
                                        </v-select>
                                        <p class="error-msg" v-if="v$.form.details.instructors.$dirty && v$.form.details.instructors.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-12 mb-3">
                                        <template v-for="(location, index) in form.details.location" :key="index">
                                            <div class="tag-style">
                                                <span>{{location.address}}</span>
                                                <button class="btn btn-close" aria-label="Remove item" @click="(e) => removeLocationItem(index)"></button>
                                            </div>
                                        </template>
                                    </div>
                                    <div class="col-md-12">
                                        <p class="error-msg" v-if="v$.form.details.location.required.$invalid">Please add atleast one location.</p>
                                    </div>
                                    <div class="col-md-12">
                                        <button class="btn btn-success float-end" type="button" @click="showLocationModal">Add location</button>
                                    </div>
                                </div>
                                </div>
                                </div>
                            </CTabPane>

                            <CTabPane role="tabpanel" aria-labelledby="billing-tab" :visible="tabPaneActiveKey === 2">
                             <div class="card">
                                    <div class="card-body rounded">
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>Payment Mode</b></label>
                                            <v-select 
                                                v-model="form.billing.payment_mode" label="name" :options="classPaymentModeType"
                                                :reduce="st => st.value"
                                                @search:blur="v$.form.billing.payment_mode.$touch()"
                                            >
                                                <template v-slot:no-options>
                                                    Type to search..
                                                </template>
                                                <template v-slot:option="option" >
                                                    <div class="d-center">
                                                        {{ option.label }}
                                                    </div>
                                                </template>
                                                <template v-slot:selected-option="option" >
                                                    <div class="selected d-center">
                                                        {{ option.label }}
                                                    </div>
                                                </template>
                                            </v-select>
                                            <p class="error-msg" v-if="v$.form.billing.payment_mode.$dirty && v$.form.billing.payment_mode.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>Class cost</b></label>
                                            <input 
                                                type="text"
                                                class="form-control placeholder-no-fix" 
                                                v-model.number="form.billing.class_cost" 
                                                :class={invalid:v$.form.billing.class_cost.$error}
                                                @blur="v$.form.billing.class_cost.$touch()" 
                                            />
                                            <p class="error-msg" v-if="v$.form.billing.class_cost.$dirty && v$.form.billing.class_cost.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>Total class cost</b></label>
                                            <input 
                                                type="text"
                                                class="form-control placeholder-no-fix" 
                                                v-model.number="form.billing.total_class_cost" 
                                                :class={invalid:v$.form.billing.total_class_cost.$error}
                                                @blur="v$.form.billing.total_class_cost.$touch()" 
                                            />
                                            <p class="error-msg" v-if="v$.form.billing.total_class_cost.$dirty && v$.form.billing.total_class_cost.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>
                                    
                                </div>

                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>invoice</b></label>
                                            <v-select 
                                                v-model="form.billing.invoice" label="name" :options="classInvoiceType"
                                                :reduce="st => st.value"
                                                @search:blur="v$.form.billing.invoice.$touch()"
                                            >
                                                <template v-slot:no-options>
                                                    Type to search..
                                                </template>
                                                <template v-slot:option="option" >
                                                    <div class="d-center">
                                                        {{ option.label }}
                                                    </div>
                                                </template>
                                                <template v-slot:selected-option="option" >
                                                    <div class="selected d-center">
                                                        {{ option.label }}
                                                    </div>
                                                </template>
                                            </v-select>
                                            <p class="error-msg" v-if="v$.form.billing.invoice.$dirty && v$.form.billing.invoice.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>No of class</b></label>
                                            <input 
                                                type="number"
                                                class="form-control placeholder-no-fix" 
                                                v-model="form.billing.no_of_classes" 
                                                :class={invalid:v$.form.billing.no_of_classes.$error}
                                                @blur="v$.form.billing.no_of_classes.$touch()" 
                                            />
                                            <p class="error-msg" v-if="v$.form.billing.no_of_classes.$dirty && v$.form.billing.no_of_classes.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>
                                    
                                </div>

                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>Meet every</b></label>
                                            <v-select 
                                                v-model="form.billing.meet_every" label="name" :options="meetEveryType"
                                                :reduce="st => st.value"
                                                @search:blur="v$.form.billing.meet_every.$touch()"
                                            >
                                                <template v-slot:no-options>
                                                    Type to search..
                                                </template>
                                                <template v-slot:option="option" >
                                                    <div class="d-center">
                                                        {{ option.label }}
                                                    </div>
                                                </template>
                                                <template v-slot:selected-option="option" >
                                                    <div class="selected d-center">
                                                        {{ option.label }}
                                                    </div>
                                                </template>
                                            </v-select>
                                            <p class="error-msg" v-if="v$.form.billing.meet_every.$dirty && v$.form.billing.meet_every.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>meeting days of week</b></label>
                                            <v-select 
                                                multiple
                                                v-model="form.billing.meeting_days_of_week"
                                                :options="weekDays"
                                                :reduce="st => st.value"
                                                @search:blur="v$.form.billing.meeting_days_of_week.$touch()"
                                            >
                                                <template v-slot:no-options>
                                                    Type to search..
                                                </template>
                                                <template v-slot:option="option" >
                                                    <div class="d-center">
                                                        {{ option.label }}
                                                    </div>
                                                </template>
                                                <template v-slot:selected-option="option" >
                                                    <div class="selected d-center">
                                                        {{ option.label }}
                                                    </div>
                                                </template>
                                            </v-select>
                                            <p class="error-msg" v-if="v$.form.billing.meeting_days_of_week.$dirty && v$.form.billing.meeting_days_of_week.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>Repeat Sequence</b></label>
                                            <input 
                                                type="number"
                                                class="form-control placeholder-no-fix" 
                                                v-model="form.billing.repeat_sequence" 
                                                :class={invalid:v$.form.billing.repeat_sequence.$error}
                                                @blur="v$.form.billing.repeat_sequence.$touch()" 
                                            />
                                            <p class="error-msg" v-if="v$.form.billing.repeat_sequence.$dirty && v$.form.billing.repeat_sequence.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>
                                </div>
                                </div>
                                </div>
                            </CTabPane>

                            <CTabPane role="tabpanel" aria-labelledby="schedule-tab" :visible="tabPaneActiveKey === 3">
                                 <div class="card">
                                    <div class="card-body rounded">
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>Class start date</b></label>
                                            <flat-pickr 
                                                class="form-control placeholder-no-fix" 
                                                v-model="form.schedule.start_date"
                                                :config="date_picker_config"
                                                placeholder="Class start date"
                                                @blur="v$.form.schedule.start_date.$touch()"
                                            />
                                            <p class="error-msg" v-if="v$.form.schedule.start_date.$dirty && v$.form.schedule.start_date.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>Class start time</b></label>
                                            <flat-pickr 
                                                class="form-control placeholder-no-fix" 
                                                v-model="form.schedule.class_start_time"
                                                :config="time_picker_config"
                                                placeholder="Class start time"
                                                @blur="v$.form.schedule.class_start_time.$touch()"
                                            />
                                            <p class="error-msg" v-if="v$.form.schedule.class_start_time.$dirty && v$.form.schedule.class_start_time.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>Cancel last date</b></label>
                                            <flat-pickr 
                                                class="form-control placeholder-no-fix" 
                                                v-model="form.schedule.cancel_last_date"
                                                :config="date_picker_config"
                                                placeholder="Cancel last date"
                                                @blur="v$.form.schedule.cancel_last_date.$touch()"
                                            />
                                            <p class="error-msg" v-if="v$.form.schedule.cancel_last_date.$dirty && v$.form.schedule.cancel_last_date.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>
                                    
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>Class end date</b></label>
                                            <flat-pickr 
                                                class="form-control placeholder-no-fix" 
                                                v-model="form.schedule.end_date"
                                                :config="date_picker_config"
                                                placeholder="Class end date"
                                                @blur="v$.form.schedule.end_date.$touch()"
                                            />
                                            <p class="error-msg" v-if="v$.form.schedule.end_date.$dirty && v$.form.schedule.end_date.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>Class end time</b></label>
                                            <flat-pickr 
                                                class="form-control placeholder-no-fix" 
                                                v-model="form.schedule.class_end_time"
                                                :config="time_picker_config"
                                                placeholder="Class end time"
                                                @blur="v$.form.schedule.class_end_time.$touch()"
                                            />
                                            <p class="error-msg" v-if="v$.form.schedule.class_end_time.$dirty && v$.form.schedule.class_end_time.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>
                                </div>
                                </div>
                                    </div>
                            </CTabPane>

                            <CTabPane role="tabpanel" aria-labelledby="other-tab" :visible="tabPaneActiveKey === 4">
                                <div class="card">
                                    <div class="card-body rounded">
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>Credits</b></label>
                                            <input 
                                                type="number"
                                                class="form-control placeholder-no-fix" 
                                                v-model="form.other.credits" 
                                            />
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>absence percentage</b></label>
                                            <input 
                                                type="number"
                                                class="form-control placeholder-no-fix" 
                                                v-model="form.other.absence_percentage" 
                                            />
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>free absence count</b></label>
                                            <input 
                                                type="number"
                                                class="form-control placeholder-no-fix" 
                                                v-model="form.other.free_absence_count" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>max capacity</b></label>
                                            <input 
                                                type="number"
                                                class="form-control placeholder-no-fix" 
                                                v-model="form.other.max_capacity" 
                                                :class={invalid:v$.form.other.max_capacity.$error}
                                                @blur="v$.form.other.max_capacity.$touch()" 
                                            />
                                            <p class="error-msg" v-if="v$.form.other.max_capacity.$dirty && v$.form.other.max_capacity.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="control-label"><b>max waitlist</b></label>
                                            <input 
                                                type="number"
                                                class="form-control placeholder-no-fix" 
                                                v-model="form.other.max_waitlist" 
                                                :class={invalid:v$.form.other.max_waitlist.$error}
                                                @blur="v$.form.other.max_waitlist.$touch()" 
                                            />
                                            <p class="error-msg" v-if="v$.form.other.max_waitlist.$dirty && v$.form.other.max_waitlist.required.$invalid">This field must not be empty.</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" v-model="form.other.join_any_time" id="joinAnyTime">
                                            <label class="form-check-label" for="joinAnyTime">Join any time</label>
                                        </div>
                                    </div>
                                </div>
                                </div>
                                </div>
                            </CTabPane>
                        </CTabContent>

                        <div class="row">
                            <div class="col-md-12">
                                <button class="btn btn-success float-end">{{ operationName == 'edit' ? 'Update' : 'Add'}} Class</button>
                            </div>
                        </div>
                    </div>
                </form>
            </CCol>
        </CRow>

        <CModal :visible="show_location_modal" @close="hideLocationModal">
            <CModalHeader>
                <CModalTitle>Add location</CModalTitle>
            </CModalHeader>
            <form class="add-location-form" @submit.prevent="addLocationData">
                <CModalBody>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label"><b>location Type</b></label>
                                <v-select 
                                    v-model="location_data.location_type" label="name" :options="classLocationType"
                                    :reduce="st => st.value"
                                    @search:blur="v$.location_data.location_type.$touch()"
                                >
                                    <template v-slot:no-options>
                                        Type to search..
                                    </template>
                                    <template v-slot:option="option" >
                                        <div class="d-center">
                                            {{ option.label }}
                                        </div>
                                    </template>
                                    <template v-slot:selected-option="option" >
                                        <div class="selected d-center">
                                            {{ option.label }}
                                        </div>
                                    </template>
                                </v-select>
                                <p class="error-msg" v-if="v$.location_data.location_type.$dirty && v$.location_data.location_type.required.$invalid">This field must not be empty.</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label"><b>address</b></label>
                                <input class="form-control placeholder-no-fix"
                                    type="text" 
                                    v-model="location_data.address"
                                    :class={invalid:v$.location_data.address.$error}
                                    @blur="v$.location_data.address.$touch()" 
                                />
                                <p class="error-msg" v-if="v$.location_data.address.$dirty && v$.location_data.address.required.$invalid">This field must not be empty.</p>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label"><b>building</b></label>
                                <input class="form-control placeholder-no-fix"
                                    type="text" 
                                    v-model="location_data.building"
                                    :class={invalid:v$.location_data.building.$error}
                                    @blur="v$.location_data.building.$touch()" 
                                />
                                <p class="error-msg" v-if="v$.location_data.building.$dirty && v$.location_data.building.required.$invalid">This field must not be empty.</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label"><b>room</b></label>
                                <input class="form-control placeholder-no-fix"
                                    type="text" 
                                    v-model="location_data.room"
                                    :class={invalid:v$.location_data.room.$error}
                                    @blur="v$.location_data.room.$touch()" 
                                />
                                <p class="error-msg" v-if="v$.location_data.room.$dirty && v$.location_data.room.required.$invalid">This field must not be empty.</p>
                            </div>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton type="button" color="secondary" @click="hideLocationModal">Close</CButton>
                    <CButton color="primary" 
                    @click="addLocationData" class="btn btn-success">Save changes</CButton>
                </CModalFooter>
            </form>
        </CModal>
    </div>
</template>

<script>
import { required } from '@vuelidate/validators';
import moment from 'moment-timezone';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import useVuelidate from '@vuelidate/core';
import Alerts from '../Alerts';
import staticListMixin from '@/mixins/static-list';
import { merge } from 'lodash';

export default {
    name: 'Add/Edit Class',
    components: {
        Alerts, flatPickr
    },
    setup: () => ({ v$: useVuelidate() }),
    mixins: [staticListMixin],
    data() {
        return ({
            operationName: "add",
            formSubmitted: false,
            alert: false,
            show: 0,
            alertData: {
                message: '',
                type: ''
            },
            tabPaneActiveKey: 1,
            date_picker_config: {
				altFormat: "F j, Y",
                altInput: true,
			},
            time_picker_config: {
				enableTime: true,
                noCalendar: true,
                dateFormat: "H:i:00",
			},
            location_data: {
                "location_type": null,
                "address": "",
                "building": "",
                "room": ""
            },
            mockForm: {"details":{"name":"meditation","code":"MED-1","class_status":"draft","subject_id":"62bc61e9d8d5d8140c7ab215","course_id":"62bc6332d8d5d8140c7ab221","instructors":[],"location":[{"location_type":"Offline","address":"101","building":"2","room":"1"}]},"billing":{"payment_mode":"per_class","class_cost":10,"invoice":"Upfront","meet_every":"Day","meeting_days_of_week":["Mon","Tue","Wed","Thu"],"repeat_sequence":1,"no_of_classes":7,"total_class_cost":100},"schedule":{"start_date":"2022-06-22","end_date":"2022-06-29","class_start_time":"09:00:00","class_end_time":"11:00:00","cancel_last_date":"2022-06-24"},"other":{"max_capacity":10,"max_waitlist":2,"credits":1,"absence_policy":[{"absence_percentage":0,"free_absence_count":0}],"join_any_time":true,"absence_percentage":5,"free_absence_count":4}},
            form: {
                details: {
                    name: null,
                    code: null,
                    class_status: "draft",
                    subject_id: null,
                    course_id: null,
                    instructors: [],
                    location: [],
                },
                billing: {
                    payment_mode: null, 
                    class_cost: 0,
                    invoice: null,
                    meet_every: null,
                    meeting_days_of_week: [],
                    repeat_sequence: null,
                    no_of_classes: null,
                    total_class_cost: 0, 
                },
                schedule: {
                    start_date: null,
                    end_date: null,
                    class_start_time: null,
                    class_end_time: null,
                    cancel_last_date: null, 
                },
                other: {
                    max_capacity: null, 
                    max_waitlist: null, 
                    credits: null,
                    absence_policy: [
                        {
                            absence_percentage: 0,
                            free_absence_count: 0
                        }
                    ],
                    join_any_time: false
                },
            },
            subject_options: [],
            course_options: [],
            instructor_options: [],
            show_location_modal: false,
        });
    },
    created() {
        this.getProvidersList();
        this.getSubjectsList();
        this.getCoursesList();
        let classId = this.$route.params.id;
        let courseId = this.$route.params.course_id;
        let that = this;
        if (classId) {
            this.$schedsdk.get_class_detail(courseId, classId).then(function(result) {
                if (result.status) {
                    let classData = result.data;
                    that.form.details.name = classData.name;
                    that.form.details.code = classData.code;
                    // that.form.details.class_status = classData.class_status;
                    that.form.details.subject_id = classData.subject_id;
                    that.form.details.course_id = classData.course_id;
                    that.form.details.instructors = classData.instructors.map(function(l) {
                        return {
                            user_id: l.user_id,
                            first_name: l.first_name,
                            last_name: l.last_name
                        }
                    });
                    that.form.details.location = classData.location;

                    that.form.billing.payment_mode = classData.payment_mode;
                    that.form.billing.class_cost = classData.class_cost;
                    that.form.billing.invoice = classData.invoice;
                    that.form.billing.meet_every = classData.meet_every;
                    that.form.billing.meeting_days_of_week = classData.meeting_days_of_week;
                    that.form.billing.repeat_sequence = classData.repeat_sequence;
                    that.form.billing.no_of_classes = classData.no_of_classes;
                    that.form.billing.total_class_cost = classData.total_class_cost;

                    that.form.schedule.start_date = classData.start_date;
                    that.form.schedule.end_date = classData.end_date;
                    that.form.schedule.class_start_time = classData.class_start_time;
                    that.form.schedule.class_end_time = classData.class_end_time;
                    that.form.schedule.cancel_last_date = classData.cancel_last_date;

                    that.form.other.join_any_time = classData.join_any_time;
                    that.form.other.max_capacity = classData.max_capacity;
                    that.form.other.max_waitlist = classData.max_waitlist;
                    that.form.other.credits = classData.credits;
                    that.form.other.absence_percentage = classData.absence_policy[0].absence_percentage;
                    that.form.other.free_absence_count = classData.absence_policy[0].free_absence_count;
                    that.form.other.join_any_time = classData.join_any_time;
                }
            });
            this.operationName = "edit";
        }
    },
    validations: {
        form: {
            details: {
                name: {
                    required
                },
                code: {
                    required
                },
                // class_status: {
                //     required
                // },
                subject_id: {
                    required
                },
                course_id: {
                    required
                },
                instructors: {
                    required
                },
                location: {
                    required
                },
            },
            billing: {
                payment_mode: {
                    required
                }, 
                class_cost: {
                    required
                },
                total_class_cost: {
                    required
                }, 
                invoice: {
                    required
                },
                meet_every: {
                    required
                },
                meeting_days_of_week: {
                    required
                },
                repeat_sequence: {
                    required
                },
                no_of_classes: {
                    required
                },
            },
            schedule: {
                start_date: {
                    required
                },
                end_date: {
                    required
                },
                class_start_time: {
                    required
                },
                class_end_time: {
                    required
                },
                cancel_last_date: {
                    required
                }, 
            },
            other: {
                max_capacity: {
                    required
                }, 
                max_waitlist: {
                    required
                }, 
                credits: {
                    // required
                },
                absence_percentage: {
                    // required
                },
                free_absence_count: {
                    // required
                },
                join_any_time: {
                    required
                },
            }
        },
        location_data: {
            location_type: {
                required
            },
            address: {
                required
            },
            building: {
                required
            },
            room: {
                required
            }
        }
    },
    methods: {
        showLocationModal() {
            this.show_location_modal = true;
        },
        hideLocationModal() {
            this.v$.location_data.$reset();
            this.show_location_modal = false;
        },
        mockLocationItem() {
            return {
                "location_type": null,
                "address": "",
                "building": "",
                "room": ""
            }
        },
        addLocationData() {
            this.v$.location_data.$touch();
            if (!this.v$.location_data.$invalid) {
                this.addLocationItem(this.location_data);
            }
        },
        resetLocationData() {
            this.v$.location_data.$reset();
            this.show_location_modal = false;
            this.location_data = this.mockLocationItem();
        },
        addLocationItem(item = null) {
            item = item ?? this.mockLocationItem();
            this.form.details.location.push(item);
            this.resetLocationData();
        },
        removeLocationItem(index) {
            this.form.details.location.splice(index, 1);
        },
        getProvidersList() {
            this.$schedsdk.get_users_list({}).then((result) => {
                this.instructor_options = result.data.map(function(l) {
                    return {
                        user_id: l._id,
                        first_name: l.first_name,
                        last_name: l.last_name
                    }
                });
            }).catch((error) => {
                console.log(error);
            });
        },
        
        getCoursesList() {
            this.$schedsdk.get_courses({
                name: ""
            }).then((result) => {
                this.course_options = result.data.filter(s => !s.is_deleted);
            }).catch((error) => {
                console.log(error);
            });
        },
        getSubjectsList() {
            this.$schedsdk.get_subjects({
                name: ""
            }).then((result) => {
                this.subject_options = result.data.filter(s => !s.is_deleted);
            }).catch((error) => {
                console.log(error);
            });
        },
        async addEditClass() {
            this.formSubmitted = true;
            const isFormCorrect = await this.v$.form.$validate()
            // you can show some extra alert to the user or just leave the each field to show it's `$errors`.
            if (!isFormCorrect) return
            let classId = this.$route.params.id;
            let timezone = this.$store.state.business_settings.business_time_zone;
            let postData = merge({}, this.form.details, this.form.billing, this.form.schedule, this.form.other);

            let that = this;
            postData.start_date = moment.tz(moment(postData.start_date).format('YYYY-MM-DD'), timezone).valueOf();
            postData.end_date = moment.tz(moment(postData.end_date).format('YYYY-MM-DD'), timezone).valueOf();
            postData.cancel_last_date = moment.tz(moment(postData.cancel_last_date).format('YYYY-MM-DD'), timezone).valueOf();

            postData.absence_policy = [{
                absence_percentage: postData.absence_percentage || 0,
                free_absence_count: postData.free_absence_count || 0
            }];

            let sdkFunctionPromise = this.operationName == "edit" ? this.$schedsdk['update_class'](postData.course_id, classId, postData) : this.$schedsdk['add_class'](postData.course_id, postData);
            
            sdkFunctionPromise.then(function(result) {
                if (result.status) {
                    that.$router.push("/classes");
                } else {
                    that.alertData = {
                        message: result.message,
                        type:'danger'
                    }
                    that.alert = true;
                    that.show = 4;
                }
            }).catch((error) => {
                this.alertData = {
                    message: error.data.message || error.message,
                    type:'danger'
                }
                this.alert = true;
                this.show = 4;
            });
        }
    }
}

</script>

<style scoped>
.error-tab {
    color: #dc3545 !important;
}
.nav-tabs .nav-link {
    text-decoration: none;
}
.nav-style-custom {
    position: relative;
    z-index: 2;
}
.add-edit-class-form {
    margin-top: -2px;
}
.card {
    border-color: #c4c9d0;
}
.form-control.invalid {
    border-color  : #dc3545;
}
.error-msg {
    color  : #dc3545;
}
.form-control.invalid:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 .25rem rgba(220,53,69,.25);
}
</style>