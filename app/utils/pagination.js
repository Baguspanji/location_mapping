exports.getPagination = (data, page, size, totalItems) => {
    const limit = size ? +size : 10;

    return {
        data: data,
        total_items: totalItems,
        total_pages: Math.ceil(totalItems / limit),
        current_page: page,
    }
}