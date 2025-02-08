<template>
    <div>
        <CRow>
            <CCol sm="12">
                <Alerts 
                    :alertData="alertData" 
                    :show="show"
                    @alertClosed="show = 0"
                    v-if="alert" />
                <form class="add-edit-quote-form" @submit.prevent="AddEditQuote">
                    <div class="form-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group" >
                                    <label class="control-label"><b>Category</b></label>
                                    <v-select 
                                        label="cmotd_category_title"
                                        v-model="selected_category"
                                        :reduce="category => category._id"
                                        :options="category_list"
                                    >
                                    <template v-slot:no-options="{ search, searching }">
                                        <template v-if="searching">
                                        No results found for <em>{{ search }}</em
                                        >.
                                        </template>
                                        <em v-else style="opacity: 0.5">Start typing to search</em>
                                    </template>
                                    <template v-slot:option="option">
                                    <div class="d-center">
                                        {{ option.cmotd_category_title }}
                                        </div>
                                    </template>
                                    <template v-slot:selected-option="option">
                                        <div style="display: flex; align-items: baseline">
                                        <div class="selected d-center">{{ option.cmotd_category_title}}</div>
                                        </div>
                                    </template>
                                    </v-select> 
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group" >
                                    <label class="control-label"><b>Text</b></label>
                                    <input 
                                    :class={invalid:v$.text.$error}
                                    class="form-control placeholder-no-fix" 
                                    type="text" 
                                    v-model="text"
                                    @blur="v$.text.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.text.$dirty && v$.text.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group" >
                                    <label class="control-label"><b>Author</b></label>
                                    <input 
                                    :class={invalid:v$.text.$error}
                                    class="form-control placeholder-no-fix" 
                                    type="text" 
                                    v-model="author"
                                    @blur="v$.author.$touch()" 
                                    />
                                    <p class="error-msg" v-if="v$.author.$dirty && v$.author.required.$invalid">This field must not be empty.</p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="md-checkbox has-success">
                                    <input type="checkbox" 
                                        v-model="enable" 
                                        :checked="enable"
                                        class="md-check">
                                    &nbsp;<label><b>Enable</b></label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <button  class="btn btn-success">{{add_edit_string}} Quote</button>
                            </div>
                        </div>
                    </div>
                </form>
            </CCol>
        </CRow>
    </div>
</template>

<script>
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

import Alerts from '../Alerts'

export default {
    name: 'Add_Edit_Quote',
    components: {
        Alerts
    },
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return({
            text: null,
            author: null,
            enable: true,
            alert: false,
            add_edit_string: "Add",
            quote_id: this.$route.params.quote_id,
            selected_category: null,
            category_list: [],
            show: 0,
            alertData: {
                message: '',
                type: ''
            }
        })
    },
    validations: {
        text: {
            required
        },
        author: {
            required
        }
    },
    async created() {
        this.add_edit_string = this.quote_id ? "Update": "Add";
        if (this.quote_id) {
            await this.getQuoteInfo(this.quote_id);
        }
        await this.getAllQuoteCategories();
    },
    methods: {
        async getAllQuoteCategories() {
            try {
            const response = await this.$schedsdk
                .get_quote_category_list();
                const { data } = response;
                if (response.status) {
                    this.category_list = data;
                    // this.category_list = this.category_list.concat(data);
                }
            } catch (error) {
                console.error(error);
            }
        },
        async getQuoteInfo(id) {
            try {
                const response = await this.$schedsdk
                    .get_quote_detail(id);
                if (response.status) {
                    const { data } = response;
                    this.text = data.text;
                    this.author = data.author;
                    this.enable = data.enable;
                    this.selected_category = data.quote_category;
                }
            } catch (error) {
                console.error(error);
            }
        },
        async AddEditQuote(e) {
            e.preventDefault();
            this.v$.$touch();
            if (!this.v$.$invalid) {
                
                try {
                    const data = { 
                        text: this.text, 
                        author: this.author,
                        enable: this.enable,
                        quote_category: this.selected_category,
                    };
                    let sdkMethod = "add_quote";
                    if (this.quote_id) {
                        sdkMethod = "edit_quote";
                        data._id = this.quote_id;
                    }
                    const response = await this.$schedsdk[sdkMethod](data);
                    if (response.status) {
                        this.$router.push({ path: "/quotes/list" });
                    } else {
                        this.showAlert(response);
                    }
                } catch (error) {
                    this.showAlert(error);
                }
            }
        },
        showAlert(error) {
            this.alertData = {
                message: error?.data?.message || error.message || error,
                type: 'danger'
            }
            this.alert = true;
            this.show = 4;
        }
    }
}
</script>
<style scoped>
.invalid{
  border: 1Px solid red;
  /* background-color: lightcoral; */
  color: red;
}
.error-msg{
  color: red;
}
</style>