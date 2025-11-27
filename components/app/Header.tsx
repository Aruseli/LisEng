'use client';

import { signOut } from "next-auth/react";
import { IconButton } from "./Buttons/IconButton";
import { SignOut } from "../icons/SignOut";
import { Notifications } from "../icons/Notifications";
import { Settings } from "../icons/Settings";
import { MenuBurger } from "../icons/MenuBurger";
import { Tooltip } from "./Tooltip";
import { Popover } from "./ui/Popover/Popover";
import { Button } from "./Buttons/Button";
import { usePopoverStore } from "@/store/popoverStore";

interface HeaderProps {
  userName: string;
  streak: number;
}

export const Header = ({ userName, streak }: HeaderProps) => {
  const { togglePopover, closePopover } = usePopoverStore();
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleSettingsClick = () => {
    closePopover('header-menu');
    // TODO: Добавить обработчик настроек
  };

  const handleNotificationsClick = () => {
    closePopover('header-menu');
    // TODO: Добавить обработчик уведомлений
  };

  const handleLogoutClick = () => {
    closePopover('header-menu');
    handleLogout();
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Привет, {userName}!</h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Продолжаем путь по методике Кумон — шаг за шагом к уверенности в английском.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Десктопная версия - показываем на sm и выше */}
          <div className="hidden sm:flex items-center space-x-2">
            <Tooltip message="Настройки уведомлений">
              <IconButton icon={<Settings className="size-10" />} ariaLabel="Настройки уведомлений" onClick={() => {}} variant="ghost" />
            </Tooltip>
            <Tooltip message="Уведомления">
              <IconButton icon={<Notifications className="size-10" />} ariaLabel="Уведомления" onClick={() => {}} variant="ghost" />
            </Tooltip>
            <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-center">
              <p className="text-xs uppercase tracking-wide text-primary">Стрик</p>
              <p className="text-md font-semibold text-primary-deep">{streak} дней</p>
            </div>
            <Tooltip message="Выйти">
              <IconButton icon={<SignOut className="size-10" />} ariaLabel="Выйти" onClick={handleLogout} variant="ghost" />
            </Tooltip>
          </div>

          {/* Мобильная версия - показываем только на маленьких экранах */}
          <div className="flex sm:hidden items-center space-x-3">
            <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-center">
              <p className="text-xs uppercase tracking-wide text-primary">Стрик</p>
              <p className="text-sm font-semibold text-primary-deep">{streak} дней</p>
            </div>
            <Popover
              id="header-menu"
              content={
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-[200px]">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    leftIcon={<Settings className="size-5" />}
                    onClick={handleSettingsClick}
                  >
                    Настройки уведомлений
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    leftIcon={<Notifications className="size-5" />}
                    onClick={handleNotificationsClick}
                  >
                    Уведомления
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    leftIcon={<SignOut className="size-5" />}
                    onClick={handleLogoutClick}
                  >
                    Выйти
                  </Button>
                </div>
              }
              position="down"
              contentClassName="bg-white"
            >
              <IconButton icon={<MenuBurger className="size-14" />} ariaLabel="Меню" className="size-14" onClick={() => togglePopover('header-menu')} variant="ghost" />
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
}


