"use client";
import React from "react";
import { Fugaz_One } from "next/font/google";
import Calendar from "./LandingPage/Calendar";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

export default function Dashboard() {
  const [currentUser, userDataObj, setUserDataObj] = useAuth();
  const [data, setData] = useState({});

  function countValue() {}

  async function handleSetMood(mood) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    try {
      const newData = { ...userDataObj };
      if (!newData?.[year]) {
        newData[year] = {};
      }

      if (!newData?.[year]?.[month]) {
        newData[year][month] = {};
      }
      newData[year][month][day] = mood;
      //Update the current state
      setData(newData);
      //Update the globaal state
      setUserDataObj(newData);
      //Update firebase
      const docRef = doc(db, "users", currentUser.uid);
      const res = await setDoc(
        docRef,
        {
          [year]: {
            [month]: {
              [day]: mood,
            },
          },
        },
        { merge: true }
      );
    } catch (error) {
      console.log("failed to set data: ", error);
    }
  }

  const statuses = {
    num_days: 14,
    time_remaining: "13:14:15",
    date: new Date().toDateString(),
  };

  const moods = {
    Happy: "😀",
    Sad: "😞",
    Angry: "😡",
    Excited: "😍",
    Lonely: "😭",
  };

  useEffect(() => {
    if (!currentUser || !userDataObj) {
      return;
    }
    setData(userDataObj);
  }, [currentUser, userDataObj]);

  return (
    <div className="flex flex-col flex-1 gap-8 sm:gap-10 md:gap-16">
      <div className="grid grid-cols-3 bg-indigo-50 text-indigo-500 p-4 gap-4 rounded-lg">
        {Object.keys(statuses).map((status, statusIndex) => {
          return (
            <div key={statusIndex} className=" flex flex-col gap-1 sm:gap-2">
              <p className="font-medium uppercase text-xs sm:text-sm truncate">
                {status.replaceAll("_", " ")}
              </p>
              <p className={`text-base sm:text-lg truncate ${fugaz.className}`}>
                {statuses[status]}
              </p>
            </div>
          );
        })}
      </div>
      <h4
        className={`text-5xl sm:text-6xl md:text-7xl text-center ${fugaz.className}`}
      >
        How do you <span className="textGradient">feel</span> today?
      </h4>
      <div className="flex items-stretch flex-wrap gap-4">
        {Object.keys(moods).map((mood, moodIndex) => {
          return (
            <button
              onClick={() => {
                const currentMoodValue = moodIndex + 1;
                handleSetMood(currentMoodValue);
              }}
              className={`flex flex-col gap-2 items-center p-4 px-5 rounded-2xl purpleShadow duration-200 bg-indigo-50 hover:bg-indigo-100 text-center flex-1`}
              key={moodIndex}
            >
              <p className="text-4xl sm:text-5xl md:text-6xl">{moods[mood]}</p>
              <p
                className={`text-indigo-500 text-xs sm:text-sm md:text-base ${fugaz.className}`}
              >
                {mood}
              </p>
            </button>
          );
        })}
      </div>
      <Calendar data={data} handleSetMood={handleSetMood} />
    </div>
  );
}
