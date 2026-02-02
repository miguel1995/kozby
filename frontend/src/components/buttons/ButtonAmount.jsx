export const ButtonAmount = ({ amount, clickHandler }) => {
    const available = amount > 0;
    const text = available ? "Disponible (" + (amount) + ")" : 'Agotado (' + (amount) + ")";
    return (
        <div className={available ? 'productos-page-cantidad-disponible' : 'productos-page-cantidad-no-disponible'} 
        onClick={(e) => {
            e.stopPropagation();
            clickHandler();}}>
            {text}
        </div>
    );
};
