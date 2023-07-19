import { useState } from "react";
import axios from "axios";
import "./App.css";
import Check from "./assets/check.svg";
import Cross from "./assets/cross.svg";

function App() {
  const [movie, setMovie] = useState("cool runnings");
  const [notFound, setNotFound] = useState(false);
  const [isSteveIn, setIsSteveIn] = useState();
  const [poster, setPoster] = useState("");
  const search = async (movie) => {
    setNotFound(false);
    const res = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${movie}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
      }
    );

    if (res.data.results.length === 0) {
      setNotFound(true);
      return false;
    }

    const id = res.data.results?.[0]?.id;
    if (!id) {
      setNotFound(true);
      return false;
    }
    setPoster(res.data.results?.[0]?.poster_path);
    if (id) {
      const otherRes = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/credits`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          },
        }
      );
      const cast = otherRes.data?.cast;
      if (!cast) {
        setNotFound(true);
        return false;
      }
      const isSteveIn = cast.some((actor) =>
        actor.name.toLowerCase().includes("steve buscemi")
      );
      setIsSteveIn(isSteveIn);
    }
  };

  console.log({ isSteveIn, notFound, movie });
  return (
    <>
      <h1>Was Steve Buschemi in it?</h1>
      <div className="card">
        <div className="flex items-center justify-centerw-full mt-4">
          <input
            autoFocus
            type="text"
            className="w-full rounded-l-lg h-12 px-2"
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
          />
          <button
            className="bg-owl-orange rounded-r-lg h-12 "
            onClick={() => search(movie)}
          >
            Check
          </button>
        </div>
        {notFound && (
          <div className="text-center text-2xl text-red-500  flex justify-center items-center mt-4">
            <img src={Cross} alt="cross" className="w-6 mr-2" /> Movie not found
          </div>
        )}
        {isSteveIn && (
          <div className="text-center text-2xl text-green-500  flex justify-center items-center mt-4">
            <img src={Check} alt="check" className="w-6 mr-2" /> Steve Buschemi
            was in it!
          </div>
        )}
        {isSteveIn === false && notFound === false && (
          <div className="text-center text-2xl text-red-500 flex justify-center items-center mt-4">
            <img src={Cross} alt="cross" className="w-6 mr-2" /> Steve Buschemi
            was not in it
          </div>
        )}
        {poster && (
          <div className="flex justify-center items-center mt-4">
            <img
              src={`https://image.tmdb.org/t/p/w500${poster}`}
              alt="poster"
              className="w-1/2"
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
