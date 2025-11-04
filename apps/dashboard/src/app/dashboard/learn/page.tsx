import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function LearnRedirectPage() {
  redirect("/dashboard/learn/welcome");
}
