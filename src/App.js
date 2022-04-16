import { useEffect, useState } from "react";
import "./styles.css";
import { add } from "date-fns";

function WeekBox(props) {
  return (
    <div
      className="box"
      // title={`${props.year + 1}y-${props.week + 1}w`}
      title={`${props.start?.toISOString()?.split("T")[0]}: ${(
        +props.year * 52 +
        props.week +
        1
      ).toLocaleString()}w`}
      style={{
        backgroundColor: props.start <= Date.now() ? "#888" : "#eee",
        border: `1px solid ${
          props.isBeyondExpectancy ? "black" : `hsl(0, 0%, ${props.year}%)`
        }`
      }}
    ></div>
  );
}

function YearWeeks(props) {
  const addYearToDob = (dob, year) =>
    String((+props.dob.toISOString().slice(2, 4) + year) % 100).padStart(
      2,
      "0"
    );

  const isBeyondExpectancy = props.expectancy > props.year;
  const isBeyondExpectancyStyle = {
    color: isBeyondExpectancy ? "black" : "#ddd"
  };

  return (
    <div className="YearWeeks">
      <div className="year-number" style={isBeyondExpectancyStyle}>
        {props.year}
      </div>
      {Array(52)
        .fill()
        .map((x, i) => (
          <WeekBox
            key={i}
            year={props.year}
            week={i}
            isBeyondExpectancy={isBeyondExpectancy}
            start={add(props.dob, { years: props.year, weeks: i })}
          />
        ))}
      <div className="year-number" style={isBeyondExpectancyStyle}>
        '{addYearToDob(props.dob, props.year)}
      </div>
    </div>
  );
}

function LifeWeeks(props) {
  const [dob, setDob] = useState(
    () => new Date(localStorage.getItem("dob") || "1986-12-10T00:00:00")
  );
  const handleDobChange = (e) => {
    setDob(new Date(`${e.target.value}T00:00:00`));
  };
  useEffect(() => {
    localStorage.setItem("dob", dob.toISOString());
  }, [dob]);

  const [expectancy, setExpentancy] = useState(
    () => JSON.parse(localStorage.getItem("expectancy")) || 75
  );
  const handleExpentancyChange = (e) => {
    setExpentancy(e.target.value);
  };
  useEffect(() => {
    localStorage.setItem("expectancy", JSON.stringify(expectancy));
  }, [expectancy]);

  const MILIS_TO_DAYS = 1000 * 60 * 60 * 24;
  const getDiff = (start, end) => {
    const days = (start - end) / MILIS_TO_DAYS;
    const weeks = days / 7;
    const years = days / 365; // not exact  (there are 366)
    const months = years * 12;

    return { days, weeks, months, years };
  };

  const d = getDiff(Date.now(), dob);
  const f = (d) => d.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <>
      <form>
        <label>
          Birth:
          <input
            type="date"
            name="dob"
            value={dob?.toISOString()?.split("T")?.[0]}
            onChange={handleDobChange}
          />
        </label>{" "}
        <label>
          Expentancy:
          <input
            type="range"
            min="50"
            max="100"
            value={expectancy}
            name="expectancy"
            onChange={handleExpentancyChange}
          />
          {expectancy} years.
        </label>
        {/* <br /> */}
        {/* <input type="submit" value="Submit" /> */}
      </form>

      {/* https://www.timeanddate.com/date/durationresult.html?m1=12&d1=10&y1=1986&m2=4&d2=11&y2=2022&ti=on */}
      <ul>
        <li>
          Lived: <b>{f((d.years * 100) / expectancy)}</b>%
        </li>
        <li>
          Years: <b>{f(d.years)}</b> / {f(expectancy)}
        </li>
        <li>
          Months: <b>{f(d.months)}</b> / {f(expectancy * 12)}
        </li>
        <li>
          Weeks: <b>{f(d.weeks)} </b> / {f(expectancy * 52)}{" "}
        </li>
        <li>
          Days: <b>{f(d.days)} </b>/ {f(expectancy * 365)}
        </li>
      </ul>

      <div className="LifeWeeks-Container">
        {Array(100)
          .fill()
          .map((x, i) => (
            <YearWeeks key={i} year={i} dob={dob} expectancy={expectancy} />
          ))}
      </div>
    </>
  );
}

export default function App() {
  return (
    <div className="App">
      <h1>Your life in weeks</h1>
      {/* Simplification */}
      {/* <DobInput />  */}
      <LifeWeeks expectancy={90} dob={""} />
      <p>Each box is a week of your life.</p>
      <p>
        Inspired by{" "}
        <a
          href="https://waitbutwhy.com/2014/05/life-weeks.html"
          target="_blank"
          rel="noreferrer"
        >
          waitbutwhy.com/life-weeks
        </a>
      </p>
    </div>
  );
}
