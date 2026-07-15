import axiosInstance from './axiosInstance'

export interface Appointment {
  id: number
  user: number
  provider_type: string
  provider_type_display: string
  provider_name: string
  scheduled_at: string
  reason: string
  notes: string
  status: 'scheduled' | 'cancelled' | 'completed'
  created_at: string
  updated_at: string
  reminder_email: string
  email_reminder_sent: boolean
  email_reminder_sent_at: string | null
}

export interface CreateAppointmentPayload {
  provider_type: string
  provider_name: string
  scheduled_at: string
  reason?: string
  notes?: string
  reminder_email?: string
}

// Fetch all appointments for the current authenticated user
export const getAppointments = async (): Promise<Appointment[]> => {
  const response = await axiosInstance.get<Appointment[]>('appointments/')
  return response.data
}

// Create a new appointment
export const createAppointment = async (payload: CreateAppointmentPayload): Promise<Appointment> => {
  const response = await axiosInstance.post<Appointment>('appointments/', payload)
  return response.data
}

// Update appointment details (e.g. reschedule or cancel)
export const updateAppointment = async (
  appointmentId: number,
  payload: Partial<CreateAppointmentPayload> & { status?: string }
): Promise<Appointment> => {
  const response = await axiosInstance.patch<Appointment>(`appointments/${appointmentId}/`, payload)
  return response.data
}

// Delete / Cancel appointment entirely
export const deleteAppointment = async (appointmentId: number): Promise<void> => {
  await axiosInstance.delete(`appointments/${appointmentId}/`)
}
