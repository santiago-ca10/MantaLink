import { Link } from 'react-router-dom';

export default function NoEncontrada() {
  return (
    <section className="screen" style={{ textAlign: 'center', padding: '40px 0' }}>
      <h2>No encontramos esa página</h2>
      <p style={{ color: 'var(--ink-soft)' }}>Puede que el enlace esté mal escrito o que la publicación ya no exista.</p>
      <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>Ir al inicio</Link>
    </section>
  );
}
