<template>
    <div class="pt-2">
        <CRow>
            <CCol sm="12">
                <div class="text-right mb-3">
                    <button class="btn btn-success" @click="$router.push('/donation_campaigns/add')"> Add New Campaign </button>
                </div>
                <br>
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <!-- <th>S.no</th> -->
                            <th>Title</th>
                            <th>Allow Anonymous Donations</th>
                            <th>Default Campaign</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody  v-if="list.length">
                        <tr v-for="(item, index) in list" :key="index">
                            <td>{{item.title}} </td>
                            <td>{{item.allow_anonymous_donations ? 'Yes' : 'No'}} </td>
                            <td>{{item.is_default_campaign ? 'Yes' : 'No'}} </td>
                            <td>
                                <button type="button" 
                                    @click="$router.push('/donation_campaigns/detail/' + item._id)" 
                                    class="btn btn-primary btn-sm" >View/Edit</button> &nbsp;
                                <button type="button" @click.prevent="openDonationForm(item)" class="btn btn-primary btn-sm">Preview</button>&nbsp;
                                <button type="button" 
                                    @click="deleteCampaign(item)" 
                                    class="btn btn-danger btn-sm" >Delete</button>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="4" class="text-center">
                                <div class="py-5">
                                    <img src="/img/no-result.svg" alt="" class="img-empty"> 
                                    <p class="h5 mt-4 d-block fw-normal">
                                        No Campaign Found
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Pagination class="mt-2"
                    v-if="list.length"
                    :ariaLabel="'Donation Campaign results pages'"
                    :activePage.sync="page"
                    :pages="pageCount"
                />
            </CCol>
        </CRow>
    </div>
</template>

<script>
import Pagination from "@/common/Pagination";

export default {
    name: 'Donation Campaigns List',
    components: { Pagination },
    data() {
        return({
            list: [],
            page: 1,
            pageCount: 1,
        })
    },
    async created() {
        await this.getAllDonationCampaigns();
    },
    methods: {
        async getAllDonationCampaigns() {
            try {
            const response = await this.$schedsdk
                .get_donation_campaigns_list();
                const { data } = response;
                if (response.status) {
                    this.list = data;
                }
            } catch (error) {
                console.error(error);
            }
        },
        async deleteCampaign(item) {
            let delConfirm = confirm("Are you sure to delete this campaign?");
            if (delConfirm) {
                try {
                    const response = await this.$schedsdk
                    .delete_donation_campaign(item._id);
                    if (response.status) {
                        this.getAllDonationCampaigns();
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        },
        openDonationForm(item) {
            let accesskey = this.$store.state.business_settings.api_access_account_id;
            let routeData;
            if (!item.is_default_campaign) {
                routeData = this.$router.resolve({name: 'DonationForm', params: { accesskey: accesskey, campaign_id: item._id }});
            } else {
                routeData = this.$router.resolve({name: 'DonationForm', params: { accesskey: accesskey }});
            }
            window.open(routeData.href, '_blank');
        }
    }
}
</script>