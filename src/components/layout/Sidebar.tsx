import { supabase } from "@/lib/supabase";
import { LEARNING_PATH } from "@/lib/constants";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  patternFilter: string;
  setPatternFilter: (v: string) => void;
  user: any;
  onLoginClick: () => void;
}

export default function Sidebar({
  isOpen,
  setIsOpen,
  patternFilter,
  setPatternFilter,
  user,
  onLoginClick,
}: SidebarProps) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4 gap-4">
          <div className="px-2 flex justify-between items-center">
            <h1 className="font-extrabold text-2xl tracking-tight text-gray-900 hidden md:block">
              Pace<span className="text-blue-600">Code</span>.
            </h1>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1 text-gray-500"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 bg-gray-50 border-b border-gray-100 rounded-t-xl">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Patterns
              </h2>
            </div>
            <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar border-x border-b border-gray-100 rounded-b-xl">
              <button
                onClick={() => {
                  setPatternFilter("All");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  patternFilter === "All"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All Patterns
              </button>
              <div className="border-t border-gray-100 my-2 mx-2"></div>
              {LEARNING_PATH.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPatternFilter(p);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                    patternFilter === p
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100">
            {user ? (
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-500 truncate">Logged in as:</p>
                <p className="text-xs font-bold text-gray-800 truncate mb-2">
                  {user.email}
                </p>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="text-xs text-red-500 hover:underline text-left"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="w-full bg-blue-600 text-white py-2 rounded text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Log In / Sign Up
              </button>
            )}
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
