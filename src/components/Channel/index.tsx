import { IChannel } from "@/shared/interfaces/IChannel";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import MessageService from "@/services/MessageService";
import { toast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { IMessage } from "@/shared/interfaces/IMessage";
import { Message } from "../Message";
import { useUserStore } from "@/states/useUserStore";

interface IProps {
  channel: IChannel;
}

export const Channel = ({ channel }: IProps) => {
  const [text, setText] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<IMessage[] | []>([]);
  const [selectedImage, setSelectedImage] = useState<any>("");

  const { loggedUser } = useUserStore();

  const messageService = new MessageService();
  const token = localStorage.getItem("token") as string;
  const navigate = useNavigate();

  const messagesContainerRef = useRef<any>(null);
  const inputRef = useRef<any>();
  const socket = useRef<any>();

  const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];

    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_API_URL_SOCKET, {
      query: { roomId: channel.id },
    });

    socket.current.on("connect", () => {
      console.log("Connected to the server with SocketID: ", socket.current.id);
    });

    socket.current.on("newMessage", async () => {
      await fetchMessages();
      if (messagesContainerRef.current) {
        setTimeout(() => {
          messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
        }, 30);
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [channel.id]);

  useEffect(() => {
    fetchMessages();
  }, [channel.id]);

  const fetchMessages = async () => {
    const response = await messageService.findAllMessageByChannelId(
      token,
      channel.id,
      channel.serverId
    );

    if (response.statusCode === 200) {
      setMessages(response.data);

      // Scroll para baixo quando uma nova mensagem é recebida
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
        }
      }, 50);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    let formData = new FormData();

    formData.append("text", text);

    if (selectedFile) formData.append("file", selectedFile);

    const response = await messageService.create(formData, token, channel.id);

    if (response.statusCode === 403) {
      toast({
        title: response.data.message,
        variant: "destructive",
      });
      navigate("/servers");
    }

    if (response.statusCode === 404) {
      toast({
        title: response.data.message,
        variant: "destructive",
      });
      navigate("/servers");
    }

    if (response.statusCode === 201) {
      setText("");
      setSelectedFile(null);
      setSelectedImage("");

      if (inputRef.current) {
        inputRef.current.focus();
      }

      if (socket.current) {
        socket.current.emit("newMessage");
        socket.current.emit("newMessageOnServer", {channelId: channel.id, message: text, user: loggedUser})
      }

      await fetchMessages();
    }
  };

  const handleResetImage = () => {
    setSelectedFile(null);
    setSelectedImage("");
  };

  return (
    <div className="flex flex-col w-[100%] p-2 bg-zinc-200 dark:bg-zinc-900 relative h-screen">
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 text-2xl p-1">#</span>{" "}
        <h3 className="text-2xl">{channel.name}</h3>
      </div>

      {/* Chat Section */}
      <div
        className="w-full h-[87vh] overflow-scroll scroll-smooth"
        ref={messagesContainerRef}
      >
        <div className="flex flex-col justify-start items-start">
          <h1 className="flex items-center justify-center bg-zinc-700 rounded-full w-36 h-36 text-7xl">#</h1>
          <h2 className="text-2xl font-bold">Bem-vindo(a) a #{channel.name}</h2>
          <p className="text-zinc-400">Este é o começo do canal #{channel.name}</p>
        </div>
        {messages &&
          messages.map((message: IMessage) => (
            <Message
              key={message.id}
              message={message}
            />
          ))}
      </div>

      {/* Input message section */}
      <div className="flex flex-col absolute bottom-0 left-0 w-full">
        {selectedFile && (
          <div className="p-3">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-1/4 rounded-md"
            />
            <div className="absolute top-4 right-3/4 bg-zinc-800 p-2 rounded-lg">
              <Trash2
                className="text-red-600 cursor-pointer"
                onClick={handleResetImage}
              />
            </div>
          </div>
        )}

        <form
          className="flex flex-row items-center p-3"
          onSubmit={handleSubmit}
        >
          <label>
            <PlusCircle className="text-zinc-400 cursor-pointer" />
            <input
              type="file"
              className="hidden cursor-pointer"
              onChange={handleSelectFile}
            />
          </label>

          <input
            type="text"
            placeholder={`Conversar em #${channel.name}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            ref={inputRef}
            className="w-full p-2 bg-transparent outline-none"
          />

          <Button type="submit">Enviar</Button>
        </form>
      </div>
    </div>
  );
};
