<template>
    <CModal :visible="show" :size="size" :alignment="alignment" :backdrop="backdrop" @close="onPopClose"
        class="modal-dark">
        <CModalHeader>
            <CModalTitle>{{ title || "Change Server" }}</CModalTitle>
        </CModalHeader>
        <form class="change-server-form" @submit.prevent="changeServer">
            <CModalBody>
                <CRow class="my-3">
                    <CCol col="12" class="text-center">
                        <span class="fw-medium">Current Server URL:</span><span 
                            class="api-span">{{ api_server }}</span>
                    </CCol>
                </CRow>

                <CRow>
                    <CCol col="12" class="text-center">
                        <ServerSelector 
                            @url-change="(url) => api_server = url" 
                        />
                    </CCol>
                </CRow>
            </CModalBody>
            <CModalFooter>
                <CButton @click="onPopClose" color="danger">Close</CButton>
                <CButton type="submit" color="success">Save</CButton>
            </CModalFooter>
        </form>
    </CModal>
</template>

<script>
import appHelper from '@/helpers/app_helper';
import ServerSelector from '@/ui_components/ServerSelector.vue';
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { ref } from 'vue';

export default {
    name: 'ServerSelectionModal',
    components: {
        ServerSelector
    },
    watch: {
        visible: function (newVal) {
            this.show = newVal;
            this.api_server = this.$store.state.skysched_global_api_base_url
        },
    },
    data() {
        return {
            show: this.visible,
            api_server: this.$store.state.skysched_global_api_base_url
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
    methods: {
        onPopClose() {
            this.show = false;
            this.$emit('modal:close');
        },
        changeServer() {
            appHelper.updateApiServerUrl(this.$schedsdk, this.api_server);
            this.onPopClose();
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

    .business-setup-modal,
    .modal-dark {

        .modal-title,
        p {
            color: var(--text-primary-color);
        }

    }
}
.api-span {
    background: var(--border-color-d9);
    padding: 4px 7px;
    border-radius: 5px;
}
.vs__selected-options .vs__selected {
    padding: 4px 11px;
}
</style>