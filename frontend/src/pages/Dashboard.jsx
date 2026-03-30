import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FileUpload from '../components/FileUpload';
import { CreditCard, History, LogOut } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleBuyCredits = async () => {
    try {
      const amount = 99; // Price in INR
      const creditsToAdd = 5;

      // 1. Create order on backend
      const { data: orderData } = await axios.post('/api/payments/create-order', {
        amount,
        creditsToAdd
      });

      // 2. Initialize Razorpay Checkout
      const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      
      if (!rzpKey || rzpKey.includes('MOCK') || rzpKey.includes('REPLACE')) {
        setError('Razorpay Key ID is not configured. Please add it to your frontend/.env file.');
        return;
      }

      const options = {
        key: rzpKey, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ResumeAI',
        description: `Purchase ${creditsToAdd} Credits`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // 3. Verify Payment on Backend
            const { data: verifyData } = await axios.post('/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              creditsToAdd
            });
            
            // Force reload to update user credits from context easily
            window.location.reload();
          } catch (verifyError) {
            setError(verifyError.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#3b82f6', // primary color
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(response.error.description);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment');
    }
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await axios.post('/api/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Analysis Result:', data.analysis);
      
      // Navigate to analysis result page with the data and update context if needed
      // using a dummy ID in URL since we haven't saved to DB yet in this basic version
      navigate(`/analysis/latest`, { state: { analysis: data.analysis } });
      
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong during analysis');
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return <div className="container mx-auto p-8 text-center">Please login to view dashboard.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Profile Section */}
      <div className="glass-card rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name}</h1>
          <p className="text-muted">Manage your resumes and view analysis history.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4 items-center">
          <div className="bg-surface border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">Remaining Credits</p>
              <p className="text-xl font-bold">{user.credits}</p>
            </div>
            {/* Buy Credits Button for Razorpay integration */}
            <button 
              onClick={handleBuyCredits}
              className="ml-4 text-xs bg-primary/20 hover:bg-primary/40 text-primary-light px-3 py-1 rounded-md transition-colors border border-primary/30 font-bold"
            >
              Buy More
            </button>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-muted hover:text-white transition-colors p-2"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-8 flex items-center justify-between">
          <p>{error}</p>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-400">×</button>
        </div>
      )}

      {/* Main Upload Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <FileUpload onUpload={handleFileUpload} isUploading={isUploading} />
      </motion.div>

      {/* History Placeholder */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <History className="h-6 w-6 text-primary" /> Analysis History
        </h2>
        <div className="glass p-8 rounded-2xl border-white/5 text-center">
          <p className="text-muted">You haven't uploaded any resumes yet. Upload one above to get started!</p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
