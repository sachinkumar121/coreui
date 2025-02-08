<template>
    <div class="font-overpass p-3">
        <InfoHelperModal 
            :size="'lg'"
            class="business-setup-modal"
            backdrop="static"
            :visible="visibleGetStartedModal"
            title="Let's get your business setup!"
            :body-lines='["Confirm new business profile", "Add at least 1 Service Category and 1 Service", "Set business hours", "Set business hours enable popular features(optional)"]'
            @modal:close="visibleGetStartedModal = false"
        />

        <template v-if="!visibleGetStartedModal">
            <h6 class="mb-4">New business setup</h6>
            <CNav variant="tabs" role="tablist" class="custom-tab-style">
                <CNavItem>
                    <CNavLink
                        href="javascript:void(0);"
                        :active="tabPaneActiveKey === 1"
                        @click="
                            () => {
                                tabPaneActiveKey = 1
                            }
                        "
                    >
                        <Icon icon="tabler:circle-number-1" :height="24" /> Profile
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink
                        href="javascript:void(0);"
                        :active="tabPaneActiveKey === 2"
                        @click="
                            () => {
                                tabPaneActiveKey = 2
                            }
                        "
                    >
                        <Icon icon="tabler:circle-number-2" :height="24" /> Services
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink
                        href="javascript:void(0);"
                        :active="tabPaneActiveKey === 3"
                        @click="
                            () => {
                                tabPaneActiveKey = 3
                            }
                        "
                    >
                        <Icon icon="tabler:circle-number-3" :height="24" /> Hours
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink
                        href="javascript:void(0);"
                        :active="tabPaneActiveKey === 4"
                        @click="
                            () => {
                                tabPaneActiveKey = 4
                            }
                        "
                    >
                        <Icon icon="tabler:circle-number-4" :height="24" /> Features
                    </CNavLink>
                </CNavItem>
            </CNav>
            <form @submit.prevent="null">
                <div class="form-body custom-tab-body tab-theme-style">
                    <CTabContent>
                        <CTabPane
                            role="tabpanel"
                            aria-labelledby="home-tab"
                            :visible="tabPaneActiveKey === 1"
                        >
                            <Profile 
                            :initial-data="form.profile"
                            @profileInfoSubmitted="onProfileInfoSubmit" />
                        </CTabPane>
                        <CTabPane
                            role="tabpanel"
                            aria-labelledby="profile-tab"
                            :visible="tabPaneActiveKey === 2"
                        >
                            <Services 
                            @previousClick="tabPaneActiveKey = 1"
                            @serviceInfoSubmitted="onServiceInfoSubmitted" />
                        </CTabPane>
                        <CTabPane
                            role="tabpanel"
                            aria-labelledby="contact-tab"
                            :visible="tabPaneActiveKey === 3"
                        >
                            <Hours 
                              @businessHoursInfoSubmitted="onBusinessHoursInfoSubmitted"
                            >
                              <template v-slot:footer="{ addBusinessHours }">
                                <div class="row">
                                    <div class="col-md-12 py-4">
                                        <hr />
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-12 pt-3">
                                        <p class="mb-4">
                                            Advance hours setup? Info
                                            <Icon
                                                icon="tabler:info-circle"
                                                class="theme-color cursor-pointer"
                                                style="top: 0"
                                                :width="24"
                                                :height="24"
                                                @click="
                                                    () => {
                                                        visibleAdvancedHoursHelpModal = true
                                                    }
                                                "
                                            />
                                        </p>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-12 pt-3">
                                        <div class="d-flex justify-content-between">
                                            <button class="btn btn-light" type="button" @click="() => tabPaneActiveKey = 2">
                                                Previous
                                            </button>
                                            <button class="btn btn-success" type="button" @click="addBusinessHours">
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                              </template>
                            </Hours>
                        </CTabPane>
                        <CTabPane
                            role="tabpanel"
                            aria-labelledby="contact-tab"
                            :visible="tabPaneActiveKey === 4"
                        >
                            <Finish v-if="visibleFinishStep"
                                :success-array="success_array"
                                :next-steps="next_steps"
                            />
                            <Features v-else
                                :showErrorData="show_error_data"
                                :errorData="errorData"
                                :processingSubmission="form_submitted"
                                @previousClick="tabPaneActiveKey = 3"
                                @businessFeatureInfoSubmitted="onBusinessFeatureInfoSubmitted"
                            />
                        </CTabPane>
                    </CTabContent>
                </div>
            </form>
        </template>
        <InfoHelperModal 
            :size="'lg'"
            :visible="visibleAdvancedHoursHelpModal"
            title="Help Advanced Hours"
            :bodyLines='["This app supports advanced hours setup like if your business opens on alternate days like Mon, Wed, Sun or any other weekday combination", "It can also support multiple breaks in a day.", "Enable it at Menu->Settings->Advanced Business Hours", "This feature can be enabled on a per service provider in provider profile"]'
            @modal:close="visibleAdvancedHoursHelpModal = false"
        />
    </div>
