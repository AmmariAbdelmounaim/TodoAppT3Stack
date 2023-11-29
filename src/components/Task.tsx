"use client";
import { FormEventHandler, useState } from "react";
import Modal from "./Modal";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { api, type RouterOutputs } from "../utils/api";

const Task = ({ task }: { task: RouterOutputs["todos"]["getAll"][0] }) => {
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<string>(task?.content);
  const [descriptionToEdit, setDescriptionToEdit] = useState<string>(
    task?.description
  );
  const { data: sessionData } = useSession();
  const { refetch: refetchTopics } = api.todos.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  const deleteTodo = api.todos.delete.useMutation({
    onSuccess: () => {
      void refetchTopics();
    },
  });
  const editTodo = api.todos.edit.useMutation({
    onSuccess: () => {
      void refetchTopics();
    },
  });
  const handleSubmitEditTodo: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    editTodo.mutate({
      id: task.id,
      content: taskToEdit,
      description: descriptionToEdit,
    });
    setOpenModalEdit(false);
  };

  const handleDeleteTask = () => {
    deleteTodo.mutate({
      id: task.id,
    });
    setOpenModalDeleted(false);
  };

  return (
    <tr key={task.id}>
      <td className="w-1/4">{task?.content}</td>
      <td className="w-1/4">{task?.description}</td>
      <td className="w-1/4">
        {task.done === true ? (
          <button
            className="btn btn-outline btn-success"
            onClick={() => {
              editTodo.mutate({
                id: task?.id,
                done: false,
              });
            }}
          >
            Complete
          </button>
        ) : (
          <button
            className="btn btn-outline btn-warning"
            onClick={() => {
              editTodo.mutate({
                id: task.id,
                done: true,
              });
            }}
          >
            Pending
          </button>
        )}
      </td>
      <td className="1/4 flex gap-5 ">
        <FiEdit
          onClick={() => setOpenModalEdit(true)}
          cursor="pointer"
          className="text-blue-500"
          size={25}
        />
        <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
          <form onSubmit={handleSubmitEditTodo}>
            <h3 className="text-lg font-bold">Edit task</h3>
            <div className="modal-action flex flex-col items-center gap-2">
              <input
                value={taskToEdit}
                onChange={(e) => setTaskToEdit(e.target.value)}
                type="text"
                placeholder="Type here"
                className="input input-bordered ml-[8px] w-full"
              />
              <textarea
                value={descriptionToEdit}
                onChange={(e) => setDescriptionToEdit(e.target.value)}
                placeholder="Type Description"
                className="textarea textarea-bordered w-full "
              />
              <button type="submit" className="btn">
                Submit
              </button>
            </div>
          </form>
        </Modal>
        <FiTrash2
          onClick={() => setOpenModalDeleted(true)}
          cursor="pointer"
          className="text-red-500"
          size={25}
        />
        <Modal modalOpen={openModalDeleted} setModalOpen={setOpenModalDeleted}>
          <h3 className="text-lg">
            Are you sure, you want to delete this task?
          </h3>
          <div className="modal-action">
            <button onClick={() => handleDeleteTask()} className="btn">
              Yes
            </button>
          </div>
        </Modal>
      </td>
    </tr>
  );
};

export default Task;
