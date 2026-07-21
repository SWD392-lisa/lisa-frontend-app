const normalizeRole = (user) => String(user?.roleCode || user?.role || user?.account_type || '').toUpperCase();

export const getRoleCode = (user) => normalizeRole(user);

export const isCreator = (user) => ['SUPER', 'CREATOR'].includes(normalizeRole(user));

export const isMentor = (user) => isCreator(user) || ['PRO', 'MENTOR'].includes(normalizeRole(user));
