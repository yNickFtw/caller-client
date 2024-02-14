import { AuthCard } from "@/components/AuthCard";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import UserService from "@/services/UserServices";
import { useUserStore } from "@/states/useUserStore";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const { toast } = useToast();
  const { setLoggedUser, authenticate } = useUserStore();

  const navigate = useNavigate();
  const userService = new UserService();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);

    const data = {
      username,
      email,
      password,
      confirmPassword,
    };

    const response = await userService.create(data);

    if (response.statusCode === 400) {
      toast({
        title: response.data.message,
        variant: "destructive",
      });
    }

    if(response.statusCode === 201) {
      toast({
        title: response.data.message,
        variant: "default"
      })
      setLoggedUser(response.data.auth.user);
      authenticate(response.data.auth.token, response.data.auth.userId);
      navigate('/')
    }

    setLoader(false);
  };

  return (
    <>
      <AuthCard
        title="Faça cadastro"
        description={
          "Cadastre-se no Caller e comece hoje mesmo a conversar com seus amigos."
        }
        textLink="Já tem uma conta?"
        link="/login"
      >
        <form onSubmit={handleSubmit}>
          <div>
            <Label>Nome de usuário</Label>
            <Input
              placeholder="Digite seu nome de usuário aqui:"
              autoComplete="off"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              placeholder="Digite seu email aqui:"
              autoComplete="off"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label>Senha</Label>
            <Input
              placeholder="Digite sua senha aqui:"
              autoComplete="off"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Label>Confirme sua senha</Label>
            <Input
              placeholder="Confirme sua senha:"
              autoComplete="off"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <Button type="submit" className="w-[100%]" disabled={loader}>
              {loader && (
                <>
                  <Loader2 className="animate-spin" />
                </>
              )}
              {!loader && <>Cadastrar</>}
            </Button>
          </div>
        </form>
      </AuthCard>
    </>
  );
};
