import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SubmitReview from "@/pages/SubmitReview";

const mockMutateAsync = vi.fn();

// Mock useAuth - signed in user
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "user-1", email: "test@test.com" },
    session: {},
    loading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock("@/hooks/useReviews", () => ({
  useCreateReview: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const renderSubmit = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <SubmitReview />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe("SubmitReview Page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders submit form with three tabs", () => {
    renderSubmit();
    expect(screen.getByText("Submit for")).toBeInTheDocument();
    expect(screen.getByText("Paste Code")).toBeInTheDocument();
    expect(screen.getByText("By Link")).toBeInTheDocument();
    expect(screen.getByText("Lines / Files")).toBeInTheDocument();
  });

  it("shows paste code textarea by default", () => {
    renderSubmit();
    expect(screen.getByPlaceholderText("Paste your code here...")).toBeInTheDocument();
  });

  it("has link tab trigger", () => {
    renderSubmit();
    const linkTab = screen.getByText("By Link");
    expect(linkTab).toBeInTheDocument();
    // Radix tabs don't fully work in jsdom, so just verify the trigger exists
  });

  it("has metadata tab trigger", () => {
    renderSubmit();
    expect(screen.getByText("Lines / Files")).toBeInTheDocument();
  });

  it("validates required fields on paste submit", async () => {
    renderSubmit();
    fireEvent.click(screen.getByRole("button", { name: /submit for review/i }));
    const { toast } = await import("sonner");
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Please fill in all required fields"));
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("submits paste code review successfully", async () => {
    mockMutateAsync.mockResolvedValueOnce({});
    renderSubmit();

    fireEvent.change(screen.getByPlaceholderText("e.g. React Auth Hook Refactor"), { target: { value: "Test Review" } });
    // Select language
    fireEvent.click(screen.getByText("Select language"));
    fireEvent.click(screen.getByText("TypeScript"));
    fireEvent.change(screen.getByPlaceholderText("Paste your code here..."), { target: { value: "const x = 1;" } });
    fireEvent.click(screen.getByRole("button", { name: /submit for review/i }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test Review",
          language: "TypeScript",
          code_snippet: "const x = 1;",
          submission_type: "paste",
        })
      );
    });
  });
});
