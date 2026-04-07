

export const paginate = async (
  model,
  queryParams,
  { query = {}, sort = { createdAt: -1 } } = {}
) => {
  let page = parseInt(queryParams.page) || 1;
  let limit = parseInt(queryParams.limit) || 24;

  const skip = (page - 1) * limit;

  const total = await model.countDocuments(query);

  const data = await model
    .find(query)      
    .skip(skip)
    .limit(limit)
    .sort(sort);       

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