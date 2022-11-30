import About from "../pages/About";
import Auth from "../pages/Auth";
import Account from "../pages/Account";
import Home from "../pages/Home";


export const privateRoutes = [
    {path: '/about', component: About, exact: true},
    {path: '/account', component: Account, exact: true},
    {path: '/', component: Home, exact: true},
]



export const publicRoutes = [
    {path: '/auth', component: Auth, exact: true},
]
