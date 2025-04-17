import {useLoaderData} from "react-router";
import {Outlet} from "@remix-run/react";
export const loader = async () => {
  console.log("main page");
  return "main";
}


export default function Index() {
  const data = useLoaderData();
  console.log(data, " this is in the client")
  return <Outlet/>;
}

