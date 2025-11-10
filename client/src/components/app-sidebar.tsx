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
import { useTranslation } from "react-i18next";

const menuItems = [
  { titleKey: "nav.dashboard", url: "/", icon: LayoutDashboard, testId: "link-dashboard" },
  { titleKey: "nav.sales", url: "/sales", icon: ShoppingCart, testId: "link-sales" },
  { titleKey: "nav.expenses", url: "/expenses", icon: Receipt, testId: "link-expenses" },
  { titleKey: "nav.inventory", url: "/inventory", icon: Package, testId: "link-inventory" },
  { titleKey: "nav.reports", url: "/reports", icon: FileText, testId: "link-reports" },
  { titleKey: "nav.taxCalculator", url: "/tax-calculator", icon: Calculator, testId: "link-tax-calculator" },
  { titleKey: "nav.aiAdvisor", url: "/ai-advisor", icon: Sparkles, testId: "link-ai-advisor" },
  { titleKey: "nav.vendors", url: "/vendors", icon: Users, testId: "link-vendors" },
  { titleKey: "nav.learn", url: "/learn", icon: BookOpen, testId: "link-learn" },
  { titleKey: "nav.subscription", url: "/subscription", icon: CreditCard, testId: "link-subscription" },
];

export function AppSidebar() {
  const { t } = useTranslation();
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
            <span className="text-xs text-muted-foreground">{t('common.businessDashboard')}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('common.management')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={item.testId} onClick={handleMenuClick}>
                      <item.icon />
                      <span>{t(item.titleKey)}</span>
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
