import { Dispatch, SetStateAction, useRef } from "react";

import { toast } from "sonner"
import { Trash } from 'lucide-react'

import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog";

import { deleteService } from "@/services/client-service";

import { IClient } from "@/utils/types";

export function TableComponent({
  isVisit,
  clients,
  setClients,
  setAllClients,
  setHasChanges
}: {
  isVisit?: boolean
  clients: IClient[],
  setClients?: Dispatch<SetStateAction<IClient[]>>
  setAllClients?: Dispatch<SetStateAction<IClient[]>>
  setHasChanges?: Dispatch<SetStateAction<boolean>>
}) {
  const deleteRef = useRef<HTMLButtonElement>(null)

  const deleteClient = async (id: string) => {
    const { success } = await deleteService(id)

    if (!success) {
      toast.error("Erro ao excluir cliente")
      return
    }

    if (!setClients || !setAllClients || !setHasChanges) return

    setHasChanges(true)
    setClients((prev) => prev.filter(client => client.id !== id))
    setAllClients((prev) => prev.filter(client => client.id !== id))

    deleteRef.current?.click()

    toast.success("Cliente excluído com sucesso")
  }

  return (
    <Table >
      <TableHeader>
        <TableRow>
          {isVisit &&
            <TableHead>
              Ordem
            </TableHead>
          }
          <TableHead>
            Nome
          </TableHead>
          {!isVisit &&
            <>
              <TableHead>
                Email
              </TableHead>
              <TableHead>
                Telefone
              </TableHead>
            </>
          }
          <TableHead align="center">
            Coordenadas (X, Y)
          </TableHead>
          {!isVisit &&
            <TableHead className="text-center">
              Ações
            </TableHead>
          }
        </TableRow>
      </TableHeader>

      <TableBody>
        {clients.map(({
          id,
          name,
          email,
          phone,
          coordinate_x,
          coordinate_y
        }, idx) => (
          <TableRow
            key={id}
          >
            {isVisit &&
              <TableCell width={1}>
                {idx + 1}º
              </TableCell>
            }

            <TableCell>
              {name}
            </TableCell>

            {!isVisit &&
              <>
                <TableCell>
                  {email}
                </TableCell>

                <TableCell>
                  {phone}
                </TableCell>
              </>
            }

            <TableCell align="center">
              {coordinate_x}, {coordinate_y}
            </TableCell>

            {id && !isVisit &&
              <TableCell
                width={1}
                align="center"
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogTitle>
                      Excluir Cliente
                    </DialogTitle>
                    <DialogDescription>
                      Deseja realmente excluir o cliente?
                    </DialogDescription>
                    <DialogFooter>
                      <DialogClose className="max-sm:mt-2" asChild>
                        <Button
                          ref={deleteRef}
                          variant="outline"
                        >
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onClick={() => deleteClient(id)}
                      >
                        Excluir
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            }
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
