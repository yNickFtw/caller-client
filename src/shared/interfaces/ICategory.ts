import { IChannel } from "./IChannel";

export interface ICategory {
  id: string;
  name: string;
  serverId: string;
  userId: string;
  channels: IChannel[];
}