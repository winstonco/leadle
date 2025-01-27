class Data {
  async getLocal(fields: string | string[] | null): Promise<any> {
    try {
      const data = await chrome.storage.local.get(fields);
      return data;
    } catch (e) {
      console.error(`Error getData: ${e}`);
    }
  }

  async setLocal(field: string, newValue: any): Promise<void> {
    await chrome.storage.local.set({ [field]: newValue });
  }
}

export const DATA_ACCESS = new Data();
