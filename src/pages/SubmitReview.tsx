import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Send, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCreateReview } from "@/hooks/useReviews";
import { Link } from "react-router-dom";

const LANGUAGES = ["TypeScript", "JavaScript", "Python", "Go", "Rust", "Java", "C++", "Ruby", "SQL", "Other"];

const SubmitReview = () => {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();
  const createReview = useCreateReview();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !language || !code) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await createReview.mutateAsync({
        title,
        language,
        code_snippet: code,
        description: description || null,
      });
      toast.success("Review request submitted!");
      navigate("/browse");
    } catch {
      toast.error("Failed to submit review");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto flex flex-col items-center justify-center px-6 pb-24 pt-28 text-center">
          <h1 className="mb-4 font-mono text-2xl font-bold text-foreground">Sign in to submit code</h1>
          <p className="mb-6 text-muted-foreground">You need an account to request a review.</p>
          <Link to="/auth">
            <Button variant="hero" className="gap-2">
              <LogIn className="h-4 w-4" /> Sign In
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pb-24 pt-28">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Submit for <span className="text-primary">review</span>
            </h1>
            <p className="text-muted-foreground">Paste your code and tell us what you need feedback on.</p>
          </div>

          <Card className="glow-border">
            <CardHeader>
              <CardTitle className="font-mono text-lg">New Review Request</CardTitle>
              <CardDescription>Fields marked * are required</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" placeholder="e.g. React Auth Hook Refactor" value={title} onChange={(e) => setTitle(e.target.value)} className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Language *</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Code *</Label>
                  <Textarea id="code" placeholder="Paste your code here..." value={code} onChange={(e) => setCode(e.target.value)} className="min-h-[200px] font-mono text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Context (optional)</Label>
                  <Textarea id="description" placeholder="What should the reviewer focus on?" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[80px]" />
                </div>
                <Button type="submit" variant="hero" className="w-full gap-2" disabled={createReview.isPending}>
                  <Send className="h-4 w-4" /> {createReview.isPending ? "Submitting..." : "Submit for Review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SubmitReview;
