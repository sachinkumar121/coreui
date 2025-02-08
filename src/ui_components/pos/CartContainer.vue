<template>
    <div class="sticky-top">
        <div class="product-table mt-3 border rounded-3" :style="detailItemStyle">
            <div v-if="items.length == 0" class="d-flex align-items-center justify-content-center flex-wrap h-100">
                <div>
                    <img src="/img/empty-cart.svg" alt="img-empty" width="80px">
                    <p class="h5 mt-3 d-block fw-normal">Empty cart!</p>
                </div>
            </div>
            <table class="table mb-0">
                <tbody>
                    <CartItemRow 
                        v-for="item in items" :key="item.id" 
                        :item="item" 
                    />
                </tbody>
            </table>
        </div>
        <DiscountSection 
            v-if="coupon"
            :coupon_code="coupon.coupon_code"
            @on-remove="$emit('onRemoveCoupon')"
        />
        <div class="mt-3 border rounded-3 bg--white" v-if="items.length > 0">
            <div class="border-bottom-dashed">
                <table class="table table-sub-total table-borderless mb-0 rounded-3">
                    <tbody>
                        <!--<tr>
                            <td class="f-16 fw-500 text-g-color">Total Items</td>
                            <td class="f-16 fw-500 text-end">{{ items.length }}</td>  
                        </tr>
                        -->
                        <tr>
                            <td class="f-16 fw-500 text-g-color">Subtotal ({{ items.length }} Items)</td>
                            <td class="f-16 fw-500 text-end">{{currency_symbol}}{{sub_total}}</td>  
                        </tr>
                        <tr v-if="coupon && discount_value">
                            <td class="f-16 fw-500 text-g-color">Discount({{ coupon.discount_type == 1 ? `${coupon.amount}%` : `${currency_symbol}${coupon.amount}` }})</td>
                            <td class="text-end">
                                <span class="f-16 fw-500 text-end text-red">- {{currency_symbol}}{{discount_value}}</span>
                            </td>
                        </tr>
                        <tr v-for="(tax_discount_line, index) in tax_discount_array" :key="index">
                            <td class="f-16 fw-500 text-g-color">{{ tax_discount_line.in}}</td>
                            <td class="f-16 fw-500 text-end">{{currency_symbol}}{{ tax_discount_line.ip }}</td>  
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="">
                <table class="table table-sub-total table-borderless mb-0">
                    <tbody>
                        <tr>
                            <td class="h5 fw-500 mb-0">Total</td>
                            <td class="h5 fw-500 text-end mb-0">{{currency_symbol}}{{total}}</td>  
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="p-3 text-center border-t-1">
                <slot name="checkout-button"></slot>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import utils_lib from '@/helpers/utils_lib'

import CartItemRow from "@/ui_components/pos/CartItemRow.vue"
import DiscountSection from "@/ui_components/pos/DiscountSection.vue"
import usePos from '@/composables/usePos';

