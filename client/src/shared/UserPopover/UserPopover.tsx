
"use client";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { logout } from "@/services/auth";
import Image from "next/image";
import Link from "next/link";
import { RiProfileLine } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";
import { toast } from "react-toastify";


const UserPopover = () => {
  const [open, setOpen] = useState(false);
  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Logout successful");
      setOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Image
          src="/assets/loader/userScleton.webp"
          alt="User"
          width={20}
          height={20}
          className="w-6 h-6 rounded-full cursor-pointer"
        />
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-[#fff]">
        <div className="flex flex-col gap-2">
          <Link href="/dashboard/profile" onClick={() => setOpen(false)}>
            <p className="flex items-center gap-2 cursor-pointer hover:text-[#1F4095] duration-300">
              <RiProfileLine />
              <span>User Profile</span>
            </p>
          </Link>
          <p
            onClick={handleLogout}
            className="flex items-center gap-2 cursor-pointer hover:text-[#1F4095] duration-300"
          >
            <TbLogout />
            <span>Log out</span>
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserPopover;
