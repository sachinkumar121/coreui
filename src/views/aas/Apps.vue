<script setup>
    import { ref, onMounted } from 'vue';
    import { inject } from 'vue';
    import { useRoute } from "vue-router";
    const $schedsdk = inject("$schedsdk");
    const route = useRoute()
    const apps = ref([]);

    onMounted(async () => {
        const res = await $schedsdk.get_aas_apps_list();
        apps.value = res.data;
    });
</script>

<template>
    <div class="pt-2">
        <CRow>
            <CCol sm="12">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Provider Name</th>
                            <th>Tenant Name</th>
                        </tr>
                    </thead>
                    <tbody  v-if="apps.length">
                        <tr v-for="(item, index) in apps" :key="index">
                            <td>{{item.app_name}} </td>
                            <td>{{item.app_description}} </td>
                            <td>{{item.provider_name}}</td>
                            <td>{{item.aas_tenant_id.tenant_name}} </td>
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
    </div>
</template>