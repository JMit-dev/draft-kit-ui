import { Button } from '@chakra-ui/react';
export default function CardButton({ label }: { label: string }) {
  return (
    <Button bg={'green.600'} color={'white'}>
      {label}
    </Button>
  );
}
