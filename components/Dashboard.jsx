"use client";
import React from "react";
import { Fugaz_One } from "next/font/google";
import Calendar from "./LandingPage/Calendar";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Login from "@/components/Login";
import Loading from "@/components/Loading";

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

export default function Dashboard() {
    // Extracting necessary state and functions from the useAuth hook
    const { currentUser, userDataObj, setUserDataObj, loading } = useAuth();
    // Initializing state for data and setting the current date
    const [data, setData] = useState({});
    const now = new Date();

    // Function to count the total number of days and the average mood
    function countValue() {
      let total_number_of_days = 0;
      let sum_moods = 0;
      // Iterating through the data to calculate the total number of days and sum of moods
      for (let year in data) {
        for (let month in data[year]) {
          for (let day in data[year][month]) {
            let days_mood = data[year][month][day];
            total_number_of_days++;
            sum_moods += days_mood;
          }
        }
      }
      // Returning the total number of days and the average mood
      return { num_days: total_number_of_days, average_mood: sum_moods / total_number_of_days };
    }

    // Object to hold various statuses including the countValue and time remaining
    const statuses = {
      ...countValue(),
      time_remaining: `${now.getHours()}H ${now.getMinutes()}`,
    };

    // Async function to handle setting the mood
    async function handleSetMood(mood) {
      // Extracting the current year, month, and day
      const year = now.getFullYear();
      const month = now.getMonth();
      const day = now.getDate();
      try {
        // Creating a new data object with the updated mood
        const newData = { ...userDataObj };
        if (!newData?.[year]) {
          newData[year] = {};
        }

        if (!newData?.[year]?.[month]) {
          newData[year][month] = {};
        }
        newData[year][month][day] = mood;
        // Updating the current state and global state with the new data
        setData(newData);
        setUserDataObj(newData);
        // Updating the Firebase database with the new data
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

    // Object to hold the moods and their corresponding emojis
    const moods = {
      Sad: "😞",
      Lonely: "😭",
      Happy: "😀",
      Cool: "😎",
      Excited: "🤩",
      
      
    };

    // Effect to set the data state when the component mounts or when userDataObj changes
    useEffect(() => {
      if (!currentUser || !userDataObj) {
        return;
      }
      setData(userDataObj);
    }, [currentUser, userDataObj]);

    // Loading state handling
    if (loading) {
      return <Loading />;
    }

    // Redirecting to Login if there is no current user
    if (!currentUser) {
      return <Login />;
    }

  return (
    <div className="flex flex-col flex-1 gap-8 sm:gap-10 md:gap-16">
      <div className="grid grid-cols-3 bg-indigo-50 text-indigo-500 p-4 gap-4 rounded-lg">
        {Object.keys(statuses).map((status, statusIndex) => {
          return (
            <div key={statusIndex} className=" flex flex-col gap-1 sm:gap-2">
              <p className="font-medium capitalized text-xs sm:text-sm truncate">
                {status.replaceAll("_", " ")}
              </p>
              <p className={`text-base sm:text-lg truncate ${fugaz.className}`}>
                {statuses[status]}{status === "num_days" ? " 🔥" : ""}
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
      <Calendar completeData={data} handleSetMood={handleSetMood} />
    </div>
  );
}
