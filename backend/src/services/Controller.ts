import { Router } from "express";
import { IRepository } from "../shared/api/IRepository";
import { IEntity } from "../shared/types/IEntity";
import { IEntityDetails } from "../shared/types/IEntityDetails";
import { IEntityMeta } from "../shared/types/IEntityMeta";

export class Controller<T extends IEntity> {
  readonly router = Router();

  constructor(
    private readonly entityMeta: IEntityMeta,
    private readonly repository: IRepository<T>
  ) {
    this.version();
    this.delete();
    this.get();
    this.post();
  }

  private delete() {
    this.router.delete(`${this.entityMeta.path}/:id`, async (req, res) => {
      const data = await this.repository.deleteById(parseInt(req.params.id));
      if (data) {
        res.status(200).send(true);
      } else {
        res.status(404).send(false);
      }
    });
  }

  private get() {
    this.router.get(this.entityMeta.path, async (_, res) => {
      const data = await this.repository.findAll();
      res.status(200).send(data);
    });
  }

  private post() {
    this.router.post(this.entityMeta.path, async (req, res) => {
      const body: IEntityDetails<T> = { ...req.body };
      const data = await this.repository.add(body);
      res.status(201).send(data);
    });
  }

  private version() {
    this.router.get(`${this.entityMeta.path}/version`, (_, res) => {
      res.status(200).send(this.repository.version);
    });
  }
}
