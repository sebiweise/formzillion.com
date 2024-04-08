import { isEmpty } from "lodash";
import prisma from "@/lib/prisma";

const teamIdToTeamSlugMap = {} as { [key: string]: string };

export const getTeamSlug = async ({ teamId }: { teamId: string }) => {
  if (isEmpty(teamIdToTeamSlugMap)) {
    const teams = await prisma.teams.findMany();
    teams.forEach((t: any) => (teamIdToTeamSlugMap[t.id] = t.slug));
  } else {
    const singleTeam = await prisma.teams.findFirstOrThrow({
      where: {
        id: teamId
      }
    });
    teamIdToTeamSlugMap[teamId] = singleTeam.slug;
  }

  return teamIdToTeamSlugMap;
};

export default getTeamSlug;
