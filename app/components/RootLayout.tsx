import type { FC } from "react";
import Footer from "./Footer";
import Header from "./Header";

type Props = {
  isLoggedIn: boolean;
};

const RootLayout: FC<Props> = ({ children, isLoggedIn }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;
