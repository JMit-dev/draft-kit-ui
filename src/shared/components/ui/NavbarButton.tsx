import { Button } from '@chakra-ui/react';
export default function NavbarButton({ label }: { label: string }) {
  return <Button color={'green.600'}>{label}</Button>;
}
