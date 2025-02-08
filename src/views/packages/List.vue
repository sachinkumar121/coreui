<template>
    <div class="pt-2">
        <FilterSection>
            <template v-slot:search-input>
                <label class="control-label"><b>Search Name</b></label>
                <input
                    v-model="search"
                    class="form-control placeholder-no-fix"
                    @keyup="getPackagesList()"
                    type="text"
                />
            </template>
            <template v-slot:actions>
                <button
                    class="btn btn-success float-end"
                    @click="$router.push('/packages/add')"
                >
                    Add New Package
                </button>
            </template>
        </FilterSection>
        <div class="row">
            <div class="col-12">
                <div class="table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <!-- <th>S.no</th> -->
                                <th>Name</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Value (Discount)</th>
                                <th>Enabled Online?</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody v-if="list.length">
                            <tr v-for="(item, index) in list" :key="index">
                                <td>{{ item.package_name }}<br><small>ID: {{ item.package_code }}</small></td>
                                <td>{{ getPackageType(item) }}</td>
                                <td>{{ getPackagePrice(item) }}</td>
                                <td>{{ getPackagePriceValue(item) }}</td>
                                <td>{{ item.allow_online_sales?"Yes":"No"}}</td>
                                <td>
                                    <button
                                        type="button"
                                        @click="
                                            $router.push(
                                                '/packages/detail/' + item._id,
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
                                <td colspan="6" class="text-center">
                                    <div class="py-5">
                                        <img
                                            src="/img/no-result.svg"
                                            alt=""
                                            class="img-empty"
                                        />
                                        <p class="h5 mt-4 d-block fw-normal">
                                            No Booking Exists
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="row">
            <Pagination class="mt-2"
                v-if="list.length"
                :size="'sm'"
                :ariaLabel="'Packages results pages'"
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
    name: 'List',
    components: {Pagination, FilterSection},
    data() {
        return {list: [], 
                page: 1, pageCount: 1, search: '',
                currency_symbol: this.$store.state.business_settings.business_currency_symbol,
            }
    },
    created() {
        this.getPackagesList()
    },
    methods: {
        getPackagesList() {
            let data = {page_no: this.page}
            if (this.search && this.search.length) {
                data.package_name = this.search
            }
            this.$schedsdk.get_packages_list(data).then((result) => {
                if (result.status == 1) {
                    this.list = result.data
                    if (this.page < 2) {
                        this.pageCount = result.total_pages
                    }
                }
            })
        },
        getPackageType(item)
        {
            let can_recur = ""
            let package_typestr = "Package"
            switch(item.package_type)
            {
                case 1:  package_typestr = "Series"; break;
                case 2:  package_typestr = "Single use package"; break;
                case 3:  package_typestr = "Voucher"; break;
                case 4:  package_typestr = "Gift card"; break;
                default: package_typestr = "Other"; break;

            }
            if (item.is_package_recurr_allowed)
            {
                package_typestr += " (can recur)"
            }
            return package_typestr
        },
        getPackagePrice(item)
        {
            let pp= item.package_purchase_price>0?item.package_purchase_price:0.001;
            
            return this.currency_symbol + ""+ pp
        },
        getPackagePriceValue(item)
        {
            let pp= item.package_purchase_price>0?item.package_purchase_price:0.001;
            let pv= item.package_value;
            let disc = Math.round(((pv-pp)/pv) * 100)
            return  this.currency_symbol + "" +item.package_value +" ("+disc+"%)"
        },
        setPage(pageNo) {
            // console.log('pageNo')
            // console.log(pageNo)
            this.page = pageNo
            this.getPackagesList()
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
