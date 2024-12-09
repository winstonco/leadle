type DataModel = {
  nyt: {
    wordle: {
      score: any;
    };
  };
};

class Data {
  private readonly TEMP_SYNC_STORAGE: Record<string, any> = {
    uid: '12345',
  };

  getUser(): string {
    return this.TEMP_SYNC_STORAGE.uid;
  }

  async getData(fields: string | string[] | null): Promise<any> {
    try {
      const data = await chrome.storage.local.get(fields);
      return data;
    } catch (e) {
      console.error(`Error getData: ${e}`);
    }
  }

  async setData(field: string, newValue: any): Promise<void> {
    await chrome.storage.local.set({ [field]: newValue });
  }
}

export const DATA_ACCESS = new Data();
