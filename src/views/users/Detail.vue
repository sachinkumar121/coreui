<template>
<div>
    <template v-if="loading">
        {{ loading_message }}
    </template>
    <CRow v-else>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <form class="edit-user-form  col-md-10 col-lg-8" @submit.prevent="UpdateUser">
            <div class="form-body">
                <div class="form-group row">
                    <div class="col-md-5">
                        <label class="control-label"><b>First Name</b></label>
                    </div>
                    <div class="col-md-7">
                        <input class="form-control placeholder-no-fix" type="text" v-model="user_data.first_name"/>
                        <p class="error-msg" v-if="false">This field must not be empty.</p>    
                    </div>
                </div>
                <div class="row form-group">
                    <div class="col-md-5">
                        <label class="control-label"><b>Last Name</b></label>
                    </div>
                    <div class="col-md-7">
                        <div class="form-group">
                            <input class="form-control placeholder-no-fix" type="text" v-model="user_data.last_name" />
                            <p class="error-msg" v-if="false">This field must not be empty.</p> 
                        </div>
                    </div>
                </div>
                <div class="row form-group">
                    <div class="col-md-5">
                        <label class="control-label"><b>Email</b></label>
                    </div>
                    <div class="col-md-7">
                        <input class="form-control placeholder-no-fix" type="text" v-model="user_data.email" />
                        <p class="error-msg" v-if="false">This field must not be empty.</p>
                        <p class="error-msg" v-if="false">Please Enter valid email.</p>
                    </div>
                </div>
                <div class="row form-group">
                    <div class="col-md-5">
                        <label class="control-label"><b>Phone</b></label>
                    </div>
                    <div class="col-md-7">
                        <input class="form-control placeholder-no-fix" type="text" v-model="user_data.phone"/>
                        <p class="error-msg" v-if="false">This field must not be empty.</p> 
                    </div>
                </div>
                <div class="row form-group">

                </div>
              <div class="row">
                <div class="col-md-12">
                    <label class="fw-bold">Note: E-Mail OR Phone is required. When provided, they should be unique within the business.</label> 
                     &nbsp;<CIcon name="cil-CommentSquare"  
                        v-c-popover="{
                        header: 'Unique E-mail and Phone',
                        trigger: 'click',  
                        content: 'Email or Phone is required. You can leave one field empty if its not available. \
                            But if they are provided, they must be unique within the business. \
                            In otherwords, multiple providers sharing the same email/phone is not supported. \
                            However, every booking created/updated can be copied to a single email or the business owner.\
                            That allows a receptionist/owner to see all bookings created via email. \
                            This can be set in Settings->Booking Settings->Copy bookings to custom email',
                      }"/><br/>
                      <br/>
                </div>
            </div>
            <div class="row form-group" v-if="!isSectionHide('custom_personal_booking_name')">
                <div class="col-md-5">
                    <label class="control-label"><b>Custom personal booking name</b><CBadge @click="openNameChangeModel" color="primary" class="cursor-pointer ms-2"><span>Change</span></CBadge></label>
                </div>
                <div class="col-md-7">
                    <p class="text-break">{{user_data.g_user_name}}</p>
                </div>
            </div>

            <div class="row form-group" v-if="!isSectionHide('personal_booking_page')">
                <div class="col-md-5">
                    <label class="control-label"><b>Personal booking page</b> </label>
                </div>
                <div class="col-md-7">
                    <a v-if="single_service_booking_url" :href="single_service_booking_url" target="_blank" class="link-urls text-break">{{ single_service_booking_url }}</a> 
                    <p v-else>Not Setup</p> 
                </div>
            </div>
            <div class="row form-group">
                <div class="col-md-5">
                    <label class="control-label"><b>Change Profile Picture</b></label>  
                </div>
                <div class="col-md-7">
                    <DragDropFile 
                        name="user_profile_pic"
                        title="User Profile Pic"
                        :initialFile="user_profile_pic"
                        @initial-file-remove="user_profile_pic = null"
                        @file-change="(file) => onFileChange(file, 'user_profile_pic')"
                        @file-remove="(file) => onFileRemove('user_profile_pic')"
                    />
                </div>
            </div>
            <div class="form-group row" v-if="!isSectionHide('user_role')">
                <div class="col-md-5">
                    <label class="control-label"><b>User role</b> &nbsp;<CIcon name="cil-CommentSquare"  
                        v-c-popover="{
                        header: 'User Role',
                        trigger: 'click',  
                        content: 'Indicates the level of permissions. <i>Provider</i> role is least permissions. Reception role can look at all calendars and make edits in most cases. Owner has all access.',
                      }"/></label>
                </div>
                <div class="col-lg-7">
                    <v-select v-model="user_data.type" 
                                        :disabled = "user_role_editable==false"
                                        label="name" 
                                        :options="user_type_options">
                        <template v-slot:no-options>
                            Type to search Role..
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
                </div>
            </div>
            <div class="row form-group" v-if="!isSectionHide('employment_type')">
                <div class="col-md-5" >
                    <label class="control-label"><b>Employment Type</b></label>
                </div>
                <div class="col-md-7">
                    <v-select v-model="user_data.employment_type" label="name" :options="employment_type_options">
                        <template v-slot:no-options>
                            Type to search Role..
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
                </div>
            </div>
            <div class="row form-group">
                <div class="col-md-5">
                    <label class="control-label"><b>User Introduction</b></label>
                </div>
                <div class="col-md-7">
                    <textarea class="form-control placeholder-no-fix"
                           v-model="user_data.user_bio"
                           style="min-height: 60px;"
                        ></textarea>
                </div>
            </div>
            <div v-if="user_permissions_options.length" class="row form-group">
                <div class="col-md-5">
                    <label class="control-label"><b>User permissions</b></label>
                </div>
                <div class="col-md-7">
                    <v-select v-model="user_data.permissions" label="name" :options="user_permissions_options">
                        <template v-slot:no-options>
                            Type to search permissions..
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
                </div>
            </div>
            <div class="row form-group" v-if="!isSectionHide('work_hours')">
                <div class="col-md-5"><label class="control-label"><b>Work hours</b></label></div>
                <div class="col-md-7">
                    <button type="button" class="btn btn-primary btn-sm" @click.stop.prevent="SetWorkHours()">
                        View/Change Work Hours</button>  
                </div>
            </div>
            <div class="row form-group" v-if="!isSectionHide('provider_display_order')">
                <div class="col-md-5">
                    <label class="control-label"><b>Provider Display Order</b> &nbsp;<CIcon name="cil-CommentSquare"  
                        v-c-popover="{
                        header: 'Provider Display Order',
                        trigger: 'click',  
                        content: 'If you would like to control the order in which providers are shown in online booking (possibly to influence the balance of bookings), \
                            this field allows you to set the order. A value of 1 = first in list, 2 = second in list and so on. \
                            At beginning, all providers are assigned a value of 1000 meaning they are shown either by name or date of add.',
                      }"/></label>
                </div>
                <div class="col-md-7">
                    <input class="form-control placeholder-no-fix" type="text" v-model="user_data.provider_display_order"/>
                </div>
            </div>
            <div class="row form-group" v-if="!isSectionHide('allowed_service_categories')">
                <div class="col-md-5">
                    <label class="control-label"><b>Allowed Service Categories (Specialization Match)</b> <CIcon name="cil-CommentSquare"  
                        v-c-popover="{
                        header: 'Allowed Services Categories (Specialization Match)',
                        trigger: 'click',  
                        content: 'The <b>only</b> list of service category which this provider is allowed to perform. \
                                    This is enforced at booking time. \
                                    Important - must also enable: <b>Settings -> Booking Settings -> Enforce Strict Specialization Match</b>.',
                      }"/></label>
                </div>
                <div class="col-md-7">
                    <v-select multiple v-model="user_data.specialization_match" 
                        label="name" :options="specialization_match_options">
                        <template v-slot:no-options>
                            Type to search ...
                        </template>
                        <template v-slot:option="option" >
                            <div class="d-center">
                            {{ option.name   }}
                            </div>
                        </template>
                        <template v-slot:selected-option="option" >
                            <div class="selected d-center">
                            {{ option.name }}
                            </div>
                        </template>
                    </v-select>
                </div>
            </div>
            <div class="row form-group" v-if="!isSectionHide('service_exclusions_for_booking')">
                <div class="col-md-5">
                    <label class="control-label"><b>Service Exclusions for Booking</b> <CIcon name="cil-CommentSquare"  
                        v-c-popover="{
                        header: 'Service Exclusions',
                        trigger: 'click',  
                        content: 'The list of services which this provider is <b>not</b> allowed to perform. \
                                    This is enforced at booking time. \
                                    Important - must also enable: <b>Settings -> Booking Settings -> Enforce Service Exclusions</b>.',
                      }"/></label>
                </div>    
                <div class="col-md-7">
                    <v-select multiple v-model="user_data.excluded_service_list" 
                                label="name" :options="excluded_service_list_options">
                        <template v-slot:no-options>
                            Type to search ...
                        </template>
                        <template v-slot:option="option" >
                            <div class="d-center">
                            {{ option.name + " (" + option.time + " mins) " + 
                                currency_symbol + "" +   option.price + " in " + option.service_category.name }}
                            </div>
                        </template>
                        <template v-slot:selected-option="option" >
                            <div class="selected d-center">
                            {{ option.name }}
                            </div>
                        </template>
                    </v-select>
                </div>
            </div>  
            <div class="row form-group" v-if="!isSectionHide('more_info_allowed_service_categories')">
                <div class="col-md-12">
                    <label class="control-label"><b>More info about: Allowed Service categories and Service Exclusions</b>: <CIcon name="cil-CommentSquare"  
                        v-c-popover="{
                        header: 'Behavior when Allowed Services Categories+Service Exclusions are set',
                        trigger: 'click',  
                        content: 'When both are specified for this provider: This provider is \
                                    selected for a booking only if: <br>\
                                    1. First, Customer requested service\'s category\
                                        must match the Allowed Service Category for provider.<br>\
                                    2. Next, service should not be in Service Exclusion List for \
                                    this provider.<br>\
                                    When both conditions are satisfied, \
                                    then it proceeds to check further availability. <br>\
                                    Each of above steps are enabled only if Settings -> Booking Settings -> Enforce ... <br>\
                                    options are enabled as well.',
                      }"/>
                    
                    </label>
                </div>    
            </div>  
              
        <div class="row">
            <div class="col-md-12">
                <label class="control-label"><b>More settings</b></label>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <!-- <th>S.no</th> -->
                            <th>Setting Name</th>
                            
                            <th>Action</th> 
                        </tr>
                    </thead>
                    <tbody v-if='settings_list.length'>
                            <template v-for="item in settings_list"   :key="item.name" >
                                <tr v-if="!isSectionHide(item.name)">
                                    
                                    
                                    <td v-if="item.type == 'group'" colspan="2" class="text-center"> 
                                        <strong>{{item.name}}</strong>
                                    </td>
                                    <td v-else>{{item.name}} </td>
                                    <td v-if="item.type == 'number'"> 
                                    <span >{{getPreSymbol(  item)}} &nbsp;<input 
                                            class="col-md-2  placeholder-no-fix" 
                                        
                                            type="text" 
                                            v-model="user_data.user_settings[item.field]"
                                            />&nbsp;{{getPostSymbol( item)}}</span>
                                    </td>
                                    <td v-if="item.type == 'text'"> 
                                    <textarea 
                                            class="form-control placeholder-no-fix" 
                                            v-model="user_data.user_settings[item.field]"
                                            ></textarea>
                                    </td>
                                    <td v-else-if="item.type == 'toggle'"> 
                                    <CFormSwitch v-model="user_data.user_settings[item.field]"
                                        :value="getSettingField(item.field)"
                                        @change="changeAction($event.target.value)"/>
                                    </td>
                                    <td v-else-if="item.type == 'colorpicker'"> 
                                        <chrome-picker  
                                        v-if="user_data.user_settings[item.field]"
                                        v-model="user_data.user_settings[item.field]"></chrome-picker>
                                    </td>   
                                    <td v-else-if="item.type == 'metadata'"> 
                                        <span>{{getItemMetadata(item)}}</span>
                                        
                                    </td>                    
                                    <td v-else-if="item.type == 2"> 
                                    Icon 
                                    </td>
                                    
                                
                                </tr>
                            </template>
                        <tr>
                            <td colspan="2" class="text-center"> 
                                <strong>Animation Preferences</strong>
                            </td>
                            
                        </tr>
                        <tr>
                            <td>Enable Celebration Animations</td>
                            <td> 
                                <CFormSwitch v-model="user_data.ui_preferences.enable_celebration_animations"/>
                            </td> 
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

         <div class="row" v-if="alert">
                    <div class="col-md-8">
                        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
 
                    </div>
              </div>

              <div class="row">
                  <div class="col-md-12">
                        <button 
                            :disabled="uploading || formSubmit" class="btn btn-success float-end"
                        >{{ uploading ? 'Updating' : 'Update'}}</button>
                  </div>
              </div>

              <div class="row">
                    <div class="col-md-4">
                        &nbsp;
                    </div>
              </div>
              <div class="row">
                    <div class="col-md-4">
                        &nbsp;
                    </div>
              </div>

            </div>
        </form>
      </CCol>
    </CRow>
    <CModal :visible="visibleNameChangeModal" @close="() => { visibleNameChangeModal = false }">
        <CModalHeader>
        <CModalTitle>Set Personal Booking Name</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <div class="mb-2">
                <label for=""><b>Current Booking Name: &nbsp;</b></label>
                <span v-if="user_data.g_user_name" class="text-break">{{ user_data.g_user_name }}</span>
                <span v-else><i>N/A</i></span>
            </div>
			<div class="position-relative mb-2">
                <label for=""><b>New Personal Booking Name</b></label>
                <div class="position-relative">
                    <input
                        type="text"
                        class="form-control placeholder-no-fix pe-5"
                        v-model="g_user_name"
                        @input="checkUserName"
                        @blur="v$.g_user_name.$touch()"
                        :class="{
                            invalid: v$.g_user_name.$error,
                        }"
                    />
                    <div class="position-absolute input-status">
                        <span v-if="loader_state == 'searching'">
                            <Icon icon="icon:loading" />
                        </span>
                        <span v-else-if="loader_state == 'green'" class="text-success">
                            <Icon icon="ion:checkmark-circle-sharp" /> 
                        </span>
                        <span v-else-if="loader_state == 'red'" class="text-danger">
                            <Icon icon="ion:close-circle-sharp" /> 
                        </span>
                    </div>
                </div>
            </div>
			
            
            <p class="error-msg"
                v-if="
                    v$.g_user_name.$dirty &&
                    v$.g_user_name.$error
                "
            >{{ v$.g_user_name?.$errors[0]?.$message }}</p>

        	<p class="error-msg" v-if="loader_state == 'red'">The name is already taken.</p>
        </CModalBody>
        <CModalFooter>
        <CButton color="secondary" @click="() => { visibleNameChangeModal = false }">
            Close
        </CButton>
        <CButton color="primary" :disabled="loader_state == 'searching' || loader_state != 'green'" @click="setBookingUserName">Confirm</CButton>
        </CModalFooter>
    </CModal>
  </div>
