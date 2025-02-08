package com.silverskysoft.skysalon.data.model.payment

import com.google.gson.annotations.SerializedName

data class ResponseRefund(
        @field:SerializedName("data")
        val data: Boolean? = null,

        @field:SerializedName("refund_in_error")
        val refundInError: Boolean? = null
)