import { getCommunityPosts } from "../../../lib/api";
import { CommunityFeed } from "../../../components/CommunityFeed";

export default async function CommunityPage() {
  const posts = await getCommunityPosts();

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl text-tmCharcoal">Community</h1>
        <p className="text-sm text-tmCharcoal/70">
          Your concierge mentors and fellow parents are one post away. Share a question, celebrate a win, or drop a resource for the next family.
        </p>
      </div>
      <CommunityFeed initialPosts={posts} />
    </div>
  );
}
