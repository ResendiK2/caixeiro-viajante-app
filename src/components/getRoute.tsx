import { useState } from "react";

import { toast } from "sonner"

import { Button } from "./ui/button";
import { TableComponent } from "./table";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger
} from "./ui/dialog";

import { routeService } from "@/services/client-service";

import { IClient } from "@/utils/types";

export function GetRouteComponent() {
    const [clients, setClients] = useState<IClient[]>([])

    const getRoute = async () => {
        const { response, success } = await routeService()

        if (!success) {
            toast.error("Erro ao buscar rota")
            return
        }

        setClients(response || [])
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button onClick={() => getRoute()} >
                    Ver rota
                </Button>
            </DialogTrigger>
            <DialogContent className="h-96">
                <DialogTitle>
                    Rota otimizada de visitas
                </DialogTitle>

                <TableComponent
                    isVisit
                    clients={clients}
                />

                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                        >
                            Sair
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
