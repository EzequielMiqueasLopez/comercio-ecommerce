export function EstadoPedido({ estado }) {
  return <span className={`chip-estado chip-${estado}`}>{estado}</span>;
}
