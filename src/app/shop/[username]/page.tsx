import MockupPage from '@/components/ui/MockupPage';

export default function UserShopPage({ params }: { params: { username: string } }) {
  return <MockupPage title={`Shop của @${params.username}`} />;
}
