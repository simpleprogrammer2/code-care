import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ReviewCard from "@/components/ReviewCard";
import type { Tables } from "@/integrations/supabase/types";

type Review = Tables<"reviews">;

const mockReview: Review = {
  id: "r1",
  title: "Test Review",
  language: "TypeScript",
  code_snippet: "const hello = 'world';",
  description: "A test",
  status: "open",
  requester_id: "u1",
  reviewer_id: null,
  reviewer_feedback: null,
  reviewer_rating: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  source_url: null,
  num_lines: null,
  num_files: null,
  submission_type: "paste",
};

describe("ReviewCard", () => {
  it("renders review title and language", () => {
    render(<ReviewCard review={mockReview} isAuthenticated={false} />);
    expect(screen.getByText("Test Review")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("calls onClick when card is clicked", () => {
    const onClick = vi.fn();
    render(<ReviewCard review={mockReview} isAuthenticated={false} onClick={onClick} />);
    fireEvent.click(screen.getByText("Test Review"));
    expect(onClick).toHaveBeenCalledWith("r1");
  });

  it("shows Pick Up button for open review when authenticated", () => {
    const onPickUp = vi.fn();
    render(<ReviewCard review={mockReview} isAuthenticated onPickUp={onPickUp} />);
    const btn = screen.getByText("Pick Up");
    fireEvent.click(btn);
    expect(onPickUp).toHaveBeenCalledWith("r1");
  });

  it("hides Pick Up button when not authenticated", () => {
    render(<ReviewCard review={mockReview} isAuthenticated={false} />);
    expect(screen.queryByText("Pick Up")).not.toBeInTheDocument();
  });

  it("shows Tip button for completed reviews", () => {
    const onTip = vi.fn();
    const completed = { ...mockReview, status: "completed" as const };
    render(<ReviewCard review={completed} isAuthenticated onTip={onTip} />);
    expect(screen.getByText("Tip")).toBeInTheDocument();
  });

  it("truncates long code snippets", () => {
    const longCode = { ...mockReview, code_snippet: "x".repeat(100) };
    render(<ReviewCard review={longCode} isAuthenticated={false} />);
    expect(screen.getByText(/…$/)).toBeInTheDocument();
  });
});
