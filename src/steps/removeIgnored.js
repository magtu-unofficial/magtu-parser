export default (fileList, ignore) => {
  const cleanFileList = [];
  let ignored = 0;
  for (const file of fileList) {
    if (ignore.indexOf(file.file) == -1) {
      cleanFileList.push(file);
    } else {
      ignored += 1;
    }
  }
  console.log(
    `Ignored ${ignored}/${ignore.length}. Left ${cleanFileList.length}`
  );
  return cleanFileList;
};
