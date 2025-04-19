import {makeDBQuery} from "~/database";

export type user_example = {
    id: number;
    name: string;
    email: string;
    password: string;
    created_at: Date;
}



export type user_exclude_created_at = Omit<user_example, "created_at">;

// Example usage:
await makeDBQuery<user_example>("SELECT * FROM users").then(results=>{
    // now you get type completion ex. results[0].name
    if(results.length == 0) return;
    const result = results[0];
    console.log(result.created_at)
});