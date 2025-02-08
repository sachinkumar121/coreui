<template>
	<div class="pt-2">
        <Alerts 
            :alertData="alertData" 
            :show="show"
            @alertClosed="show = 0"
            v-if="alert"
        />
		<div class="row" v-if="product">
            <div class="col-md-6 col-lg-4">
                <div class="form-group d-flex">
                    <label class="control-label"><b>Product Name: </b></label><br>
                    <br><p class="ms-1 mb-0">{{ product.name }}</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="form-group d-flex">
                    <label class="control-label"><b>Code: </b></label><br>
                    <br><p class="ms-1 mb-0">{{ product.product_code }}</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-4"></div>
            <div class="col-md-6 col-lg-4">
                <div class="form-group d-flex">
                    <label class="control-label"><b>UPC: </b></label><br>
                    <br><p class="ms-1 mb-0">{{ product.upc }}</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="form-group d-flex">
                    <label class="control-label"><b>QOH: </b></label><br>
                    <br><p class="ms-1 mb-0">{{product.inventory_data?.est_qoh || 0 }} (Measure: {{ getUomDesc(product.inventory_data?.base_uom, product.inventory_data) }} )</p>
                </div>
            </div>
        </div>

		<div class="row controls-div">
			<div class="settings-text">Filter Options</div>
			<div class="col-md-4">
				<div class="form-group" >
                    <label class="control-label"><b>Date Range</b> <span @click="clearDate()">clear</span></label>
                    <flat-pickr 
                        v-model="select_date_range" 
                        :config="date_range_picker_config" 
                        placeholder="Date Range"
                        @input="setDateRange"
                    />
                </div>
			</div>
            <div class="col-md-4" v-if="!for_single_product">
                <div class="form-group" >
                    <label class="control-label"><b>Product Name/Code</b></label>
                    <v-select 
                        v-model="filter.item_id_array" 
                        multiple
                        label="name" 
                        :options="productsOption"
                        :reduce="p => p._id"
                        :filter-by="filterProducts"
                    >
                        <template v-slot:no-options>
                            Type to search..
                        </template>
                        <template v-slot:option="option" >
                            <div class="d-center">
                                {{ option.name }}
                            </div>
                        </template>
                        <template v-slot:selected-option="option" >
                            <div class="selected d-center">
                                {{ option.name }}
                            </div>
                        </template>
                    </v-select>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group" >
                    <label class="control-label"><b>Stock</b></label>
                    <v-select 
                        v-model="filter.stock_id_array" 
                        multiple
                        label="name" 
                        :options="stocksOption"
                        :reduce="p => p._id"
                    >
                        <template v-slot:no-options>
                            Type to search..
                        </template>
                        <template v-slot:option="option" >
                            <div class="d-center">
                                {{ stockInfo(option) }}
                            </div>
                        </template>
                        <template v-slot:selected-option="option" >
                            <div class="selected d-center">
                                {{ option.name }}
                            </div>
                        </template>
                    </v-select>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label class="control-label"><b>Transaction Type</b></label>
                    <v-select 
                        v-model="filter.txn_type_array"
                        multiple
                        label="name"
                        :options="transactionType"
                        :reduce="st => st.value"
                    >
                        <template v-slot:no-options>
                            Type to search..
                        </template>
                        <template v-slot:option="option" >
                            <div class="d-center">
                                {{ option.label }}
                            </div>
                        </template>
                        <template v-slot:selected-option="option" >
                            <div class="selected d-center">
                                {{ option.label }}
                            </div>
                        </template>
                    </v-select>
                </div>
            </div>
            <div class="col-md-4" v-if="for_single_product">
                <div class="form-group">
                    <input  
                        type="checkbox"
                        class="form-check-input"
                        v-model="filter.group_by_unit_cost"
                    />
                    <label class="control-label">&nbsp;<b>Get grouped by unit cost</b></label>
                </div>
            </div>
            
		</div>
		<div class="table-responsive">
			<table class="table table-bordered table-hover">
				<thead>
					<tr>
						<th>Transaction Date</th>
						<th>Product Name</th>
						<th>Quantity used</th>
						<th>QOH</th>
						<th>Unit Cost</th>
						<th>Transaction Type</th>
						<th>Stock Id</th>
					</tr>
				</thead>
				<tbody v-if="list.length" >
					<tr v-for="item in list" :key="item._id">
						<td>{{getFormattedDate(item.txn_date)}}</td>
						<td>{{item?.product_detail?.name}}</td>
						<td>{{item.sales_qty_used}}</td>
						<td>{{item.sales_qty_on_hand_after}}</td>
						<td>{{item.stock_sales_unit_cost}}</td>
						<td>{{getLabelStr('transactionType', item.txn_type)}}</td>
						<td>
                            <router-link :to="{ name: 'AdjustStock', params: { id: item.stock_id }}">{{stockInfo(getStockObject(item.stock_id))}}</router-link>
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
	</div>
</template>

<script>
import moment from 'moment';
import { debounce } from 'lodash';

import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

import utils_lib from '../../helpers/utils_lib';
import filterMixin from '@/mixins/filters';
import staticListMixin from '@/mixins/static-list';
import Alerts from '../Alerts';

