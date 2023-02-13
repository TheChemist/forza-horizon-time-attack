import { Dialog, Transition } from "@headlessui/react";
import { Car, Entry, User } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import CardComponent from "../../components/component.card";
import PerformanceIndex from "../../components/component.performance.index";
import formatTime from "../../utils/timeformat";
import { trpc } from "../../utils/trpc";
import TableComponent from "../../components/component.table";
import { HashLoader } from "react-spinners";

export default function TrackPage() {
  const router = useRouter();
  const id: number = Number(router.query.id);

  const track = trpc.tracks.getByIdIncludeRelations.useQuery(id);

  const columnHelper = createColumnHelper<Entry & { user: User; car: Car }>();

  function header(input: string) {
    return <div className="flex text-xl dark:text-white">{input}</div>;
  }

  const columns = [
    columnHelper.display({
      id: "user.id",
      header: () => header("User"),
      cell: (props) => (
        <Link href={"/users/" + props.row.original.userId}>
          {props.row.original.user.name}
        </Link>
      ),
    }),

    columnHelper.accessor("car.make", {
      header: () => header("Car Manufacturer"),
    }),
    columnHelper.accessor("car.model", {
      header: () => header("Car Model"),
    }),
    columnHelper.accessor("car.year", {
      header: () => header("Car Year"),
    }),
    columnHelper.accessor("drivetrain", {
      header: () => header("Drivetrain"),
    }),
    columnHelper.accessor("buildType", {
      header: () => header("Build Type"),
    }),
    columnHelper.accessor("performancePoints", {
      header: () => header("Performance Points"),
      cell: (props) => PerformanceIndex(props.row.original.performancePoints),
    }),
    columnHelper.accessor((row) => formatTime(row.time), {
      id: "readableTime",
      header: () => header("Time"),
    }),
    columnHelper.accessor("shareCode", {
      header: () => header("Share Code"),
    }),
  ];

  return (
    <div className="container mx-auto">
      <div className="flex flex-col">
        {track.data && (
          <div className="flex flex-row pb-10">
            <div>
              <img
                src={"/" + track.data.category + " " + track.data.type + ".png"}
                alt={track.data.category + " " + track.data.type}
                className="mx-auto h-full w-12 self-baseline object-contain"
              />
            </div>
            <div className="basis-2/3">
              <div className="flex flex-col">
                <div className="mx-auto text-xl font-semibold dark:text-white">
                  {track.data.name}
                </div>
                <div className="mx-auto dark:text-white">
                  {track.data.category} - {track.data.type}{" "}
                  {track.data.length && "(" + track.data.length + " km)"}
                </div>
                {track.data.shareCode && (
                  <div className="mx-auto dark:text-white">
                    Sharecode: {track.data.shareCode}
                  </div>
                )}
              </div>
            </div>
            <div className="basis-1/3">
              {CardComponent(
                <button
                  type="button"
                  onClick={() => router.push("/" + id + "/add-entry")}
                  className="h-full w-full rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 dark:text-white"
                >
                  Add Time
                </button>
              )}
            </div>
          </div>
        )}

        <div>
          {TableComponent({
            data: track.data ? track.data.entries : [],
            columns: columns,
          })}
        </div>
      </div>
    </div>
  );
}
