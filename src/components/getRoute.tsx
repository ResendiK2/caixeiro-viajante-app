import { Dispatch, SetStateAction, useState } from "react";

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

export function GetRouteComponent({
    hasChanges,
    setHasChanges
}: {
    hasChanges: boolean,
    setHasChanges: Dispatch<SetStateAction<boolean>>
}
) {
    const [clients, setClients] = useState<IClient[]>([])

    const getRoute = async () => {
        if (!hasChanges) return

        const { response, success } = await routeService()

        if (!success) {
            toast.error("Erro ao buscar rota")
            return
        }

        setHasChanges(false)
        setClients(response || [])
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button onClick={() => getRoute()} >
                    Ver rota
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogTitle>
                    Rota otimizada de visitas
                </DialogTitle>

                <div className="max-h-96 overflow-y-auto">
                    <TableComponent
                        isVisit
                        clients={clients}
                    />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                        >
                            Fechar
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
