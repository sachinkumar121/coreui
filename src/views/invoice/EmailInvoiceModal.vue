<template>
    <div>
        <CModal
            :visible="show"
            @close="close"
        >
            <CModalHeader>
                <CModalTitle>Send Invoice Email</CModalTitle>
            </CModalHeader>
            <form
                class="add-product-category-form"
                @submit.prevent="sendInvoiceEmail"
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
                                >The email is required.
                                </p>
                                <p class="error-msg"
                                    v-if="
                                        v$.email.$dirty &&
                                        v$.email.email.$invalid
                                    "
                                > Please enter valid email address.
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
                                    :disabled="!send_via_text"
                                    :readOnly="!send_via_text"
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
                                >The phone number is required.
                                </p>
                                <p
                                    class="error-msg"
                                    v-if="
                                        v$.phone.$dirty &&
                                        v$.phone.mustBeValidPhoneNumber.$invalid
                                    "
                                >The phone number is invalid.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="md-checkbox has-success">
                                <input
                                    id="attach_invoice_as_pdf"
                                    type="checkbox"
                                    v-model="attach_invoice_as_pdf"
                                    :checked="attach_invoice_as_pdf"
                                    class="md-check form-check-input"
                                />
                                <label class="ms-2 cursor-pointer" for="attach_invoice_as_pdf"><b>Attach PDF copy to the email</b> </label>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="row">
                        <div class="col-md-12">
                            <div class="md-checkbox has-success">
                                <input
                                    id="hide_payment_info"
                                    type="checkbox"
                                    v-model="hide_payment_info"
                                    :checked="hide_payment_info"
                                    class="md-check form-check-input"
                                />
                                <label class="ms-2 cursor-pointer" for="hide_payment_info"><b>Hide payment info</b> </label>
                            </div>
                        </div>
                    </div> -->
                    <div class="row">
                        <div class="col-md-12">
                            <div class="md-checkbox has-success">
                                <input
                                    id="send_via_text"
                                    type="checkbox"
                                    v-model="send_via_text"
                                    :checked="send_via_text"
                                    class="md-check form-check-input"
                                />
                                <label class="ms-2 cursor-pointer" for="send_via_text"><b>Send Via text also</b> </label>
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
import { required, requiredIf, email, helpers } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
const validPhoneNumberRegex = new RegExp('^[\s()+-]*([0-9][\s()+-]*){6,20}$');

const mustBeValidPhoneNumber = (value, siblings, vm) => {
    if (vm.send_via_text && value) {
        return validPhoneNumberRegex.test(value);
    }
    return true;
}

export default {
    name: "EmailInvoiceModal",
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
        invoice_data: {
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
            phone: null,
            invoice_id: null,
            invoice_number: null,
            purchase_order_id: null,
            purchase_order_type: "",
            attach_invoice_as_pdf: false,
            hide_payment_info: true,
            send_via_text: false
        }
    },
    updated() {
        this.email = this.user_data.email;
        this.phone = this.user_data.phone;
        this.invoice_id = this.invoice_data.invoice_id;
        this.invoice_number =  this.invoice_data.invoice_number;
        this.purchase_order_id = this.invoice_data.purchase_order_id;
        this.purchase_order_type = this.invoice_data.purchase_order_type;
    },
    validations() {
        return {
            email: { required: requiredIf(() => !this.send_via_text), email },
            phone: { required: requiredIf(() => this.send_via_text), mustBeValidPhoneNumber }
        }
    },
    methods: {
        close() {
            this.show = false;
            this.attach_invoice_as_pdf = false;
            this.hide_payment_info = true;
            this.send_via_text = false;
            this.v$.$reset();
            this.$emit('close');
        },
        sendInvoiceEmail() {
            this.v$.$touch();
            let data = {
                email: this.email,
                phone: this.phone,
                invoice_number: this.invoice_number,
                purchase_order_id: this.purchase_order_id,
                purchase_order_type: this.purchase_order_type,
                attach_invoice_as_pdf: this.attach_invoice_as_pdf,
                hide_payment_info: this.hide_payment_info,
                send_via_text: this.send_via_text
            }
            if(!this.v$.$invalid) {
                this.$schedsdk
                .send_po_for_pay_email(data)
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