import { redirect } from "next/navigation";

export default function LegacyAcademyOverview() {
  redirect("/dashboard/member");
}
