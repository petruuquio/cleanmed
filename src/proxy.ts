import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // Lógica para rotas de autenticação (ex: /login)
  if (path.startsWith("/login")) {
    if (token) {
      if (token.role === "PATIENT") {
        url.pathname = "/portal";
        return NextResponse.redirect(url);
      }
      url.pathname = "/dashboard/consultas";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Lógica de proteção de rotas privadas
  if (path.startsWith("/dashboard") || path.startsWith("/portal")) {
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Validação de acesso cruzado
    if (path.startsWith("/dashboard") && token.role === "PATIENT") {
      url.pathname = "/portal";
      return NextResponse.redirect(url);
    }

    if (path.startsWith("/portal") && token.role !== "PATIENT") {
      url.pathname = "/dashboard/consultas";
      return NextResponse.redirect(url);
    }
  }

  // Raiz '/' redireciona conforme papel
  if (path === "/") {
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    if (token.role === "PATIENT") {
      url.pathname = "/portal";
      return NextResponse.redirect(url);
    }
    url.pathname = "/dashboard/consultas";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/portal/:path*",
  ],
};
