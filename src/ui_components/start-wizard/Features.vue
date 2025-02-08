<template>
    <div class="card">
        <TabAlert 
            v-if="showErrorData"
            icon="mdi:warning"
            class="error-msg-new"
            :type="errorData.type"
            :heading="errorData.heading"
            :subheading="errorData.subheading"
        />
        <div class="card-body pt-4 px-2 px-sm-3">
            <div class="form-field-height">
                <h6 class="mb-4">Turn on popular features</h6>

                <div class="row">
                    <div class="col-md-12">
                        <div class="d-flex form-group mb-0">
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    v-model="enable_text_messages"
                                    true-value="1"
                                    false-value="0"
                                    id="enable_text_messages"
                                />
                                <label class="form-check-label" for="enable_text_messages"
                                    >Enable Text/SMS reminders to customers?
                                </label>
                                <Icon
                                    icon="tabler:info-circle"
                                    class="theme-color cursor-pointer ms-1"
                                    style="top: 0"
                                    :width="24"
                                    :height="24"
                                    @click="
                                        () => {
                                            visibleSmsTextHelpModal = true
                                        }
                                    "
                                />
                            </div>
                        </div>
                        <div class="d-flex form-group mb-0">
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    v-model="enable_two_way_text"
                                    true-value="1"
                                    false-value="0"
                                    id="enable_two_way_text"
                                />
                                <label class="form-check-label" for="enable_two_way_text"
                                    >Enable two way Text/SMS*?</label
                                >
                                <Icon
                                    icon="tabler:info-circle"
                                    class="theme-color cursor-pointer ms-1"
                                    style="top: 0"
                                    :width="24"
                                    :height="24"
                                    @click="
                                        () => {
                                            visibleTwoWayTextHelpModal = true
                                        }
                                    "
                                />
                            </div>
                        </div>
                        <div class="d-flex form-group mb-0">
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    v-model="enable_online_booking_text"
                                    true-value="1"
                                    false-value="0"
                                    id="enable_online_booking_text"
                                />
                                <label class="form-check-label" for="enable_online_booking_text"
                                    >Enable online booking?</label
                                >
                                <p>
                                    *Instructions and URL will be emailed to
                                    owner
                                </p>
                            </div>
                        </div>
                        <div class="d-flex form-group mb-0">
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    v-model="enable_require_payment_for_online"
                                    true-value="1"
                                    false-value="0"
                                    id="enable_require_payment_for_online"
                                />
                                <label class="form-check-label" for="enable_require_payment_for_online"
                                    >Require full payment for online bookings?</label
                                >
                                <p>
                                    You'll be asked to setup Online Web Payments next
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 mt-5 pt-2">
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-light" type="button" @click="() => $emit('previousClick')" :disabled="processingSubmission">
                            Previous
                        </button>
                        <button class="btn btn-success" type="button" @click="addBusinessFeatures" :disabled="processingSubmission">
                            Finish
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <InfoHelperModal
            :visible="visibleSmsTextHelpModal"
            title="Help SMS Text Messages"
            :bodyLines="[
                'Enable text/SMS messages. When this is enabled, text confirmations are sent to your customers on new appointments, rescheduling etc.',
                'You can control more in Settings -> Booking Reminder Settings.',
            ]"
            @modal:close="visibleSmsTextHelpModal = false"
        />

        <InfoHelperModal
            :visible="visibleTwoWayTextHelpModal"
            title="Help 2 Way SMS Text Messages"
            :bodyLines="[
                'Enable 2-way text messages. When this is enabled, Your customers can checkin and confirm their appointments via text messages.',
            ]"
            @modal:close="visibleTwoWayTextHelpModal = false"
        />
    </div>
</template>

<script>
import { Icon } from '@/common/Icon';
import InfoHelperModal from '@/common/InfoHelperModal.vue';
import TabAlert from '@/common/TabAlert.vue';

export default {
    name: 'StartWizardFeaturesTab',
    emits: ['businessFeatureInfoSubmitted', 'previousClick'],
    components: {
        Icon,
        InfoHelperModal,
        TabAlert
    },
    props: {
        processingSubmission: {
            default: false,
            type: Boolean
        },
        showErrorData: {
            default: false,
            type: Boolean
        },
        errorData: {
            type: Object,
            default: {}
        },
    },
    data() {
        return {
            visibleSmsTextHelpModal: false,
            visibleTwoWayTextHelpModal: false,

            enable_text_messages: "0",
            enable_two_way_text: "0",
            enable_online_booking_text: "0",
            enable_require_payment_for_online: "0"
        }
    },
    methods: {
        addBusinessFeatures(e) {
            e.preventDefault();
            let that = this;

            that.$emit('businessFeatureInfoSubmitted', {
                enable_text_messages: that.enable_text_messages,
                enable_two_way_text: that.enable_two_way_text,
                enable_online_booking_text: that.enable_online_booking_text,
                enable_require_payment_for_online: that.enable_require_payment_for_online
            });
        }
    }
}
</script>