const ETIQUETAS = {
  pendiente: 'pendiente de pago',
  pagado: 'pagado',
  enviado: 'enviado',
  cancelado: 'cancelado'
};

export function EstadoPedido({ estado }) {
  return <span className={`chip-estado chip-${estado}`}>{ETIQUETAS[estado] || estado}</span>;
}
