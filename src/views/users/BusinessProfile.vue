<template>
    <div>
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <form  class="business-profile-form col-md-10 col-lg-8">
            <div class="form-group row">
                <div class="col-md-5">
                    <label class="control-label"><b>Business Name</b></label>
                    <span class="star"></span>
                </div>
                <div class="col-md-7">
                <input class="form-control placeholder-no-fix" type="text" maxlength="50" v-model="business_data.business_name" name="first_name"/>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-5">
                    <label class="control-label"><b>Business Phone</b></label>
                    <span class="star"></span>
                </div>
                <div class="col-md-7">
                    <input class="form-control placeholder-no-fix" type="text" maxlength="20" v-model="business_data.business_phone" name="last_name"/>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-5">
                    <label class="control-label"><b>No of Employees</b></label>
                    <span class="star"></span>
                </div>
                <div class="col-md-7">
                    <input class="form-control placeholder-no-fix" type="text" maxlength="3" v-model="business_data.no_of_employees" name="last_name"/>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-5">
                    <label class="control-label"><b>Business Address Line 1</b></label>
                    <span class="star"></span>
                </div>
                <div class="col-md-7">
                    <input class="form-control placeholder-no-fix" type="text" maxlength="30" v-model="business_data.address_line1" name="last_name"/>    
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-5">
                    <label class="control-label"><b>Business Address Line 2</b></label>
                    <span class="star"></span>
                </div>
                <div class="col-md-7">
                    <input class="form-control placeholder-no-fix" type="text" maxlength="30" v-model="business_data.address_line2" name="last_name"/>    
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-5">
                    <label class="control-label"><b>Business Website URL</b></label>
                    <span class="star"></span>
                </div>
                <div class="col-md-7">
                    <input class="form-control placeholder-no-fix" type="text" v-model="business_data.business_website" name="last_name"/>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-5">
                    <label class="control-label"><b>Small Business Logo</b></label>
                </div>
                <div class="col-md-7">
                    <DragDropFile 
                        name="business_small_logo"
                        title="Business Small Logo"
                        :initialFile="business_small_logo_url"
                        file-category="logo"
                        @initial-file-remove="business_small_logo_url = null"
                        @file-change="(file) => onFileChange(file, 'business_small_logo')"
                        @file-remove="(file) => onFileRemove('business_small_logo')"
                    />
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-5">
                    <label class="control-label"><b>Large Business Logo</b></label>
                </div>
                <div class="col-md-7">
                    <DragDropFile 
                        name="business_large_logo"
                        title="Business Large Logo"
                        :initialFile="business_large_logo_url"
                        file-category="logo"
                        @initial-file-remove="business_large_logo_url = null"
                        @file-change="(file) => onFileChange(file, 'business_large_logo')"
                        @file-remove="(file) => onFileRemove('business_large_logo')"
                    />
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-5">
                    <label class="control-label"><b>Privacy Policy Url</b></label>
                    <span class="star"></span>
                </div>
                <div class="col-md-7">
                    <input class="form-control placeholder-no-fix" type="text" v-model="business_data.privacy_policy" name="last_name"/>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-5">
                    <label class="control-label"><b>Terms &amp; Conditions Url</b></label>
                    <span class="star"></span>
                </div>
                <div class="col-md-7">
                    <input class="form-control placeholder-no-fix" type="text" v-model="business_data.terms_and_conditions" name="last_name"/>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-5">
                    <label class="control-label"><b>Country</b></label>
                </div>
                <div class="col-md-7">
                    <v-select
                        v-model="selected_country"
                        label="name"
                        :options="country_options"
                        @update:modelValue="setTimezone"
                    >
                        <template v-slot:no-options>Type to search country name..</template>
                        <template v-slot:option="option" >
                        <div class="d-center">{{ option.name }}</div>
                        </template>
                        <template v-slot:selected-option="option" >
                        <div class="selected d-center">{{ option.name }}</div>
                        </template>
                    </v-select>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-5">
                    <label class="control-label">
                                    <b>Business Location Timezone</b> <CIcon name="cil-CommentSquare"  
                                    v-c-popover="{
                                    header: 'Info',
                                    trigger: 'click',
                                    content: 'Business Timezone is required for accurate appointments.<br>\
                                        You can google for <b><i>your city timezone ID</i></b> \
                                        (ex. <i>Guildford Montana Timezone ID</i>) to search for yours.',
                                }"/>
                                    </label>
                                    
                </div>
                <div class="col-md-7">
                    <v-select v-model="selected_timezone" :options="timezone_options">
                                    <!-- @search="onSearch" @update:modelValue="setBusinessId" -->
                                    <template v-slot:no-options>Please select country for timezone</template>
                                    <template v-slot:option="option" >
                                        <div class="d-center">{{ option.label }}</div>
                                    </template>
                                    <template v-slot:selected-option="option" >
                                        <div class="selected d-center">{{ option.label }}</div>
                                    </template>
                                    </v-select>
                                    <!-- Timezone error list -->
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-5">
                    <label class="control-label"><b>City</b></label>
                </div>
                <div class="col-md-7">
                    <input class="form-control placeholder-no-fix" type="text" v-model="business_data.city">
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-5">
                    <label class="control-label"><b>State</b></label>
                </div>
                <div class="col-md-7">
                    <v-select v-model="selected_state" :options="state_options" label="name">
                        <template v-slot:no-options>Please select country for State</template>
                        <template v-slot:option="option" >
                        <div class="d-center">{{ option.name }}</div>
                        </template>
                        <template v-slot:selected-option="option" >
                        <div class="selected d-center">{{ option.name }}</div>
                        </template>
                    </v-select>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-5">
                    <label class="control-label"><b>Zip Code</b></label>
                </div>
                <div class="col-md-7">
                    <input class="form-control placeholder-no-fix" type="text" v-model="business_data.zipcode">
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-5">
                    <b>Local Time:</b>
                </div>
                <div class="col-md-7">
                    <b>{{getLocalTime()}}</b>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-5">
                    <b>Online Booking Link:</b>
                </div>
                <div class="col-md-7">
                    <b class="booking-link text-break">{{business_data.online_web_bookings_link || "Not Set"}}</b>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-5">
                    <b>Business hours:</b>
                </div>
                <div class="col-md-7">
                    <a href="javascript:void(0)" @click.prevent ="$router.push('/settings/set_business_hours');">View/Change business hours</a>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-5">
                    <b>More business settings:</b>
                </div>
                <div class="col-md-7">
                    <a href="javascript:void(0)" @click.prevent ="$router.push('/settings');">View/Change Settings</a>
                </div>
            </div>
            <div class="form group row">
                <div class="col-md-5">
                        <b>Customer Checkin page:</b><br>
                </div>
                <div class="col-md-7">
                    <a target="_blank" href="javascript:void(0)" @click.prevent="openCustomerCheckinPage">Click for customer checkin</a><br>
                </div>
            </div>
            <!--  -->
            <div class="row">
                <div class="form-body col-md-12">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-actions">
                                <button 
                                    :disabled="uploading || formSubmit"
                                    @click="submitBusinessProfileDetail($event)" class="btn btn-success float-end"
                                >{{uploading ? 'Uploading' : 'Submit'}}</button>
                                <!-- <a id="register-back-btn" :href="dashboard" class="btn btn-default">Cancel</a> -->
                            </div>
                        </div>
                    </div>
                    <Alerts 
                        :alertData="alertData" 
                        :show="show"
                        @alertClosed="alertClosedFn"
                        v-if="alert" />
                </div>
            </div>
        </form>
        <ImagePreviewModal 
            :visible="showLargeLogoPreview"
            @on-close="showLargeLogoPreview = false"
            :url="business_data.large_logo_url"
        />
        <ImagePreviewModal 
            :visible="showSmallLogoPreview"
            @on-close="showSmallLogoPreview = false"
            :url="business_data.small_logo_url"
        />
    </div>
