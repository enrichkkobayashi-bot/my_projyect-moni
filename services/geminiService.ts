
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error inside ${action}:`, error);
    // エラー時は空オブジェクト等を返すか、エラーを投げるか。元の実装は空オブジェクトを返す傾向があったが、
    // ここでは呼び出し元でハンドリングできるようにエラーをログに出しつつ、
    // 元の挙動に合わせて空オブジェクトを返すフォールバックも考慮するが、
    // エラーが起きたことがわかるように例外をスローさせるほうがデバッグしやすい。
    // ただし既存UIがエラーハンドリングしていないとクラッシュする。
    // 元のコードを見ると、try-catchで囲んで空オブジェクトを返す実装が多かった。
    // ここでもそれに倣い、空またはそれっぽい値を返すか、あるいは呼び出し側でエラー処理を追加するか。
    // 安全のため空オブジェクトを返す形にする（元のcatchブロックの挙動を模倣）。
    return {};
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
