import { Switch } from 'antd';



 export  function Discounts({ discounts, discountsSelected, onChange }) {
    return (

        <div className="nueva-orden__descuentos--container">
        {discounts.map(discount => (
            <div key={discount.id} className="nueva-orden__descuentos--item">
                <div>
                    <span className="nueva-orden__descuentos--nombre">{discount.nombre}</span>
                    <span className="nueva-orden__descuentos--monto">
                        {' '}
                        {discount.tipo === 'PORCENTAJE' ? `${discount.monto}%` : `$${discount.monto}`}
                        </span>
                </div>
                <Switch
                    className="nueva-orden__descuentos--switch"
                    checked={
                        discountsSelected.some(disc => disc.id === discount.id)
                    }
                    onChange={
                        (checked) => {
                            onChange('discounts', {
                                discount: discount,
                                action: (checked) ? "ADD_DISCOUNT" : "REMOVE_DISCOUNT"
                            });
                        }
                    } />
            </div>
        ))}
    </div>

    )
}