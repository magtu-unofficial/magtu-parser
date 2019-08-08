enum Efrom {
  local = "local",
  newlms = "newlms",
  newlmsZip = "newlmsZip"
}

export { Efrom };

export default interface IConfig {
  from: Efrom;
  timetable: {
    urls: Array<string>;
    filenames: {
      [index: string]: string;
    };
  };
  changes: {
    url: string;
    ignore: Array<string>;
  };
}
