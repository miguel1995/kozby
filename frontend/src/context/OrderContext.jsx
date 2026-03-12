import { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [cash, setCash] = useState(0);

    useEffect(() => {
        setTotal(items.reduce((acc, item) => acc + item.cantidad * item.precio, 0));
    }, [items]);

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
            discounts: item.discounts ?? '',
        };
        setItems((prev) => [...prev, lineItem]);
    };

    const removeItem = (id) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const clearOrder = () => {
        setItems([]);
    };

    const value = {
        items,
        total,
        addProduct,
        removeItem,
        clearOrder,
        paymentMethod,
        cash,
        setPaymentMethod,
        setCash,
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
