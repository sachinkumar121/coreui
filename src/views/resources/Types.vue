<template>
	<div class="pt-2">
        <div class="row controls-div">
			<div class="col-md-12">
				 Resource Groups - A resource group is used manage different end resources (such as rooms/tables).
			</div>
        </div>
		<FilterSection>
            <template v-slot:search-input>
                <label class="control-label"><b>Search Name</b></label>
				<input 
					v-model="search"
					class="form-control placeholder-no-fix" 
					type="text"
                    @keyup="searchResourceTypes()"
				/>
            </template>
            <template v-slot:actions>
                <button class="btn btn-success float-end" @click="$router.push('/resources/types/add')">Create a new Group</button>
                &nbsp;
                <button
                    v-if="standard_resource_name!='all_resources_list'"
                    class="btn btn-info float-end mt-3  mt-sm-0 ms-2"
                    @click="$router.push('/resources/all_resources_list')"
                >
                    View all resources
                </button>
            </template>

        </FilterSection>
		<div class="table-responsive">
			<table class="table table-bordered table-hover">
				<thead>
					<tr>
						<th>Group Name</th>
                        <th>Standard Group</th>
						<th>Attributes</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody v-if="list.length" >
					<tr v-for="item in list" :key="item._id">
						<td>{{item.group_name}} 
                            <CBadge v-if="item.is_active" color="success">Active</CBadge>
                            <CBadge v-else color="danger">Inactive</CBadge>
                        </td>
                        <td>{{ item.is_standard_group?"Yes":"No" }}</td>
						<td>{{item.available_attributes.map(function(attr){return attr.name}).join(", ")}}</td>
						<td class="action_column">
                            <button class="btn btn-primary btn-sm" @click="$router.push(`/resources/types/${item._id}/edit`)">Edit</button>
                            <button type="button" 
                            @click="activateToggleHandler(item)" 
                            class="btn btn-info btn-sm">{{ item.is_active ? 'Deactivate' : 'Activate' }}</button>
                            <button type="button" 
                            @click="deleteHandler(item)" 
                            class="btn btn-danger btn-sm">Force Delete</button>

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
import FilterSection from '@/ui_components/FilterSection'
import { debounce } from 'lodash';

export default {
    async created() {
        this.getResourceTypeList();
    },
    data() {
        return ({
            search: '',
            list: [],
            page: 1,
            pageCount: 1,
        });
    },
    components: {
        FilterSection
    },
    computed:{
        standard_resource_name() {
            return this.$route.params.standard_resource_name != "all_resources_list"? this.$route.params.standard_resource_name : "all_resources_list";
        },
    },
    methods: {
        searchResourceTypes: debounce(function() {
            this.getResourceTypeList();
        }, 750),
        getResourceTypeList() {
            this.$schedsdk.get_resource_groups({
                group_name: this.search,
                page_no: this.page
            }).then((result) => {
                this.list = result.data;
                this.pageCount = result.total_pages;
            }).catch((error) => {
                console.log(error);
            });
        },
        activateToggleHandler(item)
        {
            let confirmed = confirm(`Are you sure to ${item.is_active ? 'deactivate': 'activate'} this item: ${item.group_name}`);
            if (confirmed) {
                item.is_active = !item.is_active;
                this.$schedsdk.edit_resource_groups(item).then((result)=>{
                    this.getResourceTypeList();
                }).catch(console.error);
            }
        },
        deleteHandler(item)
        {
            let confirmed = confirm("Are you sure to delete this item: " + item.group_name);
            if (confirmed) {
                this.$schedsdk.delete_resource_groups({resource_group_id: item._id, force_delete:true}).then((result)=>{
                    this.getResourceTypeList();
                });
            }
        },
        addResourceType() {
            this.$schedsdk.add_resource_groups({
                "available_attributes": [
                    {
                        "attrib_description": "Machine's generation",
                        "name": "Machine Generation",
                        "type": 2
                    },
                    {
                        "attrib_description": "Size: Small / med/ large",
                        "name": "Machine Size",
                        "type": 1
                    }
                ],
                "group_name": "Hair Drying Machines",
                "is_active": true
            }).then(function(result) {
                console.log(result);
            }).catch(console.error);
        },
        updateResourceType() {
            this.$schedsdk.edit_resource_groups({
                "available_attributes": [
                    {
                        "attrib_description": "Machine's generation",
                        "name": "Machine Generation",
                        "type": 2
                    },
                    {
                        "attrib_description": "Size: Small / med/ large",
                        "name": "Machine Size",
                        "type": 1
                    }
                ],
                "group_name": "Hair Drying Machines",
                "_id": "6274b865b37a7e2b38d33def",
                "is_active": true
            }).then(function(result) {
                console.log(result);
            }).catch(console.error);
        },
        deleteResourceType() {
            this.$schedsdk.delete_resource_groups().then(function(result) {
                console.log(result);
            }).catch(console.error);
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