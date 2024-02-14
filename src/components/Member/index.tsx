import { IMember } from "@/shared/interfaces/IMember";
import { Avatar, AvatarImage } from "../ui/avatar";
import defaultProfile from "../../assets/defaultprofile.png";

interface IProps {
  members: IMember[];
}

export const Member = ({ members }: IProps) => {
  return (
    <div className="w-[300px] flex flex-col border-l-2 border-l-zinc-300 dark:border-l-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-3">
      <h1 className="text-xl">Membros</h1>

      <div className="flex flex-col gap-2 mt-2">
        {members &&
          members.map((member: IMember) => (
            <div key={member.id} className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={
                    member.user.picture ? member.user.picture : defaultProfile
                  }
                  alt={member.user.username}
                />
              </Avatar>
              <div className="flex flex-row items-center">
                <h3>{member.user.username}</h3>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
