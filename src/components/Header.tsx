import { signOut, useSession } from "next-auth/react";

export const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="navbar bg-primary text-white shadow-lg">
      <div className="flex-1 pl-5 text-2xl font-bold md:text-3xl">
        {sessionData?.user?.name ? `Hi, ${sessionData.user.name}` : ""}
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          {sessionData?.user && (
            <label
              tabIndex={0}
              className="avatar btn btn-circle btn-ghost"
              onClick={() => void signOut()}
            >
              <div className="w-10 rounded-full">
                <img
                  src={sessionData?.user?.image ?? ""}
                  alt={sessionData?.user?.name ?? ""}
                />
              </div>
            </label>
          )}
        </div>
      </div>
    </div>
  );
};
