import React, { useState } from 'react';
import { format } from 'date-fns';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ApplicationList = ({ applications, loading, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (application) => {
    setEditingId(application._id);
    setEditForm({
      company: application.company,
      position: application.position,
      status: application.status,
      notes: application.notes || '',
      salary: application.salary || '',
    });
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/v1/applications/${id}`, editForm);
      toast.success('Application updated!');
      setEditingId(null);
      onUpdate();
    } catch (error) {
      console.error('Update error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to update application'
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await api.delete(`/v1/applications/${id}`);
        toast.success('Application deleted!');
        onUpdate();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(
          error.response?.data?.message || 'Failed to delete application'
        );
      }
    }
  };

  const handleDeleteResume = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await api.delete(`/v1/applications/${id}/resume`);
        toast.success('Resume deleted!');
        onUpdate();
      } catch (error) {
        toast.error('Failed to delete resume');
      }
    }
  };

  const handleDeleteCoverLetter = async (id) => {
    if (window.confirm('Are you sure you want to delete this cover letter?')) {
      try {
        await api.delete(`/v1/applications/${id}/cover-letter`);
        toast.success('Cover letter deleted!');
        onUpdate();
      } catch (error) {
        toast.error('Failed to delete cover letter');
      }
    }
  };

  const downloadFile = async (filename, type) => {
    try {
      const response = await api.get(`/v1/files/${type}/${filename}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Applied: 'bg-blue-100 text-blue-800',
      Interview: 'bg-yellow-100 text-yellow-800',
      Rejected: 'bg-red-100 text-red-800',
      Offer: 'bg-green-100 text-green-800',
      Accepted: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getFileName = (path) => {
    if (!path) return null;
    return path.split('/').pop();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No applications yet
        </h3>
        <p className="text-gray-500">
          Add your first job application to get started!
        </p>
      </div>
    );
  }

  const selectedApp = applications.find((app) => app._id === selectedId);

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            My Applications ({applications.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Company & Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {app.company}
                    </div>
                    <div className="text-sm text-gray-500">{app.position}</div>
                    {app.jobLink && (
                      <a
                        href={app.jobLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Job
                      </a>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {editingId === app._id ? (
                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm({ ...editForm, status: e.target.value })
                        }
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Offer">Offer</option>
                        <option value="Accepted">Accepted</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(app.appliedDate), 'MMM dd, yyyy')}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    ${app.salary ? app.salary.toLocaleString() : 'N/A'}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium">
                    {editingId === app._id ? (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleUpdate(app._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="space-x-2">
                        <button
                          onClick={() => setSelectedId(app._id)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(app)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(app._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {selectedApp.company}
              </h2>
              <button
                onClick={() => setSelectedId(null)}
                className="text-white text-2xl hover:opacity-80"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase">
                    Position
                  </h3>
                  <p className="text-lg text-gray-900 mt-1">
                    {selectedApp.position}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase">
                    Status
                  </h3>
                  <p className="mt-1">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        selectedApp.status
                      )}`}
                    >
                      {selectedApp.status}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase">
                    Date Applied
                  </h3>
                  <p className="text-gray-900 mt-1">
                    {format(new Date(selectedApp.appliedDate), 'MMMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase">
                    Expected Salary
                  </h3>
                  <p className="text-gray-900 mt-1">
                    $
                    {selectedApp.salary
                      ? selectedApp.salary.toLocaleString()
                      : 'Not specified'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Job Link
                </h3>
                {selectedApp.jobLink ? (
                  <a
                    href={selectedApp.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 break-all mt-1"
                  >
                    {selectedApp.jobLink}
                  </a>
                ) : (
                  <p className="text-gray-500 mt-1">Not provided</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
                  Notes
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                  {selectedApp.notes || 'No notes added'}
                </p>
              </div>

              {/* Files Section */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">
                  Attachments
                </h3>
                <div className="space-y-3">
                  {selectedApp.resume && (
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M8.5 3.5a2 2 0 0 1 4 0V5h3a1 1 0 0 1 .82 1.573l-.324.682a1 1 0 0 0 .163 1.205l1.502 1.502a1 1 0 1 1-1.414 1.414l-1.502-1.502a1 1 0 0 0-1.205-.163l-.682.324A1 1 0 0 1 11 9h-3V6.5a2 2 0 0 1-4 0V4a1 1 0 0 0-2 0v1.5a4 4 0 0 0 8 0V3.5z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Resume
                          </p>
                          <p className="text-xs text-gray-500">
                            {getFileName(selectedApp.resume)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            downloadFile(
                              getFileName(selectedApp.resume),
                              'resumes'
                            )
                          }
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDeleteResume(selectedApp._id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedApp.coverLetter && (
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3.5a1 1 0 01-1-1v-2a1 1 0 10-2 0v2a1 1 0 01-1 1H4a1 1 0 110-2V4z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Cover Letter
                          </p>
                          <p className="text-xs text-gray-500">
                            {getFileName(selectedApp.coverLetter)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            downloadFile(
                              getFileName(selectedApp.coverLetter),
                              'cover-letters'
                            )
                          }
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          Download
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteCoverLetter(selectedApp._id)
                          }
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}

                  {!selectedApp.resume && !selectedApp.coverLetter && (
                    <p className="text-sm text-gray-500">No files attached</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2">
              <button
                onClick={() => setSelectedId(null)}
                className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationList;
