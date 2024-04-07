import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import moment from "moment/min/moment-with-locales";
import axios from "axios";
import Modal from "react-modal";
import CreateRDV from "../components/agenda/CreateRDV";
import plus from "../assets/plus.png";
import DailyAgenda from "../components/agenda/DailyAgenda";
import WeeklyAgenda from "../components/agenda/WeeklyAgenda";
import MonthlyAgenda from "../components/agenda/MonthlyAgenda";

export default function AgendaPage() {
  moment.locale("fr");
  const { auth } = useOutletContext();
  const [rdv, setRdv] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const navigate = useNavigate();

  const [isDaily, setIsDaily] = useState(true);
  const [isWeekly, setIsWeekly] = useState(false);
  const [isMonthly, setIsMonthly] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  useEffect(() => {
    if (isMounted || isUpdated) {
      if (auth) {
        axios
          .get(`${import.meta.env.VITE_BACKEND_URL}/api/rdv`, {
            headers: {
              Authorization: `Bearer ${auth}`,
            },
          })
          .then((res) => {
            setRdv(res.data);
          });
      } else {
        navigate("/");
      }
      setIsMounted(false);
      setIsUpdated(false);
    }
  }, [isMounted, isUpdated]);

  // je récupère la date, la semaine et le mois en cours
  const today = moment().format("L");
  const week = moment().week();
  const month = moment().format("MMMM");

  rdv.forEach((r) => {
    const day = moment(r.start_rdv).format("dddd");
    const d = moment(r.start_rdv).format("l").split("/")[0];
    Object.assign(r, { day });
    Object.assign(r, { d });
  });

  const dailyRDV = rdv.filter((r) => today === moment(r.start_rdv).format("L"));

  const weeklyRDV = rdv.filter((r) => week === moment(r.start_rdv).week());
  const rdvGroupByDays = Object.groupBy(weeklyRDV, ({ day }) => day);

  const monthlyRDV = rdv.filter(
    (r) => month === moment(r.start_rdv).format("MMMM")
  );
  const rdvGroupByD = Object.groupBy(monthlyRDV, ({ d }) => d);

  const handleDisplay = (e) => {
    const { id } = e.target;
    switch (id) {
      case "day":
        setIsDaily(true);
        setIsWeekly(false);
        setIsMonthly(false);
        break;
      case "week":
        setIsDaily(false);
        setIsWeekly(true);
        setIsMonthly(false);
        break;
      case "month":
        setIsDaily(false);
        setIsWeekly(false);
        setIsMonthly(true);
        break;
      default:
        setIsDaily(true);
        break;
    }
  };

  const buttons = [
    {
      id: 1,
      state: isDaily,
      idName: "day",
      name: "Journée",
    },
    {
      id: 2,
      state: isWeekly,
      idName: "week",
      name: "Semaine",
    },
    {
      id: 3,
      state: isMonthly,
      idName: "month",
      name: "Mois",
    },
  ];

  return (
    <section className="flex flex-col font-lexend gap-2 min-h-screen pb-24">
      <h1 className="text-4xl text-dkGreen dark:text-sand px-4 pb-2">
        Agenda :
      </h1>
      <div className="text-2xl flex flex-row justify-evenly">
        {buttons.map((b) => (
          <button
            key={b.id}
            className={
              b.state
                ? "bg-green text-sand  dark:bg-slate-600 font-bold active:bg-dkGreen shadow px-2 py-1 rounded-md"
                : "bg-sand text-dkGreen dark:text-slate-600 font-bold active:bg-dkGreen shadow px-2 py-1 rounded-md"
            }
            type="button"
            id={b.idName}
            onClick={handleDisplay}
          >
            {b.name}
          </button>
        ))}
      </div>
      {isDaily && (
        <DailyAgenda dailyRDV={dailyRDV} setIsUpdated={setIsUpdated} />
      )}
      {isWeekly && (
        <WeeklyAgenda
          rdvGroupByDays={rdvGroupByDays}
          setIsUpdated={setIsUpdated}
        />
      )}
      {isMonthly && <MonthlyAgenda rdvGroupByD={rdvGroupByD} />}

      <Modal
        isOpen={isModalVisible}
        onRequestClose={closeModal}
        contentLabel="Edit Skin Types"
        overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center"
        className="max-w-md mx-auto"
      >
        <CreateRDV closeModal={closeModal} setIsUpdated={setIsUpdated} />
      </Modal>
      <button
        type="button"
        title="nouveau RDV"
        onClick={openModal}
        className="fixed bottom-3 right-3 bg-green rounded-full w-fit p-1 border-4 border-black dark:bg-sand"
      >
        <img src={plus} alt="plus" width="50px" />
      </button>
    </section>
  );
}
