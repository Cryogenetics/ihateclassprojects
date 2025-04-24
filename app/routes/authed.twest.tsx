import {useLoaderData} from "react-router";
import {getUser, validateJWT} from "~/routes/middleware/auth.middleware";
import {LoaderFunctionArgs} from "@remix-run/node";
import {useRouteLoaderData} from "@remix-run/react";

export const loader = async ({request} : LoaderFunctionArgs ) => {
  const username = await getUser(request);
  return username;
}


export default function IndexT() {
  const data = useLoaderData();
    console.log(data, " this is in the client")
  return (
    <div className="flex h-screen items-center justify-center">
      {data}
    </div>
  );
}

