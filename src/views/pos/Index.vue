<template>
    <div class="px-3 mt-0" style="margin-top: 0 !important;">
        <Alerts 
            :alertData="alertData" 
            :show="show"
            @alertClosed="show = 0"
            v-if="alert" 
        />
        <div class="d-flex row flex-nowrap">
            <div class="col-custom-8 py-3  pos-wrap">
                <div class="row align-items-center mb-3">
                    <div class="col-sm-6">
                        <div class="d-flex align-items-center gap-2 position-relative pos-head">
                            <button
                            class="position-absolute header-toggler round-btn d-lg-inline-block rotate-btn toggle-sidebar"
                            type="button"
                            aria-label="Toggle navigation"
                            @click="sidebarToggle()"
                        >
                            <Icon icon="tabler:antenna-bars-5" :height="24" />
                            </button>
                            <h5 class="mb-0">{{ selectedCategory.name }}</h5>
                        </div>
                    </div>
                    <div class="col-sm-6 d-inline-flex justify-content-end">
                        <SearchBox 
                            @input="onSearchInput"
                            @clear-search="clearSearchResults"
                        />
                        <!-- <CartCount @toggle-class="toggleActiveClass" />  -->
                    </div>
                </div>
                <PosItemContainer 
                    :loading="loading"
                    :items="items"
                />
                <hr class="mt-3 mb-4" />
                <CategoryTabContent 
                    :categories="categories"
                    :selectedCategory="selectedCategory"
                    @on-category-select="onCategorySelect"
                />
            </div>

            <CartSection :is-active="isClassActive">
                <div class="d-none align-items-center justify-content-between">
                    <h5 class="mb-0">Details Items</h5>
                    <button @click="closeCart" class="header-toggler round-btn rotate-btn toggle-sidebar d-inline-block d-lg-none" type="button" aria-label="Toggle navigation">
                        <Icon icon="tabler:x" :height="21" />
                    </button>
                </div> 
                <hr class="mt-2 mb-3 d-none" />
                <div class="sticky-top">
                    <CustomerDetail 
                        v-if="customer"
                        :customer="customer"
                        @on-customer-remove="removeCustomer"
                    />
                    <div class="d-flex">
                        <AddCustomer
                            :disabled="cartItems.length == 0"
                            @on-customer-details-added="addCustomer"
                        />
                        <CouponInput
                            :disabled="cartItems.length == 0"
                            :clearInput="clearCouponInput"
                            @on-apply-coupon="applyCoupon"
                            @on-search-click="() => { showCouponPackageSearchModal = true }"
                        />
                    </div>
                    <CartContainer 
                        :coupon="coupon"
                        :package="package"
                        @on-remove-coupon="() => { coupon = null, clearCouponInput = true }"
                    >
                        <template v-slot:checkout-button>
                            <CheckoutButton @click="completePurchase"/>
                        </template>
                    </CartContainer>
                </div>
            </CartSection>
        </div>
        <PurchaseCreateModal 
            :invoice_number="invoice_number"
            :order_status="order_status"
            :payment_status="payment_status"
            :payment_modal_button_text="payment_modal_button_text"
            :is_view_invoice_disabled="is_view_invoice_disabled"
            :visible="showPurchaseStatusModal"
            @on-close="() => { showPurchaseStatusModal = false }"
            @on-redirect-to-invoice="redirectToInvoice"
        />
        <CouponPackageSearchModal
            :customer_id="customer?._id || null"
            :visible="showCouponPackageSearchModal"
            :clearInput="clearCouponInput"
            @on-close="() => { showCouponPackageSearchModal = false }"
            @on-apply-code = "applyCode"
        />
    </div>
</template>
<script>
import { Icon } from '@/common/Icon'
import { mapState } from 'vuex';
import utils_lib from '@/helpers/utils_lib'
import moment from 'moment'
import usePos from '@/composables/usePos';

import SearchBox from "@/ui_components/pos/SearchBox.vue"
import CartCount from "@/ui_components/pos/CartCount.vue"
import PosItemContainer from "@/ui_components/pos/PosItemContainer.vue"
import PosItem from "@/ui_components/pos/Item.vue"
import CategoryTabContent from "@/ui_components/pos/CategoryTabContent.vue"
import CartSection from "@/ui_components/pos/CartSection.vue"
import AddCustomer from "@/ui_components/pos/AddCustomer.vue"
import CouponInput from "@/ui_components/pos/CouponInput.vue"
import CartContainer from "@/ui_components/pos/CartContainer.vue"
import CheckoutButton from "@/ui_components/pos/CheckoutButton.vue"
import CustomerDetail from "@/ui_components/pos/CustomerDetail.vue"
import Alerts from '@/views/Alerts'
import PurchaseCreateModal from '@/common/PurchaseCreateModal.vue';
import CouponPackageSearchModal from '@/common/CouponPackageSearchModal.vue';

