import type { Formation, RunFormationIn, Constraint, Cohort } from "./types";

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

export async function overrideFormation(
  formationId: string,
  teams: { id: string; member_ids: string[]; rationale: string }[],
  auth: Auth,
): Promise<void> {
  const res = await fetch(`/v1/formations/${encodeURIComponent(formationId)}/override`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": auth.userId,
      "X-Role": auth.role,
    },
    body: JSON.stringify({ teams }),
  });
  if (!res.ok) {
    throw new Error(`Override failed (${res.status})`);
  }
}

export async function commitFormation(
  formationId: string,
  auth: Auth,
): Promise<void> {
  const res = await fetch(`/v1/formations/${encodeURIComponent(formationId)}/commit`, {
    method: "POST",
    headers: {
      "X-User-Id": auth.userId,
      "X-Role": auth.role,
    },
  });
  if (!res.ok) {
    throw new Error(`Commit failed (${res.status})`);
  }
}

export async function getConstraints(
  cohortId: string,
  auth: Auth,
): Promise<Constraint[]> {
  const res = await fetch(`/v1/cohorts/${encodeURIComponent(cohortId)}/constraints`, {
    headers: {
      "X-User-Id": auth.userId,
      "X-Role": auth.role,
    },
  });
  if (!res.ok) throw new Error("Failed to get constraints");
  const data = await res.json();
  return data.constraints as Constraint[];
}

export async function approveConstraint(
  cohortId: string,
  constraintId: string,
  auth: Auth,
): Promise<void> {
  const res = await fetch(`/v1/cohorts/${encodeURIComponent(cohortId)}/constraints/${encodeURIComponent(constraintId)}/approve`, {
    method: "POST",
    headers: {
      "X-User-Id": auth.userId,
      "X-Role": auth.role,
    },
  });
  if (!res.ok) throw new Error("Failed to approve constraint");
}

export async function rejectConstraint(
  cohortId: string,
  constraintId: string,
  auth: Auth,
): Promise<void> {
  const res = await fetch(`/v1/cohorts/${encodeURIComponent(cohortId)}/constraints/${encodeURIComponent(constraintId)}/reject`, {
    method: "POST",
    headers: {
      "X-User-Id": auth.userId,
      "X-Role": auth.role,
    },
  });
  if (!res.ok) throw new Error("Failed to reject constraint");
}

export async function getCohorts(auth: Auth): Promise<Cohort[]> {
  const res = await fetch("/v1/cohorts", {
    headers: {
      "X-User-Id": auth.userId,
      "X-Role": auth.role,
    },
  });
  if (!res.ok) throw new Error("Failed to get cohorts");
  const data = await res.json();
  return data.cohorts as Cohort[];
}

export async function createCohort(name: string, auth: Auth): Promise<Cohort> {
  const res = await fetch("/v1/cohorts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": auth.userId,
      "X-Role": auth.role,
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create cohort");
  return await res.json() as Cohort;
}
