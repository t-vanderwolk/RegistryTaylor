import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getMyRegistryConnection, upsertMyRegistryItems } from "@/lib/server/registryStore";

type MyRegistryProduct = {
  externalId: string;
  name: string;
  brand?: string | null;
  price?: number;
  image?: string | null;
  link?: string | null;
  category?: string | null;
};

async function fetchMyRegistrySnapshot(_token: string): Promise<MyRegistryProduct[]> {
  // Placeholder: in production this would call the MyRegistry API.
  return [
    {
      externalId: "myregistry-dream-bassinet",
      name: "Dreamy Rattan Bassinet",
      brand: "MyRegistry Curation",
      price: 480,
      image: "https://images.unsplash.com/photo-1616627567555-b96d9a118312?auto=format&fit=crop&w=800&q=80",
      link: "https://www.myregistry.com/baby-registry/dreamy-rattan-bassinet",
      category: "Nursery Essentials",
    },
    {
      externalId: "myregistry-aromatherapy-diffuser",
      name: "Aromatherapy Diffuser & Nightlight",
      brand: "Calme Maison",
      price: 92,
      image: "https://images.unsplash.com/photo-1601000938259-9d78bb35c5fb?auto=format&fit=crop&w=800&q=80",
      link: "https://www.myregistry.com/baby-registry/calme-maison-diffuser",
      category: "Postpartum Support",
    },
  ];
}

export async function GET(_request: NextRequest) {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const connection = getMyRegistryConnection(userId);
  if (!connection?.token) {
    return NextResponse.json({ error: "MyRegistry is not connected" }, { status: 400 });
  }

  const snapshot = await fetchMyRegistrySnapshot(connection.token);
  const items = upsertMyRegistryItems(userId, snapshot);

  return NextResponse.json({
    syncedAt: new Date().toISOString(),
    items,
  });
}
