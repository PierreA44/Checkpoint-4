/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import closeButton from "../../assets/bouton-fermer.png";
import cancel from "../../assets/cancel.png";

export default function EditRDV({ closeModal, setIsUpdated, editID }) {
  const { auth } = useOutletContext();
  const [userContacts, setUserContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState([]);
  const [userRDV, setUserRDV] = useState();
  const [deleted, setDeleted] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const fetchData = () => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/rdv/${editID}`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      })
      .then((res) => setUserRDV(res.data));

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      })
      .then((res) => setUserContacts(res.data));
  };

  const arrayContact = [];
  const [isArray, setIsArray] = useState();
  const toto = () => {
    if (userRDV?.contact_rdv !== null) {
      const arrayContactName = userRDV.contact_rdv.split(",");
      const arrayContactID = userRDV.contact_id.split(",");
      for (let i = 0; i < arrayContactName.length; i += 1) {
        arrayContact.push({
          id: Number(arrayContactID[i]),
          name: arrayContactName[i],
        });
      }
      setIsArray(arrayContact);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (deleted) {
      fetchData();
      setDeleted(false);
    }
  }, [deleted]);

  useEffect(() => {
    if (userRDV || deleted) {
      toto();
    }
  }, [userRDV, deleted]);

  console.info(arrayContact);

  if (watch("contacts") && !selectedContact.includes(watch("contacts"))) {
    setSelectedContact([...selectedContact, watch("contacts")]);
  }

  const contactsSimplify = [];
  selectedContact.forEach((c) =>
    contactsSimplify.push(userContacts.find((u) => u.id === Number(c)))
  );

  const deleteContact = async (id) => {
    try {
      await axios
        .delete(`${import.meta.env.VITE_BACKEND_URL}/api/rdv/contact/${id}`, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        })
        .then((res) => {
          toast.success(res.data.message);
          setDeleted(true);
          setIsUpdated(true);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (data) => {
    const newData = { ...data, selectedContact };
    try {
      axios
        .put(`${import.meta.env.VITE_BACKEND_URL}/api/rdv/${editID}`, newData, {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        })
        .then((res) => {
          toast.success(res.data.message);
          setIsUpdated(true);
        })
        .catch((err) => toast.error(err.response.data.message));
      closeModal();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative shadow font-commi flex flex-col items-center gap-2 text-green text-xl bg-sand p-6 rounded-md"
    >
      <h1 className="text-2xl font-lexend">Modifier votre RDV</h1>
      <label htmlFor="title">Titre :</label>
      <input
        type="text"
        name="title"
        placeholder={userRDV?.title}
        className="rounded-md pl-4"
        {...register("title")}
      />
      {errors.title && (
        <p
          role="alert"
          className="bg-red-600 text-beige text-sm px-1 py-0.5 rounded-md"
        >
          {errors.title?.message}
        </p>
      )}
      <label htmlFor="date">Date :</label>
      <input
        type="date"
        name="date"
        className="rounded-md pl-4"
        {...register("date", {
          pattern: {
            value:
              /^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/,
            message:
              "Vous devez renseigner une date dans le bon format, ex: AAAA/MM/JJ",
          },
        })}
      />
      {errors.title && (
        <p
          role="alert"
          className="bg-red-600 text-beige text-sm px-1 py-0.5 rounded-md"
        >
          {errors.title?.message}
        </p>
      )}
      <label htmlFor="start">Heure de début :</label>
      <input type="time" name="start" {...register("start")} />
      {errors.start && (
        <p
          role="alert"
          className="bg-red-600 text-beige text-sm px-1 py-0.5 rounded-md"
        >
          {errors.start?.message}
        </p>
      )}
      <label htmlFor="end">Heure de fin :</label>
      <input type="time" name="end" {...register("end")} />
      {errors.end && (
        <p
          role="alert"
          className="bg-red-600 text-beige text-sm px-1 py-0.5 rounded-md"
        >
          {errors.end?.message}
        </p>
      )}
      <label htmlFor="description">Détails :</label>
      <textarea
        name="description"
        className="rounded-md pl-4"
        placeholder={userRDV?.description}
        cols="20"
        rows="2"
        {...register("description")}
      />
      <label htmlFor="contact">Ajouter / modifier les contacts ?</label>
      {contactsSimplify.map((c) => (
        <p key={c.id}>{c.name}</p>
      ))}
      {userRDV &&
        userRDV.contact_rdv !== null &&
        isArray.map((e) => (
          <div className="flex flex-row gap-2 items-center" key={e.id}>
            <input
              type="text"
              value={e.name}
              className="w-24 px-2 text-center rounded-md"
            />
            <button
              type="button"
              title="supprimer ce contact"
              onClick={() => deleteContact(e.id)}
              className="w-6"
            >
              <img src={cancel} alt="supprimer" />
            </button>
          </div>
        ))}
      <select
        name="contact"
        className="rounded-md pl-4"
        {...register("contacts")}
      >
        <option value="">------</option>
        {userContacts.map((c) => (
          <option value={c.id}>{c.name}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => closeModal()}
        className="absolute -top-4 -right-4 bg-black rounded-full border-4 border-black w-12"
      >
        <img src={closeButton} alt="croix rouge" />
      </button>
      <button
        type="submit"
        className="bg-green text-sand font-bold active:bg-dkGreen shadow px-2 py-1 mt-4 rounded-md"
      >
        Valider
      </button>
    </form>
  );
}

EditRDV.propTypes = {
  closeModal: PropTypes.func.isRequired,
  setIsUpdated: PropTypes.func.isRequired,
  editID: PropTypes.number.isRequired,
};
