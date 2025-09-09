"use client";
import { createContext, useState } from "react";

export const DataContext = createContext();

export function DataContextProvider(props) {
  /*  const [user, setUser] = useState({
    user: "",
    password: "",
    name: "",
    last_name: "",
  }); */
  const [name, setName] = useState("");
  const valor = { name, setName };
  return (
    <DataContext.Provider value={valor}>{props.children}</DataContext.Provider> // https://www.youtube.com/watch?v=dmxVjrSdOAY
  );
}
