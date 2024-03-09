import { Search, PlusCircle } from 'lucide-react'
import { toast } from "sonner"

import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import { Toaster } from "./components/ui/sonner";
import { useRef } from "react";

export function App() {
  const dialogRef = useRef<HTMLDivElement>(null)

  const addClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dialogRef.current?.click()
    toast.success("Cliente adicionado com sucesso")
  }


  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Clientes</h1>

      <div className="md:flex justify-between items-center max-md:space-y-2">
        <form className="flex items-center gap-2 ">
          <Input name="filter" placeholder="Filtrar clientes" className="w-max" />
          <Button
            type="submit"
            variant="outline"
          >
            <Search className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
        </form>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Adicionar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>
              Adicionar Cliente
            </DialogTitle>
            <DialogDescription>
              Criar um novo cliente no sistema.
            </DialogDescription>

            <form className="space-y-4" onSubmit={(e) => addClient(e)}>
              <div className="space-y-1">
                <Label className="ml-1">
                  Nome
                </Label>
                <Input
                  name="name"
                  placeholder="Nome"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="ml-1">
                  Email
                </Label>
                <Input
                  name="email"
                  placeholder="Email"
                  type="email"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="ml-1">
                  Telefone
                </Label>
                <Input
                  name="phone"
                  placeholder="Telefone"
                  type="tel"
                  required
                />
              </div>

              <div className="md:flex w-full md:space-x-2 max-sm:space-y-4">
                <div className="flex-1 space-y-1">
                  <Label className="ml-1">
                    Coordenada X
                  </Label>
                  <Input
                    name="coordX"
                    placeholder="Coordenada X"
                    type="number"
                    required
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <Label className="ml-1">
                    Coordenada Y
                  </Label>
                  <Input
                    name="coordY"
                    placeholder="Coordenada Y"
                    type="number"
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    ref={dialogRef}
                    className="max-sm:mt-2"
                    type="button"
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                </DialogClose>

                <Button
                  type="submit"
                >
                  Adicionar
                </Button>

              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div >

      <div className="border rounded-lg p-2">
        <Table >
          <TableHeader>
            <TableHead>
              Nome
            </TableHead>
            <TableHead>
              Email
            </TableHead>
            <TableHead>
              Telefone
            </TableHead>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow
                key={i}
              >
                <TableCell>
                  João
                </TableCell>
                <TableCell>
                  joao@email.com
                </TableCell>
                <TableCell>
                  (11) 99999-9999
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Toaster

        position="top-right"
      />
    </div >
  )
}
