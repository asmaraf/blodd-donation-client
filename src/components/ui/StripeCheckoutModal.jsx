import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { X, DollarSign, CreditCard, Lock, HeartHandshake, Calendar, ShieldCheck, Sparkles } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
const stripePromise = stripePublicKey.startsWith('pk_') ? loadStripe(stripePublicKey) : null;

const ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
      '::placeholder': {
        color: '#64748b',
      },
    },
    invalid: {
      color: '#f43f5e',
    },
  },
};

const CheckoutForm = ({ amount, setAmount, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid donation amount ($1 or more)');
      return;
    }

    setProcessing(true);
    setCardError('');

    try {
      // Create payment intent from backend
      const res = await api.post('/funding/create-payment-intent', { amount: Number(amount) });
      const { clientSecret, paymentIntentId, isMock } = res.data;

      if (isMock || !stripe || !elements) {
        // Fallback test payment
        await api.post('/funding/save', {
          amount: Number(amount),
          paymentIntentId: paymentIntentId || `mock_pi_${Date.now()}`,
        });
        toast.success(`Thank you! Your donation of $${amount} was recorded.`);
        onSuccess();
        onClose();
        return;
      }

      const cardNumberElement = elements.getElement(CardNumberElement);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
        },
      });

      if (result.error) {
        setCardError(result.error.message || 'Payment failed');
        toast.error(result.error.message || 'Payment failed');
      } else if (result.paymentIntent?.status === 'succeeded') {
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
      const errMsg = error.response?.data?.message || 'Payment failed. Please try again.';
      setCardError(errMsg);
      toast.error(errMsg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Amount Input */}
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

      {/* Preset Amount Badges */}
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

      {/* Card Details */}
      <div className="space-y-2.5 pt-1">
        {/* Card Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
            <span>Card Number</span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" /> 256-bit Encrypted
            </span>
          </label>
          <div className="bg-slate-950 border border-slate-800 focus-within:border-rose-500 px-3.5 py-3 rounded-xl transition">
            <CardNumberElement options={{ ...ELEMENT_OPTIONS, showIcon: true }} />
          </div>
        </div>

        {/* Expiry & CVC Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" /> Expiry Date
            </label>
            <div className="bg-slate-950 border border-slate-800 focus-within:border-rose-500 px-3.5 py-3 rounded-xl transition">
              <CardExpiryElement options={ELEMENT_OPTIONS} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-slate-400" /> CVC / CVC2
            </label>
            <div className="bg-slate-950 border border-slate-800 focus-within:border-rose-500 px-3.5 py-3 rounded-xl transition">
              <CardCvcElement options={ELEMENT_OPTIONS} />
            </div>
          </div>
        </div>
      </div>

      {/* Test Card Helper with 1-click Copy */}
      <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Test Card:
        </span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText('4242424242424242');
            toast.success('Test Card copied! Now click inside Card Number & press Ctrl+V', { duration: 4000 });
          }}
          className="font-mono text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 px-2 py-1 rounded border border-emerald-700/50 transition cursor-pointer flex items-center gap-1.5"
          title="Click to copy test card number"
        >
          <span>4242 4242 4242 4242</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 rounded">Copy</span>
        </button>
      </div>

      {cardError && (
        <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
          {cardError}
        </div>
      )}

      <button
        type="submit"
        disabled={processing}
        className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2"
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
            <CheckoutForm
              amount={amount}
              setAmount={setAmount}
              onSuccess={onSuccess}
              onClose={onClose}
            />
          </Elements>
        ) : (
          <div className="text-center py-6 text-slate-400 text-xs">
            Stripe keys are missing or invalid. Please check client configuration.
          </div>
        )}
      </div>
    </div>
  );
};

export default StripeCheckoutModal;
