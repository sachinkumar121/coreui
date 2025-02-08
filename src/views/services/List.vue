<template>
    <div class="pt-2">
        <FilterSection>
            <template v-slot:search-input>
                <label class="control-label"><b>Search Name</b></label>
                <input
                    v-model="search"
                    class="form-control placeholder-no-fix"
                    @keyup="getServicesList()"
                    type="text"
                />
            </template>
            <template v-slot:actions>
                <button
                    class="btn btn-success float-end"
                    @click="$router.push('/services/add')"
                >
                    Add New Service
                </button>
            </template>
        </FilterSection>
        <div class="row controls-div">
            <div class="col-12">
                <button
                    class="btn btn-primary d-inline-block me-2"
                    @click="$router.push('/services/bulkadd')"
                >
                    Add Multiple Services
                </button>
                <button
                    class="btn btn-primary d-inline-block"
                    @click="$router.push('/services/bulkaddflextime')"
                >
                    Bulk Add Flex Times
                </button>
            </div>
        </div>
        <!-- <div class="row controls-div">
              &nbsp; &nbsp;
               <br>
        </div> -->
        <div class="row">
            <div class="col-12">
                <div class="table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <!-- <th>S.no</th> -->
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody v-if="list.length">
                            <tr v-for="(item, index) in list" :key="index">
                                <td>{{ item.name }}</td>
                                <td>{{ item.service_category.name }}</td>
                                <td><span v-html="getPrice(item)"></span></td>
                                <td><span v-html="getTime(item)"></span></td>
                                <td>
                                    <button
                                        class="btn btn-primary btn-sm"
                                        @click="
                                            $router.push(
                                                '/services/detail/' + item._id,
                                            )
                                        "
                                    >
                                        Edit
                                    </button>
                                    <!-- <a :href="'/services/detail/' + item._id"> Detail </a> -->
                                    &nbsp;
                                    <button
                                        class="btn btn-danger btn-sm"
                                        @click="confirmDelete(item)"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="5" class="text-center">
                                    <div class="py-5">
                                        <img src="/img/no-result.svg" alt="" class="img-empty"> 
                                        <p class="h5 mt-4 d-block fw-normal">
                                            No Services Exists
                                        </p>
                                    </div> 
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                    <Pagination class="mt-2"
                        v-if="list.length"
                        :size="'sm'"
                        :ariaLabel="'Services results pages'"
                        :activePage.sync="page"
                        :pages="pageCount"
                        @update:activePage="setPage"
                    />
          
            </div>
        </div>
    </div>
</template>

<script>
import Pagination from "@/common/Pagination";
import FilterSection from '@/ui_components/FilterSection'
export default {
    name: 'List',
    components: {Pagination, FilterSection},
    data() {
        return {
            search: '',
            list: [],
            page: 1,
            pageCount: 1,
            currency_symbol:
                this.$store.state.business_settings.business_currency_symbol,
        }
    },
    created() {
        this.getServicesList()
    },
    methods: {
        getServicesList() {
            this.$schedsdk
                .list_services({service_name: this.search, page_no: this.page})
                .then((result) => {
                    this.list = result.data
                    this.pageCount = result.total_pages
                })
        },
        getTime(item) {
            //{{item.time}} Min.
            let timetext = '' + item.time + ' mins.'
            if (
                item.enable_split_times == true ||
                (item.split_times &&
                    item.split_times.length > 0 &&
                    item.split_times[0].time > 0)
            ) {
                timetext += '<br><small>Split time enabled</small>'
            }
            if (item.buffer_time_before_next) {
                timetext +=
                    '<br><small>' +
                    '+' +
                    item.buffer_time_before_next +
                    ' mins buffer</small>'
            }

            return timetext
        },
        getPrice(item) {
            let price_text = this.currency_symbol + '' + item.price
            if (
                item.enable_flexible_time &&
                item.enable_flexible_time == true &&
                item.selectable_times.length > 0
            ) {
                price_text +=
                    '<br><small>' +
                    'Plus ' +
                    item.selectable_times.length +
                    ' more.</small>'
            }
            return price_text
        },
        setPage(pageNo) {
            // console.log('pageNo')
            // console.log(pageNo)
            this.page = pageNo
            this.getServicesList()
        },
        confirmDelete(item) {
            let confirmed = confirm(
                'Are you sure to delete this item: ' + item.name,
            )
            if (confirmed) {
                this.$schedsdk
                    .delete_service({_id: item._id})
                    .then((result) => {
                        this.getServicesList()
                    })
            }
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
    margin: 0 0 1rem 0!important;
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