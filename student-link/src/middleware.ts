import { auth } from "@/auth";
import { NextResponse } from "next/server";

// 1. Wrap the middleware with 'auth'
export default auth((req) => {
    // 2. Get the current request headers
    const requestHeaders = new Headers(req.headers);

    // 3. Add the current pathname to the "x-url" header
    // This allows your Server Components (like Navbar) to read the path
    requestHeaders.set("x-url", req.nextUrl.pathname);

    // 4. Continue the request with the modified headers
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
});

// 5. Standard Matcher (prevents middleware from running on static files/images)
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};