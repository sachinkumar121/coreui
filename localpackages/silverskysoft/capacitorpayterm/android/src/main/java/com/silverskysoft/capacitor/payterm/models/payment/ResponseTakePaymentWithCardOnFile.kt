package com.silverskysoft.skysalon.data.model.payment

import com.google.gson.annotations.SerializedName

data class ResponseTakePaymentWithCardOnFile(
        @field:SerializedName("data")
        val data: Boolean? = null,

        @field:SerializedName("status")
        val status: Int? = null,

        @field:SerializedName("message")
        val message: String? = null
)