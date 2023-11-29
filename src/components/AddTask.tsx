"use client";

import { AiOutlinePlus } from "react-icons/ai";
import Modal from "./Modal";
import { FormEventHandler, useState } from "react";
import { useSession } from "next-auth/react";
import { api, type RouterOutputs } from "../utils/api";

const AddTask = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newTaskValue, setNewTaskValue] = useState<string>("");
  const [newTaskDescription, setNewTaskDescription] = useState<string>("");

  const { data: sessionData } = useSession();

  const { refetch: refetchTopics } = api.todos.getAll.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
    }
  );
  const createTodo = api.todos.create.useMutation({
    onSuccess: () => {
      void refetchTopics();
    },
  });
  const handleSubmitNewTodo: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    createTodo.mutate({
      content: newTaskValue,
      description: newTaskDescription,
    });
    setNewTaskValue("");
    setNewTaskDescription("");
    setModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className="btn btn-primary w-full text-white"
      >
        Add new task <AiOutlinePlus className="ml-2" size={18} />
      </button>

      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <form onSubmit={handleSubmitNewTodo}>
          <h3 className="text-lg font-bold ">Add new task</h3>
          <div className="modal-action flex flex-col items-center gap-3">
            <input
              value={newTaskValue}
              onChange={(e) => setNewTaskValue(e.target.value)}
              type="text"
              placeholder="Type here"
              className="input input-bordered ml-[8px] w-full"
            />
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Type your task's description"
              className="textarea textarea-bordered w-full "
            />
            <button type="submit" className="btn ">
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddTask;
