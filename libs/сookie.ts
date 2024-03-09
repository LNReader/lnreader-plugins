import { CookieJar, Cookie } from "tough-cookie";

/**
 * Represents a collection of cookies associated with specific URLs.
 */
interface Cookies {
  [key: string]: CookieObject;
}

/**
 * Represents the structure of a cookie.
 */
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

/**
 * Manages cookies using the tough-cookie library.
 */
class CookieManager {
  private cookieJar: CookieJar;

  /**
   * Initializes a new instance of the CookieManager class.
   */
  constructor() {
    this.cookieJar = new CookieJar();
  }

  /**
   * Retrieves cookies associated with the specified URL.
   *
   * @param url - The URL for which to retrieve cookies.
   * @returns A promise that resolves to a dictionary of cookies.
   */
  async get(url: string): Promise<Cookies> {
    const cookies = await this.cookieJar.getCookies(url);
    const result: Cookies = {};
    cookies.forEach(
      (cookie) =>
        (result[cookie.key] = { ...cookie.toJSON(), name: cookie.key } as CookieObject),
    );
    return result;
  }

  /**
   * Sets a cookie for the specified URL.
   *
   * @param url - The URL for which to set the cookie.
   * @param cookieObject - The cookie object to set.
   * @returns A promise that resolves when the cookie is set.
   */
  async set(url: string, cookieObject: CookieObject): Promise<void> {
    const cookie = Cookie.fromJSON({ ...cookieObject, key: cookieObject.name });
    if (cookie && cookie.key && cookie.value) {
      await this.cookieJar.setCookie(cookie, url);
    }
  }

  /**
   * Sets a cookie from a response string for the specified URL.
   *
   * @param url - The URL for which to set the cookie.
   * @param cookieStr - The cookie string from the response.
   * @returns A promise that resolves when the cookie is set.
   */
  async setFromResponse(url: string, cookieStr: string): Promise<void> {
    await this.cookieJar.setCookie(cookieStr, url);
  }

  /**
   * Deletes a cookie with the specified name for the specified URL.
   *
   * @param url - The URL for which to delete the cookie.
   * @param cookieName - The name of the cookie to delete.
   * @returns A promise that resolves when the cookie is deleted.
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
   * Clears all cookies for the specified URL.
   *
   * @param url - The URL for which to clear all cookies.
   * @returns A promise that resolves when all cookies are cleared.
   */
  async clearAll(url: string): Promise<void> {
    const allCookies = await this.cookieJar.getCookies(url);
    allCookies.forEach(
      (cookie) => (cookie.expires = new Date(0)), // Expire each cookie to delete it
    );
  }
}

/**
 * Export a singleton instance of the CookieManager class.
 */
export const cookieManager = new CookieManager();
