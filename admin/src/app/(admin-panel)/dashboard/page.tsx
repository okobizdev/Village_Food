import { ContentLayout } from "@/components/admin-panel/content-layout";
import React from "react";
import AdminDashboard from "./dashboard";


export default async function Dashboard() {
  return (
    <ContentLayout title="Dashboard">
      <AdminDashboard />
    </ContentLayout>
  );
}
