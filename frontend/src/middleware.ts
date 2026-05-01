import { clerkMiddleware } from '@clerk/nextjs/server';

// Clerk is initialized on all routes so auth state is available everywhere.
// Route-level blocking is NOT used here — the analysis endpoint is protected
// at the API layer (backend JWT verification) and UI layer (hook guard).
export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};