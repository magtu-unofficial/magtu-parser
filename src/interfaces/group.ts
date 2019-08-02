import { File } from "../utils/files";

export default interface IGroup {
  name: Array<string>;
  displayName?: string;
  x: number;
  file?: File;
}
