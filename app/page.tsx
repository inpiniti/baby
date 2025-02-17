"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Milk,
  Toilet,
  Baby,
  CirclePlus,
  Droplets,
  User,
  LoaderCircle,
  RefreshCcw,
  CalendarPlus,
  Bed,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { supabase } from "@/supabase/supabaseClient";

dayjs.extend(relativeTime);
import { useEffect, useState, useMemo } from "react";

type BabyRecord = {
  date: string;
  type: string;
  amount: number;
};

export default function Home() {
  const [list, setList] = useState<BabyRecord[]>([]);
  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = () => {
    fetchData();
  };

  const fetchData = async () => {
    const { data } = await supabase
      .schema("baby")
      .from("history")
      .select("*")
      .order("date", { ascending: false });

    if (data) {
      setList(data);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        베이비 로그
      </h1>
      <Profile />
      <div className="flex gap-4">
        <Day />
        <Week />
      </div>
      <div className="flex gap-4">
        <LastMilk list={list} />
        <LastPee list={list} />
      </div>
      <div className="flex gap-4">
        <LastPoop list={list} />
        <LastSleep list={list} />
      </div>
      <Statistics list={list} />
      <List list={list} onChange={handleChange} />
      <Add onChange={handleChange} />
    </div>
  );
}

const Profile = () => {
  const birthDate = "2024.12.17";
  return (
    <Card className="bg-zinc-950 text-zinc-50 flex-1 border-0 shadow-none">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-1">
            <Baby /> 정은찬 (鄭恩贊)
          </div>
        </CardTitle>
        <CardDescription className="text-zinc-300">
          영규니와 아름이의 첫째아들래미 귀염둥이입니다. 은혜/사랑할 은에
          도울/나아갈 찬이며, 갑진년 병자월 을묘일 임오시 푸른용의 해에 태어난
          아기입니다. <br />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-2">
          <div className="flex flex-col space-y-1.5 text-3xl font-bold">
            {birthDate}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Day = () => {
  const [daysSinceBirth, setDaysSinceBirth] = useState("");

  useEffect(() => {
    const birth = dayjs("2024-12-17", "YYYY-MM-DD");
    const now = dayjs();
    const diffDays = now.diff(birth, "day") + 1;
    const daysSinceBirth = `${diffDays}일`;
    setDaysSinceBirth(daysSinceBirth);
  }, []);

  return (
    <Card className="flex-1 bg-zinc-100 border-0 shadow-none">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-1">
            <CalendarPlus /> D-Day
          </div>
        </CardTitle>
        <CardDescription>태어난지</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{daysSinceBirth}</div>
      </CardContent>
    </Card>
  );
};

const Week = () => {
  const [weeksSinceBirth, setWeeksSinceBirth] = useState("");
  useEffect(() => {
    const birth = dayjs("2024-12-17", "YYYY-MM-DD");
    const now = dayjs();
    const diffWeeks = now.diff(birth, "week") + 1;
    const weeksSinceBirth = `${diffWeeks}주`;
    setWeeksSinceBirth(weeksSinceBirth);
  }, []);

  return (
    <Card className="flex-1 bg-zinc-100 border-0 shadow-none">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-1">
            <CalendarPlus /> D-Week
          </div>
        </CardTitle>
        <CardDescription>주로는</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{weeksSinceBirth}</div>
      </CardContent>
    </Card>
  );
};

const LastMilk = ({ list }: { list: BabyRecord[] }) => {
  const [lastMilk, setLastMilk] = useState("");

  useEffect(() => {
    calculateTime();
    const interval = setInterval(calculateTime, 60000); // 1분 = 60000밀리초

    return () => clearInterval(interval);
  }, [list]);

  const calculateTime = () => {
    if (Array.isArray(list)) {
      const updateLastRecord = (
        type: string,
        setLast: (value: string) => void
      ) => {
        const record = list.find((record) => record.type === type);
        if (record) {
          const diff = dayjs().diff(dayjs(record.date), "minute");
          const hours = Math.floor(diff / 60);
          const minutes = diff % 60;
          let timeString = "";
          if (hours > 0) {
            timeString += `${hours}시간 `;
          }
          timeString += `${minutes}분 `;

          setLast(timeString + `전`);
        }
      };

      updateLastRecord("분유", setLastMilk);
    }
  };

  return (
    <Card className="flex-1 bg-zinc-50 border-0 shadow-none">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-1">
            <Milk />
            분유
          </div>
        </CardTitle>
        <CardDescription>몇 시간 전에</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{lastMilk}</div>
      </CardContent>
    </Card>
  );
};

const LastPee = ({ list }: { list: BabyRecord[] }) => {
  const [lastPee, setLastPee] = useState("");

  useEffect(() => {
    calculateTime();
    const interval = setInterval(calculateTime, 60000); // 1분 = 60000밀리초

    return () => clearInterval(interval);
  }, [list]);

  const calculateTime = () => {
    if (Array.isArray(list)) {
      const updateLastRecord = (
        type: string,
        setLast: (value: string) => void
      ) => {
        const record = list.find((record) => record.type === type);
        if (record) {
          const diff = dayjs().diff(dayjs(record.date), "minute");
          const hours = Math.floor(diff / 60);
          const minutes = diff % 60;
          let timeString = "";
          if (hours > 0) {
            timeString += `${hours}시간 `;
          }
          timeString += `${minutes}분 `;

          setLast(timeString + `전`);
        }
      };

      updateLastRecord("소변", setLastPee);
    }
  };

  return (
    <Card className="flex-1 bg-zinc-50 border-0 shadow-none">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-1">
            <Droplets />
            소변
          </div>
        </CardTitle>
        <CardDescription>몇 시간 전에</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{lastPee}</div>
      </CardContent>
    </Card>
  );
};

const LastPoop = ({ list }: { list: BabyRecord[] }) => {
  const [lastPoop, setLastPoop] = useState("");

  useEffect(() => {
    calculateTime();
    const interval = setInterval(calculateTime, 60000); // 1분 = 60000밀리초

    return () => clearInterval(interval);
  }, [list]);

  const calculateTime = () => {
    if (Array.isArray(list)) {
      const updateLastRecord = (
        type: string,
        setLast: (value: string) => void
      ) => {
        const record = list.find((record) => record.type === type);
        if (record) {
          const diff = dayjs().diff(dayjs(record.date), "minute");
          const hours = Math.floor(diff / 60);
          const minutes = diff % 60;
          let timeString = "";
          if (hours > 0) {
            timeString += `${hours}시간 `;
          }
          timeString += `${minutes}분 `;

          setLast(timeString + `전`);
        }
      };

      updateLastRecord("대변", setLastPoop);
    }
  };

  return (
    <Card className="flex-1 bg-zinc-50 border-0 shadow-none">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-1">
            <Toilet />
            대변
          </div>
        </CardTitle>
        <CardDescription>몇 시간 전에</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{lastPoop}</div>
      </CardContent>
    </Card>
  );
};

const LastSleep = ({ list }: { list: BabyRecord[] }) => {
  const [lastSleep, setLastSleep] = useState("");

  useEffect(() => {
    calculateTime();
    const interval = setInterval(calculateTime, 60000); // 1분 = 60000밀리초

    return () => clearInterval(interval);
  }, [list]);

  const calculateTime = () => {
    if (Array.isArray(list)) {
      const updateLastRecord = (
        type: string,
        setLast: (value: string) => void
      ) => {
        const record = list.find((record) => record.type === type);
        if (record) {
          const diff = dayjs().diff(dayjs(record.date), "minute");
          const hours = Math.floor(diff / 60);
          const minutes = diff % 60;
          let timeString = "";
          if (hours > 0) {
            timeString += `${hours}시간 `;
          }
          timeString += `${minutes}분 `;

          setLast(timeString + `전`);
        }
      };

      updateLastRecord("잠", setLastSleep);
    }
  };

  return (
    <Card className="flex-1 bg-zinc-50 border-0 shadow-none">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-1">
            <Bed />잠
          </div>
        </CardTitle>
        <CardDescription>몇 시간 전에</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{lastSleep}</div>
      </CardContent>
    </Card>
  );
};

const Statistics = ({ list }: { list: BabyRecord[] }) => {
  const [filterList, setFilterList] = useState<BabyRecord[]>([]);
  useEffect(() => {
    if (Array.isArray(list)) {
      const today = dayjs().format("YYYY-MM-DD");
      const filteredList = list.filter((record) => record.date.includes(today));
      setFilterList(filteredList);
    }
  }, [list]);

  const totalRecords = useMemo(() => {
    return filterList.filter((record) => record.type === "분유").length;
  }, [filterList]);

  const totalAmount = useMemo(() => {
    return filterList.reduce((acc, record) => {
      return acc + record.amount;
    }, 0);
  }, [filterList]);

  const averageAmount = useMemo(() => {
    return Math.round(totalAmount / filterList.length);
  }, [totalAmount, filterList]);

  return (
    <Card className="bg-zinc-100 border-0 shadow-none">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-1">
            <Milk />
            오늘 하루 분류량 기록
          </div>
        </CardTitle>
        <CardDescription>지금까지 기록한 분유량의 통계입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">오늘은 분유를 총</Label>
            <Input
              id="name"
              placeholder="Name of your project"
              value={`${totalRecords}회 하였습니다.`}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="framework">양으로는 총</Label>
            <Input
              id="name"
              placeholder="Name of your project"
              value={`${totalAmount}ml을 먹었습니다.`}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="framework">평균</Label>
            <Input
              id="name"
              placeholder="Name of your project"
              value={`${averageAmount}ml을 먹었습니다.`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const List = ({
  list,
  onChange,
}: {
  list: BabyRecord[];
  onChange: () => void;
}) => {
  const [filterList, setFilterList] = useState<BabyRecord[]>([]);
  useEffect(() => {
    if (Array.isArray(list)) {
      const today = dayjs().format("YYYY-MM-DD");
      const filteredList = list.filter((record) => record.date.includes(today));
      setFilterList(filteredList);
    }
  }, [list]);

  if (!Array.isArray(list)) {
    return null;
  }

  return (
    <Card className="mt-0">
      <div className="p-2 flex gap-2">
        히스토리 <RefreshCcw onClick={onChange} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>시간</TableHead>
            <TableHead>종류</TableHead>
            <TableHead>용량</TableHead>
            <TableHead>삭제</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterList.map((baby: BabyRecord) => (
            <TableRow key={baby.date}>
              <TableCell>{dayjs(baby.date).format("hh:mm")}</TableCell>
              <TableCell>{baby.type}</TableCell>
              <TableCell>
                <PowderedMilkRecord baby={baby} onChange={onChange} />
              </TableCell>
              <TableCell>
                <DeleteButton baby={baby} onChange={onChange} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

const DeleteButton = ({
  baby,
  onChange,
}: {
  baby: BabyRecord;
  onChange: () => void;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          del
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>삭제하시겠숩니까?</AlertDialogTitle>
          <AlertDialogDescription>
            이 작업은 되돌릴수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await fetch("/api/history/delete", {
                method: "DELETE",
                body: JSON.stringify({
                  type: baby.type,
                  date: baby.date,
                }),
              });
              onChange();
            }}
          >
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const PowderedMilkRecord = ({
  baby,
  onChange,
}: {
  baby: BabyRecord;
  onChange: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);

  const handleAmount = async (amount: number) => {
    setLoadingAmount(amount);
    await fetch("/api/history/post", {
      method: "POST",
      body: JSON.stringify({
        type: baby.type,
        amount,
        date: baby.date,
      }),
    });
    setLoadingAmount(null);
    setOpen(false);
    onChange();
  };

  if (!["분유", "모유"].includes(baby.type)) return null;

  if (baby.amount === 0) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">기록 필요</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-1">
                <CirclePlus />
                기록 추가
              </div>
            </DialogTitle>
            <DialogDescription>
              <div className="text-left">분유량을 기록하시겠습니까?</div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex flex-col gap-4 w-full">
              <div
                className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
                onClick={() => handleAmount(30)}
              >
                {loadingAmount === 30 ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Milk />
                )}
                30ml
              </div>
              <div
                className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
                onClick={() => handleAmount(60)}
              >
                {loadingAmount === 60 ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Milk />
                )}
                60ml
              </div>
              <div
                className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
                onClick={() => handleAmount(70)}
              >
                {loadingAmount === 70 ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Milk />
                )}
                70ml
              </div>
              <div
                className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
                onClick={() => handleAmount(80)}
              >
                {loadingAmount === 80 ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Milk />
                )}
                80ml
              </div>
              <div
                className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
                onClick={() => handleAmount(90)}
              >
                {loadingAmount === 90 ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Milk />
                )}
                90ml
              </div>
              <div
                className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
                onClick={() => handleAmount(100)}
              >
                {loadingAmount === 100 ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Milk />
                )}
                100ml
              </div>
              <div
                className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
                onClick={() => handleAmount(120)}
              >
                {loadingAmount === 120 ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Milk />
                )}
                120ml
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return baby.amount;
};

const Add = ({ onChange }: { onChange: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loadingType, setLoadingType] = useState<string | null>(null);

  const handleRecord = async (type: string) => {
    setLoadingType(type);
    await fetch("/api/history/post", {
      method: "POST",
      body: JSON.stringify({
        type,
        amount: 0,
        date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      }),
    });
    setLoadingType(null);
    setOpen(false);
    onChange();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <CirclePlus />
          기록 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-1">
              <CirclePlus />
              기록 추가
            </div>
          </DialogTitle>
          <DialogDescription>
            <div className="text-left">시간은 자동으로 기록됩니다.</div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex flex-col gap-4 w-full">
            <div
              className="flex bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
              onClick={() => handleRecord("분유")}
            >
              {loadingType === "분유" ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Milk />
              )}
              분유
            </div>
            <div
              className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
              onClick={() => handleRecord("모유")}
            >
              {loadingType === "모유" ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <User />
              )}
              모유
            </div>
            <div
              className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
              onClick={() => handleRecord("소변")}
            >
              {loadingType === "소변" ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Droplets />
              )}
              소변
            </div>
            <div
              className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
              onClick={() => handleRecord("대변")}
            >
              {loadingType === "대변" ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Toilet />
              )}
              대변
            </div>
            <div
              className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
              onClick={() => handleRecord("잠")}
            >
              {loadingType === "잠" ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Bed />
              )}
              잠
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
