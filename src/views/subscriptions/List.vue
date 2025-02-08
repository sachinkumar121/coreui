<template>
    <div class="pt-2">
        <FilterSection>
            <template v-slot:search-input>
                <label class="control-label"><b>Search Name</b></label>
                <input
                    v-model="search"
                    class="form-control placeholder-no-fix"
                    @keyup="getSubscriptionsList()"
                    type="text"
                />
            </template>
            <template v-slot:actions>
                <button
                    class="btn btn-success float-end"
                    @click="$router.push('/subscriptions/create')"
                >
                    Add New Subscription
                </button>
            </template>
        </FilterSection>
        <div class="row">
            <div class="col-12">
                <div class="table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Level Name</th>
                                <th>Level</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody v-if="list.length > 0">
                            <tr v-for="(item, index) in list" :key="index">
                                <td>{{ item.level_name }}</td>
                                <td>{{ item.level }}</td>
                                <td>{{ item.description }}</td>
                                <td>
                                    <button
                                        type="button"
                                        @click="
                                            $router.push(
                                                '/subscriptions/' + item._id + '/detail',
                                            )
                                        "
                                        class="btn btn-primary btn-sm"
                                    >
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="4" class="text-center">
                                    <div class="py-5">
                                        <img
                                            src="/img/no-result.svg"
                                            alt=""
                                            class="img-empty"
                                        />
                                        <p class="h5 mt-4 d-block fw-normal">
                                            No Subscriptions Exists
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="row" v-if="false">
            <Pagination class="mt-2"
                :size="'sm'"
                :ariaLabel="'Subscription results pages'"
                :activePage.sync="page"
                :pages="pageCount"
                @update:activePage="setPage"
            />
        </div>
    </div>
</template>

<script>
import Pagination from '@/common/Pagination'
import FilterSection from '@/ui_components/FilterSection'
export default {
    name: 'Subscriptions List',
    components: {
        Pagination,
        FilterSection
    },
    data() {
        return {
            list: [], 
            page: 1,
            pageCount: 1,
            search: ''
        }
    },
    created() {
        this.getSubscriptionsList()
    },
    methods: {
        getSubscriptionsList() {
            let data = {
                page_no: this.page
            }
            if (this.search && this.search.length) {
                data.level_name = this.search
            }
            this.$schedsdk.get_subscriptions_list(data).then((result) => {
                if (result.status == 1) {
                    this.list = result.data
                    if (this.page < 2) {
                        this.pageCount = result.total_pages
                    }
                }
            })
        },
        setPage(pageNo) {
            this.page = pageNo
        },
    },
}
</script>
<style scoped>
.controls-div {
    float: left;
    width: 100%;
    border: 1px solid #d8dbe0;
    padding: 15px 4px;
    margin: 0 0 1rem 0 !important;
    padding-top: 20px;
    position: relative;
}
.settings-text {
    position: absolute;
    background: #fff;
    padding: 3px 6px;
    top: -15px;
    left: 15px;
    font-size: 16px;
    font-weight: bold;
}
</style>
