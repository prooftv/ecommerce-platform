import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import { getPreviewSecret } from "@/lib/sanity/preview";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") ?? "/";

  if (!secret) {
    return NextResponse.json({ message: "Missing secret" }, { status: 401 });
  }

  try {
    if (secret !== getPreviewSecret()) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ message: "Preview not configured" }, { status: 500 });
  }

  (await draftMode()).enable();
  redirect(slug);
}
