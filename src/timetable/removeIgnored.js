export default (fileList, ignore) => {
  const duplicates = [];
  for (const file of fileList) {
    if (file.file.indexOf(" ") !== -1) {
      duplicates.push(`${file.file.split(" ")[0]}.xlsx`);
    }
  }

  const cleanFileList = [];
  let ignored = 0;
  for (const file of fileList) {
    if (
      ignore.indexOf(file.file) === -1 &&
      duplicates.indexOf(file.file) === -1
    ) {
      cleanFileList.push(file);
    } else {
      ignored += 1;
    }
  }
  console.log(
    `Ignored ${ignored} of ${ignore.length} from file and ${
      duplicates.length
    }. Left ${cleanFileList.length}`
  );

  return cleanFileList;
};
