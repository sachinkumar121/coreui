package com.silverskysoft.capacitor.payterm;

import android.content.ContentValues.TAG
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.core.app.PendingIntentCompat.getActivity
import com.google.gson.Gson
import com.silverskysoft.capacitor.payterm.models.payment.CardOnFile
import com.silverskysoft.silverskypaymentterminalslibrary.*
import java.lang.Exception
import java.math.RoundingMode
import java.util.*
import kotlin.collections.ArrayList

/**
 * Created by Lakhwinder.
 *
 * This is a experimental fragment, to check  how we can display the multiple invoices
 * So we can figure out how we can merge them to a single invoice.
 *
 *
 * Why its required: mom and daughter come in for salon, They will have two
 * separate bookings. But mom needs to pay only once for both
 *
 */


object PaytermImplementation
{
    //private var mBookingId: String? = null

    private var mTakePaymentCallBack: IPayTermCallback = object : PayTermCallbackImpl()
    {
        override fun OnCbReturn(ob: Any?, cb_id: IPayTermCallback.PTCallbackID?, AdditionalInfo: String?) {
            //Log.i(TAG, "mTakePaymentCallbackobj-------> mTakePaymentCallbackobj")
            val gson = Gson()
            val retpay = ob as PaymentParams?
            Log.d(TAG, "from app returnPayParams:  " + gson.toJson(ob))
            //updateInvoiceWithPayment(retpay, mInvoiceNumber)
            paymentUtil?.ShowDefaultScreenToFrontScreen(null)
        }
    }
    internal var paymentUtil: PaymentUtil? = null
    private fun takePaymentForCart(cart: Cart,
                                   sourceOrderId: String?,
                                   customerId: String?,
                                   isCashOnly: Boolean,
                                   alreadyPaidAmountCents: Int,
                                   allowAlternativePayments: Boolean,
                                   useMultiMid: Boolean = false,
                                   mmMid: String? = null,
                                   mmTid: String? = null,
                                   payByVaultedCard: Int? = 0,
                                   cardOnFile: CardOnFile? = null)
    {

        var limitToCash = 0
        if (allowAlternativePayments) {
            limitToCash = 0   //We don't want to force it.
        } else {
            if (isCashOnly) {
                limitToCash = 1
            }

        }
        //Take payment for cart
        var amountCents = cart.transactionTotalAmountCents - alreadyPaidAmountCents
        if (amountCents < 0) {
            amountCents = 0
        }
        if (amountCents==0L)
        {
            //DialogHelper.createAlertDialog(context, getString(R.string.amount_to_collect_on_invoice_zero))
            return
        }
        val pp = PaymentParams(amountCents.toInt(), limitToCash)
        pp.sourceOrderID = sourceOrderId
        cart.cartOrderId = pp.sourceOrderID
        pp.addCart(cart)
        if(alreadyPaidAmountCents < 0.1)
        {
            //Set tax only if not a partial payment as we can't calculate partial tax here.
                //Full tax is collected regardless
            pp.setTaxAmount(  cart.getTaxAmountCents().toInt())
        }

        if (useMultiMid) {
            if (mmMid != null &&
                    mmTid != null &&
                    mmMid.length >= 2 &&
                    mmTid.isNotEmpty()) {
                pp.setMultiMidData(mmMid, mmTid)
            } else {
                Log.e(TAG, "TakePaymentForCart: Setting Multi MID was true but MID or TID was invalid ")
            }
        }
        //if (StringUtils.mPayTermLibDisableReceiptOptionsOnPlatform) {
        //    pp.disableReceiptPrintOptionOnPlatform = 1
        //}
        if(payByVaultedCard == 1)
        {
           //TODO
        }

        mTakePaymentCallBack.SetInputdata(pp as Any)
        paymentUtil?.TakePayment(mTakePaymentCallBack)
    }

    private var mReturnPaymentCallBack: IPayTermCallback = object : PayTermCallbackImpl() {
        override fun OnCbReturn(ob: Any?, cb_id: IPayTermCallback.PTCallbackID?, AdditionalInfo: String?) {
            Log.i(TAG, "mReturnPaymentCallBack------->  ")
            val gson = Gson()
            val retpay = ob as PaymentParams?
            Log.d(TAG, "from app returnPayParams:  " + gson.toJson(ob))
            //updateInvoiceWithPayment(retpay, mInvoiceNumber)
            paymentUtil?.ShowDefaultScreenToFrontScreen(null)
        }
    }

    private fun takePaymentForInvoice(UIPickedPayMethod: Int,
                                      inAllowAlternativePayments: Int = 0,
                                      useMultiMid: Boolean = false,
                                      mmMid: String? = null,
                                      mmTid: String? = null,
                                      payByVaultedCard: Int? = 0,
                                      cardOnFile: CardOnFile? = null)
    {
/*
            takePaymentForCart(ct,
                    mInvoiceInfo?.invoice?.single_source_order_id,
                    mInvoiceInfo?.invoice?.customerId,
                    limitToCashForTakingPayment,
                    alreadyPaidAmountCents,
                    allowAlternativePayments,
                    useMultiMid,
                    mmMid,
                    mmTid,
                    payByVaultedCard,
                    cardOnFile)
        } */

    }
/*
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        paymentUtil = PaymentUtil(getActivity(), BuildConfig.LIBRARY_PACKAGE_NAME,
                StringUtils.mPayTermLibInSimulation, StringUtils.mPayTermSubscriptionsInSimulation,
                StringUtils.mCurrencyCode)
        //Check and set APP RAID
        Utils.checkSetAppRaid(paymentUtil)
        Utils.checkSetRemoteDebug(paymentUtil);

        return inflater.inflate(R.layout.fragment_invoice_detail, container, false)
    }
*/
}