<template>
    <div>
        <CRow>
            <CCol sm="12">
                <Alerts
                    :alertData="alertData"
                    :show="show"
                    @alertClosed="show = 0"
                    v-if="alert"
                />
                <form
                    class="add-resource-form"
                    @submit.prevent="addEditResource"
                >
                    <div class="form-body">
                        <div class="row">
                            <div class="col-md-8">
                                <div class="form-group">
                                    <label class="control-label"
                                        ><b>{{ resource_group_name }} Name</b></label
                                    >
                                    <input
                                        class="form-control placeholder-no-fix"
                                        v-model="form.first_name"
                                        :class="{
                                            invalid: v$.form.first_name.$error,
                                        }"
                                        @blur="v$.form.first_name.$touch()"
                                    />
                                    <p
                                        class="error-msg"
                                        v-if="
                                            v$.form.first_name.$dirty &&
                                            v$.form.first_name.required.$invalid
                                        "
                                    >
                                        This field must not be empty.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <!-- Disabling email and phone -->
                        <!-- We can renable if there is a need or ask for these -->
                        <!--
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>Email</b></label>
                                    <input 
                                        type="email"
                                        class="form-control placeholder-no-fix" 
                                        v-model="form.email" 
                                        :class={invalid:v$.form.email.$error}
                                        @blur="v$.form.email.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.form.email.$dirty && v$.form.email.required.$invalid">This field must not be empty.</p>
                                    <p class="error-msg" v-if="v$.form.email.$dirty && !v$.form.email.required.$invalid && v$.form.email.email.$invalid">Please Enter valid email.</p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"><b>Phone</b></label>
                                    <input 
                                        class="form-control placeholder-no-fix" 
                                        v-model="form.phone" 
                                        :class={invalid:v$.form.phone.$error}
                                        @blur="v$.form.phone.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.form.phone.$dirty && v$.form.phone.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                        </div>
                        -->

                        <!-- End disabling email/phone -->

                        <div class="row" v-if="!enable_standard_resources">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="control-label"
                                        ><b>Access Type</b></label
                                    >
                                    <v-select
                                        v-model="form.resource_access_type"
                                        label="name"
                                        :options="resourceAccessType"
                                        :reduce="(st) => st.value"
                                        @search:blur="
                                            v$.form.resource_access_type.$touch()
                                        "
                                    >
                                        <template v-slot:no-options>
                                            Type to search..
                                        </template>
                                        <template v-slot:option="option">
                                            <div class="d-center">
                                                {{ option.label }}
                                            </div>
                                        </template>
                                        <template
                                            v-slot:selected-option="option"
                                        >
                                            <div class="selected d-center">
                                                {{ option.label }}
                                            </div>
                                        </template>
                                    </v-select>
                                    <p
                                        class="error-msg"
                                        v-if="
                                            v$.form.resource_access_type
                                                .$dirty &&
                                            v$.form.resource_access_type
                                                .required.$invalid
                                        "
                                    >
                                        This field must not be empty.
                                    </p>
                                </div>
                            </div>

                            <div
                                class="col-md-4"
                                v-if="!enable_standard_resources"
                            >
                                <div class="form-group">
                                    <label class="control-label"
                                        ><b>Resource Group</b></label
                                    >
                                    <v-select
                                        multiple
                                        v-model="form.resource_groups"
                                        label="group_name"
                                        :options="resourceType"
                                        @search:blur="
                                            v$.form.resource_groups.$touch()
                                        "
                                    >
                                        <template v-slot:no-options>
                                            Type to search..
                                        </template>
                                        <template v-slot:option="option">
                                            <div class="d-center">
                                                {{ option.group_name }}
                                            </div>
                                        </template>
                                        <template
                                            v-slot:selected-option="option"
                                        >
                                            <div class="selected d-center">
                                                {{ option.group_name }}
                                            </div>
                                        </template>
                                    </v-select>
                                    <p
                                        class="error-msg"
                                        v-if="
                                            v$.form.resource_groups.$dirty &&
                                            v$.form.resource_groups.required
                                                .$invalid
                                        "
                                    >
                                        This field must not be empty.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <b
                                    >Is {{ resource_group_name }} preferred for disabled
                                    accomodation? &nbsp;</b
                                >
                            </div>

                            <div class="col-md-4">
                                <label>
                                    <input
                                        type="checkbox"
                                        class="form-check-input"
                                        name="resource_is_preferred_for_disabled_person"
                                        id="resource_is_preferred_for_disabled_person"
                                        v-model="
                                            form.resource_is_preferred_for_disabled_person
                                        "
                                    />
                                    <span class="slider round"></span>
                                    &nbsp; Yes, accommodation requests&nbsp;
                                    <img
                                        src="/img/alt_accessible_sign.svg"
                                        alt=""
                                        style="vertical-align: text-bottom"
                                        width="20"
                                        aria-label="Accessible Resource"
                                    />
                                </label>
                            </div>
                        </div>
                        <br />
                        <div class="row" >
                            <div class="col-md-4">
                                    <a href="javascript:void(0)" @click.prevent="showhideresourcedivisible"><span v-if="!show_divisble_settings">
                                        Show resource divisible settings</span>
                                        <span v-if="show_divisble_settings">
                                        Hide resource divisible settings</span>
                                    </a>
                            </div>
                        </div>

                        <div class="row" v-if="show_divisble_settings">
                            <div class="col-md-4">
                                <b
                                    >Set this {{ resource_group_name }} to be a divisible part of another {{ resource_group_name }}: &nbsp;
                                </b>
                                <CIcon
                                    name="cil-CommentSquare"
                                    v-c-popover="{
                                        header: 'Set Resource as child or portion of another resource',
                                        trigger: 'click',
                                        content:
                                            'If you have large rooms that can be converted to smaller rooms. \
                          You would want to the small rooms as child of the larger room.<br> \
                          This way the larger room is automatically blocked if smaller rooms are booked',
                                    }"
                                />
                            </div>
                            <div class="col-md-4">
                                <div class="form-group" v-if="!enable_standard_resources">
                                    <label class="control-label"
                                        ><b>Child of Res. Group</b></label
                                    >
                                    <v-select
                                        v-model="
                                            selected_parent_resource_group_obj
                                        "
                                        label="group_name"
                                        :options="resourceType"
                                        @update:modelValue="resourceGroupChange"
                                    >
                                        <template v-slot:no-options>
                                            Type to search..
                                        </template>
                                        <template v-slot:option="option">
                                            <div class="d-center">
                                                {{ option.group_name }}
                                            </div>
                                        </template>
                                        <template
                                            v-slot:selected-option="option"
                                        >
                                            <div class="selected d-center">
                                                {{ option.group_name }}
                                            </div>
                                        </template>
                                    </v-select>
                                </div>
                                <div class="form-group">
                                    <label class="control-label"
                                        ><b>Divisible part of another {{ resource_group_name }} </b></label
                                    >
                                    <select
                                        class="form-control"
                                        v-model="form.parent_family_user_id"
                                    >
                                        <option
                                            v-for="opt in other_resource_objs"
                                            v-bind:key="opt._id"
                                            :selected="
                                                opt._id ==
                                                form.parent_family_user_id
                                                    ? true
                                                    : false
                                            "
                                            :value="opt._id"
                                        >
                                            {{ getResName(opt) }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <br />

                        <div
                            class="row"
                            v-if="!enable_standard_resources &&  
                                form.resource_groups &&
                                form.resource_groups.length
                            "
                        >
                            <div class="col-md-8">
                                <b>Set attributes for the resource below:</b
                                ><br />
                            </div>
                            <div
                                class="col-md-8"
                                v-for="rsc in form.resource_groups"
                                :key="rsc._id"
                            >
                                <div
                                    class="table-responsive"
                                    v-if="rsc.property.length"
                                >
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Group</th>
                                                <th>Attribute</th>
                                                <th>Type</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                v-for="(
                                                    item, index
                                                ) in rsc.property"
                                                :key="index"
                                            >
                                                <td>
                                                    {{ rsc.group_name }}
                                                </td>
                                                <td>
                                                    {{ item.name }}
                                                </td>
                                                <td>
                                                    {{
                                                        getAttribTypeString(
                                                            item.type,
                                                        )
                                                    }}
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        size="4"
                                                        v-model="item.value"
                                                        @keyup="
                                                            changeItemvalue(
                                                                index,
                                                                $event,
                                                            )
                                                        "
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <!-- end table of rows and prices -->

                        <div class="row">
                            <div class="col-md-4">
                                <button class="btn btn-success" >
                                    {{
                                        operationName == 'edit'
                                            ? 'Update'
                                            : 'Add'
                                    }}
                                    {{ resource_group_name }}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </CCol>
        </CRow>
    </div>
