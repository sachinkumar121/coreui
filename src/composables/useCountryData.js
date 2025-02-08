export default function useCountryData() {
    const getAddress = (obj, version = 'short') => {
        let addressArr = [obj.address_line1, obj.address_line2];
        if (version == 'long') {
            addressArr.push(obj.city, obj.state, obj.country, obj.zipcode);
        } else if (version == 'geo') {
            addressArr.push(obj.city, obj.zipcode, obj.country);
        }
        return addressArr.join(', ');
    }
    return {
        countries: [
            { name: 'US & Canada', code: 'us', latitude: 39.751416,
            longitude: -101.378141 },
            { name: 'United Kingdom', code: 'uk', latitude: 55.000113, longitude: -2.701393 }
        ],
        getAddress
    }
}