const defaultCategory = {
    id: null, name: "All Categories"
}

export default {
    name: 'POS',
    setup: () => {
        const { mapPosItemToCartItem, mapProductToPosItem, mapPackagesToPosItem, mapServiceToPosItem, mapApptToPosItem, mapCategoryToPosCategory, sortCategories } = usePos();
        return { mapPosItemToCartItem, mapProductToPosItem, mapPackagesToPosItem, mapServiceToPosItem, mapApptToPosItem, mapCategoryToPosCategory, sortCategories }
    },
    components:{
        Icon,
		SearchBox,
        CartCount,
        PosItemContainer,
        PosItem,
        CategoryTabContent,
        CartSection,
        AddCustomer,
        CouponInput,
        CartContainer,
        Alerts,
        CheckoutButton,
        CustomerDetail,
        PurchaseCreateModal,
        CouponPackageSearchModal
	},
    data() {
        return {
            searchTerm: null,
            selectedCategory: defaultCategory,
            items: [],
            allItems: [],
            categories: [],
            coupons: [],
            coupon: null,
            package: null,
            clearCouponInput: false,
            alert: false,
			show: 0,
			alertData: {
				message: '',
				type: ''
			},
            loading: false,
            apptDefaultCategory: {
                id: 1,
                name: 'Appointments'
            },
            showPurchaseStatusModal: false,
            order_status: "",
            payment_status: "",
            payment_modal_button_text: "",
            invoice_number: "",
            is_view_invoice_disabled: false,
            showCouponPackageSearchModal: false,
            isClassActive: false,
        }
    },
    created() {
        this.$store.commit({
            type: 'updateSidebarVisible',
            value: false,
        });
    },
    computed: mapState({
        cartItems: state => state.pos.cartItems,
        customer: state => state.pos.customer,
    }),
    async mounted() {
        this.loading = true;
        this.getItems(); //No Await
       
    },
    methods: {
        applyCode(data)
        {
            const { coupon_code = null, package: selectedPackage = null } = data;
            this.coupon = coupon_code;
            this.package = selectedPackage;
            this.showCouponPackageSearchModal = false; 
            this.clearCouponInput = false;
        },
        async getItems()
        {
            const start_date = moment().subtract(8, 'hours').valueOf()
            const end_date = moment().add(24, 'hours').valueOf()

            const product_result = await this.$schedsdk.get_products_list({ product_name: '', page_no: 1});
            const services_result = await this.$schedsdk.list_services({ product_name: '', page_no: 1});
            const pc_result = await this.$schedsdk.get_product_category({ category_name: '', page_no: 1});
            const sc_result = await this.$schedsdk.get_service_categories({ category_name: '', page_no: 1});
            const coupon_result = await this.$schedsdk.getCouponsList({ page_no: 1});
            const bookings_result = await this.$schedsdk.getBookingList({ begin_booking_date: start_date, end_booking_date: end_date, page_no: 1, unpaid_only: true });
            let packages_list_result = await this.$schedsdk.get_packages_list({page_no:1,max_per_page:120})
            const products = product_result.data;
            const services = services_result.data;
            const product_categories = pc_result.data;
            const service_categories = sc_result.data;
            const bookings = bookings_result.data;
            let packages_list = packages_list_result.data;

            this.coupons = coupon_result.data;

            this.allItems = [...products.map(this.mapProductToPosItem), 
                             ...services.map(this.mapServiceToPosItem), 
                             ...bookings.map(this.mapApptToPosItem),
                             ...packages_list.map(this.mapPackagesToPosItem)
                            ];
            this.categories = [
                defaultCategory, 
                this.apptDefaultCategory,
                ...[...product_categories.map(this.mapCategoryToPosCategory), ...service_categories.map(this.mapCategoryToPosCategory)].sort(this.sortCategories)
            ];
            this.items = [...this.allItems];
            this.loading = false;
        },
        searchItems() {
            if (this.selectedCategory.id) {
                this.items = this.allItems.filter(i => i.category_id == this.selectedCategory.id);
            } else {
                this.items = [...this.allItems];
            }
            if (this.searchTerm) {
                this.items = utils_lib.filterMatches(this.items, {
                    name: this.searchTerm
                });
            }
        },
        clearSearchResults() {
            this.onSearchInput(null);
        },
        onSearchInput(term) {
            this.searchTerm = term;
            this.searchItems();
        },
        onCategorySelect(category) {
            this.selectedCategory = category;
            this.searchItems();
        },
        applyCoupon(coupon_code) {
            if (coupon_code) {
                let coupon = this.coupons.find(c => c.coupon_code == coupon_code);
                if (!coupon) {
                    this.alertData = {
                        message: "Invalid Coupon Code",
                        type: 'danger'
                    }
                    this.alert = true;
                    this.show = 1;
                    this.coupon = null;
                    return false;
                } else {
                    this.alert = false;
                    this.show = 0;
                    this.coupon = coupon;
                }
                this.clearCouponInput = false;
            }
        },
        async addCustomer(customer) {
            await this.$store.commit('pos/setCustomer', customer);
        },
        async removeCustomer() {
            await this.$store.commit('pos/removeCustomer');
        },
        async completePurchase() {
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
                get_draft_invoice: false,
                customer: customerData,
                cart: {
                    "items": this.cartItems.map(this.mapPosItemToCartItem),
                    "card_on_file_id_to_use": "",
                    cpn_pkg_codes: []
                }
            }
            if (this.coupon) {
                data.cart.cpn_pkg_codes.push(this.coupon.coupon_code);
            }
            if (this.package) {
                data.cart.cpn_pkg_codes.push(this.package.redemption_code);
            }
            
            this.order_status = "Waiting....";
            this.payment_status = "Not Started";
            this.payment_modal_button_text = "Waiting...";

            try {
                const PoResponse = await this.$schedsdk.create_purchase_order(data);

                const purchaseOrderData = PoResponse.data;

                if (PoResponse.status == 1)
                {
                    this.order_status = PoResponse.message + " Invoice number: " + PoResponse.data.invoice_number;
                    this.invoice_number = PoResponse.data.invoice_number;
                    this.payment_modal_button_text = "View Invoice";
                    this.$store.commit('pos/clearCart');
                }
                else
                {
                    this.order_status = "Failed: " + PoResponse.message;
                    this.payment_modal_button_text = "Close";
                }
                this.showPurchaseStatusModal = true;
                this.operation_result_message = PoResponse.message;
            } catch (error) {
                console.log(error)
                if(error.data && error.data.message)
                {
                    this.operation_result_message = error.data.message
                }
                else
                {
                    this.operation_result_message  = error.message;
                }
                this.alertData = {
                    message: this.operation_result_message,
                    type: 'danger'
                }
                this.alert = true;
                this.show = 1;
            } finally {
                // this.operationCompletion(is_new,updated_booking,keep_dialog_open);
            }
        },
        sidebarToggle() {
            this.$store.commit('toggleSidebar')
        },
        redirectToInvoice()
        {
            this.is_view_invoice_disabled = true;
            this.showPurchaseStatusModal = false;
            setTimeout(function() {
                this.$router.push({
                    name: 'Detail Invoice', 
                    params: { invoice_no: this.invoice_number } 
                });  
            }.bind(this), 1000); 
            
        },
        toggleActiveClass() {
            this.isClassActive = !this.isClassActive; // Toggle the state
        },
        closeCart() {
            this.isClassActive = false; // Set isClassActive to false to close the cart
        },
    }
}
</script>
<style lang="scss">
    .round-btn {
        width: 34px;
        min-width: 34px;
        height: 34px;
        svg {
            height: 17px;
        }
    }
    .sticky {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
    }
    .close-icon {
        top: -2px;
    }
    
    .nav {
        border: 0;
        .nav-item {
            .nav-link {
                padding: 0;
                border: 0;
                &:hover {
                    border: 0;
                    color: #fff;
                    span {
                        color: #fff;
                    }
                }
                &.active {
                    border: 0;
                    color: #fff;
                }
            }
        }
    }
    .rotate-btn {
        transform: rotate(-90deg);
    }
    .pos-wrap {
        -webkit-user-select:none;
        -khtml-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }
    // @media (max-width: 991.98px) {
    //     .cart-wrap {
    //         opacity: 0;
    //         position: fixed;
    //         top: -12px;
    //         right: 0;
    //         max-width: 420px;
    //         background-color: var(--background-color-primary);
    //         z-index: 1040;
    //         transform: scale(.95);
    //         border: 1px solid #E1E1FB;
    //         transform: translateX(200%);
    //         transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
    //         &.cart {
    //             transition: all 0.3s ease-out;
    //             right: 0;
    //             transform: translateX(0);
    //             opacity: 1;
    //         }
    //     }
    // }
</style>
<style lang="scss" scoped>
.col-custom-8 {
    width: calc(100% - 360px);
}
.pos-head {
    .header-toggler {
        left: 0;
        top: -7px;
    }
    h5 {
        padding-left: 48px;
    }
}
@media (min-width: 1140px) {
    .col-custom-8 {
        flex: 0 0 auto;
        width: 66.66666667%;
    }
}
</style>
