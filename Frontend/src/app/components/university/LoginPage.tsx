import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Mail, Lock, ArrowRight, Sparkles, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types/university';
import { toast } from 'sonner';
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, CardHeader, CardTitle, CardDescription, CardContent } from './student-pages/ui-components';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const demoCredentials = [
    { label: 'Student', email: 'student@example.com', password: 'password', value: 'student' },
    { label: 'Faculty', email: 'faculty@example.com', password: 'password', value: 'faculty' },
    { label: 'Admin', email: 'admin@example.com', password: 'password', value: 'admin' },
    { label: 'Super Admin', email: 'superadmin@example.com', password: 'password', value: 'super_admin' },
    { label: 'Examination', email: 'examination@example.com', password: 'password', value: 'examination' },
    { label: 'Accounts', email: 'accounts@example.com', password: 'password', value: 'accounts' },
    { label: 'Library', email: 'library@example.com', password: 'password', value: 'library' },
  ];

  const fillDemoCredentials = (demoEmail: string, demoPassword: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setRole(demoRole);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role) {
      toast.error('Please select a role to login.');
      return;
    }

    setIsLoading(true);

    const success = await login(email, password, role as UserRole);
    
    if (success) {
      toast.success('Login successful!');
    } else {
      toast.error('Invalid credentials or role mismatch. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
        />
      </div>
      <Link to="/" className="absolute top-4 left-4 z-50">
              <Button variant="default" className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back to Home
              </Button>
            </Link>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  UniverCity
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Management System</p>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
            >
              Welcome to the Future of Education
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 dark:text-gray-400 text-lg mb-8"
            >
              A comprehensive ERP system designed to streamline academic, administrative, and operational activities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center md:justify-start"
            >
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>AI-Powered Assistant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span>Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Sparkles className="h-4 w-4 text-pink-600" />
                <span>Secure & Scalable</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-2xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription>Enter your credentials to access your dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={(val: string) => setRole(val as UserRole)}>
                      <SelectTrigger className="w-full">
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-4 w-4 text-gray-400" />
                          <SelectValue placeholder="Select your role" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="examination">Examination</SelectItem>
                        <SelectItem value="accounts">Accounts</SelectItem>
                        <SelectItem value="library">Library</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@university.edu"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      'Signing in...'
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Demo Credentials:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {demoCredentials.map((cred) => (
                      <Button
                        key={cred.label}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => fillDemoCredentials(cred.email, cred.password, cred.value as UserRole)}
                        type="button"
                      >
                        {cred.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;