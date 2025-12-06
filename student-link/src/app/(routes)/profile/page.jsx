import {auth, signOut} from "@/auth";
import {redirect} from "next/navigation";


export default async function Profile() {
    const session = await auth()
    if(!session)redirect("/")
    const user = session?.user //User will have these fields to display:  {email, id, username, firstName, lastName, school, major}

    return (
        <div>
            <form
                action={async (formData) => {
                    "use server"

                    await signOut()
                }}
            >
                <button>Sign out</button>
                </form>
            <pre>{JSON.stringify(user, null, 2)}</pre>
                <div>{user.email}</div>
                <div>{user.name}</div>
        </div>
);
}
