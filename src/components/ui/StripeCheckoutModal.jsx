import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X, DollarSign, CreditCard, Lock, HeartHandshake } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder';
const stripePromise = stripePublicKey.startsWith('pk_') ? loadStripe(stripePublicKey) : null;

const CheckoutForm = ({ amount, setAmount, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid donation amount ($1 or more)');
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent from backend
      const res = await api.post('/funding/create-payment-intent', { amount: Number(amount) });
      const { clientSecret, paymentIntentId, isMock } = res.data;

      if (isMock || !stripe || !elements) {
        // Handle fallback test payment
        await api.post('/funding/save', {
          amount: Number(amount),
          paymentIntentId: paymentIntentId || `mock_pi_${Date.now()}`,
        });
        toast.success(`Thank you! Your donation of $${amount} was recorded.`);
        onSuccess();
        onClose();
        return;
      }

      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        toast.error(result.error.message || 'Payment failed');
      } else if (result.paymentIntent.status === 'succeeded') {
        await api.post('/funding/save', {
          amount: Number(amount),
          paymentIntentId: result.paymentIntent.id,
        });
        toast.success(`🎉 Contribution of $${amount} successfully received!`);
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          Donation Amount (USD $)
        </label>
        <div className="relative">
          <DollarSign className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-rose-500" />
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 25"
            className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition"
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {[10, 25, 50, 100].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setAmount(preset)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${
              Number(amount) === preset
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            ${preset}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
          <span>Credit / Debit Card</span>
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" /> 256-bit Encrypted
          </span>
        </label>
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '14px',
                  color: '#f8fafc',
                  '::placeholder': {
                    color: '#64748b',
                  },
                },
                invalid: {
                  color: '#f43f5e',
                },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={processing}
        className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition disabled:opacity-50"
      >
        <HeartHandshake className="w-5 h-5" />
        {processing ? 'Processing Contribution...' : `Donate $${amount || '0'} Now`}
      </button>
    </form>
  );
};

const StripeCheckoutModal = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('25');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Support BloodLife</h3>
              <p className="text-xs text-slate-400">Help fund life-saving blood logistics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {stripePromise ? (
          <Elements stripe={stripePromise}>
            <CheckoutForm amount={amount} setAmount={setAmount} onSuccess={onSuccess} onClose={onClose} />
          </Elements>
        ) : (
          <CheckoutForm amount={amount} setAmount={setAmount} onSuccess={onSuccess} onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default StripeCheckoutModal;
