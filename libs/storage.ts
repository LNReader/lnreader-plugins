import fs from "fs";
import path from "path";

const dbPath = path.join(__dirname, "..", "..", "db.json");

class Storage {
  db: Record<
    string,
    Record<string, { created: Date; value: any; expires?: Date }>
  >;

  constructor() {
    this.db = this.loadDB();
  }

  /**
   * Set a value in the storage
   * @param pluginID - The ID of the plugin
   * @param key - The key to store the value under
   * @param value - The value to store
   * @param expires - Optional expiration date for the value
   * @returns true if successful
   */
  set(
    pluginID: string,
    key: string,
    value: any,
    expires?: Date | number,
  ): boolean {
    if (!this.db[pluginID]) this.db[pluginID] = {};
    this.db[pluginID][key] = {
      created: new Date(),
      value,
      expires:
        expires instanceof Date
          ? expires
          : typeof expires === "number"
          ? new Date(expires)
          : undefined,
    };
    this.saveDB();
    return true;
  }

  /**
   * Get a value from the storage
   * @param pluginID - The ID of the plugin
   * @param key - The key of the value to retrieve
   * @param raw - Optional flag to return the raw stored data
   * @returns the stored value or undefined if not found
   */
  get(pluginID: string, key: string, raw?: boolean): any {
    const item = this.db[pluginID]?.[key];
    if (item?.expires && Date.now() > item.expires.getTime()) {
      this.delete(pluginID, key);
      return undefined;
    }
    return raw ? item : item?.value;
  }

  /**
   * Get all keys stored under a pluginID
   * @param pluginID - The ID of the plugin
   * @returns an array of keys
   */
  getAllKeys(pluginID: string): string[] {
    return Object.keys(this.db[pluginID] || {});
  }

  /**
   * Delete a key and its value from the storage
   * @param pluginID - The ID of the plugin
   * @param key - The key of the value to delete
   * @returns true if successful
   */
  delete(pluginID: string, key: string): boolean {
    delete this.db[pluginID]?.[key];
    this.saveDB();
    return true;
  }

  /**
   * Remove all keys and values stored under a pluginID
   * @param pluginID - The ID of the plugin
   * @returns true if successful
   */
  clearAll(pluginID: string): boolean {
    delete this.db[pluginID];
    this.saveDB();
    return true;
  }

  private saveDB() {
    fs.writeFileSync(dbPath, JSON.stringify(this.db, null, 2));
  }

  private loadDB() {
    try {
      const data = fs.readFileSync(dbPath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error loading storage file:", error);
      return Object();
    }
  }
}

export const storage = new Storage();

/*
These parameters cannot be implemented in `test-web`. 
They are generated in the browser when js-scripts are executed
Read more

https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
*/

interface StorageObject {
  [key: string]: string;
}

class LocalStorage {
  db: Record<string, StorageObject>;

  constructor() {
    this.db = { RLIB: { token: "sha256" } };
  }

  get(pluginID: string): StorageObject | undefined {
    return this.db[pluginID];
  }
}

export const localStorage = new LocalStorage();
export const sessionStorage = new LocalStorage();
