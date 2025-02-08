<template>
	<div class="pt-2">

		<div class="row controls-div">
			<div class="settings-text">Filter Options</div>
			<div class="col-md-4">
				<label class="control-label"><b>Search Name</b></label>
				<input 
					v-model="search"
					class="form-control placeholder-no-fix" 
					type="text"
                    @keyup="searchStocks()"
				/>
			</div>
            <div class="col-md-8 text-right justify-content-end d-flex flex-wrap align-items-center" v-if="isInventoryEnabled">
                <button class="btn btn-success float-end mt-0" @click="$router.push('/stocks/add')">Add Stock</button>
            </div>
            <div class="col-md-12" v-else>
                <p style="margin-top: 5px;">The inventory is not enabled. So you can't add or adjust stock.</p> 
                <p style="margin-top: 5px;">Enable the inventory from <router-link to="/settings/inventory_settings">Inventory settings page</router-link></p>
            </div>
		</div>
		<div class="table-responsive">
			<table class="table table-bordered table-hover">
				<thead>
					<tr>
						<th>Product Name</th>
						<th>Qty on Hand (QOH)</th>
						<th>In Date</th>
						<th>Cost</th>
						<th v-if="isInventoryEnabled">Action</th>
					</tr>
				</thead>
				<tbody v-if="list.length" >
					<tr v-for="item in list" :key="item._id">
						<td>{{item.name}}</td>
						<td>{{item.stock_sales_unit_qty_on_hand}} of {{item.stock_received_qty}} {{item.received_qty_uom}}</td>
						<td>{{getFormattedDate(item.received_date)}}</td>
						<td>{{currency_symbol}}{{item.stock_sales_unit_cost}} / {{item.sales_uom_on_receive}}</td>
						<td v-if="isInventoryEnabled">
							<button class="btn btn-primary btn-sm" @click="$router.push(`/stocks/${item._id}/adjust`)">Adjust Stock</button>
						</td>
					</tr>
				</tbody>
				<tbody v-else>
					<tr>
						<td colspan="10" class="text-center">
                            <div class="py-5">
                                <img src="/img/no-result.svg" alt="" class="img-empty"> 
                                <p class="h5 mt-4 d-block fw-normal">
                                    No Item found
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
                :ariaLabel="'Stocks results pages'"
                :activePage.sync="page"
                :pages="pageCount"
                @update:activePage="setPage"
            />
	
	</div>
</template>

<script>
import Pagination from "@/common/Pagination";
import moment from 'moment';
import { debounce } from 'lodash';

export default {
    name: 'ManageStocks',
    components: { Pagination },
    data() {
        return ({
            search: '',
            list: [],
            page: 1,
            pageCount: 1,
            currency_symbol: this.$store.state.business_settings.business_currency_symbol
        });
    },
    computed: {
        businessSettingsUrl() {
            return window.location.origin;
        },
        isInventoryEnabled() {
            return this.$store.state.business_settings.inventory_enabled;
        }
    },
    created() {
        this.getStockList();
    },
    methods:{
        searchStocks: debounce(function() {
            this.getStockList();
        }, 750),
        getStockList() {
            this.$schedsdk.get_stock_list({
                name: this.search,
                page_no: this.page
            }).then((result) => {
                this.list = result.data;
                this.pageCount = result.total_pages;
            }).catch((error) => {
                console.log(error);
            });
        },
        getFormattedDate(dt_unix) {
            if (dt_unix == null || dt_unix == 0)
            {
                return dt_unix;
            }
            return moment(dt_unix).format("DD MMM YYYY");
        },
        confirmDelete(item)
        {
            let confirmed = confirm("Are you sure to delete this item: " + item.name);
            if(confirmed){
                this.$schedsdk.delete_product({_id: item._id}).then((result)=>{
                    this.getProductsList();
                })
            }
        },
        setPage(pageNo) {
            this.page = pageNo;
            this.getProductsList();
        }
    }
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