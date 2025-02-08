<template>
	<div class="pt-2">
        <Alerts 
            v-if="alert"
            :alertData="alertData"
            :show="show"
            @alertClosed="show = 0"
        />
        <FilterSection>
            <template v-slot:search-input>
                <div class="form-group" >
                    <label class="control-label"><b>Search</b></label>
                    <input  
                        type="text"
                        class="form-control input"
                        v-model="search_name" 
                        @input="filterList"  
                    />
                </div>
            </template>
            <template v-slot:actions>
                <CButton class="btn btn-success float-end" @click="syncToServer">Sync To Server</CButton>
            </template>
        </FilterSection>
		<div class="table-responsive">
			<table class="table table-bordered table-hover">
				<thead>
					<tr>
						<th>Item Name(item_image)</th>
						<th>UPC/EAN</th>
						<th>expected stock qty</th>
						<th>counted stock qty</th>
						<th>counted broken stock qty</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody v-if="list.length" >
					<tr v-for="item in list" :key="item._id">
						<td>{{item.item_name}} 
                            <img width="50" height="50" v-if="item.item_image" :title="item.item_name" :src="item.item_image" />
                        </td>
						<td>{{item.item_upc}}</td>
						<td>{{item.expected_stock_qty}}</td>
						<td>
                            <input type="text" class="form-control"
                            v-model.number="item.counted_stock_qty" />
                        </td>
                        <td>
                            <input type="text"  class="form-control"
                            v-model.number="item.counted_broken_stock_qty" />
                        </td>
						<td><button class="btn btn-success" @click="saveTakeCount(item)">Save</button></td>
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
import { fetchTakeInventoryCount, removeDataOfCollection, insertDataToCollection, updateDataOfCollection, getDataOfCollection } from '../../helpers/in-memory-db';
import Alerts from '../Alerts';
import FilterSection from '@/ui_components/FilterSection'
export default {
    name: "TakeInventoryCount",
    components: {
        Alerts,
        FilterSection
    },
    data() {
        return ({
            list: [],
            search_name: '',
            alert: false,
            show: 0,
            alertData: {
                message: '',
                type: ''
            },
        })
    },
    computed: {
        filteredItems() {
            return [];
            return this.search_name ? this.list.filter(item => {
                return item.item_name.toLowerCase().indexOf(this.search_name.toLowerCase()) > -1 
            }) : this.list;            
        }
    },
    async created() {
        let inventory_count_event_id = this.$route.params.item_id;

        // Catch any error while interact with in memory DB.
        try {
            let localDbRes = await fetchTakeInventoryCount();
            let cachedDataBelongsToCurrentPage = localDbRes.every(l => l.inventory_count_event_id == inventory_count_event_id);
            let currentTimestamp = +new Date();
            let { last_fetched_timestamp, ttl } = this.$store.state.in_memory_db_state;
            let inventoryCountFetchedTimestampExpired = last_fetched_timestamp.inventory_count + ttl.inventory_count;
            let isCachedDataExpired = currentTimestamp > inventoryCountFetchedTimestampExpired;

            // check if the data is already in memory DB.
            if (!localDbRes.length || !cachedDataBelongsToCurrentPage || isCachedDataExpired) {
                this.removeAndSaveDataToLocalDb(inventory_count_event_id);
            } else {
                this.list = localDbRes;
            }
        } catch (error) {
            let records = await this.getTakeInventoryCountDetails();
            let recordData = records.data;
            this.list = recordData.items;
        }
    },
    methods: {
        async syncToServer() {
            let stopIteration = false;
            let iteration = 0;
            let limitPerIteration = 2;

            this.alertData = {
                message: "syncing to server...",
                type: 'primary'
            }
            this.alert = true;
            this.show = 1;
            do {
                let syncToServerItems = await getDataOfCollection('skysalon.inventory_count', { "need_to_sync_to_server": true }, limitPerIteration, iteration * limitPerIteration);

                if (syncToServerItems.length > 0) {
                    syncToServerItems = syncToServerItems.map(s => {
                        let clonedItem = {};
                        clonedItem._id = s._id;
                        clonedItem.counted_stock_qty = s.counted_stock_qty;
                        clonedItem.counted_broken_stock_qty = s.counted_broken_stock_qty;
                        // clonedItem.need_to_sync_to_server = false; // it doesn't matter for api.
                        return clonedItem;
                    });
                    let syncToServerItemsIds = syncToServerItems.map(s => s._id);

                    this.$schedsdk.update_item_inventory_count({
                        data: syncToServerItems
                    }).then(async (result) => {
                        if (result.status) {
                            await updateDataOfCollection('skysalon.inventory_count', { "_id": { $in: syncToServerItemsIds } }, { 'need_to_sync_to_server': false}, { multi: true });
                            this.alert = false;
                            this.show = 0;
                            setTimeout(() => {
                                this.alertData = {
                                    message: "sync to server completed successfully.",
                                    type: 'success'
                                }
                                this.alert = true;
                                this.show = 1;
                            }, 100);
                        }
                    }).catch((error) => {
                        this.alert = false;
                        this.show = 0;
                        setTimeout(() => {
                            this.alertData = {
                                message: error,
                                type: 'success'
                            }
                            this.alert = true;
                            this.show = 1;
                        }, 100);
                    });
                    iteration++;
                } else {
                    stopIteration = true;
                }
            } while (!stopIteration);
        },
        async saveTakeCount(item) {
            let localDbItem = {};
            localDbItem._id = item._id;
            localDbItem.counted_stock_qty = item.counted_stock_qty;
            localDbItem.counted_broken_stock_qty = item.counted_broken_stock_qty;
            localDbItem.need_to_sync_to_server = true;

            await updateDataOfCollection('skysalon.inventory_count', { "_id": item._id }, localDbItem);

            this.$schedsdk.update_item_inventory_count({
                data: [item]
            }).then(async (result) => {
                if (result.status) {
                    localDbItem.need_to_sync_to_server = false;
                    await updateDataOfCollection('skysalon.inventory_count', { "_id": item._id }, localDbItem);
                }
            }).catch((error) => {
                console.log(error);
            });
        },
        async filterList() {
            let inventory_count_event_id = this.$route.params.item_id;
            // Catch any error while interact with in memory DB.
            try {
                let localDbRes = await fetchTakeInventoryCount(this.search_name);
                this.list = localDbRes;
            } catch (error) {
                let records = await this.getTakeInventoryCountDetails(this.search_name);
                let recordData = records.data;
                this.list = recordData.items;
            }
        },

        async removeAndSaveDataToLocalDb(inventory_count_event_id) {
            try {
                this.alertData = {
                    message: "The inventory take count data is downloading...",
                    type: 'primary'
                }
                this.alert = true;
                this.show = 1;
                await removeDataOfCollection('skysalon.inventory_count', {}, {multi: true});
                await this.iterateAndSaveDataToLocalDb(inventory_count_event_id);
    
                // this.alert = false;
                // this.show = 0;
                setTimeout(() => {
                    this.alertData = {
                        message: "The inventory take count data is downloaded successfully.",
                        type: 'success'
                    }
                    this.alert = true;
                    this.show = 1;
                }, 100);
                await this.$store.commit('in_memory_db_state/setLastFetchedTimestamp', 'inventory_count');
            } catch (error) {
                throw error;
            }
        },
        sleep (fn) {
            return new Promise((resolve) => {
                // wait 3s before calling fn(par)
                setTimeout(() => resolve(fn()), 5000)
            })
        },
        async iterateAndSaveDataToLocalDb(inventory_count_event_id) {
            let stopIteration = false;
            let page = 1;
            do {
                let records = await this.getTakeInventoryCountDetails(null, page);
                let recordData = records.data;
                await insertDataToCollection('skysalon.inventory_count', recordData.items);

                if (page == 1) {
                    this.list = recordData.items;
                }
                if (!recordData.items.length) {
                    stopIteration = true;
                }
                page++;
            } while (!stopIteration);
        },
        getTakeInventoryCountDetails(search_name = null, page = 1, max_items_per_page = 5) {
            let inventory_count_event_id = this.$route.params.item_id;
            return this.$schedsdk.list_items_inventory_count({
                inventory_count_event_id,
                page,
                max_items_per_page,
                search_name
            })
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