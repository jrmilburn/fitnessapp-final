import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"
import ActivityList from "./components/ActivityList"
import { prisma } from "../../lib/prisma";

export default async function Activities() {

    const session = await getServerSession(authOptions);

    const activities = await prisma.activity.findMany({
        where: {
            userId: session.user.id
        }
    })

    return (
        <div>
            <h2>Activities</h2>
            <ActivityList 
                initialActivities={activities}
            />
        </div>
    )

}