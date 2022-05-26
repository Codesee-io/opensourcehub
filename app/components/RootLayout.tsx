import type { FC } from "react";
import { UserInfo } from "~/types";
import Footer from "./Footer";
import Header from "./Header";

type Props = {
  userInfo: UserInfo;
};

const RootLayout: FC<Props> = ({ children, userInfo }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header userInfo={userInfo} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;
