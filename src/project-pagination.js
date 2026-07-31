export function getProjectPagination(items, pageSize, requestedPage = 0) {
  const projects = Array.isArray(items) ? items : [];
  const normalizedPageSize = Number.isInteger(pageSize) && pageSize > 0
    ? pageSize
    : 1;
  const pageCount = Math.max(1, Math.ceil(projects.length / normalizedPageSize));
  const numericPage = Number.isFinite(requestedPage)
    ? Math.floor(requestedPage)
    : 0;
  const page = Math.min(Math.max(0, numericPage), pageCount - 1);
  const start = page * normalizedPageSize;

  return {
    page,
    pageCount,
    hasMultiplePages: pageCount > 1,
    visibleProjects: projects.slice(start, start + normalizedPageSize)
  };
}
