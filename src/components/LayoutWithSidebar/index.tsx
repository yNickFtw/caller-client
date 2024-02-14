import { ReactNode } from "react";
import { Sidebar } from "../Sidebar";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

interface IProps {
  children: ReactNode;
}

export const LayoutWithSidebar = ({ children }: IProps) => {
  return (
    <>
      <Sidebar />
      <Card className="rounded-none ml-[80px]">
        <ScrollArea className="h-[100vh]">{children}</ScrollArea>
      </Card>
    </>
  );
};
