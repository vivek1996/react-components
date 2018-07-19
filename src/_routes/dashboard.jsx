import DashboardPage from "views/Dashboard/Dashboard.jsx";
import {User} from "views/User/User.jsx";
import {UserTransaction} from "views/User/Transaction.jsx";
import {UserPaymentRequest} from "views/User/PaymentRequest.jsx";
import {UserProfile} from "views/User/UserProfile.jsx";

import {PaymentRequest} from "views/PaymentRequest/PaymentRequest.jsx";
import {Setting} from "views/Setting/Setting.jsx";

import {
  Dashboard,
  People,
  CreditCard,
  List,
  Settings
} from "@material-ui/icons";

const dashboardRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    sidebar: true
  },
  {
    path: "/user/list",
    sidebarName: "User",
    navbarName: "User",
    icon: People,
    component: User,
    sidebar: true
  },
  {
    path: "/user/:id/transaction",
    sidebarName: "User Transactions",
    navbarName: "User Transactions",
    icon: List,
    component: UserTransaction,
    sidebar: false
  },
  {
    path: "/user/:id/payment_request",
    sidebarName: "Payment Requests",
    navbarName: "Payment Requests",
    icon: CreditCard,
    component: UserPaymentRequest,
    sidebar: false
  },
  {
    path: "/user/:id",
    sidebarName: "User Profile",
    navbarName: "User Profile",
    icon: List,
    component: UserProfile,
    sidebar: false
  },
  {
    path: "/payment_request/list",
    sidebarName: "Payment Request",
    navbarName: "Payment Requests",
    icon: CreditCard,
    component: PaymentRequest,
    sidebar: true
  },
  {
    path: "/setting/list",
    sidebarName: "Settings",
    navbarName: "Settings",
    icon: Settings,
    component: Setting,
    sidebar: true
  },
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;
