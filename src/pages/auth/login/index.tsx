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

export const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const { toast } = useToast();
  const { setLoggedUser, authenticate } = useUserStore();

  const navigate = useNavigate();
  const userService = new UserService();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);

    const data = {
      email,
      password,
    };

    const response = await userService.authenticate(data);

    if (response.statusCode === 400) {
      toast({
        title: response.data.message,
        variant: "destructive",
      });
    }

    if(response.statusCode === 404) {
      toast({
        title: response.data.message,
        variant: "destructive"
      })
    }

    if(response.statusCode === 200) {
      toast({
        title: response.data.message,
        variant: "default"
      })
      authenticate(response.data.auth.token, response.data.auth.userId);
      setLoggedUser(response.data.auth.user);
      navigate('/');
    }

    setLoader(false);
  };

  return (
    <>
      <AuthCard
        title="Faça login"
        description={"Entre para aproveitar do Caller"}
        textLink="Ainda não tem uma conta?"
        link="/register"
      >
        <form onSubmit={handleSubmit}>
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
          <div className="mt-4">
            <Button type="submit" className="w-[100%]" disabled={loader}>
              {loader && (
                <>
                  <Loader2 className="animate-spin" />
                </>
              )}
              {!loader && <>Entrar</>}
            </Button>
          </div>
        </form>
      </AuthCard>
    </>
  );
};