</template>

<script>
import { Icon } from '@/common/Icon';
import InfoHelperModal from '@/common/InfoHelperModal.vue';

import Profile from '@/ui_components/start-wizard/Profile.vue';
import Services from '@/ui_components/start-wizard/Services.vue';
import Hours from '@/ui_components/start-wizard/Hours.vue';
import Features from '@/ui_components/start-wizard/Features.vue';
import Finish from '@/ui_components/start-wizard/Finish.vue';

export default {
    name: 'StartWizard',
    components: {
        Icon,
        InfoHelperModal,
        Profile,
        Services,
        Hours,
        Features,
        Finish
    },
    data() {
        return {
            visibleAdvancedHoursHelpModal: false,
            visibleGetStartedModal: false,
            form: {
                profile: {
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    pin: ''
                },
                services: [],
                business_hours_data: {},
                feature_data: {},
            },
            tabPaneActiveKey: 1,
            form_submitted: false,
            visibleFinishStep: false,
            show_error_data: false,
            errorData: {
                type: '',
                heading: '',
                subheading: ''
            },
            success_array: [],
            next_steps: []
        }
    },
    mounted() {
        this.visibleGetStartedModal = true;
        this.$schedsdk.get_profile({type:1}).then((result)=>{
            if (result.status) {
              this.form.profile.first_name = result.data.first_name;
              this.form.profile.last_name = result.data.last_name;
              this.form.profile.email = result.data.email;
              this.form.profile.phone = result.data.phone;
            }
        })
    },
    methods: {
        onProfileInfoSubmit(profileData) {
            this.form.profile = profileData;
            this.tabPaneActiveKey = 2;
        },
        onServiceInfoSubmitted(serviceData) {
            this.form.services = serviceData;
            this.tabPaneActiveKey = 3;
        },
        onBusinessHoursInfoSubmitted(hoursData) {
            this.form.business_hours_data = hoursData;
            this.tabPaneActiveKey = 4;
        },
        onBusinessFeatureInfoSubmitted(featureData) {
            this.form.feature_data = featureData;
            this.submitBusinessInfo();
        },
        submitBusinessInfo() {
            let that = this;
            
            this.form_submitted = true;
            that.show_error_data = false;
            that.success_array = [];
            that.next_steps = [];
            let data = {
                setup_version: 2,

                first_name: this.form.profile.first_name,
                last_name: this.form.profile.last_name,
                email: this.form.profile.email,
                phone: this.form.profile.phone,
                new_pin: this.form.profile.pin,

                service_name: this.form.services.map(s => s.name),
                service_category: this.form.services.map(s => s.category),
                service_price: this.form.services.map(s => s.price),
                service_duration: this.form.services.map(s => s.time),

                business_hours_data: this.form.business_hours_data,

                enable_text_messages: this.form.feature_data.enable_text_messages,
                enable_two_way_text: this.form.feature_data.enable_two_way_text,
                enable_online_booking_text: this.form.feature_data.enable_online_booking_text,
                enable_require_payment_for_online: this.form.feature_data.enable_require_payment_for_online
            };
            console.log("asdasd--- business info data. ", JSON.stringify(data));

            this.$schedsdk
                .setupBusinessInfo( data )
                .then(async (result) => {
                    if (result.status == 1) {
                      that.success_array = result.success_array;
                      that.next_steps = result.next_steps;
                      that.visibleFinishStep = true;
                      const business_data_response = await this.$schedsdk.tax_percentage();
                      this.$store.commit('BUSINESS_DATA', business_data_response.business_setting);
                    } else {
                      that.errorData.heading = 'Error!';
                      that.errorData.subheading = result.error_array.join(", ");
                      that.errorData.type = 'error';
                      that.show_error_data = true;
                    }
                    that.form_submitted = false;
                    that.$skyEventListener.generateEvent('AEV_SETUP_COMPLETE');
                  })
                  .catch((error) => {
                    that.errorData.heading = 'Error from server';
                    that.errorData.subheading = error?.data?.message || "something went wrong";
                    that.errorData.type = 'error';
                    that.show_error_data = true;
                    that.form_submitted = false;
                });
        },
    },
}
</script>

