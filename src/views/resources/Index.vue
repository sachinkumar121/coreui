<template>
    <div class="pt-2">
        <span v-if="!enable_standard_resources">   
        <label class="control-label">
                <b>Resources are shared items that need to be scheduled to fulfil an appointment like a Room/Chair</b>
        </label><br><br>
        </span>
        <FilterSection>
         
            <template v-slot:search-input>
                <label class="control-label"><b>Search Name</b></label>
                <input
                    v-model="search"
                    class="form-control placeholder-no-fix"
                    type="text"
                    @keyup="searchResource()"
                />
            </template>
            <template v-slot:actions>
                <button
                    class="btn btn-success float-end mt-3 mt-sm-0 ms-2"
                    @click="
                        $router.push(`/resources/${standard_resource_name}/add`)
                    "
                >
                    Create a {{ resource }}
                </button>
                &nbsp;
                <button
                    v-if="!enable_standard_resources"
                    class="btn btn-primary float-end mt-3  mt-sm-0 ms-2"
                    @click="$router.push('/resources/types')"
                >
                    Manage {{resource_taxonomy_name}} Groups
                </button>
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
                        <th>Name</th>
                        <th v-if="!enable_standard_resources">Group</th>
                        <th>Is active</th>
                        <th>Parent/Part Of</th>
                        <th>Disability Accomodation</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody v-if="list.length">
                    <tr v-for="item in list" :key="item._id">
                        <td>{{ item.first_name }}</td>
                        <td v-if="!enable_standard_resources">
                            {{
                                item.resource_groups
                                    ? item.resource_groups
                                          .map(function (attr) {
                                              return attr.group_name
                                          })
                                          .join(', ')
                                    : ''
                            }}
                        </td>
                        <td>{{ item.status == '5' ? 'No' : 'Yes' }}</td>
                        <td>{{ getParentName(item) }}</td>

                        <td>
                            {{
                                item.resource_is_preferred_for_disabled_person ==
                                true
                                    ? 'Yes'
                                    : 'No'
                            }}
                        </td>

                        <td class="action_column">
                            <button
                                class="btn btn-primary btn-sm"
                                @click="
                                    $router.push(
                                        `/resources/${standard_resource_name}/${item._id}/edit`,
                                    )
                                "
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                @click="activateToggleHandler(item)"
                                class="btn btn-info btn-sm"
                            >
                                {{
                                    item.status != 5 ? 'Deactivate' : 'Activate'
                                }}
                            </button>
                            <button
                                type="button"
                                @click="deleteHandler(item)"
                                class="btn btn-danger btn-sm"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="10" class="text-center">
                            <div class="py-5">
                                <img
                                    src="/img/no-result.svg"
                                    alt=""
                                    class="img-empty"
                                />
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
import { debounce } from 'lodash';
import useResource from '@/composables/useResource';
import FilterSection from '@/ui_components/FilterSection'

export default {
    setup() {
        const { getResourceGroup } = useResource();
        return { getResourceGroup };
    },
    components: {
        FilterSection
    },
    async created() {
        this.getResourceList();
    },
    watch: {
        resource() {
            this.search = '';
            this.getResourceList();
        }
    },
    computed: {
        standard_resource_name() {
            return this.$route.params.standard_resource_name != "all_resources_list"? this.$route.params.standard_resource_name : "all_resources_list";
        },
        enable_standard_resources() {
            
            return this.$store.state?.business_settings?.enable_standard_resources!==null?this.$store.state?.business_settings?.enable_standard_resources:false;
        },
        resource() {
            return this.getResourceGroup(this.standard_resource_name);
        },
        resource_taxonomy_name()
        {
          return this.enable_standard_resources? "Facility" : 'Resource';
           
        }
    },
    data() {
        return {
            
            search: '',
            list: [],
            page: 1,
            pageCount: 1,
        }
    },
    methods: {
        getParentName(item) {
            if (
                !item.parent_family_user_id ||
                item.parent_family_user_id.length < 3
            ) {
                return 'None'
            }

            //console.log(  this.list[0])
            for (let i = 0; i < this.list.length; i++) {
                if (
                    this.list[i]._id.toString() ==
                    item.parent_family_user_id.toString()
                ) {
                    return this.list[i].first_name
                }
            }
            return 'Not Found'
        },
        searchResource: debounce(function () {
            this.getResourceList()
        }, 750),    

        getResourceList() 
        {
            let qry = {
                    name: this.search,
                    page_no: this.page,
                    
                }
            if (this.standard_resource_name != "all_resources_list")
            {
               qry.standard_group_name_filter =  this.standard_resource_name;
            }
            this.$schedsdk
                .list_resources(qry)
                .then((result) => {
                    this.list = result.data
                    this.pageCount = result.total_pages
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        activateToggleHandler(item) {
            let confirmed = confirm(
                `Are you sure to ${
                    item.status != '5' ? 'deactivate' : 'activate'
                } this item: ${item.first_name}`,
            )
            let activateToggleSdkFun =
                item.status != '5' ? 'deactivate_resource' : 'activate_resource'
            if (confirmed) {
                this.$schedsdk[activateToggleSdkFun]({
                    user_id: item._id,
                })
                    .then((result) => {
                        this.getResourceList()
                    })
                    .catch(console.error)
            }
        },
        deleteHandler(item) {
            let confirmed = confirm(
                'Are you sure to delete this item: ' + item.first_name,
            )
            if (confirmed) {
                this.$schedsdk
                    .delete_user({_id: item._id})
                    .then((result) => {
                        this.getResourceList()
                    })
                    .catch(console.error)
            }
        },
        addResource() {
            let data = {
                email: '123@adasd.com',
                first_name: 'Room 223',
                last_name: 'Room 223',
                phone: '',
                resource_groups: [
                    {
                        access_type: 1,
                        property: [],
                        resource_group_id: '5d66181b0421911aaca95841',
                    },
                    {
                        access_type: 1,
                        property: [
                            {
                                name: 'max capacity',
                                type: 2,
                                value: '',
                            },
                            {
                                name: 'floor ',
                                type: 1,
                                value: '',
                            },
                        ],
                        resource_group_id: '5d6616c80421911aaca95836',
                    },
                ],
                type: 9,
            }
            this.$schedsdk
                .add_customer(data)
                .then(function (result) {
                    console.log(result)
                })
                .catch(console.error)
        },
        updateResourceType() {
            let data = {
                email: '123@adasd.com',
                first_name: 'Room 223',
                _id: '6274c7d2b37a7e2b38d33f84',
                last_name: 'Room 223',
                phone: '',
                resource_groups: [
                    {
                        access_type: 2,
                        property: [
                            {
                                name: 'max capacity',
                                type: 2,
                                value: '3',
                            },
                            {
                                name: 'floor ',
                                type: 1,
                                value: '2',
                            },
                        ],
                        resource_group_id: '5d6616c80421911aaca95836',
                    },
                    {
                        access_type: 2,
                        property: [],
                        resource_group_id: '5d66181b0421911aaca95841',
                    },
                ],
                type: 9,
            }
            this.$schedsdk
                .update_customer(data)
                .then(function (result) {
                    console.log(result)
                })
                .catch(console.error)
        },
    },
}
</script>

<style scoped>
.action_column button {
    margin: 3px;
}
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