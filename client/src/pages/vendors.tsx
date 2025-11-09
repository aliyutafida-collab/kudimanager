import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Search, Loader2, MapPin, Phone, CreditCard, Truck, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Vendor {
  name: string;
  category: string;
  location: string;
  contact: string;
  paymentTerms: string;
  deliveryTime: string;
  featured?: boolean;
}

interface VendorResponse {
  success: boolean;
  vendors: Vendor[];
  message: string;
}

export default function Vendors() {
  const [category, setCategory] = useState("");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const { toast } = useToast();

  const vendorMutation = useMutation({
    mutationFn: async (searchCategory: string) => {
      const response = await apiRequest("POST", "/api/vendors/suggest", {
        category: searchCategory,
        location: "Nigeria",
      });
      return response.json();
    },
    onSuccess: (data: VendorResponse) => {
      setVendors(data.vendors || []);
      toast({
        title: "Vendors Found",
        description: `Found ${data.vendors?.length || 0} vendors matching your criteria.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Failed to find vendors",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a category to search",
        variant: "destructive",
      });
      return;
    }
    vendorMutation.mutate(category);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Vendor Directory</h1>
        <p className="text-muted-foreground">
          Discover trusted suppliers and vendors for your business needs
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Find Vendors
          </CardTitle>
          <CardDescription>Search for vendors by category or product type</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="category" className="sr-only">
                Category
              </Label>
              <Input
                id="category"
                placeholder="e.g., Food Supplies, Electronics, Packaging, etc."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                data-testid="input-category"
              />
            </div>
            <Button
              type="submit"
              disabled={vendorMutation.isPending}
              data-testid="button-find-vendors"
            >
              {vendorMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {vendors.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor, index) => (
            <Card
              key={index}
              className={vendor.featured ? "border-accent" : ""}
              data-testid={`card-vendor-${index}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{vendor.name}</CardTitle>
                  {vendor.featured && (
                    <Badge variant="default" className="bg-accent text-accent-foreground">
                      <Award className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <CardDescription>{vendor.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{vendor.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{vendor.contact}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span>{vendor.paymentTerms}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <span>{vendor.deliveryTime}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {vendors.length === 0 && !vendorMutation.isPending && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Vendors Found</h3>
            <p className="text-sm text-muted-foreground">
              Enter a category and click "Search" to find trusted vendors for your business.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
