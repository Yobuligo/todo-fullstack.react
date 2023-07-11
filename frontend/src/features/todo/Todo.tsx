import { Card } from "../../components/card/Card";
import { TodoDelete } from "../todoDelete/TodoDelete";
import { ITodoProps } from "./ITodoProps";

export const Todo: React.FC<ITodoProps> = (props) => {
  const onDelete = () => props.onDeleteTodo(props.todo);
  return (
    <Card>
      <div>{props.todo.text}</div>
      <div>
        <TodoDelete onDelete={onDelete} />
      </div>
    </Card>
  );
};
