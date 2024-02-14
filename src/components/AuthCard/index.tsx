import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Separator } from "../ui/separator";
import { ModeToggle } from "../ModeToggle";

interface IProps {
  title: string;
  description: string | null;
  children: ReactNode;
  textLink: string;
  link: string;
}

export const AuthCard = ({
  title,
  description,
  children,
  textLink,
  link,
}: IProps) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between items-center">
              {title}
              <ModeToggle compact={true } />
            </div>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent>{children}</CardContent>

        <Separator />

        <CardFooter className="mt-4">
          <p>
            {textLink}{" "}
            <Link to={`${link}`} className="underline">
              Clique aqui
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
