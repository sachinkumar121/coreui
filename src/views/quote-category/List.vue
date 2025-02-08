<template>
    <div class="pt-2">
        <CRow>
            <CCol sm="12">
                <div class="text-right">
                    <button class="btn btn-success" @click="$router.push('/quote-categories/add')"> Add New Quote Category </button>
                    <button class="btn btn-success ms-2" @click="$router.push('/quotes/list')"> View All Quotes </button>
                </div>
                <br>
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Start DOY</th>
                            <th>End DOY</th>
                            <th>Enable</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody  v-if="list.length">
                        <tr v-for="(item, index) in list" :key="index">
                            <td>{{item.cmotd_category_title}} </td>
                            <td>{{item.cmotd_category_start_doy}} </td>
                            <td>{{item.cmotd_category_end_doy}} </td>
                            <td>{{item.cmotd_category_enabled ? 'Yes' : 'No'}} </td>
                            <td>
                                <button type="button" 
                                    @click="$router.push('/quote-categories/detail/' + item._id)" 
                                    class="btn btn-primary btn-sm" >View/Edit</button> &nbsp;
                                <button type="button" 
                                    @click="deleteQuoteCategory(item)" 
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
                                        No Quote Category Found
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Pagination class="mt-2"
                    v-if="list.length"
                    :ariaLabel="'Quote category results pages'"
                    :activePage.sync="page"
                    :pages="pageCount"
                    />
            </CCol>
        </CRow>
    </div>
</template>

<script>
import moment from 'moment'
import Pagination from "@/common/Pagination";

export default {
    name: 'Quote Category List',
    components: { Pagination },
    data() {
        return({
            list: [],
            page: 1,
            pageCount: 1
        })
    },
    created() {
        this.getAllQuoteCategories();
    },
    methods: {
        convertDoyToDateFormat(dayOfYear, format = "MMMM D") {
            return moment().year(moment().year()).dayOfYear(dayOfYear).set({hour:0,minute:0,second:0,millisecond:0}).format(format);
        },
        async getAllQuoteCategories() {
            try {
            const response = await this.$schedsdk
                .get_quote_category_list();
                const { data } = response;
                if (response.status) {
                    this.list = data;
                    this.list.map(c => {
                        c.cmotd_category_start_doy = this.convertDoyToDateFormat(c.cmotd_category_start_doy);
                        c.cmotd_category_end_doy = this.convertDoyToDateFormat(c.cmotd_category_end_doy);
                        return c;
                    });
                }
            } catch (error) {
                console.error(error);
            }
        },
        async deleteQuoteCategory(item) {
            let delConfirm = confirm("Are you sure to delete this quote category?");
            if (delConfirm) {
                try {
                    const response = await this.$schedsdk
                    .delete_quote_category(item._id);
                    if (response.status) {
                        this.getAllQuoteCategories();
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
}
</script>