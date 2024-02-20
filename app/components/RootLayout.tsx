import type { FC } from "react";
import { UserInfo } from "~/types";
import Footer from "./Footer";
import Header from "./Header";

type Props = {
  userInfo: UserInfo | null;
};

const RootLayout: FC<Props> = ({ children, userInfo }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header userInfo={userInfo} />
      <div className="p-2 text-center bg-white text-light-type border-b border-light-border">
        Open Source Hub is shutting down on February 22, 2024.
      </div>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;
