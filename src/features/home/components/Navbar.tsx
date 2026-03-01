'use client';

import { Box, Flex, Heading, Image, Spacer } from '@chakra-ui/react';
import NavbarButton from '@/shared/components/ui/NavbarButton';
import Link from 'next/link';

export default function Navbar() {
  return (
    <Box px={6} py={3} borderBottomWidth="2px" borderColor="green.600">
      <Flex align="center">
        {/* Logo should also navigate home */}
        <Link href="/">
          <Image src="/logo.png" alt="Logo" boxSize="70px" cursor="pointer" />
        </Link>

        <Heading size="lg" color="green.600" ml={4} fontFamily="heading">
          War Room Intel
        </Heading>

        <Spacer />

        <Flex gap={3}>
          <NavbarButton label="My Leagues" href="/leagues" />
          <NavbarButton label="Stats" href="/stats" />
          <NavbarButton label="Projections" href="/projections" />
          <NavbarButton label="Notebook" href="/notebook" />
          <NavbarButton label="Profile" href="/profile" />
        </Flex>
      </Flex>
    </Box>
  );
}
