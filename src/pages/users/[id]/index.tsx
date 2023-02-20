import type { Car, Entry, Track } from "@prisma/client";
import type { Row } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import TableComponent from "../../../components/component.table";
import { trpc } from "../../../utils/trpc";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import CardComponent from "../../../components/component.card";
import { useSession } from "next-auth/react";
import PerformanceIndex from "../../../components/component.performance.index";
import { formatTime } from "../../../utils/timeformat";

const ProfilePage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const id = String(router.query.id);
  const user = trpc.users.getByIdIncludeRelations.useQuery(id);
  const deleteEntry = trpc.entries.delete.useMutation();

  const columnHelper = createColumnHelper<Entry & { track: Track; car: Car }>();

  function header(input: string) {
    return <div className="flex text-xl dark:text-white">{input}</div>;
  }

  function handleDelete(row: Row<Entry & { track: Track; car: Car }>) {
    const entryId: number = row.original.id;
    deleteEntry.mutate(entryId);
    // TODO refresh page
  }

  const columns = [
    columnHelper.accessor("track.name", {
      header: () => header("Track"),
      cell: (props) => (
        <Link href={"/" + props.row.original.trackId}>
          {props.row.original.track.name}
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

  if (user.data?.id == sessionData?.user?.id) {
    columns.push(
      columnHelper.display({
        id: "actions",
        header: () => header("Actions"),
        cell: (props) => (
          <div className="flex flex-row">
            {CardComponent(
              <button
                className="mx-auto h-full w-full"
                onClick={() => handleDelete(props.row)}
              >
                <TrashIcon className="mx-auto h-6" />
              </button>
            )}
            {CardComponent(
              <button
                className="mx-auto h-full w-full"
                onClick={() =>
                  router.push("/entries/" + props.row.original.id + "/edit")
                }
              >
                <PencilIcon className="mx-auto h-6" />
              </button>
            )}
          </div>
        ),
      })
    );
  }

  return (
    <div className="container mx-auto flex flex-col justify-items-center">
      <div className="mx-auto pb-10">
        <img
          src={user.data?.image ?? ""}
          className="mx-auto w-40 rounded-full"
        />
        <h1 className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-center text-3xl font-extrabold text-transparent">
          {user.data?.name ?? ""}
        </h1>
      </div>
      {TableComponent({
        data: user.data ? user.data.entries : [],
        columns: columns,
      })}
    </div>
  );
};

export default ProfilePage;
