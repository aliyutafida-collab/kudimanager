import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            Built with <Heart className="w-4 h-4 text-destructive fill-destructive" /> by{" "}
            <span className="font-semibold text-foreground">KudiManager</span>
          </p>
          <p>Empowering Nigerian SMEs</p>
        </div>
      </div>
    </footer>
  );
}
