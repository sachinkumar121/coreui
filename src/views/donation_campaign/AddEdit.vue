<template>
    <div>
        <CRow>
            <CCol sm="12">
                <Alerts 
                    :alertData="alertData" 
                    :show="show"
                    @alertClosed="show = 0"
                    v-if="alert" />
                <form class="add-edit-campaign-form" @submit.prevent="addEditCampaign">
                    <div class="form-body">
                        <div class="row">
                            <div class="col-md-4">
                                <!-- <div class="form-group" >
                                    <label class="control-label"><b>Business</b></label>
                                    <v-select 
                                        label="business_name"
                                        v-model="selected_business"
                                        :reduce="business => business._id"
                                        :options="business_list"
                                    >
                                        <template v-slot:no-options="{ search, searching }">
                                            <template v-if="searching">
                                            No results found for <em>{{ search }}</em
                                            >.
                                            </template>
                                            <em v-else style="opacity: 0.5">Start typing to search</em>
                                        </template>
                                        <template v-slot:option="option">
                                        <div class="d-center">
                                            {{ option.business_name }}
                                            </div>
                                        </template>
                                        <template v-slot:selected-option="option">
                                            <div style="display: flex; align-items: baseline">
                                            <div class="selected d-center">{{ option.business_name}}</div>
                                            </div>
                                        </template>
                                    </v-select> 
                                    <p class="error-msg" v-if="v$.selected_business.$dirty && v$.selected_business.required.$invalid">This field must not be empty.</p>
                                </div> -->
                                <div class="form-group" >
                                    <label class="control-label"><b>Title</b></label>
                                    <input 
                                    :class={invalid:v$.title.$error}
                                    class="form-control placeholder-no-fix" 
                                    type="text" 
                                    v-model="title"
                                    @blur="v$.title.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.title.$dirty && v$.title.required.$invalid">This field must not be empty.</p>
                                    <p class="error-msg" v-if="v$.title.$dirty && v$.title.minLength.$invalid">The title must be at least 3 characters.</p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group" >
                                    <label class="control-label"><b>Amount Options</b></label>
                                    <div class="position-relative">
                                        <span class="position-absolute currency-icon">{{ currency_symbol }}</span>
                                        <!-- <Icon icon="bi:currency-dollar" class="position-absolute currency-icon" :height="18" /> -->
                                        <input 
                                            class="form-control placeholder-no-fix ps-4" 
                                            type="number" 
                                            placeholder="Enter amount and press enter"
                                            min="1"
                                            max="100"
                                            v-model="amount_option"
                                            v-on:keydown.enter.prevent="addAmountOption"
                                            @blur="v$.fixed_amount_options.$touch()" 
                                        />
                                    </div>
                                    <div class="mt-2">
                                        <div class="d-flex flex-wrap gap-2" v-if="fixed_amount_options.length > 0">
                                            <CBadge v-for="(fixed_amount_option, index) in fixed_amount_options" class="badge-custom cursor-pointer">
                                                <span class="badge-amount">{{ fixed_amount_option }}</span>&nbsp;<span @click="removeAmountOption(index)"><Icon icon="tabler:x" :width="13" :height="13" /></span>
                                            </CBadge>
                                        </div>
                                    </div>
                                    <p class="error-msg mt-1" v-if="v$.fixed_amount_options.$dirty && v$.fixed_amount_options.required.$invalid">Please create atleast one option.</p>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group mb-0">
                                    <label class="control-label"><b>Image</b></label>
                                </div>
                                <DragDropFile 
                                    name="image"
                                    title="Donation Campaign Image"
                                    :initialFile="image_url"
                                    file-category="logo"
                                    @initial-file-remove="image_url = null"
                                    @file-change="(file) => onFileChange(file, 'image')"
                                    @file-remove="(file) => onFileRemove('image')"
                                />
                            </div>
                            <div class="col-md-4">
                                <div class="form-group" >
                                    <label class="control-label"><b>Description</b></label>
                                    <textarea rows="5"
                                    style="min-height:105px"
                                    :class={invalid:v$.description.$error}
                                    class="form-control placeholder-no-fix" 
                                    type="text" 
                                    v-model="description"
                                    @blur="v$.description.$touch()"></textarea>
                                    <p class="error-msg" v-if="v$.description.$dirty && v$.description.required.$invalid">This field must not be empty.</p>
                                    <p class="error-msg" v-if="v$.description.$dirty && v$.description.minLength.$invalid">The description must be at least 10 characters.</p>
                                </div>
                            </div>
                            
                        </div>

                        <div class="row form-group">
                            <div class="col-md-4 mb-3 mb-md-0">
                                <label for=""><strong>Background Color</strong></label>
                            </div>
                            <div class="col-md-4">
                                <chrome-picker v-model="background_color" />
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col-md-4 mb-3 mb-md-0">
                                <label for=""><strong>Text Color</strong></label>
                            </div>
                            <div class="col-md-4">
                                <chrome-picker  v-model="text_color" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                            <div class="md-checkbox has-success">
                                <input id="anonymous-donations" type="checkbox" 
                                    v-model="allow_anonymous_donations" 
                                    :checked="allow_anonymous_donations"
                                    class="md-check">
                                &nbsp;<label for="anonymous-donations"><b>Allow Anonymous Donations</b></label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="md-checkbox has-success">
                                <input type="checkbox" id="default-campaign"
                                    v-model="is_default_campaign" 
                                    :checked="is_default_campaign"
                                    class="md-check">
                                &nbsp;<label for="default-campaign"><b>Default Campaign</b></label>
                            </div>
                        </div>
                        </div>

                        <div class="row">
                            <div class="col-md-8">
                                <button  class="btn btn-success float-end">{{add_edit_string}} Campaign</button>
                            </div>
                        </div>
                    </div>
                </form>
            </CCol>
        </CRow>
    </div>
