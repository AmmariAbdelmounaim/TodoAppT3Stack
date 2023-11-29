"use client";
import React from "react";
import Task from "./Task";
import { api, type RouterOutputs } from "../utils/api";
import { useSession } from "next-auth/react";

const TodoList = ({ tasks }: { tasks: RouterOutputs["todos"]["getAll"] }) => {
  const { data: sessionData } = useSession();
  const { data: todos } = api.todos.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
    initialData: tasks,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            <th>Tasks</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos?.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
