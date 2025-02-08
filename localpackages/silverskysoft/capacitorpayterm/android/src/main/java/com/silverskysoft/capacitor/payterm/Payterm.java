package com.silverskysoft.capacitor.payterm;
import com.silverskysoft.silverskypaymentterminalslibrary.PaymentPlatform;
import android.util.Log;

public class Payterm {

    public String echo(String value) {
        //Log.i("EchoAndroid ", value);
        Log.i("OO", "Manufa ID: " + PaymentPlatform.getManufacturerID());
        Log.i("OO", "Echoval ID: " + value.toString());
        return value;
    }
    public String takePaymentForCart()
    {
            return "Not implemented";
     }
}
