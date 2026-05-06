'use client';

import { useState } from 'react';

export default function DonatePage() {
  const [amount, setAmount] = useState('100');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(amount),
          email: email,
          campaignId: 'general-donation',
        }),
      });

      const data = await response.json();
      if (data.orderId) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            order_id: data.orderId,
            handler: (response: any) => {
              alert('Payment successful! Transaction ID: ' + response.razorpay_payment_id);
            },
            prefill: { email: email },
          };
          new (window as any).Razorpay(options).open();
        };
        document.body.appendChild(script);
      }
    } catch (error) {
      alert('Error: ' + error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Donate to AB Seva Foundation</h1>
      <div style={{ marginBottom: '20px' }}>
        <label>Amount (₹):</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '10px' }} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={{ width: '100%', padding: '10px', marginTop: '10px' }} />
      </div>
      <button onClick={handleDonate} disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#ff6b35', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        {loading ? 'Processing...' : `Donate ₹${amount}`}
      </button>
    </div>
  );
}
