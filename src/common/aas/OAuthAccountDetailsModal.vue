<template>
    <CModal :visible="show" :size="size" :alignment="alignment" :backdrop="backdrop" @close="onPopClose"
        class="modal-dark">
        <CModalHeader>
            <CModalTitle>{{ title || "Information" }}</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CRow>
                <CCol col="12">
                    <table class="table table-customer-list table-bordered mb-0">
                        <tbody>
                            <tr>
                                <td><strong>ID:</strong> </td>
                                <td class="text-wrap break-words">{{ item._id }}</td>
                            </tr>
                            <!-- <tr>
                                <td colspan="2"><strong>Tenant Information:</strong></td>
                            </tr> -->
                            <tr>
                                <td><strong>Tenant ID:</strong> </td>
                                <td>{{ item.aas_tenant_id._id }}</td>
                            </tr>
                            <tr>
                                <td><strong>Tenant Name:</strong></td>
                                <td>{{ item.aas_tenant_id.tenant_name }}</td>
                            </tr>
                            <tr>
                                <td><strong>Tenant Description:</strong></td>
                                <td>{{ item.aas_tenant_id.tenant_description }}</td>
                            </tr>
                            <!-- <tr>
                                <td colspan="2"><strong>App Information:</strong></td>
                            </tr> -->
                            <tr>
                                <td><strong>App ID:</strong></td>
                                <td>{{ item.app_id._id }}</td>
                            </tr>
                            <tr>
                                <td><strong>App Name:</strong> </td>
                                <td>{{ item.app_id.app_name }}</td>
                            </tr>
                            <tr>
                                <td><strong>App Description:</strong> </td>
                                <td>{{ item.app_id.app_description }}</td>
                            </tr>
                            <tr>
                                <td><strong>Provider Name:</strong></td>
                                <td>{{ item.app_id.provider_name }}</td>
                            </tr>
                            <tr>
                                <td><strong>Provider Side User ID:</strong></td>
                                <td>{{ item.provider_side_user_id }}</td>
                            </tr>
                            <tr>
                                <td><strong>Provider Name:</strong> </td>
                                <td>{{ item.provider_name }}</td>
                            </tr>
                            <!-- <tr>
                                <td colspan="2"><strong>Tokens:</strong></td>
                            </tr> -->
                            <tr>
                                <td><strong>Access Token:</strong></td>
                                <td>
                                    <div class="text-wrap-custom">{{ item.access_token }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Refresh Token:</strong></td>
                                <td><div class="text-wrap-custom">{{ item.refresh_token }}</div></td>
                            </tr>
                            <tr>
                                <td><strong>Expiry Date:</strong></td>
                                <td>{{ formatDate(item.expiry_date) }}</td>
                            </tr>
                            <!-- <tr>
                                <td colspan="2"><strong>Stored Tokens JSON:</strong></td>
                            </tr> -->
                            <tr>
                                <td><strong>Access Token Expires In:</strong></td>
                                <td>{{ item.stored_tokens_json.x_refresh_token_expires_in }}</td>
                            </tr>
                            <tr>
                                <td><strong>Stored Refresh Token:</strong></td>
                                <td>{{ item.stored_tokens_json.refresh_token }}</td>
                            </tr>
                            <tr>
                                <td><strong>Stored Access Token:</strong></td>
                                <td><div class="text-wrap-custom">{{ item.stored_tokens_json.access_token }}</div></td>
                            </tr>
                            <tr>
                                <td><strong>Token Type:</strong></td>
                                <td><div class="text-wrap-custom">{{ item.stored_tokens_json.token_type }}</div></td>
                            </tr>
                            <tr>
                                <td><strong>Access Expiry:</strong></td>
                                <td>{{ formatDate(item.stored_tokens_json.access_expire_timestamp) }}</td>
                            </tr>
                            <tr>
                                <td><strong>Refresh Expiry:</strong> </td>
                                <td>{{ formatDate(item.stored_tokens_json.refresh_expire_timestamp) }}</td>
                            </tr>
                            <!-- <tr>
                                <td colspan="2"></td>
                            </tr> -->
                            <tr>
                                <td><strong>Approved:</strong></td>
                                <td>{{ item.approved !== null ? item.approved : 'N/A' }}</td>
                            </tr>
                            <tr>
                                <td><strong>Approver User Name:</strong></td>
                                <td>{{ item.approver_user_name ? item.approver_user_name : 'N/A' }}</td>
                            </tr>
                            <tr>
                                <td><strong>Approver Date:</strong></td>
                                <td>{{ item.approved_date ? formatDate(item.approved_date) : 'N/A' }}</td>
                            </tr>
                            <tr>
                                <td><strong>Approver IP Address:</strong></td>
                                <td>{{ item.approver_ip_address ? item.approver_ip_address : 'N/A' }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- {{ item }} -->
                 
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
    name: 'OAuthAccountDetailsModal',
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
        formatDate(timestamp) {
            if (!timestamp) return 'N/A';
            const date = new Date(timestamp);
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
.text-wrap-custom {
    max-width: 480px;
    word-break: break-all;
}
</style>