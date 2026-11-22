import { StatContainer } from "./_components/stats/StatContainer";
import { UserOverviewChart } from "./_components/UserOverviewChart";
import { ActivityFeed } from "./_components/ActivityFeed";
import RecentUserTable from "./_components/RecentUserTable";

const DashboardPage = () => {
  return (
    <div className="lg:space-y-7 space-y-5 ">
      <StatContainer/>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <UserOverviewChart />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
      <RecentUserTable />
    </div>
  );
};

export default DashboardPage;
