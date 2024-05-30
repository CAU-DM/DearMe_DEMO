import React, { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  format,
} from "date-fns";

function Cells({ currentMonth, selectedDate, onDateClick }) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const [datesImage, setDatesImage] = useState({});
  const [daysWithDiaries, setDaysWithDiaries] = useState([]);

  useEffect(() => {
    const fetchDaysWithDiaries = async (month) => {
      try {
        const response = await fetch(`/get_feeds/mounth/${month}`);
        if (response.ok) {
          const data = await response.json();
          if (data.status === "success") {
            setDaysWithDiaries(data.days);
          }
        }
      } catch (error) {
        console.error("Error fetching days with diaries:", error);
      }
    };

    const month = format(currentMonth, "MM");
    fetchDaysWithDiaries(month);
  }, [currentMonth]);

  useEffect(() => {
    const fetchImage = async (month, day) => {
      try {
        const response = await fetch(`/get_feeds/mounth/${month}/day/${day}`);
        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setDatesImage((prev) => ({ ...prev, [`${month}-${day}`]: imageUrl }));
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    if (daysWithDiaries.length > 0) {
      const month = format(currentMonth, "MM");
      daysWithDiaries.forEach((day) => {
        fetchImage(month, day);
      });
    }
  }, [daysWithDiaries, currentMonth]);

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d");
      const cloneDay = day;
      const formattedCloneDay = format(cloneDay, "yyyy-MM-dd");
      const monthDayKey = format(day, "MM-dd");

      const isDiaryDay = daysWithDiaries.includes(format(day, "d"));

      const dayStyle = {
        backgroundImage: datesImage[monthDayKey]
          ? `url(${datesImage[monthDayKey]})`
          : "none",
        backgroundSize: "cover",
        opacity: datesImage[monthDayKey] ? 0.75 : 1,
        transition: "opacity 0.3s",
        cursor: isDiaryDay ? "pointer" : "default",
      };

      days.push(
        <div
          className={`flex flex-col w-16 h-16 rounded-full ${
            !isSameMonth(day, monthStart)
              ? ""
              : isSameDay(day, selectedDate)
              ? "bg-red-300 hover:bg-slate-300"
              : format(currentMonth, "M") !== format(day, "M")
              ? ""
              : "hover:border-1 hover:bg-slate-300"
          } ${isDiaryDay ? "cursor-pointer" : "cursor-default"}`}
          key={day}
          onClick={
            // 왠지 모르겠는데 1~9일은 클릭이 안 되는 버그가 있음
            format(currentMonth, "M") == format(day, "M") && isDiaryDay
              ? () => onDateClick(format(cloneDay, "yyyy-MM-dd"))
              : undefined
          }
          style={dayStyle}
          onMouseEnter={(e) => {
            if (datesImage[monthDayKey]) {
              e.currentTarget.style.opacity = 1;
            }
          }}
          onMouseLeave={(e) => {
            if (datesImage[monthDayKey]) {
              e.currentTarget.style.opacity = 0.75;
            }
          }}
        >
          <span
            className={
              format(currentMonth, "M") !== format(day, "M")
                ? "flex w-full h-full justify-center items-center text-slate-400"
                : "flex w-full h-full justify-center items-center"
            }
          >
            {formattedDate}
          </span>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div
        className="flex flex-row w-full h-full items-start justify-between gap-1"
        key={day}
      >
        {days}
      </div>
    );
    days = [];
  }
  return (
    <div className="flex flex-col w-full h-full items-center justify-between gap-1">
      {rows}
    </div>
  );
}

export default Cells;