export default {
    name: 'CartContainer',
    setup: () => {
        const { mapPosItemToCartItem, getItemNumericInfo } = usePos();
        return { mapPosItemToCartItem, getItemNumericInfo }
    },
    components: {
        CartItemRow,
        DiscountSection
    },
    props: {
        coupon: {
            type: Object,
            default: null
        },
        package: {
            type: Object,
            default: null
        }
    },
    emits: ['onRemoveCoupon'],
    mounted() {
        if (this.items.length) {
            this.getInvoiceInfo();
        }
        this.updateDeviceOrientation();
        // Listen for window resize events and update windowWidth
        window.addEventListener('resize', this.updateDeviceOrientation);
    },
    computed: {
        ...mapState({
            items: state => state.pos.cartItems,
            customer: state => state.pos.customer
        }),
        detailItemStyle() {
            if (this.items.length > 0) {
                return {
                    height: `${this.no_of_details_item_rows * 64}px`
                };
            } else {
                return {
                    height: `200px`
                };
            }
        },
    },
    watch: {
        items: {
            handler: function(newItems) {
                if (!newItems.length) {
                    this.$emit('onRemoveCoupon');
                    this.resetCalucation();
                } else {
                    this.getInvoiceInfo();
                }
            },
            deep: true
        },
        coupon(newCoupon) {
            this.getInvoiceInfo();
        },
        package() {
            this.getInvoiceInfo();
        }
    },
    data() {
        return {
            currency_symbol: this.$store.state.business_settings.business_currency_symbol,
            sub_total: 0,
            total: 0,
            discount_value: 0,
            tax_discount_array: [],
            no_of_details_item_rows: 2,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        }
    },
    methods: {
        resetCalucation() {
            this.sub_total = 0;
            this.total = 0;
            this.discount_value = 0;
            this.tax_discount_array = [];
        },
        setSubTotal() {
            this.sub_total = utils_lib.roundto2digits(this.items.reduce((accumulator, currentValue) => accumulator + (currentValue.price * currentValue.quantity), 0));
        },
        setTotal() {
            this.total = utils_lib.roundto2digits(this.sub_total - this.discount_value);
        },
        async getInvoiceInfo() {
            if (!this.items.length) {
                return false;
            }
            let customerData = {
                email: this.$store.state.business_settings.business_info.business_email,
                phone: this.$store.state.business_settings.business_info.business_phone,
                is_anonyomus_customer: true,
                "user_id": undefined
            };

            if (this.customer) {
                customerData = {
                    "email": this.customer.email,
                    "phone": this.customer.phone,
                    "first_name": this.customer.first_name,
                    "last_name": this.customer.last_name,
                    "user_id": this.customer?._id || null,
                    "is_anonyomus_customer": this.customer?.is_new || false
                }
            }
            let data = {
                get_draft_invoice: true,
                customer: customerData,
                cart: {
                    "items": this.items.map(this.mapPosItemToCartItem),
                    cpn_pkg_codes: []
                }
            }
            if (this.coupon) {
                data.cart.cpn_pkg_codes.push(this.coupon.coupon_code);
            }
            if (this.package) {
                data.cart.cpn_pkg_codes.push(this.package.redemption_code);
            }
            const PoResponse = await this.$schedsdk.create_purchase_order(data);
            const purchaseOrderData = PoResponse.data;
            const invoice_info_summary = purchaseOrderData.purchase_order.invoice_info_summary;
            const invoice = invoice_info_summary[0];
            this.tax_discount_array = invoice.compact_detail.filter(i => i.it == "A");
            this.total = invoice.invoice_amounts.invoice_total
            this.sub_total = utils_lib.roundto2digits(invoice.compact_detail.filter(i => i.it == "P" || i.it == "S").reduce((accumulator, currentValue) => accumulator + (currentValue.ep), 0));
        },
        updateDeviceOrientation() {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
            this.updateItemNumericInfo();
        },
        updateItemNumericInfo() {
            const display_profile = this.getItemNumericInfo(this.windowWidth, this.windowHeight);
            this.no_of_details_item_rows = display_profile.no_of_details_item_rows;
        }
    },
    beforeDestroy() {
        // Clean up the event listener when the component is destroyed
        window.removeEventListener('resize', this.updateDeviceOrientation);
    }
}
</script>
<style lang="scss" scoped>
::-webkit-scrollbar-thumb {
    background-color: #6D57E4;
}
::-webkit-scrollbar {
    width: 8px;
}
::-webkit-scrollbar-track {
    background-color: #C9C9C9;
}
.product-table {
    // height: 218px;
    overflow-y: auto;
}
table.table-sub-total {
    td {
        border-radius: 15px;
    }
}
.fs-16 {
    font-size: 16px;
}
.fw-500 {
    font-weight: 500;
}
.text-g-color {
    color: #9A9AB0;
}
.border-bottom-dashed {
    border-bottom: 1px dashed var(--border-color-d9);
}
.border-t-1 {
    border-top: 1px solid var(--border-color-d9);
}
.text-red {
    color: #DE5753;
}
.bg--white {
    background: var(--background-color-primary);
}
// @media (max-width: 1280px) {
//   .product-table {
//     height: 128px;
//   }
// }
</style>