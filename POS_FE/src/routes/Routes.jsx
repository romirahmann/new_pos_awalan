/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { AdminLayout } from "../layouts/AdminLayout";
import { LoginPage } from "../pages/auth/LoginPage";
import { store } from "../store";
import { NotFoundPage } from "../pages/NotFoundPage";
import { OrdersPage } from "../pages/main/OrdersPage";

import { ProductPage } from "../pages/main/ProductsPage";
import { MainOrder } from "../components/main/orders/MainOrder";
import { OrderItemPage } from "../components/main/orders/OrderItemPage";
import { OrderDetail } from "../components/main/orders/OrderDetail";
import { DashboardPage } from "../pages/main/DashboardPage";

// ROOT ROUTE
const rootRoute = createRootRoute({
  notFoundComponent: NotFoundPage,
});

// PUBLIC - LOGIN
const loginPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "auth/login", // FIX: tidak boleh pakai "/"
  component: LoginPage,
});

// PROTECTED LAYOUT (ADMIN)
const adminLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin",
  component: AdminLayout,
  beforeLoad: ({ context }) => {
    const { store } = context;
    const state = store.getState();
    if (!state.auth.isAuthenticated) {
      throw redirect({ to: "/auth/login" });
    }
  },
});

// DASHBOARD (INDEX)
const dashboard = createRoute({
  getParentRoute: () => adminLayout,
  path: "/",
  component: DashboardPage,
});

// PRODUCTS
const productPage = createRoute({
  getParentRoute: () => adminLayout,
  path: "products",
  component: ProductPage,
});

// ORDERS
const orderPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "orders",
  component: OrdersPage,
});

const mainOrder = createRoute({
  getParentRoute: () => orderPage,
  path: "main-order",
  component: MainOrder,
});

const orderItem = createRoute({
  getParentRoute: () => orderPage,
  path: "main-order/$transactionId/order-item",
  component: OrderItemPage,
});

const orderDetail = createRoute({
  getParentRoute: () => orderPage,
  path: "main-order/$invoiceCode/order-detail",
  component: OrderDetail,
});

// ROUTE TREE
const routeTree = rootRoute.addChildren([
  adminLayout.addChildren([dashboard, productPage]),
  orderPage.addChildren([mainOrder, orderItem, orderDetail]),
  loginPage,
]);

export const router = createRouter({
  routeTree,
  context: { store },
  defaultNotFoundComponent: NotFoundPage,
});
