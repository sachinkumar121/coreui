<template>
	<div>
        <vue-title title="Manage Classes"></vue-title>
        <div class="d-flex align-center page-center">
            <div class="mx-auto col-md-11 col-lg-10 col-xl-9">
                <CCard class="my-4 shadow-lg border-rounded">
                    <CCardBody>
                        <div class="alert alert-danger" role="alert" v-if="error">
                        {{error}}
                        </div>
                        <h3 class="h4 mb-3">Classes</h3>
                        <div class="table-responsive">
                            <table class="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Code</th>
                                        <th>Class Cost</th>
                                        <th>Quantity</th>
                                        <th>Total Cost</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody v-if="class_signups.length" >
                                    <tr v-for="item in class_signups" :key="item._id">
                                        <td class="align-middle">{{item.class_info.name}}</td>
                                        <td class="align-middle">{{item.class_info.code}}</td>
                                        <td class="align-middle">{{business_config.business_currency_symbol}}{{item.class_info.class_cost}}</td>
                                        <td class="align-middle">{{item.classes_count}}</td>
                                        <td class="align-middle">{{business_config.business_currency_symbol}}{{item.class_info.class_cost * item.classes_count}}</td>
                                        <td>
                                            <button v-if="item.status != 'drop'" class="btn btn-primary-small border-radius-14 px-2 px-sm-3 px-xxl-3 btn-danger" @click="dropFromClass(item)">Drop</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <hr class="my-3" />
                    </CCardBody>
                </CCard>
            </div>
        </div>        
	</div>
</template>

<script>
import titleComponent from '@/common/TitleComponent.vue';

export default {
    name: "ClassSignupPoDetails",
    components: {
        "vue-title": titleComponent
    },
    data() {
        return ({
            error: null,
            class_signups: [],
            business_config: null
        })
    },
    async created() {
        this.getPOInfo();
    },
    computed: {
        
    },
    methods: {
        getPOInfo() {
            let access_key = this.$route.params.accesskey;
            let po_order_number = this.$route.params.po_order_number;
            if (access_key && po_order_number) {
                this.$schedsdk.class_signups_by_po(access_key, po_order_number).then((result) => {
                    this.class_signups = result.data.class_signups;
                    this.business_config = result.data.business_config;
                }).catch((error) => {
                    console.log(error);
                });
            } else {
                this.$router.push({
                    name: 'External Class List',
                    params: {
                        accesskey: access_key
                    }
                });
            }
        },
        dropFromClass(item) {
            let cr = confirm(`Are you sure to drop from this class ${item.class_info.name}`);
            let that = this;
            if (cr) {
                let access_key = this.$route.params.accesskey;
                this.$schedsdk.drop_class_signup(access_key, 
                            item._id,
                            item.class_info._id, 
                            item.customer_id, {}).then((result) => {
                    if (result.status) {
                        this.error = null;
                    } else {
                        this.error = result.message;
                    }
                }).catch((error) => {
                    console.log(error);
                }).finally(() => {
                    that.getPOInfo();
                });
            }
        }        
    }
}
</script>

<style scoped>
.action_column button {
    margin: 3px
}
.btn.btn-green {
    background-color: #33ab55;
    border-color: #33ab55;   
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
.btn.btn-primary-small {
    min-height: 34px;
}
.form-control:disabled, .form-control[readonly] {
    background-color: #fff;
}
.page-center {
    min-height: calc(100vh - 56px);
}
.wrapper-created {
    min-height: 200px;
}
.checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #7ac142;
    fill: none;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards
}

.checkmark {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #fff;
    stroke-miterlimit: 10;
    margin: 5% auto;
    box-shadow: inset 0px 0px 0px #7ac142;
    animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both
}

.checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards
}

@keyframes stroke {
    100% {
        stroke-dashoffset: 0
    }
}

@keyframes scale {

    0%,
    100% {
        transform: none
    }

    50% {
        transform: scale3d(1.1, 1.1, 1)
    }
}

@keyframes fill {
    100% {
        box-shadow: inset 0px 0px 0px 30px #7ac142
    }
}
</style>