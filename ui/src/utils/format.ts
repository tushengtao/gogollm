// 示例方法，没有实际意义
export function trim(str: string) {
  return str.trim();
}


export function  formatDate(date: Date): string {
  // 使用Date对象的方法获取年、月、日、小时、分钟和秒
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份是从0开始的，所以+1
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  // 拼接成指定的字符串格式
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
