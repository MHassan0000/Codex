import { auth } from "@/auth";
import { NextResponse, NextRequest } from "next/server";

const protectedRoutes = ["/Profile", "/admin"];
const authRoutes = ["/sign-in", "/sign-up"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default auth((req: any) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthRoute = authRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");

  // Always allow auth API routes
  if (isApiAuthRoute) return NextResponse.next();

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Redirect unauthenticated users to sign-in
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|icons|api/auth|api/workflows).*)"],
};