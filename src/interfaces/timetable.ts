import Ipair from "./pair";

export default interface Itimetable {
  ate: Date;
  group: string;
  pairs: Array<Ipair>;
}
