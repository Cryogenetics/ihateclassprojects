import {useLoaderData} from "react-router";
import {Outlet} from "@remix-run/react";
import {getUser} from "~/routes/middleware/auth.middleware";
import {LoaderFunctionArgs} from "@remix-run/node";
import {Navbar} from "@heroui/navbar";
import AppNavbar from "~/components/AppNavbar";

export const loader = async ({request} : LoaderFunctionArgs) => {
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



