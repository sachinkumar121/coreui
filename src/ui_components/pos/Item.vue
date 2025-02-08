<template>
    <div class="col-custom mb-3">
        <div :class="['card-custom card p-3 rounded-2 gx-2', 
        {'card-custom-appointment': item.type === 'appointment',
        'card-custom-product': item.type === 'product',
        'card-custom-service': item.type === 'service'
        }
        ]">
            <ItemIcon :type="item.type"/>
            <div class="item-name text-center mb-2">
                <h4 class="mb-0">{{item.name}}</h4>
                <p v-if="item.services && item.type === 'appointment'" class="mb-0 d-block">
                    <booking-services-list
                        :item="item"
                        :simplelist="true"
                    />
                </p>
            </div>
            <div :class="['item-cost d-flex align-items-center', item.type === 'appointment' ? 'justify-content-between' : 'justify-content-center']">
                <p class="mb-0"><span>{{currency_symbol}}</span>{{item.price}}</p>
                <span :class="['mb-0 badge lh-base', item.type === 'appointment' ? 'd-block' : 'd-none' ]">{{item.time}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import ItemIcon from '@/ui_components/pos/ItemIcon'
import BookingServicesList from '@/views/bookings/BookingServicesList.vue'

export default {
    name: 'PosItem',
    props: ['item'],
    components: {
        ItemIcon,
        BookingServicesList
    },
    data() {
        return ({
            currency_symbol: this.$store.state.business_settings.business_currency_symbol
        })
    }
}
</script>
<style lang="scss">
.col-custom {
    padding-left: 12px;
    padding-right: 12px;
    cursor: pointer;
    min-width: 147px;
}
@media (max-width:1140.98px) {
    .col-custom {
        width: calc(100%/3);
        min-width: 188px;
    }
}
@media (max-width:767.98px) {
    .col-custom {
        width: calc(100%/2);
    }
}
@media (max-width: 687.98px) {
     .col-custom {
        width: 100%;
    }
 }
// @media (min-width: 576px) {
//     .col-custom {
//         width: calc(100%/3);
//     }
// }
// @media (min-width: 1024px) {
//     .col-custom {
//         width: calc(100%/4);
//     }
// }
// @media (min-width: 1680px) {
//     .col-custom {
//         width: calc(100%/5);
//     }
// }

.card-custom {
    border-color: var(--border-color);
    width: 100%;
    height: 100%;
    border-width: 3px;
    background: var(--background-color-primary);
    box-shadow: 0 3px 11px 0 rgba(0,0,0,.05);
    transition: .5s ease;
    &:focus, &:hover {
        transition: .5s ease;
    }
    &.card-custom-appointment {
        // border-color: #FFA500 ;
        &:focus, &:hover {
            border-color: #FFA500 ;
            box-shadow: 0 0 1px 5px rgba($color: #FFA500, $alpha: .15);
        }
        .item-icon {
            background-color: #FFA500;
        }
    }
    &.card-custom-product {
        // border-color: #101CDB ;
        &:focus, &:hover {
            border-color: #101CDB ;
            box-shadow: 0 0 1px 5px rgba($color: #101CDB, $alpha: .15);
        }
        .item-icon {
            background-color: #101CDB;
        }
    }
    &.card-custom-service {
        // border-color: #DB252C ;
        &:focus, &:hover {
            border-color: #DB252C ;
            box-shadow: 0 0 1px 5px rgba($color: #DB252C, $alpha: .15);
        }
        .item-icon {
            background-color: #DB252C;
        }
    }
    .item-name {
        h4 {
            color: var(--text-primary-color);
            font-weight: 500;
            font-size: 16px;
        }
        p {
            color: var(--text-tab-gray);
            font-size: 14px;
            font-weight: 500;
            text-transform: capitalize;
            &.d-block {
                display: block !important;
            }
        }
    }
    .item-cost {
        p {
            font-size: 16px;
            color: var(--link-color);
            font-weight: 500;
        }
        .badge {
            line-height: 13px;
            background-color: #22ab00;
        }
    }
}
</style>
