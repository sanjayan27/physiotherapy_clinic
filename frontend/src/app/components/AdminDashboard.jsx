"use client";

import React, { useState, useEffect } from 'react';
import BillingInterface from "@/app/components/Admin_dashboard/BillingInterface"
// Simple icon components to replace lucide-react
const Calendar = () => <span>📅</span>;
const Clock = () => <span>⏰</span>;
const Users = () => <span>👥</span>;
const MessageSquare = () => <span>💬</span>;
const IndianRupee = () => <span>₹</span>;
const Settings = () => <span>⚙️</span>;
const Search = () => <span>🔍</span>;
const Plus = () => <span>➕</span>;
const Edit = () => <span>✏️</span>;
const Trash2 = () => <span>🗑️</span>;
const Phone = () => <span>📞</span>;
const Mail = () => <span>📧</span>;
const CheckCircle = () => <span>✅</span>;
const XCircle = () => <span>❌</span>;
const AlertCircle = () => <span>⚠️</span>;
const QrCode = () => <span>📱</span>;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showBilling, setShowBilling] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  // Sample data - in real app, this would come from your backend
  const [availableSlots, setAvailableSlots] = useState({
    '2025-08-04': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    '2025-08-05': ['09:00', '10:00', '11:00', '14:00', '15:00'],
    '2025-08-06': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
  });

  const [todaysAppointments, setTodaysAppointments] = useState([
    {
      id: 1,
      patientName: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh.k@email.com',
      time: '10:00',
      status: 'In Progress',
      type: 'Follow-up Session'
    },
    {
      id: 2,
      patientName: 'Priya Sharma',
      phone: '+91 87654 32109',
      email: 'priya.s@email.com',
      time: '11:00',
      status: 'Scheduled',
      type: 'Initial Consultation'
    },
    {
      id: 3,
      patientName: 'Amit Patel',
      phone: '+91 76543 21098',
      email: 'amit.p@email.com',
      time: '14:00',
      status: 'Completed',
      type: 'Therapy Session'
    }
  ]);

  const [whatsappMessages, setWhatsappMessages] = useState([
    {
      id: 1,
      patientName: 'Sunita Reddy',
      phone: '+91 95432 10987',
      message: 'Can I reschedule my appointment from tomorrow to next week?',
      time: '10:30 AM',
      status: 'unread'
    },
    {
      id: 2,
      patientName: 'Vikram Singh',
      phone: '+91 84321 09876',
      message: 'What documents should I bring for my first visit?',
      time: '09:15 AM',
      status: 'unread'
    }
  ]);

  const [billingItems, setBillingItems] = useState([]);
  const [newBillingItem, setNewBillingItem] = useState({ service: '', amount: '', description: '' });

  const services = [
    { name: 'Initial Consultation', price: 500 },
    { name: 'Follow-up Session', price: 300 },
    { name: 'Physiotherapy Session', price: 700 },
    { name: 'Manual Therapy', price: 600 },
    { name: 'Exercise Prescription', price: 400 }
  ];

  // Set current date on client side to avoid hydration mismatch
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Scheduled': return 'text-yellow-600 bg-yellow-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      case 'No-show': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    setTodaysAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    );
  };

  const openBilling = (patient) => {
    setSelectedPatient(patient);
    setShowBilling(true);
    setBillingItems([]);
  };

  const addBillingItem = () => {
    if (newBillingItem.service && newBillingItem.amount) {
      setBillingItems([...billingItems, { ...newBillingItem, id: Date.now() }]);
      setNewBillingItem({ service: '', amount: '', description: '' });
    }
  };

  const removeBillingItem = (itemId) => {
    setBillingItems(billingItems.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return billingItems.reduce((total, item) => total + parseFloat(item.amount || 0), 0);
  };

  const generateNextSixMonths = () => {
    const months = [];
    const currentDate = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      months.push({
        month: date.toLocaleString('default', { month: 'long' }),
        year: date.getFullYear(),
        value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      });
    }
    return months;
  };

  const addTimeSlot = (date, time) => {
    setAvailableSlots(prev => ({
      ...prev,
      [date]: [...(prev[date] || []), time].sort()
    }));
  };

  const removeTimeSlot = (date, timeToRemove) => {
    setAvailableSlots(prev => ({
      ...prev,
      [date]: (prev[date] || []).filter(time => time !== timeToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">PhysioClinic Admin</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MessageSquare className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {whatsappMessages.filter(m => m.status === 'unread').length}
                </span>
              </div>
              <div className="text-sm text-black">Today: {currentDate}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-4">
            <ul className="space-y-2">
              {[
                { id: 'calendar', icon: Calendar, label: 'Calendar & Slots' },
                { id: 'appointments', icon: Clock, label: 'Today\'s Appointments' },
                { id: 'patients', icon: Users, label: 'Patient Records' },
                { id: 'messages', icon: MessageSquare, label: 'WhatsApp Messages' },
                { id: 'billing', icon: IndianRupee, label: 'Billing' },
                { id: 'settings', icon: Settings, label: 'Settings' }
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl text-black font-semibold">Doctor Available Slots</h2>
                
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-600">Select Date</h3>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium mb-4  text-gray-600">Available Slots for {selectedDate}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {(availableSlots[selectedDate] || []).map((time) => (
                      <div key={time} className="flex items-center justify-between bg-green-100 text-green-700 px-3 py-2 rounded">
                        <span>{time}</span>
                        <button
                          onClick={() => removeTimeSlot(selectedDate, time)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {(!availableSlots[selectedDate] || availableSlots[selectedDate].length === 0) && (
                    <p className="text-gray-600 text-center py-4">No slots available for this date</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-600">Quick Slot Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="p-2 border rounded-lg  text-gray-600"
                  >
                    {generateNextSixMonths().map((month) => (
                      <optgroup key={month.value} label={`${month.month} ${month.year}`}>
                        {Array.from({ length: 31 }, (_, i) => {
                          const day = i + 1;
                          const date = `${month.value}-${String(day).padStart(2, '0')}`;
                          const dateObj = new Date(date);
                          if (dateObj.getMonth() !== parseInt(month.value.split('-')[1]) - 1) return null;
                          return (
                            <option key={date} value={date}>
                              {dateObj.toLocaleDateString()}
                            </option>
                          );
                        }).filter(Boolean)}
                      </optgroup>
                    ))}
                  </select>

                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addTimeSlot(selectedDate, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="p-2 border rounded-lg"
                  >
                    <option value="">Add Time Slot</option>
                    {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'].map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      const commonSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
                      setAvailableSlots(prev => ({
                        ...prev,
                        [selectedDate]: [...new Set([...(prev[selectedDate] || []), ...commonSlots])].sort()
                      }));
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Add Default Slots
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-black">Today&apos;s Appointments</h2>
              
              <div className="grid gap-4">
                {todaysAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => openBilling(appointment)}
                            className="text-lg font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            {appointment.patientName}
                          </button>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600 space-y-1">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                            <span>•</span>
                            <span>{appointment.type}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{appointment.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4" />
                              <span>{appointment.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <select
                          value={appointment.status}
                          onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                          className="p-2 border rounded text-sm"
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="No-show">No-show</option>
                        </select>
                        <button
                          onClick={() => openBilling(appointment)}
                          className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                        >
                          Bill
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">WhatsApp Messages</h2>
              
              <div className="grid gap-4">
                {whatsappMessages.map((message) => (
                  <div key={message.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium">{message.patientName}</h3>
                          <span className="text-sm text-gray-500">{message.phone}</span>
                          <span className="text-sm text-gray-500">{message.time}</span>
                          {message.status === 'unread' && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">New</span>
                          )}
                        </div>
                        <p className="mt-2 text-gray-700">{message.message}</p>
                      </div>
                      <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Patient Records</h2>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="pl-10 pr-4 py-2 border rounded-lg w-64"
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Visit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Visits</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {todaysAppointments.map((patient) => (
                      <tr key={patient.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{patient.patientName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{patient.phone}</div>
                          <div>{patient.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Today, {patient.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Math.floor(Math.random() * 5) + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-green-600 hover:text-green-900">Bill</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Billing Modal */}
      {showBilling && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
          <BillingInterface setShowBilling={setShowBilling} showBilling={showBilling}/>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;