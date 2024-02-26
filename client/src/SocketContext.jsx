import { createContext, useContext } from "react";
import io from "socket.io-client";


let backend_url = "http://localhost:8000/";
const socket = io(backend_url, {
  transports: ["websocket"],
});

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const socket = useContext(SocketContext);
  return socket;
};
