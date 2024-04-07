import PropTypes from "prop-types";
import moment from "moment/min/moment-with-locales";
import { useRef, useState } from "react";

export default function MonthlyAgenda({ rdvGroupByD }) {
  moment.locale("fr");
  const [isVisible, setIsVisible] = useState(false);
  const [rdvVisible, setRdvVisible] = useState([]);
  const currentMonth = moment().format("MMMM YYYY");
  const firstDayOfMonth = moment().startOf("month").format("d");
  const numberOfDaysInMonth = moment().daysInMonth();
  const currentDay = parseInt(moment().format("D"), 10);

  const arrayOfDay = [];
  moment.weekdays(true).forEach((d) => arrayOfDay.push(d.slice(0, 2)));

  const arrayOfNumberOfDay = [];
  for (let i = 1; i <= numberOfDaysInMonth; i += 1) {
    arrayOfNumberOfDay.push(i);
  }

  const divRef = useRef(null);
  const handleClick = (id) => {
    setIsVisible(true || !isVisible);
    setRdvVisible(rdvGroupByD[id]);
    divRef.current.scrollIntoView();
  };

  return (
    <div className="flex flex-col text-2xl gap-2 font-lexend sm:mx-24 dark:text-sand h-full">
      <h1 className="text-center pt-2 first-letter:capitalize">
        {currentMonth}
      </h1>
      <div className="grid grid-cols-7 text-center pb-2 border-b-green dark:border-b-beige pt-4 border-b-4">
        {arrayOfDay.map((d) => (
          <p className="first-letter:capitalize" key={d}>
            {d}
          </p>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {firstDayOfMonth &&
          arrayOfNumberOfDay.map((e) =>
            Object.keys(rdvGroupByD).includes(`${e}`) ? (
              <div
                className={e === 1 ? `col-start-${firstDayOfMonth}` : null}
                key={e}
              >
                <button type="button" onClick={() => handleClick(e)}>
                  <p
                    className={
                      e === currentDay
                        ? "border-2 rounded-full border-black dark:border-sand px-3 py-0.5 relative"
                        : "px-3 py-0.5 relative"
                    }
                  >
                    {e}
                    <span
                      className={
                        e < currentDay
                          ? "text-[#d7af36] dark:text-sand text-[3rem] absolute -top-6"
                          : "text-dkGreen dark:text-dkGreen text-[5rem] absolute -top-8"
                      }
                    >
                      .
                    </span>
                  </p>
                </button>
              </div>
            ) : (
              <div className={e === 1 ? `col-start-${firstDayOfMonth}` : null}>
                <p
                  className={
                    e === currentDay
                      ? "border-2 border-black dark:border-sand rounded-full px-3 py-0.5 relative"
                      : "px-3 py-.5 relative"
                  }
                  key={e}
                >
                  {e}
                </p>
              </div>
            )
          )}
        <div className="col-span-7 mt-4" ref={divRef}>
          <div className="flex flex-col items-center">
            {isVisible && (
              <h1 className="border-b-2 border-green dark:border-beige px-4 mb-4">
                Rendez-vous du{" "}
                {moment(rdvVisible[0].start_rdv).format("Do MMMM")} :
              </h1>
            )}
            {isVisible &&
              rdvVisible.map((r) => (
                <div className="text-lg" key={r.id}>
                  <h2 className="text-3xl first-letter:capitalize">
                    {r.title}
                  </h2>
                  <p>débute à {moment(r.start_rdv).format("LT")}</p>
                  <p>et termine à {moment(r.end_rdv).format("LT")}</p>
                  {r?.description && (
                    <>
                      <p>Informations :</p>
                      <p>{r.description}</p>
                    </>
                  )}
                  <p className="pt-3">*****</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

MonthlyAgenda.propTypes = {
  rdvGroupByD: PropTypes.shape().isRequired,
};
