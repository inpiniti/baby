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
  Videotape,
  CirclePlus,
  Droplets,
  User,
  LoaderCircle,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

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
    const response = await fetch("/api/history");
    const data = await response.json();
    setList(data);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        베이비 로그
      </h1>
      <Profile />
      <LastRecord list={list} />
      <Statistics list={list} />
      <List list={list} />
      <Add onChange={handleChange} />
    </div>
  );
}

const Profile = () => {
  const birthDate = "2024-12-17";

  const daysSinceBirth = useMemo(() => {
    const birth = dayjs(birthDate);
    const now = dayjs();
    const diffDays = now.diff(birth, "day") + 1;
    return `${diffDays}일 되었구요.`;
  }, [birthDate]);

  const weeksSinceBirth = useMemo(() => {
    const birth = new Date(birthDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1;
    return `${diffWeeks}주 되었습니다.`;
  }, [birthDate]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-1">
            <Baby /> 정은찬
          </div>
        </CardTitle>
        <CardDescription>
          영규니와 아름이의 첫째아들래미 귀염둥이입니다. 은혜/사랑할 은에
          도울/나아갈 찬이며, 갑진년 병자월 을묘일 임오시에 태어난 아기입니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">태어난 날짜는</Label>
              <Input
                id="name"
                placeholder="Name of your project"
                value={`${birthDate} 이구요.`}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">태어난지는</Label>
              <Input
                id="name"
                placeholder="Name of your project"
                value={daysSinceBirth}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">주로는</Label>
              <Input
                id="name"
                placeholder="Name of your project"
                value={weeksSinceBirth}
              />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const LastRecord = ({ list }: { list: BabyRecord[] }) => {
  const [lastMilk, setLastMilk] = useState("");
  const [lastPee, setLastPee] = useState("");
  const [lastPoop, setLastPoop] = useState("");

  useEffect(() => {
    if (Array.isArray(list)) {
      const updateLastRecord = (
        type: string,
        setLast: (value: string) => void,
        suffix: string
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
          if (minutes > 0) {
            timeString += `${minutes}분 `;
          }
          setLast(timeString + `전에 ${suffix}`);
        }
      };

      updateLastRecord("분유", setLastMilk, "분유를 먹었습니다.");
      updateLastRecord("소변", setLastPee, "소변을 보았습니다.");
      updateLastRecord("대변", setLastPoop, "대변을 보았습니다.");
    }
  }, [list]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-1">
            <Videotape />
            마지막 기록
          </div>
        </CardTitle>
        <CardDescription>
          몇 시간 전에 분유, 소변, 대변을 보았는지 보여주는 화면입니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">분유</Label>
            <Input
              id="name"
              placeholder="Name of your project"
              value={lastMilk}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="framework">소변</Label>
            <Input
              id="name"
              placeholder="Name of your project"
              value={lastPee}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="framework">대변</Label>
            <Input
              id="name"
              placeholder="Name of your project"
              value={lastPoop}
            />
          </div>
        </div>
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
    return totalAmount / filterList.length;
  }, [totalAmount, filterList]);

  return (
    <Card>
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

const List = ({ list }: { list: BabyRecord[] }) => {
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
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>시간</TableHead>
            <TableHead>종류</TableHead>
            <TableHead>모유량</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterList.map((baby: BabyRecord) => (
            <TableRow key={baby.date}>
              <TableCell>{baby.date}</TableCell>
              <TableCell>{baby.type}</TableCell>
              <TableCell>
                <PowderedMilkRecord baby={baby} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

const PowderedMilkRecord = ({ baby }: { baby: BabyRecord }) => {
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
  };

  if (baby.type !== "분유") return null;

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
            <div className="flex flex-col gap-4">
              <div
                className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
                onClick={() => handleAmount(60)}
              >
                {loadingAmount === 60 ? <LoaderCircle /> : <Milk />}
                60ml
              </div>
              <div
                className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
                onClick={() => handleAmount(70)}
              >
                {loadingAmount === 70 ? <LoaderCircle /> : <Milk />}
                70ml
              </div>
              <div
                className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
                onClick={() => handleAmount(80)}
              >
                {loadingAmount === 80 ? <LoaderCircle /> : <Milk />}
                80ml
              </div>
              <div
                className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
                onClick={() => handleAmount(90)}
              >
                {loadingAmount === 90 ? <LoaderCircle /> : <Milk />}
                90ml
              </div>
              <div
                className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
                onClick={() => handleAmount(100)}
              >
                {loadingAmount === 100 ? <LoaderCircle /> : <Milk />}
                100ml
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
              {loadingType === "분유" ? <LoaderCircle /> : <Milk />}
              분유
            </div>
            <div
              className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
              onClick={() => handleRecord("모유")}
            >
              {loadingType === "모유" ? <LoaderCircle /> : <User />}
              모유
            </div>
            <div
              className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
              onClick={() => handleRecord("소변")}
            >
              {loadingType === "소변" ? <LoaderCircle /> : <Droplets />}
              소변
            </div>
            <div
              className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center"
              onClick={() => handleRecord("대변")}
            >
              {loadingType === "대변" ? <LoaderCircle /> : <Toilet />}
              대변
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
