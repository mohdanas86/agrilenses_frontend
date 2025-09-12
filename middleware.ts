import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',           // Home page
  '/signin(.*)', // Sign in page and sub-routes
  '/signup(.*)', // Sign up page and sub-routes
  '/api/(.*)' // API routes (if they have their own auth)
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow access to public routes
  if (isPublicRoute(req)) {
    return;
  }

  // For protected routes, check if user is authenticated
  const { userId } = await auth();
  
  if (!userId) {
    // User is not authenticated, redirect to signin
    const signInUrl = new URL('/signin', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};