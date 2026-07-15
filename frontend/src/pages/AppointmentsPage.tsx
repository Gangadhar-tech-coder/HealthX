import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, Clock, Plus, Trash2, User, CheckCircle2, 
  XCircle, AlertCircle, Loader2, Mail, FileText, Activity 
} from 'lucide-react'
import { 
  getAppointments, createAppointment, updateAppointment, 
  deleteAppointment, Appointment 
} from '../api/appointments'

// Supported Provider Types with Lucide Icons and descriptions
const PROVIDERS = [
  { id: 'general', name: 'General Physician', description: 'Routine checkups, common illnesses, preventive care.', color: 'from-blue-500/10 to-indigo-500/10', iconColor: 'text-blue-500' },
  { id: 'cardiologist', name: 'Cardiologist', description: 'Heart conditions, cardiovascular health, high blood pressure.', color: 'from-red-500/10 to-rose-500/10', iconColor: 'text-red-500' },
  { id: 'dermatologist', name: 'Dermatologist', description: 'Skin, hair, nails, acne, eczema, and skin cancer checks.', color: 'from-emerald-500/10 to-teal-500/10', iconColor: 'text-emerald-500' },
  { id: 'pediatrician', name: 'Pediatrician', description: 'Infant, child, and adolescent healthcare and checkups.', color: 'from-orange-500/10 to-amber-500/10', iconColor: 'text-orange-500' },
  { id: 'neurologist', name: 'Neurologist', description: 'Brain, nervous system, chronic headaches, neuropathy.', color: 'from-purple-500/10 to-violet-500/10', iconColor: 'text-purple-500' },
  { id: 'dentist', name: 'Dentist', description: 'Oral hygiene, teeth cleaning, dental pain, cavities.', color: 'from-cyan-500/10 to-sky-500/10', iconColor: 'text-cyan-500' },
]

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form states
  const [showModal, setShowModal] = useState(false)
  const [selectedProviderType, setSelectedProviderType] = useState('general')
  const [providerName, setProviderName] = useState('Dr. Sarah Jenkins')
  const [scheduledAt, setScheduledAt] = useState('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [reminderEmail, setReminderEmail] = useState('')

  // Load appointments on component mount
  const fetchUserAppointments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getAppointments()
      setAppointments(data)
    } catch (err: any) {
      console.error(err)
      setError('Failed to load appointments. Please check your network connection.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserAppointments()
    // Set default reminder email from localStorage if available
    const savedUser = localStorage.getItem('username') || ''
    if (savedUser) {
      setReminderEmail(`${savedUser}@healthx.com`)
    }
  }, [])

  // Auto-generate realistic doctor names based on type for mock selection
  const handleProviderTypeChange = (type: string) => {
    setSelectedProviderType(type)
    const docNames: Record<string, string> = {
      general: 'Dr. Sarah Jenkins',
      cardiologist: 'Dr. Marcus Vance',
      dermatologist: 'Dr. Elena Rostova',
      pediatrician: 'Dr. Chloe Peterson',
      neurologist: 'Dr. Arthur Pendelton',
      dentist: 'Dr. Jonathan Reynolds'
    }
    setProviderName(docNames[type] || 'Dr. HealthX Specialist')
  }

  // Handle scheduling form submit
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!scheduledAt) {
      setError('Please select a date and time for your appointment.')
      return
    }

    // Client-side past date check
    const selectedDate = new Date(scheduledAt)
    if (selectedDate < new Date()) {
      setError('Appointments must be scheduled for a future date and time.')
      return
    }

    try {
      setIsSubmitLoading(true)
      setError(null)
      await createAppointment({
        provider_type: selectedProviderType,
        provider_name: providerName,
        scheduled_at: new Date(scheduledAt).toISOString(),
        reason,
        notes,
        reminder_email: reminderEmail
      })
      
      // Reset form and reload
      setShowModal(false)
      setReason('')
      setNotes('')
      setScheduledAt('')
      fetchUserAppointments()
    } catch (err: any) {
      console.error(err)
      setError('Failed to schedule appointment. Please try again.')
    } finally {
      setIsSubmitLoading(false)
    }
  }

  // Cancel appointment (PATCH to cancel)
  const handleCancelAppointment = async (id: number) => {
    try {
      setError(null)
      await updateAppointment(id, { status: 'cancelled' })
      // Update local state instead of full refetch for smoother animation
      setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: 'cancelled' } : app))
    } catch (err) {
      console.error(err)
      setError('Failed to cancel appointment. Please try again.')
    }
  }

  // Permanently delete appointment record
  const handleDeleteAppointment = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this appointment record?')) return
    try {
      setError(null)
      await deleteAppointment(id)
      setAppointments(prev => prev.filter(app => app.id !== id))
    } catch (err) {
      console.error(err)
      setError('Failed to delete appointment record. Please try again.')
    }
  }

  // Format date helper
  const formatAppointmentDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatAppointmentTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Appointment <span className="gradient-text-blue">Scheduling</span>
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your upcoming health checkups, specialist appointments, and telemedicine sessions.
            </p>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-primary text-white font-semibold rounded-xl px-5 py-3 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Error notification banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-grow">
              <h4 className="text-sm font-semibold text-red-800">Action Required</h4>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">×</button>
          </div>
        )}

        {/* Content Body */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-gray-500 font-medium animate-pulse">Fetching scheduled sessions...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm p-8 max-w-xl mx-auto mt-6">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No appointments scheduled</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              You don't have any medical checkups scheduled yet. Book your first appointment to sync it with your timeline.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-xl px-5 py-2.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book Appointment Now</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Appointments Grid */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <span>Your Timeline</span>
                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {appointments.length} active
                </span>
              </h2>

              <div className="space-y-4">
                <AnimatePresence>
                  {appointments.map((appointment) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      className={`relative bg-white border rounded-2xl shadow-sm p-5 transition-all duration-300 ${
                        appointment.status === 'cancelled' 
                          ? 'border-gray-200 bg-gray-50/50 opacity-80' 
                          : 'border-gray-100 hover:shadow-md hover:border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        {/* Provider Detail Info */}
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10`}>
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-gray-900 text-base">{appointment.provider_name}</h3>
                              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                                {appointment.provider_type_display || appointment.provider_type}
                              </span>
                            </div>
                            
                            {/* Date info row */}
                            <div className="flex flex-wrap items-center text-sm text-gray-500 mt-2 gap-y-1 gap-x-4">
                              <span className="flex items-center gap-1.5 font-medium text-gray-700">
                                <Calendar className="w-4 h-4 text-primary" />
                                {formatAppointmentDate(appointment.scheduled_at)}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-primary" />
                                {formatAppointmentTime(appointment.scheduled_at)}
                              </span>
                            </div>

                            {/* Reason details */}
                            {appointment.reason && (
                              <div className="mt-3 flex items-start gap-1.5 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <p className="leading-relaxed"><strong className="text-gray-700">Reason:</strong> {appointment.reason}</p>
                              </div>
                            )}

                            {/* Internal doctor notes */}
                            {appointment.notes && (
                              <p className="text-xs text-gray-500 mt-2 italic">Note: {appointment.notes}</p>
                            )}

                            {/* Email Reminder confirmation status */}
                            {appointment.reminder_email && (
                              <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                                <Mail className="w-3.5 h-3.5" />
                                <span>Reminders: {appointment.reminder_email}</span>
                                {appointment.email_reminder_sent && (
                                  <span className="text-emerald-500 font-medium ml-1">✓ Sent</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status + Actions Section */}
                        <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-4 flex-shrink-0">
                          {/* Badge Status */}
                          {appointment.status === 'scheduled' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm shadow-emerald-50 animate-pulse">
                              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                              Scheduled
                            </span>
                          )}
                          {appointment.status === 'cancelled' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                              <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                              Cancelled
                            </span>
                          )}
                          {appointment.status === 'completed' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                              Completed
                            </span>
                          )}

                          {/* Trigger cancel / delete actions */}
                          <div className="flex items-center gap-2">
                            {appointment.status === 'scheduled' && (
                              <button
                                onClick={() => handleCancelAppointment(appointment.id)}
                                className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                Cancel Checkup
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteAppointment(appointment.id)}
                              className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                              title="Delete Appointment Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar quick info stats */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary animate-pulse" />
                  <span>Overview stats</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500 font-medium">Total Checkups</span>
                    <span className="text-sm font-bold text-gray-900">{appointments.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-emerald-600 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Active Scheduled
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {appointments.filter(a => a.status === 'scheduled').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-red-600 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Cancelled Sessions
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {appointments.filter(a => a.status === 'cancelled').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informative triage warning */}
              <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-100/50 rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Telehealth Triage Notice</span>
                </h4>
                <p className="text-xs text-blue-800 leading-relaxed mt-2">
                  If you are experiencing severe symptoms (such as acute chest pain, shortness of breath, or numbness), 
                  do not schedule a regular checkup. Please call emergency services (911) or proceed immediately to the 
                  nearest Emergency Room.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Form Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
            {/* Backdrop cover blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-dark/40 backdrop-blur-md"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-100"
            >
              {/* Header banner gradient color */}
              <div className="bg-gradient-to-r from-primary to-indigo-600 p-6 text-white">
                <h3 className="text-xl font-extrabold tracking-tight">Book a Consultation</h3>
                <p className="text-xs text-white/80 mt-1">Select your care provider and book your slot in a few clicks.</p>
              </div>

              <form onSubmit={handleScheduleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                {/* 1. Select provider type */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">1. Select Medical Specialty</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PROVIDERS.map((prov) => (
                      <button
                        key={prov.id}
                        type="button"
                        onClick={() => handleProviderTypeChange(prov.id)}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedProviderType === prov.id
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-gray-100 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <User className={`w-6 h-6 mb-2 ${prov.iconColor}`} />
                        <span className="text-xs font-bold text-gray-900 leading-tight">{prov.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Doctor notification */}
                <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3 border border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-medium">Assigned Professional</span>
                    <h5 className="text-sm font-bold text-gray-900">{providerName}</h5>
                  </div>
                </div>

                {/* 2. Choose Date / Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="schedule-time" className="block text-sm font-bold text-gray-700 mb-1.5">2. Choose Date & Time</label>
                    <div className="relative">
                      <input
                        id="schedule-time"
                        type="datetime-local"
                        required
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reminder-email" className="block text-sm font-bold text-gray-700 mb-1.5">3. Notification Email</label>
                    <div className="relative">
                      <input
                        id="reminder-email"
                        type="email"
                        required
                        placeholder="yourname@example.com"
                        value={reminderEmail}
                        onChange={(e) => setReminderEmail(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Triage Symptom description / visit reason */}
                <div>
                  <label htmlFor="reason" className="block text-sm font-bold text-gray-700 mb-1.5">4. Describe Reason for Visit</label>
                  <textarea
                    id="reason"
                    rows={3}
                    placeholder="Briefly describe your symptoms or reason for consulting the doctor (e.g. chronic cough, follow-up checkup, etc.)."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                  />
                </div>

                {/* 5. Additional private notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-bold text-gray-700 mb-1.5">5. Additional Private Notes (Optional)</label>
                  <textarea
                    id="notes"
                    rows={2}
                    placeholder="List medications you are taking or anything else you'd like to inform the provider about."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                  />
                </div>

                {/* CTA Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 border border-gray-200 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitLoading}
                    className="flex items-center justify-center gap-2 bg-primary text-white font-semibold rounded-xl px-6 py-2.5 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Booking...</span>
                      </>
                    ) : (
                      <span>Schedule Consultation</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
