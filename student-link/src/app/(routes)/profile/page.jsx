import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignOutButton from "./SignOutButton";

export default async function Profile() {
    const session = await auth();
    if (!session) redirect("/");

    const user = session.user;

    return (
        <div>
            <SignOutButton />

            <pre>{JSON.stringify(user, null, 2)}</pre>
            <div>{user.email}</div>
            <div>{user.name}</div>
        </div>
    );
}
