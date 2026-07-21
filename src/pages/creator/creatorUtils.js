export const formatDate = (value) => value ? new Date(value).toLocaleString() : 'Not available';
export const normalizeList = (value) => Array.isArray(value) ? value : (value?.items || value?.data || value?.content || []);
