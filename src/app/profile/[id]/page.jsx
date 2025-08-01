'use client';

import { useParams } from 'next/navigation';
import ComponentProfileById from '@/components/pages/profile/profile-by-id/profile-by-id';

export default function ProfileByIdPage() {
  const params = useParams();
  const userId = params.id;

  return (
    <>
      <ComponentProfileById userId={userId} />
    </>
  );
}
