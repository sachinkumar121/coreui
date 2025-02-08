<template>
    <CModal :visible="show" :size="size" :alignment="alignment" :backdrop="backdrop" @close="onPopClose"
        class="modal-dark">
        <CModalHeader>
            <CModalTitle>{{ title || "Information" }}</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CRow>
                <CCol col="12">
                    <!-- {{ item }} -->
                    <table class="table table-customer-list table-bordered mb-0">
                        <tbody>
                            <!-- <tr>
                                <td><strong>ID:</strong></td>
                                <td class="text-wrap break-words">{{ item._id }}</td>
                            </tr> -->
                            <tr>
                                <td><strong>Tenant ID:</strong></td>
                                <td class="text-wrap break-words">{{ item.aas_tenant_id._id }}</td>
                            </tr>
                            <tr>
                                <td><strong>Tenant Name:</strong> </td>
                                <td class="text-wrap break-words">{{ item.aas_tenant_id.tenant_name }}</td>
                            </tr>
                            <tr>
                                <td><strong>Tenant Description:</strong></td>
                                <td class="text-wrap break-words">{{ item.aas_tenant_id.tenant_description }}</td>
                            </tr>
                            
                            <tr>
                                <td><strong>Credential Tag:</strong></td>
                                <td class="text-wrap break-words">{{ item.credential_tag }}</td>
                            </tr>
                            
                            <tr>
                                <td><strong>App ID:</strong></td>
                                <td class="text-wrap break-words">{{ item.app_id._id }}</td>
                            </tr>
                            <tr>
                                <td><strong>App Name:</strong></td>
                                <td class="text-wrap break-words">{{ item.app_id.app_name }}</td>
                            </tr>
                            <tr>
                                <td><strong>App Description:</strong></td>
                                <td class="text-wrap break-words">{{ item.app_id.app_description }}</td>
                            </tr>
                            <tr>
                                <td><strong>Provider Name:</strong></td>
                                <td class="text-wrap break-words">{{ item.app_id.provider_name }}</td>
                            </tr>
                            <tr>
                                <td><strong>Provider Client ID:</strong></td>
                                <td class="text-wrap break-words">{{ item.provider_side_client_id }}</td>
                            </tr>
                            <tr>
                                <td><strong>Provider Client Secret:</strong></td>
                                <td class="text-wrap break-words">{{ item.provider_side_client_secret }}</td>
                            </tr>
                            <tr>
                                <td><strong>Provider Redirect URL:</strong></td>
                                <td class="text-wrap break-words">{{ item.provider_side_1st_redirect_url }}</td>
                            </tr>
                            
                            <tr>
                                <td><strong>App Post Auth Redirect URL:</strong></td>
                                <td class="text-wrap break-words">{{ item.app_side_post_auth_app_redirect_url }}</td>
                            </tr>
                            <tr>
                                <td><strong>Auth URI:</strong></td>
                                <td class="text-wrap break-words">{{ item.auth_uri }}</td>
                            </tr>
                            <tr>
                                <td><strong>Token URI:</strong> </td>
                                <td class="text-wrap break-words">{{ item.token_uri }}</td>
                            </tr>
                            <tr>
                                <td><strong>Provider Name:</strong></td>
                                <td class="text-wrap break-words">{{ item.provider_name }}</td>
                            </tr>
                            <tr>
                                <td><strong>Created At:</strong></td>
                                <td class="text-wrap break-words">{{ formatDate(item.created_at) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </CCol>
            </CRow>
        </CModalBody>
        <CModalFooter>
            <CButton @click="onPopClose" color="danger">Close</CButton>
        </CModalFooter>
    </CModal>
</template>

<script>
export default {
    name: 'ProviderCredentialDetailsModal',
    watch: {
        visible: function (newVal) {
            this.show = newVal;
        }
    },
    data() {
        return {
            show: this.visible,
        }
    },
    props: {
        item: {
            required: true,
        },
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
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }
    }
}
</script>
<style lang="scss">
.modal-dark {
    .modal-content {
        background-color: var(--background-color-primary);
        box-shadow: 0px 0px 100px rgba(255, 255, 255, 0.2);
    }
}
td:first-child {
    width: 35%;
}
.break-words {
    word-break: break-word;
}
</style>