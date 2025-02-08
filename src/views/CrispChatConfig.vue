<template>
    <CContainer class="content-left">
        <div v-if="!error">
            <form id="update-config-form" @submit.prevent="saveConfig" class="lookup_form">
                <h1 class="form-title">Sky Sched Plugin Configuration</h1>
                <div><p>Use this form to connect your Sky Sched business messaging to Crisp Chat.<br>
                   Once your phone number are selected, 
                    Sky Sched will forward the text/sms from your customer 
                        to the selected business number to Crisp Chat.<br>
                    When your operators reply on Crisp app, 
                    Sky Sched will forward the reply to the customer's phone<br>
                    
                    Note that message credits from your account are used to receive and send the SMS/Text messages<br>
                    
                    </p></div>

                <template v-if="config_already_exists === false">
                    <div class="form-group">
                        <label htmlFor="access_key" class="control-label"><b>Access Key</b></label>
                        <input 
                            class="form-control"
                            type="text"
                            v-model="config_data.access_key"
                            id="access_key"
                            placeholder="Access key"
                        />
                    </div>
                    <div class="form-group">
                        <label htmlFor="access_password" class="control-label"><b>Access Password</b></label>
                        <input 
                            class="form-control"
                            type="password"
                            v-model="config_data.access_password"
                            id="access_password"
                            placeholder="Access password"
                        />
                    </div>
                </template>
                <template v-else>
                    <div>Status: <b v-if="is_messaging_identity_selected"> Connected</b> 
                    <b v-else> Not Connected</b> 
                            to Crisp WebSiteID: {{ this.config_data.website_id }}</div>
                    <br>
                    
                </template>
                <div class="md-checkbox has-success">
                    <input type="checkbox"
                        v-model="config_data.enable_sms"
                        id="enable_sms"/>
                    <label htmlFor="enable_sms" class="control-label">&nbsp; 
                        <b>Enable SMS/Text forward to Crisp</b></label>
                </div>

                <!-- Enable when Whats app is available 
                    
                    <div class="md-checkbox has-success">
                    <input type="checkbox"
                        v-model="config_data.enable_whatsapp"
                        id="enable_whatsapp"/>
                    <label htmlFor="enable_whatsapp" class="control-label">&nbsp; <b>Enable Whatsapp</b></label>
                </div>
                
                <div class="md-checkbox has-success">
                    <input type="checkbox"
                        v-model="config_data.enable_voice"
                        id="enable_voice"/>
                    <label htmlFor="enable_voice" class="control-label">&nbsp; <b>Enable Voice</b></label>
                </div>

                -->

                <div v-if="configData?.available_messaging_identities">
                    <h4>Select the Messaging Phone Numbers you'd like to connect to Crisp Chat</h4>
                    <CTable hover>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col">Identity</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Used for</CTableHeaderCell>
                                <CTableHeaderCell scope="col">tag</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Select?</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow v-for="messaging_identity in configData.available_messaging_identities" :key="messaging_identity.mid_rec_id">
                                <CTableHeaderCell scope="row">{{getPhoneFormatted(messaging_identity.identity)}}</CTableHeaderCell>
                                <CTableDataCell>{{messaging_identity.used_for}}</CTableDataCell>
                                <CTableDataCell><input type="text" v-model="messaging_identity.special_tag" /></CTableDataCell>
                                <CTableDataCell><input type="checkbox" v-model="messaging_identity.checked"/></CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                        </CTable>
                </div>
                <div>
                    <Alerts 
                        :alertData="alertData" 
                        :show="show"
                        @alertClosed="show = 0"
                        v-if="alert"
                    />
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-success">Save</button>
                </div>
            </form>

        </div>
        <div v-else>
            <p>{{error}}</p>
        </div>
    </CContainer>    
</template>

<script>
import Alerts from './Alerts';
import utils_lib from '../helpers/utils_lib';
export default {
    name: 'CrispChatConfig',
    components: {
        Alerts
    },
    data() {
        return ({
            config_data: {
                enable_sms: false,
                enable_whatsapp: false,
                enable_voice: false,
                access_key: null,
                access_password: null,
            },
            is_messaging_identity_selected : false,
            alert: false,
            show: 0,
            alertData: {
                message: '',
                type: ''
            },
            config_already_exists: null,
            error: null,
            configData: null
        });
    },
    methods: {
        saveConfig() {
            let that = this;
            // console.log(this.config_data);
            if (this.configData?.available_messaging_identities) {
                this.config_data.selected_messaging_identities = this.configData.available_messaging_identities.filter(ami => ami.checked != undefined && ami.checked);
            }
            this.$schedsdk.esp_save_config(this.config_data).then((result) => {
                let { website_id = null, token = null, crisp_load = '0' } = that.$route.query;
                that.createOrGetConfig(website_id, token, crisp_load);
            }).catch(function(error) {
                this.alertData = {
                    message: error.data.message,
                    type:'danger'
                }
                this.alert = true;
                this.show = 4;
            });
        },
         getPhoneFormatted(phone, country_code ="US")
         {
             return utils_lib.getPhoneFormatted(phone )
         },
        createOrGetConfig(website_id, token, crisp_load) {
            let that = this;

            this.config_data.website_id = website_id;
            this.config_data.pp_side_acct_id = website_id;
            this.config_data.pp_side_acct_secret = token;
            this.config_data.provider_token = token;
            //console.log( this.$store.state.business_settings)
            if( this.$store && this.$store.state && this.$store.state.business_settings && 
                this.$store.state.business_settings.api_access_account_id &&
                this.$store.state.business_settings.api_access_account_secret
                )
            {
                this.config_data.access_key =this.$store.state.business_settings.api_access_account_id;
                this.config_data.access_password =this.$store.state.business_settings.api_access_account_secret;
            }
            this.$schedsdk.esp_get_config(this.config_data).then((result) => {
                if (result.status) {
                    let configData = result.data;
                    this.configData = configData;
                    that.config_data.pp_settings_id = configData._id;
                    that.config_data.enable_sms = configData.enable_sms;
                    that.config_data.enable_voice = configData.enable_voice;
                    that.config_data.enable_whatsapp = configData.enable_whatsapp;
                    that.config_already_exists = true;

                    that.config_data.website_id = configData.pp_side_acct_id;
                    that.is_messaging_identity_selected = false;
                    this.config_data.available_messaging_identities =
                     this.configData.available_messaging_identities.map(function(ami) 
                        {
                            let selectedMessageIdentity = configData.selected_messaging_identities.find(
                                t => t.mid_rec_id == ami.mid_rec_id);
                            if (selectedMessageIdentity) {
                                ami.checked = true;
                                ami.special_tag = selectedMessageIdentity.special_tag;
                                that.is_messaging_identity_selected = true;
                            }
                            return ami;
                        });
                } else {
                    that.config_already_exists = false;
                }
            }).catch(console.error);
        }
    },
    created() {
        let { website_id = null, token = null, crisp_load = '0' } = this.$route.query;
        let userData = this.$store?.state?.user_data;
        if ((website_id && token) || userData) {
            this.error = null;
            this.createOrGetConfig(website_id, token, crisp_load);
        } else {
            this.error = "website id or token query parameter is missing."
        }
    }
}
</script>