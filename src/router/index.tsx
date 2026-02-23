import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import DashboardLayout from "@/components/layout/DashboardLayout";
import HomePage from "@/pages/HomePage";
import ReceiptPage from "@/pages/data-panel/ReceiptPage";
import InvoicePage from "@/pages/data-panel/InvoicePage";
import AnalyticsPage from "@/pages/data-panel/AnalyticsPage";
import FileExportPage from "@/pages/data-panel/FileExportPage";
import UserProfilePage from "@/pages/user-center/UserProfilePage";
import CompanyPage from "@/pages/user-center/CompanyPage";
import ActivityPage from "@/pages/user-center/ActivityPage";
import SubscriptionPage from "@/pages/user-center/SubscriptionPage";
import ContactUsPage from "@/pages/ContactUsPage";

const rootRoute = createRootRoute({
  component: DashboardLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const dataPanelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "data-panel",
  component: Outlet,
});

const receiptRoute = createRoute({
  getParentRoute: () => dataPanelRoute,
  path: "receipt",
  component: ReceiptPage,
});

const invoiceRoute = createRoute({
  getParentRoute: () => dataPanelRoute,
  path: "invoice",
  component: InvoicePage,
});

const analyticsRoute = createRoute({
  getParentRoute: () => dataPanelRoute,
  path: "analytics",
  component: AnalyticsPage,
});

const fileExportRoute = createRoute({
  getParentRoute: () => dataPanelRoute,
  path: "file-export",
  component: FileExportPage,
});

const userCenterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "user-center",
  component: Outlet,
});

const userProfileRoute = createRoute({
  getParentRoute: () => userCenterRoute,
  path: "user-profile",
  component: UserProfilePage,
});

const companyRoute = createRoute({
  getParentRoute: () => userCenterRoute,
  path: "company",
  component: CompanyPage,
});

const activityRoute = createRoute({
  getParentRoute: () => userCenterRoute,
  path: "activity",
  component: ActivityPage,
});

const subscriptionRoute = createRoute({
  getParentRoute: () => userCenterRoute,
  path: "subscription",
  component: SubscriptionPage,
});

const contactUsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "contact-us",
  component: ContactUsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dataPanelRoute.addChildren([
    receiptRoute,
    invoiceRoute,
    analyticsRoute,
    fileExportRoute,
  ]),
  userCenterRoute.addChildren([
    userProfileRoute,
    companyRoute,
    activityRoute,
    subscriptionRoute,
  ]),
  contactUsRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
