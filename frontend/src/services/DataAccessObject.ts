import { IRepository } from "../shared/api/IRepository";
import { IEntity } from "../shared/types/IEntity";
import { IEntityDetails } from "../shared/types/IEntityDetails";

export abstract class DataAccessObject<T extends IEntity>
  implements IRepository<T>
{
  constructor(private readonly path: string) {}

  add(dataObject: IEntityDetails<T>): Promise<T> {
    return this.createPromise(async (resolve) => {
      const response = await fetch(this.url, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataObject),
      });
      resolve(await response.json());
    });
  }

  delete(dataObject: T): Promise<boolean> {
    return this.deleteById(dataObject.id);
  }

  deleteById(id: number): Promise<boolean> {
    return this.createPromise(async (resolve) => {
      const response = await fetch(`${this.url}/${id}`, {
        method: "DELETE",
        mode: "cors",
      });
      resolve(await response.json());
    });
  }

  findAll(): Promise<T[]> {
    return this.createPromise(async (resolve) => {
      const response = await fetch(this.url);
      if (!response.ok){
        console.log(`Error when sending request to '${response.url}'`)
      }
      resolve(await response.json());
    });
  }

  private get url(): string {
    return `http://localhost:5000${this.path}`;
  }

  private createPromise<T>(
    block: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void
  ): Promise<T> {
    return new Promise(async (resolve, reject) => {
      try {
        await block(resolve, reject);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}
