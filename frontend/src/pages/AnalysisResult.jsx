import { useLocation, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, TrendingUp, Presentation } from 'lucide-react';
import { motion } from 'framer-motion';

const AnalysisResult = () => {
  const location = useLocation();
  const result = location.state?.analysis; // Pass state through navigate

  if (!result) {
    return <Navigate to="/dashboard" replace />;
  }

  // Determine color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500 border-green-500 bg-green-500/10';
    if (score >= 60) return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
    return 'text-red-500 border-red-500 bg-red-500/10';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Link to="/dashboard" className="inline-flex items-center text-muted hover:text-white transition-colors mb-8 group">
        <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl overflow-hidden mb-8"
      >
        <div className="p-8 md:p-12 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-4">Resume Analysis Complete</h1>
            <p className="text-xl text-muted leading-relaxed">{result.summary}</p>
          </div>
          
          <div className={`relative flex items-center justify-center w-48 h-48 rounded-full border-8 ${getScoreColor(result.score).split(' ')[1]} flex-shrink-0 bg-surface shadow-2xl`}>
            {/* Inner glow effect based on score */}
            <div className={`absolute inset-0 rounded-full blur-[30px] opacity-20 ${getScoreBg(result.score)}`} />
            <div className="text-center relative z-10">
              <span className="text-6xl font-black block leading-none">{result.score}</span>
              <span className="text-sm font-semibold tracking-widest uppercase text-muted mt-2 block">Score</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-white/10">
          
          {/* Strengths */}
          <div className="bg-background/80 p-8 hover:bg-surface/50 transition-colors">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="bg-green-500/20 p-2 rounded-lg"><CheckCircle className="h-6 w-6 text-green-500" /></span>
              Key Strengths
            </h3>
            <ul className="space-y-4">
              {result.strengths?.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-gray-300">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-background/80 p-8 hover:bg-surface/50 transition-colors">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="bg-red-500/20 p-2 rounded-lg"><AlertTriangle className="h-6 w-6 text-red-500" /></span>
              Areas to Improve
            </h3>
            <ul className="space-y-4">
              {result.weaknesses?.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-gray-300">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </motion.div>

      {/* Actionable Feedback */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-8 md:p-12 mb-12 border-t-4 border-t-primary"
      >
        <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <span className="bg-primary/20 p-3 rounded-xl"><TrendingUp className="h-8 w-8 text-primary" /></span>
          Actionable Next Steps
        </h3>
        <div className="grid gap-6">
          {result.actionableFeedback?.map((item, idx) => (
            <div key={idx} className="bg-surface/50 border border-white/5 p-6 rounded-xl flex gap-4 hover:border-primary/30 transition-colors group">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                {idx + 1}
              </div>
              <p className="text-lg text-gray-200 leading-relaxed pt-1">{item}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalysisResult;
