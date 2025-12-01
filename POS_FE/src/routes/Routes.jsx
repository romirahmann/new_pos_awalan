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

const rootRoute = createRootRoute({
  notFoundComponent: NotFoundPage,
});

const adminLayout = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: AdminLayout,
  beforeLoad: ({ context }) => {
    const { store } = context;
    const state = store.getState();

    if (!state.auth.isAuthenticated) {
      console.warn("UNAUTHORIZED! Redirecting to login...");
      throw redirect({
        to: "/auth/login",
      });
    }
  },
});

const loginPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/login",
  component: LoginPage,
});

const orderPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: OrdersPage,
});
const productPage = createRoute({
  getParentRoute: () => adminLayout,
  path: "/products",
  component: ProductPage,
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

const routeTree = rootRoute.addChildren([
  adminLayout.addChildren([
    productPage,
    orderPage.addChildren([mainOrder, orderItem]),
  ]),
  loginPage,
]);

export const router = createRouter({
  routeTree,
  context: { store },
  defaultNotFoundComponent: NotFoundPage,
});
