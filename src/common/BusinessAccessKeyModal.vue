<template>
    <CModal
        :visible="show"
        :size="size"
        :alignment="alignment"
        :backdrop="backdrop"
        @close="onPopClose"
        class="modal-dark"
    >
        <CModalHeader>
            <CModalTitle>{{ title || "Enter business access key" }}</CModalTitle>
        </CModalHeader>
        <form
            class="add-product-category-form"
            @submit.prevent="submitAccessKey"
        >
            <CModalBody>
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label class="control-label"
                                ><b>Access Key</b></label
                            >
                            <input
                                :class="{invalid: v$.access_key.$error}"
                                class="form-control placeholder-no-fix"
                                type="text"
                                v-model="access_key"
                                @blur="v$.access_key.$touch()"
                            />
                            <p
                                class="error-msg"
                                v-if="
                                    v$.access_key.$dirty &&
                                    v$.access_key.required.$invalid
                                "
                            >This field is required.
                            </p>
                        </div>
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="onPopClose" color="danger">Close</CButton>
                <CButton type="submit" color="success">Submit</CButton>
            </CModalFooter>
        </form>
    </CModal>
</template>

<script>
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { ref } from 'vue';

export default {
    name: 'BusinessAccessKeyModal',
    watch: {
        visible: function (newVal) {
            this.show = newVal
        },
    },
    setup() {
        const access_key = ref(null);

        const rules = {
            access_key: {
                required,
            }
        };
        const v$ = useVuelidate(rules, {
            access_key
        }, { $scope: false });

        return { access_key, v$ }
    },
    data() {
        return {
            show: this.visible
        }
    },
    props: {
        visible: {
            default: false,
            type: Boolean
        },
        size: {
            type: String,
            default: undefined,
            required: false,
            validator: (value) => {
                return ['sm', 'lg', 'xl'].includes(value)
            },
        },
        alignment: {
            default: 'center',
            type: String
        },
        backdrop: {
            default: true,
        },
        title: {
            required: false,
            type: String
        }
    },
    validations() {
        return {
            access_key: { required }
        }
    },
    methods: {
        onPopClose() {
            this.show = false;
            this.$emit('modal:close');
        },
        submitAccessKey() {
            this.v$.$touch();

            if (!this.v$.$invalid) {
                this.onPopClose();
                this.$router.replace({
                    name: 'Login',
                    params: {
                        prefer_admin_or_access_key: this.access_key
                    }
                });
            }
        }
    },
}
</script>
<style lang="scss">
.modal-dark {
    .modal-content {
      background-color: var(--background-color-primary);
      box-shadow: 0px 0px 100px rgba(255, 255, 255, 0.2);
    }
  }
  :root.dark-theme {
    .custom-tab-body {
      div.form-check {
        .form-check-input {
          background-color: transparent;
          &:checked {
            border-color: var(--link-color);
            background-color: var(--link-color);
          }
        }
      }
    }
    .business-setup-modal, .modal-dark {
      .modal-title, p {
        color: var(--text-primary-color);
      }

    }
  }
</style>