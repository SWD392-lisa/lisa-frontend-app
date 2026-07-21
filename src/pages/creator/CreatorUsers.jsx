import { useEffect, useMemo, useState } from 'react';
import { Search, ShieldCheck, ShieldOff, UserRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CreatorShell, EmptyState, ErrorState, LoadingState } from './CreatorShell';
import { formatDate } from './creatorUtils';
import { getCreatorUser, getCreatorUsers, updateCreatorUserStatus } from '../../services/creatorService';

export const CreatorUsers = () => {
  const { currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [state, setState] = useState({ loading: true, error: '' });

  const load = async () => {
    setState({ loading: true, error: '' });
    try {
      const result = await getCreatorUsers({ search: query, isActive: activeFilter });
      setUsers(result?.items || []);
      setState({ loading: false, error: '' });
    } catch (err) {
      setState({ loading: false, error: err.message || 'Could not load users.' });
    }
  };

  // The filter change intentionally reloads the server-backed directory.
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [activeFilter]);

  const visible = useMemo(() => users.filter((user) => {
    const term = query.trim().toLowerCase();
    return !term || `${user.fullName} ${user.email} ${user.roleCode}`.toLowerCase().includes(term);
  }), [users, query]);

  const inspect = async (user) => {
    try { setSelected(await getCreatorUser(user.userId)); }
    catch (err) { setState({ loading: false, error: err.message || 'Could not load user detail.' }); }
  };

  const changeStatus = async (user) => {
    const isActive = !user.isActive;
    const reason = isActive ? '' : window.prompt('Reason for suspending this account');
    if (!isActive && reason === null) return;
    try {
      await updateCreatorUserStatus(user.userId, { isActive, reason: reason || '' });
      await load();
      if (selected?.userId === user.userId) setSelected((old) => ({ ...old, isActive, suspensionReason: reason || null }));
    } catch (err) { setState({ loading: false, error: err.message || 'Account status update failed.' }); }
  };

  return <CreatorShell title="User operations" eyebrow="Identity workspace">
    <section className="creator-toolbar"><div><span className="creator-panel__eyebrow">Account directory</span><h2>{visible.length} users</h2></div><div className="creator-toolbar__actions"><label className="creator-search"><Search size={15} /><input placeholder="Search name, email or role" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && load()} /></label><select value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)} aria-label="Filter account status"><option value="">All statuses</option><option value="true">Active</option><option value="false">Suspended</option></select><button className="creator-action-button" type="button" onClick={load}>Search</button></div></section>
    <div className="creator-capability-banner"><strong>Identity controls</strong><span>Account status can be managed here. Role code and role permissions are read-only and cannot be changed from this portal.</span></div>
    {state.error && <ErrorState message={state.error} onRetry={load} />}
    {state.loading && <LoadingState label="Loading users..." />}
    {!state.loading && !state.error && <section className="creator-table-panel">{visible.length === 0 ? <EmptyState title="No users found" detail="Try another search or status filter." /> : <div className="creator-table-wrap"><table className="creator-table"><thead><tr><th>User</th><th>Role</th><th>Status</th><th>Joined</th><th /></tr></thead><tbody>{visible.map((user) => { const isSelf = String(user.userId) === String(currentUser?.userId); return <tr key={user.userId}><td><strong>{user.fullName}</strong><small>{user.email}</small></td><td><span className="creator-badge creator-badge--published">{user.roleCode}</span></td><td><span className={`creator-badge creator-badge--${user.isActive ? 'approved' : 'rejected'}`}>{user.isActive ? 'ACTIVE' : 'SUSPENDED'}</span></td><td>{formatDate(user.createdAt)}</td><td><div className="creator-table-actions"><button className="creator-row-button" type="button" onClick={() => inspect(user)}><UserRound size={15} />Details</button><button className={user.isActive ? 'creator-danger-button' : 'creator-action-button'} type="button" disabled={isSelf} title={isSelf ? 'You cannot suspend your own account' : ''} onClick={() => changeStatus(user)}>{user.isActive ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}{user.isActive ? 'Suspend' : 'Activate'}</button></div></td></tr>; })}</tbody></table></div>}</section>}
    {selected && <section className="creator-panel creator-detail-panel"><div className="creator-panel__heading"><div><span className="creator-panel__eyebrow">Account detail</span><h2>{selected.fullName}</h2></div><span className="creator-badge creator-badge--published">{selected.roleCode}</span></div><dl className="creator-detail-list"><div><dt>Email</dt><dd>{selected.email}</dd></div><div><dt>Phone</dt><dd>{selected.phoneNumber || 'Not provided'}</dd></div><div><dt>Status</dt><dd>{selected.isActive ? 'Active' : `Suspended: ${selected.suspensionReason || 'No reason recorded'}`}</dd></div><div><dt>Created</dt><dd>{formatDate(selected.createdAt)}</dd></div><div><dt>Last updated</dt><dd>{formatDate(selected.updatedAt)}</dd></div></dl></section>}
  </CreatorShell>;
};
