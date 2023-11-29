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
        <thead>
          <tr>
            <th>Tasks</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos && todos.length > 0 ? (
            todos.map((task) => <Task key={task.id} task={task} />)
          ) : (
            <tr>
              <td colSpan={4} className="py-4 text-center">
                <span className="text-lg italic text-gray-500">
                  There are no todos yet.
                </span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
