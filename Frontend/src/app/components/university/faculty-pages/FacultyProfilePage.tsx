import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Label } from '../admin-pages/AdminUI';

interface FacultyProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  // Add other faculty-specific fields as needed
}

export function FacultyProfilePage() {
  const { user, updateUser, authenticatedFetch } = useAuth();
  const [profile, setProfile] = useState<FacultyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<FacultyProfile>>({});

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordUpdateError, setPasswordUpdateError] = useState<string | null>(null);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }
      try {
        const response = await authenticatedFetch('/api/faculty/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch faculty profile.');
        }
        const data = await response.json();
        setProfile(data);
        setEditedProfile(data);
      } catch (err) {
        setError((err as Error).message);
        toast.error((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;
    try {
      const response = await authenticatedFetch(`/api/faculty/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProfile),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile.');
      }
      const updatedData = await response.json();
      setProfile(updatedData);
      setEditedProfile(updatedData);
      setIsEditingProfile(false);
      toast.success('Profile updated successfully!');
      updateUser(updatedData); // Refresh user context if name/email changed
    } catch (err) {
      setError((err as Error).message);
      toast.error((err as Error).message);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordUpdateError(null);
    if (newPassword !== confirmNewPassword) {
      setPasswordUpdateError('New passwords do not match.');
      toast.error('New passwords do not match.');
      return;
    }
    setIsPasswordUpdating(true);
    try {
      const response = await authenticatedFetch('/api/faculty/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword, confirmNewPassword }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password.');
      }
      toast.success('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setPasswordUpdateError((err as Error).message);
      toast.error((err as Error).message);
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="text-center py-8">No profile data found.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>

      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>View and update your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={isEditingProfile ? editedProfile.name : profile.name}
              onChange={handleProfileChange}
              disabled={!isEditingProfile}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={isEditingProfile ? editedProfile.email : profile.email}
              onChange={handleProfileChange}
              disabled={!isEditingProfile}
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              name="department"
              value={isEditingProfile ? editedProfile.department : profile.department}
              onChange={handleProfileChange}
              disabled={!isEditingProfile}
            />
          </div>
          {/* Add other faculty-specific fields here */}
          <div className="flex justify-end gap-2">
            {isEditingProfile ? (
              <>
                <Button variant="secondary" onClick={() => { setIsEditingProfile(false); setEditedProfile(profile); }}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateProfile}>Save Changes</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditingProfile(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Password Update Card */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="oldPassword">Old Password</Label>
            <Input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input
              id="confirmNewPassword"
              type="password"
              value={confirmNewPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          {passwordUpdateError && (
            <p className="text-red-500 text-sm">{passwordUpdateError}</p>
          )}
          <div className="flex justify-end">
            <Button onClick={handlePasswordChange} disabled={isPasswordUpdating}>
              {isPasswordUpdating ? 'Updating...' : 'Change Password'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
