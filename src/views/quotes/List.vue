<template>
    <div class="pt-2">
        <CRow>
            <CCol sm="12">
                <div class="text-right mb-3">
                    <button class="btn btn-success" @click="$router.push('/quotes/add')"> Add New Quote </button>
                    <button class="btn btn-success ms-2" @click="$router.push('/quote-categories/list')"> View All Quote Categories </button>
                </div>
                <section v-if="quote_categories.length">
                    <h2 class="h5">Upcoming Categories</h2>
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Start DOY</th>
                                <th>End DOY</th>
                            </tr>
                        </thead>
                        <tbody  v-if="quote_categories.length">
                            <tr v-for="(item, index) in quote_categories" :key="index">
                                <td>{{item.cmotd_category_title}} </td>
                                <td>{{item.cmotd_category_start_doy}} </td>
                                <td>{{item.cmotd_category_end_doy}} </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <br>
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <!-- <th>S.no</th> -->
                            <th style="width: 50%;">Text</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Enable</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody  v-if="list.length">
                        <tr v-for="(item, index) in list" :key="index">
                            <td>{{item.text}} </td>
                            <td>{{item.author}} </td>
                            <td>{{item.quote_category ? item.quote_category.cmotd_category_title : 'N/A' }}</td>
                            <td>{{item.enable ? 'Yes' : 'No'}} </td>
                            <td>
                                <button type="button" 
                                    @click="$router.push('/quotes/detail/' + item._id)" 
                                    class="btn btn-primary btn-sm" >View/Edit</button> &nbsp;
                                <button type="button" 
                                    @click="deleteQuote(item)" 
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
                                        No Quotes Found
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Pagination class="mt-2"
                    v-if="list.length"
                    :ariaLabel="'Quotes results pages'"
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
    name: 'Quotes List',
    components: { Pagination },
    data() {
        return({
            list: [],
            page: 1,
            pageCount: 1,
            quote_categories: []
        })
    },
    async created() {
        await this.getAllQuotes();
        await this.getUpcomingQuoteCategories();
    },
    methods: {
        async getAllQuotes() {
            try {
            const response = await this.$schedsdk
                .get_quotes_list();
                const { data } = response;
                if (response.status) {
                    this.list = data;
                }
            } catch (error) {
                console.error(error);
            }
        },
        async getUpcomingQuoteCategories() {
            try {
            const response = await this.$schedsdk
                .get_upcoming_quote_categories();
                const { data } = response;
                if (response.status) {
                    this.quote_categories = data;
                }
            } catch (error) {
                console.error(error);
            }
        },
        async deleteQuote(item) {
            let delConfirm = confirm("Are you sure to delete this quote?");
            if (delConfirm) {
                try {
                    const response = await this.$schedsdk
                    .delete_quote(item._id);
                    if (response.status) {
                        this.getAllQuotes();
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
}
</script>