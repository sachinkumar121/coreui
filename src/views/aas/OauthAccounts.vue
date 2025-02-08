<script setup>
    import { ref, onMounted } from 'vue';
    import { inject } from 'vue';
    import { useRoute } from "vue-router";
    import Alerts from '@/views/Alerts'
    import OAuthAccountDetailsModal from '@/common/aas/OAuthAccountDetailsModal.vue';

    const $schedsdk = inject("$schedsdk");
    const route = useRoute()
    const oauth_accounts = ref([]);
    const show_oauth_account_modal = ref(false);
    const processed_item = ref(null);
    const alert = ref(false);
    const show = ref(0);
    const alertData = ref({
        message: '',
        type: ''
    });
    const visibleAccessTokenModal = ref(false);
    const visibleRefreshTokenModal = ref(false)
    onMounted(async () => {
        await getAndSetAccounts();
    });

    const getAndSetAccounts = async () => {
        const res = await $schedsdk.get_aas_oauth_accounts_list();
        oauth_accounts.value = res.data;
    }

    const deleteAccount = async (item) => {
        let delConfirm = confirm("Are you sure to delete this account?");
        if (delConfirm) {
            try {
                const response = await $schedsdk
                .delete_aas_oauth_accounts_list(item._id);
                if (response.status) {
                    await getAndSetAccounts();
                } else {
                    alert.value = true;
                    show.value = 1;
                    alertData.value = {
                        type: 'danger',
                        message: response.message
                    }
                }
            } catch (error) {
                alert.value = true;
                show.value = 1;
                alertData.value = {
                    type: 'danger',
                    message: error.message
                }
            }
        }
    }

    const viewOAuthAccount = async (item) => {
        processed_item.value = item;
        show_oauth_account_modal.value = true;
    }
</script>

<template>
    <div class="pt-2">
        <Alerts 
            :alertData="alertData" 
            :show="show"
            @alertClosed="show = 0"
            v-if="alert" 
        />
        <CRow>
            <CCol sm="12">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Provider Name</th>
                            <th>Access Token</th>
                            <th>Refresh Token</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody  v-if="oauth_accounts.length">
                        <tr v-for="(item, index) in oauth_accounts" :key="index">
                            <td>{{item.provider_name}}</td>
                            <td>
                                <div class="provider-id token-id cursor-pointer" @click="() => { processed_item = item; visibleAccessTokenModal = true }">
                                {{item.access_token}}</div>
                            </td>
                            <td><div class="provider-id refresh-id cursor-pointer" @click="() => { processed_item = item; visibleRefreshTokenModal = true }">{{item.refresh_token}}</div></td>
                            <td>
                                <button type="button" 
                                    @click="viewOAuthAccount(item)" 
                                    class="btn btn-success btn-sm" >View</button>
                                &nbsp;
                                <button type="button" 
                                    @click="deleteAccount(item)" 
                                    class="btn btn-danger btn-sm" >Delete</button>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="10" class="text-center">
                                <div class="py-5">
                                    <img src="/img/no-result.svg" alt="" class="img-empty"> 
                                    <p class="h5 mt-4 d-block fw-normal">
                                        No Data Found
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </CCol>
        </CRow>
        <OAuthAccountDetailsModal 
            :size="'lg'" 
            :item="processed_item"
            :visible="show_oauth_account_modal"
            @modal:close="show_oauth_account_modal = false"
        />
        <CModal 
            :visible="visibleAccessTokenModal"
            @close="() => { visibleAccessTokenModal = false }"
            aria-labelledby="modalLabel"
        >
            <CModalHeader class="border-0">Access Token</CModalHeader>
            <CModalBody class="pt-0">
                <p class="p-2 token-bg rounded-2 mb-0">{{processed_item.access_token}}</p>
            </CModalBody>
            <CModalFooter>
            <CButton color="secondary" @click="() => { visibleAccessTokenModal = false }">
                Close
            </CButton>
            </CModalFooter>
        </CModal>
        <CModal 
            :visible="visibleRefreshTokenModal"
            @close="() => { visibleRefreshTokenModal = false }"
            aria-labelledby="modalLabel"
        >
            <CModalHeader class="border-0">Refresh Token</CModalHeader>
            <CModalBody class="pt-0">
                <p class="p-2 refresh-bg rounded-2 mb-0">{{processed_item.refresh_token}}</p>
            </CModalBody>
            <CModalFooter>
            <CButton color="secondary" @click="() => { visibleRefreshTokenModal = false }">
                Close
            </CButton>
            </CModalFooter>
        </CModal>
    </div>
</template>
<style scoped>
    .provider-id {
        border: 1px dashed rgba(109, 87, 228, 1);
        background: rgba(109, 87, 228, .2);
        padding: 3px 5px;
        max-width: 260px;
        width: 100%;
        border-radius: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .refresh-id, .refresh-bg {
        border: 1px dashed rgb(110, 158, 248);
        background: rgba(193, 154, 255, 0.2);
    }
    .token-id, .token-bg {
        border: 1px dashed rgb(174, 228, 87);
        background: rgba(211, 241, 163, 0.2);
    }
    .token-bg, .refresh-bg {
        border-radius: 4px;
    }
    .token-bg {
        word-break: break-all;
    }
</style>