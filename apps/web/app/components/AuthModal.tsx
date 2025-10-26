'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { X, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { modalOverlay, modalContent, fadeInUp, buttonHover, buttonTap } from '../../lib/animations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const user = {
        id: '1',
        email: formData.email,
        phone: formData.phone,
        name: 'John Doe'
      };
      
      onSuccess(user);
      onClose();
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          variants={modalOverlay}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClose}
        >
          <motion.div 
            className="relative w-full max-w-md"
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"
              animate={{ 
                background: [
                  'linear-gradient(45deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
                  'linear-gradient(45deg, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2))',
                  'linear-gradient(45deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <Card className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-white/10">
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                >
                  <CardTitle className="text-2xl font-bold text-white">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </CardTitle>
                  <CardDescription className="text-white/70 mt-2">
                    {isLogin ? 'Sign in to your account' : 'Get started with Solana AI IDE'}
                  </CardDescription>
                </motion.div>
                <motion.div
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onClose}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </motion.div>
              </CardHeader>
        
        <CardContent className="p-8">
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="text-sm font-medium text-white/80">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                    <motion.input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                      placeholder="Enter your email"
                      required
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              className="space-y-3"
              variants={fadeInUp}
            >
              <label className="text-sm font-medium text-white/80">
                {isLogin ? 'Email or Phone' : 'Phone Number'}
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <motion.input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                  placeholder={isLogin ? "Enter email or phone" : "Enter your phone number"}
                  required
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </div>
            </motion.div>

            <motion.div 
              className="space-y-3"
              variants={fadeInUp}
            >
              <label className="text-sm font-medium text-white/80">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-4 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </motion.button>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="text-sm font-medium text-white/80">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                    <motion.input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                      placeholder="Confirm your password"
                      required
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              <Button 
                type="submit" 
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25" 
                disabled={isLoading}
              >
                <motion.span
                  animate={isLoading ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
                  transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                >
                  {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                </motion.span>
              </Button>
            </motion.div>
          </motion.form>

          <motion.div 
            className="mt-8 text-center"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-white/60">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <motion.button
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-400 hover:text-purple-300 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </motion.button>
            </p>
          </motion.div>
        </CardContent>
        </Card>
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
}