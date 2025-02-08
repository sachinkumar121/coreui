<template>
    <div class="pt-2">
        <FilterSection>
            <template v-slot:search-input>
                <label class="control-label"><b>Search Name</b></label>
                <input
                    v-model="search"
                    class="form-control placeholder-no-fix"
                    @keyup="getProductsList()"
                    type="text"
                />
            </template>
            <template v-slot:actions>
                <button
                    class="btn btn-success float-end"
                    @click="$router.push('/products/add')"
                >
                    Add New Product
                </button>
            </template>
        </FilterSection>
        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <!-- <th>S.no</th> -->
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th v-if="isInventoryEnabled">QoH</th>
                        <th v-if="isInventoryEnabled">Cost</th>
                        <th v-if="isInventoryEnabled">Margin</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody v-if="list.length">
                    <tr v-for="item in list" :key="item._id">
                        <td>{{ item.name }}</td>
                        <td>{{ item.product_category.name }}</td>
                        <td>{{ currency_symbol }}{{ item.price }}</td>
                        <td v-if="isInventoryEnabled">
                            {{ item.inventory_data?.est_qoh }}
                        </td>
                        <td v-if="isInventoryEnabled">
                            {{ currency_symbol
                            }}{{
                                item.inventory_data?.est_stock_cost_price || 0
                            }}
                        </td>
                        <td v-if="isInventoryEnabled">
                            {{
                                getProfitMargin(
                                    item.inventory_data?.est_stock_cost_price ||
                                        0,
                                    item.price,
                                )
                            }}%
                        </td>
                        <!-- <td>{{item.payout}} </td>
                  <td v-if="item.is_active"> Yes </td>
                  <td v-else> No </td>-->
                  <td>
                    <button class="btn btn-primary btn-sm" @click="$router.push('/products/detail/'+ item._id)">Edit</button>
                    &nbsp;
                    <button v-if="isInventoryEnabled && !isUseSimplifiedInventory" class="btn btn-primary btn-sm" @click="$router.push('/products/'+ item._id + '/inventory-data')">Inventory Data</button>
                    &nbsp;
                    <button v-if="isInventoryEnabled && !isUseSimplifiedInventory" class="btn btn-primary btn-sm" @click="$router.push('/products/inventory_transactions/'+ item._id)">Inventory Transactions</button>
                    &nbsp;
                    <button class="btn btn-danger btn-sm" @click="confirmDelete(item)">Delete</button>

                  </td>
              </tr>
          </tbody>
           <tbody  v-else>
               <tr><td colspan="10" class="text-center">No Products found</td></tr>
           </tbody>
      </table>
      <Pagination
            v-if="list.length"
            :size="'sm'"
            :ariaLabel="'Products results pages'"
            :activePage.sync="page"
            :pages="pageCount"
            @update:activePage="setPage"
        />
    </div>
    </div>
</template>

<script>
import Pagination from '@/common/Pagination'
import utils_lib from '../../helpers/utils_lib'
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
        this.getProductsList()
    },
    computed: {
        isInventoryEnabled() {
            return this.$store.state.business_settings.inventory_enabled
        },
        isUseSimplifiedInventory() {
            return this.$store.state.business_settings
                .use_simplified_inventory === undefined
                ? true
                : this.$store.state.business_settings.use_simplified_inventory
        },
    },
    methods: {
        getProfitMargin(cp, sp) {
            let profit = sp - cp
            if (utils_lib.isNumeric(profit)) {
                return utils_lib.roundto2digits(profit)
            } else {
                return 0
            }
        },
        getProductsList() {
            this.$schedsdk
                .get_products_list({
                    product_name: this.search,
                    page_no: this.page,
                })
                .then((result) => {
                    this.list = result.data
                    this.pageCount = result.total_pages
                })
        },
        confirmDelete(item) {
            //TEst ONLY: this.$schedsdk.set_default_inventory_data();
            let confirmed = confirm(
                'Are you sure to delete this item: ' + item.name,
            )
            if (confirmed) {
                this.$schedsdk
                    .delete_product({_id: item._id})
                    .then((result) => {
                        this.getProductsList()
                    })
            }
        },
        setPage(pageNo) {
            // console.log('pageNo')
            // console.log(pageNo)
            this.page = pageNo
            this.getProductsList()
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
