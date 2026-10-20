import { usePreferencias } from '../context/PreferenciasContext';

export default function Configuracion() {
  const { tema, setTema, letra, setLetra, restaurar } = usePreferencias();
  const temas = [['manta', 'Manta (predeterminado)', 'swatch-flag', undefined], ['oscuro', 'Modo oscuro', '', '#10141C'], ['clasico', 'Verde clásico', '', '#2E5D45']] as const;
  return (
    <section className="screen">
      <div className="section-title"><h3>Configuración</h3></div>
      <div className="settings-card">
        <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginBottom: 22 }} onClick={restaurar}>↺ Restaurar valores por defecto</button>
        <h4>Tema de color</h4>
        <div className="theme-options">
          {temas.map(([v, texto, clase, color]) => (
            <button key={v} className={`theme-opt${tema === v ? ' active' : ''}`} aria-pressed={tema === v} onClick={() => setTema(v)}>
              <span className={`swatch ${clase}`} style={color ? { background: color } : undefined} />{texto}
            </button>
          ))}
        </div>
        <h4>Tamaño de letra</h4>
        <div className="seg">
          <button className={letra === 'normal' ? 'active' : ''} aria-pressed={letra === 'normal'} onClick={() => setLetra('normal')}>Normal</button>
          <button className={letra === 'grande' ? 'active' : ''} aria-pressed={letra === 'grande'} onClick={() => setLetra('grande')}>Grande</button>
        </div>
        <p className="settings-note">Estas preferencias se guardan en este dispositivo.</p>
      </div>
    </section>
  );
}
