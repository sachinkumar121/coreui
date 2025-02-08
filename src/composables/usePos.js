import moment from 'moment'

export default function usePos() {

    // based on device width get items per row
    const items_per_row_breakpoints = {
        768: 2,
        956: 3,
        1280: 4,
        1400: 5
    }

    // based on device height get number of rows
    const no_of_row_breakpoints = {
        500: 2,
        768: 3,
        1024: 4,
        1400: 5
    }

    // based on device height get number of details items rows
    const no_of_details_item_row_breakpoints = {
        1024: 2,
        1400: 3
    }

    function getBreakPointValue(defined_breakpoints, value) {
        // Get all keys and sort them in ascending order
        const breakpoints = Object.keys(defined_breakpoints).map(Number).sort((a, b) => a - b);
        
        let previousKey = null;
    
        for (let i = 0; i < breakpoints.length; i++) {
            const currentKey = breakpoints[i];
            
            // If the value exactly matches a key, return the corresponding value
            if (value === currentKey) {
                return defined_breakpoints[currentKey];
            }
    
            // If the value is less than the current key, return the previous key's value
            if (value < currentKey) {
                return previousKey !== null
                    ? defined_breakpoints[previousKey]  // Return the previous key's value
                    : defined_breakpoints[currentKey];  // If no previous key, return the current one
            }
    
            // Update the previousKey to the currentKey for the next iteration
            previousKey = currentKey;
        }
    
        // If the value is larger than all keys, return the value of the largest key
        return defined_breakpoints[previousKey];
    }

    function getItemNumericInfo(width, height) {
        let items_per_row = getBreakPointValue(items_per_row_breakpoints, width);
        let no_of_rows = getBreakPointValue(no_of_row_breakpoints, height);
        console.log("getItemNI h " , height, " w " , width)
        let no_of_details_item_rows = getBreakPointValue(no_of_details_item_row_breakpoints, height);

        return { no_of_rows, items_per_row, no_of_details_item_rows };
    }

    function getPosItemTypeToCartItemType(type)
    {
        switch(type)
        {
            case 'product': return "PROD";
            case 'service': return "SVC";
            case 'package': return "PKG";
        }
    }
    const apptDefaultCategory = {
        id: 1,
        name: 'Appointments'
    }
    const mapPosItemToCartItem = (item) => ({
        "applied_unit_price": item.price,
        "item_name": item.name,
        "item_qty": item.quantity,
        "item_type": getPosItemTypeToCartItemType(item.type),
        "item_id": item.id,
        "item_price": item.price
    })

    const mapProductToPosItem = (product) => ({
        id: product._id,
        name: product.name,
        price: product.price,
        type: 'product',
        image: product.small_image_url,
        time: null,
        item_has_flex_items: false,
        category_id: product?.product_category?._id || null
        
    })
    const mapPackagesToPosItem = function(packageitem) 
    {
        let has_flex_items = packageitem.confirm_discount_flex_items;
        if(has_flex_items == false)
        {
            packageitem.package_items.forEach((pkitem)=>{
                    if(pkitem.enable_flexible_time && 
                        pkitem.selectable_times && 
                        pkitem.selectable_times.length>0)
                    {
                        has_flex_items = true;
                        return false;
                    }
                    return true;
                });
        }
        return {
                id: packageitem._id,
                name: packageitem.package_name,
                price: packageitem.package_purchase_price,
                type: 'package',
                image: packageitem.small_image_url,
                time: null,
                category_id: packageitem?.product_category?._id || null,
                item_has_flex_items : has_flex_items
                }
    }    //end map package to pos
    const mapServiceToPosItem = (service) => ({
        id: service._id,
        name: service.name,
        price: service.price,
        type: 'service',
        image: service.small_image_url,
        time: service.time,
        item_has_flex_items: false,
        category_id: service?.service_category?._id || null
    })

    const mapApptToPosItem = (appt) => ({
        id: appt._id,
        name: `${appt.customer.first_name} ${appt.customer.last_name}`,
        price: appt.total_price,
        type: 'appointment',
        image: null,
        time: moment(appt.service_start_date).format('hh:mma'),
        category_id: apptDefaultCategory.id,
        services: appt.services,
        service_names: appt.services.map(s => s.name),
        item_has_flex_items: false,
    })

    const mapCategoryToPosCategory = (category) => ({
        id: category._id,
        name: category.name
    })

    const sortCategories = (a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    }

    return {
        mapPosItemToCartItem,
        mapProductToPosItem,
        mapPackagesToPosItem,
        mapServiceToPosItem,
        mapApptToPosItem,
        mapCategoryToPosCategory,
        sortCategories,
        getItemNumericInfo
    }
}