import { useState } from 'react';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

const Teclado = ({ handlePlus }) => {
  const [rawPrice, setRawPrice] = useState('');

  const handleNumberClick = (num) => {
    setRawPrice((prev) => `${prev}${num}`);
  };



  const handleClear = () => {
    setRawPrice('');
  };

  // Modificamos el valor normalizado para que las dos últimas cifras se tomen como decimales
  // Ejemplo: "1234" -> 12.34
  const normalizedPrice = rawPrice
    ? Number(rawPrice.slice(0, -2) || '0') + Number(`0.${rawPrice.slice(-2).padStart(2, '0')}`)
    : 0;

  const formattedPrice = normalizedPrice.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  return (
    <div className="teclado-page">

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
        <button type="button" className="teclado-key teclado-key--secondary" onClick={handleClear}>
          C
        </button>
        <button type="button" className="teclado-key teclado-key--danger"
          onClick={
            () => handlePlus(rawPrice)
          }>
          +
        </button>

      </div>
    </div>
  );
};

export default Teclado;
