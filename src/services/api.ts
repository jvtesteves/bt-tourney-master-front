import { fetchAuthSession } from 'aws-amplify/auth'

const API_BASE_URL = 'https://mkgtulxbx8.execute-api.sa-east-1.amazonaws.com/dev'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: HeadersInit;
  body?: object;
}

/**
 * Função para fazer chamadas a endpoints PROTEGIDOS da API.
 * Requer que o utilizador esteja autenticado.
 * @param path O caminho do recurso (ex: '/tournaments')
 * @param options Opções para o pedido fetch.
 */
export async function callApi(path: string, options: RequestOptions = {}) {
  try {
    const session = await fetchAuthSession()
    const idToken = session.tokens?.idToken

    if (!idToken) {
      throw new Error('Não foi possível obter o token de autenticação.')
    }

    const headers: HeadersInit = {
      Authorization: idToken.toString(),
      ...options.headers,
    };

    let body: BodyInit | undefined;
    if (options.body) {
      body = JSON.stringify(options.body);
      if (!(headers as Record<string, string>)['Content-Type']) {
        (headers as Record<string, string>)['Content-Type'] = 'application/json';
      }
    }

    const fetchOptions: RequestInit = {
      method: options.method || 'GET',
      headers,
      body,
    };

    const url = `${API_BASE_URL}${path}`
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Erro na API: ${errorData.message}`)
    }

    if (response.status !== 204) {
        return await response.json();
    }
    return;

  } catch (error) {
    console.error('Falha ao chamar a API protegida:', error)
    throw error
  }
}

/**
 * Função para fazer chamadas a endpoints PÚBLICOS da API.
 * Não envia token de autenticação.
 * @param path O caminho do recurso público (ex: '/public/tournaments')
 * @param options Opções para o pedido fetch.
 */
export async function callPublicApi(path: string, options: RequestInit = {}) {
  try {
    const url = `${API_BASE_URL}${path}`;

    const response = await fetch(url, {
      ...options,
      method: options.method || 'GET'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Erro na API pública: ${errorData.message}`);
    }

    if (response.status !== 204) {
      return await response.json();
    }
    return;

  } catch (error) {
    console.error('Falha ao chamar a API pública:', error);
    throw error;
  }
}
