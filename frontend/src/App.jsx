import { useEffect, useMemo, useState } from 'react';
import { catalogue, isDemo } from './catalogue.js';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

function Pill({ children }) { return <span className="pill">{children}</span>; }

function AddMedicine({ onAdd, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const form = new FormData(event.currentTarget);
    const item = {
      name: String(form.get('name')).trim(),
      category: String(form.get('category')).trim(),
      description: String(form.get('description')).trim(),
      price: Number(form.get('price')),
      prescriptionRequired: form.get('prescriptionRequired') === 'on',
    };
    try { await onAdd(item); onClose(); }
    catch (err) { setError(err.message || 'Could not save this entry.'); }
    finally { setBusy(false); }
  }
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-heading"><div><span className="eyebrow">CATALOGUE ENTRY</span><h2 id="modal-title">Add a sample item</h2></div><button className="icon-button" onClick={onClose} aria-label="Close">Ã—</button></div>
      <p className="modal-note">Use fictional catalogue data. This demo does not provide medical guidance.</p>
      <form onSubmit={submit} className="form-grid">
        <label>Product name<input name="name" required maxLength="100" placeholder="e.g. Vitamin C 500 mg" /></label>
        <label>Category<input name="category" required maxLength="60" placeholder="e.g. Supplements" /></label>
        <label className="span-two">Description<textarea name="description" rows="3" maxLength="500" placeholder="Short, factual catalogue description" /></label>
        <label>Sample price (â‚¹)<input name="price" type="number" min="0" max="1000000" step="0.01" required placeholder="99.00" /></label>
        <label className="check-label"><input name="prescriptionRequired" type="checkbox" /> Mark as prescription-required</label>
        {error && <p className="form-error span-two" role="alert">{error}</p>}
        <div className="form-actions span-two"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" disabled={busy}>{busy ? 'Savingâ€¦' : 'Add to catalogue'}</button></div>
      </form>
    </section>
  </div>;
}

