import { useState, useEffect } from 'react';
import { useOrder } from '../context/OrderContext';
import { checkToken } from '../utils/authUtils';
import { getDescuentos } from '../services/descuentos.service';
import { SubmitButton } from '../components/buttons/SubmitButton';
import { Discounts } from '../components/Discounts';
import { useNavigate } from 'react-router-dom';

const AddDiscount = () => {

    const [descuentos, setDescuentos] = useState([]);
    const { addProduct, addDiscount, removeDiscount, discountsSelected } = useOrder();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    
    const onChange = (name, value) => {

        if (name === 'discounts') {
            if (value.action === 'ADD_DISCOUNT') {
                addDiscount(value.discount);                
            }
            else if (value.action === 'REMOVE_DISCOUNT') {
                removeDiscount(value.discount.id);
            }
        }
      

    };
   
   
    const fetchDescuentos = async () => {
        setLoading(true);
        try {
            checkToken();
            const data = await getDescuentos();
            setDescuentos(data);
        } catch (err) {
            setErrorData({
                codeError: err.status || 500,
                isOpen: true
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDescuentos();
    }, []);

    return (
        <div className="add-discount__container">
            <div className="add-discount__button-container">
                <SubmitButton 
                text="Guardar" 
                onClick={() => {navigate('/cobro')}} />
                </div>
                    <Discounts discounts={descuentos} discountsSelected={discountsSelected} onChange={onChange} />
        </div>
    );
}

export default AddDiscount;