</template>

<script>
import {required, requiredIf} from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import Alerts from '../Alerts'
import staticListMixin from '@/mixins/static-list'
import useResource from '@/composables/useResource';

export default {
    name: 'Add Edit Resource',
    components: {
        Alerts,
    },
    computed: {
        standard_resource_name() {
            return this.$route.params.standard_resource_name != "all_resources_list"? this.$route.params.standard_resource_name : "Resource";
        },
        enable_standard_resources() {
            return this.$store.state?.business_settings?.enable_standard_resources === null ? true:this.$store.state?.business_settings?.enable_standard_resources ;
        },
        resource_group_name() {
            return this.enable_standard_resources ?this.getResourceGroup(this.standard_resource_name):"Resource";
        },
    },
    setup: () => {
        const { getResourceGroup } = useResource();
        return { getResourceGroup, v$: useVuelidate() };
    },
    mixins: [staticListMixin],
    watch: {
        'form.resource_groups': function () {
                //console.log("watch  --- ", this.form.resource_groups)
        },
    },  
    data() {
        return {
            operationName: 'add',
            in_param_standard_name: '',
            alert: false,
            show: 0,
            alertData: {
                message: '',
                type: '',
            },
            show_divisble_settings : false,
            resource_access_type: null,
            resourceType: [],
            resourceTypesMap: new Map(),
            resourceGroupToResourceList: new Map(),
            other_resource_objs: [],
            form: {
                _id: null,
                type: 9,
                first_name: '',
                email: '',
                phone: '',
                resource_groups: [],
                resource_access_type: 2,
                resource_is_preferred_for_disabled_person: false,
                parent_family_user_id: null,
                parent_resource_group_id: null,
            },
            selected_parent_resource_group_obj: {},
            original_data: null,
        }
    },
    created() {
        let resourceId = this.$route.params.id
        this.in_param_standard_name = this.$route.params.standard_resource_name;
        let that = this
        this.resourceTypesMap.clear()
        this.getResourceTypeList().then((resps) => {
            let getResProm = null
            if (resourceId) {
                getResProm = this.$schedsdk.list_resources({
                    user_id: resourceId,
                })
            }
            this.processResourceTypeList(resps);

            if (this.enable_standard_resources) 
            {
                this.selected_parent_resource_group_obj = 
                        this.resourceType.find(rt => rt.group_name == this.standard_resource_name);
                this.resourceGroupChange();
            }

            if (resourceId) 
            {
                getResProm.then(function (result) {
                    if (result.status) {
                        let resourceData = result.data[0]
                        that.original_data = resourceData
                        that.form._id = resourceData._id
                        that.form.first_name = resourceData.first_name
                        that.form.email = resourceData.email
                        that.form.phone = resourceData.phone
                        that.form.resource_groups =
                            resourceData.resource_groups || []
                        if (
                            resourceData.resource_groups &&
                            resourceData.resource_groups.length
                        ) {
                            that.resource_access_type =
                                resourceData.resource_groups[0].access_type
                        }
                        if (resourceData.parent_family_user_id) {
                            that.form.parent_family_user_id =
                                resourceData.parent_family_user_id
                        }
                        if (resourceData.parent_resource_group_id) {
                            that.form.parent_resource_group_id =
                                resourceData.parent_resource_group_id
                            //console.log("s---s -s-s- that.form.parent_resource_group_id ", that.form.parent_resource_group_id)
                        }
                        that.form.resource_is_preferred_for_disabled_person =
                            resourceData.resource_is_preferred_for_disabled_person
                        // that.form.is_active = resourceData.is_active;
                        // that.form.available_attributes = resourceData.available_attributes;
                        // that.form._id = resourceData._id;
                        //console.log("GOT to get ... ",  that.form.resource_groups)
                        that.fill_attributes()
                    }
                })
                this.operationName = 'edit'
            } else {
                this.fill_attributes()
            }
        })
    },
    validations: {
        form: {
            first_name: {
                required,
            },
             resource_access_type: {
                 required: false //requiredIf(() => !this.enable_standard_resources),
             },
             resource_groups: {
                 required: false //requiredIf(() => !this.enable_standard_resources),
             },
        },
    },
    methods: {
        resourceGroupChange(s) {
            
            console.log("sdd--d--d ",  s,this.selected_parent_resource_group_obj)

            let resc = this.selected_parent_resource_group_obj
            if (resc && resc._id && resc._id.length) {
                //only one.
                let rescglist = this.resourceGroupToResourceList.get(resc._id)
                if (rescglist) {
                    //Ok
                    this.fill_other_resource_objs(rescglist)
                } else {
                    this.$schedsdk
                        .get_resources_in_group({
                            resource_group_array: [resc._id],
                        })
                        .then((result) => {
                            //console.log("Rasdasd LIST ", result.data)
                            if (
                                result.status == 1 &&
                                result.data &&
                                result.data.length
                            ) {
                                this.resourceGroupToResourceList.set(
                                    resc.resource_group_id,
                                    result.data,
                                )
                                this.fill_other_resource_objs(result.data)
                            }
                            //add to resourceGroupToResourceList
                        })
                }
            }
        },
        fill_other_resource_objs(rescglist) {
            //other_resource_objs
            let that = this
            this.other_resource_objs = rescglist.filter((e) => {
                if (!that.form._id) {
                    return e._id
                }
                return that.form._id != e._id
            })
        },
        showhideresourcedivisible()
        {
            this.show_divisble_settings = !this.show_divisble_settings
        },  
        fill_attributes() {
            //console.log("asdsad-- - -",this.original_data.resource_group_ids, this.form.resource_groups)
            //console.log("asdsad--",  this.form.resource_groups);
            let lcresource_groups = []
            lcresource_groups = this.form.resource_groups

            if (
                !this.form.resource_groups.length == 0 &&
                !this.original_data &&
                !this.original_data.resource_group_ids &&
                !this.original_data.resource_group_ids.length > 0
            ) {
                lcresource_groups = this.original_data.resource_group_ids.map(
                    function (id) {
                        return this.resourceTypesMap.get(id)
                    },
                )
            }

            for (let i = 0; i < lcresource_groups.length; i++) {
                let resc = lcresource_groups[i]
                if (resc != null) {
                    let restypedetails = this.resourceTypesMap.get(
                        resc.resource_group_id,
                    )
                    let props_array = resc.property || []
                    if (
                        !restypedetails ||
                        !restypedetails.available_attributes
                    ) {
                        continue
                    }

                    if (
                        props_array.length !=
                        restypedetails.available_attributes.length
                    ) {
                        let newprops = JSON.parse(
                            JSON.stringify(restypedetails.available_attributes),
                        )
                        newprops.value = ''
                        for (let m = 0; m < newprops.length; m++) {
                            let nattr = newprops[m]
                            for (let k = 0; k < props_array.length; k++) {
                                if (
                                    props_array[k].name.trim() ==
                                    nattr.name.trim()
                                ) {
                                    newprops[m].value = props_array[k].value
                                    break
                                }
                            }
                        }
                        this.form.resource_groups[i].property = newprops
                    }
                }
            }

            if (this.form.parent_resource_group_id) {
                this.selected_parent_resource_group_obj =
                    this.resourceTypesMap.get(
                        this.form.parent_resource_group_id,
                    )
                //console.log("asdss00 ", this.selected_parent_resource_group_obj, " res ",   this.form.parent_family_user_id.toString())
                this.resourceGroupChange(null)
            }
        },
        getResName(opt) {
            let v = opt.first_name + ' '
            if (opt.resource_is_preferred_for_disabled_person == true) {
                v += ' (Pref. Disabled Access) '
            }
            return v
        },
        processResourceTypeList(result) 
        {
            for (let i = 0; i < result.data.length; i++) 
            {
                result.data[i].property = result.data[i].available_attributes
                result.data[i].resource_group_id = result.data[i]._id
            }
            this.resourceType = result.data
            this.resourceType.forEach((rt) => {
                this.resourceTypesMap.set(rt._id, rt)
            })
            //console.log(this.resourceType,"Asdasdasdsa")
        },
        async getResourceTypeList() {
            return this.$schedsdk.get_resource_groups({
                group_name: '',
                page_no: 1,
            })
        },
        changeItemvalue(index, item) {},
        getAttribTypeString(ats) {
            switch (ats) {
                case 1:
                    return 'Number'
                case 2:
                    return 'String'
                case 3:
                    return 'Boolean'
            }
            return 'Unknown'
        },
        addEditResource() {
            let that = this

            console.log('SELECYTED RESOURCE TYPES>>>> std: ' + this.enable_standard_resources,
                        JSON.parse(JSON.stringify(this.form.resource_groups)))
            //Redirect link
            let redir_link =  `/resources/${that.standard_resource_name}`
            if (this.enable_standard_resources)
            {
                //
                this.form.resource_groups = this.resourceType
                .filter(
                    (resource_group) =>
                        resource_group.group_name ==
                        that.standard_resource_name,
                )
                .map(function (resource_group) {
                    let rg = {
                        group_name: resource_group.group_name,
                        access_type: that.form.resource_access_type,
                        resource_group_id: resource_group.resource_group_id,
                        property: resource_group.property,
                    }
                    if (resource_group._id) {
                        rg._id = resource_group._id
                    }
                    return rg
                })                
            } //end if enable standard resources
            else
            {
                //Not standard 
                redir_link = `/resources/all_resources_list`
            }

            if (
                this.selected_parent_resource_group_obj &&
                this.selected_parent_resource_group_obj._id &&
                this.selected_parent_resource_group_obj._id.length > 2
            ) {
                this.form.parent_resource_group_id =
                    this.selected_parent_resource_group_obj._id
            }

            //console.log(this.form.resource_groups);
            console.log('asds-s--s', this.form)
            //return;

            let sdkFunction =
                this.operationName == 'edit'
                    ? 'update_customer'
                    : 'add_customer'
            this.$schedsdk[sdkFunction](this.form)
                .then(function (result) {
                    if (result.status) {
                        that.$router.push(
                            redir_link,
                        )
                    } else {
                        that.alertData = {
                            message: result.message,
                            type: 'danger',
                        }
                        that.alert = true
                        that.show = 4
                    }
                })
                .catch((error) => {
                    this.alertData = {
                        message: error.data.message || error.message,
                        type: 'danger',
                    }
                    this.alert = true
                    this.show = 4
                })
        },
    },
}
</script>