export default function App() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState('');

  async function refresh(term = search) {
    setLoading(true); setError('');
    try { setItems(await catalogue.list(term)); }
    catch (err) { setError(err.message || 'Unable to load the catalogue.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(''); }, []);
  useEffect(() => {
    const timer = setTimeout(() => { refresh(search); setCategory('All'); }, 180);
    return () => clearTimeout(timer);
  }, [search]);

  const categories = useMemo(() => ['All', ...new Set(items.map((item) => item.category).filter(Boolean))], [items]);
  const visible = category === 'All' ? items : items.filter((item) => item.category === category);

  async function addItem(item) { await catalogue.create(item); await refresh(); setNotice('Sample item added.'); setTimeout(() => setNotice(''), 2600); }
  async function removeItem(item) {
    if (!window.confirm(`Remove â€œ${item.name}â€ from this demo catalogue?`)) return;
    try { await catalogue.remove(item.id); setSelected(null); await refresh(); setNotice('Sample item removed.'); setTimeout(() => setNotice(''), 2600); }
    catch (err) { setError(err.message || 'Unable to remove this item.'); }
  }
  function resetDemo() { catalogue.reset(); refresh(''); setSearch(''); setCategory('All'); setNotice('Demo catalogue reset to sample data.'); setTimeout(() => setNotice(''), 2600); }

  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#top" aria-label="MedTech home"><span className="brand-mark">+</span><span>med<span className="brand-accent">tech</span></span></a><nav aria-label="Main navigation"><a className="active" href="#catalogue">Catalogue</a><a href="#about">About this demo</a></nav><a className="github-link" href="https://github.com/MdAsadkne/MedTech-FullStack" target="_blank" rel="noreferrer">View source <span aria-hidden="true">â†—</span></a></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="live-dot" /> DIGITAL HEALTH Â· PORTFOLIO DEMO</div><h1>A clearer way to<br /><em>explore wellness.</em></h1><p>A simple, searchable medicine catalogue built to demonstrate a React frontend and Spring Boot API.</p><div className="hero-actions"><a className="button primary" href="#catalogue">Explore catalogue <span aria-hidden="true">â†“</span></a><a className="text-link" href="https://github.com/MdAsadkne/MedTech-FullStack" target="_blank" rel="noreferrer">Explore the code <span aria-hidden="true">â†—</span></a></div><div className="hero-meta"><span><b>01</b> Catalogue</span><i /> <span><b>02</b> Search</span><i /> <span><b>03</b> Product details</span></div></div><div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="cross-card"><span className="cross-icon">âœš</span><div className="cross-lines"><i/><i/><i/></div><span className="cross-caption">CARE, MADE CLEAR</span></div><span className="spark spark-a">âœ³</span><span className="spark spark-b">âœ³</span><div className="hero-label"><span className="label-dot"/> SAMPLE CATALOGUE <span className="label-arrow">â†—</span></div></div></section>

      <section className="catalogue-section" id="catalogue"><div className="section-heading"><div><span className="eyebrow">THE CATALOGUE</span><h2>Find what youâ€™re looking for.</h2></div><button className="button outline" onClick={() => setShowForm(true)}><span className="plus">+</span> Add sample item</button></div>
        <div className="toolbar"><label className="search-box"><span aria-hidden="true">âŒ•</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products or categoriesâ€¦" aria-label="Search products or categories" /><kbd>âŒ˜ K</kbd></label><span className="result-count">{loading ? 'Loadingâ€¦' : `${visible.length} ${visible.length === 1 ? 'item' : 'items'}`}</span></div>
        <div className="filter-row" aria-label="Filter by category">{categories.map((item) => <button key={item} className={`filter-chip ${category === item ? 'selected' : ''}`} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</div>
        {notice && <div className="notice" role="status">âœ“ {notice}</div>}
        {error && <div className="error-panel" role="alert"><strong>Couldnâ€™t load the catalogue.</strong><span>{isDemo ? error : 'Check that the Spring Boot API is running and VITE_API_BASE_URL is configured.'}</span><button className="text-link" onClick={() => refresh()}>Try again â†»</button></div>}
        {loading && <div className="catalogue-grid">{[1, 2, 3].map((n) => <div className="skeleton" key={n}/>)}</div>}
        {!loading && !error && visible.length > 0 && <div className="catalogue-grid">{visible.map((item, index) => <article className="medicine-card" key={item.id}><button className={`product-art art-${index % 4}`} onClick={() => setSelected(item)} aria-label={`View ${item.name} details`}><span className="product-symbol">{['âœ³', 'â—‰', 'âœš', 'â—Œ'][index % 4]}</span><span className="art-index">MTâ€”{String(index + 1).padStart(2, '0')}</span></button><div className="card-body"><div className="card-topline"><Pill>{item.category || 'General'}</Pill><button className="more-button" aria-label={`More about ${item.name}`} onClick={() => setSelected(item)}>â†—</button></div><h3>{item.name}</h3><p>{item.description || 'No description provided.'}</p><div className="card-bottom"><strong>{money.format(Number(item.price) || 0)}</strong><span className={`rx-label ${item.prescriptionRequired ? 'rx' : ''}`}>{item.prescriptionRequired ? 'Rx required' : 'Catalogue item'}</span></div></div></article>)}</div>}
        {!loading && !error && visible.length === 0 && <div className="empty-state"><span>âŒ•</span><h3>No matching items</h3><p>Try a different search or choose another category.</p><button className="text-link" onClick={() => { setSearch(''); setCategory('All'); }}>Clear filters â†—</button></div>}
      </section>

      <section className="about-strip" id="about"><div className="about-icon">i</div><div><span className="eyebrow">A NOTE ABOUT THIS PROJECT</span><h2>Built for learning. Designed with care.</h2><p>This portfolio demo uses fictional catalogue data. It does not sell products, process prescriptions, or replace professional medical advice.</p></div><div className="about-stack"><span>BUILT WITH</span><b>React <i>Â·</i> Spring Boot <i>Â·</i> H2</b><a href="https://github.com/MdAsadkne/MedTech-FullStack" target="_blank" rel="noreferrer">Read the project docs â†—</a></div></section>
    </main>
    <footer><a className="brand footer-brand" href="#top"><span className="brand-mark">+</span><span>med<span className="brand-accent">tech</span></span></a><span>Educational portfolio project Â· No medical advice</span><button className="footer-reset" onClick={resetDemo}>Reset demo data</button><span>Â© 2026 Md Asad Khurshid</span></footer>
    {showForm && <AddMedicine onAdd={addItem} onClose={() => setShowForm(false)} />}
    {selected && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section className="modal detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title"><div className="modal-heading"><div><span className="eyebrow">PRODUCT DETAILS</span><h2 id="detail-title">{selected.name}</h2></div><button className="icon-button" onClick={() => setSelected(null)} aria-label="Close">Ã—</button></div><Pill>{selected.category || 'General'}</Pill><p className="detail-copy">{selected.description || 'No description provided.'}</p><div className="detail-price"><span>Sample catalogue price</span><strong>{money.format(Number(selected.price) || 0)}</strong></div><p className="modal-note">{selected.prescriptionRequired ? 'Marked as prescription-required in this sample catalogue.' : 'Fictional listing for demonstration only.'} This is not medical advice.</p><div className="form-actions"><button className="button secondary danger" onClick={() => removeItem(selected)}>Remove sample item</button><button className="button primary" onClick={() => setSelected(null)}>Done</button></div></section></div>}
  </div>;
}

