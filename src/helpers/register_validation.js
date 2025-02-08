function check_add(arr, val)
{
     if (val && val != '' && val.length>0)
     {
        arr.push(val);
     }
}
function address_verify(al1, al2, city, state, country, zip, tag ="")
{
    
     if (utils_lib.is_empty(al1) || 
         utils_lib.is_empty(city) ||
         utils_lib.is_empty(state) ||
         utils_lib.is_empty(country) ||
         utils_lib.is_empty(zip) )
    {
        if (!utils_lib.is_empty(country))
        {
            let cn = country.toLowerCase()
            if ((cn == 'ie' || cn == 'ireland') &&  utils_lib.is_empty(zip))
            {
                return "" //Ireland can have empty zip
            }
        }
        
        return tag +" Address has empty fields";
    }

    return "";
}


function merchant_account_signup_validate(req, res, next)
{
    let rec = req.body
    let errors = [];
 
    if (utils_lib.is_empty(rec.country_code) || 
         rec.country_code.length >3)
    {
        errors.push("Country Code incorrect");
        return errors; //Country code must be present
    }    
    check_add(errors, address_verify(rec.owner_address_line1, 
                             rec.owner_address_line2, 
                             rec.owner_city,
                             rec.owner_state,
                             rec.owner_country,
                             rec.owner_zipcode, "Owner" ));

    rec.owner_ssn = utils_lib.stripNonNumerics(rec.owner_ssn)
    if (!utils_lib.isNumeric(rec.owner_ssn))
    {
        errors.push("Owner's SSN is incorrect");
    }    
    rec.ein = utils_lib.stripNonNumerics(rec.ein)
    if (!utils_lib.isNumeric(rec.ein))
    {
        
        errors.push("Business EIN is incorrect: " + rec.ein);
    }
    rec.owner_mobile_number = utils_lib.stripNonNumerics(rec.owner_mobile_number)    
    rec.owner_mobile_number = utils_lib.standard_db_format(rec.owner_mobile_number, rec.country_code)
    if (rec.owner_mobile_number != null)
    {
        errors.push("Owner's Mobile number is incorrect: " + rec.owner_mobile_number);
    }    
    return errors;
}
function business_validate(req)
{
    let rec = req.body
    let errors = [];
 
    check_add(errors, address_verify(rec.address_line1, 
                             rec.address_line2, 
                             rec.city,
                             rec.state,
                             rec.country,
                             rec.zipcode, "Business" ));
    rec.email = utils_lib.get_checked_email(rec.email);
    if (rec.email == null)
    {
        errors.push("email error - " + rec.email )
    }
    if (utils_lib.is_empty(rec.timezone))
    {
        errors.push("timezone error - " + rec.timezone )
    }
    return errors;
   
}
function generic_signup_validate(req, res, next)
{
    let rec = req.body
    let signup_errors = [];
    let ma_errors =[];
    if (rec.subscription_type == '1' || 
        rec.subscription_type == 1)
    {
        ma_errors =  merchant_account_signup_validate(req)
    }

    signup_errors = business_validate(req);

    console.log(req.body)
    console.log("errorors....");
    console.log(signup_errors)
    console.log(ma_errors)
    return (signup_errors.concat(ma_errors));
}
