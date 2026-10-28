export const formatearTelefono = (telefono) => {
  if (!telefono) return '';
  const digitos = telefono.replace(/\D/g, '');
  if (digitos.startsWith('549')) {
    const local = digitos.slice(3);
    if (local.length === 8) {
      return `0${local.slice(0, 4)} ${local.slice(4)}`;
    }
    if (local.length === 10) {
      return `0291 ${local.slice(0, 4)}-${local.slice(4)}`;
    }
  }
  return digitos;
};

export const formatearPrecio = (precio) => {
  if (!precio) return '';
  return precio.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};

export const formatearFecha = (fechaISO) => {
  if (!fechaISO) return '';
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const tiempoRelativo = (fechaISO) => {
  if (!fechaISO) return '';
  const fecha = new Date(fechaISO);
  const ahora = new Date();
  const diffMs = ahora - fecha;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHora = Math.floor(diffMs / 3600000);
  const diffDia = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Ahora mismo';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHora < 24) return `Hace ${diffHora} h`;
  if (diffDia < 7) return `Hace ${diffDia} d`;
  return formatearFecha(fechaISO);
};
