export default (fileList, ignore) => {
  const duplicates = [];
  for (const file of fileList) {
    if (file.file.indexOf(" ") !== -1) {
      duplicates.push(`${file.file.split(" ")[0]}.xlsx`);
    }
  }

  const cleanFileList = [];
  let applied = 0;
  for (const file of fileList) {
    if (
      ignore.indexOf(file.file) === -1 &&
      duplicates.indexOf(file.file) === -1
    ) {
      cleanFileList.push(file);
    } else {
      applied += 1;
    }
  }
  console.log(
    `Ignored ${applied} of ${ignore.length} from file and ${
      duplicates.length
    }. Left ${cleanFileList.length}`
  );

  return {
    cleanFileList,
    applied,
    ignored: ignore.length,
    duplicated: duplicates.length
  };
};
