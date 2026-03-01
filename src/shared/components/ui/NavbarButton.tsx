'use client';

import { Button } from '@chakra-ui/react';
import Link from 'next/link';

type NavbarButtonProps = {
  label: string;
  href: string;
};

export default function NavbarButton({ label, href }: NavbarButtonProps) {
  return (
    <Button
      as={Link}
      href={href}
      variant="ghost"
      color="green.600"
      _hover={{ bg: 'green.50' }}
    >
      {label}
    </Button>
  );
}
