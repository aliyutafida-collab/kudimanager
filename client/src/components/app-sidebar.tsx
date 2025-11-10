import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Package,
  FileText,
  Calculator,
  Sparkles,
  Users,
  BookOpen,
  CreditCard,
} from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, testId: "link-dashboard" },
  { title: "Sales", url: "/sales", icon: ShoppingCart, testId: "link-sales" },
  { title: "Expenses", url: "/expenses", icon: Receipt, testId: "link-expenses" },
  { title: "Inventory", url: "/inventory", icon: Package, testId: "link-inventory" },
  { title: "Reports", url: "/reports", icon: FileText, testId: "link-reports" },
  { title: "Tax Calculator", url: "/tax-calculator", icon: Calculator, testId: "link-tax-calculator" },
  { title: "AI Advisor", url: "/ai-advisor", icon: Sparkles, testId: "link-ai-advisor" },
  { title: "Vendors", url: "/vendors", icon: Users, testId: "link-vendors" },
  { title: "Learn", url: "/learn", icon: BookOpen, testId: "link-learn" },
  { title: "Subscription", url: "/subscription", icon: CreditCard, testId: "link-subscription" },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleMenuClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-lg font-bold">K</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">KudiManager</span>
            <span className="text-xs text-muted-foreground">Business Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={item.testId} onClick={handleMenuClick}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
