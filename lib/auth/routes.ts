export const publicRoutes = ['/', '/feedback', '/roadmap', '/changelog', '/login'];
export const publicPrefixes = ['/posts/'];
export const protectedPrefixes = ['/dashboard'];

export function isProtectedRoute(pathname: string): boolean {
  return protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
}
