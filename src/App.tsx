import { useEffect, useState } from "react";

import { toast } from "sonner"
import { Search } from 'lucide-react'

import { TableComponent } from "./components/table";

import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { CreateClientComponent } from "./components/createClient";

import { IClient } from "./utils/types";
import { filterService, getService } from "./services/cliente-service";

export function App() {

  const [allClients, setAllClients] = useState<IClient[]>([])
  const [clients, setClients] = useState<IClient[]>([])
  const [filter, setFilter] = useState('')

  const getUsers = async () => {
    try {
      const { response, success } = await getService()

      if (!success) {
        toast.error("Erro ao buscar cliente")
        return
      }

      setClients(response || []);
      setAllClients(response || []);
    } catch (error) {
      toast.error("Erro ao buscar clientes, recarregue a página")
    }
  }

  const filterClients = async (filter: string) => {
    try {
      if (filter?.length === 0) {
        setClients(allClients)
        return
      }

      const { response, success } = await filterService(filter)

      if (!success) {
        toast.error("Erro ao buscar cliente")
        return
      }

      setClients(response || []);

    } catch (error) {
      toast.error("Erro ao buscar clientes")
    }
  }

  useEffect(() => {
    if (filter?.length > 0) return

    setClients(allClients)
  }, [filter])

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Clientes</h1>

      <div className="md:flex justify-between items-center max-md:space-y-2">
        <div className="flex flex-1 justify-end items-center gap-2">
          <Input
            name="filter"
            placeholder="Filtrar clientes"
            className="w-2/3"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value)
            }}
          />
          <Button
            variant="outline"
            onClick={() => filterClients(filter)}
          >
            <Search className="w-4 h-4" />
          </Button>
          <CreateClientComponent
            setClients={setClients}
            setAllClients={setAllClients}
          />
        </div>
      </div >

      <div className="border rounded-lg p-2">
        <TableComponent
          clients={clients}
          setClients={setClients}
          setAllClients={setAllClients}
        />
      </div>

      <Toaster position="top-right" />
    </div >
  )
}
