import { useState } from 'react';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

const Teclado = () => {
  const [rawPrice, setRawPrice] = useState('');

  const handleNumberClick = (num) => {
    setRawPrice((prev) => `${prev}${num}`);
  };

  const handleDelete = () => {
    setRawPrice((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setRawPrice('');
  };

  const normalizedPrice = rawPrice ? Number(rawPrice) : 0;
  const formattedPrice = normalizedPrice.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  return (
    <div className="teclado-page">
      <h2 className="teclado-title">Teclado de precio</h2>

      <div className="teclado-display">{formattedPrice}</div>

      <div className="teclado-grid">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className="teclado-key"
            onClick={() => handleNumberClick(key)}
          >
            {key}
          </button>
        ))}
        <button type="button" className="teclado-key teclado-key--danger" onClick={handleDelete}>
          Borrar
        </button>
        <button type="button" className="teclado-key teclado-key--secondary" onClick={handleClear}>
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default Teclado;
