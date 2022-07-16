declare class MyServiceSdk {
  api: {
    CatsController: {
      findAll: (
        query: { age: Number, name: String },
        headers: { userId: String }
      ) => Promise<any>;
      uploadStuff: (
        params: { fileName: String }
      ) => Promise<any>;
    },
    DogsController: {
      getById: (
        params: { id: Number }
      ) => Promise<any>;
      findAll: () => Promise<any>;
      deleteStuff: () => Promise<any>;
    }
  };
}