</template>
<script>
import { required, email, alphaNum, minLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { debounce } from 'lodash';
import Alerts from '../Alerts'
import login_helper from '../../helpers/login_helper';
import AppHelper from '../../helpers/app_helper'
import utils_lib from '../../helpers/utils_lib';
import { Chrome as Chromepicker } from '@ckpack/vue-color';
import { Icon } from '@/common/Icon'
import { CBadge } from '@coreui/vue'
import DragDropFile from "@/ui_components/DragDropFile.vue";

export default {
    name: 'EditProduct',
    components: {
        Alerts,
        'chrome-picker': Chromepicker,
        Icon,
        CBadge,
        DragDropFile
    },
    setup: () => ({
        v$: useVuelidate()
    }),
    data() {
        let user_types = [{
                type: 2,
                name: "Business Owner"
            },
            {
                type: 3,
                name: "Receptionist"
            },
            {
                type: 4,
                name: "Provider"
            },
            {
                type: 5,
                name: "Customer"
            }
            /*
            Don't show business entity for non-admins as its bad to change them
            only admins should be able to
            {
                type: 6,
                name: "Business Entity"
            }*/
        ];
        let user_permissions_options = [];
        if (this.$store.state.user_data.type === 1) {
            user_types = [{
                    type: 1,
                    name: "Administrator"
                },
                {
                    type: 2,
                    name: "Business Owner"
                },
                {
                    type: 3,
                    name: "Receptionist"
                },
                {
                    type: 4,
                    name: "Provider"
                },
                {
                    type: 5,
                    name: "Customer"
                },
                {
                    type: 6,
                    name: "Business Entity"
                }
            ];
            user_permissions_options = [{
                    type: 4,
                    name: "Admin Lowest"
                },
                {
                    type: 5,
                    name: "Admin Medium"
                },
                {
                    type: 6,
                    name: "Admin Full"
                }
            ]
        }

        return ({
            user_profile_pic: null,
            has_profile_pic: false,
            uploading: false,
            formSubmit: false,
            image_form_data: new FormData(),
			user_type_options: user_types,
			user_permissions_options: user_permissions_options,
			employment_type_options: [{
					type: 1,
					name: "Employed"
				},
				{
					type: 2,
					name: "Independent"
				}
			],
			alert: false,
			show: 0,
			alertData: {
				message: '',
				type: ''
			},
			user_business_id: null,
			currency_symbol: this.$store.state.business_settings.business_currency_symbol,
			user_role_editable: true,
			user_data: {
				_id: '',
				first_name: '',
				last_name: '',
				email: '',
				phone: '',
                user_bio: '',
				g_user_name: '',
				type: {
					type: 2,
					name: "Business Owner"
				},
				permissions: null,
				employment_type: {
					type: 1,
					name: "Employed"
				},
				excluded_service_list: [],
				specialization_match: [],
				timezone: this.$store.state.business_settings.business_time_zone,

				user_settings: {},
				allow_text_sms_contact: false,
				allow_email_contact_for_booking: true,
				emp_text_changes_if_appt_confirmed: false,
				emp_text_for_booking_changes: false,
				emp_text_for_customer_checkin: false,
				emp_text_for_customer_confirm: false,
				provider_display_order: 0,
				profile_pic: null,
				ui_preferences: {
					enable_celebration_animations: null,
				}

			}, //User data
			old_pic: null,
			specialization_match_options: [],
			excluded_service_list_options: [],
			settings_list: [],
			original_settings_list: [],
			single_service_booking_url: null,
			visibleNameChangeModal: false,
			g_user_name: "",
			loader_state: null,
            hidden_fields: [],
            loading: false,
            loading_message: "Fetching data..."
        })
    },
    validations() {
        return {
            g_user_name: {
				required,
                alphaNum,
                minLength: minLength(3)
            }
        }
    },
    created() {

        this.original_settings_list = [{
                name: "Text/SMS options",
                type: "group",
                field: ''
            },
            {
                name: "Allow SMS/Text to my phone",
                type: "toggle",
                field: 'allow_text_sms_contact'
            },
            {
                name: "Allow Emails for booking assigned to me",
                type: "toggle",
                field: 'allow_email_contact_for_booking'
            },

            {
                name: "Notify if appointment for me changes (created/updated)",
                type: "toggle",
                field: 'emp_text_for_booking_changes'
            },
            {
                name: "Notify if appointment is confirmed (24 hr) by customer",
                type: "toggle",
                field: 'emp_text_changes_if_appt_confirmed'
            },
            {
                name: "Notify if customer checks in",
                type: "toggle",
                field: 'emp_text_for_customer_checkin'
            },
            {
                name: "Display options",
                type: "group",
                field: ''
            },
            {
                name: "Display Provider in Internal Calendar",
                type: "toggle",
                field: 'provider_show_in_internal_calendar'
            },
            {
                name: "Show Provider in External Online Booking",
                type: "toggle",
                field: 'provider_show_in_online_booking'
            },
            


        ];
        this.settings_list = this.original_settings_list

        this.getServicesList()


    },
    methods: {
        async uploadImage(file, key) {
            if (file) {
                let imageUploadData = new FormData;
                imageUploadData.append('file', file);
    
                try {
                    const fileUploadRes = await this.$schedsdk.upload_media('profile_photo', imageUploadData);
                    if (fileUploadRes.status) {
                        this.user_data[key] = fileUploadRes.location;
                    }
                } catch(error) {
                    console.log(error)
                }
            }
        },
        async removeImage(key) {
            let url = this.user_data[key];
            let has_profile_pic = this.user_data.has_profile_pic;
            if (url && has_profile_pic) {
                try {
                    const fileRemoveRes = await this.$schedsdk.remove_media({
                        url
                    });
                    if (fileRemoveRes.status) {
                        this.user_data[key] = null;
                    }
                } catch(error) {
                    console.log(error)
                }
            }
        },
        async uploadProfilePic(formData) {
            if (formData.has('user_profile_pic')) {
                this.uploading = true;
                if (this.user_data['profile_pic']) {
                    await this.removeImage('profile_pic')
                }
                await this.uploadImage(formData.get('user_profile_pic'), 'profile_pic');
            } else if (!this.user_profile_pic && this.user_data['profile_pic']) {
                await this.removeImage('profile_pic')
            }

        },
        onFileRemove(key) {
            this.image_form_data.delete(key);
            this.has_profile_pic = this.user_data.has_profile_pic;
            this.user_profile_pic = null;
        },
        onFileChange(file, key) {
            this.image_form_data.set(key, file);
            this.has_profile_pic = true;
        },
		async setBookingUserName() {
			const nameUpdatedRes = await this.$schedsdk.check_or_update_g_user_name({
				g_user_name: this.g_user_name,
				also_update: true
			});
			
			if (!nameUpdatedRes.status) {
				this.alertData = {
					message: nameUpdatedRes.message || "Something went wrong",
					type: 'danger'
				}
				this.alertData['type'] = 'danger';
			} else {
				this.alertData = {
					message: "The user name updated successfully!",
					type: 'success'
				}
			}
			this.alert = true;
			this.show = 5;
			this.visibleNameChangeModal = false;
			this.getUserDetail();
		},
        openNameChangeModel() {
			this.v$.$reset(); 
            this.visibleNameChangeModal = true;
            this.g_user_name = this.user_data.g_user_name;
			this.loader_state = null;
        },
        async checkNameUniqueness() {
			if (this.user_data.g_user_name == this.g_user_name) {
				this.loader_state = 'green';
				return;
			}
			const nameUniquenessRes = await this.$schedsdk.check_or_update_g_user_name({
				g_user_name: this.g_user_name
			});
			if (nameUniquenessRes.status) {
				if (nameUniquenessRes.valid) {
					this.loader_state = 'green';
				} else {
					this.loader_state = 'red';
				}
			}
		},
        checkUserName: debounce(async function () {
			this.v$.$touch();
            const isFormCorrect = await this.v$.$validate();
            if (isFormCorrect) {
				this.loader_state = 'searching';
                await this.checkNameUniqueness();
            } else {
				this.loader_state = null;
			}
		}, 750),
        getUserDetail() {
            this.loading = true;

            if (AppHelper.isRoleOwnerOrReception(this.$store.state) ||
                AppHelper.isRoleAdmin(this.$store.state)) {
                this.user_role_editable = true;
            }
            this.$schedsdk.get_user_detail({
                service_provider_id: this.$route.params.user_id
            }).then((result) => {
                if (result.status == 1) {
                    this.user_data._id = result.data._id
                    this.user_business_id = result.data.business_id
                    this.user_data.first_name = result.data.first_name
                    this.user_data.last_name = result.data.last_name
                    this.user_data.email = result.data.email
                    this.user_data.phone = result.data.phone
                    this.user_data.user_bio = result.data.user_bio
                    this.user_data.g_user_name = result.data.g_user_name
                    this.user_data.use_simple_business_hours = result.data.use_simple_business_hours
                    this.user_data.use_advanced_business_hours = result.data.use_advanced_business_hours
                    this.g_user_name = result.data.g_user_name
                    this.single_service_booking_url = result.data.single_service_booking_url
                    this.user_data.type = this.user_type_options.find((obj) => {
                        if (obj.type == result.data.type) return obj
                    })
                    this.user_data.permissions = this.user_permissions_options.find((obj) => {
                        if (obj.type == result.data.permissions) return obj
                    })
                    this.user_data.employment_type = this.employment_type_options.find((obj) => {
                        if (obj.type == result.data.employment_type) return obj
                    })
                    this.user_data.excluded_service_list = [];
                    this.user_data.specialization_match = [];
                    this.user_data.user_settings.allow_text_sms_contact = result.data.allow_text_sms_contact;
                    this.user_data.user_settings.allow_email_contact_for_booking = result.data.allow_email_contact_for_booking;
                    this.user_data.user_settings.emp_text_changes_if_appt_confirmed = result.data.emp_text_changes_if_appt_confirmed;
                    this.user_data.user_settings.emp_text_for_booking_changes = result.data.emp_text_for_booking_changes;
                    this.user_data.user_settings.emp_text_for_customer_checkin = result.data.emp_text_for_customer_checkin;
                    this.user_data.user_settings.emp_text_for_customer_confirm = result.data.emp_text_for_customer_confirm;
                    this.user_data.user_settings.provider_show_in_internal_calendar = result.data.provider_show_in_internal_calendar;
                    this.user_data.user_settings.provider_show_in_online_booking = result.data.provider_show_in_online_booking;
                    this.user_data.provider_display_order = result.data.provider_display_order;
                    this.user_data.profile_pic = result.data.profile_pic
                    this.old_pic = result.data.profile_pic;
                    this.user_data.ui_preferences = result.data.ui_preferences;
                    this.user_data.has_profile_pic = result.data.has_profile_pic;
                    this.user_profile_pic = result.data.has_profile_pic ? result.data.profile_pic : null;
                    this.has_profile_pic = result.data.has_profile_pic;
                    this.hidden_fields = result.hidden_fields;
                    let me = this;

                    result.data.excluded_service_list.map((obj) => {
                        //console.log(obj);
                        // console.log(me.excluded_service_list_options.length);
                        me.excluded_service_list_options.map((exservice) => {
                            //console.log("asdasdasdasd ------ exserv ");
                            //console.log(exservice._id);
                            //console.log(exservice);

                            if (exservice._id.toString() == obj._id.toString()) {
                                me.user_data.excluded_service_list.push(exservice);
                            }
                        })
                    })
                    result.data.specialization.map((obj) => {
                        //console.log(obj);
                        // console.log(me.excluded_service_list_options.length);
                        me.specialization_match_options.map((exservice) => {
                            //console.log("asdasdasdasd ------ exserv ");
                            //console.log(exservice._id);
                            //console.log(exservice);

                            if (exservice._id.toString() == obj._id.toString()) {
                                me.user_data.specialization_match.push(exservice);
                            }
                        })
                    });
                    this.loading = false;
                } else {
                    this.loading_message = result.message;
                }
            }).catch((error) => {
                this.loading_message = error.message;
            });
        },
        getServicesList() {
            this.$schedsdk.list_services({
                page_no: 1
            }).then((result) => {
                if (result.status == 1) {
                    this.excluded_service_list_options = result.data
                }
            }).finally(() => {
                //  this.getUserDetail();
                this.getServiceCategoryList();

            })

        },
        getServiceCategoryList() {
            this.specialization_match_options = [];
            this.$schedsdk.get_service_categories({
                page_no: 1
            }).then((result) => {
                if (result.status == 1) {
                    result.data.forEach(ele => {
                        this.specialization_match_options.push({
                            _id: ele._id,
                            name: ele.name,
                            status: ele.status
                        })
                    })

                }
            }).finally(() => {
                this.getUserDetail();

            })

        },
        SetWorkHours() {
            if (this.user_data.use_advanced_business_hours) {
                this.$router.push('/settings/manage_business_hours_v2/user/' + this.user_data._id);
            } else {
                this.$router.push('/settings/set_business_hours/user/' + this.user_data._id);
            }
        },
        SetServiceExclusionInclusions() {

        },
        getSettingField(field_name) {
            //console.log("asdasdasd" + field_name)
            return Object.prototype.hasOwnProperty.call(this.user_data.user_settings, field_name) ? this.user_data.user_settings[field_name] : ""
        },
        changeAction(value) {
            this.alert = false;
            let toSaveValue = 1
            let message = "enable"
            if (value == "true") {
                toSaveValue = 0
                message = "disable"
            }

        },


        async UpdateUser(e) {
            e.preventDefault();
            //console.log(this.excluded_service_list);
            //return;

            if (!this.user_data.employment_type || this.user_data.employment_type.type == undefined) {
                this.alertData = {
                    message: "Please select an employment type.",
                    type: 'danger'
                }
                this.alert = true;
                this.show = 5;
                return;
            }
            let data = {}
            Object.assign(data, JSON.parse(JSON.stringify(this.user_data)));
            data.type = data.type.type;
            data.employment_type = data.employment_type.type

            data.specialization = data.specialization_match
            data.excluded_service_list = data.excluded_service_list

            let checked_email_phone = utils_lib.check_valid_phone_or_email({
                email: data.email,
                phone: data.phone,
                country_code: data.country_code || this.$store.state.business_settings.business_info.country_code
            })
            if (checked_email_phone == null) {
                this.alertData = {
                    message: "Phone or email is invalid. Please correct or remove one",
                    type: 'danger'
                }
                this.alert = true;
                this.show = 5;
                return;
            }
            //console.log("   dsfdfsdvd ", {fn: data.first_name, ln: data.last_name})
            if (!data.first_name || data.first_name.length < 2) {
                this.alertData = {
                    message: "Atleast the first name must be provided",
                    type: 'danger'
                }
                this.alert = true;
                this.show = 5;
                return;
            }
            //console.log("asdasdasda", data);

            //console.log("asdlaskdlsa permsisasd ", this.permissions)
            if (this.user_data.permissions && this.user_data.permissions.type !== undefined) {
                data.permissions = this.user_data.permissions.type;
            } else {
                delete data.permissions;
            }
            //Saving
            data.user_bio = this.user_data.user_bio;
            data.allow_text_sms_contact = this.user_data.user_settings.allow_text_sms_contact;
            data.allow_email_contact_for_booking = this.user_data.user_settings.allow_email_contact_for_booking;
            data.emp_text_changes_if_appt_confirmed = this.user_data.user_settings.emp_text_changes_if_appt_confirmed;
            data.emp_text_for_booking_changes = this.user_data.user_settings.emp_text_for_booking_changes;
            data.emp_text_for_customer_checkin = this.user_data.user_settings.emp_text_for_customer_checkin;
            data.emp_text_for_customer_confirm = this.user_data.user_settings.emp_text_for_customer_confirm;
            data.provider_show_in_internal_calendar = this.user_data.user_settings.provider_show_in_internal_calendar;
            data.provider_show_in_online_booking = this.user_data.user_settings.provider_show_in_online_booking;
            data.ui_preferences.enable_celebration_animations = this.user_data.ui_preferences.enable_celebration_animations;

            if (true) {
                this.alert = false;
                await this.uploadProfilePic(this.image_form_data);
                data.profile_pic = this.has_profile_pic ? this.user_data['profile_pic'] : null;

                this.$schedsdk.edit_user(data).then(async (result) => {
                    if (result.status == 1) {
                        if (this.$store.state.user_data._id == this.$route.params.user_id) {
                            await this.$store.commit('UPDATE_USER_DATA', {key: 'profile_pic', value: result.data.profile_pic});
                        }
                        if (!AppHelper.isRoleOwnerOrReception(this.$store.state) && !AppHelper.isRoleAdmin(this.$store.state)) {
                            //Stay here
                        } else {
                            this.$router.push('/users');
                        }
                        /* this.checkUpdateProfilePic().then((update_res) => {
                            if (update_res == true) {
                                if (!AppHelper.isRoleOwnerOrReception(this.$store.state) &&
                                    !AppHelper.isRoleAdmin(this.$store.state)) {
                                    //Stay here
                                } else {
                                    this.$router.push('/users');
                                }

                            } else {
                                //Nothing, error
                                this.clearFileInputField('uploadFile_div');
                            }

                        })
                        */
                    } else {
                        this.alertData = {
                            message: result.message,
                            type: 'danger'
                        }
                        this.alert = true;
                        this.show = 4;
                    }
                }).catch(ex => {
                    this.alertData = {
                        message: ex.data.message,
                        type: 'danger'
                    }
                    this.alert = true;
                    this.show = 4;
                }).finally(() => {
                    this.uploading = false;
                    this.formSubmit = false;
                });
            }
        },

        async checkUpdateProfilePic() {
            let update_res = true;
            let that = this;
            if (this.$refs.file.files.length) {

                let formData = new FormData();
                formData.append('profile_pic', this.$refs.file.files[0]);
                let result = await this.$schedsdk.update_profile_picv2(this.user_business_id, this.user_data._id, formData).catch((ex) => {
                    that.alertData = {
                        message: ex.message || "Upload Error",
                        type: 'danger'
                    }
                    that.alert = true;
                    update_res = false;
                });

                if (result && result.status == 1) {
                    that.alertData = {
                        message: "Picture update complete",
                        type: 'success'
                    }
                    that.user_data.profile_pic = result.profile_pic;

                    if (that.$store.state.user_data._id == that.$route.params.user_id) {
                        await that.$store.commit('UPDATE_USER_DATA', {key: 'profile_pic', value: result.profile_pic});
                    }

                } else {
                    update_res = false;
                    that.alertData = {
                        message: result.message || "Upload Error",
                        type: 'danger'
                    }
                }
                that.show = 4;
                that.alert = true;
            } //end if files
            else {
                this.alertData = {
                    message: "Data update complete.",
                    type: 'success'
                }
                that.show = 4;

                this.alert = true;

                if (that.$store.state.user_data._id == that.$route.params.user_id) {
                    that.user_data.type = that.user_data.type.type;
                    login_helper.apply_new_user_data(that.$schedsdk, that.$store, that.user_data)
                }
                that.alert = true;
            }
            return update_res;

        },
        openFile(event) {
            var input = event.target;
            // Instantiate FileReader
            var reader = new FileReader();
            reader.onload = () => {
                let TheFileContents = reader.result;
                this.profile_pic = TheFileContents;
            };
            // Produce a data URL (base64 encoded string of the data in the file)
            // We are retrieving the first file from the FileList object
            reader.readAsDataURL(input.files[0]);
        },
        clearFileInputField(tagId) {
            this.profile_pic = this.old_pic;
            document.getElementById(tagId).value = "";
        },

        alertClosedFn() {
            this.show = 0;
        },
        isSectionHide(sectionName) {
            return this.hidden_fields.includes(sectionName);
        }
    }
}
</script>
<style scoped>
.invalid{
  border: 1Px solid red;
  /* background-color: lightcoral; */
  color: red;
}
.error-msg{
  color: red;
}

.input-status {
    right: 10px;
    top: 9px;
}
.form-group p {
    font-family: "Overpass", sans-serif;
}
</style>