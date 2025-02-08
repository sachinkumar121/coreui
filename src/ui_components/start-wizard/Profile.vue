<template>
    <div class="card">
        <div class="card-body pt-4 px-2 px-sm-3">
            <div class="form-field-height">
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="control-label"
                                ><b>First name</b></label
                            >
                            <input
                                type="text"
                                class="form-control placeholder-no-fix"
                                v-model="first_name"
                                @blur="v$.first_name.$touch()"
                                :class="{
                                    invalid: v$.first_name.$error,
                                }"
                            />
                            <p class="error-msg"
                                v-if="
                                    v$.first_name.$dirty &&
                                    v$.first_name.$error
                                "
                            >{{ v$.first_name?.$errors[0]?.$message }}</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="control-label"
                                ><b>Last name</b></label
                            >
                            <input
                                type="text"
                                class="form-control placeholder-no-fix"
                                v-model="last_name"
                                @blur="v$.last_name.$touch()"
                                :class="{
                                    invalid: v$.last_name.$error,
                                }"
                            />
                            <p class="error-msg"
                                v-if="
                                    v$.last_name.$dirty &&
                                    v$.last_name.$error
                                "
                            >{{ v$.last_name?.$errors[0]?.$message }}</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="control-label"><b>Email</b></label>
                            <input
                                type="email"
                                class="form-control placeholder-no-fix"
                                v-model="email"
                                @blur="v$.email.$touch()"
                                :class="{
                                    invalid: v$.email.$error,
                                }"
                            />
                            <p
                                class="error-msg"
                                v-if="
                                    v$.email.$dirty &&
                                    v$.email.required.$invalid
                                "
                            >
                                Either email or phone number is required.
                            </p>
                            <p
                                class="error-msg"
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
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="control-label"><b>Phone</b></label>
                            <input
                                type="text"
                                class="form-control placeholder-no-fix"
                                v-model="phone"
                                @blur="v$.phone.$touch()"
                                :class="{
                                    invalid: v$.phone.$error,
                                }"
                            />
                            <p
                                class="error-msg"
                                v-if="
                                    v$.phone.$dirty &&
                                    v$.phone.required.$invalid
                                "
                            >
                                Either email or phone number is required.
                            </p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="control-label">
                                <b>New PIN (4 Digits)</b>
                                <Icon
                                    icon="tabler:info-circle"
                                    class="theme-color cursor-pointer"
                                    style="top: 0"
                                    :width="24"
                                    :height="24"
                                    @click="
                                        () => {
                                            visiblePinHelpModal = true
                                        }
                                    "
                                />
                            </label>
                            <input
                                v-model="pin"
                                type="text"
                                class="form-control placeholder-no-fix"
                                :class="{
                                    invalid: v$.pin.$error,
                                }"
                                @blur="v$.pin.$touch()"
                            />
                            <p class="error-msg"
                                v-if="
                                    v$.pin.$dirty &&
                                    v$.pin.$error
                                "
                            >{{ v$.pin?.$errors[0]?.$message }}</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="control-label mb-4 d-block"></label>
                            <label class="control-label"
                                ><b>Your current role: Owner</b></label
                            >
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 d-flex justify-content-end">
                    <button
                        class="btn btn-success"
                        type="button"
                        @click="submit"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
        <InfoHelperModal 
            :visible="visiblePinHelpModal"
            title="Help PIN"
            :body-lines='["PIN is Personal Identity Number and allows quick sign in on app. With a PIN you can skip using email and password, in most cases. On new app installs/update, you will need to use full email password."]'
            @modal:close="visiblePinHelpModal = false"
        />
    </div>
</template>

<script>
import { Icon } from '@/common/Icon';
import { required, email, requiredIf, minLength, maxLength, numeric } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import InfoHelperModal from '@/common/InfoHelperModal.vue';

export default {
    name: 'StartWizardProfileTab',
    emits: ['profileInfoSubmitted'],
    components: {
        Icon,
        InfoHelperModal
    },
    setup: () => ({v$: useVuelidate()}),
    props: {
        initialData: {
            required: true,
            type: Object,
            default: {
                first_name: '',
                last_name: '',
                email: '',
                phone: ''
            }
        }
    },
    validations() {
        return {
            first_name: { required, minLength: minLength(3) },
            last_name: { required, minLength: minLength(3) },
            email: { required: requiredIf(() => !this.phone), email },
            phone: { required: requiredIf(() => !this.email) },
            pin: {
                numeric, minLength: minLength(4), maxLength: maxLength(4)
            }
        }
    },
    data() {
        return {
            first_name: this.initialData.first_name,
            last_name: this.initialData.last_name,
            email: this.initialData.email,
            phone: this.initialData.phone,
            pin: '',
            visiblePinHelpModal: false,
        }
    },
    methods: {
        async submit(e) {
            e.preventDefault();
            this.v$.$touch();
            const isFormCorrect = await this.v$.$validate();
            if (isFormCorrect) {
                this.$emit('profileInfoSubmitted', {
                    first_name: this.first_name,
                    last_name: this.last_name,
                    email: this.email,
                    phone: this.phone,
                    pin: this.pin
                });
            }
        }
    }
}
</script>
