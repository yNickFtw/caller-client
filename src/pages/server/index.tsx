import { Channel } from "@/components/Channel";
import { LayoutWithSidebar } from "@/components/LayoutWithSidebar";
import { Member } from "@/components/Member";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import CategoryService from "@/services/CategoryService";
import ChannelService from "@/services/ChannelService";
import MemberService from "@/services/MemberService";
import MessageService from "@/services/MessageService";
import ServerService from "@/services/ServerServices";
import { ICategory } from "@/shared/interfaces/ICategory";
import { IChannel } from "@/shared/interfaces/IChannel";
import { IMember } from "@/shared/interfaces/IMember";
import { INewMessagesServer } from "@/shared/interfaces/INewMessagesServer";
import { IServer } from "@/shared/interfaces/IServer";
import { useUserStore } from "@/states/useUserStore";
import { ArrowDown, Plus, Settings } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

export const Server = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [server, setServer] = useState<IServer | null>(null);
  const [categories, setCategories] = useState<ICategory[] | []>([]);
  const [members, setMembers] = useState<IMember[] | []>([]);
  const [newMessages, setNewMessages] = useState<INewMessagesServer[] | []>([]);
  const [isSavingChannel, setIsSavingChannel] = useState<boolean>(false);
  const [categoryToCreateChannel, setCategoryToCreateChannel] =
    useState<string>("");
  const [channelActive, setChannelActive] = useState<IChannel | null>();
  const { serverId } = useParams();

  const { logout } = useUserStore();
  const serverService = new ServerService();
  const categoryService = new CategoryService();
  const channelService = new ChannelService();
  const memberService = new MemberService();
  const messageService = new MessageService();
  const navigate = useNavigate();
  const token = localStorage.getItem("token") as string;

  const socket = useRef<any>();
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_API_URL_SOCKET, {
      query: { serverRoomId: serverId },
    });

    socket.current.on("connect", () => {
      console.log(
        "Connected to the server (server) with SocketID: ",
        socket.current.id
      );
    });

    socket.current.on("eventUsersOnServer", async (event: any) => {
      console.log(event)
    })

    socket.current.on("newMessageOnServer", async (channel: any) => {
      if (!channel) {
        return;
      }

      if (channel.channelId.toString() === channelActive?.id.toString()) {
        console.log(console.log(channel));

        return;
      } else {
        const response = await messageService.newMessageOnServer(
          token,
          channel.channelId
        );

        if (response.statusCode === 201) {
          await fetchCategories(false);
        }
      }
    });

    socket.current.on("newChannelCreated", async () => {
      await fetchCategories(false);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [serverId]);

  async function fetchServer() {
    setChannelActive(null);
    const response = await serverService.findServerById(serverId!, token);

    if (response.statusCode === 404) {
      toast({
        title: response.data.message,
        variant: "destructive",
      });
      navigate("/");
    }

    if (response.statusCode === 403) {
      toast({
        title: response.data.message,
        variant: "destructive",
      });
      navigate("/");
    }

    if (response.statusCode === 401) {
      toast({
        title: response.data.message,
        variant: "destructive",
      });
      logout();
      navigate("/login");
    }

    if (response.statusCode === 200) {
      setServer(response.data);
      await fetchCategories(true);
      await fetchMembers();
    }
  }

  async function fetchNewMessagesOnServer() {
    const response = await messageService.findAllNewMessagesServer(
      token,
      serverId!
    );

    if (response.statusCode === 200) {
      setNewMessages(response.data);
    }
  }

  async function fetchCategories(selectDefaultChannel: boolean) {
    const response = await categoryService.findAllCategoriesAndChannels(
      token,
      serverId!
    );

    if (response.statusCode === 403) {
      toast({
        title: response.data.message,
        variant: "destructive",
      });
      navigate("/servers");
    }

    if (response.statusCode === 401) {
      toast({
        title: response.data.message,
        variant: "destructive",
      });

      logout();
      navigate("/login");
    }

    if (response.statusCode === 200) {
      setCategories(response.data);

      if (selectDefaultChannel) {
        setChannelActive(response.data[0].channels[0]);
      }

      await fetchNewMessagesOnServer();
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchNewMessagesOnServer();
  }, [serverId]);

  async function fetchMembers() {
    const response = await memberService.findAllMembersByServerId(
      token,
      serverId!
    );

    if (response.statusCode === 200) {
      setMembers(response.data);
    }
  }

  useEffect(() => {
    fetchServer();
  }, [serverId]);

  const handleSelectChannel = (channel: IChannel) => {
    setChannelActive(channel);
  };

  const handleSelectCategoryToCreateChannel = (categoryId: string) => {
    if (categoryToCreateChannel === categoryId) return;

    setCategoryToCreateChannel(categoryId);
  };

  const handleCreateChannel = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsSavingChannel(true);

    const inputValue = nameInputRef.current?.value || "";

    const response = await channelService.create(
      token,
      inputValue,
      serverId!,
      categoryToCreateChannel
    );

    if (response.statusCode === 400) {
      toast({
        title: response.data.message,
        variant: "destructive",
      });
    }

    if (response.statusCode === 201) {
      toast({
        title: response.data.message,
        variant: "default",
      });

      setCategoryToCreateChannel("");
      setChannelActive(response.data.channel);
      await fetchCategories(false);
      setIsSavingChannel(false);
    }
  };

  function truncate(source: string, size: number): string {
    if (source.length < size) {
      return source;
    }

    return source.substring(0, size) + "...";
  }

  return (
    <LayoutWithSidebar>
      {!loading && (
        <section className="flex">
          <div className="w-[300px] h-[100vh] border-r-2 border-r-zinc-300 dark:border-r-zinc-800 bg-zinc-100 dark:bg-zinc-900">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex flex-row justify-between items-center p-3 w-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
                asChild
              >
                <h1 className="text-1xl font-bold cursor-pointer">
                  {server?.name}

                  <ArrowDown size={"1.2em"} />
                </h1>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[300px]">
                <DropdownMenuLabel>Servidor</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings size={"1.5em"} /> Configurações
                </DropdownMenuItem>
                <div className="mt-2">
                  <Button className="w-full" variant={"destructive"}>
                    Sair do servidor
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex flex-col w-full p-2">
              {categories &&
                categories.map((category: ICategory) => (
                  <div
                    className="mt-2 flex flex-col justify-center"
                    key={category.id}
                  >
                    <>
                      <div className="flex flex-row justify-between">
                        <h3 className="text-sm">
                          {category.name.toUpperCase()}
                        </h3>

                        <Dialog>
                          <DialogTrigger
                            asChild
                            onClick={() =>
                              handleSelectCategoryToCreateChannel(category.id)
                            }
                          >
                            <Plus
                              size={"1em"}
                              className="cursor-pointer text-zinc-400 hover:text-zinc-100"
                            />
                          </DialogTrigger>
                          <DialogContent className="text-zinc-950 dark:text-zinc-100">
                            <DialogHeader>Criar canal</DialogHeader>

                            <DialogDescription>
                              Preencha o nome do canal
                            </DialogDescription>

                            <form
                              className="flex flex-col gap-4"
                              onSubmit={handleCreateChannel}
                            >
                              <Input
                                type="text"
                                placeholder="Digite aqui:"
                                ref={nameInputRef}
                              />

                              <div className="flex flex-row justify-end">
                                <Button
                                  variant={"default"}
                                  disabled={isSavingChannel}
                                >
                                  {isSavingChannel ? (
                                    <>Aguarde...</>
                                  ) : (
                                    <>Criar canal</>
                                  )}
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="flex flex-col gap-1">
                        {category.channels.map((channel: IChannel) => (
                          <div key={channel.id}>
                            <div
                              className={`w-full p-2 flex text-zinc-400 justify-between items-center hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md ${
                                channelActive &&
                                channelActive.id === channel.id &&
                                "dark:bg-zinc-800 bg-zinc-200 text-zinc-50"
                              }`}
                              key={channel.id}
                              onClick={() => handleSelectChannel(channel)}
                            >
                              <div className="w-full">
                                <span className="text-zinc-500  mr-2">#</span>{" "}
                                {truncate(channel.name, 10)}
                              </div>
                              {/* Actions section */}
                              <div className="flex flex-rol gap-1">
                                {channel.countMessages > 0 && (
                                  <span>{channel.countMessages}</span>
                                )}
                                <Settings
                                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-50"
                                  size={"1.2em"}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  </div>
                ))}
            </div>
          </div>
          {channelActive && <Channel channel={channelActive} />}
          {!channelActive && <div className="w-[100%]"></div>}
          {members && <Member members={members} />}
        </section>
      )}
    </LayoutWithSidebar>
  );
};
