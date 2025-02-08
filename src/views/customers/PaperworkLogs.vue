<template>
    <div>
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
                            <th>Message</th>
                            <th>Operation</th>
                            <th>Event time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="logs.length > 0">
                            <tr v-for="(item, index) in logs" :key="index">
                                <td>{{ item.log_message }}</td>
                                <td>{{ item.object_operation }}</td>
                                <td>{{ getFormattedDate(item.created_at) }}</td>
                            </tr>
                        </template>
                         <tr v-else><td colspan="3" class="text-center">No data found.</td></tr>
                    </tbody>
                </table>
                <Pagination class="mt-2"
                    v-if="logs.length && pageCount > 1"
                    :ariaLabel="'Paperwork logs results pages'"
                    :activePage.sync="page"
                    :pages="pageCount"
                    @update:activePage="setPage"
                />
            </CCol>
        </CRow>
    </div>
</template>

<script>
import Pagination from "@/common/Pagination";
import moment from 'moment-timezone'
import Alerts from '../Alerts'
import utils_lib from '../../helpers/utils_lib';

export default {
    name: 'Customer Paperwork Logs',
    components: { Pagination, Alerts },
    data() {
        return({
            logs: [],
            signed_request_law_id: null,
            alert: false,
            show: 0,
            alertData: {
                message: '',
                type: ''
            },
            page: 1,
            pageCount: 1,
        })
    },
    created(){
        this.getPaperworkLogs();
    },
    methods: {
        getFormattedDate: function (timestamp) {
            return utils_lib.getFormattedDate(timestamp)
        },
        async getPaperworkLogs() {
           
            try {
                const query = 
                {
                    signing_reqid: null,
                    customer_id: null,
                    paper_work_id: null,
                    page_number: this.page
                }
                
                if(this.$route.params.signed_request_law_id)
                {
                    this.signed_request_law_id = this.$route.params.signed_request_law_id;
                    query.signing_reqid = this.$route.params.signed_request_law_id;
                }
                if(this.$route.params.customer_id)
                {
                    query.customer_id = this.$route.params.customer_id;
                }
                if(this.$route.params.paper_work_id)
                {
                    query.paper_work_id = this.$route.params.paper_work_id;
                }
                
                const logResponse = await this.$schedsdk.get_paperwork_log_entries(query);
                this.logs = logResponse.data;
                this.pageCount = logResponse.total_pages

            } catch (error) {
                console.log(error)
                this.alertData = {
                    message: error.data.message || error.message || error,
                    type: 'danger'
                }
                this.alert = true;
                this.show = 4;
            }
        },
        async setPage(pageNo) {
            this.page = pageNo;
            await this.getPaperworkLogs();
        }
    
    }
    
}
</script>
