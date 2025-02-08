package com.silverskysoft.skysalon.data.model.payment

import com.google.gson.annotations.SerializedName
//import com.silverskysoft.skysalon.stringUtils.StringUtils

data class TakePaymentWithCardOnFileRequest(

        //Can be service_order_id or purchase order order_number
        @field:SerializedName("order_number")
        val orderNumber: String? = null,

        @field:SerializedName("customer_id")
        val customerId: String? = null,

        @field:SerializedName("card_on_file_id")
        val cardOnFileId: String? = null,

        @field:SerializedName("do_async")
        val doAsync: Boolean? = null,
)