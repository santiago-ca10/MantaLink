import { usePreferencias } from '../context/PreferenciasContext';
import { t } from '../utils/i18n';

export default function Configuracion() {
  const { tema, setTema, letra, setLetra, idioma, setIdioma, restaurar } = usePreferencias();
  const temas = [['manta', t(idioma, 'themeManta'), 'swatch-flag', undefined], ['oscuro', t(idioma, 'themeDark'), '', '#10141C'], ['clasico', t(idioma, 'themeClassic'), '', '#2E5D45']] as const;
  return (
    <section className="screen">
      <div className="section-title"><h3>{t(idioma, 'config')}</h3></div>
      <div className="settings-card">
        <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginBottom: 22 }} onClick={restaurar}>{t(idioma, 'defaults')}</button>
        <h4>{t(idioma, 'theme')}</h4>
        <div className="theme-options">
          {temas.map(([v, texto, clase, color]) => (
            <button key={v} className={`theme-opt${tema === v ? ' active' : ''}`} aria-pressed={tema === v} onClick={() => setTema(v)}>
              <span className={`swatch ${clase}`} style={color ? { background: color } : undefined} />{texto}
            </button>
          ))}
        </div>
        <h4>{t(idioma, 'textSize')}</h4>
        <div className="seg">
          <button className={letra === 'normal' ? 'active' : ''} aria-pressed={letra === 'normal'} onClick={() => setLetra('normal')}>{t(idioma, 'normal')}</button>
          <button className={letra === 'grande' ? 'active' : ''} aria-pressed={letra === 'grande'} onClick={() => setLetra('grande')}>{t(idioma, 'large')}</button>
        </div>
        <h4>{t(idioma, 'language')}</h4>
        <div className="seg">
          <button className={idioma === 'es' ? 'active' : ''} aria-pressed={idioma === 'es'} onClick={() => setIdioma('es')}>{t(idioma, 'spanish')}</button>
          <button className={idioma === 'en' ? 'active' : ''} aria-pressed={idioma === 'en'} onClick={() => setIdioma('en')}>{t(idioma, 'english')}</button>
        </div>
        <p className="settings-note">{t(idioma, 'localPreferences')}</p>
      </div>
    </section>
  );
}
