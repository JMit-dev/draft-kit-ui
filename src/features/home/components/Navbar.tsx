'use client';

import { Box, Flex, Button, Heading, Image, Spacer } from '@chakra-ui/react';
import NavbarButton from '@/shared/components/ui/NavbarButton';

export default function Navbar() {
  return (
    <Box px={6} py={3} borderBottomWidth="2px" borderColor="green.600">
      <Flex align="center">
        <Image
          src="/logo.png"
          alt="Logo"
          boxSize="70px" // width & height
          cursor="pointer"
        />
        <Heading size="lg" color={'green.600'} ml={4} fontFamily="heading">
          War Room Intel
        </Heading>
        <Spacer />

        <Flex gap={3}>
          <NavbarButton label="Draft" />

          <NavbarButton label="Stats" />

          <NavbarButton label="Projections" />

          <NavbarButton label="Notebook" />

          <NavbarButton label="Profile" />
        </Flex>
      </Flex>
    </Box>
  );
}
