

export const paginate = async (
  model,
  queryParams,
  { query = {}, sort = { createdAt: -1 }, populate = null } = {}
) => {
  let page = parseInt(queryParams.page) || 1;
  let limit = parseInt(queryParams.limit) || 24;

  const skip = (page - 1) * limit;

  const total = await model.countDocuments(query);

  let queryBuilder = model
    .find(query)      
    .skip(skip)
    .limit(limit)
    .sort(sort);       

  if (populate) {
    queryBuilder = queryBuilder.populate(populate);
  }

  const data = await queryBuilder;

  return {
    data,
    pagination: {
      totalItems: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      pageSize: limit,
    },
  };
};