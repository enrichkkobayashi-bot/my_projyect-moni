
// クライアントサイドの実装
// サーバーサイド (/api/gemini) に処理を委譲し、APIキーを隠蔽します。

async function callApi(action: string, payload: any) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage += ` - ${errorData.error}`;
          if (errorData.details) errorMessage += ` (${JSON.stringify(errorData.details)})`;
        }
      } catch (e) {
        // JSONパースエラー時はHTMLレスポンスかもしれないので無視してステータスのみ
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`Error inside ${action}:`, error);
    // 呼び出し元でキャッチして表示させるために再スローする
    throw error;
  }
}

export async function summarizeMonitoring(files: { base64: string, type: string }[], maxChars: number) {
  const result = await callApi('summarizeMonitoring', { files, maxChars });
  // API側で整形済みなのでそのまま返す
  return result;
}

export async function generateAssessmentPhase(files: { base64: string, type: string }[], phase: string) {
  return await callApi('generateAssessmentPhase', { files, phase });
}

export async function generateSupportChecklist(files: { base64: string, type: string }[]) {
  const result = await callApi('generateSupportChecklist', { files });
  // 配列を期待する場合は空配列を返すようなハンドリングが必要だが、
  // callApiが {} を返すと困る場合がある。
  if (Array.isArray(result)) return result;
  return [];
}

export async function generateCarePlanFromAssessment(assessment: any) {
  return await callApi('generateCarePlanFromAssessment', { assessment });
}

export async function generatePreventivePlan(assessment: any) {
  return await callApi('generatePreventivePlan', { assessment });
}

export async function generateConversationSummary(files: { base64: string, type: string }[]) {
  return await callApi('generateConversationSummary', { files });
}
