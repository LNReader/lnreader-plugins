import fs from "fs";
import path from "path";

// Define the path to the JSON storage file
const dbPath = path.join(__dirname, "..", "..", "db.json");

/**
 * Represents a storage system with methods for setting, getting, and deleting key-value pairs.
 */
class Storage {
  private db: Record<
    string,
    Record<string, { created: Date; value: any; expires?: Date }>
  >;

  /**
   * Initializes a new instance of the Storage class.
   */
  constructor() {
    this.db = this.loadDB();
  }

  /**
   * Sets a key-value pair in the storage.
   *
   * @param pluginID - The ID of the plugin.
   * @param key - The key to set.
   * @param value - The value to set.
   * @param expires - Optional. The expiration date for the key-value pair.
   */
  set(
    pluginID: string,
    key: string,
    value: any,
    expires?: Date | number,
  ): void {
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
  }

  /**
   * Gets the value associated with a key from the storage.
   *
   * @param pluginID - The ID of the plugin.
   * @param key - The key to retrieve.
   * @param raw - Optional. If true, returns the raw storage item object.
   * @returns The value associated with the key or undefined if not found or expired.
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
   * Gets all keys associated with a plugin from the storage.
   *
   * @param pluginID - The ID of the plugin.
   * @returns An array of keys associated with the plugin.
   */
  getAllKeys(pluginID: string): string[] {
    return Object.keys(this.db[pluginID] || {});
  }

  /**
   * Deletes a key from the storage.
   *
   * @param pluginID - The ID of the plugin.
   * @param key - The key to delete.
   */
  delete(pluginID: string, key: string): void {
    delete this.db[pluginID]?.[key];
    this.saveDB();
  }

  /**
   * Clears all keys associated with a plugin from the storage.
   *
   * @param pluginID - The ID of the plugin.
   */
  clearAll(pluginID: string): void {
    delete this.db[pluginID];
    this.saveDB();
  }

  /**
   * Saves the storage data to the JSON file.
   */
  private saveDB() {
    fs.writeFileSync(dbPath, JSON.stringify(this.db, null, 2));
  }

  /**
   * Loads the storage data from the JSON file.
   */
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

// Export a singleton instance of the Storage class
export const storage = new Storage();

/*
These parameters cannot be implemented in `test-web`. 
They are generated in the browser when js-scripts are executed
Read more

https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
*/

/**
 * Represents the structure of a storage object with string keys and values.
 */
interface StorageObject {
  [key: string]: string | undefined;
}

/**
 * Represents a simplified version of the browser's localStorage.
 */
class LocalStorage {
  db: Record<string, StorageObject>;

  /**
   * Initializes a new instance of the LocalStorage class.
   */
  constructor() {
    this.db = {};
  }

  /**
   * Gets the storage object associated with a plugin ID.
   *
   * @param pluginID - The ID of the plugin.
   * @returns The storage object associated with the plugin ID.
   */
  get(pluginID: string): StorageObject | undefined {
    return this.db[pluginID] || {};
  }
}

// Export singleton instances of LocalStorage and sessionStorage
export const localStorage = new LocalStorage();
export const sessionStorage = new LocalStorage();
