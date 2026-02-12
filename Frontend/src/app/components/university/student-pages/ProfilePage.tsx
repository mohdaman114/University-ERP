import React, { useState, useEffect } from 'react';
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

interface StudentProfile {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  enrollmentNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phoneNumber: string;
  parentName: string;
  parentPhoneNumber: string;
  course: string;
  branch: string;
  admissionYear: number;
  currentSemester: number;
  profilePicture: string;
}

export function ProfilePage() {
  const { user, authenticatedFetch } = useAuth();
  const [profileData, setProfileData] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => (prevData ? { ...prevData, [name]: value } : null));
  };

  const handleSave = async () => {
    if (!profileData || !user) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await authenticatedFetch(`/api/students/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile data.');
      }
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setError('User not authenticated.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await authenticatedFetch(`/api/students/profile`);

        if (response.status === 304) {
          // No new data, use existing profileData or do nothing
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = 'Failed to fetch profile data.';
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
          } catch (parseError) {
            errorMessage = errorText || errorMessage;
          }
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, authenticatedFetch]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h2>
      <p className="text-gray-600 dark:text-gray-400 mt-1">
        View and update your personal information.
      </p>

      {isLoading && <p className="text-center text-gray-500 dark:text-gray-400">Loading profile data...</p>}
      {error && <p className="text-center text-red-500 dark:text-red-400">Error: {error}</p>}

      {!isLoading && !error && !profileData && (
        <p className="text-center text-gray-500 dark:text-gray-400">No profile data found.</p>
      )}

      {!isLoading && !error && profileData && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your contact and personal details.</CardDescription>
            <div className="flex justify-end space-x-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              ) : (
                <>
                  <Button onClick={handleSave}>Update Profile</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleChange}
              disabled={true} // Email is often not editable directly by user
            />
            <Input
              label="Student ID"
              name="studentId"
              value={profileData.studentId}
              onChange={handleChange}
              disabled={true}
            />
            <Input
              label="Enrollment Number"
              name="enrollmentNumber"
              value={profileData.enrollmentNumber}
              onChange={handleChange}
              disabled={true} // Enrollment number is usually static
            />
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              label="Gender"
              name="gender"
              value={profileData.gender}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              label="Address"
              name="address"
              value={profileData.address}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              value={profileData.phoneNumber}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              label="Parent Name"
              name="parentName"
              value={profileData.parentName}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              label="Parent Phone Number"
              name="parentPhoneNumber"
              type="tel"
              value={profileData.parentPhoneNumber}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              label="Course"
              name="course"
              value={profileData.course}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              label="Branch"
              name="branch"
              value={profileData.branch}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              label="Admission Year"
              name="admissionYear"
              type="number"
              value={profileData.admissionYear.toString()}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              label="Current Semester"
              name="currentSemester"
              type="number"
              value={profileData.currentSemester.toString()}
              onChange={handleChange}
              disabled={!isEditing}
            />
            {profileData.profilePicture && (
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
                <img src={profileData.profilePicture} alt="Profile" className="mt-2 w-24 h-24 rounded-full object-cover" />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}