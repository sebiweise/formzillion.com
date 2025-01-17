import { BadgeCheckIcon } from "lucide-react";
import { Metadata } from "next";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // no caching

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

const checkDatabaseConnection = async () => {
    try {
        await prisma.$queryRaw`SELECT 1`;
    } catch (e) {
        throw new Error("Database could not be reached");
    }
};

export default async function HealthPage() {
    await checkDatabaseConnection();

    return (
        <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center text-center">
            <BadgeCheckIcon height={40} color="green" />
            <p className="text-md mt-4 font-bold text-zinc-900">All systems are up and running</p>
        </div>
    );
}