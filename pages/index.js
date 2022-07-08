import Link from 'next/link';
import { Button } from '@mantine/core';

export default function Home() {
  return (
    <Link href="/fairacc">
      <Button>
        Fair allocations
      </Button>
    </Link>
  )
}
