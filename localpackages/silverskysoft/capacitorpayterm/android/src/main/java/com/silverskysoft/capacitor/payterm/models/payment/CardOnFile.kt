package com.silverskysoft.capacitor.payterm.models.payment

import android.os.Parcelable
import com.google.gson.annotations.SerializedName

data class CardOnFile(
        @field:SerializedName("_id")
        val id: String? = null,
        @field:SerializedName("nick_name")
        val nick_name: String? = null,

        @field:SerializedName("credential_tag")
        val credentialTag: String? = null,

        @field:SerializedName("token_provider")
        val tokenProvider: String? = null,

        @field:SerializedName("provider_cust_id")
        val providerCustId: String? = null,

        @field:SerializedName("provider_card_id")
        val providerCardId: String? = null,

        @field:SerializedName("token")
        val token: String? = null,

        @field:SerializedName("token_type")
        val tokenType: Int? = null,

        @field:SerializedName("brand")
        val brand: String? = null,
        @field:SerializedName("last4")
        val last4: String? = null,
        @field:SerializedName("first6")
        val first6: String? = null,
        @field:SerializedName("is_preferred")
        val isPreferred: Boolean? = null,
        @field:SerializedName("exp_month")
        val expMonth: String? = null,
        @field:SerializedName("exp_year")
        val expYear: String? = null,
        @field:SerializedName("user_consented")
        val userConsented: Boolean? = null,
        @field:SerializedName("last_used_date")
        val lastUsedDate: Long? = null,
)