<style lang="scss">
.business-setup-modal {
  
    .modal-content {
      background-color: var(--background-color-primary);
      box-shadow: 0px 0px 100px rgba(255, 255, 255, 0.2);
      border-radius: 45px;
      padding: 39px 45px;
      .modal-header {
        padding:0;
        border-bottom:0;
        .modal-title {
          font-size: 28px;
        }
        .btn-close {
          display: none;
        }
      }
      .modal-body {
        padding: 20px 0 0;
          margin-bottom: 20px;
          list-style-type: none;
          padding-left: 0;
          counter-reset: steps;
          p {
            counter-increment: steps;
            position: relative;
            padding-left: 20px;
            margin-bottom: 20px;
            font-size: 18px;
            &:before {
                position: absolute;
                left: 0;
                content: counter(steps)".";
            }
          }
        
      }
      .modal-footer {
        padding: 0;
        border-top:0;
        .custom-setup-button {
          height: 50px;
          width: 195px;
          background: #6D57E4;
          border: 1px solid #6D57E4;
          font-size: 18px;
          font-weight: normal;
          justify-content: center;
        }
      }
    }
  }
  .custom-tab-body {
    .icon {
      rect {
        stroke-width: 1.2 !important;
      }
    }
    .card {
      background: transparent;
      border: 0;
    }
    
  
    .input-small {
      max-width: 150px;
    }
    .form-field-height {
      min-height: 280px;
    }
    .form-check-label {
      color: var(--text-primary-color);
    }
    div.form-check {
      padding-left: 2rem;
      .form-check-input {
        margin-left: -2.2em;
        border: 1px solid #C9C9C9;
      }
    }
    .control-label {
      b {
        font-weight: 500;
      }
    }
    .btn {
      // min-width: 150px;
      min-height:44px;
      font-size: 16px;
      &.btn-light {
        color: #000;
        text-transform: capitalize;
      }
    }
    .day-hour-input {
      input.form-control {
        width: 93px;
        background: transparent;
        border: 1px solid #C9C9C9;
      }
    }
    .copy-icon-outer {
      background-color: rgba($color: #D9D9D9, $alpha: .2);
      padding: 3px;
      border-radius: 3px;
      display: inline-block;
    }
    .form-check-day {
      min-width: 180px;
    }
    .break-hours-label {
      max-width: 400px;
      width: 100%;
    }
  }
  // setup wizard
.custom-tab-style {
    &.nav-tabs {
      .nav-link {
        font-size: 16px;
        font-weight: 500;
        padding: 0.5rem 1.4rem;
        color: var(--text-tab-gray); 
        border-width: 0 0 3px 0;
        svg {
          color: var(--text-tab-gray);
        }
        &.active {
          border-radius: 2px 2px 0px 0px;
          border-style: solid;
          border-width: 0 0 3px 0;
          border-color: var(--link-color);
          color: var(--text-primary-color);
          background-color: transparent;
          svg {
            color: var(--text-primary-color);
          }
          &:hover, &:focus {
            border-width: 0 0 3px 0;
            border-color: var(--link-color) !important;
          }
        }
        &:hover, &:focus {
          text-decoration: none;
        }
      }
    }
    .icon {
      rect {
        stroke-width: 1.2 !important;
      }
    }
  }
  
  @media screen and (max-width: 991.98px) {
    .business-setup-modal {
      .modal-content {
        padding: 20px;
        .modal-header {
          .modal-title {
            font-size: 20px;
          }
        }
        .modal-body {
          p {
            font-size: 14px;
          }
        }
        .modal-footer {
          .custom-setup-button {
            font-size: 16px;
            height: 40px;
            width: 125px;
          }
        }
      }
    }
  }
</style>