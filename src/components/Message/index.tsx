import { IMessage } from "@/shared/interfaces/IMessage";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useUserStore } from "@/states/useUserStore";
import { channel } from "diagnostics_channel";
import defaultProfile from "../../assets/defaultprofile.png";

interface IProps {
  message: IMessage;
}

export const Message = ({ message }: IProps) => {
  const getTimeAgoText = () => {
    const createdAtDate: any = new Date(message.createdAt);
    const currentDate: any = new Date();
    const timeDifference = currentDate - createdAtDate;

    if (timeDifference < 60000) {
      return "Agora mesmo";
    } else if (timeDifference < 3600000) {
      const minutesAgo = Math.floor(timeDifference / (1000 * 60));
      return `${minutesAgo} min atrás`;
    } else if (timeDifference < 86400000) {
      const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
      return `${hoursAgo} h atrás`;
    } else if (timeDifference < 604800000) {
      const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      return `${daysAgo} d atrás`;
    } else if (timeDifference < 2592000000) {
      const weeksAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7));
      return `${weeksAgo} sem atrás`;
    } else {
      const monthsAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
      return `${monthsAgo} mês atrás`;
    }
  };

  return (
    <div className="flex flex-row items-center gap-2 p-2" key={message.id}>
      <div className="flex flex-col w-full gap-1">
        <div className="flex flex-row gap-2">
          <Avatar>
            <AvatarImage
              src={message.user.picture ? message.user.picture : defaultProfile}
              alt={message.user.username}
            />
          </Avatar>{" "}
          <div className="flex flex-row items-center gap-2">
            <h3>{message.user.username}</h3>
            <span className="text-zinc-500">{getTimeAgoText()}</span>
          </div>
        </div>

        <div>{message.text && <p>{message.text}</p>}</div>
        {message.image !== null && (
          <img
            src={message.image}
            alt={message.text}
            className="w-64 rounded-lg"
          />
        )}
      </div>
    </div>
  );
};
