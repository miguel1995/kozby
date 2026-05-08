import { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [discountsSelected, setDiscountsSelected] = useState([]);
    const [discountsCalculated, setDiscountsCalculated] = useState(0.00);
    const [total, setTotal] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [cash, setCash] = useState(0);

    useEffect(() => {
        const subTotal = items.reduce((acc, item) => acc + item.total, 0);

        const discountsCalculated = discountsSelected.reduce((acc, discount) => {
            if (discount.tipo === 'PORCENTAJE') {
                return acc + (subTotal * Number(discount.monto) / 100);
            } else {
                return acc + Number(discount.monto);
            }
        }, 0.00);

        setDiscountsCalculated(discountsCalculated);
        setSubTotal(subTotal);
        const total = subTotal - discountsCalculated;
        setTotal(total);
    }, [items, discountsSelected]);

    useEffect(() => {
        console.log('items', items);
        console.log('discountsSelected', discountsSelected);
        console.log('discountsCalculated', discountsCalculated);
        console.log('subTotal', subTotal);
        console.log('total', total);
    }, [items, discountsSelected, discountsCalculated, subTotal, total]);


    const addProduct = (item) => {
        const lineItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            productId: item.productId,
            productName: item.productName,
            variantId: item.variantId,
            variantName: item.variantName,
            precio: item.precio,
            cantidad: item.cantidad,
            notes: item.notes ?? '',
            discounts: item.discounts ?? [],
            subtotal: item.subtotal,
            total: item.total,
        };
        setItems((prev) => [...prev, lineItem]);
    };

    const updateProduct = (id, item) => {
        const lineItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            productId: item.productId,
            productName: item.productName,
            variantId: item.variantId,
            variantName: item.variantName,
            precio: item.precio,
            cantidad: item.cantidad,
            notes: item.notes ?? '',
            discounts: item.discounts ?? [],
            subtotal: item.subtotal,
            total: item.total,
        };
        setItems((prev) => prev.map((i) => i.id === id ? lineItem : i));
    };

    const removeItem = (id) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const clearOrder = () => {
        setItems([]);
        setDiscountsSelected([]);
    };

    const addDiscount = (discount) => {
        setDiscountsSelected((prev) => [...prev, discount]);
    };

    const removeDiscount = (id) => {
        setDiscountsSelected((prev) => prev.filter((d) => d.id !== id));
    };

    const value = {
        items,
        total,
        subTotal,
        addProduct,
        updateProduct,
        removeItem,
        clearOrder,
        paymentMethod,
        cash,
        setPaymentMethod,
        setCash,
        discountsSelected,
        addDiscount,
        removeDiscount,
        discountsCalculated
        
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder debe usarse dentro de OrderProvider');
    }
    return context;
};
