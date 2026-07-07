import axiosInstance from './axiosInstance'

export interface MessageResponse {
  conversation_id: number
  response_text: string
  urgency_level: 'low' | 'medium' | 'emergency'
  recommended_action: string
}

export interface Conversation {
  id: number
  created_at: string
  messages?: any[]
}

export interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

// Symptom checker execution
export const checkSymptoms = async (
  message: string,
  conversationId: number | null
): Promise<MessageResponse> => {
  const response = await axiosInstance.post<MessageResponse>('assistant/symptom-check/', {
    message,
    conversation_id: conversationId,
  })
  return response.data
}

// Retrieve conversations list
export const getConversations = async (): Promise<Conversation[]> => {
  const response = await axiosInstance.get<Conversation[]>('assistant/conversations/')
  return response.data
}

// Retrieve message history of a specific conversation
export const getConversationMessages = async (conversationId: number): Promise<Message[]> => {
  const response = await axiosInstance.get<Message[]>(
    `assistant/conversations/${conversationId}/messages/`
  )
  return response.data
}

// Authentication api calls
export const login = async (username: string, password: string) => {
  const response = await axiosInstance.post('auth/login/', { username, password })
  return response.data // returns { token, username }
}

export const register = async (username: string, email: string, password: string) => {
  const response = await axiosInstance.post('auth/register/', { username, email, password })
  return response.data // returns { token, username, email }
}
