import moment from 'moment-timezone';

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
    getPaytermCart: function (invoice_obj) 
    {
        if (dt_unix == null || dt_unix == 0)
        {
            return dt_unix;
        }
        return moment(dt_unix).format(format_str);//"MMM DD, YYYY hh:mm a"
    }
} //end export