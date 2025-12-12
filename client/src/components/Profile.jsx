// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext.jsx';
// import { authApi } from '../utils/api.js';
// import toast from 'react-hot-toast';
// import api from '../utils/api';

// const Profile = () => {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     location: '',
//     bio: '',
//     linkedin: '',
//     github: '',
//   });
//   const [avatar, setAvatar] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState('');
//   const [resumeFile, setResumeFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: '',
//   });

//   const [activeTab, setActiveTab] = useState('profile'); // profile , security, resume
//   const [showProfileModal, setShowProfileModal] = useState(false);

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const response = await authApi.getProfile();
//       setFormData({
//         name: response.data.user.name,
//         email: response.data.user.email,
//         phone: response.data.user.phone || '',
//         location: response.data.user.location || '',
//         bio: response.data.user.bio || '',
//         linkedin: response.data.user.linkedin || '',
//         github: response.data.user.github || '',
//       });
//       if (response.data.user.avatar) {
//         setAvatarPreview(`http://localhost:8000/${response.data.user.avatar}`);
//       }
//       if (response.data.user.resume) {
//         // console.log('Resume file path:', response.data.user.resume);
//         setResumeFile(response.data.user.resume);
//       }
//     } catch (error) {
//       toast.error('Failed to fetch profile');
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handlePasswordChange = (e) => {
//     setPasswordData({
//       ...passwordData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setAvatar(file);
//       setAvatarPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await authApi.updateProfile(formData);
//       toast.success('Profile updated successfully!');

//       if (avatar) {
//         const formDataAvatar = new FormData();
//         formDataAvatar.append('avatar', avatar);
//         await authApi.uploadAvatar(formDataAvatar);
//         toast.success('Avatar updated successfully!');
//         setAvatar(null);
//         fetchProfile();
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to update profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       toast.error('New passwords do not match');
//       return;
//     }

//     setLoading(true);

//     try {
//       await authApi.changePassword(passwordData);
//       toast.success('Password changed successfully!');
//       setPasswordData({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: '',
//       });
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to change password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResumeUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (
//       !file.type.includes('pdf') &&
//       !file.type.includes('msword') &&
//       !file.type.includes('wordprocessingml')
//     ) {
//       toast.error('Only PDF and Word documents are allowed');
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       toast.error('File size must be less than 5MB');
//       return;
//     }

//     const formDataResume = new FormData();
//     formDataResume.append('resume', file);

//     try {
//       await authApi.uploadResume(formDataResume);
//       toast.success('Resume uploaded successfully!');
//       fetchProfile();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to upload resume');
//     }
//   };

//   const downloadFile = async (filePath) => {
//     // Change parameter name from 'filename' to 'filePath'
//     try {
//       const justFilename = getFileName(filePath); // Use getFileName instead of manually splitting

//       // Determine file type based on path
//       let fileType = 'resumes';
//       const normalizedPath = filePath
//         ? filePath.replace(/\\/g, '/').toLowerCase()
//         : '';

//       if (normalizedPath.includes('cover')) {
//         fileType = 'cover-letters';
//       } else if (normalizedPath.includes('avatar')) {
//         fileType = 'avatars';
//       }

//       console.log('Downloading:', { filePath, justFilename, fileType });

//       const response = await api.get(
//         `/v1/applications/files/${fileType}/${justFilename}`,
//         {
//           responseType: 'blob',
//         }
//       );

//       const url = window.URL.createObjectURL(response.data);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', justFilename);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Download error:', error);
//       toast.error('Failed to download file');
//     }
//   };

//   const getFileName = (path) => {
//     if (!path) return null;

//     const normalizedPath = path.replace(/\\/g, '/');
//     return normalizedPath.split('/').pop();
//   };

//   const handleDeleteResume = async () => {
//     if (!window.confirm('Are you sure you want to delete your resume?')) return;

//     try {
//       await authApi.deleteResume();
//       toast.success('Resume deleted successfully!');
//       setResumeFile(null);
//       fetchProfile();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to delete resume');
//     }
//   };

//   const handleDeleteAvatar = async () => {
//     if (!window.confirm('Are you sure you want to delete your avatar?')) return;

//     try {
//       await authApi.deleteAvatar();
//       toast.success('Avatar deleted successfully!');
//       setAvatarPreview('');
//       fetchProfile();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to delete avatar');
//     }
//   };

//   const resetForm = () => {
//     setAvatar(null);
//     setAvatarPreview('');
//     setPasswordData({
//       currentPassword: '',
//       newPassword: '',
//       confirmPassword: '',
//     });
//     setActiveTab('profile');
//     fetchProfile();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Header with Back Button */}
//         <div className="mb-6 flex items-center gap-4">
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition text-gray-700 font-medium"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//             Back to Dashboard
//           </button>
//         </div>

//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600">
//             <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
//             <p className="text-blue-100">Manage your account settings</p>
//           </div>

//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {/* Left Column - Avatar & Basic Info */}
//               <div className="md:col-span-1">
//                 <div className="space-y-6">
//                   {/* Avatar Upload */}
//                   <div className="text-center">
//                     <div className="relative inline-block">
//                       <img
//                         src={
//                           avatarPreview ||
//                           (user?.avatar
//                             ? `http://localhost:8000/api/v1/auth/avatar-display`
//                             : `https://ui-avatars.com/api/?name=${formData.name}&background=random`)
//                         }
//                         alt="Avatar"
//                         className="w-32 h-32 rounded-full border-4 border-white shadow-lg mx-auto"
//                       />
//                       <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handleAvatarChange}
//                           className="hidden"
//                         />
//                         <svg
//                           className="w-5 h-5"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//                           />
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//                           />
//                         </svg>
//                       </label>
//                     </div>
//                     <p className="text-sm text-gray-500 mt-2">
//                       Click to change photo
//                     </p>
//                     {avatarPreview && (
//                       <button
//                         onClick={handleDeleteAvatar}
//                         className="text-xs text-red-600 hover:text-red-800 mt-1"
//                       >
//                         Delete Avatar
//                       </button>
//                     )}
//                   </div>

//                   {/* Resume Upload */}
//                   <div className="border rounded-lg p-4">
//                     <h3 className="font-medium text-gray-800 mb-2">Resume</h3>
//                     {resumeFile ? (
//                       <div className="bg-green-50 p-3 rounded border border-green-200 mb-2">
//                         <p className="text-sm text-green-800 font-medium mb-2">
//                           ✓ Resume Uploaded
//                         </p>
//                         <div className="flex gap-2">
//                           {/* <a
//                             // href={`http://localhost:8000/${resumeFile}`}
//                             href={`http://localhost:8000/api/v1/files/resumes/${getFileName(
//                               resumeFile
//                             )}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
//                           >
//                             Download
//                           </a> */}
//                           <button
//                             // onClick={() =>downloadFile(getFileName(selectedApp.resume),'resumes')}
//                             onClick={() => downloadFile(resumeFile)}
//                             className="tezt-xs bg-blue-600 hover:bg-blue-900 text-white px-2 py-1"
//                           >
//                             Download
//                           </button>
//                           <button
//                             onClick={handleDeleteResume}
//                             className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     ) : null}
//                     <label className="block w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition">
//                       <input
//                         type="file"
//                         accept=".pdf,.doc,.docx"
//                         onChange={handleResumeUpload}
//                         className="hidden"
//                       />
//                       <svg
//                         className="w-8 h-8 text-gray-400 mx-auto mb-2"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
//                         />
//                       </svg>
//                       <span className="text-sm text-gray-600">
//                         {resumeFile ? 'Update Resume' : 'Upload Resume'}
//                       </span>
//                       <p className="text-xs text-gray-500 mt-1">
//                         PDF or DOC, max 5MB
//                       </p>
//                     </label>
//                   </div>

//                   {/* Account Info */}
//                   <div className="space-y-2">
//                     <h3 className="font-medium text-gray-800">
//                       Account Information
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       Email: {formData.email}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Member since:{' '}
//                       {user?.createdAt
//                         ? new Date(user.createdAt).toLocaleDateString()
//                         : 'N/A'}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Column - Forms */}
//               <div className="md:col-span-2 space-y-8">
//                 {/* Profile Form */}
//                 <form onSubmit={handleProfileSubmit} className="space-y-4">
//                   <h3 className="text-lg font-medium text-gray-800">
//                     Personal Information
//                   </h3>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Full Name *
//                       </label>
//                       <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Phone Number
//                       </label>
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Location
//                     </label>
//                     <input
//                       type="text"
//                       name="location"
//                       value={formData.location}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="City, Country"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Bio
//                     </label>
//                     <textarea
//                       name="bio"
//                       value={formData.bio}
//                       onChange={handleChange}
//                       rows="3"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="Tell us about yourself..."
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         LinkedIn Profile
//                       </label>
//                       <input
//                         type="url"
//                         name="linkedin"
//                         value={formData.linkedin}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         placeholder="https://linkedin.com/in/username"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         GitHub Profile
//                       </label>
//                       <input
//                         type="url"
//                         name="github"
//                         value={formData.github}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         placeholder="https://github.com/username"
//                       />
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50"
//                   >
//                     {loading ? 'Saving...' : 'Save Changes'}
//                   </button>
//                 </form>

//                 {/* Password Change Form */}
//                 <form
//                   onSubmit={handlePasswordSubmit}
//                   className="space-y-4 border-t pt-6"
//                 >
//                   <h3 className="text-lg font-medium text-gray-800">
//                     Change Password
//                   </h3>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Current Password *
//                     </label>
//                     <input
//                       type="password"
//                       name="currentPassword"
//                       value={passwordData.currentPassword}
//                       onChange={handlePasswordChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         New Password *
//                       </label>
//                       <input
//                         type="password"
//                         name="newPassword"
//                         value={passwordData.newPassword}
//                         onChange={handlePasswordChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Confirm New Password *
//                       </label>
//                       <input
//                         type="password"
//                         name="confirmPassword"
//                         value={passwordData.confirmPassword}
//                         onChange={handlePasswordChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition duration-200 disabled:opacity-50"
//                   >
//                     Change Password
//                   </button>
//                 </form>

//                 {/* Danger Zone */}
//                 <div className="border-t pt-6">
//                   <h3 className="text-lg font-medium text-red-800 mb-4">
//                     Danger Zone
//                   </h3>
//                   <button
//                     onClick={logout}
//                     className="bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition duration-200"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { authApi } from '../utils/api.js';
import api from '../utils/api';
import toast from 'react-hot-toast';
import ProfileModal from './ProfileModal.jsx';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    linkedin: '',
    github: '',
    avatar: '',
    resume: '',
    createdAt: '',
  });
  const [loading, setLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authApi.getProfile();
      const userData = response.data.user;

      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || 'Not provided',
        location: userData.location || 'Not provided',
        bio: userData.bio || 'No bio added',
        linkedin: userData.linkedin || 'Not provided',
        github: userData.github || 'Not provided',
        avatar: userData.avatar || '',
        resume: userData.resume || '',
        createdAt: userData.createdAt || '',
      });
    } catch (error) {
      toast.error('Failed to fetch profile');
    }
  };

  const downloadResume = async () => {
    if (!profileData.resume) {
      toast.error('No resume available');
      return;
    }

    try {
      const justFilename = getFileName(profileData.resume);
      const response = await api.get(
        `/v1/applications/files/resumes/${justFilename}`,
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', justFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download resume');
    }
  };

  const getFileName = (path) => {
    if (!path) return '';
    const normalizedPath = path.replace(/\\/g, '/');
    return normalizedPath.split('/').pop();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition text-gray-700 font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={
                    profileData.avatar
                      ? `http://localhost:8000/${profileData.avatar}`
                      : `https://ui-avatars.com/api/?name=${profileData.name}&background=random&size=128`
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
              </div>

              {/* Basic Info */}
              <div className="text-center md:text-left text-white">
                <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
                <p className="text-blue-100 text-lg mb-1">
                  {profileData.email}
                </p>
                <p className="text-blue-100">
                  Member since: {formatDate(profileData.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Personal Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Personal Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Phone Number
                      </label>
                      <p className="text-gray-800 mt-1">{profileData.phone}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Location
                      </label>
                      <p className="text-gray-800 mt-1">
                        {profileData.location}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Bio
                      </label>
                      <p className="text-gray-800 mt-1 whitespace-pre-line">
                        {profileData.bio}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Social Profiles
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        LinkedIn
                      </label>
                      {profileData.linkedin !== 'Not provided' ? (
                        <a
                          href={profileData.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 mt-1 block"
                        >
                          {profileData.linkedin}
                        </a>
                      ) : (
                        <p className="text-gray-800 mt-1">
                          {profileData.linkedin}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        GitHub
                      </label>
                      {profileData.github !== 'Not provided' ? (
                        <a
                          href={profileData.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 mt-1 block"
                        >
                          {profileData.github}
                        </a>
                      ) : (
                        <p className="text-gray-800 mt-1">
                          {profileData.github}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Resume & Account Info */}
              <div className="space-y-6">
                {/* Resume Section */}
                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Resume
                  </h2>

                  {profileData.resume ? (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-6 h-6 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="font-medium text-green-800">
                              Resume Uploaded
                            </span>
                          </div>
                          <p className="text-sm text-green-600 mt-1">
                            {getFileName(profileData.resume)}
                          </p>
                        </div>
                        <button
                          onClick={downloadResume}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
                        >
                          Download Resume
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center">
                      <svg
                        className="w-12 h-12 text-yellow-500 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-yellow-800 font-medium">
                        No Resume Uploaded
                      </p>
                      <p className="text-yellow-600 text-sm mt-1">
                        Upload your resume from the edit profile modal
                      </p>
                    </div>
                  )}
                </div>

                {/* Account Statistics */}
                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Account Statistics
                  </h2>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Account Created</span>
                      <span className="font-medium">
                        {formatDate(profileData.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Profile Completeness
                      </span>
                      <span className="font-medium text-green-600">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-medium">
                        {formatDate(profileData.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Quick Actions
                  </h2>

                  <div className="space-y-3">
                    <button
                      onClick={() => setShowProfileModal(true)}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-700 transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit Profile Details
                    </button>

                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-md font-medium hover:bg-gray-200 transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal for Editing */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          fetchProfile(); // Refresh profile data after modal closes
        }}
      />
    </div>
  );
};

export default Profile;
