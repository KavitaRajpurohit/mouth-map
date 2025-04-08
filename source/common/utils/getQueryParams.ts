export function getQueryOptions(query: any) {
    const page = query.page * 1 || 1;
    const limit = query.limit * 1 || 55;
    const skip = (page - 1) * limit;
    const dateFilter = query.key
    const subscription = query.subscribed;
    const product = query.product;
    const brand = query.brand;
    const payment = query.sUsage
    let sort: any = {};
    if (query.sortBy) {
        let sortData = JSON.stringify(query.sortBy);
        sortData = query.sortBy.replace(/[{}""]/g, "")
        const parts = sortData.split(":");
        sort[parts[0]] = parseFloat(parts[1]);
    } else {
        sort = { createdAt: -1 };
    }
    return { limit, skip, sort, page, dateFilter, payment, subscription, product, brand };
}
