export const ButtonAmount = ({ amount, clickHandler, showLabel = true }) => {
    const available = amount > 0;
    let label = '';
    if (showLabel) {
        label = available ? "Disponible" : 'Agotado';
    }
    const text = available ? label + " (" + (amount) + ")" : label + ' (' + (amount) + ")";
    return (
        <div className={available ? 'productos-page-cantidad-disponible' : 'productos-page-cantidad-no-disponible'} 
        onClick={(e) => {
            e.stopPropagation();
            clickHandler();}}>
            {text}
        </div>
    );
};
