import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { ButtonClose } from '../components/buttons/ButtonClose';
import { Input, Radio } from 'antd';
import { PAYMENT_METHODS } from '../utils/constants';
import { SubmitButton } from '../components/buttons/SubmitButton';
import usePaymentHandler from '../hooks/usePaymentHandler';
import { NumericInput } from '../components/NumericInput';

const PaymentMethod = () => {
    const navigate = useNavigate();
    const { total, enabled, values, onChange, onSubmit } = usePaymentHandler();

    return (
        <div className="payment-method">
            <div>
                <ButtonClose
                    onClick={() => navigate('/cobro')}
                />
            </div>
            <div className="payment__method--total">
                ${total.toFixed(2)}
            </div>
            <div className="payment__method--description">
                Seleccionar tipo de pago a continuaición
            </div>
            <div>

                <Radio.Group vertical onChange={(e) => onChange(e, 'paymentMethod')} >
                    {PAYMENT_METHODS.map((method) => (
                        <Radio key={method.key} value={method.value}>
                            {method.label}
                        </Radio>
                    ))}
                </Radio.Group>
            </div>
            <div className="payment__method--options">
                {values.paymentMethod.value === 'EFECTIVO' && (
                    <div>
                        <NumericInput
                            name="cash"
                            value={values.cash?.value || ''}
                            onChange={(e) => onChange(e, 'cash')}
                            placeholder="Ingrese el monto a pagar"
                        />
                        <div>
                            Cambio: ${(values.cash?.value-total.toFixed(2) > 0)?(values.cash?.value-total.toFixed(2)).toFixed(2):0}
                        </div>
                    </div>

                )}
            </div>

            <div className="payment__method--submit">
                <SubmitButton
                    onClick={() => onSubmit()}
                    text="Continuar"
                    disabled={!enabled}
                />
            </div>

        </div>
    );
};
export default PaymentMethod;