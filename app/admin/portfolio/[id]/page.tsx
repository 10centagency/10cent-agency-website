'use client';

import { useParams } from 'next/navigation';
import PortfolioForm from '../PortfolioForm';

export default function EditPortfolioPage() {
  const params = useParams();
  const itemId = params.id as string;

  const isNew = itemId === 'new';

  return (
    <div>
      <PortfolioForm itemId={isNew ? undefined : itemId} />
    </div>
  );
}
