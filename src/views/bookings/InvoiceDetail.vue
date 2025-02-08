<template>
<div>
   
    <CRow>
      <CCol sm="12">
          <div class="panel panel-default">
            <!-- Default panel contents -->
            <div class="panel-heading">Invoice #{{invoice_amounts.invoice_number}}</div>
            
            <!-- Table -->
            <table class="table mx-auto w-auto"> 
                <thead> 
                    <tr> 
                        
                        <th>Item Name</th>
                        <th>Qty</th> 
                        <th class="totals">Amount</th> 
                    </tr> 
                </thead> 
                <tbody> 
                {% for iline in invoice_for_display %}
                    <tr> 
                        <td>{{ iline.item_name }}</td> 
                        <td>{{ iline.item_qty }}</td> 
                        <td class="totals">{{business_currency_symbol}} {{ iline.item_extended_price }}</td> 
                    </tr>   
                {% endfor %}
                    <tr> 
                        <td colspan="2" class="totals">Total</td> 
                        <td class="totals">{{business_currency_symbol}} {{invoice_amounts_display.invoice_total}}</td> 
                    </tr>       
                    <tr> 
                            <td colspan="2" class="totals">Paid</td> 
                            <td class="totals">{{business_currency_symbol}} {{invoice_amounts_display.invoice_paid_amount}}</td> 
                    </tr>       
                    <tr> 
                            <td colspan="2" class="totals">Due</td> 
                            <td class="totals">{{business_currency_symbol}} {{invoice_amounts_display.invoice_amount_due}}</td> 
                    </tr>       
                </tbody> 
            </table>
        </div>
      </CCol>
    </CRow>
  </div>
</template>

<script>
export default {
    name: 'CreateBooking',
     data () {
      return { 
        loaded: false,
        
      }
     },
    methods: {
    
  } 
}
</script>