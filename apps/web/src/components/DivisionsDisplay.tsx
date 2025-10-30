import React from "react";
import { useAuth } from "./AuthProvider";
import { useTeamMembers } from "../hooks/TeamMembersHooks";
import MemberCard from "./MemberCard";

const DivisionsDisplay: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const {
    data: teamMembers,
    isLoading: isTeamMembersLoading,
    isSuccess: isTeamMembersSuccess,
  } = useTeamMembers();
  const {
    data: divisions,
    isLoading: isDivisionsLoading,
    isSuccess: isDivisionsSuccess,
  } = useTeamMembers();

  const isSuccess = isTeamMembersSuccess && isDivisionsSuccess;
  const isLoading = isTeamMembersLoading || isDivisionsLoading;
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isSuccess && (
        <div>
          <h2 className="text-4xl font-bold text-secondary mb-6 text-center">
            Notre Équipe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default DivisionsDisplay;
