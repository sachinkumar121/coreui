export default {
    methods: {
        filterUoms(option, label, search) {
            let temp = search.toLowerCase();
            return option.src.toLowerCase().indexOf(temp) > -1 || option.description.toLowerCase().indexOf(temp) > -1 || option.code.toLowerCase().indexOf(temp) > -1
        },
        filterProducts(option, label, search) {
            let temp = search.toLowerCase();
            return option.name.toLowerCase().indexOf(temp) > -1 || option.product_code.toLowerCase().indexOf(temp) > -1
        }
    }
}