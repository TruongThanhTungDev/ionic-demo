export class Plugin {
  public formatNumber(number: any) {
    return number ? number.toLocaleString("vi-VN") : 0;
  }
}
