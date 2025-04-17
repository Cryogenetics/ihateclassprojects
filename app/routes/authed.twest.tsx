import {useLoaderData} from "react-router";

export const loader = async () => {
  console.log("test page");
  return "test";
}


export default function IndexT() {
  const data = useLoaderData();
    console.log(data, " this is in the client")
  return (
    <div className="flex h-screen items-center justify-center">
      text
    </div>
  );
}

