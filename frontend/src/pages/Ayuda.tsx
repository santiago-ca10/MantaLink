import { Link } from 'react-router-dom';

const PREGUNTAS: [string, string][] = [
  ['¿Cómo publico un producto o servicio?', 'Crea tu cuenta (solo para habitantes de Manta). Cuando un administrador la verifique, entra a “Vender”, toca “+ Publicar producto o servicio” y completa nombre, precio, descripción, fotos y tu contacto.'],
  ['¿Cómo contacto a quien ofrece algo?', 'Abre la publicación y usa “Contactar por WhatsApp” o “Llamar al productor”. No necesitas cuenta para ver ni para contactar.'],
  ['¿Por qué mi publicación no aparece?', 'Cada publicación es revisada por un administrador antes de mostrarse. En “Vender” ves si está en revisión, publicada o rechazada, y el motivo si fue rechazada.'],
  ['¿Quién puede crear una cuenta?', 'Solo los habitantes de Manta, Cundinamarca. Al registrarte confirmas tu vereda o barrio, y tu cuenta queda en verificación antes de poder publicar.'],
  ['¿MantaLink cobra alguna comisión?', 'No. El portal solo conecta a compradores y productores; el acuerdo se hace directamente entre ustedes y no se manejan pagos aquí.'],
  ['Vi algo que no está bien, ¿qué hago?', 'Abre la publicación y toca “Reportar esta publicación”. Un administrador la revisará.'],
];

export default function Ayuda() {
  return (
    <section className="screen">
      <div className="section-title"><h3>Centro de ayuda</h3></div>
      {PREGUNTAS.map(([q, a]) => <div className="help-item" key={q}><h4>{q}</h4><p style={{ margin: 0, color: 'var(--ink-soft)' }}>{a}</p></div>)}
      <p>¿No encuentras lo que buscas? <Link to="/contacto" className="link">Escríbele al equipo</Link>.</p>
      <p><Link to="/privacidad" className="link">Política de privacidad</Link></p>
    </section>
  );
}
