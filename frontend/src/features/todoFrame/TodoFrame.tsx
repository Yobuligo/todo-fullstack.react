import { useContext, useEffect, useState } from "react";
import { TodoDAO } from "../../api/TodoDAO";
import { LoadingSpinner } from "../../components/loadingSpinner/LoadingSpinner";
import { AppContext } from "../../context/AppContext";
import { IDataAccessObject } from "../../services/IDataAccessObject";
import { ITodo } from "../../shared/model/ITodo";
import { TodoAdd } from "../todoAdd/TodoAdd";
import { TodoList } from "../todoList/TodoList";
import styles from "./TodoFrame.module.css";

class Poll<TData, TDataAccessObject extends IDataAccessObject<any>> {
  private needsInit = true;

  constructor(
    private readonly dao: TDataAccessObject,
    private readonly daoRequest: (dao: TDataAccessObject) => Promise<TData>,
    private readonly handler: (data: TData) => void
  ) {}

  onPoll() {
    if (this.needsInit) {
      this.reload();
      this.needsInit = false;
    }

    setTimeout(async () => {
      const isOutdated = await this.dao.isOutdated();
      if (isOutdated) {
        this.reload();
      }
      this.onPoll();
    }, 1000);
  }

  async reload() {
    const data = await this.daoRequest(this.dao);
    this.handler(data);
  }
}

const onPoll = <TData, TDataAccessObject extends IDataAccessObject<any>>(
  dao: TDataAccessObject,
  daoRequest: (dao: TDataAccessObject) => Promise<TData>,
  handler: (data: TData) => void
): void => {
  new Poll(dao, daoRequest, handler).onPoll();
};

export const TodoFrame: React.FC = () => {
  const [hasError, setHasError] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const context = useContext(AppContext);

  const request = async (block: () => void) => {
    try {
      setShowLoadingSpinner(true);
      await block();
      setShowLoadingSpinner(false);
    } catch (error) {
      setHasError(true);
    }
  };

  useEffect(() => {
    onPoll(
      TodoDAO,
      (dao) => dao.findAll(),
      (envelope) => {
        context.todos.setDataObjects(envelope.data);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const reload = useCallback(async () => {
  //   const envelope = await TodoDAO.findAll();
  //   context.todos.setDataObjects(envelope.data);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const poll = useCallback(async () => {
  //   setTimeout(async () => {
  //     const isOutdated = await TodoDAO.isOutdated();
  //     if (isOutdated) {
  //       reload();
  //     }
  //     poll();
  //   }, 1000);
  // }, [reload]);

  // useInitialize(async () => {
  //   reload();
  // });

  // useEffect(() => {
  //   poll();
  // }, [poll]);

  const onAddTodo = async (text: string) => {
    request(async () => {
      const todo = await TodoDAO.add({ text, completed: false });
      context.todos.onAdd(todo);
    });
  };

  const onDeleteTodo = async (todo: ITodo) => {
    request(async () => {
      const success = await TodoDAO.delete(todo);
      if (success) {
        context.todos.onDelete(todo);
      }
    });
  };

  return (
    <div className={styles.todoFrame}>
      {hasError && <p style={{ color: "red" }}>Error when loading data</p>}
      <TodoAdd onAddTodo={onAddTodo} />
      {showLoadingSpinner && <LoadingSpinner />}
      <TodoList todos={context.todos.dataObjects} onDeleteTodo={onDeleteTodo} />
    </div>
  );
};
