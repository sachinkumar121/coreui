<template>
  <div class="table-invoice-body">
    <CRow class="gx-0">
      <CCol class="mb-2">
        <table class="w-100 table-top-invoice">
          <tr>
            <td>
              <div class="d-flex">
                <div
                  class="business-img"
                  v-if="
                  business_data.large_logo_url &&
                  business_data.large_logo_url.length
                  "
                  >
                  <img
                    :src="business_data.large_logo_url"
                    alt=""
                    />
                </div>
                <div class="ms-2">
                  <p class="mb-0">
                    <b>{{ business_data.business_name }}</b>
                  </p>
                  <p class="mb-0">
                    {{ business_data.business_email }}
                  </p>
                  <p class="mb-0">
                    {{
                    getPhoneFormat(
                    business_data.business_phone,
                    )
                    }}
                  </p>
                </div>
              </div>
            </td>
            <td class="text-end">
              <p class="mb-0">
                {{ business_data.address_line1 }}
                {{ business_data.address_line2 }},
              </p>
              <p class="mb-0">
                {{ business_data.city }},
                {{ business_data.state }}
                {{ business_data.zipcode }}
              </p>
              <p class="mb-0"></p>
            </td>
          </tr>
        </table>
      </CCol>
    </CRow>
    <CRow class="gx-0">
      <CCol class="gray-section mb-3">
        <table class="w-100">
          <tbody>
            <tr>
              <td width="75%">
                <p class="mb-0"><b>Customer:</b></p>
                <p class="mb-0">
                  {{
                  purchase_order_details.customer_first_name
                  }}
                  {{
                  purchase_order_details.customer_last_name
                  }}
                </p>
                <!-- <p class="mb-0">{{formatAddress(customer_data)}}</p>
                  <p class="mb-0">{{getPhoneFormat(customer_data.phone)}}</p>   
                  <p class="mb-0">{{purchase_order_details.email}}</p> -->
              </td>
              <td width="25%" class="text-end">
                <p class="mb-0">
                  <b
                    >Order No.:
                  {{
                  purchase_order_details.order_number
                  }}</b
                    >
                </p>
                <!-- <p class="mb-0">Due date: {{getFormattedDate(purchase_order_details.due_date)}}</p> -->
                <p class="mb-0">
                  Created date:
                  {{
                  getFormattedDate(
                  purchase_order_details.po_date_utc,
                  )
                  }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </CCol>
    </CRow>
    <CRow class="gx-0">
      <CCol>
        <div class="table-responsive">
          <table
            bordered
            class="table table-bordered table-custom table-invoice"
            >
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Qty</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <template
                v-if="purchase_order_details.products.length"
                >
                <tr
                  v-for="(
                  product, index
                  ) in purchase_order_details.products"
                  :key="index"
                  >
                  <td>{{ product.name }}</td>
                  <td>{{ product.qty }}</td>
                  <td>
                    {{ business_currency_symbol }}
                    {{ roundto2digits(product.price) }}
                  </td>
                </tr>
              </template>
              <tr>
                <td colspan="2" class="totals pe-3">Total</td>
                <td class="text-end">
                  {{ business_currency_symbol }}
                  {{ roundto2digits(purchase_order_details.invoice_info[0]?.invoice?.estimated_amount_total) }}
                </td>
              </tr>
              <tr>
                <td colspan="2" class="totals pe-3">Paid</td>
                <td class="text-end">
                  {{ business_currency_symbol }}
                  {{ roundto2digits(purchase_order_details.invoice_info[0]?.invoice?.final_paid_amount) }}
                </td>
              </tr>
              <tr>
                <td colspan="2" class="totals pe-3">Due</td>
                <td class="text-end">
                  {{ business_currency_symbol }}
                  {{ roundto2digits(purchase_order_details.invoice_info[0]?.invoice?.estimated_amount_due) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import utils_lib from '@/helpers/utils_lib'
import moment from 'moment'

export default {
  setup() {},
  data() {
    return {
      loading: false,
      business_data: {},
      purchase_order_details: {
        products: [],
        invoice_info: [],
      },
      business_currency_symbol: this.$store.state.business_settings.business_currency_symbol,
      country_code: this.$store.state.business_settings.business_info.country_code,
    }
  },
  created() {
    this.getPurchaseOrderDetail()
  },
  methods: {
    getPurchaseOrderDetail() {
      this.loading = true
      let purchase_order_id = this.$route.params.purchase_order_id
      this.$schedsdk
        .getPurchaseOrderDetails(purchase_order_id)
        .then((result) => {
          this.purchase_order_details = result.data.po_details
          this.business_data = result.data.business_data
        })
        .catch(console.error)
        .finally(() => {
          this.loading = false
        })
    },
    getPhoneFormat(ph) {
      let v = utils_lib.clean_phone(ph, this.country_code)
      return v || ph
    },
    getFormattedDate: function (dt_unix) {
      if (dt_unix == null || dt_unix == 0) {
        return dt_unix
      }
      return moment(dt_unix).format('MMM DD, YYYY') //"MMM DD, YYYY"
    },
    roundto2digits: function (n) {
      var e = Number.EPSILON * n * 100
      return (Math.round(n * 100 + e) / 100).toLocaleString('en', {
        useGrouping: false,
        minimumFractionDigits: 2,
      })
    },
  },
}
</script>
<style scoped lang="scss">
.accordion-item {
  background-color: transparent;
}

.panel-heading {
  background: #cfa648;
  color: #fff;
  padding: 20px;
}

.totals {
  text-align: right;
}

.customer_detail {
  float: left;
  margin-bottom: 10px;
  margin-top: 20px;
}

.invoice_data {
  padding: 5px;
}

.business_detail {
  float: right;
  margin-bottom: 10px;
  margin-top: 20px;
}

.formatted_data {
  font-size: 17px;
}

.business_logo {
  width: 50px;
  margin-left: 30%;
  border-radius: 50%;
}

.heading_span {
  color: blue;
}

//
.mx-n-15 {
  margin-right: -12px;
  margin-left: -15px;
}

.print-img {
  display: none;
}

.business-img {
  background-color: #c3c3c3;
  width: 60px;
  min-height: 50px;
  max-height: 56px;
  display: flex;
  padding: 0 5px;
  -webkit-print-color-adjust: exact;
  flex-flow: inherit;
  align-items: center;

  img {
    width: 100%;
  }
}

.gray-section {
  border-radius: 5px;
  background-color: var(--background-gray-section);
  -webkit-print-color-adjust: exact;
  padding: 10px;

  td {
    vertical-align: top;
  }
}

.table-invoice {

  th,
  td {
    &:nth-child(2) {
      text-align: center;
    }

    &:nth-child(3) {
      text-align: right;
    }
  }
}

.btn {
  &.btn-sm {
    padding: 0.34rem 0.5rem 0.2rem 0.5rem;
  }
}

@media print {

  .sidebar-outer+.section-right,
  .section-right,
  .sidebar-outer.sidebar-collapse+.section-right {
    padding-left: 0;
  }

  .gray-section {
    border-radius: 5px;
    background-color: #ebebeb !important;
    -webkit-print-color-adjust: exact;
  }

  .print-img {
    display: block;
    width: 200px;
  }

  .mb-3,
  .mb-2 {
    margin-bottom: 5px !important;
  }

  .table-custom {
    padding: 0.2rem 0.4rem;

    td,
    th {
      font-size: 13px;
      padding: 0.2rem 0.4rem;
    }
  }

  table {

    td,
    th {
      color: #000;
    }

    p {
      font-size: 13px;
    }
  }
}

@media (max-width: 480px) {
  .table-invoice-body {
    table:not(.table-custom) {

      td,
      tr {
        display: block;
        text-align: left !important;
      }

      td {
        margin-bottom: 8px;
      }
    }
  }

  .gray-section {
    td {
      width: 100%;
    }
  }
}
</style>
