import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import FormPage from "../pages/form/form-page";

const routes = {
  "/": new HomePage(),
  "/about": new AboutPage(),
  "/form": new FormPage(),
};

export default routes;
