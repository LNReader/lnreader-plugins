import { CookieJar, Cookie } from "tough-cookie";

interface CookieObject {
  name: string;
  value: string;
  path?: string;
  domain?: string;
  version?: string;
  expires?: string | Date;
  secure?: boolean;
  httpOnly?: boolean;
  key?: string;
}

class CookieManager {
  private cookieJar: CookieJar;

  constructor() {
    this.cookieJar = new CookieJar();
  }

  /**
   * Gets cookies for the specified URL.
   * @param url - The URL for which to retrieve cookies.
   * @returns An array of Cookie objects.
   */
  async get(url: string): Promise<CookieObject[]> {
    const cookies = (await this.cookieJar.getCookies(url)).map((cookie) => {
      const item = cookie.toJSON();
      item.name = item.key;
      delete item.key;

      return item as CookieObject;
    });
    return cookies;
  }

  /**
   * Sets cookies for the specified URL.
   * @param url - The URL for which to set cookies.
   * @param cookieObject - The cookie object to set.
   */
  async set(url: string, cookieObject: CookieObject): Promise<void> {
    cookieObject.key = cookieObject.name;
    const cookie = Cookie.fromJSON(cookieObject);
    if (cookie && cookie.key && cookie.value) {
      await this.cookieJar.setCookie(cookie, url);
    }
  }

  /**
   * Sets cookies from the response for the specified URL.
   * @param url - The URL for which to set cookies.
   * @param cookieStr - The cookie string from the response.
   */
  async setFromResponse(url: string, cookieStr: string): Promise<void> {
    await this.cookieJar.setCookie(cookieStr, url);
  }

  /**
   * Deletes a cookie with the specified name for the given URL.
   * @param url - The URL for which to delete the cookie.
   * @param cookieName - The name of the cookie to delete.
   */
  async delete(url: string, cookieName: string): Promise<void> {
    const cookies = await this.cookieJar.getCookies(url);
    cookies.forEach((cookie) => {
      if (cookie.key === cookieName) {
        cookie.expires = new Date(0); // Expire the cookie to delete it
      }
    });
  }

  /**
   * Deletes all cookies for the specified URL.
   * @param url - The URL for which to delete all cookies.
   */
  async clearAll(url: string): Promise<void> {
    const allCookies = await this.cookieJar.getCookies(url);
    allCookies.forEach((cookie) =>
      cookie.expires = new Date(0) // Expire each cookie to delete it
    );
  }
}

export const cookieManager = new CookieManager();
