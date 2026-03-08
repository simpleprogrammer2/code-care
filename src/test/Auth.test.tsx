import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Auth from "@/pages/Auth";

// Mock useAuth
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    session: null,
    loading: false,
    signIn: mockSignIn,
    signUp: mockSignUp,
    signOut: vi.fn(),
  }),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const renderAuth = () =>
  render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );

describe("Auth Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders sign in form by default", () => {
    renderAuth();
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.queryByLabelText("Display Name")).not.toBeInTheDocument();
  });

  it("toggles to sign up form", () => {
    renderAuth();
    fireEvent.click(screen.getByText("Don't have an account? Sign up"));
    expect(screen.getByText("Create account")).toBeInTheDocument();
    expect(screen.getByLabelText("Display Name")).toBeInTheDocument();
  });

  it("calls signIn on form submit", async () => {
    mockSignIn.mockResolvedValueOnce(undefined);
    renderAuth();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => expect(mockSignIn).toHaveBeenCalledWith("a@b.com", "123456"));
  });

  it("calls signUp with display name", async () => {
    mockSignUp.mockResolvedValueOnce(undefined);
    renderAuth();
    fireEvent.click(screen.getByText("Don't have an account? Sign up"));
    fireEvent.change(screen.getByLabelText("Display Name"), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "123456" } });
    const submitBtn = screen.getByRole("button", { name: /sign up/i });
    // Get the submit button (the one with type="submit")
    const form = screen.getByRole("form") ?? submitBtn.closest("form");
    fireEvent.submit(form!);
    await waitFor(() => expect(mockSignUp).toHaveBeenCalledWith("a@b.com", "123456", "testuser"));
  });

  it("shows error on failed sign in", async () => {
    mockSignIn.mockRejectedValueOnce(new Error("Invalid credentials"));
    renderAuth();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    const { toast } = await import("sonner");
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Invalid credentials"));
  });
});
