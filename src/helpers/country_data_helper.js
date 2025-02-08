'use strict'
export default {
    getCountryCode: function  (name, countriesData) 
    {
        let lowern = name.toLowerCase();
        if (lowern.startsWith("usa") ||
            lowern.startsWith("united states"))
        {
        return "US"
        }
        if (lowern.startsWith("canada") )
        {
        return "CA"
        }
        if (lowern.startsWith("britain") ||
            lowern.startsWith("united kingdom"))
        {
        return "GB"
        }
        if (lowern.startsWith("ireland") )
        {
        return "IE"
        }
        let re  = countriesData.filter(country => {
                                    return country.name.toLowerCase() === lowern
                    })
        if (re && re.length>0)
        {
            return re[0].code
        }
        if (lowern == "us" || 
                lowern == "ca" || 
                lowern == "gb" || 
                lowern == "ie")
        {
            return lowern.toUpperCase();
        }
    
    },
    searchByCountryCode: function  (cc, countriesData) 
    {      
        const term = cc.toLowerCase()
        const q = new RegExp(term, 'g')
    
        return countriesData
        .filter(country => {
            return country.code.toLowerCase() == term 
        })
    },
    searchByCountryName: function  (searchTerm, countriesData) 
    {
        const term = searchTerm.toLowerCase()
        const q = new RegExp(term, 'g')
    
        return countriesData
        .filter(country => {
            return country.name.toLowerCase().match(q) 
        })
    },  
    getStateCodeFromStateName : function (state_name, country_code,countriesWithStatesData) 
    {
        for(let i = 0; i<countriesWithStatesData.length; i++ )
        {
            if (country_code == countriesWithStatesData[i].code.toUpperCase())
            {
                const states =  countriesWithStatesData[i].states;
                const term = state_name.toLowerCase().trim()
                const q = new RegExp(term, 'g')
                
                return states
                .filter(state_data => {
                    
                return state_data.name.toLowerCase().trim().match(q) 
                
                }) 
            }
        }
        return [];
    }


}