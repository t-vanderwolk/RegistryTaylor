import { NextResponse } from "next/server";
import items from "@/data/registryItems.json";

type RegistryItem = {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  imageUrl: string;
  retailer: string;
  url: string;
  notes: string;
};

export function GET() {
  const formatted = (items as Array<Omit<RegistryItem, "price"> & { price: string }>).map((item) => ({
    ...item,
    price: Number(item.price.replace(/[^0-9.]/g, "")) || 0,
  }));

  return NextResponse.json({
    items: formatted,
  });
}
