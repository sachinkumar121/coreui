import store from '../store';
import { getdb } from '../store_modules/schedsdk-store-module';

function createOrReturnDbInstance(db_collection) {
    let schedsdkStoreState = store.state.schedsdkstore;
    return getdb(schedsdkStoreState, db_collection);
}

export async function removeDataOfCollection(db_collection, where = {}, options = {}) {
    let db = createOrReturnDbInstance(db_collection);
    return await db.removeAsync(where, options);
}

export async function removeCollection(db_collection) {
    let db = createOrReturnDbInstance(db_collection);
    return await db.dropDatabaseAsync();
}

export async function insertDataToCollection(db_collection, data) {
    let db = createOrReturnDbInstance(db_collection);

    return await db.insertAsync(data);
}

export async function updateDataOfCollection(db_collection, where, data, options = {}) {
    let db = createOrReturnDbInstance(db_collection);

    return await db.updateAsync(where, { $set: data }, options)
}

export async function getDataOfCollection(db_collection, where, limit, skip = 0, sort = null) {
    let db = createOrReturnDbInstance(db_collection);
    let dbFindAsync = await db.findAsync(where).sort(sort).skip(skip).limit(limit);
    
    return dbFindAsync;
}

export async function findSpecificDoc(db_collection, where) {
    let db = createOrReturnDbInstance(db_collection);
    return await db.findOneAsync(where);
}

export async function fetchTakeInventoryCount(searchText = null, limit = 5) {
    // throw 'Something went wrong with NeDB';
    let db = createOrReturnDbInstance('skysalon.inventory_count');

    if (!searchText) {
        return await db.findAsync({}).limit(limit);
    }
    return await db.findAsync({ $or: [{ item_name: new RegExp(searchText, 'i') }, { item_upc: new RegExp(searchText, 'i') }] }).limit(limit);
}