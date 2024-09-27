import { DataTableDemo } from '@/components/paciente/dtChamados';

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '../ui/drawer';

export default function Chamados() {
  return (
    <Drawer>
      <DrawerTrigger>Chamados</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Chamados</DrawerTitle>
          <DrawerDescription>
            Aqui você encontra seu chamados e/ou cancela eles.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DataTableDemo />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
