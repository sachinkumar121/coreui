<script setup>
    import { ref, onMounted } from 'vue';
    import { inject } from 'vue';
    import { useRoute } from "vue-router";
    import Alerts from '@/views/Alerts'
    import ProviderCredentialDetailsModal from '@/common/aas/ProviderCredentialDetailsModal.vue';

    const $schedsdk = inject("$schedsdk");
    const route = useRoute()
    const provider_credentials = ref([]);
    const show_provider_credential_modal = ref(false);
    const processed_item = ref(null);
    const alert = ref(false);
    const show = ref(0);
    const alertData = ref({
        message: '',
        type: ''
    });
    const visibleClientIdModal = ref(false)
    onMounted(async () => {
        await getAndSetProviderCredentials()
    });
    const getAndSetProviderCredentials = async () => {
        const res = await $schedsdk.get_aas_provider_credentials_list();
        provider_credentials.value = res.data;
    }

    const deleteCredentials = async (item) => {
        let delConfirm = confirm("Are you sure to delete this credentials?");
        if (delConfirm) {
            try {
                const response = await $schedsdk
                .delete_aas_provider_credentials_list(item._id);
                if (response.status) {
                    await getAndSetProviderCredentials();
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

    const viewCredentials = async (item) => {
        processed_item.value = item;
        show_provider_credential_modal.value = true;
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
                            <th>Client id</th>
                            <!-- <th>Client secret</th>
                            <th>Redirect URL</th>
                            <th>Auth URI</th>
                            <th>Token URI</th>
                            -->
                            <th>Action</th> 
                        </tr>
                    </thead>
                    <tbody  v-if="provider_credentials.length">
                        <tr v-for="(item, index) in provider_credentials" :key="index">
                            <td>{{item.provider_name}} </td> 
                            <td>
                                <div class="provider-id cursor-pointer" @click="() => { processed_item = item; visibleClientIdModal = true }">
                                    {{item.provider_side_client_id}}
                                </div>
                            </td>
                            <!--<td>{{item.provider_side_client_secret}} </td>
                            <td>{{item.provider_side_1st_redirect_url}}</td>
                            <td>{{item.auth_uri}} </td>
                            <td>{{item.token_uri}} </td>-->
                            <td>
                                <button type="button" 
                                    @click="viewCredentials(item)" 
                                    class="btn btn-primary btn-sm" >View</button>
                                &nbsp;
                                <button type="button" 
                                    @click="deleteCredentials(item)" 
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
        <ProviderCredentialDetailsModal 
            :item="processed_item"
            :visible="show_provider_credential_modal"
            @modal:close="show_provider_credential_modal = false"
        />
        <CModal 
            :visible="visibleClientIdModal"
            @close="() => { visibleClientIdModal = false }"
            aria-labelledby="modalLabel"
        >
            <CModalHeader class="border-0">Client id</CModalHeader>
            <CModalBody class="pt-0">
                <!-- <p class="mb-2 h6">Client id</p> -->
                <p class="p-2 token-bg rounded-2">{{processed_item.provider_side_client_id}}</p>
            </CModalBody>
            <CModalFooter>
            <CButton color="secondary" @click="() => { visibleClientIdModal = false }">
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
    .token-bg {
        border: 1px dashed rgba(109, 87, 228, 1);
        background: rgba(109, 87, 228, .2);
        border-radius: 4px;
    }
</style>