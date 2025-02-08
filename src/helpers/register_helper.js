export default {
     fill_with_test_mech_data(rec)
     {
            rec.business_name       = "test business dba";
            rec.legal_business_name = "test business lgl";
            rec.password = "123";
            rec.timezone= 'America/Los_Angeles';
            rec.confirm_password= "123";
          
            rec.business_website= "www.silverskysoft.com";
            rec.business_phone= "123-103-1231";
            rec.business_website= "www.silverskysoft.com";
            rec.address_line1= "addr1";
            rec.address_line2= "addr2";
            rec.city= "Folsom";
            rec.zipcode= "95630";
            rec.country=  {name: "United States", code:"US"};
            rec.email = "test2@test.com"
            rec.owner_first_name= "OWner fn";
            rec.owner_last_name= "Owner ln";
            rec.owner_ssn= "123-123-1231";
            rec.owner_state=  {name:"California", code:"CA"};
            rec.owner_dob="2000-01-23";
            rec.owner_address_line1= "own add1";
            rec.owner_address_line2= "own add2";
            rec.owner_city= "Folsom",
            rec.owner_state= {name:"California", code:"CA"};
            rec.owner_country= rec.country; //treat same as business country
            rec.owner_zipcode= "95630";
            rec.owner_dl_number= "DF123s";
            rec.owner_dl_state= {name:"California", code:"CA"};
            rec.owner_mobile_number= "9163652717";
            rec.owner_title =  {"code": "PRESIDENT", "name": "President"};

            rec.phone= "123-123-1001";
            rec.country=  {name: "United States", code:"US"};
            rec.state=  {name: "California", code:"CA"};
            rec.business_ownership_type =  {
                code: "PRIVCORP",
                name: "Private Corporation"
            };
            rec.business_start_date="1998-02-13"
            rec.ein = "12-1231313";
            rec.business_mcc = { code: '7230', name: 'Beauty and Barber Shops - Like Salons'};
            rec.processing_monthly_volume = 12300
            rec.processing_per_ticket = 25
            rec.processing_highest_per_ticket = 300
            rec.deposit_bank = {
                acct_num: "10002",
                routing_num: "222222",
                acct_type: {code: "SAVINGS", name:"Savings"},
                bank_name: "boa"
           }
     }
};