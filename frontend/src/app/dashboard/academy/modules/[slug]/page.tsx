import { redirect } from "next/navigation";

type ModuleParams = {
  params: {
    slug: string;
  };
};

export const dynamic = "force-dynamic";

export default function DashboardModuleRedirect({ params }: ModuleParams) {
  redirect(`/academy/${params.slug}`);
}
