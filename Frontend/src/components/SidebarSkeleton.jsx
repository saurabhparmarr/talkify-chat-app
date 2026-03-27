import React from "react";
import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full p-4">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users />
          <span className="font-semibold">Contacts</span>
        </div>

        <div className="space-y-3">
          {skeletonContacts.map((_, index) => (
            <div
              key={index}
              className="h-10 bg-gray-300 animate-pulse rounded-md"
            ></div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SidebarSkeleton;