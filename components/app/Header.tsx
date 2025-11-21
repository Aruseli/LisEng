'use client';

import { signOut } from "next-auth/react";
import { IconButton } from "./Buttons/IconButton";
import { SignOut } from "../icons/SignOut";
import { Notifications } from "../icons/Notifications";
import { Settings } from "../icons/Settings";
import { Tooltip } from "./Tooltip";

interface HeaderProps {
  userName: string;
  streak: number;
}

export function Header({ userName, streak }: HeaderProps) {
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Привет, {userName}!</h1>
          <p className="text-sm text-gray-500">
            Продолжаем путь по методике Кумон — шаг за шагом к уверенности в английском.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Tooltip message="Настройки уведомлений">
            <IconButton icon={<Settings className="size-10" />} ariaLabel="Настройки уведомлений" onClick={() => {}} variant="ghost" />
          </Tooltip>
          <Tooltip message="Уведомления">
            <IconButton icon={<Notifications className="size-10" />} ariaLabel="Уведомления" onClick={() => {}} variant="ghost" />
          </Tooltip>
          <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-center">
            <p className="text-xs uppercase tracking-wide text-primary">Стрик</p>
            <p className="text-lg font-semibold text-primary-deep">{streak} дней</p>
          </div>
          <Tooltip message="Выйти">
            <IconButton icon={<SignOut className="size-10" />} ariaLabel="Выйти" onClick={handleLogout} variant="ghost" />
          </Tooltip>
        </div>
      </div>
    </header>
  );
}


