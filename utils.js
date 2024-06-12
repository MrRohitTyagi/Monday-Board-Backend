export function applyFilters(req, res, next) {
  const { page_size, page, search } = req.query;
  req.filters = {
    ...(page_size ? { take: parseInt(page_size) } : {}),
    ...(page ? { skip: (parseInt(page) - 1) * 10 } : {}),
    ...(search ? { where: { name: { contains: search } } } : {}),
  };
  next();
}
