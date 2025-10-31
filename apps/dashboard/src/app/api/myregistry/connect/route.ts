import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getMyRegistryConnection, saveMyRegistryConnection } from "@/lib/server/registryStore";

export async function GET() {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ connected: false }, { status: 401 });
  }

  const connection = getMyRegistryConnection(userId);
  return NextResponse.json({
    connected: Boolean(connection),
    connection: connection
      ? {
          username: connection.username,
          connectedAt: connection.connectedAt,
        }
      : null,
  });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const token = body?.token as string | undefined;
  const username = body?.username as string | undefined;

  if (!token) {
    return NextResponse.json({ error: "Missing OAuth token" }, { status: 400 });
  }

  saveMyRegistryConnection(userId, token, username);

  const connection = getMyRegistryConnection(userId);
  return NextResponse.json({
    connected: true,
    connection: connection
      ? {
          username: connection.username,
          connectedAt: connection.connectedAt,
        }
      : null,
  });
}
