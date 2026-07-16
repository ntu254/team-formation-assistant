import { render, screen, fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from "./App";

describe("App shell", () => {
  it("renders the profile and console sections", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Team Formation Assistant" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /My Profile/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Formation Console/ })).toBeInTheDocument();
  });
});

describe("FormationConsole", () => {
  afterEach(() => vi.restoreAllMocks());

  it("runs a formation and renders the suggested teams", async () => {
    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        status: "ok",
        seed: 1,
        balance: 0.9,
        teams: [{ id: "team-1", members: ["u0", "u1", "u2"], scores: {}, rationale: "Balanced." }],
        unassignable: [],
      }),
    })) as unknown as typeof fetch;

    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Run Formation/ }));

    expect(await screen.findByText("team-1")).toBeInTheDocument();
    expect(screen.getByText("0.9")).toBeInTheDocument();
  });

  it("surfaces an error when the API rejects (e.g. 403 non-owner)", async () => {
    globalThis.fetch = vi.fn(async () => ({
      ok: false,
      status: 403,
      json: async () => ({ detail: "not the cohort owner" }),
    })) as unknown as typeof fetch;

    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Run Formation/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/403/);
  });
});