</template>
<script>
import {Icon} from '@/common/Icon'
import Alerts from '../Alerts'
import AppHelper from '../../helpers/app_helper'
import country_json from "../../../countries";
import countryDataHelper from '../../helpers/country_data_helper';
const dtf =Intl.DateTimeFormat(); 
const resolvedOptions  = dtf? dtf.resolvedOptions() : null;
import login_helper from '../../helpers/login_helper';
import utils_lib from '../../helpers/utils_lib';
const tz = resolvedOptions? resolvedOptions.timeZone : null;

import DropFile from "@/ui_components/DropFile.vue";
import DragDropFile from "@/ui_components/DragDropFile.vue";
import ImagePreviewModal from '@/common/ImagePreviewModal.vue';

export default {
    name:'BusinessProfileV2',
    components:{
        Alerts,
        DropFile,
        DragDropFile,
        ImagePreviewModal,
        Icon
    },
    data(){
        return{
            showSmallLogoPreview: false,
            showLargeLogoPreview: false,
            alert:false,
            show:0,
            alertData:{
                message:'',
                type:''
            },
            business_data:{
                address_line1: '',
                address_line2: '',
                // business_email: '',
                business_name: '',
                business_phone: '',
                business_website: '',
                city: '',
                country: '',
                country_code: '',
                // current_plan_level: '',
                large_logo_url: '',
                // location_id: '',
                no_of_employees: '',
                privacy_policy: '',
                small_logo_url: '',
                state: '',
                // terminal_id: '',
                terms_and_conditions: '',
                // unique_scope_id: '',
                zipcode: '',
                online_web_bookings_link: '',
                used_time_zone: '',
                hint_timezone_changed: false
            },
            image_form_Data: new FormData(),
            selected_country: null,
            country_options: country_json,
            selected_timezone: null,
            timezone_options: [],
            selected_state: null,
            state_options:[],
            uploading: false,
            formSubmit: false,
            business_small_logo_url: null,
            business_large_logo_url: null
        }
    },
    created(){
        this.getBusinessProfileDetail();
    },
    mounted()
    {
        
    }, //end function
    methods:{
        openCustomerCheckinPage() {
            const routeData = this.$router.resolve({name: 'Customer Checkin', params: {accesskey: this.$store.state.business_settings.api_access_account_id}});
            window.open(routeData.href, '_blank');
        },
        onFileRemove(key) {
            this.image_form_Data.delete(key);
        },
        onFileChange(file, key) {
            this.image_form_Data.append(key, file);
        },
        getBusinessProfileDetail(){
            this.$schedsdk.get_profile({type:2}).then((result)=>{
                this.business_data = result.data;
                this.business_small_logo_url = this.business_data.small_logo_url;
                this.business_large_logo_url = this.business_data.large_logo_url;
                this.business_data.online_web_bookings_link = "";
                if(this.$store.state.business_settings.allow_website_bookings && 
                   this.$store.state.business_settings.allow_website_bookings == true)
                {

                    let booking_link = AppHelper.get_online_booking_url(this.$store.state.skysched_global_api_base_url, this.$store.state.business_settings);
                    this.business_data.online_web_bookings_link = booking_link
                }
                let country = this.business_data.country;
                let country_code = this.business_data.country_code;
                let sc = null
                this.selected_timezone = this.business_data.used_time_zone || null;
                if (country_code)
                {
                    sc = countryDataHelper.searchByCountryCode(country_code, country_json)
                }
                else
                {
                    sc = countryDataHelper.searchByCountryName(country, country_json);
                }
                if(sc && sc.length)
                {
                    this.selected_country = sc[0]
                }

                if ( this.selected_country  && this.business_data.state)
                {
                    //Set state
                    let ss = countryDataHelper.getStateCodeFromStateName( this.business_data.state, 
                                                this.selected_country.code,
                                                country_json);
                    if(ss && ss.length)
                    {
                        this.selected_state = ss[0];
                    }
                }   
                //console.log("Assdasddsswadsa", this.selected_country)
                this.setTimezone();

            })
        },
        verify_consistent_country_timezone()
        {
            if(this.selected_country ==null || 
               this.selected_timezone == null ||
               this.selected_state == null )
            {
                return {status: 0, message: 'Country, Time zone and state must be selected.'}
            }
            if(!this.selected_country.timezones.includes(this.selected_timezone ))
            {
                 return {status: 0, message: 'Timezone selected does not match country. Please clear and select correct country and timezone'}
            }
            let ss = countryDataHelper.getStateCodeFromStateName( this.selected_state.name, 
                                                this.selected_country.code,
                                                country_json);
            if(ss == null || ss.length ==0)
            {
                 return {status: 0, message: 'State and country do not match, please clear them and select country followed by state.'}
            }
            return {status: 1}
        },
        async submitBusinessProfileDetail(e){
            this.formSubmit = true;
            e.preventDefault();
            // console.log("Alert:  ",this.alert)
            this.alert = false;
            this.show=4;
            let verify_cons = this.verify_consistent_country_timezone()
            if(verify_cons.status == 0)
            {
                alert("Error: " + verify_cons.message);
                this.formSubmit = false;
                return;
            }
            this.business_data.hint_timezone_changed = false;
            if( this.selected_timezone != this.business_data.used_time_zone)
            {
                let confirmed =confirm("Note: You are changing the time zone. " +
                                "Existing bookings will not change the time zone. \n" +
                                "After changing, you must also save your business hours, employee hours again. \n" +
                                "Are you sure to change to " + this.selected_timezone + "?" )
                if(!confirmed)
                {
                    return;
                }
                this.business_data.used_time_zone = this.selected_timezone;
                this.business_data.hint_timezone_changed = true
            }
             this.business_data.country = this.selected_country.name;
             this.business_data.country_code = this.selected_country.code; 
             this.business_data.state= this.selected_state.name; 
            
            await this.uploadBusinessLogos(this.image_form_Data);
            // return false;
            this.$schedsdk.update_profile(2,this.business_data).then((result)=>{
                if(result.status == 1){
                    // this.user.profile_pic = result.data.profile_pic;
                    // this.old_pic = this.user.profile_pic;
                    this.alertData = {
                        message:result.message,
                        type:'success'
                    }
                    this.alert = true;
                }
                else{
                    this.alertData = {
                        message:result.message,
                        type:'danger'
                    }
                    this.alert = true;
                    this.show=4;
                }
            }).finally(() => {
                this.uploading = false;
                this.formSubmit = false;
            })
        },
        async uploadBusinessLogos(formData) {
            if (formData.has('business_small_logo')) {
                this.uploading = true;
                if (this.business_data['small_logo_url']) {
                    await this.removeImage('small_logo_url')
                }
                await this.uploadImage(formData.get('business_small_logo'), 'small_logo_url');
            } else if (!this.business_small_logo_url && this.business_data['small_logo_url']) {
                await this.removeImage('small_logo_url')
            }
            if (formData.has('business_large_logo')) {
                this.uploading = true;
                if (this.business_data['large_logo_url']) {
                    await this.removeImage('large_logo_url')
                }
                await this.uploadImage(formData.get('business_large_logo'), 'large_logo_url');
            } else if (!this.business_large_logo_url && this.business_data['large_logo_url']) {
                await this.removeImage('large_logo_url')
            }
        },
        setTimezone() 
        {
            //console.log("country_jsonsssss", country_json)
            //Set default timezone based on preselect from browser 
            let tzpptions = this.selected_country ? this.selected_country.timezones : [];
         //   this.selected_timezone ="";
            if (this.selected_timezone ==null && tz && tzpptions.includes(tz))
            {
               this.selected_timezone = tz;
            }
            if (this.selected_timezone ==null  && tzpptions.length === 1)
            {
                //Only one TZ is there, so select that
                this.selected_timezone = tzpptions[0];
            }
            
            this.timezone_options = tzpptions
            
            this.state_options = this.selected_country ? this.selected_country.states : [];
            
        },   
        getLocalTime()
        {
            if(this.selected_timezone != null)
            {
                let d2 = new Date();
                let t2 = d2.getTime();
                return utils_lib.getTimeInZone(t2,this.selected_timezone ) + " in " +  this.selected_timezone
            }
            else
            {
                return "Select a timezone"
            }
        },  
        alertClosedFn() {
            this.show = 0;
        },
        async uploadImage(file, key) {
            if (file) {
                let imageUploadData = new FormData;
                imageUploadData.append('file', file);
    
                try {
                    const fileUploadRes = await this.$schedsdk.upload_media('business_logo', imageUploadData);
                    if (fileUploadRes.status) {
                        this.business_data[key] = fileUploadRes.location;
                    }
                } catch(error) {
                    console.log(error)
                }
            }
        },
        async removeImage(key) {
            let url = this.business_data[key];
            if (url) {
                try {
                    const fileRemoveRes = await this.$schedsdk.remove_media({
                        url
                    });
                    if (fileRemoveRes.status) {
                        this.business_data[key] = null;
                    }
                } catch(error) {
                    console.log(error)
                }
            }
        }
    }
}
</script>