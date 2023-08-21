import Link from 'next/link';

export default async function LinksPage() {
  return (
    <div className="flex flex-col space-y-5">
      <Link href="/">Map</Link>
      <Link href="/?bbox=[-78.74,42.02,-66.38,46.49]&layers=[1]">
        Map /?bbox=[-78.74,42.02,-66.38,46.49]&layers=[1]
      </Link>
    </div>
  );
}
