import type { Formation, RunFormationIn } from "./types";

export interface Auth {
  userId: string;
  role: string;
}

/** Run a formation. Auth is sent as headers (dev stub; replaced by a bearer JWT in prod). */
export async function runFormation(
  cohortId: string,
  body: RunFormationIn,
  auth: Auth,
): Promise<Formation> {
  const res = await fetch(`/v1/cohorts/${encodeURIComponent(cohortId)}/formations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": auth.userId,
      "X-Role": auth.role,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let detail: unknown = {};
    try {
      detail = await res.json();
    } catch {
      detail = {};
    }
    throw new Error(`Formation failed (${res.status}): ${JSON.stringify(detail)}`);
  }
  return (await res.json()) as Formation;
}
