import PhoneNumber from 'awesome-phonenumber'
import moment from 'moment-timezone';
import { startCase, toLower } from 'lodash'

const filterDeep = (pred) => (xs, kids) => xs.flatMap(
        x => pred(x)
            ? ((kids = filterDeep(pred)(x.operations || [])) && kids.length
            ? [{...x, operations: kids}] 
          : [{...x, operations: []}])
          : (kids = filterDeep(pred)(x.operations || [])) && kids.length
            ? [{...x, operations: kids}] 
          : []
      
    )

const testIncludes = (condition) => (obj) =>
  Object.entries(condition).every (
    ([k, v]) => (obj [k] || '').toLowerCase().includes(v.toLowerCase())
  )

export default {
    getFormattedDate: function (dt_unix, format_str= "MMM DD, YYYY hh:mm a") {
        if (dt_unix == null || dt_unix == 0)
        {
            return dt_unix;
        }
        return moment(dt_unix).format(format_str);//"MMM DD, YYYY hh:mm a"
    },
    getPhoneFormatted(phone, country_code ="US")
    {
        var pn = new PhoneNumber(phone, {regionCode: country_code});
        if (pn.isValid())
        {
            return pn.getNumber('national');
        }
        return null;
    },
    get_checked_email(email)
    {
        if(email == null)
        {
            return null;
        }
        if (this.ValidateEmail(email.toLowerCase().trim()))
        {
            return email.toLowerCase().trim();
        }
        return null;
    },
    //input data: email, phone, country_code
    check_valid_phone_or_email(data)
    {
        let ce  = this.get_checked_email(data.email)
        let cp  = null;
        if (data.phone && data.phone!= null)
        {
            cp = this.clean_phone(data.phone, data.country_code || "US");
        }
        if (ce == null && cp == null)
        {
            return null
        }
        else
        {
            //If individual fields were not empty, return null.
            //If they were empty then its ok to return values object with one as null.
            if (ce==null && data.email!=null && data.email.length>0)
            {
                return null;
            }
            if (cp==null && data.phone!=null && data.phone.length>0)
            {
                return null;
            }
            return {cleaned_email: ce || "", cleaned_phone: cp || ""}
        }
    },

//https://www.w3resource.com/javascript/form/email-validation.php
ValidateEmail(inputText)
{
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    if(inputText.match(mailformat))
    {
      return true;
    }
    return false;
},

clean_phone(phone, country_code)
{
    var pn = null
    if (phone == null)
    {
        return null;
    }
    if (country_code ==null || country_code == "null")
    {
        pn = new PhoneNumber(phone); //Assume phone number is in E164 format
    }
    else
    {
        pn = new PhoneNumber(phone, {regionCode: country_code});
    }
    
    
    if (pn.isValid()||pn.isPossible())
    {
        return pn.getNumber('national');
    }
    return null;
},
    roundto2digits: function (n) {
        //Round half away from zero
         var e = Number.EPSILON * n * 100;
         return Math.round((n * 100)+e) / 100;
     },
     roundto3digits: function (n) {
        //Round half away from zero
         var e = Number.EPSILON * n * 1000;
         return Math.round((n * 1000)+e) / 1000;
     },
     roundto6digits: function (n) {
        //Round half away from zero
         var e = Number.EPSILON * n * 1000000;
         return Math.round((n * 1000000)+e) / 1000000;
     },
    itemTypeToApplicableTaxEnum(item_type) 
    {
        switch (item_type) {
            case 'P':
                return 2;
            case 'S':
                return 1;
            case 'A':
            default:
                return 99;
    
        }
    },
    
    calculate_tax(item_type, price, zip, tax_data, override_rate = null) {
    var tax_applicable_enum = this.itemTypeToApplicableTaxEnum(item_type);

    var tax_applied = [];
    var tax_rate = [];
    var tax_applicability = [];

    var total_tax = 0.0;

    tax_data.forEach(element => {

        if (element.tax_applicable_on == tax_applicable_enum ||
            element.tax_applicable_on == 3) //anyt
        {
            if (!element.tax_min_item_value ||
                (element.tax_min_item_value && (price >= element.tax_min_item_value))
            ) {
                //
                let ltax_rate = element.tax_rate;
                if (override_rate !== null)
                {
                    ltax_rate = override_rate;
                }
                var tax = this.roundto2digits(price * ltax_rate / 100.0);
                tax_applied.push(tax);
                tax_rate.push(ltax_rate);
                tax_applicability.push(element.tax_applicable_on);
                //console.log("TAX calulation -- price " + price )
                //console.log("TAX calulation -- tax " + tax )
                total_tax += tax;
                //console.log("TAX calulation -- total_tax " + total_tax )
            }
        }
    });
    //total_tax = roundto2digits(total_tax);

    return {
        total_tax: total_tax,
        tax_applied_array: tax_applied,
        tax_rate_applied_array: tax_rate,
        tax_applicability_array: tax_applicability
        };
    }, //end calculate_tax
    getFPickDateRangeTimeStamps(dt_range_string, timezone)
    {
        //console.log("Asdasldkasd == " + timezone)
        if (!dt_range_string || dt_range_string == 'null' || dt_range_string == null) 
        {
            return {start_ts: 0,  end_ts: 0};
        }
        let dt_range = dt_range_string;
        let dt_range_split = dt_range.split("to");

        //let timezone         = this.$store.state.business_settings.business_time_zone;
        let startDay = null;
        let endDay = null;
        let format =  "YYYY-MM-DD"
        if(dt_range_split.length == 1)
        {
            startDay         = moment.tz(dt_range_split[0], format, timezone).startOf('day').valueOf();
            endDay         = moment.tz(dt_range_split[0], format, timezone).endOf('day').valueOf();
        }
        if(dt_range_split.length == 2)
        {
            startDay         = moment.tz(dt_range_split[0], format, timezone).startOf('day').valueOf();
            endDay         = moment.tz(dt_range_split[1], format, timezone).endOf('day').valueOf();
        }
        return {start_ts: startDay,  end_ts: endDay};

    },

    getLastSubString(value, length = 4) {
        return value.substring(value.length - length, value.length);
    },
    getTimeInZone(dt, timezone)
    {
        let format =  "MMM DD, YYYY hh:mm A"
        //console.log('asdasd.', dt, timezone);
        return  moment.tz(dt, timezone).format(format);

    },
    filterMatches: (obj, conditions) => filterDeep(testIncludes(conditions))(obj),
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    },
    isNumeric(n) 
    {
     try
     {
        if (typeof n == 'number')
        {
            return true;
        }
        //console.log("asdasd -- nan " +  n)
        //console.log("asdasd -- nan " + Number.isNaN(n))
        //console.log("asdasd -- fin " + Number.isFinite(+n))
        if (!Number.isNaN(n) && Number.isFinite(+n)) //tHe +n converts to numeric and checks for finite
        {
            return true;
        }
        return false;
     }
     catch(Ex)
     {

     }
     return false;
    },
    isValidPhoneNumber(phone, country_code = "US") {
        var pn = new PhoneNumber(phone, {regionCode: country_code});
        return pn.isValid();
    },
    isValidDate(dateStr, format) {
        return moment(dateStr, format, true).isValid();
    },
    toTitleCase(v) {
        return startCase(toLower(v));
    },
    // Function to check if a timestamp is more than one hour old
    isMoreThanMinutesOld(timestamp, minutes) {
        const currentTime = +new Date();
        const timeDifference = currentTime - (timestamp);
        //console.log("timeDifference  ",{timestamp: timestamp, currentTime, timeDifference })
        const minsDifference = timeDifference / (1000  * 60);
        //console.log("asasdasd  ",timestamp, timeDifference,minsDifference )
        return minsDifference > minutes;
    },

    arrayChunk(arr, n ) {
        if ( !arr.length ) {
            return [];
        }
        return [ arr.slice( 0, n ) ].concat( this.arrayChunk(arr.slice(n), n) );
    }
}