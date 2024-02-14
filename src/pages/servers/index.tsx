import { LayoutWithSidebar } from "@/components/LayoutWithSidebar";
import { ServerCard } from "@/components/ServerCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import ServerService from "@/services/ServerServices";
import { IServer } from "@/shared/interfaces/IServer";
import { useServerStore } from "@/states/useServerStore";
import { useUserStore } from "@/states/useUserStore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export interface IServerWithCountDTO extends IServer {
  membersCount: number;
}

export const Servers = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [servers, setServers] = useState<IServerWithCountDTO[] | []>([]);
  const [serverActionId, setServerActionId] = useState<string>("");

  const { logout } = useUserStore();
  const { serversOfUser, setServersOfUser, serversIdsOfUser } = useServerStore();

  const token = localStorage.getItem("token") as string;

  const serverService = new ServerService();

  const navigate = useNavigate();

  const socket = useRef<any>();

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_API_URL_SOCKET, {
      query: { serverRoomId: serverActionId },
    });

    socket.current.on("connect", () => {
      console.log(
        "Connected to the server (server) with SocketID: ",
        socket.current.id
      );
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [serverActionId]);

  async function fetchServers() {
    const response = await serverService.findAllServersOfCommunity(token);

    if (response.statusCode === 401) {
      toast({
        title: response.data.message,
        variant: "destructive",
      });
      logout();
      navigate("/login");
    }

    if (response.statusCode === 200) {
      setServers(response.data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchServers();
  }, []);

  const eventOnServer = (serverEvent: IServer, type: string) => {
    setServerActionId(serverEvent.id);

    setTimeout(() => {
      socket.current.emit("eventUsersOnServer", "event");

      if (type === "join") {
        const newServers = [...serversOfUser, serverEvent];
        setServersOfUser(newServers);

        navigate(`/server/${serverEvent.id}`);
      }

      if (type === "leave") {
        const newServers = serversOfUser.filter((server: IServer) => server.id !== 
        
        serverEvent.id)
        
        setServersOfUser(newServers);
      }
    }, 200);
  };

  return (
    <LayoutWithSidebar>
      <h1 className="p-2 text-2xl font-bold">Servidores da comunidade</h1>
      {!loading && (
        <div className="flex flex-1 p-2 flex-wrap gap-2">
          {Array.isArray(servers) &&
            servers.map((server: IServerWithCountDTO) => (
              <ServerCard
                server={server}
                handleNavigate={eventOnServer}
                key={server.id}
              />
            ))}
        </div>
      )}
      {loading && (
        <div className="flex flex-1 flex-wrap p-2 gap-2 m-3">
          {Array.from({ length: 20 }).map((_, i) => {
            return (
              <div
                className="flex flex-col justify-center rounded-lg items-center p-3 border border-zinc-200 dark:border-zinc-700 w-[200px] h-[200px]"
                key={i}
              >
                <Skeleton className="rounded-full w-[110px] h-[110px]" />
                <Skeleton className="rounded-xl w-[120px] mt-2 h-[30px]" />
              </div>
            );
          })}
        </div>
      )}
    </LayoutWithSidebar>
  );
};