</template>

<script>
import { required, minLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { Icon } from '@/common/Icon';
import Alerts from '@/views/Alerts'
import DragDropFile from "@/ui_components/DragDropFile.vue";
import { Chrome as Chromepicker } from '@ckpack/vue-color';

export default {
    name: 'Add Edit Campaign',
    components: {
        Alerts,
        DragDropFile,
        Icon,
        'chrome-picker': Chromepicker
    },
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return({
            title: null,
            description: null,
            allow_anonymous_donations: false,
            is_default_campaign: false,
            fixed_amount_options: [],
            amount_option: null,
            image: null,
            image_url: null,
            image_form_data: new FormData(),
            background_color: "#5B00B7",
            text_color: "#fff",

            add_edit_string: "Add",
            campaign_id: this.$route.params.campaign_id,
            // selected_business: null,
            // business_list: [],
            alert: false,
            show: 0,
            alertData: {
                message: '',
                type: ''
            },
            currency_symbol: this.$store.state.business_settings.business_currency_symbol,
        })
    },
    validations: {
        // selected_business: {
        //     required
        // },
        title: {
            required, minLength: minLength(3)
        },
        description: {
            required, minLength: minLength(10)
        },
        fixed_amount_options: {
            required
        }
    },
    async created() {
        this.add_edit_string = this.campaign_id ? "Update": "Add";
        if (this.campaign_id) {
            await this.getCampaignInfo(this.campaign_id);
        }
        // await this.getAllBusinesses();
    },
    methods: {
        async getCampaignInfo(id) {
            try {
                const response = await this.$schedsdk
                    .get_donation_campaign_detail(id);
                if (response.status) {
                    const { data } = response;
                    this.title = data.title;
                    this.description = data.description;
                    this.image = data.image;
                    this.image_url = data.image;
                    this.background_color = data.background_color || "#5B00B7";
                    this.text_color = data.text_color || "#fff";
                    this.allow_anonymous_donations = data.allow_anonymous_donations;
                    this.fixed_amount_options = data.fixed_amount_options;
                    this.is_default_campaign = data.is_default_campaign;
                    // this.selected_business = data.business;
                }
            } catch (error) {
                console.error(error);
            }
        },
        async addEditCampaign(e) {
            e.preventDefault();
            this.v$.$touch();
            if (!this.v$.$invalid) {
                
                try {
                    const data = { 
                        title: this.title, 
                        description: this.description,
                        fixed_amount_options: this.fixed_amount_options,
                        allow_anonymous_donations: this.allow_anonymous_donations,
                        is_default_campaign: this.is_default_campaign,
                        background_color: typeof this.background_color == "object" ? this.background_color.hex : this.background_color,
                        text_color: typeof this.text_color == "object" ? this.text_color.hex : this.text_color
                    };
                    let sdkMethod = "add_donation_campaign";
                    if (this.campaign_id) {
                        sdkMethod = "edit_donation_campaign";
                        data._id = this.campaign_id;
                    }

                    if (this.image_form_data.has('image')) {
                        this.uploading = true;
                        if (this.image_url) {
                            await this.removeImage();
                        }
                        await this.uploadImage(this.image_form_data.get('image'));
                    } else if (!this.image_url && this.image) {
                        await this.removeImage();
                    }
                    data.image = this.image;

                    const response = await this.$schedsdk[sdkMethod](data);
                    if (response.status) {
                        this.$router.push({ path: "/donation_campaigns/list" });
                    } else {
                        this.showAlert(response);
                    }
                } catch (error) {
                    this.showAlert(error);
                }
            }
        },
        showAlert(error) {
            this.alertData = {
                message: error?.data?.message || error.message || error,
                type: 'danger'
            }
            this.alert = true;
            this.show = 4;
        },
        addAmountOption() {
            if (this.amount_option > 0) {
                this.fixed_amount_options.push(this.amount_option);
                this.amount_option = null;
            }
        },
        removeAmountOption(index) {
            this.fixed_amount_options.splice(index, 1)
        },
        onFileChange(file, key) {
            this.image_form_data.append(key, file);
        },
        onFileRemove(key) {
            this.image_form_data.delete(key);
        },
        async uploadImage(file) {
            if (file) {
                let imageUploadData = new FormData;
                imageUploadData.append('file', file);
    
                try {
                    const fileUploadRes = await this.$schedsdk.upload_media('donation_image', imageUploadData);
                    if (fileUploadRes.status) {
                        this.image = fileUploadRes.location;
                    }
                } catch(error) {
                    console.log(error)
                }
            }
        },
        async removeImage() {
            let url = this.image;
            if (url) {
                try {
                    const fileRemoveRes = await this.$schedsdk.remove_media({
                        url
                    });
                    if (fileRemoveRes.status) {
                        this.image = null;
                    }
                } catch(error) {
                    console.log(error)
                }
            }
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
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
.badge-amount {
    padding-top: 4px;
    display: inline-block;
}
.currency-icon {
    left: 6px;
    top: 12px;
}
.badge-custom {
    background: var(--border-color-d9);
    border: 1px solid var(--border-color-d9);
    color: var(--text-gray);
}
.badge-custom svg {
    position: relative;
    right: -3px;
}
</style>