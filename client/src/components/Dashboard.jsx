import React, { useContext, useEffect, useState } from 'react';
import api from '../utils/api.js';
import ApplicationList from './ApplicationList.jsx';
import AddApplication from './AddApplication.jsx';
import StatsCard from './StatsCard.jsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications');
      setApplications(res.data.applications);
    } catch (error) {
      console.error('Error in Fetching Applications', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchStats = async () => {
    try {
      const response = await api.get('/applications/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error in Fetching Stats', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const chartData = stats.map((stat) => ({
    status: stat._id,
    count: stat.count,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Job Tracker</h1>
            </div>
            <Link
              to="/profile"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
            >
              Profile
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats and Chart */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total Applications"
                value={applications.length}
                color="blue"
              />
              <StatsCard
                title="Interviews"
                value={
                  applications.filter((app) => app.status === 'Interview')
                    .length
                }
                color="green"
              />
              <StatsCard
                title="Offers"
                value={
                  applications.filter((app) => app.status === 'Offer').length
                }
                color="purple"
              />
              <StatsCard
                title="Rejected"
                value={
                  applications.filter((app) => app.status === 'Rejected').length
                }
                color="red"
              />
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Application Status Distribution
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column - Add Application */}
          <div>
            <AddApplication onAdd={fetchApplications} />
          </div>
        </div>

        {/* Application List */}
        <div className="mt-8">
          <ApplicationList
            applications={applications}
            loading={loading}
            onUpdate={fetchApplications}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
