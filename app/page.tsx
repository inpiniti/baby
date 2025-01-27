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
  TableFooter,
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
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
import { useEffect, useState } from "react";

type BabyRecord = {
  date: string;
  type: string;
  amount: string;
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
      <AddAmount />
    </div>
  );
}

const Profile = () => {
  const 태어난날짜 = dayjs("2024.12.17");
  const 태어난지 = `${dayjs().diff(태어난날짜, "day")}일 되었구요.`;
  const 주로는 = `${Math.floor(
    dayjs().diff(태어난날짜, "week")
  )}주 아기입니다.`;
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
              <Label htmlFor="name">태어난지는</Label>
              <Input
                id="name"
                placeholder="Name of your project"
                value={태어난지}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">주로는</Label>
              <Input
                id="name"
                placeholder="Name of your project"
                value={주로는}
              />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const LastRecord = ({ list }: { list: BabyRecord[] }) => {
  const [last분유, setLast분유] = useState("");
  const [last소변, setLast소변] = useState("");
  const [last대변, setLast대변] = useState("");

  useEffect(() => {
    if (Array.isArray(list)) {
      const updateLastRecord = (
        type: string,
        setLast: (value: string) => void,
        suffix: string
      ) => {
        const record = list.find((record) => record.type === type);
        if (record) {
          setLast(
            dayjs(record.date)
              .fromNow(true)
              .replace("minutes", "분")
              .replace("minute", "분")
              .replace("hours", "시간")
              .replace("hour", "시간") + ` 전에 ${suffix}`
          );
        }
      };

      updateLastRecord("분유", setLast분유, "분유를 먹었습니다.");
      updateLastRecord("소변", setLast소변, "소변을 보았습니다.");
      updateLastRecord("대변", setLast대변, "대변을 보았습니다.");
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
              value={last분유}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="framework">소변</Label>
            <Input
              id="name"
              placeholder="Name of your project"
              value={last소변}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="framework">대변</Label>
            <Input
              id="name"
              placeholder="Name of your project"
              value={last대변}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Statistics = ({ list }: { list: BabyRecord[] }) => {
  console.log(list);
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
              value="6회 하였습니다."
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="framework">양으로는 총</Label>
            <Input
              id="name"
              placeholder="Name of your project"
              value="400ml을 먹었습니다."
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="framework">평균</Label>
            <Input
              id="name"
              placeholder="Name of your project"
              value="70ml을 먹었습니다."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const List = ({ list }: { list: BabyRecord[] }) => {
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
            <TableHead className="text-right">모유량</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((baby: BabyRecord) => (
            <TableRow key={baby.date}>
              <TableCell className="font-medium">{baby.date}</TableCell>
              <TableCell>{baby.type}</TableCell>
              <TableCell>{baby.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  );
};

const Add = ({ onChange }: { onChange: () => void }) => {
  const [open, setOpen] = useState(false);
  //const [open2, setOpen2] = useState(false);
  const 기록 = (type: string) => {
    fetch("/api/history/post", {
      method: "POST",
      body: JSON.stringify({
        type,
        amount: 0,
        date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      }),
    });
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
            <div className="flex bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center">
              <Milk onClick={() => 기록("분유")} /> 분유
            </div>
            <div className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center">
              <User onClick={() => 기록("모유")} /> 모유
            </div>
            <div className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center">
              <Droplets onClick={() => 기록("소변")} /> 소변
            </div>
            <div className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center">
              <Toilet onClick={() => 기록("대변")} /> 대변
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AddAmount = () => {
  return (
    <Dialog>
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
            <div className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center">
              <Milk /> 60ml
            </div>
            <div className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center">
              <Milk /> 70ml
            </div>
            <div className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center">
              <Milk /> 80ml
            </div>
            <div className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center">
              <Milk /> 90ml
            </div>
            <div className="flex  bg-black text-white px-6 py-6 rounded-lg gap-1 items-center justify-center">
              <Milk /> 100ml
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
