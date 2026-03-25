const NuevoDescuento = () => {
    return (
        <div className="page-container">
            <div className="products-page">
                <div className="products-page-header">
                    <ButtonClose
                        onClick={() => navigate('/descuentos')}
                    />
                </div>
            </div>
            <h1>Nuevo Descuento</h1>
        </div>
    )
}

export default NuevoDescuento;