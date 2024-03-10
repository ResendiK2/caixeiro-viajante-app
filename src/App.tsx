import { useEffect, useRef, useState } from "react";

import { z } from "zod"
import axios from "axios";
import { toast } from "sonner"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, PlusCircle, Trash, } from 'lucide-react'

import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "./components/ui/dialog";

interface Client {
  id: string
  name: string
  email: string
  phone: string
  coordinate_x: number
  coordinate_y: number
}

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Nome deve ter no mínimo 3 caracteres."
  }),
  email: z.string().email({
    message: "Email inválido."
  }),
  phone: z.string().min(8, {
    message: "Telefone inválido."
  }).max(11, {
    message: "Telefone inválido."
  }),
  coordinate_x: z.number(),
  coordinate_y: z.number(),
})

export function App() {
  const api = 'http://localhost:3000/'

  const [clientLoading, setClientLoading] = useState(false)

  const [allClients, setAllClients] = useState<Client[]>([])
  const [clients, setClients] = useState<Client[]>([])

  const dialogRef = useRef<HTMLDivElement>(null)
  const deleteRef = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      coordinate_x: 0,
      coordinate_y: 0
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { name, email, phone, coordinate_x, coordinate_y } = values

      setClientLoading(true)

      const data = {
        name,
        email,
        phone,
        coordinate_x,
        coordinate_y
      }

      console.log({ data })

      const response = await axios({
        method: 'POST',
        url: `${api}clients`,
        data
      })

      setClientLoading(false)

      if (response.status !== 200) {
        throw new Error("Erro ao adicionar cliente")
      }

      setClients([...clients, response.data.response])
      setAllClients([...allClients, response.data.response])

      dialogRef.current?.click()

      toast.success("Cliente adicionado com sucesso")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao adicionar cliente")
    }
  }

  const getUsers = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: `${api}clients`
      })

      if (response.status === 200) {
        setClients(response.data.response)
        setAllClients(response.data.response)
      }
    } catch (error) {
      toast.error("Erro ao buscar clientes, recarregue a página")
    }
  }

  const deleteClient = async (id: string) => {
    try {
      const response = await axios({
        method: 'DELETE',
        url: `${api}clients/${id}`
      })

      if (response.status !== 200) {
        throw new Error("Erro ao excluir cliente")
      }

      setClients(clients.filter(client => client.id !== id))
      setAllClients(allClients.filter(client => client.id !== id))

      deleteRef.current?.click()
      toast.success("Cliente excluído com sucesso")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao excluir cliente")
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Clientes</h1>

      <div className="md:flex justify-between items-center max-md:space-y-2">
        <form className="flex flex-1 justify-end items-center gap-2">
          <Input name="filter" placeholder="Filtrar clientes" className="w-2/3" />
          <Button
            type="submit"
            variant="outline"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>
                Adicionar Cliente
              </DialogTitle>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    disabled={clientLoading}
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    disabled={clientLoading}
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    disabled={clientLoading}
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="Telefone" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="md:flex w-full md:space-x-2 max-sm:space-y-4">
                    <FormField
                      disabled={clientLoading}
                      control={form.control}
                      name="coordinate_x"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Coordenada X</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Coordenada X"
                              {...field}
                              onChange={(e) => {
                                form.setValue('coordinate_x', Number(e.target.value))
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={clientLoading}
                      control={form.control}
                      name="coordinate_y"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Coordenada Y</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Coordenada Y"
                              {...field}
                              onChange={(e) => {
                                form.setValue('coordinate_y', Number(e.target.value))
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        disabled={clientLoading}
                        ref={dialogRef}
                        variant="outline"
                        onClick={() => form.reset()}
                      >
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={clientLoading}
                    >
                      Cadastrar
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </form>
      </div >

      <div className="border rounded-lg p-2">
        <Table >
          <TableHeader>
            <TableRow>
              <TableHead>
                Nome
              </TableHead>
              <TableHead>
                Email
              </TableHead>
              <TableHead>
                Telefone
              </TableHead>
              <TableHead align="center">
                Coordenadas (X, Y)
              </TableHead>
              <TableHead className="text-center">
                Ações
              </TableHead>
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
            }) => (
              <TableRow
                key={id}
              >
                <TableCell
                  width={2}
                >
                  {name}
                </TableCell>
                <TableCell
                  width={1}
                >
                  {email}
                </TableCell>
                <TableCell
                  width={1}
                >
                  {phone}
                </TableCell>
                <TableCell
                  width={1}
                  align="center"
                >
                  {coordinate_x}, {coordinate_y}
                </TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Toaster position="top-right" />
    </div >
  )
}
