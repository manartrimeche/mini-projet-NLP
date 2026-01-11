/**
 * Outil de diagnostic pour vérifier la connexion Frontend-Backend
 */

import { checkHealth, askQuestion } from './api';

export interface DiagnosticResult {
  timestamp: string;
  apiConnected: boolean;
  ragReady: boolean;
  llmAvailable: boolean;
  testQuery: { success: boolean; error?: string };
  details: string[];
}

export async function runDiagnostics(): Promise<DiagnosticResult> {
  const details: string[] = [];
  const result: DiagnosticResult = {
    timestamp: new Date().toISOString(),
    apiConnected: false,
    ragReady: false,
    llmAvailable: false,
    testQuery: { success: false },
    details,
  };

  try {
    // Test 1: Connectivité API
    console.log('[DIAG] Test 1: Vérification de la connectivité API...');
    const health = await checkHealth();
    result.apiConnected = true;
    result.ragReady = health.rag_ready;
    result.llmAvailable = health.llm_available;
    details.push(`✅ API connectée (${health.status})`);
    details.push(`RAG: ${health.rag_ready ? '✅ Prêt' : '❌ Non prêt'}`);
    details.push(`LLM: ${health.llm_available ? '✅ Disponible' : '❌ Non disponible'}`);
  } catch (error) {
    details.push(`❌ Erreur API: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    details.push('Vérifiez que le serveur backend fonctionne sur http://localhost:8000');
    return result;
  }

  // Test 2: Test d'une requête
  if (result.ragReady) {
    try {
      console.log('[DIAG] Test 2: Test d\'une requête...');
      const response = await askQuestion('Test de connexion');
      result.testQuery.success = true;
      details.push(`✅ Requête test réussie`);
      details.push(`Réponse reçue: ${response.answer.substring(0, 100)}...`);
    } catch (error) {
      result.testQuery.error = error instanceof Error ? error.message : 'Erreur inconnue';
      details.push(`⚠️ Requête test échouée: ${result.testQuery.error}`);
    }
  }

  return result;
}

export function printDiagnostics(result: DiagnosticResult): void {
  console.log('\n' + '='.repeat(60));
  console.log('DIAGNOSTIC FRONTEND-BACKEND');
  console.log('='.repeat(60));
  console.log(`Timestamp: ${result.timestamp}`);
  console.log('');
  console.log('RÉSUMÉ:');
  console.log(`  API: ${result.apiConnected ? '✅' : '❌'}`);
  console.log(`  RAG: ${result.ragReady ? '✅' : '❌'}`);
  console.log(`  LLM: ${result.llmAvailable ? '✅' : '❌'}`);
  console.log(`  Test Query: ${result.testQuery.success ? '✅' : '❌'}`);
  console.log('');
  console.log('DÉTAILS:');
  result.details.forEach((detail) => console.log(`  ${detail}`));
  console.log('='.repeat(60) + '\n');
}
