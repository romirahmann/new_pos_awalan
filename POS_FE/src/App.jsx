import { useEffect } from "react";
import { connectSocket } from "./services/socket.service";
import { AlertProvider } from "./store/AlertContext";
import { router } from "./routes/Routes";
import { RouterProvider } from "@tanstack/react-router";

function App() {
  useEffect(() => {
    connectSocket();
  }, []);

  return (
    <>
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
    </>
  );
}

export default App;
