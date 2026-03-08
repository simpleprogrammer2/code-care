import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Send, LogIn, Code, Link as LinkIcon, Upload, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCreateReview } from "@/hooks/useReviews";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const LANGUAGES = ["Python"];

type SubmissionType = "paste" | "link" | "upload";

const SubmitReview = () => {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [numLines, setNumLines] = useState("");
  const [numFiles, setNumFiles] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submissionType, setSubmissionType] = useState<SubmissionType>("paste");
  const { user } = useAuth();
  const createReview = useCreateReview();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File must be under 5MB");
        return;
      }
      setUploadedFile(file);
    }
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!uploadedFile || !user) return null;
    setUploading(true);
    const filePath = `${user.id}/${Date.now()}-${uploadedFile.name}`;
    const { error } = await supabase.storage
      .from("code-files")
      .upload(filePath, uploadedFile);
    setUploading(false);
    if (error) {
      toast.error("File upload failed");
      return null;
    }
    return filePath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !language) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (submissionType === "paste" && !code) {
      toast.error("Please paste your code");
      return;
    }
    if (submissionType === "link" && !sourceUrl) {
      toast.error("Please provide a link to your code");
      return;
    }
    if (submissionType === "upload" && !uploadedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      let codeSnippet = "";
      let fileUrl: string | null = null;

      if (submissionType === "paste") {
        codeSnippet = code;
      } else if (submissionType === "link") {
        codeSnippet = `Source: ${sourceUrl}`;
      } else {
        const filePath = await uploadFile();
        if (!filePath) return;
        codeSnippet = `Uploaded: ${uploadedFile!.name}`;
        fileUrl = filePath;
      }

      await createReview.mutateAsync({
        title,
        language,
        code_snippet: codeSnippet,
        description: description || null,
        source_url: submissionType === "link" ? sourceUrl : fileUrl,
        num_lines: numLines ? parseInt(numLines, 10) : null,
        num_files: numFiles ? parseInt(numFiles, 10) : null,
        submission_type: submissionType,
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
            <p className="text-muted-foreground">Paste your code, share a link, or upload a file.</p>
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

                {/* Submission mode tabs */}
                <div className="space-y-2">
                  <Label>How would you like to submit? *</Label>
                  <Tabs value={submissionType} onValueChange={(v) => setSubmissionType(v as SubmissionType)}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="paste" className="gap-1.5 text-xs sm:text-sm">
                        <Code className="h-3.5 w-3.5" /> Paste Code
                      </TabsTrigger>
                      <TabsTrigger value="link" className="gap-1.5 text-xs sm:text-sm">
                        <LinkIcon className="h-3.5 w-3.5" /> By Link
                      </TabsTrigger>
                      <TabsTrigger value="upload" className="gap-1.5 text-xs sm:text-sm">
                        <Upload className="h-3.5 w-3.5" /> Upload File
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="paste" className="mt-4 space-y-2">
                      <Label htmlFor="code">Code *</Label>
                      <Textarea
                        id="code"
                        placeholder="Paste your code here..."
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="min-h-[200px] font-mono text-sm"
                      />
                    </TabsContent>

                    <TabsContent value="link" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="sourceUrl">Repository or file link *</Label>
                        <Input
                          id="sourceUrl"
                          type="url"
                          placeholder="https://github.com/user/repo or gist link"
                          value={sourceUrl}
                          onChange={(e) => setSourceUrl(e.target.value)}
                          className="font-mono"
                        />
                        <p className="text-xs text-muted-foreground">GitHub repo, gist, GitLab, or any public code URL</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="upload" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label>File *</Label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".ts,.tsx,.js,.jsx,.py,.go,.rs,.java,.cpp,.c,.h,.rb,.sql,.txt,.zip,.tar.gz"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        {uploadedFile ? (
                          <div className="flex items-center gap-3 rounded-md border border-border bg-surface p-3">
                            <Upload className="h-4 w-4 text-primary" />
                            <span className="flex-1 truncate font-mono text-sm text-foreground">{uploadedFile.name}</span>
                            <span className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</span>
                            <button type="button" onClick={() => setUploadedFile(null)} className="text-muted-foreground hover:text-destructive">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full gap-2 border-dashed"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4" /> Choose file (max 5MB)
                          </Button>
                        )}
                        <p className="text-xs text-muted-foreground">Accepted: .ts, .js, .py, .go, .rs, .java, .cpp, .rb, .sql, .zip, etc.</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Optional line/file count — always visible */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numLines">Number of lines (optional)</Label>
                    <Input
                      id="numLines"
                      type="number"
                      min="1"
                      placeholder="e.g. 350"
                      value={numLines}
                      onChange={(e) => setNumLines(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numFiles">Number of files (optional)</Label>
                    <Input
                      id="numFiles"
                      type="number"
                      min="1"
                      placeholder="e.g. 5"
                      value={numFiles}
                      onChange={(e) => setNumFiles(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Context (optional)</Label>
                  <Textarea id="description" placeholder="What should the reviewer focus on?" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[80px]" />
                </div>
                <Button type="submit" variant="hero" className="w-full gap-2" disabled={createReview.isPending || uploading}>
                  <Send className="h-4 w-4" /> {uploading ? "Uploading..." : createReview.isPending ? "Submitting..." : "Submit for Review"}
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
