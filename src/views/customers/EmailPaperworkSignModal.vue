<template>
    <div>
        <CModal
            :visible="show"
            @close="close"
        >
            <CModalHeader>
                <CModalTitle>Send Paperwork Sign Email</CModalTitle>
            </CModalHeader>
            <form
                class="add-product-category-form"
                @submit.prevent="sendNotification"
            >
                <CModalBody>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label class="control-label"
                                    ><b>Email</b></label
                                >
                                <input
                                    :class="{invalid: v$.email.$error}"
                                    class="form-control placeholder-no-fix"
                                    type="email"
                                    v-model="email"
                                    @blur="v$.email.$touch()"
                                />
                                <p
                                    class="error-msg"
                                    v-if="
                                        v$.email.$dirty &&
                                        v$.email.required.$invalid
                                    "
                                >Either email or phone number is required.
                                </p>
                                <p class="error-msg"
                                    v-if="
                                        v$.email.$dirty &&
                                        v$.email.email.$invalid
                                    "
                                > Please Enter valid email address.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label class="control-label"
                                    ><b>Phone</b></label
                                >
                                <input
                                    class="form-control placeholder-no-fix"
                                    type="text"
                                    v-model="phone"
                                    :class="{invalid: v$.phone.$error}"
                                    @blur="v$.phone.$touch()"
                                />
                                <p
                                    class="error-msg"
                                    v-if="
                                        v$.phone.$dirty &&
                                        v$.phone.required.$invalid
                                    "
                                >Either email or phone number is required.
                                </p>
                            </div>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton @click="close" color="danger">Close</CButton>
                    <CButton type="submit" color="success">Send</CButton>
                </CModalFooter>
            </form>
        </CModal>
    </div>
</template>

<script>
import { required, requiredIf, email } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

export default {
    name: "EmailPaperworkSignModal",
    watch: {
        visible: function (newVal) {
            this.show = newVal
        },
    },
    props: {
        visible: {
            default: false,
            type: Boolean
        },
        paperwork_data: {
            type: Object
        },
        user_data: {
            type: Object
        }
    },
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return {
            show: this.visible,
            email: null,
            phone: null
        }
    },
    updated() {
        this.email = this.user_data.email;
        this.phone = this.user_data.phone;
    },
    validations() {
        return {
            email: { required: requiredIf(() => !this.phone), email },
            phone: { required: requiredIf(() => !this.email) }
        }
    },
    methods: {
        close() {
            this.show = false;
            this.v$.$reset();
            this.$emit('close');
        },
        sendNotification() {
            this.v$.$touch();
            if (!this.v$.$invalid) {
                let data = {
                    email: this.email,
                    phone: this.phone,
                    paperwork_id: this.paperwork_data.paperwork_id,
                    externally_requested_sign_id: this.paperwork_data.externally_requested_sign_id,
                    customer_id: this.user_data._id
                }
                
                this.$schedsdk
                .send_email_to_sign_paperwork(data)
                .then((result) => {
                    if (result.status == 1) {
                        this.$emit('success', result.message);
                    } else {
                        this.$emit('error', result.message);
                    }
                })
                .catch((ex) => {
                    this.$emit('error', ex.data.message);
                }).finally(() => {
                    this.close();
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                })
            }
        }
    }
}
</script>