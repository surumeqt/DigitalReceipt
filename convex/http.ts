import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
    path:"/clerk-webhooks",
    method: "POST",
    handler: httpAction (async (ctx, request) => {
        const webhook = process.env.CLERK_WEBHOOK_SECRET;

        if(!webhook) {
            throw new Error("Webhook not found");
        }

        const svix_id = request.headers.get("svix-id");
        const svix_signature = request.headers.get("svix-signature");
        const svix_timestamp = request.headers.get("svix-timestamp");

        if(!svix_id || !svix_signature || !svix_timestamp) {
            return new Response ("Missing headers", {status: 400});
        }

        const payload = await request.json();
        const body = JSON.stringify(payload);

        const wh = new Webhook( webhook );
        let evt:any;

        try {
            evt = wh.verify( body, {
                "svix_id": svix_id,
                "svix_signature": svix_signature,
                "svix_timestamp": svix_timestamp,
            }) as any;
        } catch (e) {
            return new Response("Invalid signature", {status: 400});
        }

        const event = evt.event;

        if (event === "user.created") {
            const { password, email, image, clerkID } = evt.data;
            const username = email.split("@")[0];

            try {
                console.log("Creating user in Convex:", { email: email, username: email.split("@")[0], clerkID });
            
                await ctx.runMutation(api.users.createUser, {
                    email,
                    username,
                    password,
                    image,
                    clerkID,
                });
            
                console.log("User successfully created in Convex.");
            } catch (error) {
                console.error("Error creating user in Convex:", error);
                return new Response("Error creating user", { status: 500 });
            }
            
        }

        return new Response("Webhook received", {status: 200});

    })
});

export default http;
