export const download = (
  data,
  fileName = 'excel.xlsx',
  id = 'downloadExcel',
) => {
  if (!data) {
    return;
  }
  let url;
  let blob;
  const isString = typeof data === 'string';
  if (!isString) {
    blob = new Blob([data], {
      type: 'application/octet-stream', // 下载的文件类型格式（二进制流，不知道下载文件类型可以设置为这个）, 具体请查看HTTP Content-type 对照表
    });
    url = window.URL.createObjectURL(blob);
  } else {
    url = data;
  }
  if (!isString && window.navigator.msSaveBlob) {
    try {
      window.navigator.msSaveBlob(blob, fileName);
    } catch (e) {
      console.log(e);
    }
  } else {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.id = 'downloadExcel';
    // if (!isString) {
    link.setAttribute('download', fileName);
    // }
    document.body.appendChild(link);
    link.click();
    const el = document.querySelector(`#${id}`);
    el.parentNode.removeChild(el);
    if (!isString) {
      URL.revokeObjectURL(url); // 释放掉blob对象
    }
  }
};
