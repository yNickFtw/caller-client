import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { IServerWithCountDTO } from "@/pages/servers";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useServerStore } from "@/states/useServerStore";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useEffect, useRef, useState } from "react";
import MemberService from "@/services/MemberService";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Loader2 } from "lucide-react";

interface IProps {
  server: IServerWithCountDTO;
  handleNavigate: Function;
}

interface IJoining {
  serverId: string;
  status: boolean;
}

export const ServerCard = ({ server, handleNavigate }: IProps) => {
  const { serversIdsOfUser } = useServerStore();
  const [leaving, setLeaving] = useState<boolean>(false);
  const [joining, setJoining] = useState<IJoining>({
    serverId: "",
    status: false,
  });

  const memberService = new MemberService();
  const token = localStorage.getItem("token") as string;

  function truncate(source: string, size: number): string {
    if (source.length < size) {
      return source;
    }

    let newName = source.substring(0, size) + "...";

    return newName;
  }

  async function joinServer() {
    setJoining({ serverId: server.id, status: true });

    const response = await memberService.joinServer(token, server.id);

    if(response.statusCode === 201) {
      

      handleNavigate(server, "join");
    }

    setJoining({ serverId: "", status: false });
  }

  const leaveServer = async () => {
    setLeaving(true)

    const response = await memberService.leaveServer(token, server.id)

    if(response.statusCode === 200) {
      handleNavigate(server, "leave");
    }

    setTimeout(() => {
      setLeaving(false);
    }, 2000);
  }

  return (
    <Card className="p-3 mt-3 w-[200px]">
      <CardContent className="text-center">
        <div key={server.id}>
          <img
            src={server.picture}
            alt={server.name}
            className="rounded-full w-[100%]"
          />
        </div>
        <h2 className="mt-4">{truncate(server.name, 10)}</h2>

        <Badge>
          <span className="animate-ping rounded-full w-[10px] h-[10px] bg-zinc-50 dark:bg-zinc-950 opacity-75 mr-2"></span>
          <span>
            {server.membersCount} usuário{server.membersCount > 1 && <>s</>}
          </span>
        </Badge>
      </CardContent>
      <Separator />

      {/* ACTIONS SECTIONS */}

      <CardFooter className="mt-7">
        {serversIdsOfUser.length > 0 &&
        serversIdsOfUser.includes(server.id as string) ? (
          <AlertDialog>
            <AlertDialogTrigger className="w-full">
              <Button className="w-full" variant={"destructive"}>
                Sair
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="dark:text-zinc-50">
                  Você tem certeza disso?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação é irreversivel. Você poderá entrar novamente neste
                  servidor.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="dark:text-zinc-50">
                  Cancelar
                </AlertDialogCancel>

                <Button variant={"destructive"} className="w-[25%]" disabled={leaving} onClick={leaveServer}>
                  {leaving && (
                    <Loader2 className="animate-spin" />
                  )}
                  {!leaving && (
                    "Confirmar"
                  )}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button
            className="w-full"
            variant={"secondary"}
            disabled={
              joining.status && joining.serverId === server.id ? true : false
            }
            onClick={joinServer}
          >
            {joining.status && joining.serverId === server.id ? (
              <>Entrando</>
            ) : (
              <>Entrar</>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
