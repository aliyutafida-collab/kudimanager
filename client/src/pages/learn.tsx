import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ShoppingCart,
  Receipt,
  Package,
  TrendingUp,
  FileText,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface GuideTopic {
  id: string;
  title: string;
  content: string;
  tips: string[];
}

interface Guide {
  title: string;
  description: string;
  topics: GuideTopic[];
  additionalResources: string[];
}

const topicIcons: Record<string, typeof BookOpen> = {
  sales: ShoppingCart,
  expenses: Receipt,
  inventory: Package,
  profit: TrendingUp,
  taxes: FileText,
  consistency: CheckCircle,
};

export default function Learn() {
  const { data: guide, isLoading } = useQuery<Guide>({
    queryKey: ["/api/guide"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2" data-testid="text-guide-title">
          {guide?.title || "Learning Resources"}
        </h1>
        <p className="text-muted-foreground">
          {guide?.description || "Essential tips for managing your business"}
        </p>
      </div>

      <div className="grid gap-6">
        <Accordion type="single" collapsible className="space-y-4">
          {guide?.topics.map((topic, index) => {
            const Icon = topicIcons[topic.id] || BookOpen;

            return (
              <AccordionItem
                key={topic.id}
                value={topic.id}
                data-testid={`section-${index}`}
                className="border rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover-elevate">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold">{topic.title}</h3>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4 pt-2">
                    <p className="text-muted-foreground">{topic.content}</p>

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Key Tips:</h4>
                      <ul className="space-y-2">
                        {topic.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {guide?.additionalResources && guide.additionalResources.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
              <CardDescription>Helpful links for Nigerian business owners</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {guide.additionalResources.map((resource, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{resource}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
