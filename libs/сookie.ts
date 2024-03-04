import { CookieJar, Cookie } from "tough-cookie";

interface Cookies {
  [key: string]: CookieObject;
}

interface CookieObject {
  name: string;
  value: string;
  path?: string;
  domain?: string;
  version?: string;
  expires?: string;
  secure?: boolean;
  httpOnly?: boolean;
}

class CookieManager {
  private cookieJar: CookieJar;

  constructor() {
    this.cookieJar = new CookieJar();
  }

  /**
   * Gets cookies for the specified URL.
   * @param url - The URL for which to retrieve cookies.
   * @returns Cookie objects.
   */
  async get(url: string): Promise<Cookies> {
    const cookies = await this.cookieJar.getCookies(url);
    const result: Cookies = {};
    cookies.forEach(
      (cookie) =>
        result[cookie.key] = { ...cookie.toJSON(), name: cookie.key } as CookieObject
    );
    return result;
  }

  /**
   * Sets cookies for the specified URL.
   * @param url - The URL for which to set cookies.
   * @param cookieObject - The cookie object to set.
   */
  async set(url: string, cookieObject: CookieObject): Promise<void> {
    const cookie = Cookie.fromJSON({ ...cookieObject, key: cookieObject.name });
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
    allCookies.forEach(
      (cookie) => (cookie.expires = new Date(0)), // Expire each cookie to delete it
    );
  }
}

export const cookieManager = new CookieManager();
