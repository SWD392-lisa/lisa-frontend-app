import { Fragment, useCallback, useEffect, useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronRight, FileUp, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { CreatorShell, EmptyState, ErrorState, LoadingState } from './CreatorShell';
import { formatDate, normalizeList } from './creatorUtils';
import { deleteCurriculumLanguage, getCurriculumImport, getCurriculumImports, getCurriculumLevel, getCurriculumLevels, getCurriculumStats, getCurriculumSubLevels, uploadCurriculum } from '../../services/creatorService';

const languages = ['ENGLISH', 'CHINESE', 'JAPANESE'];
const stages = ['', '1', '2', '3'];

export const CreatorCurriculum = () => {
  const [language, setLanguage] = useState('ENGLISH');
  const [stage, setStage] = useState('');
  const [levels, setLevels] = useState([]);
  const [stats, setStats] = useState({});
  const [imports, setImports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [upload, setUpload] = useState({ file: null, overwrite: false, loading: false, message: '', error: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [levelData, statData, importData] = await Promise.all([getCurriculumLevels(language, stage), getCurriculumStats(), getCurriculumImports()]);
      setLevels(normalizeList(levelData)); setStats(statData || {}); setImports(normalizeList(importData));
    } catch (err) { setError(err.message || 'Could not load curriculum.'); }
    finally { setLoading(false); }
  }, [language, stage]);

  useEffect(() => { load(); }, [load]);

  const submitUpload = async (event) => {
    event.preventDefault();
    if (!upload.file) return setUpload((old) => ({ ...old, error: 'Choose a .docx file first.' }));
    setUpload((old) => ({ ...old, loading: true, message: '', error: '' }));
    try {
      await uploadCurriculum({ file: upload.file, language, overwrite: upload.overwrite });
      setUpload({ file: null, overwrite: false, loading: false, message: 'Import completed successfully.', error: '' });
      event.target.reset();
      await load();
    } catch (err) { setUpload((old) => ({ ...old, loading: false, error: err.message || 'Import failed.' })); }
  };

  const inspectLevel = async (level) => {
    if (selected?.level?.id === level.id) return setSelected(null);
    setSelected({ loading: true, level, subLevels: [], error: '' });
    try {
      const [detail, subLevels] = await Promise.all([getCurriculumLevel(level.id), getCurriculumSubLevels(level.id)]);
      setSelected({ loading: false, level: detail || level, subLevels: normalizeList(subLevels), error: '' });
    } catch (err) { setSelected({ loading: false, level, subLevels: [], error: err.message || 'Could not load level detail.' }); }
  };

  const inspectImport = async (item) => {
    const id = item.id || item.importId;
    if (!id) return;
    try { setSelected({ loading: true, importItem: await getCurriculumImport(id), level: null, subLevels: [] }); }
    catch (err) { setSelected({ loading: false, importItem: item, level: null, subLevels: [], error: err.message }); }
  };

  const clearLanguage = async () => {
    if (!window.confirm(`Delete all ${language} curriculum data?`)) return;
    try { await deleteCurriculumLanguage(language); await load(); }
    catch (err) { setError(err.message || 'Could not delete curriculum.'); }
  };

  return (
    <CreatorShell title="Curriculum management" eyebrow="Learning system">
      <section className="creator-panel creator-upload-panel">
        <div className="creator-panel__heading"><div><span className="creator-panel__eyebrow">Import source</span><h2>Upload curriculum</h2></div><FileUp size={22} /></div>
        <form className="creator-upload-form" onSubmit={submitUpload}>
          <label className="creator-field"><span>Language</span><select value={language} onChange={(event) => setLanguage(event.target.value)}>{languages.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="creator-file-field"><span>Word document</span><input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => setUpload((old) => ({ ...old, file: event.target.files?.[0] || null }))} /></label>
          <label className="creator-check-field"><input type="checkbox" checked={upload.overwrite} onChange={(event) => setUpload((old) => ({ ...old, overwrite: event.target.checked }))} /><span>Overwrite existing levels</span></label>
          <Button type="submit" disabled={upload.loading}>{upload.loading ? 'Importing...' : 'Import file'}</Button>
        </form>
        {upload.message && <p className="creator-success"><CheckCircle2 size={17} />{upload.message}</p>}
        {upload.error && <p className="creator-inline-error">{upload.error}</p>}
      </section>

      <section className="creator-toolbar">
        <div><span className="creator-panel__eyebrow">Catalog</span><h2>{language} levels</h2></div>
        <div className="creator-toolbar__actions"><select value={stage} onChange={(event) => setStage(event.target.value)} aria-label="Filter by stage"><option value="">All stages</option>{stages.slice(1).map((item) => <option key={item} value={item}>Stage {item}</option>)}</select><button className="creator-icon-button" type="button" onClick={load} title="Refresh levels"><RefreshCw size={17} /></button><button className="creator-danger-button" type="button" onClick={clearLanguage} title="Delete all levels for this language"><Trash2 size={16} /> Clear language</button></div>
      </section>
      {error && <ErrorState message={error} onRetry={load} />}
      {!error && loading && <LoadingState label="Loading levels..." />}
      {!error && !loading && <section className="creator-table-panel"><div className="creator-table__meta"><span>{Number(stats[language] ?? stats[language.toLowerCase()] ?? levels.length)} levels available</span><span>{levels.length} shown</span></div>{levels.length === 0 ? <EmptyState title="No levels found" detail="Import a curriculum file or change the filters." /> : <div className="creator-table-wrap"><table className="creator-table"><thead><tr><th>Level</th><th>Title</th><th>Stage</th><th>Language</th><th /></tr></thead><tbody>{levels.map((level) => <Fragment key={level.id}><tr><td><strong>{level.levelNumber ?? level.id}</strong></td><td>{level.title || 'Untitled level'}</td><td>Stage {level.stage ?? '—'}</td><td>{level.language || language}</td><td><button className="creator-row-button" type="button" onClick={() => inspectLevel(level)}>{selected?.level?.id === level.id ? 'Close' : 'Inspect'} <ChevronRight size={15} /></button></td></tr>{selected?.level?.id === level.id && <tr className="creator-detail-row"><td colSpan="5">{selected.loading ? <LoadingState label="Loading sub-levels..." /> : selected.error ? <p className="creator-inline-error">{selected.error}</p> : <div className="creator-level-detail"><div><strong>{selected.level.title}</strong><span>{selected.level.cefrTarget || 'CEFR target not set'} · {selected.subLevels.length} sub-levels</span></div><div className="creator-sublevel-list">{selected.subLevels.map((item) => <span key={item.id}><b>{item.subNumber}</b>{item.topic || 'Untitled topic'}</span>)}</div></div>}</td></tr>}</Fragment>)}</tbody></table></div>}</section>}

      <section className="creator-panel creator-import-history"><div className="creator-panel__heading"><div><span className="creator-panel__eyebrow">Audit trail</span><h2>Import history</h2></div></div>{imports.length === 0 ? <EmptyState title="No import reports" detail="Successful and failed imports will appear here." /> : <div className="creator-import-list">{imports.slice(0, 12).map((item, index) => <button type="button" className="creator-import-item" key={item.id || item.importId || index} onClick={() => inspectImport(item)}><span className={`creator-status-dot ${String(item.status || item.state || '').toLowerCase().includes('fail') ? 'is-error' : 'is-success'}`} /><span><strong>{item.fileName || item.filename || item.originalFileName || `Import ${index + 1}`}</strong><small>{item.language || 'Language unknown'} · {formatDate(item.createdAt || item.importedAt || item.createdDate)}</small></span><ChevronDown size={16} /></button>)}</div>}</section>
      {selected?.importItem && <section className="creator-panel creator-detail-panel"><div className="creator-panel__heading"><div><span className="creator-panel__eyebrow">Import detail</span><h2>{selected.importItem.fileName || selected.importItem.filename || 'Import report'}</h2></div></div><pre>{JSON.stringify(selected.importItem, null, 2)}</pre></section>}
    </CreatorShell>
  );
};
