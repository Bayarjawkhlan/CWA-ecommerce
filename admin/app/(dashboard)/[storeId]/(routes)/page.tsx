import { db } from "@/libs/db";
import { formatter } from "@/libs/utils";

import Heading from "@/components/Heading";
import { Separator } from "@/components/ui/Separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

import { CreditCard, DollarSign, Package } from "lucide-react";
import getTotalRevenue from "@/actions/getTotalRevenue";
import getSalesCount from "@/actions/getSalesCount";
import getStockCount from "@/actions/getStockCount";
import Overview from "@/components/Overview";
import getGraphRevenue from "@/actions/getGraphRevenue";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const DashboardPage = async ({ params }: { params: { storeId: string } }) => {
  const totalRevenue = await getTotalRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getStockCount(params.storeId);
  const graphData = await getGraphRevenue(params.storeId);

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />

        <Separator />

        <div className="flex flex-col gap-4 navbar:grid navbar:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue as number)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">+ {salesCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Products in Stock
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>

          <Card className="col-span-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overview</CardTitle>
            </CardHeader>

            <CardContent>
              <Overview data={graphData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
