<template>
    <div>
        <Alerts 
            :alertData="alertData" 
            :show="show"
            @alertClosed="alertClosedFn"
            v-if="alert"
        />
        <form class="update-inventory-settings-form" @submit.prevent="updateInventorySettings">
            <div class="form-body">
                <div class="row">
                    <div class="col-md-4">
                        <!-- <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" name="enable_inventory" id="enable_inventory" v-model="form.enable_inventory_setting">
                            <label class="form-check-label" for="enable_inventory">
                                <b>Enable Inventory</b>
                            </label>
                        </div> -->
                        <CFormSwitch name="enable_inventory" id="enable_inventory" v-model="form.enable_inventory_setting" inline label="Enable Inventory"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8">
                        <div class="form-actions">
                            <button class="btn btn-success float-end">Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
<script>
import Alerts from '../Alerts'
import AppHelper from '../../helpers/app_helper'
export default {
    name: 'InventorySettings',
    components: {
        Alerts
    },
    data() {
        return ({
            alert: false,
            show: 0,
            alertData: {
                message: '',
                type: ''
            },
            form: {
                enable_inventory_setting: this.$store.state.business_settings.inventory_enabled
            }
        });
    },
    methods: {
        updateInventorySettings() {
            this.$schedsdk.inventorySetting(this.form).then((result) => {
                if (result.status) {
                    this.$router.push('/settings');
                } else {
                    this.alertData = {
                        message: result.message,
                        type:'danger'
                    }
                    this.alert = true;
                    this.show = 4;
                }
            }).catch((error) => {
                this.alertData = {
                    message: error.data.message,
                    type:'danger'
                }
                this.alert = true;
                this.show = 4;
            });
        }
    }
}
</script>

