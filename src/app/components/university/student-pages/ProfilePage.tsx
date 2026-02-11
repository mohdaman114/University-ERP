import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
} from './ui-components';

// Assuming a simple input component for demonstration
const Input = ({ label, type = 'text', value, onChange, disabled = false, name }: { label: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean; name: string }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      name={name}
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
  </div>
);

export function ProfilePage() {
  const { user } = useAuth(); // Assuming user object has these properties

  // Temporary state for profile data
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Priya Sharma',
    email: user?.email || 'priya.sharma@university.edu',
    enrollmentNumber: 'U123456789',
    phone: '9876543210',
    address: '123 University Road, City, Country',
    dob: '2000-01-15',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real application, you would send this data to a backend API
    console.log('Saving profile data:', profileData);
    alert('Profile updated successfully! (Simulated)');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h2>
      <p className="text-gray-600 dark:text-gray-400 mt-1">
        View and update your personal information.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your contact and personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={profileData.name}
            onChange={handleChange}
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleChange}
            disabled // Email is often not editable directly by user
          />
          <Input
            label="Enrollment Number"
            name="enrollmentNumber"
            value={profileData.enrollmentNumber}
            onChange={handleChange}
            disabled // Enrollment number is usually static
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={profileData.phone}
            onChange={handleChange}
          />
          <Input
            label="Address"
            name="address"
            value={profileData.address}
            onChange={handleChange}
          />
          <Input
            label="Date of Birth"
            name="dob"
            type="date"
            value={profileData.dob}
            onChange={handleChange}
          />
          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}