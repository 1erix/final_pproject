import Header from "./ui/header";
import css from './index.module.css'
import Footer from "./ui/footer";

export const Layout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <div className={css.page}>
            <Header />
            {children}
            <Footer />
        </div>
    )
}