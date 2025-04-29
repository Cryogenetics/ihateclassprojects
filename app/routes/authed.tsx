import {useLoaderData} from "react-router";
import {Outlet} from "@remix-run/react";
import {getUser} from "~/routes/middleware/auth.middleware";
import {LoaderFunctionArgs} from "@remix-run/node";
import AppNavbar from "~/components/AppNavbar";
import {redirect} from "@remix-run/router";

export const loader = async ({request} : LoaderFunctionArgs) => {
  if(request.url.endsWith("/authed") || request.url.endsWith("/authed/")) {
    return redirect("/authed/appointments");
  }
  return await getUser(request);
}


export default function Index() {
  const data = useLoaderData();
  console.log(data, " this is in the client")
  return (
    <div className="flex flex-col h-screen">
      <AppNavbar />
      <Outlet/>
    </div>);
}

