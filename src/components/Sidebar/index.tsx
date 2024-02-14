import "react-image-crop/dist/ReactCrop.css";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import CallerWhite from "../../assets/caller_logo_white.png";
import CallerDark from "../../assets/caller_logo.png";
import { useThemeStore } from "@/states/useThemeStore";
import { useUserStore } from "@/states/useUserStore";
import { ModeToggle } from "../ModeToggle";
import { Card } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Globe, Loader2, LogOut, Plus, User } from "lucide-react";
import { toast } from "../ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "../ui/avatar";
import defaultProfile from "../../assets/defaultprofile.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import ReactCrop, { PixelCrop, type Crop } from "react-image-crop";
import { canvasPreview } from "@/shared/helpers/canvasPreview";
import { useDebounceEffect } from "@/shared/helpers/useDebounceEffect";
import { ScrollArea } from "../ui/scroll-area";
import ServerService from "@/services/ServerServices";
import { IServer } from "@/shared/interfaces/IServer";
import { useServerStore } from "@/states/useServerStore";
import { Separator } from "../ui/separator";
import MemberService from "@/services/MemberService";
import { useDispatch, useSelector } from "react-redux";
import { selectServers, setServers, useServers } from "@/states/serverSlice";

export const Sidebar = () => {
  const [crop, setCrop] = useState<Crop>();
  const [_, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loader, setLoader] = useState<boolean>(false);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const { themeSelected } = useThemeStore();

  const serversState = useSelector(selectServers);
  const dispatch = useDispatch();

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const { loggedUser, logout } = useUserStore();
  const { add, serversOfUser, setServersOfUser, reset, setServersWhereUserIsOwner } = useServerStore();

  const navigate = useNavigate();
  const token = localStorage.getItem("token") as string;

  const serverService = new ServerService();

  async function fetchServers(): Promise<void> {
    const response = await serverService.findAllServersOfUser(token);

    if (response.statusCode === 401) {
      toast({
        title: response.data.message,
        variant: "destructive",
      });
      logout();
      navigate("/login");
    }

    if (response.statusCode === 200) {
      dispatch(setServers(response.data))
      setLoading(false);
    }
  }

  async function fetchServersWhereUserIsOwner() {
    const response = await new MemberService().findAllServersWhereUserIsOwner(token);

    if(response.statusCode === 200) {
      setServersWhereUserIsOwner(response.data);
    }
  }

  useEffect(() => {
    if (serversOfUser.length < 1) {
      fetchServers();
      
    }

    if (serversOfUser.length > 0) {

      setLoading(false);
    }
  }, []);

  const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    setCrop(undefined);

    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertCropToImage = async () => {
    if (completedCrop && imgRef.current) {
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          imgRef.current,
          completedCrop.x * scaleX,
          completedCrop.y * scaleY,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
          0,
          0,
          completedCrop.width,
          completedCrop.height
        );
        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob);
          }, "image/jpeg");
        });
      }
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);

    let formData = new FormData();

    const croppedImageBlob = (await convertCropToImage()) as Blob;

    formData.append("name", name);

    if (croppedImageBlob) {
      formData.append("file", croppedImageBlob);
    }

    const response = await serverService.create(formData, token);

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
      setCrop(undefined);
      setName("");
      setCompletedCrop(undefined);
      setSelectedFile(null);
      setSelectedImage(null);
      add(response.data.server);
      navigate(`/server/${response.data.server.id}`)
    }

    setLoader(false);
  };

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          1,
          0
        );
      }
    },
    100,
    [completedCrop, 1, 0]
  );

  return (
    <>
      <Card className="flex flex-row gap-3">
        <section className="flex flex-col justify-between items-center fixed top-0 left-0 bottom-0 w-[80px] h-[100vh] bg-zinc-50 dark:bg-zinc-950">
          <div className="p-3 cursor-pointer" onClick={() => navigate("/")}>
            {themeSelected === "dark" && (
              <img className="w-[40px]" src={CallerWhite} alt="Caller logo" />
            )}
            {themeSelected === "light" && (
              <img className="w-[40px]" src={CallerDark} alt="Caller logo" />
            )}
          </div>

          {/* SERVERS @MAP */}
          {!loading && (
            <>
              {/* Container servers */}
              <ScrollArea className="h-[100%]">
                <div className="flex flex-col gap-2">
                  {Array.isArray(serversState.servers) &&
                    serversState.servers.map((server: IServer) => (
                      <Link key={server.id} to={`/server/${server.id}`} className="p-4 cursor-pointer transition ease-in duration-100 border rounded-full border-transparent hover:border-zinc-950 dark:hover:border-zinc-50">
                        <img
                          className="rounded-full"
                          src={server.picture}
                          alt={server.name}
                        />
                      </Link>
                    ))}
                </div>
              </ScrollArea>
            </>
          )}

          <div className="flex flex-col items-center">
            
            <button onClick={() => console.log(serversState.servers)}>teste</button>

            <div className="flex flex-col items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="flex flex-row justify-center items-center rounded-full p-2 bg-zinc-100 dark:bg-zinc-800 cursor-pointer">
                    <Plus size={"2em"} />
                  </div>
                </DialogTrigger>
                <DialogContent className="text-zinc-950 dark:text-zinc-100">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>Criar um servidor</DialogTitle>
                      <DialogDescription>
                        Preencha as informações abaixo
                      </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="h-[300px] z-[999]">
                      <div className="text-zinc-950 dark:text-zinc-100 p-2">
                        <Label>Foto do servidor</Label>
                        <Input
                          type="file"
                          onChange={handleSelectFile}
                          accept="image/*"
                        />
                      </div>

                      <div>
                        <Label>Nome do servidor</Label>
                        <Input
                          placeholder="Digite o nome aqui:"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      {selectedImage && (
                        <div className="m-auto mt-2">
                          <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            className="m-auto"
                            aspect={4 / 4}
                            circularCrop={true}
                            minHeight={50}
                            minWidth={50}
                          >
                            <img
                              className="w-[100%]"
                              src={selectedImage}
                              alt="Imagem selecionada"
                              ref={imgRef}
                            />
                          </ReactCrop>
                        </div>
                      )}

                      {/* {!!completedCrop && (
                        <div className="w-[50%] m-auto">
                          <canvas
                            ref={previewCanvasRef}
                            style={{
                              objectFit: "contain",
                              width: completedCrop.width,
                              height: completedCrop.height,
                              borderRadius: "100%",
                            }}
                          />
                        </div>
                      )} */}
                    </ScrollArea>
                    <DialogFooter>
                      <Button
                        variant={"default"}
                        className="w-[100%]"
                        disabled={loader}
                      >
                        {!loader && <>Adicionar servidor</>}
                        {loader && (
                          <>
                            <Loader2 className="animate-spin" />
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <div
                className="flex flex-row justify-center items-center rounded-full p-2 bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
                onClick={() => navigate("/servers")}
              >
                <Globe size={"2em"} />
              </div>
            </div>

            <div className="flex flex-row items-center gap-2 p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage
                      src={
                        loggedUser.picture ? loggedUser.picture : defaultProfile
                      }
                    />
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="ml-3">
                  <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User size={"1.5em"} /> Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      toast({
                        title: "Deslogado com sucesso",
                      });
                      reset();
                      logout();
                      navigate("/login");
                    }}
                  >
                    <LogOut /> Logout
                  </DropdownMenuItem>
                  <DropdownMenuLabel>Tema</DropdownMenuLabel>
                  <Separator />
                  <div className="p-2">
                    <ModeToggle compact={false} />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </section>
      </Card>
    </>
  );
};
