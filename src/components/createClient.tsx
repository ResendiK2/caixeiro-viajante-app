import { Dispatch, SetStateAction, useRef, useState } from "react";

import { z } from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from 'lucide-react'

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger
} from "./ui/dialog";

import { IClient } from "@/utils/types";
import { createService } from "@/services/cliente-service";

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

export function CreateClientComponent(
    {
        setClients,
        setAllClients,
    }: {
        setClients: Dispatch<SetStateAction<IClient[]>>
        setAllClients: Dispatch<SetStateAction<IClient[]>>
    }
) {
    const [clientLoading, setClientLoading] = useState(false)

    const dialogRef = useRef<HTMLButtonElement>(null)

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

        const { name, email, phone, coordinate_x, coordinate_y } = values

        setClientLoading(true)

        const data: IClient = {
            name,
            email,
            phone,
            coordinate_x,
            coordinate_y
        }

        const { success, response } = await createService(data)

        setClientLoading(false)

        if (!success || !response?.id) {
            toast.error("Erro ao adicionar cliente")
            return
        }

        setClients((prev) => [...prev, response])
        setAllClients((prev) => [...prev, response])

        dialogRef.current?.click()

        toast.success("Cliente adicionado com sucesso")

    }

    return (
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
    )
}
