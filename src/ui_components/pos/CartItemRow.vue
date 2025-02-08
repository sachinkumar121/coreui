<template>
    <tr>
        <td>
            <div class="delete" @click="onRemoveItem">
                <Icon icon="tabler:trash" :height="22" class="cursor-pointer" />            
            </div>
        </td>
        <td width="60%">
            <div>
                <div class="item-name">{{ cartItem.name }}</div>
                <div class="item-type">{{ cartItem.type}}</div>
            </div>
        </td>
        <td>
            <div class="d-flex align-items-center">
                <button @click="decrease" class="btn-qty d-flex align-items-center justify-content-center rounded-circle">
                    <Icon icon="tabler:minus" class="mt-1" />   
                </button>
                <input type="number" readonly="readonly" min="1" class="qty-input mx-2 p-2 text-center rounded-2" v-model="cartItem.quantity">
                <button @click="increase" class="btn-qty d-flex align-items-center justify-content-center rounded-circle">
                    <Icon icon="tabler:plus" :height="22" />   
                </button>
            </div>
        </td>
        <td>
            <div class="item-cost">
                {{currency_symbol}}{{cartItem.price}}
            </div>
        </td>
    </tr>
</template>
<script>
    import { Icon } from '@/common/Icon'
    export default {
        name: 'CartItemRow',
        props: ['item'],
        components: {
            Icon,
        },
        emits: ['removeItem'],
        data() {
            return {
                cartItem: this.item,
                currency_symbol: this.$store.state.business_settings.business_currency_symbol
            }
        },
        methods: {
            onRemoveItem() {
                this.$store.commit('pos/removeItemFromCart', this.cartItem);
            },
            increase() {
                this.cartItem.quantity += 1;
            },
            decrease() {
                if (this.cartItem.quantity == 1) {
                    this.$store.commit('pos/removeItemFromCart', this.cartItem);
                } else {
                    this.cartItem.quantity -= 1;
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }

    /* Firefox */
    input[type=number] {
    -moz-appearance: textfield;
    }
    tr {
        td {
            vertical-align: middle;
            border-radius: 15px;
        }
    }
    .delete {
        color: #DE5753;
    }
    .btn-qty {
        border: 0;
        color: #fff;
        background-color: var(--link-color);
        width: 28px;
        height: 28px; 
    }
    .qty-input {
        width: 35px;
        border: 1px solid var(--link-color);
        min-height: 28px;
        height: 32px;
    }
    .border {
        border-color: var(--border-color-d9)
    }
    .item-name {
        font-size: 16px;
        color: var(--text-primary-color);
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 94%;
    }
    .item-type {
        color: #9A9AB0;
        font-size: 15px;
        font-weight: 500;
    }
    .item-cost {
        font-weight: 500;
        font-size: 16px;
        text-align: right;
    }
</style>