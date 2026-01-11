/**
 * Service API centralisé pour communiquer avec le backend
 */

const API_BASE_URL = '/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AnswerResponse {
  success: boolean;
  question: string;
  answer: string;
  sources: Array<{
    name: string;
    excerpt: string;
  }>;
  source_count: number;
}

export interface HealthResponse {
  status: string;
  rag_ready: boolean;
  llm_available: boolean;
}

export interface HistoryItem {
  id: number;
  question: string;
  answer: string;
  timestamp: string;
}

export interface HistoryResponse {
  success: boolean;
  history: HistoryItem[];
}

/**
 * Fonction générique pour faire des appels API
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`[API] ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || 
        errorData.error || 
        `API Error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(`[API] Response:`, data);
    return data as T;
  } catch (error) {
    console.error(`[API] Error:`, error);
    throw error;
  }
}

/**
 * Vérifier l'état du système RAG
 */
export async function checkHealth(): Promise<HealthResponse> {
  return apiCall<HealthResponse>('/health', {
    method: 'GET',
  });
}

/**
 * Poser une question au système RAG
 */
export async function askQuestion(question: string): Promise<AnswerResponse> {
  return apiCall<AnswerResponse>('/ask', {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
}

/**
 * Récupérer l'historique des conversations
 */
export async function getHistory(limit: number = 10): Promise<HistoryResponse> {
  return apiCall<HistoryResponse>(`/history?limit=${limit}`, {
    method: 'GET',
  });
}

/**
 * Effacer l'historique des conversations
 */
export async function clearHistory(): Promise<ApiResponse<null>> {
  return apiCall<ApiResponse<null>>('/clear-history', {
    method: 'POST',
  });
}

/**
 * Hook personnalisé pour les appels API avec gestion d'erreur
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorMessage: string = 'Une erreur s\'est produite'
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    console.error(errorMessage, error);
    return null;
  }
}
