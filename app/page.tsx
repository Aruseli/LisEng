// Imports for getting server-side session

import { SidebarLayout } from "hasyx/components/sidebar/layout";
import sidebar from "@/app/sidebar";
import pckg from "@/package.json";
import EnglishLearningApp from "@/components/AppPage";

// Now this is an async server component
export default function Page() {
  return (
    <EnglishLearningApp />
  );
}
