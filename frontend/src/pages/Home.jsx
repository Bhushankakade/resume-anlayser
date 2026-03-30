import { ArrowRight, CheckCircle, FileText, Upload, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 flex items-center justify-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] pointer-events-none" />
        
        <div className="container mx-auto px-4 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Get Hired Faster with <br />
              <span className="gradient-text">AI Resume Analysis</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto mb-10">
              Upload your resume and get instant, actionable feedback. Discover your strengths, fix weaknesses, and land your dream job.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="group flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-primary/25"
              >
                Start Free Analysis <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login" 
                className="glass border border-white/10 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/5 transition-all"
              >
                Return to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why use ResumeAI?</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Our advanced LLM engine breaks down every line of your resume to provide enterprise-grade feedback.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card p-8 rounded-2xl"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Feedback</h3>
              <p className="text-muted">Get your resume scored and reviewed in seconds. No more waiting for human recruiters.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card p-8 rounded-2xl"
            >
              <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 border border-secondary/20">
                <CheckCircle className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Actionable Insights</h3>
              <p className="text-muted">Receive exact suggestions on how to improve your bullet points and highlight your impact.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card p-8 rounded-2xl"
            >
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <Upload className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Upload</h3>
              <p className="text-muted">Securely upload your PDF resume with a single click. We handle the heavy lifting of parsing text.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