export default {
    name: 'StockTransactions',
    components: { Alerts, flatPickr },
    data() {
        return ({
            list: [],
            select_date_range: null,
            date_range_picker_config: {
                altFormat: "F j, Y",
                altInput: true,
				mode: "range"
            },
            productsOption: [],
            stocksOption: [],
            alert: false,
            show: 0,
            alertData: {
                message: '',
                type: ''
            },
            filter: {
                stock_id_array: [],
                item_id_array: [],
                txn_type_array: [],
                start_date: null,
                end_date: null,
                page: 1,
                max_items_per_page: 4,
                group_by_unit_cost: false
		    },

            page: 1,
            pageCount: 1,
            currency_symbol: this.$store.state.business_settings.business_currency_symbol,

            for_single_product: false,
            product: null,
            uomData: this.$store.state.uom_data,
        });
    },
    computed: {
        isInventoryEnabled() {
            return this.$store.state.business_settings.inventory_enabled;
        }
    },
    async created() {
        if (this.$route.params.product_id) {
            this.filter.item_id_array = [this.$route.params.product_id];
            this.for_single_product = true;
        }
        if (this.for_single_product) {
            await this.getProductDetail();
            await this.getStockList(this.$route.params.product_id);
        } else {
            this.getStockTransactions();
            await this.getProductsList();
            await this.getStockList();
        }
    },    
    mixins: [filterMixin, staticListMixin],
    watch: {
        filter: {
            handler(newobj) {
                this.searchStockTransactions();
            },
            deep: true
        }
    },
    methods: {
        getUomDesc(in_uom_code, id) {
            //console.log(in_uom_code, id, "Asdasd")
            if (!in_uom_code) {
                return in_uom_code
            }
            let uom_code = in_uom_code.toUpperCase()
            let uom_codeobj = this.uomData.filter((e) => {
                if (e.code == uom_code) {
                    //console.log(e.description)
                    // return e.description;
                    return true
                }
                return false
            })
            // console.log(uom_codeobj[0],"asdsadsa")
            if (uom_codeobj) {
                return uom_codeobj[0].description
            }
            return in_uom_code
        },
        getProductDetail(){
            this.$schedsdk.get_product_detail({product_id:this.$route.params.product_id, get_stock_data: this.isInventoryEnabled}).then((result)=>{
                if(result.data.status == 1){
                    this.product = result.data;                   
                }
            })
        },
        getStockObject(stock_id) {
            return this.stocksOption.find(s => s._id == stock_id);
        },
        stockInfo(stock) {
            return stock ? `${utils_lib.getLastSubString(stock._id)} ${stock.name} ${stock.received_date ? this.getFormattedDate(stock.received_date) : 'NA'}/${stock.stock_received_qty}/${stock.stock_received_unit_cost}` : null;
        },
        setDateRange() {
            if (!this.select_date_range) {
                this.filter.start_date = null;
                this.filter.end_date = null;
            } else {
                let dt_range = this.getDateRangeTimeStamps(this.select_date_range + "");
                this.filter.start_date = dt_range.start_ts;
                this.filter.end_date = dt_range.end_ts;
            }
        },
        searchStockTransactions: debounce(function() {
            this.getStockTransactions();
        }, 750),

        getStockList(product_id = null) {
            let filterData = {
                item_id_arr: product_id ? [product_id] : null
            }
            this.$schedsdk.get_stock_list(filterData).then((result) => {
                this.stocksOption = result.data;
            }).catch((error) => {
                this.alertData = {
                    message: error.message,
                    type:'danger'
                }
                this.alert = true;
                this.show = 4;
            });
        },

        async getProductsList() {
            await this.$schedsdk.get_products_list({"product_name":"", "page_no":1}).then((result)=>{
                if (result.status) {
                    this.productsOption = result.data;
                }
            }).catch((error) => {
                this.alertData = {
                    message: error.message,
                    type:'danger'
                }
                this.alert = true;
                this.show = 4;
            });
        },

        getStockTransactions() {
            let that = this;
            this.$schedsdk.stock_get_transactions(this.filter).then(function(response){
                if (response.status) {
                    let responseData = response.data;
                    that.list = responseData.data;
                } else {
                    that.alertData = {
                        message: response.message,
                        type: 'danger'
                    }
                    that.alert = true;
                    that.show = 4;
                }
            }).catch((error) => {
                this.alertData = {
                    message: error.message || error.data.message,
                    type:'danger'
                }
                this.alert = true;
                this.show = 4;
            });
        },

		getDateRangeTimeStamps(dt_range_string) {
			return utils_lib.getFPickDateRangeTimeStamps(dt_range_string, this.$store.state.business_settings.business_time_zone)
		},
        clearDate() {
            this.select_date_range = null;
        },
        getFormattedDate(dt_unix) {
            if (dt_unix == null || dt_unix == 0)
            {
                return dt_unix;
            }
            return moment(dt_unix).format("DD MMM YYYY");
        }
    }
}
</script>

<style scoped>
.action_column button {
    margin: 3px
}
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