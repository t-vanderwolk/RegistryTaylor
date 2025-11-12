import { redirect } from "next/navigation";

export default function LegacyRegistryPage() {
  redirect("/dashboard/member/plan");
}
