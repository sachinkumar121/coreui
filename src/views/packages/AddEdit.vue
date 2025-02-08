<template>
<div>
    <CRow>
      <CCol sm="12">
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <form class="add-package-form" @submit.prevent="null">
            <div class="form-body float-label-white-bg">
                <CAccordion class="custom-package-accordion" :active-item-key="1" always-open>
                    <CAccordionItem class="mb-3" :item-key="1">
                    <CAccordionHeader>
                        Package <template v-if="package_name">({{ package_name }})</template>
                    </CAccordionHeader>
                    <CAccordionBody>
                        <div class="row">
                        <div class="col-md-4">
                            <div class="form-group form-floating" >
                                <input 
                                :class={invalid:v$.package_name.$error}
                                class="form-control placeholder-no-fix" 
                                type="text" 
                                placeholder="Package Name"
                                v-model="package_name"
                                @blur="v$.package_name.$touch()" 
                                />
                                <label class="control-label"><b>Package Name</b></label>
                                <p class="error-msg" v-if="v$.package_name.$dirty && v$.package_name.required.$invalid">This field must not be empty.</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group form-floating">
                                <input class="form-control placeholder-no-fix"
                                type="text" 
                                placeholder="Package ID"
                                v-model="package_code"
                                :class={invalid:v$.package_code.$error}
                                @blur="v$.package_code.$touch()" 
                                    />
                                    <label class="control-label"><b>Package ID</b></label>
                                <p class="error-msg" v-if="v$.package_code.$dirty && v$.package_code.required.$invalid">This field must not be empty.</p> 
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group form-floating">
                                
                                <v-select v-model="package_type" label="name" :options="type_options" :class="{'options-selected': package_type}">
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
                                <label class="control-label"><b>Package Type</b></label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group form-floating">
                                <textarea class="form-control placeholder-no-fix"
                                type="text" 
                                placeholder="Package Description"
                                v-model="package_description"
                                ></textarea>
                                <label class="control-label"><b>Package Description</b></label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                        <div class="form-group form-floating" >
                            
                            <flat-pickr v-model="package_valid_from_date" :config="date_picker_config" placeholder="Start Date"></flat-pickr>
                            <label class="control-label float-label"><b>Valid From</b></label>
                        </div>
                        </div>
                        <div class="col-md-4">
                        <div class="form-group form-floating" >

                            <flat-pickr v-model="package_valid_to_date" :config="date_picker_config" placeholder="End Date"></flat-pickr>
                            <label class="control-label float-label"><b>Valid To</b></label>
                        </div>
                        </div>
                    </div>
                    </CAccordionBody>
                    </CAccordionItem>
                    <CAccordionItem class="mb-3" :item-key="2">
                    <CAccordionHeader>
                        Product & Service
                    </CAccordionHeader>
                    <CAccordionBody>
                        <!-- Services and Products -->
                        <div class="row">
                        <div class="col-md-4">
                            <div class="form-group form-floating">
                                
                                    <v-select multiple v-model="selected_services" @update:modelValue="changeItemsInPackage" label="name" :options="services_option" :class="{'options-selected': selected_services.length > 0}">
                                    <template v-slot:no-options>
                                        Type to search ..
                                    </template>
                                    <template v-slot:option="option" >
                                        <div class="d-center">
                                        {{ option.name }} ({{  option.time + " mins" }}) {{ currency_symbol + "" + option.price }}
                                        </div>
                                    </template>
                                    <template v-slot:selected-option="option" >
                                        <div class="selected d-center">
                                        {{ option.name }} ({{  option.time + " mins" }}) {{ currency_symbol + "" + option.price }}
                                        </div>
                                    </template>
                                    </v-select>
                                    <label class="control-label"><b>Select Services</b></label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group form-floating">
                                    <v-select multiple v-model="selected_products" @update:modelValue="changeItemsInPackage" label="name" :options="products_option" :class="{'options-selected': selected_products.length > 0}">
                                    <template v-slot:no-options>
                                        Type to search ..
                                    </template>
                                    <template v-slot:option="option" >
                                        <div class="d-center">
                                        {{ option.name }} {{ currency_symbol + "" + option.price }}
                                        </div>
                                    </template>
                                    <template v-slot:selected-option="option" >
                                        <div class="selected d-center">
                                        {{ option.name }} {{ currency_symbol + "" + option.price }}
                                        </div>
                                    </template>
                                    </v-select>
                                    <label class="control-label"><b>Select Products</b></label>
                            </div>
                        </div>
                        </div>
                        <!-- End Services and products -->
                        <!-- Categories -->  
                        <div class="row">
                        <div class="col-md-4">
                            <div class="form-group form-floating">
                                    <v-select multiple v-model="selected_service_categories" 
                                                @update:modelValue="changeItemsInPackage" 
                                                label="name" :options="service_category_option" :class="{'options-selected': selected_service_categories.length > 0}">
                                    <template v-slot:no-options>
                                        Type to search ..
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
                                    <label class="control-label"><b>Select Service Category</b></label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group form-floating">
                                    <v-select multiple v-model="selected_product_categories" 
                                        @update:modelValue="changeItemsInPackage" 
                                        label="name" :options="product_category_option" :class="{'options-selected': selected_product_categories.length > 0}">
                                        <template v-slot:no-options>
                                            Type to search ..
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
                                    <label class="control-label"><b>Select Product Category</b></label>
                            </div>
                        </div>
                        </div>
                        <!-- End categories -->
                        <div class="row">
                            <div class="col-md-12 mb-3">
                            <hr>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                            <h6 class="mb-3">Please modify package discount price after selecting all items for the package.</h6>
                            </div>
                        </div>
                        <!--  -->
                        <div class="row discount-div">
                            <div class="col-lg-12">
                            <div class="row">
                                <div class="col-md-6 form-group d-flex">
                                    <label class="control-label"  for="" >Auto calculate discount, Set a final package price: </label>
                                    <div class="pre-icon">
                                    <input type="text" class="form-control" :class="{'borderC': hasBorderAnimation}" placeholder="Set final package price" size="5" 
                                            v-model="user_final_package_price"
                                            @blur="handleBlur"
                                            @keyup="userChangedFinalPackagePrice()"/>
                                            <span class="label-icon">{{currency_symbol}}</span>
                                    </div>
                                </div>
                                <div class="col-md-6 form-group d-flex">
                                    <label class="control-label" for="">Auto calculate package price, Set a discount (as %): </label>
                                    <div class="post-icon">
                                    <input type="text" class="form-control" :class="{'borderC': hasBorderAnimationDiscount}" placeholder="Set package discount"  size="5" 
                                            v-model="user_final_package_discount"
                                            @blur="handleBlurDiscount"
                                            @keyup="userChangedFinalPackageDiscount()"/>
                                            <span class="label-icon">%</span>
                                        </div>
                                </div>
                            </div>
                            </div>
                            
                        </div>
                        
                        <div class="row" v-if='package_items.length'>
                            <div class="col-md-12 mb-3">
                                <hr>
                            </div>
                            <div class="col-md-12 mb-3">
                            <div class="table-responsive">
                                <table class="table table-bordered table-custom-responsive table-no-min-width">
                                <thead>
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Max. Unit Price</th>
                                        <th>Pkg Qty</th>
                                        <th>Free Qty</th>
                                        <th>Ext. Price</th>
                                        <th>Discounted Unit Price</th>
                                    </tr>
                                </thead>
                                    <tbody>
                                    <tr v-for="(item, index) in package_items"  :key="index">
                                        <td data-label="Item Name">{{item.copied_item_name}}
                                            <span v-if="item.item_type=='S'"> - {{item.service_time}} minutes</span>
                                            <span v-if="item.item_type=='SVCAT'"> - Service Category</span>
                                            <span v-if="item.item_type=='PRCAT'"> - Product Category</span>
                                                <Icon icon="tabler:info-circle" v-if="item.item_type=='PRCAT' || item.item_type=='SVCAT'"  v-c-popover="getPopUpHelpObj('help_category_package_item')" :height="18"/>
                                        </td>
                                        <td data-label="Max Unit Div"> 
                                            <div class="max-unit-div">
                                            <input type="text"  size="4" 
                                            v-model="item.item_price" class="form-control"
                                            @keyup="changeItemUnitPrice(item,$event)"/><span class="span-symbol">{{currency_symbol}}</span><span class="span-icon">
                                                <Icon icon="tabler:info-circle" :height="18" v-if="item.item_type=='PRCAT' || item.item_type=='SVCAT'" 
                                                name="cil-CommentSquare"  
                                                v-c-popover="getPopUpHelpObj('help_category_package_item')" /></span>
                                            </div>
                                        </td>
                                        <td data-label="Pkg Qty"><input type="text"  size="4" class="form-control"
                                        v-model="item.qty_allowed_in_package"
                                        @keyup="changeQuantity(item,$event)"/></td>
                                        <td data-label="Free Qty"><input type="text" size="3" class="form-control"
                                        v-model="item.item_qty_free"
                                        @keyup="changeFreeQuantity(item,$event)"/></td>
                                        <td data-label="Ext. Price" class="text-right">{{currency_symbol}}{{calc_extended_price(item.item_price, item)}}</td>
                                        <td data-label="Discounted Unit Price">
                                            <div class="discount-unit-div">
                                            <input type="text" class="form-control"  size="4" 
                                                v-model="item.item_package_price"
                                                @keyup="changePackagePrice(item,$event)"/><span 
                                                class="span-symbol">{{currency_symbol}}</span><span 
                                                class="span-unit">/unit</span><!-- <span>{{getPerUnitDiscountPercent(item.item_price, item.item_package_price)}}</span>-->
                                        </div>
                                        </td>
                                        
                                    </tr>
                                        
                                        <!-- Totals for lg start -->
                                    <tr class="d-none d-lg-table-row">
                                            <td colspan="4" class="text-right">Sub Total</td>
                                            <td class="text-right hightlight-pink"><span>{{currency_symbol}}{{total_price}}</span></td>
                                            <td>{{currency_symbol}}{{total_discouted_price}}</td>
                                        </tr>       
                                        <tr class="d-none d-lg-table-row">
                                            <td colspan="4" class="text-right">Discount</td>
                                            <td class="text-right">-{{currency_symbol}}{{discount_amount}}</td>
                                            <td class="td-border-highlight"><span :class="{'borderC': hasBorderAnimationDiscount}">-{{discount_percent}}% &nbsp;</span></td>
                                        </tr>       
                                        
                                        <tr class="d-none d-lg-table-row">
                                            <td colspan="4" class="text-right"><strong>Package Price</strong></td>
                                            <td class="text-right" > </td>
                                            <td class="hightlight-green"><strong :class="{'borderC': hasBorderAnimation}">{{currency_symbol}}{{total_discouted_price}}</strong></td>
                                        </tr>       
                                        <tr class="d-none d-lg-table-row" v-html="estimated_tax_and_rate_raw_html"></tr>  
                                        <tr class="d-none d-lg-table-row">
                                            <td colspan="4" class="text-right"><strong>Total Service Time</strong></td>
                                            <td class="text-right"><strong>{{total_time}} Minutes</strong></td>
                                            <td></td>
                                        </tr>   
                                        <!-- Totals for lg end -->      
                                    </tbody>
                                </table>
                                
                                <!-- sub total in below lg start -->
                                <div class="d-lg-none d-block">
                                    <table class="table table-bordered table-no-min-width">
                                        <tbody>
                                            <!-- Totals -->
                                            <tr>
                                                <td colspan="4"></td>
                                                <td><strong>Ext. Price</strong></td>
                                                <td><strong>Discounted Unit Price</strong></td>
                                            </tr>
                                            <tr>
                                                <td colspan="4" class="text-right">Sub Total</td>
                                                <td class="text-right hightlight-pink"><span>{{currency_symbol}}{{total_price}}</span></td>
                                                <td>{{currency_symbol}}{{total_discouted_price}}</td>
                                            </tr>       
                                            <tr>
                                                <td colspan="4" class="text-right">Discount</td>
                                                <td class="text-right">-{{currency_symbol}}{{discount_amount}}</td>
                                                <td class="td-border-highlight"><span :class="{'borderC': hasBorderAnimationDiscount}">-{{discount_percent}}% &nbsp;</span></td>
                                            </tr>
                                            <tr>
                                                <td colspan="4" class="text-right"><strong>Package Price</strong></td>
                                                <td class="text-right" > </td>
                                                <td class="hightlight-green"><strong :class="{'borderC': hasBorderAnimation}">{{currency_symbol}}{{total_discouted_price}}</strong></td>
                                            </tr>       
                                            <tr v-html="estimated_tax_and_rate_raw_html"></tr>  
                                            <tr>
                                                <td colspan="4" class="text-right"><strong>Total Service Time</strong></td>
                                                <td class="text-right"><strong>{{total_time}} Minutes</strong></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                
                                </div>
                                <!--  -->
                                <template v-if="selection_map.size>0">
                                    <h6>Price table for each options purchase</h6>
                                    <table class="table table-bordered table-custom-responsive table-no-min-width">
                                        <thead>
                                            <tr>
                                                <th>Option</th> 
                                                <th>Unit Price</th>
                                                <th>Package Discount</th> 
                                                <th>Package Purchase price</th> 
                                                <th>Full Package Price</th>
                                            </tr>
                                        </thead>   
                                        <tbody>
                                            <tr v-for="(item) in selection_map" v-bind:key="item._id">
                                                <td data-label="Option">{{item[1].note}} &nbsp; {{item[1].time}} mins</td>
                                                <td data-label="Unit Price">{{currency_symbol}}{{item[1].price}}</td>
                                                <td data-label="Package Discount">     
                                                    <div class="post-icon" style="max-width: 120px; width: 100%;">
                                                        <input type="text" size="4" class="form-control" 
                                                        :value="getFlexItemPackageDiscount(item[1])"
                                                        @keyup="changeFlexItemPackageDiscount(item[1], $event)"/> 
                                                        <span class="label-icon">%</span>
                                                </div>
                                                </td>
                                                <td data-label="Package Purchase Price">
                                                    <div class="max-unit-div">
                                                        <input type="text" size="5" class="form-control" 
                                                        :value="getFlexItemPackagePrice(item[1])"
                                                        @keyup="changeFlexItemPackagePurchasePrice(item[1],$event)"/>
                                                        <span class="span-symbol">{{currency_symbol}} </span>
                                                        <span class="span-icon">X &nbsp;</span> {{getFlexItemPackageQty(item[1])}}
                                                    </div>
                                                    </td> 
                                                <td data-label="Full Package Price">{{currency_symbol}}{{calculate_package_price_for_flex(item[1])}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </template>
                                <!-- sub total in below lg end -->
                            </div>
                            </div>
                            
                        </div>
                    </CAccordionBody>
                    </CAccordionItem>
                    <CAccordionItem class="mb-3" :item-key="3">
                    <CAccordionHeader>
                        Options
                    </CAccordionHeader>
                    <CAccordionBody>
                        <div class="row discount-div mt-3">
                            <div class="col-lg-12">
                                <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group d-flex" >
                                        <label class="control-label">Discount for other services (%)</label>
                                        <div class=" post-icon">
                                        <input 
                                        class="form-control placeholder-no-fix" 
                                        type="text" 
                                        v-model="discount_percent_for_services"
                                        />
                                        <span class="label-icon">%</span> 
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group d-flex" >
                                        <label class="control-label">Discount for other products (%)</label>
                                        <div class=" post-icon">
                                        <input 
                                        class="form-control placeholder-no-fix" 
                                        type="text" 
                                        v-model="discount_percent_for_products"
                                        />
                                        <span class="label-icon">%</span> 
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 mb-2">
                                <hr class="mt-2">
                            </div>
                        </div>
                        <div class="row">
                        <div class="col-md-4">
                            <div class="form-group form-floating" >
                            <input 
                            class="form-control placeholder-no-fix" 
                            type="text" 
                            v-model="recur_max_periods"
                            />
                            <label class="control-label"><b>Recurring Months</b></label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group form-floating" >
                            <input 
                            class="form-control placeholder-no-fix" 
                            type="text" 
                            v-model="recur_cancel_fee"
                            />
                            <label class="control-label"><b>Recurring Cancel Fees</b></label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group form-floating">
                            <input 
                            class="form-control placeholder-no-fix" 
                            type="text" 
                            v-model="recur_setup_fee"
                            />
                            <label class="control-label"><b>Recurring Setup Fees</b></label>
                            </div>
                        </div>
                    </div>
                        <div class="row">
                        <div class="col-md-4">
                            <div class="form-group form-floating">
                                <input 
                                class="form-control placeholder-no-fix" 
                                type="text" 
                                v-model="recur_late_fee"
                                />
                                <label class="control-label"><b>Recurring Late Fee</b></label>
                            </div>
                        </div>
                        <div class="col-md-4 ">
                            <div class="form-group form-floating" >
                                <input 
                                class="form-control placeholder-no-fix" 
                                type="text" 
                                v-model="recur_client_requested_pause_fee"
                                />
                                <label class="control-label"><b>Recurring Pause Fees</b></label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group form-floating">
                                <input 
                                class="form-control placeholder-no-fix" 
                                type="text" 
                                v-model="expiry_days_after_purchase"
                                />
                                <label class="control-label"><b>Expires days after purchase</b></label>
                            </div>
                        </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 mb-3">
                                <hr>
                            </div>
                        </div>
                        
                    <div class="row">
                        <div class="col-md-12">
                            <div class="md-checkbox has-success mb-2">
                                <input type="checkbox" 
                                v-model="recurr_allow_services_rollover" 
                                :checked = recurr_allow_services_rollover
                                class="md-check form-check-input">
                                <label class="ms-2 mb-0"><b>Recurring Allow Service Rollover</b> </label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="md-checkbox has-success mb-2">
                                <input type="checkbox" 
                                v-model="allow_online_sales" 
                                :checked = allow_online_sales
                                class="md-check form-check-input">
                                <label class="ms-2 mb-0"><b>Allow Online Sales</b> </label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="md-checkbox has-success mb-2">
                                <input type="checkbox" 
                                v-model="is_package_recurr_allowed" 
                                :checked = is_package_recurr_allowed
                                class="md-check form-check-input">
                                <label class="ms-2 mb-0"><b>Allow Recurring Subscription</b> </label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <!-- <div class="col-md-4">
                            <div class="md-checkbox has-success">
                                <input type="checkbox" 
                                v-model="consume_on_purchase" 
                                :checked = consume_on_purchase
                                class="md-check">
                                <label><b>Consume package on purchase</b> </label>
                            </div>
                        </div> -->
                        <div class="col-md-12">
                            <div class="md-checkbox has-success mb-2">
                                <input type="checkbox" 
                                v-model="collect_tax_at_purchase" 
                                :checked = collect_tax_at_purchase
                                class="md-check form-check-input">
                                <label class="ms-2 mb-0"><b>Collect tax upon package purchase</b> </label>  
                                            <Icon icon="tabler:info-circle" v-c-popover="getPopUpHelpObj('help_category_collect_tax_on_package_purchase')" :height="18"/>       
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="md-checkbox has-success mb-2">
                                <input type="checkbox" 
                                v-model="must_sell_as_recurring_package" 
                                :checked = must_sell_as_recurring_package
                                class="md-check form-check-input" style="">
                                <label class="ms-2 mb-0" style="margin-top:-4px;"><b>Require customer to agree to auto purchase/recurrance when selling</b> </label>  
                                <Icon icon="tabler:info-circle" v-c-popover="getPopUpHelpObj('help_category_must_require_recurrance')" :height="18"/> 
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12" v-if="confirm_discount_flex_items||svc_cat_confirm_discount_flex_items||svc_confirm_discount_flex_items">
                            <div class="md-checkbox has-success mb-2">
                                <input type="checkbox" 
                                v-model="confirm_discount_flex_items" 
                                :checked = confirm_discount_flex_items
                                class="md-check form-check-input">
                                <label class="ms-2 mb-0"><b>Confirm that this package is of variable price due to flex items added. Discount of {{discount_percent}}% will be used</b> </label>  
                                    <Icon icon="tabler:info-circle" v-c-popover="getPopUpHelpObj('help_flexible_price_package')" :height="18"/> 
                            </div>
                        </div>
                        
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="md-checkbox has-success mb-2">
                                <input type="checkbox" 
                                v-model="flex_selections_match_price" 
                                :checked = flex_selections_match_price
                                class="md-check form-check-input">
                                <label class="ms-2 mb-0"><b>If items contain flex/variable selections, require price match</b> </label>  
                                &nbsp;
                                    <Icon icon="tabler:info-circle" v-c-popover="getPopUpHelpObj('help_flex_selections_match_price')" :height="18"/> 
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="md-checkbox has-success mb-2">
                                <input type="checkbox" 
                                v-model="flex_selections_match_time" 
                                :checked = flex_selections_match_time
                                class="md-check form-check-input">
                                <label class="ms-2 mb-0"><b>If service items contain flex/variable selections, require time match</b> </label>  
                                &nbsp;
                                    <Icon icon="tabler:info-circle" v-c-popover="getPopUpHelpObj('help_flex_selections_match_time')" :height="18"/> 
                            </div>
                        </div>
                        
                    </div>
                    </CAccordionBody>
                    </CAccordionItem>
                </CAccordion>    
                <div class="row">
                    <div class="col-md-12">
                        <button type="button" @click="AddNewPackage" class="btn btn-success float-end">{{add_edit_string}} Package</button>
                    </div>
                </div>
            </div>
        </form>
      </CCol>
    </CRow>
  </div>
</template>
<script>
import { Icon } from '@/common/Icon';
import { required, minValue } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { CAccordion } from '@coreui/vue'
import {debounce as lodash_debounce} from 'lodash/core'
import moment from 'moment-timezone'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Alerts from '../Alerts'
import utils_lib from '../../helpers/utils_lib';

export default {
    name: 'Add_Package',
    components:{
        Alerts,flatPickr, Icon
    },
    setup: () => ({ v$: useVuelidate() }),
    data(){
      return({
        in_package_id: this.$route.params.package_id || null,
        currency_symbol:this.$store.state.business_settings.business_currency_symbol,
        isActive: false,
        type_options:[
            {type:1,name:"Series (all items over multiple uses)"},
            {type:2,name:"Single (any items in one use)"} //,
          //  {type:3,name:"Gift Card"}
        ],
        user_final_package_price: 0,
        user_final_package_discount: 0,
        services_option:[],
        products_option:[],
        service_category_option: [],
        product_category_option: [],
        date_picker_config: {
            altFormat: "F j, Y",
            altInput: true,
            // noCalendar: true,
            // enableTime: true,
            // time_24hr: true
        },
        alert:false,
            show:0,
            alertData:{
                message:'',
                type:''
            },
        selected_services:[],
        selected_products:[],
        selected_service_categories:[],
        selected_product_categories:[],
        package_items:[],
        package_name:'',
        package_code:'',
        package_description:'',
        package_type:{type:1,name: "Series (all items over multiple uses)"},
        package_valid_from_date:'',
        package_valid_to_date:'',
        
        package_value: 0,
        package_override_total_service_time: 0,
        allow_online_sales :false,
        expiry_days_after_purchase: 0,
        discount_percent_for_services   : 0,  
        discount_percent_for_products   : 0,  
        recur_period                    : 1,   //1 = every month, 2 = every year
        recur_max_periods               : 9998,   //Number of months/years before it stops recurring
        recur_cancel_fee                : 0,
        recur_setup_fee                 : 0,
        recur_late_fee                  : 0,
        recur_client_requested_pause_fee: 0,      //Fee applied when client requests a pause of recurring (temporary stop in membership)
        is_package_recurr_allowed  : false,
        recurr_allow_services_rollover  : false,
        consume_on_purchase: false,
        collect_tax_at_purchase: false,
        must_sell_as_recurring_package: false,
        add_edit_string: "Add",
        confirm_discount_flex_items: false,
        svc_confirm_discount_flex_items: false,
        svc_cat_confirm_discount_flex_items: false,
        flex_selections_match_price: false,
        flex_selections_match_time: false,
        selection_map: new Map(),
        timeout: null,
        hasBorderAnimation: false,
        hasBorderAnimationDiscount: false,
      })
    },
    validations:{
      package_name:{
        required
      },
      package_code:{
        required
      }
    },
    created(){
        let sprom = this.getServicesList()
        let pprom = this.getProductsList()
        let scprom = this.getServiceCategoryList()
        let pcprom = this.getProductCategoryList()
        
        this.setData(sprom, pprom)
    },

    computed: {
        
        discount_amount: function(){
            let tpp = (this.total_price - this.total_discouted_price) 
            tpp = this.roundto2(tpp);
            
            return tpp;
        },
        discount_percent: function(){
            if (this.total_price <0.001)
            {
                return 0;
            }
            let tpp = (this.total_price - this.total_discouted_price) / this.total_price;
            tpp = Math.round(Math.abs(tpp) *100);
            
            return tpp;
        },

        total_time: function () {
            let tt = 0;
            this.package_items.map((item)=>{
                if(item.item_type == "S"){
                    tt+= item.service_time * item.qty_allowed_in_package
                }
            })
        return tt;
        },
        total_price: function () {
            let tp = 0;
            this.package_items.map((item)=>{
                tp+= this.calc_extended_price(item.item_price , item)
            })
            return parseFloat(tp).toFixed(2);
        },
        total_discouted_price:function(){
            let tpp = 0;
            this.package_items.map((item)=>{
                //console.log(item);
                //console.log("--a--a-a-")
                tpp+= this.calc_extended_price(item.item_package_price , item)
            })
        return parseFloat(tpp).toFixed(2);
        },

        estimated_tax_and_rate_raw_html:function(){
         
            let str = '<td colspan="4" class="text-right"><strong>Est. tax on package sale</strong></td>';
                         
            let bsettings = this.$store.state.business_settings;
            if (this.collect_tax_at_purchase == false)
            {
                return str + '<td class="text-right"><strong> \
                              0% </strong> \
                            </td> \
                            <td> $0 </td>';
            }

            let tax_data = this.calculate_blended_tax(bsettings.tax_data_array, this.package_items);
            let str_total_tax = this.currency_symbol + '' + tax_data.total_tax
            let str_tax_percent = tax_data.blended_tax_rate + '%'
            return  str + '<td class="text-right"> \
                              ' + str_tax_percent + ' \
                            </td> \
                            <td> ' +  str_total_tax +  '</td>';
          
        }
    },
    unmounted() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    },
    methods:{
        handleBlur() {
            let that = this;
            this.hasBorderAnimation = true;
            this.timeout = setTimeout(function() {
                that.hasBorderAnimation = false;
            }, 4000);
        },
        handleBlurDiscount() {
            let that = this;
            this.hasBorderAnimationDiscount = true;
            this.timeout = setTimeout(function() {
                that.hasBorderAnimationDiscount = false;
            }, 4000);
        },
        
    calculate_package_price(unit_price)
    {
            let tpp = 0;
            let that = this
            let disc = 1.0 - (this.discount_percent/100)
            this.package_items.map((item)=>{
                //Do not modify original
                let litem = JSON.parse(JSON.stringify(item))
                litem.item_package_price = unit_price * disc
                tpp+= that.calc_extended_price(litem.item_package_price , litem)
            })
            return utils_lib.roundto3digits( tpp);
    },
    calculate_package_price_for_flex(item)
    {
            let tpp = 0;
            let that = this
            let soi = item
            this.package_items.map((obj)=>{
                //Do not modify original
                let litem = JSON.parse(JSON.stringify(obj))
            
                if (obj.selectable_times && obj.selectable_times.length)
                {
                    if (soi.ref_item_id == obj._id)
                    {
                        //
                        for(let i=0; i<obj.selectable_times.length; i++)
                        {
                            if(obj.selectable_times[i]._id ==  soi._id)
                            {
                                
                                let purch_price  =obj.selectable_times[i].package_price;
                                litem.item_package_price = purch_price
                
                                tpp+= that.calc_extended_price(purch_price , litem)
                                break;
                            }
                            
                        }
                    }
                }


            }) //end map package
            console.log("asda---s")
            console.log(this.package_items)
            return utils_lib.roundto3digits( tpp);
    },
    calculate_blended_tax(tax_data_array, item_list)
    {
        let ptotal = 0
        let stotal = 0
        let that = this;
        item_list.map((item)=>{
            if(item.item_type == "S" || item.item_type == "SVCAT"){
                stotal+= that.calc_extended_price(item.item_package_price , item)
            }
            if(item.item_type == "P" || item.item_type == "PRCAT"){
                ptotal+= that.calc_extended_price(item.item_package_price , item)
            }
        })

        if (stotal+ptotal < 0.001)
        {
            return 0;
        }
        
        let svcp_tax = utils_lib.calculate_tax('S', 
                                                stotal,
                                                '99999',
                                                tax_data_array);
                                                            
        let prodp_tax = utils_lib.calculate_tax('P', 
                                                ptotal,
                                                '99999',
                                                tax_data_array);
        console.log("asdasd -- - - svcp_tax");
        console.log(svcp_tax);
        console.log("asdasd -- - - prodp_tax");
        console.log(prodp_tax);
        
        //Blended rate for package
        let total_package_item_tax = svcp_tax.total_tax + prodp_tax.total_tax;
        let blended_pkg_tax_rate =  parseFloat((total_package_item_tax /(stotal+ptotal))*100).toFixed(3);
        console.log("asdasd -- - - bleded tax rate");
        console.log(blended_pkg_tax_rate);
                    
        return {blended_tax_rate: blended_pkg_tax_rate, 
                total_tax: total_package_item_tax,
                total_taxable_amount: (stotal+ptotal)
             }
    },
    getPerUnitDiscountPercent(ip, pp)
    {
        
        return -1*utils_lib.roundto2digits( ((ip-pp)/ip)*100)  + "%";
    },
        changeItemUnitPrice(item, event){
            this.package_items.find((obj)=>{
                if(obj.item_id.toString() == item.item_id.toString()){
                    obj.item_price = event.target.value;
                }
            })
        },
        changeQuantity(item,event){
            this.package_items.find((obj)=>{
                if(obj.item_id.toString() == item.item_id.toString()){
                    obj.qty_allowed_in_package = event.target.value;
                }
            })
        },
        changeFreeQuantity(item,event){
            this.package_items.find((obj)=>{
                if(obj.item_id.toString() == item.item_id.toString()){
                    obj.item_qty_free = event.target.value;
                }
            })
        },
        changePackagePrice(item,event){
            this.package_items.find((obj)=>{
                if(obj.item_id.toString() == item.item_id.toString()){
                    obj.item_package_price = event.target.value;
                }
            })
        },
        applyUserDiscount(discount_percent)
        {
           let disc = 1.0-(discount_percent/100.0)
            let that = this;
            this.package_items.find((obj)=>{
                
                    obj.item_package_price = utils_lib.roundto2digits( obj.item_price * disc)
                    that.selection_map.forEach((item) => {
                        console.log("Asdasdasd");
                        console.log(item);
                        that.doApplyFlexItemPurchaseDiscount(obj,item, null, discount_percent)
                    })
                    
            }); 
        },
        userChangedFinalPackageDiscount()
        {
            if(this.user_final_package_discount >0)
            {
                this.applyUserDiscount(this.user_final_package_discount)
            }
        },
        userChangedFinalPackagePrice()
        {
            let target_price = this.user_final_package_price;
            if(target_price >0)
            {
                let target_discount = this.total_price - this.user_final_package_price;
                if (target_discount < 0)
                {
                    target_discount = 0
                }
                target_discount = utils_lib.roundto3digits((target_discount/this.total_price) * 100) ;
                this.applyUserDiscount(target_discount)
            }
            
        },
        async setData(sprom, pprom)
        {
              if (this.in_package_id === null)
              {
                  return;
              }
              this.add_edit_string = "Update"
              await sprom;

              await pprom;
              this.getPackageDetail()
            
        },
        getPackageDetail(){
            this.$schedsdk.get_package_detail({package_id:this.in_package_id}).then((result)=>{
                if(result.status == 1)
                {
                    this._id = result.data._id
                    this.package_name                        = result.data.package_name,
                    this.package_code                        = result.data.package_code,
                    this.package_description                 = result.data.package_description,
                    this.package_type                        = this.type_options.find((obj)=>{if (obj.type == result.data.package_type) return obj})
                    this.package_valid_from_date             = result.data.package_valid_from_date,
                    this.package_valid_to_date               = result.data.package_valid_to_date,
                    this.recur_max_periods                   = result.data.recur_max_periods,
                    this.discount_percent_for_services       = result.data.discount_percent_for_services || 0 
                    this.discount_percent_for_products       = result.data.discount_percent_for_products || 0 
                    
                    this.package_value                       = result.data.package_value,
                    this.package_purchase_price              = result.data.package_purchase_price,
                    this.package_override_total_service_time = result.data.package_override_total_service_time,
                    this.allow_online_sales                  = result.data.allow_online_sales,
                    this.expiry_days_after_purchase          = result.data.expiry_days_after_purchase,
                    this.recur_period                        = result.data.recur_period,                                                              //1 = every month, 2 = every year
                    this.recur_max_periods                   = result.data.recur_max_periods,                                                         //Number of months/years before it stops recurring
                    this.recur_cancel_fee                    = result.data.recur_cancel_fee,
                    this.recur_setup_fee                     = result.data.recur_setup_fee,
                    this.recur_late_fee                      = result.data.recur_late_fee,
                    this.is_package_recurr_allowed           = result.data.is_package_recurr_allowed,
                    this.recur_client_requested_pause_fee    = result.data.recur_client_requested_pause_fee,                                          //Fee applied when client requests a pause of recurring (temporary stop in membership)
                    this.recurr_allow_services_rollover      = result.data.recurr_allow_services_rollover
                    this.consume_on_purchase                 = result.data.consume_on_purchase,
                    this.collect_tax_at_purchase             = result.data.collect_tax_at_purchase || false,
                    this.must_sell_as_recurring_package      = result.data.must_sell_as_recurring_package || false
                    this.package_items                       = result.data.package_items
                    this.confirm_discount_flex_items         = result.data.confirm_discount_flex_items;
                    this.flex_selections_match_price = result.data.flex_selections_match_price;
                    this.flex_selections_match_time = result.data.flex_selections_match_time;
               
                    result.data.package_items.map((obj)=>{
                        if(obj.item_type == "S"){
                            this.services_option.map((service)=>{
                                if(service._id.toString() == obj.item_id.toString()){
                                    this.selected_services.push(service);
                                }
                            })
                        }
                        else if(obj.item_type == "P"){
                            this.products_option.map((product)=>{
                                if(product._id.toString() == obj.item_id.toString()){
                                    this.selected_products.push(product);
                                }
                            })
                        }
                        else if (obj.item_type == "SVCAT") {
                            this.service_category_option.map((servicecat)=>{
                                if(servicecat._id.toString() == obj.item_id.toString()){
                                    this.selected_service_categories.push(servicecat);
                                }
                            })
                        }
                        else if (obj.item_type == "PRCAT") {
                            this.product_category_option.map((prodcat)=>{
                                if(prodcat._id.toString() == obj.item_id.toString()){
                                    this.selected_product_categories.push(prodcat);
                                }
                            })
                        }
                    })
                    // this.changeServiceProduct()
                    this.displayFlexibleOptions();
                } //end if
            })
        },
        async getServicesList() {
            return this.$schedsdk.list_services({page_no:1})
                        .then((result)=>{
                                if(result.status == 1){
                                this.services_option = result.data
                        }
                }).catch(ex=>{
                this.alertData = {
                    message:ex.message,
                    type:'danger'
                }
                this.alert = true;
                this.show=4;
            });
        },
        async getProductsList(){
            return this.$schedsdk.get_products_list({page_no: 1})
                .then((result)=>{
                if(result.status == 1){
                    this.products_option = result.data;
                }
            }).catch(ex=>{
                this.alertData = {
                    message:ex.message,
                    type:'danger'
                }
                this.alert = true;
                this.show=4;
            });
           
        },
        getFlexItemPackageQty(item)
        {
            return item.qty_allowed_in_package;
        },
        getFlexItemPackageDiscount(item, preferred_package_price = null)
        {
            let pack_price =  null;
            let soi =item;
            if (preferred_package_price !== null )
            {
                pack_price  = preferred_package_price;
            }
            else
            {
                pack_price = soi.package_price
            }
            console.log("----s--s-s getiing discoun.asd.as. ");
            console.log(pack_price);
            console.log(soi);
            
            if (pack_price === undefined ||  pack_price == null ||
                  (soi.price >0 && soi.package_price == 0) )
            {
                //Default to zero
                return 0;
            }
            let disc = (pack_price-soi.price)/ soi.price
            return  utils_lib.roundto3digits(disc*100);
        },
      
        getFlexItemPackagePrice(item)
        {
            if (item.package_price === undefined || 
                 (item.price >0 && item.package_price == 0) )
            {
                //Default to zero
                return item.price;
            }
            return item.package_price;
        },

        doApplyFlexItemPurchaseDiscount(obj, item, new_purchase_price, new_discount = null)
        {
            let soi = item;
             
            if (obj.selectable_times && obj.selectable_times.length)
            {
                if (soi.ref_item_id == obj._id)
                {
                    //
                    for(let i=0; i<obj.selectable_times.length; i++)
                    {
                        if(obj.selectable_times[i]._id ==  soi._id)
                        {
                            let disc = 0;
                            if (new_discount !== null)
                            {
                                  console.log("XXX  dasds ");
                                  console.log(new_discount)
                                disc = Math.abs(new_discount);
                            }
                            else
                            {   console.log("Asdasd new pr ");
                                console.log(new_purchase_price)
                                disc = this.getFlexItemPackageDiscount(soi,new_purchase_price)
                            }
                            let purch_price  =obj.selectable_times[i].price;
                            if(new_purchase_price === undefined || new_purchase_price === null)
                            {
                                purch_price = obj.selectable_times[i].price * (1-(disc/100))
                            }
                            else
                            {
                                purch_price = new_purchase_price;
                            }
                            purch_price = utils_lib.roundto3digits(purch_price)
                            console.log("XXXasdasdsadasdasdasd");
                            console.log(disc,purch_price );
                            
                            obj.selectable_times[i].package_price = purch_price
                            soi.package_price = purch_price
                            console.log( obj.selectable_times[i])
                            //soi.pack = purch_price
                            break;
                        }
                        
                    }
                }
            }
            
        },
        
        doChangeFlexItemPurchasePrice(obj, item, new_val)
        {
             this.doApplyFlexItemPurchaseDiscount(obj,item,new_val)
        },
        changeFlexItemPackagePurchasePrice(item,e)
        {
            let that  = this
            this.package_items.forEach((obj)=>{
            console.log("asdasd000a000000==== " + e.target.value);
                console.log(obj.selectable_times)
                console.log(item)
                //that.checkAndAddSelectableTimes(obj, that.selection_map);
                that.doChangeFlexItemPurchasePrice(obj, item,e.target.value)
            });
            console.log( this.package_items)
            return true
        },
        changeFlexItemPackageDiscount(item,e)
        {
            let  new_disc = 0
            if (e.target.value != null && e.target.value != "")
            {
                new_disc = parseFloat(e.target.value);
            }
            let that  = this
            this.package_items.forEach((obj)=>{
                //console.log("asdasd000a000000==== " + e.target.value);
                //console.log(obj.selectable_times)
                //console.log(item)
                //that.checkAndAddSelectableTimes(obj, that.selection_map);
                console.log("asdasdsadasdasdasd");
                console.log(new_disc);
                that.doApplyFlexItemPurchaseDiscount(obj,item,null, new_disc)
            });
              
            return true
        },
        getFlexUniqueKey(selectObj)
        {
            let note = ""
            if (selectObj.note)
            {
                note = selectObj.note.toLowerCase().trim();
            }
            return note+"_"+selectObj.time+"_mins";
        },
        checkAndAddSelectableTimes(obj, selection_option_map)
        {
            let curr_price = -9999999;
            if(obj.enable_flexible_time &&
                       obj.selectable_times && 
                       obj.selectable_times.length)
            {
                console.log("Asd=a=afas")
                console.log(obj.selectable_times)
                for(let i=0; i<  obj.selectable_times.length; i++)
                {
                    //Copy - 
                    let selectable = JSON.parse(JSON.stringify(obj.selectable_times[i]))
                    selectable.ref_item_id = obj._id;
                     console.log("Asd=a=sssSSSafas")
                console.log(selectable)
                    let flexkey = this.getFlexUniqueKey(selectable);
                    let fobj = selection_option_map.get(flexkey)
                    if (fobj && fobj.price<selectable.price)
                    {
                        fobj.price = selectable.price;
                       
                        fobj.ref_item_id = selectable.ref_item_id;
                    }
                    else
                    {
                        fobj = selectable;
                    }
                    fobj.package_price = selectable.package_price;
                    if (fobj.price > curr_price)
                    {
                        curr_price = fobj.price;
                    }
                    //console.log("asdasda--- FLEX key");
                    //console.log(flexkey, fobj);
                    selection_option_map.set(flexkey, fobj)
                }
            }
            return curr_price; //returns highest price in selection obk
                    
        },
        displayFlexibleOptions(){
            this.selection_map.clear();
            let that= this;
            //Check for services and get unique options
            this.package_items.forEach((obj)=>{
                 //console.log("asdasd000a000000==== ");
                //console.log(obj)
                that.checkAndAddSelectableTimes(obj, that.selection_map);

            });
           
                
        },
        changeServiceProduct(){
            let flex_items = false
            let services = this.selected_services.map((obj)=>{
                let item = {
                        item_id :obj._id ,
                        item_type :"S",
                        copied_item_name :obj.name,             //copied from original item_tables
                        qty_allowed_in_package :1,
                        item_price: obj.price,                  // Original copied from item tables
                        item_package_price: obj.price,                  //This is user (owner/receptionist) provided for this package
                        item_discount_application_method: 1,                  // 1 = percent. 2 = limited to item_price upon package purchase.
                        item_qty_free : 0,      //How many items are free (100% discount)
                        service_time :obj.time,
                        enable_flexible_time: false,
                        selectable_times: []
                    }
                    //If we have flexible times, find the highest price.
                    if(obj.enable_flexible_time &&
                       obj.selectable_times && 
                       obj.selectable_times.length)
                    {
                        item.enable_flexible_time = true;
                        item.selectable_times = [];
                        flex_items = true;
                        for(let i=0; i<  obj.selectable_times.length; i++)
                        {
                            //Copy - 
                             item.selectable_times.push(JSON.parse(JSON.stringify(obj.selectable_times[i])))
                             item.selectable_times[i].ref_item_id = obj._id;
                             item.selectable_times[i].package_price =  item.selectable_times[i].price
                            if (item.item_price < obj.selectable_times[i].price)
                            {
                                item.item_price =  obj.selectable_times[i].price

                            }
                        }
                    }
                    return item;
                })
            
            this.svc_confirm_discount_flex_items = flex_items;
            let s_prod = this.selected_products.map((obj)=>{
                let item = {
                    item_id :obj._id ,
                    item_type :"P",
                    copied_item_name :obj.name,             //copied from original item_tables
                    qty_allowed_in_package :1,
                    item_price: obj.price,                  // Original copied from item tables
                    item_package_price: obj.price,                  //This is user (owner/receptionist) provided for this package
                    item_discount_application_method: 1,                  // 1 = percent. 2 = limited to item_price upon package purchase.
                    item_qty_free : 0,      //How many items are free (100% discount)
                    service_time :obj.time,
                    enable_flexible_time: false,
                    selectable_times: []
                    }
                    return item;
                })   
                
                for(let i=0;i<services.length;i++){
                    let s_find = this.package_items.find((pkg_item)=>{
                        if(pkg_item.item_id == services[i].item_id){
                            return pkg_item
                        }
                    });
                    if(!s_find){
                           console.log("services[i].item_id **** " + services[i].item_id)
                      
                        this.package_items.push(services[i])
                    }
                }
                for(let i=0;i<s_prod.length;i++){
                    let p_find = this.package_items.find((pkg_item)=>{
                       
                        if(pkg_item.item_id == s_prod[i].item_id){
                            return pkg_item
                        }
                    });
                    if(!p_find){
                           console.log("prod[i].item_id **** " + s_prod[i].item_id)
                      
                        this.package_items.push(s_prod[i])
                    }
                }

               this.displayFlexibleOptions();
              //  this.package_items = this.package_items.concat(services);
                //this.package_items = this.package_items.concat(s_prod);
        },

         async getServiceCategoryList() {
            return this.$schedsdk.get_service_categories({page_no:1})
                        .then((result)=>{
                                if(result.status == 1){
                                this.service_category_option = result.data
                        }
                }).catch(ex=>{
                this.alertData = {
                    message:ex.message,
                    type:'danger'
                }
                this.alert = true;
                this.show=4;
            });
        },
        
        async getProductCategoryList(){
            return this.$schedsdk.get_product_category({})
                .then((result)=>{
                if(result.status == 1){
                    this.product_category_option = result.data;
                }
            }).catch(ex=>{
                this.alertData = {
                    message:ex.message,
                    type:'danger'
                }
                this.alert = true;
                this.show=4;
            });
           
        },
        getHighestPriceInCategory(cat_id, cat_tag, item_list)
        {
              let curr_price = -999999;
              let obj = null;
              for(let i=0;i<item_list.length;i++)
              {
                if (item_list[i][cat_tag]._id == cat_id && 
                    item_list[i].price >= curr_price)
                 {
                     obj = item_list[i];
                     curr_price =  item_list[i].price ;
                     if(obj.enable_flexible_time &&
                       obj.selectable_times && 
                       obj.selectable_times.length)
                    {
                        for(let i=0; i<  obj.selectable_times.length; i++)
                        {
                            if (curr_price < obj.selectable_times[i].price)
                            {
                                curr_price =  obj.selectable_times[i].price
                            }
                        }
                    } //end if selectable
                 }
              }
              return {item:obj, price: curr_price};
        },
        getUniqueFlexibleOptionsInCategory(cat_id, cat_tag, item_list, selection_option_map)
        {
            let item = null;
            let curr_price = -999999;
             
            for(let i=0;i<item_list.length;i++)
            {
                if (item_list[i][cat_tag]._id == cat_id)
                {
                    item = item_list[i];
                    
                    let lclhigh = item.price;
                    let subh = this.checkAndAddSelectableTimes(item, selection_option_map);
                    if (subh > lclhigh)
                    {
                        lclhigh = subh;
                    }
                    if (lclhigh > curr_price )
                    {
                        curr_price = lclhigh;
                    }
                }
            }
            return curr_price;
        },
        changeItemsInPackage(){
            this.package_items = [] 
            this.changeServiceProductCategory();
            this.changeServiceProduct()
        },
        changeServiceProductCategory(){

            let that = this;
            let flex_items = false
          
            let service_categories = this.selected_service_categories.map((obj)=>{
                //get highest price in service category.

                let selectable_options = new Map();

                //console.log("Asdsadkajj-s----s")
                //console.log(obj)
                let highprice = that.getUniqueFlexibleOptionsInCategory(obj._id, 
                                                             "service_category", 
                                                             that.services_option,
                                                             selectable_options)
                highprice=    (highprice >-1) ?highprice:0
                let highItem = {price: highprice };
                let select_opt_arr = [];
                selectable_options.forEach((obj) => {
                    select_opt_arr.push(obj);
                })
                let enable_flexible_time = (select_opt_arr.length > 0)
                //console.log("adasd----a-sd-asd enable_flexible_time ");
                //console.log(select_opt_arr)
                /*that.getHighestPriceInCategory(obj._id, 
                                                             "service_category", 
                                                             that.services_option)*/
                let item = {
                        item_id :obj._id ,
                        item_type :"SVCAT",
                        copied_item_name :obj.name,             //copied from original item_tables
                        qty_allowed_in_package :1,
                        item_price: highItem!=null?highItem.price:0,              // Original copied from item tables
                        item_package_price: highItem!=null?highItem.price:0,                 //This is user (owner/receptionist) provided for this package
                        item_discount_application_method: 1,                  // 1 = percent. 2 = limited to item_price upon package purchase.
                        item_qty_free : 0,      //How many items are free (100% discount)
                        //service_time :obj.time
                        enable_flexible_time: enable_flexible_time,
                        selectable_times: select_opt_arr
                    }
                    //if false, then take new enable flag. Else, keep it true
                    flex_items = (flex_items==false)?enable_flexible_time:true;
                    return item;
                }
                )
          
            this.svc_cat_confirm_discount_flex_items = flex_items;
    
            let s_prod_cat = this.selected_product_categories.map((obj)=>{
                let highItem = that.getHighestPriceInCategory(obj._id, "product_category", that.products_option)
             
                let item = {
                    item_id :obj._id ,
                    item_type :"PRCAT",
                    copied_item_name :obj.name,             //copied from original item_tables
                    qty_allowed_in_package :1,
                    item_price: highItem!=null?highItem.price:0,         //TBD: obj.price,                  // Original copied from item tables
                    item_package_price:highItem!=null?highItem.price:0,        //obj.price,                  //This is user (owner/receptionist) provided for this package
             
                    item_discount_application_method: 1,                  // 1 = percent. 2 = limited to item_price upon package purchase.
                    item_qty_free : 0,      //How many items are free (100% discount)
                    //service_time :obj.time
                    }
                    return item;
                })   
                //selected_service_categories
                for(let i=0;i<service_categories.length;i++){
                    let s_find = this.package_items.find((pkg_item)=>{
                        if(pkg_item.item_id == service_categories[i].item_id){
                            return pkg_item
                        }
                    });
                    if(!s_find)
                    {
                           //console.log("service_categories[i].item_id **** " + service_categories[i].item_id)
                     
                        this.package_items.push(service_categories[i])
                    }
                }
                for(let i=0;i<s_prod_cat.length;i++){
                    let p_find = this.package_items.find((pkg_item)=>{
                        if(pkg_item.item_id == s_prod_cat[i].item_id){
                            return pkg_item
                        }
                    });
                    if(!p_find){
                           console.log("s_prod_cat[i].item_id_***  " + s_prod_cat[i].item_id)
                     
                        this.package_items.push(s_prod_cat[i])
                    }
                }

               this.displayFlexibleOptions();

                //console.log("=============== pack items")           
                //console.log(this.package_items)           
               // this.package_items = this.package_items.concat(service_categories);
                //console.log(this.package_items)           
                //this.package_items = this.package_items.concat(s_prod_cat);
                //console.log(this.package_items)           
        },
        
        getPopUpHelpObj(help_item)
        {
 
            let v = {
                        header: 'Description',
                        trigger: 'click',  
                        content: '',
                    }
            switch (help_item)
            {
                case 'help_category_package_item': v.header = "Category type package item"; 
                        v.content = "Any item from this category is given a fixed price as set in Discounted Unit Price. The Unit Price shown is the highest value of an item in the category"
                        break;
                case 'help_category_collect_tax_on_package_purchase':
                        v.header = "Collect tax upon package purchase"; 
                        v.content = "Applies if some or all of the package items are taxable. If checked, tax is collected upon purchase of package on package price. If unchecked, the tax is collected at redemption time on discounted item price. This may require customer to pay the taxes using a card/cash. This option used for correct compliance of local tax laws."
                        break;
                case 'help_category_must_require_recurrance':
                        v.header = "Require customer to agree to recurrance"; 
                        v.content = "This will require the customer to allow automatic charging at a set schedule and will also require them to save their card to make a purchase."
                   
                        break;

                case 'help_flexible_price_package':
                        v.header = "Package is flexibly priced"; 
                        v.content = "The package contains items that have variable attributes (time, size etc). " +
                            " So the package's price is calculated at the time of purchase. " +
                             "This package fixes the <b>number of items (quantity)</b> as listed and "+
                             "</b>the discount percent.</b> " +
                             "The price of the package at purchase is calculated by applying the " +
                             "shown discount percent to regular price." 
                             
                        break;
                case 'help_flex_selections_match_price':
                        v.header = "Flex Package - Match Original Price of item"; 
                        v.content = "When package contains items that have variable attributes " + 
                           " (time, size etc), you can prevent expensive items being redeemed on a package that is valued at much less than that item." +
                            "<br><br>The original item price (not discounted price)" +
                            " in package is required to be less than or equal to item being redeemed" +
                            "<br><br>For ex. undiscounted price of service being added for redemption is $200." + 
                            "Customer has a package with item package price = $100, original price = $150. " +
                            "<br><br>Enabling this option means above is <b>NOT</b> matched because $150 is NOT less than $200."  +
                            "If service added = $100, this is matched since its service original price $100 < package original price of $150 "  +
                            "" +
                            "<br><br>"
                       break;
                case 'help_flex_selections_match_time':
                        v.header = "Flex Package - Match time/duration of service item"; 
                        v.content = "When package contains items that have variable attributes (time, size etc). " +
                            "The duration " +
                            " of item in package must be more than or equal to the time of service being added for redemption." +
                            "<br><br>For ex. time of service for redemption is 65 mins." + 
                            "Customer has a package with time selection in package = 60 mins. " +
                            "<br><br>Enabling this option means above is <b>NOT</b> matched."  +
                            "If being redeemed duration is 50 mins, then this is matched since 50 mins < package duration of 60 mins "  +
                            "This option is provided if you need to prevent longer duration items being redeemed on a " +
                            " package that was purchased for smaller duration." +
                            "<br><br>"
                    
                       break;    
                default:
                        break;    
            }
            return v;
        },
        alertClosedFn() {
        this.show = 0;
        },
        AddNewPackage(e){
            e.preventDefault();
            this.v$.$touch()
            let timezone = this.$store.state.business_settings.business_time_zone;
            let req_data =  {
                "package_name"                       : this.package_name,
                "package_description"                : this.package_description,
                "package_code"                       : this.package_code,
                "package_type"                       : this.package_type.type,
                "expiry_days_after_purchase"         : this.expiry_days_after_purchase,
                "package_items"                      : this.package_items,
                "package_purchase_price"             : this.total_discouted_price,
                "package_value"                      : this.total_price,
                "package_override_total_service_time": this.total_time,
                "package_valid_from_date"            : moment.tz(moment(this.package_valid_from_date).format('YYYY-MM-DD'), timezone).valueOf(),
                "package_valid_to_date"              : moment.tz(moment(this.package_valid_to_date).format('YYYY-MM-DD'), timezone).valueOf(),
                "recur_period"                       : this.recur_period,                                                                          //1 = every month, 2 = every year
                "recur_max_periods"                  : this.recur_max_periods,                                                                     //Number of months/years before it stops recurring
                "recur_cancel_fee"                   : this.recur_cancel_fee,
                "recur_setup_fee"                    : this.recur_setup_fee,
                "recur_late_fee"                     : this.recur_late_fee,
                "recur_client_requested_pause_fee"   : this.recur_client_requested_pause_fee,                                                      //Fee applied when client requests a pause of recurring (temporary stop in membership)
                "recurr_allow_services_rollover"     : this.recurr_allow_services_rollover,
                "allow_online_sales"                 : this.allow_online_sales,
                "is_package_recurr_allowed"          : this.is_package_recurr_allowed,
                "consume_on_purchase"                : this.consume_on_purchase,
                "discount_percent_for_products"      : this.discount_percent_for_products,
                "discount_percent_for_services"      : this.discount_percent_for_services,
                "collect_tax_at_purchase"            : this.collect_tax_at_purchase,
                "confirm_discount_flex_items"        : this.confirm_discount_flex_items,
                "flex_selections_match_price"        : this.flex_selections_match_price,
                "flex_selections_match_time"         : this.flex_selections_match_time,
                "must_sell_as_recurring_package"     : this.must_sell_as_recurring_package
                 
            } 
            console.log("as--s-s POS");
             console.log(this.package_items)
            if(!this.v$.$invalid){
                this.alert = false;
                //Default to add_package
                
                let callprom = null;
                if (this.in_package_id != null)
                {
                    //If Package ID was provided, then we are editing package
                    
                    req_data._id  = this.in_package_id;
                    callprom = this.$schedsdk.edit_package(req_data);
                }
                else
                {
                    callprom = this.$schedsdk.add_package(req_data);
                }
                callprom.then((result)=>{  
                if(result.status == 1)
                {
                    this.$router.push('/packages/list');
                }
                else
                {
                    this.alertData = {
                        message:result.message,
                        type:'danger'
                    }
                    this.alert = true;
                    this.show=4;
                }
                }).catch(ex=>{
                this.alertData = {
                    message:ex.data.message,
                    type:'danger'
                }
                this.alert = true;
                this.show=4;
                });
            }
        },
        roundto2(v)
        {
                return Math.round((v*100)/100);
        },
        calc_extended_price(unit_price, item)
        {
            return unit_price * (item.qty_allowed_in_package - item.item_qty_free)
        }

    }
}
</script>
<style lang="scss" scoped>
.invalid{
  border: 1Px solid red;
  /* background-color: lightcoral; */
  color: red;
}
.error-msg{
  color: red;
}
.max-unit-div {
  position: relative;
  width: 100px;
  .form-control {
    padding-left: 18px; 
    padding-right: 25px;
  }
  .form-control:focus + .span-symbol, .form-control:focus + .span-symbol + .span-icon {
    color: #000; 
  }
  .span-symbol, .span-icon {
    position: absolute;
  }
  .span-symbol {
    left: 7px;
    top: 12px;
  }
  .span-icon {
    right: 3px;
    top: 10px;
  }
}
.discount-unit-div {
  position: relative;
  .form-control {
    padding-left: 20px;
    padding-right: 45px;
  }
  .form-control:focus + .span-symbol, .form-control:focus + .span-symbol + .span-unit {
    color: #000; 
  }
  .span-symbol, .span-unit {
    position: absolute;
  }
 
}
.md-checkbox {
  svg {
    color: var(--text-primary-color)
  }
  
}
@media (max-width: 991.98px) {
    table {
        .form-control, .max-unit-div {
            max-width: 160px;
        }
    }
    
      .max-unit-div .span-symbol {
        top: 14px;
      }
      .discount-unit-div .span-symbol {
        top: 14px;
      }
     
}
</style>